import fs from 'node:fs';
import {PNG} from 'pngjs';
import assert from 'node:assert/strict';
import {visitorEquipment} from '../../src/visitor-catalog.js';
import {selectGroundEquipment} from '../../src/ground-equipment.js';

const reports=[];
for(const id of ['k2','k9']){
 const file=`public/models/${id}-photo-pbr.glb`,bytes=fs.readFileSync(file);
 assert.equal(bytes.toString('utf8',0,4),'glTF');assert(bytes.length<6500000);
 const gltf=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
 const nodes=new Set(gltf.nodes.map(node=>node.name));
 for(const part of ['Hull','Turret','Gun','RunningGear'])assert(nodes.has(part),`${id}: ${part}`);
 const paint=gltf.materials.find(m=>m.name.includes('Camouflage'));
 assert(paint.pbrMetallicRoughness.baseColorTexture);assert(paint.normalTexture);assert(paint.pbrMetallicRoughness.metallicRoughnessTexture);
 for(const name of ['Rubber','Track steel']){
  const material=gltf.materials.find(m=>m.name.includes(name));
  assert(material.pbrMetallicRoughness.baseColorFactor[0]<.2,`${id}: ${name} must not export white`);
 }
 const painted=gltf.meshes.flatMap(mesh=>mesh.primitives).filter(p=>p.material===gltf.materials.indexOf(paint));
 assert(painted.length);for(const primitive of painted){assert(primitive.attributes.TEXCOORD_0!==undefined)}
 assert.equal(visitorEquipment.find(item=>item.id===id).model,`./models/${id}-photo-pbr.glb`);
 assert.equal(selectGroundEquipment(id).model,`./models/${id}-photo-pbr.glb`);
 assert(fs.existsSync(`artifacts/3d/photo-pbr/${id}.blend`));
 const shadow=PNG.sync.read(fs.readFileSync(`public/models/${id}-contact-shadow.png`));assert.equal(shadow.width,512);let visible=0;for(let i=3;i<shadow.data.length;i+=4)if(shadow.data[i]>10)visible++;assert(visible>10000&&visible<150000,'contact shadow must have a visible, bounded alpha footprint');
 reports.push({id,bytes:bytes.length,normalMaps:gltf.materials.filter(m=>m.normalTexture).length,roughnessMaps:gltf.materials.filter(m=>m.pbrMetallicRoughness.metallicRoughnessTexture).length,legacyPreserved:fs.existsSync(`public/models/${id}-photo-refined.glb`)});
}
assert.equal(visitorEquipment.length,39);const linked=visitorEquipment.filter(item=>item.companies.length);assert.equal(linked.length,25);
for(const item of linked)for(const company of item.companies){assert(company.role);assert.equal(new URL(company.url).protocol,'https:')}
fs.writeFileSync('artifacts/3d/photo-pbr/audit.json',JSON.stringify({reports,companies:linked.length,unknown:39-linked.length},null,2));
console.log('PASS: 2 native PBR GLBs, material channels, dark rubber/steel, hierarchy, viewer+terrain bindings, 25 sourced company links');
