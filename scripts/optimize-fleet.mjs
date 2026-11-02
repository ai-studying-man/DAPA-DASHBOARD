import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,weld} from '@gltf-transform/functions';
import validator from 'gltf-validator';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const catalog=JSON.parse(await readFile('blender/fleet/catalog.json','utf8'));
await mkdir('public/models/fleet',{recursive:true});await mkdir('docs/modeling/fleet',{recursive:true});
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS),manifest=[],audit=[];
for(const entry of catalog){
 const base=`artifacts/3d/fleet/${entry.id}`;
 let build={parts:['Hull','Turret','Gun','RunningGear','Markings'],clips:['Turntable','TurretTraverse','BarrelElevation']};
 let rawBytes=0,normalFallbacks=0;
 if(entry.id!=='k2'){
  build=JSON.parse(await readFile(`${base}/build.json`,'utf8'));
  const document=await io.read(`${base}/raw.glb`);rawBytes=(await readFile(`${base}/raw.glb`)).length;
  // A degenerate UV tangent has no meaningful normal-map basis. Only that
  // primitive receives a flat-surface material variant; preserve source files.
  for(const mesh of document.getRoot().listMeshes())for(const primitive of mesh.listPrimitives()){
   const tangent=primitive.getAttribute('TANGENT'),material=primitive.getMaterial();
   if(material?.getNormalTexture()){
    let valid=Boolean(tangent);const vector=[];
    if(tangent)for(let i=0;i<tangent.getCount();i++){tangent.getElement(i,vector);const length=Math.hypot(...vector.slice(0,3));if(!Number.isFinite(length)||Math.abs(length-1)>.001){valid=false;break}}
    if(!valid){const flat=material.clone().setName(material.getName()+' | degenerate-UV flat surface');flat.setNormalTexture(null);primitive.setMaterial(flat);normalFallbacks++;}
   }
   if(tangent&&!primitive.getMaterial()?.getNormalTexture()){primitive.setAttribute('TANGENT',null);if(tangent.listParents().length===1)tangent.dispose()}
  }
  await document.transform(dedup(),weld());
  await io.write('public/'+entry.model.slice(2),document);
  await copyFile(`${base}/render.png`,`docs/modeling/fleet/${entry.id}.png`);
 }
 const bytes=await readFile('public/'+entry.model.slice(2));
 const report=await validator.validateBytes(new Uint8Array(bytes),{uri:entry.model});
 await writeFile(`artifacts/3d/fleet/${entry.id}-validator.json`,JSON.stringify(report,null,2)+'\n');
 assert.equal(report.issues.numErrors,0,entry.id+': '+JSON.stringify(report.issues.messages.filter(m=>m.severity===0).slice(0,6)));
 assert.equal(report.issues.numWarnings,0,entry.id+': '+JSON.stringify(report.issues.messages.filter(m=>m.severity===1).slice(0,6)));
 const g=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
 const modelAttribution=entry.id==='k2'?'./models/k2-pipeline-ATTRIBUTION.md':`./models/fleet/${entry.id}-ATTRIBUTION.md`;
 const row={...entry,parts:build.parts,clips:g.animations.map(a=>a.name),modelAttribution,modelLicense:entry.sourceLicense,bytes:bytes.length,images:g.images?.length||0,normalFallbacks};
 manifest.push(row);
 audit.push({id:entry.id,source:entry.source,sourceSha256:entry.sourceSha256,model:entry.model,sha256:createHash('sha256').update(bytes).digest('hex'),blender:entry.blend,bytes:bytes.length,rawBytes,normalFallbacks,images:row.images,clips:row.clips,errors:0,warnings:0,photorealismVerified:false});
 if(entry.id!=='k2')await writeFile(`public/models/fleet/${entry.id}-ATTRIBUTION.md`,`# ${entry.name} · exterior study\n\nDAPA DASHBOARD. Source: ${entry.source||'Independently authored Blender exterior study'}.\nSource terms: ${entry.sourceLicense}.\nOriginal attribution: ${entry.sourceAttribution||'No third-party model copied; public reference geometry interpretation only'}.\nSource SHA256: ${entry.sourceSha256||'newly authored'}.\n\nPublic reference: ${entry.referenceUrl||entry.sources[0]?.url||'See catalog programme sources'}.\nPhoto credit: ${entry.photoCredit||'No photograph redistributed in this model'}.\n\nModified: packed PBR maps, exterior UVs where untextured, named component pivots, educational NLA clips, glTF-Transform normalization/dedup/weld. ${normalFallbacks} primitives use a documented flat normal fallback where a UV tangent basis is degenerate; geometry and color maps retained.\n\nNot manufacturer CAD, photogrammetry, verified dimensions, classified interiors or operational performance. ${entry.family==='satellite'?'Satellite is a public programme concept, not a verified individual flight configuration.':''} ${entry.identityReview?'Original user identity label is unverified and deliberately preserved.':''} ${entry.foreign?'Foreign comparison equipment, not Korean-developed equipment.':''}\n\nBlender source: ${entry.blend}. Generator: blender/fleet/build.py.\n`, 'utf8');
 console.log(`${entry.id}: ${row.images} images, ${row.clips.length} clips, ${bytes.length} bytes, 0 errors/warnings`);
}
await writeFile('src/fleet-assets.json',JSON.stringify(manifest,null,2)+'\n');
await writeFile('docs/FLEET-ASSET-STATUS.json',JSON.stringify({count:manifest.length,records:audit},null,2)+'\n');
