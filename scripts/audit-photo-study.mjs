import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { equipmentAssets } from '../src/equipment-assets.js';
import { k2PhotoStudy } from '../src/vehicle-models.js';

assert.equal(equipmentAssets.k2.model, './models/k2-exhibit.glb');
assert.equal(k2PhotoStudy.study, true);
const buffer = await readFile(new URL('../public/models/k2-photo-study.glb', import.meta.url));
assert.equal(buffer.toString('ascii', 0, 4), 'glTF');
assert.equal(buffer.readUInt32LE(4), 2);
assert.equal(buffer.readUInt32LE(8), buffer.length);
const gltf = JSON.parse(buffer.toString('utf8', 20, 20 + buffer.readUInt32LE(12)));
assert.equal(gltf.images.length, 1);
assert.ok(gltf.images[0].bufferView >= 0, 'Image must be embedded');
assert.ok(gltf.materials.some(m => m.pbrMetallicRoughness?.baseColorTexture));
for (const mesh of gltf.meshes) {
  for (const primitive of mesh.primitives) {
    assert.ok(primitive.attributes.TEXCOORD_0 >= 0, 'Every primitive needs UV coordinates');
  }
}
for (const name of ['Hull', 'Turret', 'Gun', 'RunningGear', 'Markings']) {
  assert.ok(gltf.nodes.some(node => node.name === name), `Missing ${name}`);
}
await readFile(new URL('../public/models/k2-photo-study-ATTRIBUTION.md', import.meta.url));
console.log(JSON.stringify({ bytes: buffer.length, images: gltf.images.length,
  meshes: gltf.meshes.length, uvPresent: true, defaultUnchanged: true,
  photorealismVerified: false }, null, 2));
