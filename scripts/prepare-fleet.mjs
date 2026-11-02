import {systems,sources} from '../src/data.js';
import {equipmentAssets} from '../src/equipment-assets.js';
import {detailedAssets} from '../src/detailed-assets.js';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const mvp=JSON.parse(await readFile('src/equipment-mvp.json','utf8'));
const helis=new Set(['500md','ah1s','ah64e','surion','uh60p','lah']);
const ships=new Set(['dosan','chungnam','hansando']);
const spacecraft=new Set(['425','smallsat','anasis']);
const records=[];
for(const entry of [...systems,...mvp.filter(m=>!systems.some(s=>s.id===m.id))]){
 const id=entry.id,old=equipmentAssets[id]||{},m=mvp.find(x=>x.id===id),d=detailedAssets[id]||{};
 const source=id==='k2'?'./models/k2-pipeline.glb':d.model||old.model||m?.model||null;
 const domain=entry.domains?.[0]||(m?.category==='foreign'?'air':m?.category==='identity-review'?'land':m?.category);
 const family=helis.has(id)?'helicopter':spacecraft.has(id)?'satellite':ships.has(id)?'ship':id==='nuri'?'rocket':domain==='air'?'aircraft':id.startsWith('km18')?'mortar':'ground';
 const sourceIds=(entry.sourceIds||[]).map(k=>sources[k]).filter(Boolean);
 const sourceAttribution=id==='k2'?'./models/k2-pipeline-ATTRIBUTION.md':d.modelAttribution||old.modelAttribution||(m?'./models/mvp/README.md':null);
 const sourceLicense=id==='k2'?'CC BY 3.0':d.modelLicense||old.modelLicense||(m?'Project exhibition; external redistribution terms pending':'DAPA DASHBOARD authored exterior study');
 const sha=source?createHash('sha256').update(await readFile('public/'+source.replace(/^\.\//,''))).digest('hex'):null;
 records.push({id,name:entry.name,domain,family,foreign:m?.category==='foreign',identityReview:m?.category==='identity-review'||id==='k332',source,sourceSha256:sha,sourceAttribution,sourceLicense,referencePhoto:d.image||old.referencePhoto||old.image||m?.image||null,referenceKind:d.image||old.referencePhoto||old.image?'public-photo':m?.image?'ai-generated':'pending',referenceUrl:d.photoUrl||old.photoUrl||old.url||sourceIds[0]?.url||null,photoCredit:d.photoCredit||old.photoCredit||(old.author?`${old.author} · ${old.license}`:null)||(m?.image?'AI-generated reference; not photography':null),sources:sourceIds,model:id==='k2'?source:`./models/fleet/${id}.glb`,blend:id==='k2'?'blender/k2/source.blend':`blender/fleet/models/${id}.blend`,photorealismVerified:false,stage:source?'existing-exterior-enhancement':'authored-exterior-study'});
}
await mkdir('blender/fleet',{recursive:true});
await writeFile('blender/fleet/catalog.json',JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({total:records.length,reused:records.filter(r=>r.source).length,new:records.filter(r=>!r.source).map(r=>r.id)}));
