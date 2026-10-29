import * as T from 'three';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
// Scenic exhibit surroundings, never a surveyed deployment site.
export class ExhibitWorld{
 constructor(scene,renderer,bounds,domain){
  Object.assign(this,{scene,renderer,domain,active:true});this.group=new T.Group();scene.add(this.group);this.resources=new Set();
  const size=bounds.getSize(new T.Vector3()),radius=Math.max(size.x,size.z,8);this.span=Math.max(160,radius*12);const ground=bounds.min.y-(domain==='air'?radius*.75:.02),pad=radius*.65;
  const geometry=new T.PlaneGeometry(this.span,this.span,100,100);geometry.rotateX(-Math.PI/2);const p=geometry.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),edge=T.MathUtils.smoothstep(Math.hypot(x,z),pad,pad*2.5);p.setY(i,ground+edge*(Math.sin(x*.065)*Math.cos(z*.049)*3+Math.sin(x*.13+z*.08)*.8));}geometry.computeVertexNormals();
  this.material=new T.MeshStandardMaterial({color:0x7c8069,roughness:1});this.floor=new T.Mesh(geometry,this.material);this.floor.receiveShadow=true;this.group.add(this.floor);
  scene.background=new T.Color(domain==='space'?0x080f21:0xb9cbd2);this.fog=new T.FogExp2(scene.background,1/(this.span*1.3));scene.fog=this.fog;
  if(domain==='sea'){this.floor.visible=false;const water=new T.Mesh(new T.PlaneGeometry(this.span,this.span),new T.MeshPhysicalMaterial({color:0x174d5c,roughness:.22,metalness:.25,transparent:true,opacity:.68,depthWrite:false}));water.rotation.x=-Math.PI/2;water.position.y=bounds.min.y+size.y*.48;this.group.add(water);}
  if(domain==='space'){this.floor.visible=false;const points=[];for(let i=0;i<500;i++){const y=1-2*(i+.5)/500,r=Math.sqrt(1-y*y),a=i*2.399963;points.push(Math.cos(a)*r*this.span,y*this.span,Math.sin(a)*r*this.span)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));this.group.add(new T.Points(g,new T.PointsMaterial({color:0xdce8ff,size:Math.max(.2,radius*.004)})));}
 }
 async load(signal){
  const buffer=async path=>{const r=await fetch(new URL(path,document.baseURI),{signal});if(!r.ok)throw Error('Environment HTTP '+r.status);return r.arrayBuffer()};
  const terrain=async()=>{if(!['land','air'].includes(this.domain))return;const maps=await Promise.all(['diff','nor_gl','rough'].map(async name=>{const bytes=await buffer('./materials/rocky-terrain/'+name+'.jpg'),bitmap=await createImageBitmap(new Blob([bytes],{type:'image/jpeg'}));if(!this.active||signal.aborted){bitmap.close();throw new DOMException('Aborted','AbortError')}const texture=new T.Texture(bitmap);texture.needsUpdate=true;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(this.span/90,this.span/90);texture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());if(name==='diff')texture.colorSpace=T.SRGBColorSpace;this.resources.add(texture);return texture;}));if(!this.active)return;[this.material.map,this.material.normalMap,this.material.roughnessMap]=maps;this.material.color.setHex(0xffffff);this.material.normalScale.set(.65,.65);this.material.needsUpdate=true;};
  const lighting=async()=>{const bytes=await buffer('./lighting/kiara-afternoon.hdr');if(!this.active||signal.aborted)return;const data=new RGBELoader().parse(bytes),source=new T.DataTexture(data.data,data.width,data.height,data.format,data.type);source.mapping=T.EquirectangularReflectionMapping;source.needsUpdate=true;const generator=new T.PMREMGenerator(this.renderer);try{this.environment=generator.fromEquirectangular(source);this.scene.environment=this.environment.texture;this.scene.environmentIntensity=this.group.visible?.65:.9;}finally{source.dispose();generator.dispose()}};
  return Promise.allSettled([terrain(),lighting()]);
 }
 setVisible(visible){this.group.visible=visible;this.scene.environmentIntensity=visible?.65:.9;this.scene.fog=visible?this.fog:null;this.scene.background.setHex(visible?(this.domain==='space'?0x080f21:0xb9cbd2):0xeef2f6);}
 dispose(){this.active=false;this.group.removeFromParent();this.group.traverse(o=>{o.geometry?.dispose();for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])m.dispose()});for(const texture of this.resources){texture.source.data?.close?.();texture.dispose()}if(this.scene.environment===this.environment?.texture)this.scene.environment=null;this.environment?.dispose();}
}
