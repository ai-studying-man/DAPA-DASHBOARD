import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { writeFile } from 'node:fs/promises';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(value => { this.result = value; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(value => { this.result = `data:${blob.type};base64,${Buffer.from(value).toString('base64')}`; this.onloadend?.(); }); }
};
const materials = {
  olive: new T.MeshStandardMaterial({ color: 0x4b5140, roughness: .86, metalness: .22 }),
  light: new T.MeshStandardMaterial({ color: 0x656647, roughness: .89, metalness: .15 }),
  dark: new T.MeshStandardMaterial({ color: 0x30372d, roughness: .91, metalness: .15 }),
  rubber: new T.MeshStandardMaterial({ color: 0x242521, roughness: .95 }),
  steel: new T.MeshStandardMaterial({ color: 0x44463e, roughness: .72, metalness: .55 }),
  glass: new T.MeshStandardMaterial({ color: 0x233a3b, roughness: .23, metalness: .4 }),
  lamp: new T.MeshStandardMaterial({ color: 0xbbbba5, roughness: .3 }),
  red: new T.MeshStandardMaterial({ color: 0x5f2320, roughness: .4 }),
};
const parts = Object.fromEntries(Object.keys(materials).map(key => [key, []]));
function add(geometry, position, material = 'olive', rotation = [0, 0, 0]) {
  const matrix = new T.Matrix4().compose(new T.Vector3(...position), new T.Quaternion().setFromEuler(new T.Euler(...rotation)), new T.Vector3(1, 1, 1));
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  g.deleteAttribute('uv'); g.applyMatrix4(matrix); parts[material].push(g);
}
const box = (w, h, d, x, y, z, mat = 'olive', rotation) => add(new T.BoxGeometry(w, h, d), [x, y, z], mat, rotation);
const cylinder = (radius, length, x, y, z, mat = 'olive', rotation = [0, 0, Math.PI / 2], top = radius) => add(new T.CylinderGeometry(top, radius, length, 24), [x, y, z], mat, rotation);
function rod(a, b, radius = .025, material = 'steel') {
  const start = new T.Vector3(...a), end = new T.Vector3(...b), delta = end.clone().sub(start);
  const g = new T.CylinderGeometry(radius, radius, delta.length(), 10).toNonIndexed(); g.deleteAttribute('uv');
  g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize())); g.translate(...start.add(end).multiplyScalar(.5).toArray()); parts[material].push(g);
}
function hull(sections, material = 'olive') {
  const positions = [];
  const corners = sections.map(([z, bottom, top, halfBottom, halfTop]) => [[-halfBottom,bottom,z],[halfBottom,bottom,z],[halfTop,top,z],[-halfTop,top,z]]);
  const tri = (a,b,c) => positions.push(...a,...c,...b);
  for(let k=0;k<corners.length-1;k++) for(let j=0;j<4;j++) { const n=(j+1)%4; tri(corners[k][j],corners[k+1][j],corners[k+1][n]);tri(corners[k][j],corners[k+1][n],corners[k][n]); }
  for(const [k,reverse] of [[0,false],[corners.length-1,true]]) {const p=corners[k];if(reverse){tri(p[0],p[2],p[1]);tri(p[0],p[3],p[2]);}else{tri(p[0],p[1],p[2]);tri(p[0],p[2],p[3]);}}
  const geometry = new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();add(geometry,[0,0,0],material);
}
hull([[-3.95,.85,1.45,1.05,1.35],[-2.7,.62,2.23,1.13,1.42],[2.93,.62,2.23,1.13,1.42],[3.7,.8,2.12,1.12,1.38]]);
box(2.68,.12,5.36,0,2.23,.15);
box(2.67,.66,.08,0,1.75,-3.94,'dark',[-.47,0,0]);
for(const x of [-1.08,1.08]){rod([x,1.48,-3.7],[x,1.85,-3.25],.045);cylinder(.06,.18,x,1.76,-3.75,'steel');}
for(const side of [-1,1]) {
  const x=side*1.4;
  for(let i=0;i<6;i++) {
    const z=-2.32+i*.91;
    cylinder(.415,.26,x,.66,z,'rubber');cylinder(.33,.29,x,.66,z,'olive');cylinder(.13,.32,x,.66,z,'steel');
    for(let j=0;j<8;j++){const a=j*Math.PI/4;cylinder(.025,.335,x,.66+Math.cos(a)*.23,z+Math.sin(a)*.23,'dark');}
    rod([side*1.11,.91,z-.19],[x,.66,z],.06,'steel');
  }
  for(const z of [-3.17,3.17]){cylinder(.45,.29,x,.84,z,'steel');cylinder(.27,.32,x,.84,z,'olive');for(let j=0;j<12;j++){const a=j*Math.PI/6;box(.32,.07,.1,x,.84+Math.cos(a)*.42,z+Math.sin(a)*.42,'steel',[a,0,0]);}}
  const outline=[];
  for(let i=0;i<=36;i++)outline.push([-.0+.26,-3.17+i*6.34/36,0]);
  for(let i=1;i<=14;i++){const a=Math.PI-i*Math.PI/14;outline.push([.84+Math.cos(a)*.57,3.17+Math.sin(a)*.57,a]);}
  for(let i=1;i<=36;i++)outline.push([1.41,3.17-i*6.34/36,Math.PI]);
  for(let i=1;i<14;i++){const a=-i*Math.PI/14;outline.push([.84+Math.cos(a)*.57,-3.17+Math.sin(a)*.57,a]);}
  for(const [y,z,angle]of outline){box(.47,.095,.16,x,y,z,'rubber',[angle,0,0]);box(.48,.04,.035,x,y+.058*Math.cos(angle),z+.058*Math.sin(angle),'steel',[angle,0,0]);}
  box(.31,.11,6.9,side*1.46,1.5,0);
  for(let k=0;k<7;k++){box(.075,.13,.87,side*1.51,1.62,-2.6+k*.88,'dark');}
  for(let i=0;i<17;i++){box(.025,.16,.1,side*1.435,2.12,-2.4+i*.34,'steel');}
  rod([side*1.4,2.25,.65],[side*1.4,2.25,3.4]);
  for(const z of [.65,1.7,2.8,3.4])rod([side*1.4,2.25,z],[side*1.4,2.55,z]);
  rod([side*1.4,2.55,.65],[side*1.4,2.55,3.4]);
  box(.07,.32,.18,side*1.32,1.4,3.76,'red');
}
box(2.1,1.32,.09,0,1.39,3.72,'dark');box(1.94,1.2,.1,0,1.39,3.78);
box(.8,.9,.025,-.32,1.48,3.85,'light');
for(const x of [-.83,.83]){box(.075,1.07,.045,x,1.42,3.86,'steel');for(const y of [.93,1.85])cylinder(.052,.18,x,y,3.87,'steel',[0,0,Math.PI/2]);}
rod([-.12,1.43,3.91],[.04,1.43,3.91]);
for(const x of [-1.13,1.13]){cylinder(.2,.16,x,1.08,3.72,'dark',[Math.PI/2,0,0]);for(let i=0;i<4;i++)box(.29,.04,.035,x,1.08+(i-1.5)*.085,3.82,'steel');}
for(let i=0;i<3;i++){box(1.94,.06,.6,0,2.34,.55+i*.75,'light');for(const x of [-.96,.96])box(.025,.04,.54,x,2.39,.55+i*.75,'steel');rod([-.4,2.43,.5+i*.75],[.4,2.43,.5+i*.75],.018);}
box(.77,.08,1.55,-.84,2.36,-1.75,'dark');
for(let i=0;i<15;i++)box(.68,.065,.028,-.84,2.42,-2.46+i*.1,'olive');
cylinder(.38,.1,-.62,2.39,-2.7,'olive',[0,0,0]);cylinder(.33,.035,-.62,2.46,-2.7,'light',[0,0,0]);
for(let i=0;i<5;i++){const a=i*Math.PI*2/5;box(.14,.1,.1,-.62+Math.sin(a)*.32,2.44,-2.7+Math.cos(a)*.32,'glass',[0,a,0]);}
cylinder(.63,.13,.65,2.35,-1.91,'dark',[0,0,0]);
cylinder(.57,.48,.65,2.6,-1.91,'olive',[0,0,0],.43);
cylinder(.41,.075,.65,2.88,-1.89,'light',[0,0,0]);
box(.69,.48,.4,.65,2.79,-2.4,'dark',[-.15,0,0]);
for(const x of [.4,.9]){rod([x,2.71,-2.45],[x,2.77,-3.23],.032,'steel');cylinder(.046,.13,x,2.77,-3.23,'dark',[Math.PI/2,0,0]);}
box(.45,.24,.34,1.05,2.7,-1.9,'dark');
for(const z of [-1.6,-1.95,-2.3])box(.17,.08,.14,.16,2.82,z,'glass');
rod([.45,2.96,-1.72],[.85,2.96,-1.72],.024);
for(const x of [-1.08,1.08]){box(.25,.16,.17,x,1.92,-3.15,'dark');box(.17,.1,.025,x,1.92,-3.25,'lamp');rod([x-.15,1.87,-3.3],[x-.15,2.04,-3.3],.018);rod([x+.15,1.87,-3.3],[x+.15,2.04,-3.3],.018);rod([x-.15,2.04,-3.3],[x+.15,2.04,-3.3],.018);}
for(const z of [2.1,2.85]){cylinder(.09,.15,-1.1,2.39,z,'dark',[0,0,0]);rod([-1.1,2.44,z],[-1.1,3.31,z],.011,'steel');}
box(.25,.21,.7,1.02,2.4,2.85,'light');
for(const x of [-.65,.65])rod([x,2.39,2.9],[x,2.39,3.35],.027);
const scene = new T.Scene(), root = new T.Group();root.name='KAAV_public_photo_exhibit_reconstruction';scene.add(root);
for(const [key,geometries]of Object.entries(parts)){if(!geometries.length)continue;const merged=mergeGeometries(geometries);const mesh=new T.Mesh(merged,materials[key]);mesh.name=key;root.add(mesh);}
root.userData={license:'CC BY-SA 2.0',author:'DAPA DASHBOARD original geometry',source:'Republic of Korea Armed Forces photograph, 2010-07-07',classification:'Estimated public-photo-derived exhibition reconstruction, not manufacturer CAD, not verified interior or RCWS variant',units:'metres',forward:'-Z',hatchEye:[-.62,3.02,-2.7]};
scene.updateMatrixWorld(true);
const floor = new T.Box3().setFromObject(root).min.y;
for(const mesh of root.children) mesh.geometry.translate(0,-floor,0);
root.userData.hatchEye[1] -= floor;
scene.updateMatrixWorld(true);
const bounds=new T.Box3().setFromObject(root), size=bounds.getSize(new T.Vector3());
const result=await new GLTFExporter().parseAsync(scene,{binary:true});
await writeFile('public/models/kaav-reference.glb',Buffer.from(result));
await writeFile('public/models/kaav-reference-metadata.json',JSON.stringify({min:bounds.min.toArray(),max:bounds.max.toArray(),size:size.toArray(),hatchEye:root.userData.hatchEye,units:'metres',forward:'-Z',classification:root.userData.classification},null,2));
console.log(JSON.stringify({bytes:result.byteLength,bounds:bounds.min.toArray(),size:size.toArray(),meshes:root.children.length}));
