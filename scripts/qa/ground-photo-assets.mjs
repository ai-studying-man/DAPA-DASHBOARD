import fs from 'node:fs';
import assert from 'node:assert/strict';
import {Box3,Vector3,Matrix4,Quaternion} from 'three';
const reports=[];
for(const [id,width,length] of [['k2',3.6,10.85],['k9',3.4,12.0]]){
 const bytes=fs.readFileSync(`public/models/${id}-photo-refined.glb`);
 const model=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)));
 const bound=new Box3();
 function visit(index,parent){
  const node=model.nodes[index];const local=node.matrix?new Matrix4().fromArray(node.matrix):new Matrix4().compose(new Vector3(...(node.translation||[0,0,0])),new Quaternion(...(node.rotation||[0,0,0,1])),new Vector3(...(node.scale||[1,1,1])));
  const world=new Matrix4().multiplyMatrices(parent,local);
  if(node.mesh!==undefined)for(const primitive of model.meshes[node.mesh].primitives){
   const accessor=model.accessors[primitive.attributes.POSITION];
   bound.union(new Box3(new Vector3(...accessor.min),new Vector3(...accessor.max)).applyMatrix4(world));
  }
  for(const child of node.children||[])visit(child,world);
 }
 for(const root of model.scenes[model.scene||0].nodes)visit(root,new Matrix4());
 const size=bound.getSize(new Vector3());
 // The export must preserve metre units, zero-ground alignment, correct gross
 // width/length targets and distinct roadwheel/component pivots.
 assert.ok(Math.abs(size.x-width)<.12,`${id} width ${size.x}`);
 assert.ok(Math.abs(size.z-length)<.25,`${id} length ${size.z}`);
 assert.ok(Math.abs(bound.min.y)<.002,`${id} ground ${bound.min.y}`);
 assert.equal(model.nodes.filter(n=>/^RoadWheel_/.test(n.name)&&n.children).length,12);
 assert.ok(model.nodes.some(n=>n.name==='Turret'));
 assert.ok(model.nodes.some(n=>n.name==='Gun'));
 assert.ok(bytes.length<5*1024*1024);
 reports.push({id,size:size.toArray(),ground:bound.min.y,bytes:bytes.length,wheelPivots:12});
}
fs.writeFileSync('artifacts/3d/ground-photo-refinement/export-audit.json',JSON.stringify(reports,null,2));
console.log('PASS: K2/K9 metre bounds, ground alignment, 12 wheel pivots and component hierarchy');
