import {createSatelliteViewer} from './cesium-runtime.js';
import {exhibitSite} from './exhibit-sites.js';
import {SatelliteCamera} from './visitor-satellite-camera.js';
import {satelliteCopy} from './visitor-satellite-copy.js';

class SatelliteExhibit{
 constructor(options){Object.assign(this,options);this.text=satelliteCopy(this.language);this.events=new AbortController();this.offset={east:0,north:0};this.heading=0;this.keys=new Set();this.site=exhibitSite(this.item);this.init()}
 status(message){if(!this.disposed)this.host.querySelector('[data-satellite-status]').textContent=message}
 fail(reason){if(this.disposed)return;this.failed=true;this.failureReason=reason;this.keys.clear();this.status(this.text.failed+this.text.retry);this.host.querySelector('[data-satellite-retry]').hidden=false;this.host.querySelector('.visit-satellite').dataset.ready='false';document.querySelectorAll('[data-move],#visit-reset,#visit-view').forEach(button=>button.disabled=true)}
 async init(){
  this.host.innerHTML='<section class="visit-satellite"><div class="visit-satellite-canvas"></div><p data-satellite-status role="status">실제 위성 영상·고도 지형 준비 중…</p><span class="visit-satellite-location"></span><button data-map-context disabled>주변 위성 지도</button><button data-satellite-retry hidden>다시 연결</button></section>';
  this.host.querySelector('.visit-satellite-location').textContent=this.site.label;
  this.status(this.text.loading);this.host.querySelector('[data-map-context]').textContent=this.text.map;this.host.querySelector('[data-satellite-retry]').textContent=this.text.retry;
  this.host.querySelector('[data-satellite-retry]').onclick=this.retry;
  try{
   const runtime=await createSatelliteViewer(this.host.querySelector('.visit-satellite-canvas'),{photorealistic:true,signal:this.events.signal,watch:{fail:reason=>this.fail(reason),ready:()=>{}}});
   if(this.disposed){runtime.viewer.destroy();return}Object.assign(this,runtime);
   const C=this.C;
   const point=C.Cartographic.fromDegrees(this.site.longitude,this.site.latitude);
   if(this.site.grounded)await C.sampleTerrainMostDetailed(this.viewer.terrainProvider,[point]);
   if(this.disposed)return;
   this.groundHeight=this.site.grounded?point.height:0;
   if(!Number.isFinite(this.groundHeight))throw new Error('실제 지형 고도를 확인하지 못했습니다.');
   this.anchor=C.Cartesian3.fromDegrees(this.site.longitude,this.site.latitude,this.groundHeight+this.site.altitude-(this.item.asset.waterline||0)+.1);
   this.frame=C.Transforms.eastNorthUpToFixedFrame(this.anchor);
   if(this.item.domain==='sea'){
    const water=new C.Material({fabric:{type:'Water',uniforms:{
     normalMap:C.buildModuleUrl('Assets/Textures/waterNormals.jpg'),frequency:1450,animationSpeed:.013,
     amplitude:2.5,specularIntensity:.35,baseWaterColor:C.Color.fromCssColorString('#234854').withAlpha(.76),
     blendColor:C.Color.fromCssColorString('#43636c').withAlpha(.6)}}});
    this.viewer.scene.primitives.add(new C.Primitive({geometryInstances:new C.GeometryInstance({
     geometry:new C.EllipseGeometry({center:C.Cartesian3.fromDegrees(this.site.longitude,this.site.latitude),
      semiMajorAxis:800,semiMinorAxis:800,height:0,vertexFormat:C.EllipsoidSurfaceAppearance.VERTEX_FORMAT})}),
     appearance:new C.EllipsoidSurfaceAppearance({material:water,aboveGround:true})}));
    this.viewer.scene.maximumRenderTimeChange=.15;this.viewer.clock.shouldAnimate=true;
   }
   if(this.item.model&&this.item.visualStage!=='draft'){
    let expired=false,timer;
    const loading=C.Model.fromGltfAsync({url:new URL(this.item.model,document.baseURI).href,modelMatrix:this.matrix(),forwardAxis:C.Axis.X,scale:1}).then(model=>{if(expired||this.disposed){model.destroy();throw new Error('Model loading cancelled')}return model});
    let model;try{model=await Promise.race([loading,new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(new Error('3D loading timeout'))},30000)})])}finally{clearTimeout(timer)}
    if(this.disposed){model.destroy();return}this.model=this.viewer.scene.primitives.add(model);
    model.imageBasedLighting.specularEnvironmentMaps=new URL('./lighting/kiara-afternoon.ktx2',document.baseURI).href;
    model.imageBasedLighting.imageBasedLightingFactor=new C.Cartesian2(1,.7);
    await new Promise((resolve,reject)=>{
     if(model.ready)return resolve();const signal=this.events.signal;let removeReady,removeError,timeout;
     const clean=()=>{clearTimeout(timeout);removeReady?.();removeError?.();signal.removeEventListener('abort',abort)};
     const abort=()=>{clean();reject(new DOMException('Aborted','AbortError'))};
     removeReady=model.readyEvent.addEventListener(()=>{clean();resolve()});removeError=model.errorEvent.addEventListener(error=>{clean();reject(error)});signal.addEventListener('abort',abort,{once:true});
     timeout=setTimeout(()=>{clean();reject(new Error('3D ready timeout'))},30000);
    });
    if(this.disposed)return;
    this.host.dataset.modelReady='true';this.host.dataset.modelUrl=this.item.model;
   }
   this.camera=new SatelliteCamera(this);this.camera.bind();this.camera.fit();
   this.host.querySelector('[data-map-context]').disabled=false;
   this.host.querySelector('.visit-satellite').dataset.ready='true';this.host.dataset.terrainHeight=String(this.groundHeight);
   this.status(this.model?this.text.terrain+' · '+(this.language==='ko'?this.item.visualLabel:this.item.visualStage==='photo-reconstructed'?'AI photo reconstruction · inferred hidden surfaces':this.item.visualStage==='detailed-source'?'Public creator exterior · not measured CAD':'Exterior study · detail in progress'):this.text.pending);
   this.bindMovement();if(this.failed)this.fail('network-failure');
   this.observer=new ResizeObserver(()=>{if(!this.disposed){this.viewer.resize();this.camera.fit()}});this.observer.observe(this.host);
   this.onTick=this.viewer.clock.onTick.addEventListener(()=>this.tick(performance.now()));
  }catch(error){if(!this.disposed){this.fail(error.message);this.viewer?.destroy();this.viewer=null}}
 }
 matrix(){
  const C=this.C,position=C.Matrix4.multiplyByPoint(this.frame,new C.Cartesian3(this.offset.east,this.offset.north,this.heightDelta||0),new C.Cartesian3());
  const frame=C.Transforms.eastNorthUpToFixedFrame(position);
  return C.Matrix4.multiply(frame,C.Matrix4.fromRotationTranslation(C.Matrix3.fromRotationZ(Math.PI+this.heading)),new C.Matrix4());
 }
 bindMovement(){
  if(!this.simulation)return;const signal=this.events.signal,active=Boolean(this.model)&&!this.site.fixed;
  document.querySelectorAll('[data-move],#visit-reset,#visit-view').forEach(button=>button.disabled=!this.model);
  if(this.site.fixed)document.querySelectorAll('[data-move],#visit-view').forEach(button=>button.disabled=true);
  const progress=document.querySelector('#visit-progress');
  progress.textContent=this.site.fixed?this.text.fixed:this.model?this.text.move:this.text.pending;
  const mapping={ArrowUp:'forward',w:'forward',ArrowDown:'back',s:'back',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
  addEventListener('keydown',event=>{if(!active||!mapping[event.key]||event.target.matches('input,select,textarea'))return;event.preventDefault();this.keys.add(mapping[event.key])},{signal});
  addEventListener('keyup',event=>this.keys.delete(mapping[event.key]),{signal});
  addEventListener('blur',()=>this.keys.clear(),{signal});document.addEventListener('visibilitychange',()=>this.keys.clear(),{signal});
  document.querySelectorAll('[data-move]').forEach(button=>{button.addEventListener('pointerdown',event=>{if(!active)return;event.preventDefault();button.setPointerCapture(event.pointerId);this.keys.add(button.dataset.move)},{signal});for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,()=>this.keys.delete(button.dataset.move),{signal})});
  document.querySelector('#visit-view').textContent=this.text.onboard;
  document.querySelector('#visit-reset').onclick=()=>{if(!this.model)return;this.keys.clear();this.offset={east:0,north:0};this.heading=0;this.heightDelta=0;this.poseVersion=(this.poseVersion||0)+1;this.model.modelMatrix=this.matrix();this.camera.reset();document.querySelector('#visit-view').textContent=this.text.onboard};
 }
 tick(time){
  const dt=this.previous===undefined?0:Math.min((time-this.previous)/1000,.05);this.previous=time;if(this.failed||!this.simulation||!this.model||!this.keys.size||document.hidden)return;
  this.heading+=(Number(this.keys.has('left'))-Number(this.keys.has('right')))*dt;
  const step=(Number(this.keys.has('forward'))-Number(this.keys.has('back')))*dt*3;
  this.offset.east=Math.max(-40,Math.min(40,this.offset.east+Math.sin(this.heading)*step));this.offset.north=Math.max(-40,Math.min(40,this.offset.north-Math.cos(this.heading)*step));
  this.model.modelMatrix=this.matrix();this.camera.update();this.viewer.scene.requestRender();
  if(step&&this.site.grounded&&time-(this.lastSample||0)>600&&!this.sampling)this.sampleHeight(time);
 }
 async sampleHeight(time){
  this.lastSample=time;this.sampling=true;const version=this.poseVersion||0;
  const C=this.C,world=C.Matrix4.multiplyByPoint(this.frame,new C.Cartesian3(this.offset.east,this.offset.north,0),new C.Cartesian3());
  const point=C.Cartographic.fromCartesian(world);
  try{await C.sampleTerrainMostDetailed(this.viewer.terrainProvider,[point]);if(!this.disposed&&version===(this.poseVersion||0)&&Number.isFinite(point.height)){this.heightDelta=point.height-this.groundHeight;this.model.modelMatrix=this.matrix();this.viewer.scene.requestRender()}}
  catch{if(!this.disposed)this.status(this.text.height)}
  finally{this.sampling=false}
 }
 destroy(){this.disposed=true;this.events.abort();this.keys.clear();this.observer?.disconnect();this.onTick?.();if(this.viewer&&!this.viewer.isDestroyed())this.viewer.destroy();this.viewer=null}
}
export function mountVisitorStage(options){return new SatelliteExhibit(options)}
