import fs from 'node:fs';import assert from 'node:assert/strict';
import {selectGroundEquipment} from '../../src/ground-equipment.js';
const catalog=JSON.parse(fs.readFileSync('docs/modeling/visual-targets/equipment-catalog.json'));
const items=JSON.parse(fs.readFileSync('src/equipment-mvp.json'));
assert.deepEqual(items.map(item=>item.id),catalog.map(item=>item.id));
assert.equal(new Set(items.map(item=>item.id)).size,21);
assert.equal(items.filter(item=>item.image).length,20);
const results=[];
for(const item of items){
 const file=fs.readFileSync('public/'+item.model.slice(2));
 assert.equal(file.readUInt32LE(0),0x46546c67);
 const gltf=JSON.parse(file.subarray(20,20+file.readUInt32LE(12)));
 assert.ok(gltf.meshes.length>0,item.id);
 assert.ok(gltf.nodes.some(node=>node.children?.length),item.id);
 for(const accessor of gltf.accessors)for(const n of [...(accessor.min||[]),...(accessor.max||[])])assert.ok(Number.isFinite(n));
 assert.ok(file.length<5*1024*1024,item.id);
 if(item.image)assert.ok(fs.statSync('public/'+item.image.slice(2)).size>0);
 const terrain=selectGroundEquipment(item.id);
 assert.equal(terrain.id,item.id);
 assert.ok(fs.existsSync('public/'+terrain.model.slice(2)));
 if(item.altitude)assert.equal(terrain.altitude,120);
 results.push({id:item.id,bytes:file.length,meshes:gltf.meshes.length,stage:item.meshStage});
}
fs.writeFileSync('artifacts/3d/equipment-mvp/asset-audit.json',JSON.stringify(results,null,2));
console.log('PASS: ordered 21 models, 20 images, finite geometry, every terrain route');
