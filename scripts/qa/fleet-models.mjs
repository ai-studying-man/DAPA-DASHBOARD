import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import validator from 'gltf-validator';

const catalog=JSON.parse(await readFile('blender/fleet/catalog.json','utf8'));
const manifest=JSON.parse(await readFile('src/fleet-assets.json','utf8'));
assert.equal(catalog.length,39);assert.equal(manifest.length,39);
assert.deepEqual(manifest.map(x=>x.id).sort(),catalog.map(x=>x.id).sort());
const results=[];
for(const item of manifest){
 const bytes=await readFile('public/'+item.model.replace(/^\.\//,''));
 const report=await validator.validateBytes(new Uint8Array(bytes),{uri:item.model});
 assert.equal(report.issues.numErrors,0,item.id+': '+JSON.stringify(report.issues));
 assert.equal(report.issues.numWarnings,0,item.id+': '+JSON.stringify(report.issues));
 const g=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
 assert.ok(g.images?.length>=1,item.id+' PBR images');
 assert.ok(g.animations.some(a=>a.name==='Turntable'),item.id+' Turntable');
 assert.ok(g.nodes.some(n=>n.name==='ExhibitRoot'),item.id+' ExhibitRoot');
 for(const part of item.parts)assert.ok(g.nodes.some(n=>n.name===part),item.id+': '+part);
 for(const primitive of g.meshes.flatMap(m=>m.primitives))if(g.materials[primitive.material]?.pbrMetallicRoughness?.baseColorTexture)assert.ok(primitive.attributes.TEXCOORD_0!==undefined,item.id+' UV');
 await access(item.blend);await access('public/'+item.modelAttribution.replace(/^\.\//,''));
 assert.equal(item.photorealismVerified,false);
 if(item.source){const before=await readFile('public/'+item.source.replace(/^\.\//,''));assert.equal(createHash('sha256').update(before).digest('hex'),item.sourceSha256,item.id+' preserved source');}
 results.push({id:item.id,bytes:bytes.length,images:g.images.length,clips:g.animations.map(a=>a.name),errors:0,warnings:0});
}
console.log(JSON.stringify({total:results.length,results},null,2));
