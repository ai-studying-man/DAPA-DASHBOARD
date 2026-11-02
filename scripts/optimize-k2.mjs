import {NodeIO} from '@gltf-transform/core';
import {dedup,weld} from '@gltf-transform/functions';
import validator from 'gltf-validator';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const source='artifacts/3d/k2-pipeline/normalized.glb',output='public/models/k2-pipeline.glb';
const raw='artifacts/3d/k2-pipeline/raw.glb';
const io=new NodeIO(),document=await io.read(raw);
const rawReport=await validator.validateBytes(new Uint8Array(await readFile(raw)),{uri:raw});
await writeFile('artifacts/3d/k2-pipeline/blender-export-validator.json',JSON.stringify(rawReport,null,2)+'\n');
// Blender exports tangents even for constant materials. Tiny bevel UV islands
// can produce zero vectors there; remove only tangents with no normal-map consumer.
let removedUnusedTangents=0;
for(const mesh of document.getRoot().listMeshes())for(const primitive of mesh.listPrimitives()){
 const tangent=primitive.getAttribute('TANGENT');
 if(tangent&&!primitive.getMaterial()?.getNormalTexture()){
  primitive.setAttribute('TANGENT',null);removedUnusedTangents++;
  if(tangent.listParents().length===1)tangent.dispose();
 }
}
await io.write(source,document);
const beforeClips=document.getRoot().listAnimations().map(a=>a.getName()).sort();
// No flatten/join/prune: preserve pivot hierarchy and empty semantic groups.
await document.transform(dedup(),weld());
await io.write(output,document);
const results=[];
for(const path of [source,output]){
 const data=await readFile(path),report=await validator.validateBytes(new Uint8Array(data),{uri:path});
 await writeFile(`artifacts/3d/k2-pipeline/${path===source?'raw':'optimized'}-validator.json`,JSON.stringify(report,null,2)+'\n');
 assert.equal(report.issues.numErrors,0,JSON.stringify(report.issues));
 results.push({path,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),errors:report.issues.numErrors,warnings:report.issues.numWarnings});
}
assert.deepEqual((await io.read(output)).getRoot().listAnimations().map(a=>a.getName()).sort(),beforeClips);
assert.ok(results[1].bytes<results[0].bytes,'Optimization must reduce transfer size');
await writeFile('blender/k2/optimization-report.json',JSON.stringify({tool:'glTF-Transform',blenderExport:{path:raw,errors:rawReport.issues.numErrors,removedUnusedTangents},transforms:['remove unused tangents','dedup','weld'],results,savedBytes:results[0].bytes-results[1].bytes,clips:beforeClips,photorealismVerified:false},null,2)+'\n');
console.log(JSON.stringify(results));
