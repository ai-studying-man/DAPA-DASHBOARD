import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base='docs/modeling/visual-targets/';
const items=JSON.parse(await readFile(base+'equipment-catalog.json','utf8'));
assert.equal(items.length,21);assert.equal(new Set(items.map(i=>i.id)).size,21);
assert.deepEqual(items.filter(i=>i.status==='image-generation-blocked').map(i=>i.id),['km187']);
const images=[];
for(const item of items){if(!item.image)continue;const b=await readFile(base+item.image);assert.equal(b.toString('ascii',1,4),'PNG');images.push({id:item.id,bytes:b.length,width:b.readUInt32BE(16),height:b.readUInt32BE(20),sha256:createHash('sha256').update(b).digest('hex')});}
assert.equal(images.length,20);
const blend=await stat('artifacts/3d/equipment-reference-workbench/equipment-reference-workbench.blend');
const report={catalogCount:21,newImages:19,existingK2Image:1,imageCount:20,blocked:['km187'],blendBytes:blend.size,newPrecisionModels:0,images};
await writeFile('artifacts/3d/equipment-reference-workbench/asset-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({catalog:21,images:20,blocked:1,blendMiB:(blend.size/1024/1024).toFixed(1),newPrecisionModels:0}));
