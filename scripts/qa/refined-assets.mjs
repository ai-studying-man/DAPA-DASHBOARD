import fs from 'node:fs';
import assert from 'node:assert/strict';
const results=[];
for(const id of ['k9','dosan','fa50','kaav']){
  // Given a native Blender export, when parsed, then it retains an articulated
  // hierarchy, finite bounds and physically bounded material parameters.
  const data=fs.readFileSync(`public/models/${id}-surface-refinement.glb`);
  assert.equal(data.readUInt32LE(0),0x46546c67);
  const json=JSON.parse(data.subarray(20,20+data.readUInt32LE(12)).toString());
  assert.ok(json.meshes.length>0);
  assert.ok(json.nodes.some(n=>n.children?.length));
  for(const accessor of json.accessors) for(const n of [...(accessor.min||[]),...(accessor.max||[])]) assert.ok(Number.isFinite(n));
  for(const material of json.materials){const p=material.pbrMetallicRoughness;assert.ok(p.roughnessFactor>=0&&p.roughnessFactor<=1);assert.ok(p.metallicFactor>=0&&p.metallicFactor<=1)}
  if(['k9','kaav'].includes(id))assert.ok(json.images?.every(i=>Number.isInteger(i.bufferView)));
  assert.ok(data.length<6*1024*1024);
  results.push({id,bytes:data.length,meshes:json.meshes.length,nodes:json.nodes.length});
}
fs.writeFileSync('artifacts/3d/environment-assets/export-audit.json',JSON.stringify(results,null,2));
console.log('PASS: four Blender GLBs retain hierarchy, finite bounds and bounded PBR materials');
