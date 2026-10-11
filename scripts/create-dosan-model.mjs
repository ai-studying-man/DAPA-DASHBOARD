import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { writeFile } from 'node:fs/promises';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(value => { this.result=value; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(value => { this.result=`data:${blob.type};base64,${Buffer.from(value).toString('base64')}`; this.onloadend?.(); }); }
};
const mats={hull:new T.MeshStandardMaterial({color:0x262c2e,roughness:.8,metalness:.3}),deck:new T.MeshStandardMaterial({color:0x343b3d,roughness:.9,metalness:.2}),metal:new T.MeshStandardMaterial({color:0x525c5f,roughness:.5,metalness:.7}),black:new T.MeshStandardMaterial({color:0x101719,roughness:.7}),glass:new T.MeshStandardMaterial({color:0x213e40,roughness:.25,metalness:.4})};
const parts=Object.fromEntries(Object.keys(mats).map(k=>[k,[]]));
function add(g,p=[0,0,0],mat='hull',rot=[0,0,0]){g=g.index?g.toNonIndexed():g;g.deleteAttribute('uv');g.applyMatrix4(new T.Matrix4().compose(new T.Vector3(...p),new T.Quaternion().setFromEuler(new T.Euler(...rot)),new T.Vector3(1,1,1)));parts[mat].push(g);}
function box(w,h,d,x,y,z,mat='deck'){add(new T.BoxGeometry(w,h,d),[x,y,z],mat);}
function cyl(r,h,x,y,z,mat='metal',rot=[0,0,0]){add(new T.CylinderGeometry(r,r,h,24),[x,y,z],mat,rot);}
function rod(a,b,r=.05,mat='metal'){const p=new T.Vector3(...a),q=new T.Vector3(...b),d=q.clone().sub(p),g=new T.CylinderGeometry(r,r,d.length(),12);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));add(g,p.add(q).multiplyScalar(.5).toArray(),mat);}
function rings(sections,mat='hull',segments=64){const positions=[],indices=[];for(const [z,rx,ry,cy]of sections)for(let i=0;i<=segments;i++){const a=i*Math.PI*2/segments;positions.push(Math.cos(a)*rx,cy+Math.sin(a)*ry,z);}for(let j=0;j<sections.length-1;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,a+1,b,a+1,b+1,b);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();add(g,[0,0,0],mat);}
const hullSections=[[-41.75,.01,.01,4.8],[-41.2,1.6,1.6,4.8],[-39.5,3.4,3.4,4.8],[-36,4.45,4.5,4.8],[-31,4.8,4.8,4.8],[-22,4.8,4.8,4.8],[-10,4.8,4.8,4.8],[4,4.8,4.8,4.8],[17,4.65,4.65,4.8],[27,4.05,4.05,4.8],[33,3.2,3.2,4.8],[37,2.15,2.15,4.8],[40,1.2,1.2,4.8],[41.75,.48,.48,4.8]];
rings(hullSections);
rings([[-34,.01,.01,9.05],[-31,1.8,.42,9.05],[-27,2.12,.47,9.05],[-5,2.12,.47,9.05],[20,1.7,.38,8.95],[29,.1,.05,8.35]],'deck',40);
const sail=new T.Shape();sail.moveTo(-1.65,-21);sail.bezierCurveTo(-1.75,-23.5,1.75,-23.5,1.65,-21);sail.lineTo(1.65,-12);sail.bezierCurveTo(1.65,-8.5,-1.65,-8.5,-1.65,-12);sail.closePath();
const sg=new T.ExtrudeGeometry(sail,{depth:5.5,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.25,bevelThickness:.25,curveSegments:18});sg.rotateX(Math.PI/2);add(sg,[0,15.2,0]);
for(const side of [-1,1]){box(.06,.5,1.4,side*1.94,13.45,-20,'glass');box(.07,.1,1.6,side*1.98,13.8,-20,'metal');}
cyl(.68,.13,0,15.48,-18,'deck');cyl(.45,.14,0,15.58,-12.6,'deck');
for(const [x,z,h,r]of [[-.52,-19.2,3.3,.11],[.5,-18,4.2,.1],[-.5,-16.1,2.5,.16],[.6,-14.6,3.3,.09],[0,-11.7,2,.21]]){cyl(r,h,x,15.65+h/2,z);cyl(r*1.5,.4,x,15.65+h,z,'black');}
box(.4,.2,.7,.5,19.9,-18,'black');
for(const z of [-30,-26,-7,-3,1,5,9,13,17]){cyl(.45,.05,0,9.55,z,'black');cyl(.36,.07,0,9.59,z,'deck');}
for(const x of [-1.7,1.7])for(let i=0;i<58;i++)box(.055,.045,.45,x,9.34,-29+i*.84,'black');
for(const side of [-1,1]){const g=new T.BoxGeometry(4.5,.24,2.5);add(g,[side*3.9,12.2,-17.3],'hull',[0,side*.09,0]);}
for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const g=new T.BoxGeometry(.28,5.8,4.9);add(g,[Math.sin(angle)*2.45,4.8+Math.cos(angle)*2.45,35.8],'hull',[0,0,-angle]);}
cyl(.5,2.3,0,4.8,42.25,'metal',[Math.PI/2,0,0]);
for(let i=0;i<7;i++){const a=i*Math.PI*2/7;add(new T.BoxGeometry(.22,2.1,.6),[Math.sin(a)*1.05,4.8+Math.cos(a)*1.05,43.1],'metal',[0,.45,a]);}
add(new T.TorusGeometry(2.05,.11,10,64),[0,4.8,43.1],'hull');
for(const x of [-.7,.7]){rod([x,15.55,-19],[x,15.55,-15],.035,'deck');}
const scene=new T.Scene(),root=new T.Group();root.name='Dosan_class_public_reference_exterior';scene.add(root);
for(const [key,gs]of Object.entries(parts))if(gs.length){const mesh=new T.Mesh(mergeGeometries(gs),mats[key]);mesh.name=key;root.add(mesh);}
root.userData={author:'DAPA DASHBOARD original geometry',license:'CC BY 4.0',classification:'Estimated exterior reconstruction from public ROK Ministry of National Defense photograph. Not manufacturer CAD, not a verified individual hull, bridge, interior, underwater stern detail or performance model.',source:'https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png',units:'metres',forward:'-Z',deckEye:[0,17.2,-18.5]};
scene.updateMatrixWorld(true);const floor=new T.Box3().setFromObject(root).min.y;for(const mesh of root.children)mesh.geometry.translate(0,-floor,0);root.userData.deckEye[1]-=floor;scene.updateMatrixWorld(true);
const bounds=new T.Box3().setFromObject(root),metadata={min:bounds.min.toArray(),max:bounds.max.toArray(),size:bounds.getSize(new T.Vector3()).toArray(),deckEye:root.userData.deckEye,units:'metres',forward:'-Z',classification:root.userData.classification};
const result=await new GLTFExporter().parseAsync(scene,{binary:true});await writeFile('public/models/dosan-reference.glb',Buffer.from(result));await writeFile('public/models/dosan-reference-metadata.json',JSON.stringify(metadata,null,2));
const parsed=await new GLTFLoader().parseAsync(result,'');const roundtrip=new T.Box3().setFromObject(parsed.scene);if(!roundtrip.min.equals(bounds.min)||!roundtrip.max.equals(bounds.max))throw Error('GLB roundtrip bounds mismatch');let vertices=0;parsed.scene.traverse(o=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;for(const v of o.geometry.attributes.position.array)if(!Number.isFinite(v))throw Error('Nonfinite vertex');}});console.log(JSON.stringify({...metadata,bytes:result.byteLength,vertices,meshes:root.children.length,roundtrip:'passed'}));
