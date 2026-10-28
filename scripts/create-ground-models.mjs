import * as T from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {writeFile} from 'node:fs/promises';
import {vehicleModels} from '../src/vehicle-models.js';

globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(value=>{this.result=value;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(value=>{this.result=`data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;this.onloadend?.()})}};
const palette={armor:0x566149,green:0x414d36,sand:0x82775b,black:0x252b27,steel:0x555b58,rubber:0x202420,glass:0x244650,white:0xd7d7c2};
const materials=Object.fromEntries(Object.entries(palette).map(([key,color])=>[key,new T.MeshStandardMaterial({color,roughness:key==='glass'?.2:.78,metalness:key==='steel'?.5:.12})]));
const cylinder=new T.CylinderGeometry(1,1,1,24),box=new T.BoxGeometry(1,1,1);
function mesh(parent,geometry,material,position,scale,rotation=[0,0,0]){const object=new T.Mesh(geometry,materials[material]);object.position.set(...position);object.scale.set(...scale);object.rotation.set(...rotation);parent.add(object);return object;}
function block(parent,position,size,material='armor',rotation){return mesh(parent,box,material,position,size,rotation);}
function tube(parent,position,radius,length,material='steel',rotation=[Math.PI/2,0,0]){return mesh(parent,cylinder,material,position,[radius,length,radius],rotation);}
function group(parent,name,position=[0,0,0]){const part=new T.Group();part.name=name;part.position.set(...position);parent.add(part);return part;}
function shell(parent,rings,material='armor'){
 const positions=[];for(let i=0;i<rings.length-1;i++){const a=rings[i],b=rings[i+1];for(let j=0;j<a.length;j++){const k=(j+1)%a.length;positions.push(...a[j],...b[j],...a[k],...a[k],...b[j],...b[k]);}}
 for(const [ring,reverse]of [[rings[0],false],[rings.at(-1),true]])for(let j=1;j<ring.length-1;j++)positions.push(...ring[0],...ring[reverse?j+1:j],...ring[reverse?j:j+1]);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.computeVertexNormals();g.computeBoundingBox();
 const colors=[];const shades=[new T.Color(palette.armor),new T.Color(palette.green),new T.Color(palette.sand)];
 for(let i=0;i<positions.length;i+=9){const x=positions[i],y=positions[i+1],z=positions[i+2],v=Math.sin(x*2.3+z*1.6)+Math.cos(z*2.8-y*3.1);const color=shades[v>.6?2:v<-.45?1:0];for(let j=0;j<3;j++)colors.push(color.r,color.g,color.b);}
 g.setAttribute('color',new T.Float32BufferAttribute(colors,3));const m=new T.MeshStandardMaterial({vertexColors:true,roughness:.82,metalness:.12,side:T.DoubleSide});const object=new T.Mesh(g,m);parent.add(object);
}
const hullRing=(z,bottom,top,lower,upper)=>[[-lower,bottom,z],[lower,bottom,z],[upper,top,z],[-upper,top,z]];
function runningGear(root,length,width){
 const gear=group(root,'RunningGear');const half=length/2-.55,r=.52;
 for(const side of [-1,1]){
  const x=side*(width/2-.3),track=group(gear,side<0?'Track_L':'Track_R');
  for(let i=0;i<6;i++){
   const wheel=group(track,`Wheel_${side}_${i}`,[x,.64,-half+.55+i*(length-2.2)/5]);wheel.userData.motionAxis='x';
   tube(wheel,[0,0,0],r,.35,'rubber',[0,0,Math.PI/2]);tube(wheel,[side*.19,0,0],r*.78,.055,'armor',[0,0,Math.PI/2]);tube(wheel,[side*.23,0,0],.13,.07,'steel',[0,0,Math.PI/2]);
   for(let j=0;j<8;j++){const angle=j*Math.PI/4; tube(wheel,[side*.24,Math.sin(angle)*.26,Math.cos(angle)*.26],.035,.055,'black',[0,0,Math.PI/2]);}
  }
  for(const z of [-half-.24,half+.24])tube(track,[x,.83,z],.42,.38,'steel',[0,0,Math.PI/2]);
  // Individual shoes on a closed stadium path. No claimed real track pitch or suspension geometry.
  for(let j=0;j<100;j++){
   const u=j/100,straight=half*2,arc=Math.PI*.55,total=straight*2+arc*2;let d=u*total,y,z,angle;
   if(d<straight){z=-half+d;y=1.38;angle=0;}else if((d-=straight)<arc){const a=d/.55;z=half+Math.sin(a)*.55;y=.83+Math.cos(a)*.55;angle=a;}else if((d-=arc)<straight){z=half-d;y=.28;angle=Math.PI;}else{d-=straight;const a=d/.55;z=-half-Math.sin(a)*.55;y=.83-Math.cos(a)*.55;angle=Math.PI+a;}
   block(track,[x,y,z],[.52,.105,.13],'steel',[angle,0,0]);block(track,[x,y+.02*Math.cos(angle),z],[.32,.12,.085],'rubber',[angle,0,0]);
  }
 }
}
function details(hull,turret,{k9,length,width}){
 for(const side of [-1,1]){
  for(let i=0;i<6;i++){block(hull,[side*(width/2-.03),1.37,-length/2+.5+i*(length-1)/6],[.09,.65,(length-1)/6-.025],i%3?'green':'armor');block(hull,[side*(width/2+.025),1.68,-length/2+.6+i*(length-1)/6],[.04,.055,.1],'steel');}
  for(let i=0;i<14;i++)block(hull,[side*.6,1.87,length/2-1.6+i*.065],[.83,.025,.025],'black');
  block(hull,[side*(width/2-.48),1.63,-length/2+.1],[.28,.2,.22],'black');block(hull,[side*(width/2-.48),1.64,-length/2-.02],[.15,.09,.03],'white');
  for(let i=0;i<3;i++)tube(turret,[side*1.37,.34,-.56+i*.19],.058,.32,'black',[.25,0,side*.8]);
  block(turret,[side*1.05,k9?1.12:.7,.7],[.25,.08,.34],'black');
  tube(turret,[side*.9,k9?1.2:.84,1.25],.018,1.6,'black',[0,0,0]);
 }
 for(const x of [-.65,.65]){tube(turret,[x,k9?1.14:.82,.35],.3,.07,'armor',[0,0,0]);for(let j=0;j<5;j++)block(turret,[x-.22+j*.11,k9?1.2:.88,.5],[.07,.045,.07],'glass');}
 block(turret,[.76,k9?1.3:1.02,-.3],[.33,.3,.32],'green');block(turret,[.76,k9?1.32:1.04,-.47],[.25,.13,.02],'glass');
 for(let i=0;i<7;i++)block(turret,[-.95+i*.3,k9?.7:.35,1.76],[.025,.62,.03],'steel');
 block(turret,[0,k9?.35:.02,1.76],[2.1,.035,.03],'steel');block(turret,[0,k9?1:.66,1.76],[2.1,.035,.03],'steel');
}
function compact(part){
 // Merge only static meshes under the same part/material; pivots remain separate.
 for(const child of [...part.children])if(child.isGroup)compact(child);
 const buckets=new Map();for(const child of [...part.children])if(child.isMesh){child.updateMatrix();let g=child.geometry.clone();g.applyMatrix4(child.matrix);g=g.index?g.toNonIndexed():g;g.deleteAttribute('uv');const bucket=buckets.get(child.material)||[];bucket.push(g);buckets.set(child.material,bucket);part.remove(child);}
 for(const [material,geometries]of buckets){const merged=mergeGeometries(geometries);for(const g of geometries)g.dispose();part.add(new T.Mesh(merged,material));}
}
for(const id of ['k2','k9']){
 const k9=id==='k9',length=k9?7.4:7.5,width=k9?3.4:3.6,root=new T.Group();root.name=id.toUpperCase()+'_Exhibition_Reconstruction';
 const hull=group(root,'Hull');shell(hull,[hullRing(-length/2,.66,1.15,1.25,1.42),hullRing(-length/2+.8,.48,1.78,1.3,1.5),hullRing(length/2-.25,.5,1.8,1.3,1.5),hullRing(length/2,.75,1.5,1.2,1.45)]);
 runningGear(root,length,width);
 const turret=group(root,'Turret',[0,k9?1.89:1.86,k9?.55:.15]);turret.userData.motionAxis='y';
 const ring=(z,y,w)=>[[-w,0,z],[w,0,z],[w*.9,y,z],[-w*.9,y,z]];
 shell(turret,k9?[ring(-1.6,.78,1.06),ring(-.9,1.13,1.38),ring(1.55,1.05,1.36)]:[ring(-1.65,.25,.53),ring(-.7,.77,1.43),ring(1.45,.65,1.38)]);
 if(!k9)for(const side of [-1,1])block(turret,[side*.96,.23,-.95],[.86,.47,1.2],'green',[0,side*.32,0]);
 const gun=group(turret,'Gun',[0,k9?.55:.28,k9?-1.35:-1.45]);gun.userData.motionAxis='x';
 block(gun,[0,0,-.06],[k9?.66:.72,.53,.75]);tube(gun,[0,0,k9?-3.55:-2.8],k9?.105:.085,k9?7.3:5.6,'armor');tube(gun,[0,0,-1.7],.17,.5,'green');
 if(k9){block(gun,[0,0,-7.22],[.31,.32,.56],'steel');for(const side of [-1,1])for(let i=0;i<2;i++)block(gun,[side*.16,0,-7.06-i*.19],[.015,.16,.1],'black');}else{tube(gun,[0,0,-5.7],.105,.28,'steel');tube(gun,[0,0,-5.85],.075,.025,'black');}
 details(hull,turret,{k9,length,width});
 const markings=group(root,'Markings');for(const side of [-1,1])for(let i=0;i<3;i++)block(markings,[side*(width/2+.03),1.32,-.1+i*.16],[.012,.12,.08],'white');
 compact(root);root.position.y-=new T.Box3().setFromObject(root).min.y;root.updateMatrixWorld(true);root.userData={classification:'Original exhibition reconstruction from public exterior references; not manufacturer CAD or certified dimensions. No engineering, internal armor, firing or driving physics.',license:vehicleModels[id].modelLicense,units:'metres',up:'+Y',forward:'-Z',source:vehicleModels[id].referenceUrl,parts:['Hull','Turret','Gun','RunningGear','Markings'],pivotAxes:{Turret:'Y',Gun:'X'},modelingTargets:{hullLength:length,width},animation:'UI-only illustrative articulation; no real performance parameters'};
 const scene=new T.Scene();scene.add(root);const binary=await new GLTFExporter().parseAsync(scene,{binary:true});await writeFile(`public/models/${id}-exhibit.glb`,Buffer.from(binary));
 const bounds=new T.Box3().setFromObject(root),record={...root.userData,size:bounds.getSize(new T.Vector3()).toArray(),bytes:binary.byteLength};await writeFile(`public/models/${id}-exhibit-metadata.json`,JSON.stringify(record,null,2));console.log(id,record.bytes,record.size);
}
