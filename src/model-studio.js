import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {studioMarkup,studioText as t} from './model-studio-ui.js';
import './model-studio.css';

const views={front:[0,.18,-1],back:[0,.18,1],left:[-1,.18,0],right:[1,.18,0],top:[0,1,.001],home:[1,.55,-1]};
function release(root){const resources=new Set();root?.traverse(object=>{if(object.geometry)resources.add(object.geometry);for(const m of Array.isArray(object.material)?object.material:object.material?[object.material]:[]){resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value)}});for(const resource of resources)resource.dispose();}
export class ModelStudio{
 constructor(host,system,asset,retry){
  this.host=host;this.asset=asset;this.retry=retry;this.events=new AbortController();this.request=new AbortController();this.elapsed=0;this.visible=true;this.playing=false;this.auto=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
  host.innerHTML=studioMarkup(system,asset);this.ui=host.querySelector('.model-studio');this.stage=host.querySelector('.studio-canvas');this.status=host.querySelector('[data-studio-status]');this.bind();this.init();
 }
 async init(){
  try{
   this.renderer=new T.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;
   const canvas=this.renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label',this.stage.getAttribute('aria-label'));this.stage.prepend(canvas);
   this.scene=new T.Scene();const style=getComputedStyle(this.host);this.scene.background=new T.Color(style.getPropertyValue('--sky-light').trim()||'#eef6ff');this.camera=new T.PerspectiveCamera(38,1,.01,1000);
   this.controls=new OrbitControls(this.camera,canvas);this.controls.enableDamping=true;this.controls.autoRotateSpeed=.7;
   this.scene.add(new T.HemisphereLight(0xffffff,0x66716b,2.2));const key=new T.DirectionalLight(0xfff4de,3);key.position.set(8,16,-9);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.normalBias=.035;this.scene.add(key,key.target);
   const rim=new T.DirectionalLight(0xc4dbff,1.5);rim.position.set(-10,6,7);this.scene.add(rim);
   canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.fail()},{signal:this.events.signal});
   this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this.stage);
   this.intersection=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.loop()});this.intersection.observe(this.stage);
   const timer=setTimeout(()=>this.request.abort(),15000);
   try{
    const url=new URL(this.asset.model,document.baseURI),response=await fetch(url,{signal:this.request.signal});if(!response.ok)throw new Error('GLB HTTP '+response.status);
    const data=await response.arrayBuffer();this.request.signal.throwIfAborted();const gltf=await new GLTFLoader().parseAsync(data,new URL('.',url).href);
    if(this.disposed||this.request.signal.aborted){release(gltf.scene);return;}
    this.root=gltf.scene;this.scene.add(this.root);this.parts=Object.fromEntries(['Hull','Turret','Gun','RunningGear','Markings'].map(name=>[name,this.root.getObjectByName(name)]));
    this.origins=new Map(Object.values(this.parts).filter(Boolean).map(part=>[part,part.position.clone()]));this.root.traverse(object=>{if(object.isMesh){object.castShadow=true;object.receiveShadow=true}});
    const bounds=new T.Box3().setFromObject(this.root);if(bounds.isEmpty())throw new Error('Empty GLB');this.center=bounds.getCenter(new T.Vector3());this.radius=bounds.getSize(new T.Vector3()).length()/2;this.baseRadius=this.radius;
    const floor=new T.Mesh(new T.PlaneGeometry(this.radius*12,this.radius*12),new T.MeshStandardMaterial({color:style.getPropertyValue('--elevated').trim()||'#f2f4f6',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=bounds.min.y-.015;floor.receiveShadow=true;this.scene.add(floor);
    key.target.position.copy(this.center);key.shadow.camera.left=key.shadow.camera.bottom=-this.radius*2;key.shadow.camera.right=key.shadow.camera.top=this.radius*2;key.shadow.camera.far=100;key.shadow.camera.updateProjectionMatrix();
    this.controls.minDistance=this.radius*.5;this.controls.maxDistance=this.radius*7;this.view='home';this.resize();this.enableControls();this.status.textContent=t('ready');this.ui.dataset.ready='true';this.loop();
   }finally{clearTimeout(timer)}
  }catch{if(!this.disposed)this.fail()}
 }
 enableControls(){
  this.ui.querySelectorAll('input,select,[data-studio-play],[data-studio-stop]').forEach(control=>control.disabled=false);
  const articulated=Boolean(this.parts.Turret||this.parts.Gun);
  this.ui.querySelector('[data-studio-play]').disabled=!articulated;
  this.ui.querySelector('[data-studio-range="explode"]').disabled=this.origins.size<2;
  this.ui.querySelector('[data-studio-part]').disabled=this.origins.size===0;
  for(const [option,part]of [['mark','Markings']])this.ui.querySelector(`[data-studio-option="${option}"]`).disabled=!this.parts[part];
  this.ui.querySelector('[data-studio-range="turret"]').disabled=!this.parts.Turret;this.ui.querySelector('[data-studio-range="gun"]').disabled=!this.parts.Gun;
  for(const option of this.ui.querySelectorAll('[data-studio-part] option'))option.disabled=option.value!=='all'&&!this.parts[option.value];
 }
 setView(name){
  if(!this.root)return;this.view=name;
  const direction=new T.Vector3(...views[name]).normalize(),right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),direction).normalize(),up=new T.Vector3().crossVectors(direction,right).normalize();
  const vertical=Math.tan(T.MathUtils.degToRad(this.camera.fov/2)),horizontal=vertical*this.camera.aspect,bounds=new T.Box3().setFromObject(this.root);let distance=0;
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const point=new T.Vector3(x,y,z).sub(this.center);distance=Math.max(distance,point.dot(direction)+Math.abs(point.dot(right))/horizontal,point.dot(direction)+Math.abs(point.dot(up))/vertical);}
  distance*=1.18;this.camera.position.copy(this.center).addScaledVector(direction,distance);this.camera.near=Math.max(.01,this.radius/1000);this.camera.far=distance*15;this.camera.updateProjectionMatrix();this.controls.target.copy(this.center);this.controls.update();this.ui.querySelectorAll('[data-studio-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.studioView===name)));
 }
 resize(){if(!this.renderer||!this.camera)return;const width=this.stage.clientWidth,height=this.stage.clientHeight;if(!width||!height)return;this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();if(this.root)this.setView(this.view||'home');}
 loop(){if(!this.renderer)return;this.previous=undefined;this.renderer.setAnimationLoop(this.visible&&!document.hidden&&!this.failed&&!this.disposed?time=>this.draw(time):null);}
 draw(time){const dt=this.previous===undefined?0:Math.min((time-this.previous)/1000,.05);this.previous=time;
  if(this.playing){this.elapsed+=dt;if(this.parts.Turret)this.parts.Turret.rotation.y=Math.sin(this.elapsed*.45)*.55;if(this.parts.Gun)this.parts.Gun.rotation.x=(Math.sin(this.elapsed*.65)+1)*.15;this.parts.Turret?.updateMatrixWorld(true);this.selection?.setFromObject(this.selectedPart);for(const [name,part,axis]of [['turret',this.parts.Turret,'y'],['gun',this.parts.Gun,'x']])if(part){const input=this.ui.querySelector(`[data-studio-range="${name}"]`),value=Math.round(T.MathUtils.radToDeg(part.rotation[axis]));if(input.value!==String(value)){input.value=String(value);input.nextElementSibling.textContent=value+'°';}}}
  this.controls.autoRotate=this.auto;this.controls.update(dt);this.renderer.render(this.scene,this.camera);
 }
 bind(){const signal=this.events.signal;
  this.ui.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.studioView)this.setView(button.dataset.studioView);if(button.hasAttribute('data-studio-retry'))this.retry();if(button.hasAttribute('data-studio-play')){this.resetParts();this.playing=true;this.elapsed=0;this.ui.querySelector('[data-studio-play]').setAttribute('aria-pressed','true');for(const range of this.ui.querySelectorAll('[data-studio-range]'))range.disabled=true;}if(button.hasAttribute('data-studio-stop'))this.resetParts();},{signal});
  this.ui.addEventListener('change',event=>{const input=event.target;if(input.dataset.studioOption){const option=input.dataset.studioOption;if(option==='auto')this.auto=input.checked;if(option==='mark'&&this.parts?.Markings)this.parts.Markings.visible=input.checked;if(option==='wire')this.root?.traverse(object=>{if(object.isMesh)for(const material of Array.isArray(object.material)?object.material:[object.material])material.wireframe=input.checked});}if(input.hasAttribute('data-studio-part'))this.selectPart(input.value);},{signal});
  this.ui.addEventListener('input',event=>{const input=event.target,name=input.dataset.studioRange;if(!name||!this.root)return;const value=Number(input.value);input.nextElementSibling.textContent=value+(name==='explode'?'%':'°');this.playing=false;
   if(name==='turret'&&this.parts.Turret)this.parts.Turret.rotation.y=T.MathUtils.degToRad(value);
   if(name==='gun'&&this.parts.Gun)this.parts.Gun.rotation.x=T.MathUtils.degToRad(value);
   if(name==='explode'){for(const [part,origin]of this.origins)part.position.copy(origin);const offset=value/100*this.baseRadius*.65;if(this.parts.Turret)this.parts.Turret.position.y+=offset;if(this.parts.Gun)this.parts.Gun.position.y+=offset*.5;if(this.parts.Hull)this.parts.Hull.position.y+=offset*.3;if(this.parts.Markings)this.parts.Markings.position.y+=offset*.3;const bounds=new T.Box3().setFromObject(this.root);this.center=bounds.getCenter(new T.Vector3());this.radius=bounds.getSize(new T.Vector3()).length()/2;this.setView(this.view);}
   this.root.updateMatrixWorld(true);if(name!=='explode'){const bounds=new T.Box3().setFromObject(this.root);this.center=bounds.getCenter(new T.Vector3());this.radius=bounds.getSize(new T.Vector3()).length()/2;this.setView(this.view);}if(this.selectedPart)this.selection.setFromObject(this.selectedPart);
  },{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop();else this.loop()},{signal});
  this.reduced.addEventListener('change',()=>{if(this.reduced.matches){this.resetParts();this.auto=false;this.ui.querySelector('[data-studio-option="auto"]').checked=false}},{signal});
 }
 selectPart(name){this.selection?.removeFromParent();if(this.selection){this.selection.geometry.dispose();this.selection.material.dispose();this.selection=null;}this.selectedPart=name==='all'?null:this.parts[name];if(this.selectedPart){this.selection=new T.BoxHelper(this.selectedPart,0x1b64da);this.scene.add(this.selection);}this.status.textContent=this.selectedPart?t(name):t('ready');}
 resetParts(){this.playing=false;this.elapsed=0;if(!this.root)return;for(const [part,origin]of this.origins){part.position.copy(origin);if(part===this.parts.Turret||part===this.parts.Gun)part.rotation.set(0,0,0);}this.ui.querySelector('[data-studio-play]').setAttribute('aria-pressed','false');for(const input of this.ui.querySelectorAll('[data-studio-range]')){input.value='0';input.nextElementSibling.textContent=input.dataset.studioRange==='explode'?'0%':'0°';}this.enableControls();const bounds=new T.Box3().setFromObject(this.root);this.center=bounds.getCenter(new T.Vector3());this.radius=bounds.getSize(new T.Vector3()).length()/2;this.setView(this.view);if(this.selectedPart)this.selection.setFromObject(this.selectedPart);}
 stop(){this.resetParts();this.auto=false;if(this.ui)this.ui.querySelector('[data-studio-option="auto"]').checked=false;this.renderer?.setAnimationLoop(null);}
 fail(){this.failed=true;this.playing=false;this.renderer?.setAnimationLoop(null);this.status.textContent=t('error');this.ui.dataset.ready='false';this.ui.querySelector('[data-studio-retry]').hidden=false;for(const input of this.ui.querySelectorAll('input,select,[data-studio-play],[data-studio-stop]'))input.disabled=true;}
 destroy(){this.disposed=true;this.request.abort();this.events.abort();this.observer?.disconnect();this.intersection?.disconnect();this.renderer?.setAnimationLoop(null);this.controls?.dispose();release(this.scene);this.renderer?.dispose();this.renderer?.domElement.remove();}
}
