import {readFile,access,writeFile,mkdir} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {systems} from '../src/data.js';
import {equipmentAssets} from '../src/equipment-assets.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const failures=[];
const fail=(id,message)=>failures.push(`${id}: ${message}`);
async function localFile(id,url){
 const path=resolve(root,'public',url);
 if(relative(resolve(root,'public'),path).startsWith('..'))throw Error('Asset outside public');
 await access(path).catch(()=>{fail(id,`Missing ${url}`)});
 return path;
}
function inspect(id,bytes){
 if(bytes.length<20||bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length)throw Error('Invalid GLB header');
 const size=bytes.readUInt32LE(12);
 if(bytes.readUInt32LE(16)!==0x4e4f534a||20+size>bytes.length)throw Error('Invalid GLB JSON chunk');
 const gltf=JSON.parse(bytes.subarray(20,20+size).toString());
 const materials=gltf.materials||[],textures=gltf.textures||[];
 const textureSlots=[];
 for(const [index,m]of materials.entries()){
  const p=m.pbrMetallicRoughness||{};
  for(const [slot,info,encoding]of [
   ['baseColor',p.baseColorTexture,'sRGB'],['emissive',m.emissiveTexture,'sRGB'],
   ['normal',m.normalTexture,'linear'],['metallicRoughness',p.metallicRoughnessTexture,'linear'],['occlusion',m.occlusionTexture,'linear']
  ])if(info){
   const texture=textures[info.index];
   if(!texture)fail(id,`Material ${index}: invalid ${slot} texture`);
   else if(!gltf.images?.[texture.source])fail(id,`Material ${index}: missing ${slot} image`);
   textureSlots.push({material:index,slot,texture:info.index,encoding});
  }
  for(const [name,value]of [['roughnessFactor',p.roughnessFactor],['metallicFactor',p.metallicFactor]])if(value!==undefined&&(!Number.isFinite(value)||value<0||value>1))fail(id,`Material ${index}: ${name} outside [0, 1]`);
  for(const primitive of (gltf.meshes||[]).flatMap(mesh=>mesh.primitives||[]))if(primitive.material===index&&textureSlots.some(slot=>slot.material===index)&&!('TEXCOORD_0' in (primitive.attributes||{})))fail(id,`Textured material ${index} has no primary UVs`);
 }
 // A normal-map bitmap accidentally assigned to baseColor cannot be identified
 // from metadata alone. Pixel inspection and a neutral-light render are required.
 const names=new Set((gltf.nodes||[]).map(node=>node.name));
 if(['k2','k9'].includes(id))for(const name of ['Hull','Turret','Gun','RunningGear','Markings'])if(!names.has(name))fail(id,`Missing articulation group ${name}`);
 return {bytes:bytes.length,materials:materials.length,images:gltf.images?.length||0,textureSlots,
  status:(gltf.images?.length||0)?'textured-reconstruction-needs-visual-review':'untextured-exterior-draft',
  photorealismVerified:false};
}
const records=[];
for(const system of systems){
 const asset=equipmentAssets[system.id];
 const record={id:system.id,name:system.name,model:asset?.model||null,status:'no-local-model',photorealismVerified:false};
 if(asset?.model){
  try{
   const path=await localFile(system.id,asset.model);
   Object.assign(record,inspect(system.id,await readFile(path)));
   if(asset.modelAttribution)await localFile(system.id,asset.modelAttribution);
   else fail(system.id,'Missing model attribution');
   if(asset.studio)for(const key of ['referencePhoto','referenceUrl','photoUrl','photoCredit'])if(!asset[key])fail(system.id,`Missing comparison field ${key}`);
  }catch(error){fail(system.id,error.message)}
 }
 for(const url of [asset?.image,asset?.referencePhoto])if(url?.startsWith('./'))await localFile(system.id,url);
 records.push(record);
}
const report={systemCount:records.length,localModelCount:records.filter(row=>row.model).length,failures,records};
const output=process.argv[2];
if(output){const path=resolve(output);await mkdir(resolve(path,'..'),{recursive:true});await writeFile(path,JSON.stringify(report,null,2)+'\n')}
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
