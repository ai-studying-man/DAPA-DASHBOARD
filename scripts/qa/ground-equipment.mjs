import assert from 'node:assert/strict';
import {selectGroundEquipment} from '../../src/ground-equipment.js';
// Given an unrecognized URL id, when selecting equipment, then use K2 safely.
assert.equal(selectGroundEquipment('constructor').name,'K2 흑표');
assert.equal(selectGroundEquipment(null).name,'K2 흑표');
// Given K9, when selecting equipment, then keep its own scale and eye position.
assert.match(selectGroundEquipment('k9').model,/k9-photo-refined\.glb$/);
assert.ok(selectGroundEquipment('k9').hatch[2]>selectGroundEquipment('k2').hatch[2]);
console.log('PASS: equipment selection and per-vehicle observer heights');
