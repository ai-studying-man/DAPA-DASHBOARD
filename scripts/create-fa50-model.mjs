import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { writeFile } from 'node:fs/promises';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.();});}readAsDataURL(b){b.arrayBuffer().then(v=>{this.result=`data:${b.type};base64,${Buffer.from(v).toString('base64')}`;this.onloadend?.();});}};
const mats={grey:new T.MeshStandardMaterial({color:0x9b9f9f,roughness:.73,metalness:.25}),light:new T.MeshStandardMaterial({color:0xb0b3b1,roughness:.77,metalness:.2}),dark:new T.MeshStandardMaterial({color:0x434a4b,roughness:.8,metalness:.32}),glass:new T.MeshStandardMaterial({color:0x37515a,roughness:.14,metalness:.5}),rubber:new T.MeshStandardMaterial({color:0x202322,roughness:.94}),steel:new T.MeshStandardMaterial({color:0x929c9d,roughness:.4,metalness:.7}),red:new T.MeshStandardMaterial({color:0x80392f,roughness:.5})};
const buckets=Object.fromEntries(Object.keys(mats).map(k=>[k,[]]));
function add(g,p=[0,0,0],m='grey',r=[0,0,0],s=[1,1,1]){g=g.index?g.toNonIndexed():g;g.deleteAttribute('uv');g.applyMatrix4(new T.Matrix4().compose(new T.Vector3(...p),new T.Quaternion().setFromEuler(new T.Euler(...r)),new T.Vector3(...s)));buckets[m].push(g);}
const box=(w,h,d,p,m='grey',r)=>add(new T.BoxGeometry(w,h,d),p,m,r);
function rod(a,b,r=.025,m='steel'){let av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);let g=new T.CylinderGeometry(r,r,d.length(),12);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));add(g,av.add(bv).multiplyScalar(.5).toArray(),m);}
function rings(sections,m='grey',n=40){const p=[];let rings=sections.map(([z,y,rx,ry])=>Array.from({length:n},(_,i)=>[Math.cos(i*2*Math.PI/n)*rx,y+Math.sin(i*2*Math.PI/n)*ry,z]));for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){let k=(i+1)%n;p.push(...rings[j][i],...rings[j][k],...rings[j+1][i],...rings[j][k],...rings[j+1][k],...rings[j+1][i]);}let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();add(g,[0,0,0],m);}
function plate(points,t,m='grey'){let shape=new T.Shape();shape.moveTo(...points[0]);for(let p of points.slice(1))shape.lineTo(...p);shape.closePath();let g=new T.ExtrudeGeometry(shape,{depth:t,bevelEnabled:false});return g;}
function wing(points,y,t=.09,m='grey'){let g=plate(points,t,m);g.rotateX(Math.PI/2);g.translate(0,y+t/2,0);add(g,[0,0,0],m);}
rings([[-6.565,2.06,.012,.012],[-5.9,2.05,.22,.2],[-4.85,2.06,.42,.38],[-3.5,2.08,.58,.49],[-1.7,2.13,.77,.67],[.5,2.13,.79,.7],[2.8,2.16,.68,.62],[4.7,2.17,.56,.55],[6.2,2.17,.49,.49],[6.565,2.17,.45,.45]]);
rings([[-6.565,2.06,.012,.012],[-5.9,2.05,.221,.201],[-4.85,2.06,.423,.383]],'light');
for(const side of [-1,1]){
 wing([[side*.48,-2.25],[side*1.2,-2.05],[side*4.61,.2],[side*4.61,1.45],[side*1.25,1.5],[side*.55,1.95]],2.13,.12);
 wing([[side*.53,3.7],[side*2.58,4.88],[side*2.75,5.62],[side*.48,5.18]],2.18,.075,'light');
 wing([[side*.45,-3.25],[side*1.18,-2.05],[side*1.43,-.6],[side*.62,.02]],2.46,.065,'light');
 box(.45,.54,1.38,[side*.82,1.9,-1.25],'grey',[0,side*.12,0]);
 box(.36,.45,.045,[side*.83,1.89,-1.95],'dark',[0,side*.1,0]);
 rod([side*.78,2.3,-1.89],[side*1.03,2.27,-1.72],.026,'light');
 for(const x of [2.08,3.1]){box(.13,.34,.75,[side*x,1.92,.76]);rod([side*x,2.19,.2],[side*x,2.19,1.35],.008,'dark');}
 rod([side*1.17,2.215,1.26],[side*4.48,2.215,1.28],.009,'dark');
 rod([side*2.7,2.215,-.96],[side*2.7,2.215,1.32],.009,'dark');
 add(new T.CylinderGeometry(.065,.065,1.4,16),[side*4.655,2.17,.68],'grey',[Math.PI/2,0,0]);
 add(new T.SphereGeometry(.055,12,8),[side*4.655,2.17,-.05],side<0?'red':'glass');
 box(.026,.34,.58,[side*.787,2.16,-.22],'dark');
 for(let j=0;j<5;j++)box(.028,.008,.08,[side*.812,2.48,-2.28+j*.1],'dark');
 box(.03,.18,.44,[side*.785,1.9,-.54],'light');
 rod([side*.67,1.65,1.25],[side*1.04,.53,1.4],.07);
 rod([side*.72,1.36,1.1],[side*1.04,.6,1.4],.038);
 add(new T.CylinderGeometry(.31,.31,.2,24),[side*1.09,.31,1.4],'rubber',[0,0,Math.PI/2]);
 add(new T.CylinderGeometry(.19,.19,.21,24),[side*1.09,.31,1.4],'steel',[0,0,Math.PI/2]);
 for(let j=0;j<8;j++){let a=j*Math.PI/4;add(new T.CylinderGeometry(.021,.021,.23,8),[side*1.09,.31+Math.cos(a)*.13,1.4+Math.sin(a)*.13],'dark',[0,0,Math.PI/2]);}
 box(.44,.045,.94,[side*.84,1.48,1.3],'light',[0,0,side*.5]);
}
let fin=plate([[2.8,2.61],[4.7,4.81],[5.42,4.56],[4.81,2.68]],.115);fin.rotateY(-Math.PI/2);fin.translate(.0575,0,0);add(fin,[0,0,0]);
rod([0,4.55,4.73],[0,4.63,4.79],.025,'light');
rod([0,2.74,4.25],[0,4.4,5.04],.007,'dark');
add(new T.SphereGeometry(1,40,24),[0,2.59,-3.0],'glass',[0,0,0],[.51,.6,1.48]);
for(const z of [-4.08,-2.64,-1.75]){let g=new T.TorusGeometry(.51,.025,8,32,Math.PI);g.scale(1,1.1,1);add(g,[0,2.69,z],'light');}
rod([-.46,2.67,-4.16],[-.48,2.66,-1.61],.024,'light');rod([.46,2.67,-4.16],[.48,2.66,-1.61],.024,'light');
for(const z of [-3.5,-2.35]){box(.3,.35,.33,[0,2.78,z],'dark',[.1,0,0]);box(.3,.06,.37,[0,2.55,z],'dark');}
box(.36,.16,.16,[0,2.69,-4.18],'dark');
rod([0,1.7,-3.65],[0,.47,-3.51],.058);rod([0,1.37,-3.97],[0,.62,-3.51],.034);
add(new T.CylinderGeometry(.235,.235,.16,24),[0,.235,-3.51],'rubber',[0,0,Math.PI/2]);add(new T.CylinderGeometry(.13,.13,.17,24),[0,.235,-3.51],'steel',[0,0,Math.PI/2]);
box(.4,.038,.68,[0,1.43,-3.51],'light',[-.1,0,0]);
add(new T.CylinderGeometry(.447,.447,.32,40,1,true),[0,2.17,6.36],'dark',[Math.PI/2,0,0]);
add(new T.CircleGeometry(.41,40),[0,2.17,6.31],'dark',[0,Math.PI,0]);
for(let j=0;j<20;j++){let a=j*Math.PI/10;rod([Math.cos(a)*.49,2.17+Math.sin(a)*.49,6.15],[Math.cos(a)*.45,2.17+Math.sin(a)*.45,6.55],.018,'steel');}
for(const z of [-4.6,-.8,2.8,4.65])for(let j=0;j<32;j++){let a=j*Math.PI/16;add(new T.SphereGeometry(.009,6,4),[Math.cos(a)*.59,2.13+Math.sin(a)*.52,z],'dark');}
const scene=new T.Scene(),root=new T.Group();root.name='FA50_public_photo_exterior_reconstruction';scene.add(root);
for(const[k,gs]of Object.entries(buckets)){if(!gs.length)continue;let mesh=new T.Mesh(mergeGeometries(gs),mats[k]);mesh.name=k;root.add(mesh);}
root.userData={license:'CC BY 2.0',author:'DAPA DASHBOARD original geometry; photo by ROKAF via KAI',classification:'Public-photo-derived exterior approximation, not manufacturer CAD; cockpit and landing gear are illustrative',units:'metres',forward:'-Z',eye:[0,3.12,-3.35]};
scene.updateMatrixWorld(true);let bounds=new T.Box3().setFromObject(root),floor=bounds.min.y;for(let m of root.children)m.geometry.translate(0,-floor,0);root.userData.eye[1]-=floor;scene.updateMatrixWorld(true);bounds.setFromObject(root);let size=bounds.getSize(new T.Vector3());
const result=await new GLTFExporter().parseAsync(scene,{binary:true});await writeFile('public/models/fa50-reference.glb',Buffer.from(result));await writeFile('public/models/fa50-reference-metadata.json',JSON.stringify({...root.userData,min:bounds.min.toArray(),max:bounds.max.toArray(),size:size.toArray()},null,2));console.log(JSON.stringify({bytes:result.byteLength,size:size.toArray(),eye:root.userData.eye}));
