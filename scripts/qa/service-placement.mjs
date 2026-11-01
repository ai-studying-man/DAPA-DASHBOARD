import assert from 'node:assert/strict';
import {exhibitPlacement} from '../../src/service-placement.js';
import {exhibitMotion} from '../../src/exhibit-motion.js';

// Given a 20m tall submarine normalized to a 10m exhibit, when placed,
// then its lower hull is submerged in the coastal water away from the pier.
const sea = exhibitPlacement('navy', 0, 2, -.2);
assert.equal(sea.z, -45);
assert.equal(sea.bottom, -.7);
assert.equal(sea.environment, 'water');
// Given a parked aircraft, when placed, then gear rests above the land surface.
const air = exhibitPlacement('air', 0, 3, null);
assert.equal(air.bottom, .05);
assert.equal(air.environment, 'land');
// Given two ground exhibits, when placed, then each has a separate position.
assert.notEqual(exhibitPlacement('army', 0, 3, null).x,
                exhibitPlacement('army', 1, 3, null).x);
// Given an exhibition loop, when sampled over a full cycle, then aircraft
// remain aloft and the vessel remains in its original water plane.
for(let seconds=0;seconds<50;seconds+=.5){
  assert.equal(exhibitMotion('air',seconds).y,10);
  assert.equal(exhibitMotion('navy',seconds).y,0);
  assert.ok(Math.abs(exhibitMotion('navy',seconds).x)<=12);
}
console.log('PASS: submerged vessel, parked aircraft and ground separation');
