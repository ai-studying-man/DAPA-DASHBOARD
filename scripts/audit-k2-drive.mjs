import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const b=await readFile('public/models/k2-drive-study.glb');
assert.equal(b.toString('ascii',0,4),'glTF');
assert.equal(b.readUInt32LE(8),b.length);
const g=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));
const channels=g.animations.flatMap(a=>a.channels);
assert.equal(g.images.length,1);
assert.equal(channels.filter(c=>c.target.path==='translation').length,1);
assert.equal(channels.filter(c=>c.target.path==='rotation').length,12);
for(const name of ['ExhibitDriveRoot','Hull','Turret','Gun','RunningGear'])assert.ok(g.nodes.some(n=>n.name===name),name);
for(const a of g.animations)for(const s of a.samplers){assert.ok(g.accessors[s.input].max[0]>=8);assert.ok(g.accessors[s.output].count>3)}
await readFile('public/models/k2-drive-study-ATTRIBUTION.md');
console.log(JSON.stringify({bytes:b.length,clips:g.animations.length,channels:channels.length,imageCount:g.images.length,validatedPhysics:false}));
