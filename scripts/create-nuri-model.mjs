import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { writeFile } from 'node:fs/promises';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(value => { this.result=value; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(value => { this.result=`data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;this.onloadend?.(); }); }
};
const materials={
  white:new T.MeshStandardMaterial({color:0xe5e6e0,roughness:.6,metalness:.13}),
  panel:new T.MeshStandardMaterial({color:0xc6c9c3,roughness:.7,metalness:.18}),
  seam:new T.MeshStandardMaterial({color:0x7b817d,roughness:.76,metalness:.25}),
  black:new T.MeshStandardMaterial({color:0x242b2e,roughness:.78,metalness:.2}),
  nozzle:new T.MeshStandardMaterial({color:0x525557,roughness:.63,metalness:.6,side:T.DoubleSide}),
  red:new T.MeshStandardMaterial({color:0xa33137,roughness:.8}),
  blue:new T.MeshStandardMaterial({color:0x2e4279,roughness:.8}),
};
const parts=Object.fromEntries(Object.keys(materials).map(k=>[k,[]]));
function add(g,position=[0,0,0],material='white',rotation=[0,0,0]){
  if(g.index)g=g.toNonIndexed();g.deleteAttribute('uv');
  g.applyMatrix4(new T.Matrix4().compose(new T.Vector3(...position),new T.Quaternion().setFromEuler(new T.Euler(...rotation)),new T.Vector3(1,1,1)));parts[material].push(g);
}
const box=(w,h,d,x,y,z,material='white',rotation)=>add(new T.BoxGeometry(w,h,d),[x,y,z],material,rotation);
function cylinder(bottom,top,y0,y1,material='white',x=0,z=0,open=false){add(new T.CylinderGeometry(top,bottom,y1-y0,64,1,open),[x,(y0+y1)/2,z],material);}
function ring(radius,y,material='seam',thickness=.013){add(new T.TorusGeometry(radius,thickness,8,64),[0,y,0],material,[Math.PI/2,0,0]);}
function sidePanel(angle,y,w,h,radius=1.75,material='panel'){
  box(w,h,.014,Math.sin(angle)*(radius+.012),y,Math.cos(angle)*(radius+.012),material,[0,angle,0]);
}
cylinder(1.75,1.75,1.1,20.6);
cylinder(1.75,1.3,20.6,22.4);
cylinder(1.3,1.3,22.4,33.1);
cylinder(1.3,1.3,33.1,41.3);
const fairingPoints=[[1.3,41.3],[1.3,43.2],[1.25,44.1],[1.12,45],[.9,45.8],[.63,46.45],[.3,46.95],[0,47.2]].map(p=>new T.Vector2(...p));
add(new T.LatheGeometry(fairingPoints,64));
for(const y of [1.12,1.35,4.2,9.4,14.1,18.5,20.6,22.4,26.6,30.2,33.1,36.9,40.3,41.3,43.2])ring(y<20.7?1.75:1.3,y,'seam',y===20.6||y===33.1?.025:.009);
for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
  sidePanel(angle,10.3,.12,17.8,1.75,'panel');
  sidePanel(angle,26.6,.095,8.1,1.3,'panel');
  sidePanel(angle,36.6,.075,6.5,1.3,'panel');
  for(const y of [3.1,4.2,5.7,9.4,14.1,18.5]){
    sidePanel(angle,y,.42,.29,1.75,'panel');
    for(const dx of [-.17,.17])sidePanel(angle+dx/1.75,y+.1,.025,.025,1.77,'black');
  }
  for(const y of [24.2,29.4,34.8,39.4])sidePanel(angle,y,.28,.22,1.3,'panel');
}
for(let i=0;i<20;i++){const angle=i*Math.PI*2/20;sidePanel(angle,2.5,.065,2.65,1.75,'white');}
for(let i=0;i<12;i++){const a=i*Math.PI/6;sidePanel(a,20.36,.085,.38,1.75,'panel');sidePanel(a,32.9,.065,.32,1.3,'panel');}
for(const x of [-.73,.73])for(const z of [-.73,.73]){
  const points=[[.39,1.7],[.31,1.24],[.33,.87],[.43,.54],[.58,.2],[.64,0]].map(p=>new T.Vector2(...p));
  add(new T.LatheGeometry(points,48),[x,0,z],'nozzle');
  cylinder(.3,.25,1.37,2.15,'black',x,z);
  for(let j=0;j<12;j++){const a=j*Math.PI/6;add(new T.CylinderGeometry(.012,.012,.66,6),[x+Math.sin(a)*.4,.97,z+Math.cos(a)*.4],'seam');}
  add(new T.TorusGeometry(.64,.028,8,48),[x,.03,z],'nozzle',[Math.PI/2,0,0]);
}
cylinder(1.69,1.69,1.09,1.2,'panel');
for(const angle of [.7,2.3,3.9,5.5])sidePanel(angle,1.38,.17,.47,1.75,'black');
box(.9,.61,.022,0,37.65,-1.325,'white');
add(new T.CircleGeometry(.2,32,0,Math.PI),[0,37.65,-1.343],'red',[0,Math.PI,0]);
add(new T.CircleGeometry(.2,32,Math.PI,Math.PI),[0,37.65,-1.343],'blue',[0,Math.PI,0]);
for(const [x,y,rotate]of [[-.32,37.84,-.5],[.32,37.84,.5],[-.32,37.46,.5],[.32,37.46,-.5]])for(let i=0;i<3;i++)box(.13,.022,.012,x,y+(i-1)*.05,-1.345,'black',[0,0,rotate]);
const stroke=(x1,y1,x2,y2,z=-1.772,width=.065)=>{
  const dx=x2-x1,dy=y2-y1;box(Math.hypot(dx,dy),width,.012,(x1+x2)/2,(y1+y2)/2,z,'black',[0,0,Math.atan2(dy,dx)]);
};
stroke(-.32,17.1,-.32,16.7);stroke(-.32,16.7,.3,16.7);stroke(-.35,16.42,.35,16.42);stroke(0,16.42,0,15.96);
stroke(-.32,14.35,.18,14.35);stroke(.18,14.35,.18,14.07);stroke(.18,14.07,-.32,14.07);stroke(-.32,14.07,-.32,13.78);stroke(-.32,13.78,.18,13.78);stroke(.37,14.38,.37,13.75);
for(let i=0;i<5;i++)box(.065,.065,.013,0,30.1-i*.21,-1.323,'black');
for(const y of [7.5,12.4,27.5,35.2]){sidePanel(Math.PI,y,.1,.12,y<20?1.75:1.3,'black');}
const scene=new T.Scene(),root=new T.Group();root.name='Nuri_KSLV_II_public_reference_reconstruction';scene.add(root);
for(const [material,geometries]of Object.entries(parts)){if(!geometries.length)continue;const mesh=new T.Mesh(mergeGeometries(geometries),materials[material]);mesh.name=material;root.add(mesh);}
root.userData={author:'DAPA DASHBOARD original geometry',license:'CC BY 4.0',units:'metres',up:'Y',forward:'-Z',uncrewed:true,classification:'Public-source exhibition exterior reconstruction, not manufacturer CAD or engineering simulation',officialLength:47.2,officialMaximumDiameter:3.5,source:'https://www.kari.re.kr/eng/contents/176'};
scene.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(root);const output=await new GLTFExporter().parseAsync(scene,{binary:true});
await writeFile('public/models/nuri-reference.glb',Buffer.from(output));
await writeFile('public/models/nuri-reference-metadata.json',JSON.stringify({...root.userData,min:bounds.min.toArray(),max:bounds.max.toArray(),size:bounds.getSize(new T.Vector3()).toArray()},null,2));
console.log(JSON.stringify({bytes:output.byteLength,meshes:root.children.length,size:bounds.getSize(new T.Vector3()).toArray()}));
