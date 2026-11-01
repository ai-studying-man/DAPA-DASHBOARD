import * as T from 'three';
import {createServiceLandscape} from './service-terrain.js';
import shadows from './photo-shadow-assets.json' with {type:'json'};

// Creative exhibition context. The separate satellite route retains real DEM data.
export function visitorLandscape(studio,domain,id){
 const scene=studio.scene;
 scene.background=new T.Color(0xd7e2e6);scene.fog=new T.Fog(0xd7e2e6,Math.max(65,studio.radius*6),Math.max(210,studio.radius*18));
 studio.camera.near=Math.max(.05,studio.radius*.01);studio.camera.updateProjectionMatrix();
 studio.renderer.toneMappingExposure=.95;
 for(const object of scene.children){
  if(object.isMesh&&object.geometry.type==='PlaneGeometry')object.visible=false;
  if(object.isHemisphereLight){object.color.setHex(0xdde9f3);object.groundColor.setHex(0x72735c);object.intensity=1.3}
  if(object.isDirectionalLight){object.intensity=object.castShadow?2.5:.65;if(object.castShadow){object.position.copy(studio.center).add(new T.Vector3(12,24,-8));object.target.position.copy(studio.center);object.shadow.normalBias=.005;object.shadow.bias=-.00001;object.shadow.mapSize.set(2048,2048)}}
 }
 const branch={land:'army',air:'air',sea:'navy',space:'air'}[domain]||'army';
 const landscape=createServiceLandscape(scene,branch);
 landscape.getObjectByName('DistantForestCanopies').visible=false;
 // Large ships use an open water exhibit, aircraft a static apron. Movement remains illustrative.
 if(domain==='sea'){
  landscape.getObjectByName('ContinuousTerrain').visible=false;
  const water=new T.Mesh(new T.PlaneGeometry(1800,1800),new T.MeshStandardMaterial({color:0x3e6971,roughness:.28,metalness:.16}));water.rotation.x=-Math.PI/2;water.position.y=-.015;water.receiveShadow=true;scene.add(water);
 }else if(domain==='air'||domain==='space'){
  const apron=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshStandardMaterial({color:0x85887e,roughness:.95}));apron.rotation.x=-Math.PI/2;apron.position.y=.03;apron.receiveShadow=true;scene.add(apron);
 }
 // Small, repeatable gravel texture supplies a real material scale without a tile grid.
 const terrain=landscape.getObjectByName('ContinuousTerrain');
 if(Object.hasOwn(shadows,id)){
  terrain.receiveShadow=false;
  const reference=shadows[id],group=new T.Group();
  const texture=new T.TextureLoader().load(reference.image,loaded=>{if(studio.disposed)loaded.dispose()});
  texture.colorSpace=T.SRGBColorSpace;
  const plane=new T.Mesh(new T.PlaneGeometry(reference.extent,reference.extent),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,opacity:.75,toneMapped:false}));
  plane.rotation.x=-Math.PI/2;plane.position.fromArray(reference.center);plane.renderOrder=1;
  group.add(plane);landscape.add(group);landscape.userData.contactShadow=group;
 }
 const data=new Uint8Array(128*128*4);let seed=17;
 for(let i=0;i<data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const value=222+(seed%24);data[i]=data[i+1]=data[i+2]=value;data[i+3]=255}
 const grain=new T.DataTexture(data,128,128);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(40,40);grain.magFilter=T.LinearFilter;grain.minFilter=T.LinearMipmapLinearFilter;grain.generateMipmaps=true;grain.anisotropy=4;grain.needsUpdate=true;grain.colorSpace=T.SRGBColorSpace;terrain.material.map=grain;terrain.material.needsUpdate=true;
 landscape.userData.exhibitionSurface=true;
 return landscape;
}
