import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import validator from 'gltf-validator';

const path=process.argv[2]||'public/models/k2-pipeline.glb';
const bytes=await readFile(path);
const report=await validator.validateBytes(new Uint8Array(bytes),{uri:path});
assert.equal(report.issues.numErrors,0,JSON.stringify(report.issues));
assert.equal(report.issues.numWarnings,0,JSON.stringify(report.issues));
const gltf=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
const nodes=gltf.nodes;
for(const name of ['Hull','Turret','Gun','RunningGear','Track_L','Track_R','ExhibitRoot'])assert.ok(nodes.some(n=>n.name===name),name);
const turret=nodes.findIndex(n=>n.name==='Turret'),gun=nodes.findIndex(n=>n.name==='Gun');
assert.ok(nodes[turret].children.includes(gun),'Gun must retain its turret pivot');
assert.equal(nodes.filter(n=>n.name?.startsWith('Wheel_')).length,12);
for(const name of ['Turntable','TurretTraverse','BarrelElevation']){
 const clip=gltf.animations.find(a=>a.name===name);assert.ok(clip,name);
 assert.ok(clip.channels.some(c=>c.target.path==='rotation'));
 for(const sampler of clip.samplers){assert.ok(gltf.accessors[sampler.input].max[0]>=4);assert.ok(gltf.accessors[sampler.output].count>2);}
}
assert.ok(gltf.images.length>=3,'Base color, normal and packed material images');
assert.ok(gltf.materials.some(m=>m.normalTexture&&m.pbrMetallicRoughness?.metallicRoughnessTexture));
for(const image of gltf.images)assert.ok(Number.isInteger(image.bufferView),'Embedded image required');
for(const primitive of gltf.meshes.flatMap(m=>m.primitives))assert.ok(Number.isInteger(primitive.attributes.TEXCOORD_0),'UV required');
const baseline=JSON.parse(await readFile('blender/k2/source-hashes.json','utf8'));
for(const [file,hash]of Object.entries(baseline))assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'),hash,`Source changed: ${file}`);
console.log(JSON.stringify({path,bytes:bytes.length,errors:0,warnings:0,images:gltf.images.length,clips:gltf.animations.map(a=>a.name),sourcePreserved:true,photorealismVerified:false}));
