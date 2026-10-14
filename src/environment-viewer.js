import {translateText} from './i18n.js';
import {SceneWatch,untilAborted,sceneError} from './scene-recovery.js';
import {createSatelliteViewer} from './cesium-runtime.js';
import {environmentFor,environments} from './environment-data.js';
import {equipmentAssets} from './equipment-assets.js';
import {ModelViewer} from './model-viewer.js';
import './satellite-exhibition.css';
const locations={launch:[127.535,34.431],land:[128.7063,37.6677],plain:[126.94,35.82],coast:[129.426,36.06],sea:[129.7,35.9],underwater:[130.4,36.1],air:[128.2,35.8],space:[127.5,36.2]};
export class EnvironmentViewer{
 constructor(host,onStatus){this.host=host;this.onStatus=onStatus;this.assetViewer=new ModelViewer();this.version=0;this.timers=[];this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.initVersion=0;this.watch=new SceneWatch(host,{onStatus,retry:()=>this.retry(),stop:()=>{this.stop();if(this.viewer)this.viewer.useDefaultRenderLoop=false}});}
 async init(){
  const initVersion=++this.initVersion,signal=this.watch.begin();this.events?.abort();this.events=new AbortController();
  this.host.innerHTML='<div class="satellite-canvas"></div><div class="scene-location"></div><div class="scene-map-loading" role="status">위성 영상 세부 타일 준비 중…</div><section class="equipment-in-scene"><h4></h4><div class="scene-asset"></div></section><div class="scene-view-controls"><button data-scene-view="peninsula">한반도</button><button data-scene-view="context">활동 환경</button><button data-scene-view="site">장비·현장 관찰</button><button data-scene-view="onboard" disabled>탑승 관측 · 원본 모델 필요</button></div>';
  this.host.append(this.watch.panel);
  const runtime=await createSatelliteViewer(this.host.querySelector('.satellite-canvas'),{photorealistic:true,watch:this.watch,signal});if(initVersion!==this.initVersion||signal.aborted){runtime.viewer.destroy();return;}Object.assign(this,runtime);
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this.host);
  this.host.addEventListener('click',e=>{const button=e.target.closest('[data-scene-view]');if(button&&!button.disabled){this.stop();this.setView(button.dataset.sceneView)}},{signal:this.events.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop()},{signal:this.events.signal});this.host.dataset.ready='true';
  this.viewer.scene.postRender.addEventListener(()=>{this.host.querySelector('.scene-map-loading').hidden=this.viewer.scene.globe.tilesLoaded});
  this.viewer.scene.postRender.addEventListener(()=>this.alignModel());
  const canvas=this.viewer.canvas;canvas.tabIndex=0;
  canvas.addEventListener('pointerdown',e=>{this.stop();if(this.view!=='onboard')return;this.drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.focus()});
  canvas.addEventListener('pointermove',e=>{if(!this.drag||this.view!=='onboard')return;this.yaw+=(e.clientX-this.drag.x)*.004;this.pitch=Math.max(-.7,Math.min(.6,this.pitch-(e.clientY-this.drag.y)*.003));this.drag={x:e.clientX,y:e.clientY};this.updateEye()});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>{this.drag=null});
  canvas.addEventListener('keydown',e=>{if(this.view!=='onboard'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();this.yaw+=(e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0);this.pitch=Math.max(-.7,Math.min(.6,this.pitch+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));this.updateEye()});this.onReady?.(this);
 }
 async setSystem(system,preset){
  if(!this.viewer||this.viewer.isDestroyed())return;
  if(this.watch.failed){this.system=system;this.mode=preset||environmentFor(system);await this.retry();return;}
  const version=++this.version,signal=this.watch.begin();this.watch.pending=true;
  try{this.stop();this.surface=null;this.marker=null;this.componentMarker=null;this.component=null;this.system=system;this.mode=preset||environmentFor(system);this.host.dataset.environment=this.mode;delete this.host.dataset.model;this.viewer.entities.removeAll();if(this.model){this.viewer.scene.primitives.remove(this.model);this.model=null;}if(this.water){this.viewer.scene.primitives.remove(this.water);this.water=null;}
  this.coords=locations[this.mode];const asset=equipmentAssets[system.id],C=this.C;
  this.host.querySelector('.scene-location').replaceChildren();const title=document.createElement('strong');title.textContent=system.name+' · '+environments[this.mode].name;
  const note=document.createElement('small');note.textContent=(this.mode==='coast'?'포항 동해 연안 · 해상 출발 관찰':this.mode==='space'?'지구 관측 환경 · 실제 궤도 표시 아님':this.mode==='air'?'한반도 상공 · 전시용 관측 위치':'실제 위성·항공 영상과 고도 · 전시용 위치');this.host.querySelector('.scene-location').append(title,note);
  this.host.querySelector('.equipment-in-scene h4').textContent=system.name+' · '+(asset?.kind==='3d'?'공개 3D 외형':asset?.kind==='photo'?'실물 사진':asset?.kind==='illustration'?'공개 개념도':'공개 자료');
  this.assetViewer.attach(this.host.querySelector('.scene-asset'),system);
  const altitude=this.mode==='air'?3500:this.mode==='space'?450000:0;this.altitude=altitude;
  this.anchor=C.Cartesian3.fromDegrees(...this.coords,altitude);
  this.setView('context');
  const points=[C.Cartographic.fromDegrees(...this.coords)];await untilAborted(C.sampleTerrainMostDetailed(this.viewer.terrainProvider,points),signal);
  if(version!==this.version)return;this.surface=points[0];this.surfaceHeight=points[0].height||0;
  this.anchor=C.Cartesian3.fromDegrees(...this.coords,altitude+this.surfaceHeight-(asset?.waterline||0));
  this.frame=C.Transforms.eastNorthUpToFixedFrame(this.anchor);
  if(asset?.model){
   const modelPromise=C.Model.fromGltfAsync({url:new URL(asset.model,document.baseURI).href,modelMatrix:this.frame,forwardAxis:C.Axis.X,scale:asset.scale||1});modelPromise.then(model=>{if(signal.aborted||version!==this.version)model.destroy()},()=>{});const model=await untilAborted(modelPromise,signal);
   if(version!==this.version){if(!model.isDestroyed())model.destroy();return;}model.imageBasedLighting.specularEnvironmentMaps=new URL('./lighting/kiara-afternoon.ktx2',document.baseURI).href;model.imageBasedLighting.imageBasedLightingFactor=new C.Cartesian2(1,.5);this.model=this.viewer.scene.primitives.add(model);
   this.host.dataset.model='photo-reconstruction';note.textContent+=' · '+asset.modelLabel;const credit=document.createElement('a');credit.href=asset.modelAttribution||'./models/kaav-reference-ATTRIBUTION.md';credit.target='_blank';credit.rel='noopener noreferrer';credit.textContent=' · 외형 재구성 '+(asset.modelLicense||'CC BY-SA 2.0')+' / 근거';note.append(credit);const lighting=document.createElement('a');lighting.href='./lighting/ATTRIBUTION.md';lighting.target='_blank';lighting.rel='noopener noreferrer';lighting.textContent=' · 환경광 CC0';note.append(lighting);
   await untilAborted(this.waitForSurface(signal),signal);if(version!==this.version)return;
   if(['coast','underwater','sea'].includes(this.mode))this.addWater();
  }
  this.marker=this.viewer.entities.add({position:this.anchor,label:{text:system.name+' · '+translateText('전시 관측 기준점'),font:'13px sans-serif',fillColor:C.Color.WHITE,outlineColor:C.Color.BLACK,outlineWidth:3,style:C.LabelStyle.FILL_AND_OUTLINE,showBackground:true,pixelOffset:new C.Cartesian2(0,-15),disableDepthTestDistance:Infinity},point:{pixelSize:6,color:C.Color.fromCssColorString('#ace3c9'),disableDepthTestDistance:Infinity}});
  const onboard=this.host.querySelector('[data-scene-view="onboard"]');onboard.disabled=!asset?.model||!asset.eye;onboard.textContent=onboard.disabled?(system.id==='nuri'?'무인 발사체 · 탑승 없음':'탑승 관측 · 원본 모델 필요'):asset.eyeLabel||'해치 관측 · 추정 시점';
  this.setView(asset?.model?'site':'context');this.onStatus('환경 준비 완료 · '+(asset?.model?'공개 사진 기반 외형 재구성 · 제조사 CAD·검증된 실내가 아닙니다.':asset?.kind==='3d'?'지도와 공개 3D 외형을 같은 화면에서 관찰합니다. 3D 외형은 외부 뷰어입니다.':asset?.kind==='photo'?'실물 사진을 지도와 함께 표시합니다. 이 체계의 지형 위 3D·탑승 실내는 미구현입니다.':'정확한 장비 외형 자료가 아직 확보되지 않았습니다.'));
  this.watch.pending=false;if(this.viewer.scene.globe.tilesLoaded)this.watch.ready();this.viewer.scene.requestRender();
  }catch(error){if(version===this.version){this.watch.pending=false;const kind=sceneError(error);if(kind)this.watch.fail(kind);}throw error;}
 }
 waitForSurface(signal){const C=this.C,scene=this.viewer.scene,center=C.Cartographic.fromDegrees(...this.coords);return new Promise(resolve=>{const finish=()=>{clearTimeout(timeout);remove();signal?.removeEventListener('abort',finish);resolve()};const timeout=setTimeout(finish,10000);signal?.addEventListener('abort',finish,{once:true});const remove=scene.postRender.addEventListener(()=>{if(Number.isFinite(scene.globe.getHeight(center)))finish()});scene.requestRender()});}
 addWater(){const C=this.C;this.water=this.viewer.scene.primitives.add(new C.Primitive({geometryInstances:new C.GeometryInstance({geometry:new C.EllipseGeometry({center:C.Cartesian3.fromDegrees(...this.coords),semiMajorAxis:350,semiMinorAxis:350,height:this.surfaceHeight+.02,vertexFormat:C.EllipsoidSurfaceAppearance.VERTEX_FORMAT})}),appearance:new C.EllipsoidSurfaceAppearance({material:C.Material.fromType('Water',{baseWaterColor:C.Color.fromCssColorString('#27616a'),blendColor:C.Color.fromCssColorString('#377780'),normalMap:new URL('./cesium/Assets/Textures/waterNormals.jpg',document.baseURI).href,frequency:300,animationSpeed:0,amplitude:1.5,specularIntensity:.3}),aboveGround:true}),asynchronous:false}));}
 alignModel(){if(!this.surface)return;const C=this.C,asset=equipmentAssets[this.system.id],height=this.viewer.scene.globe.getHeight(this.surface);if(!Number.isFinite(height)||Math.abs(height-this.surfaceHeight)<.1)return;const previous=this.anchor;this.surfaceHeight=height;this.anchor=C.Cartesian3.fromDegrees(...this.coords,height+this.altitude-(asset.waterline||0));this.frame=C.Transforms.eastNorthUpToFixedFrame(this.anchor);if(this.model)this.model.modelMatrix=this.frame;if(this.marker)this.marker.position=this.anchor;if(this.water){this.viewer.scene.primitives.remove(this.water);this.water=null;this.addWater();this.water.show=['site','onboard','component'].includes(this.view);}if(this.view==='onboard')this.updateEye();else if(['site','component'].includes(this.view))C.Cartesian3.add(this.viewer.camera.position,C.Cartesian3.subtract(this.anchor,previous,new C.Cartesian3()),this.viewer.camera.position);if(this.componentMarker&&this.component)this.componentMarker.position=C.Matrix4.multiplyByPoint(this.frame,new C.Cartesian3(...this.component.focus),new C.Cartesian3());this.host.dataset.surfaceHeight=String(height);this.viewer.scene.requestRender();}
 setView(view){
  if(!this.system||!this.viewer||this.watch.failed)return;if(this.componentMarker){this.viewer.entities.remove(this.componentMarker);this.componentMarker=null;}this.component=null;const C=this.C,camera=this.viewer.camera;camera.cancelFlight();camera.lookAtTransform(C.Matrix4.IDENTITY);const space=this.mode==='space',asset=equipmentAssets[this.system.id];this.view=view;if(this.marker)this.marker.show=!this.model||!['site','onboard'].includes(view);if(this.water)this.water.show=['site','onboard'].includes(view);this.viewer.scene.screenSpaceCameraController.enableInputs=view!=='onboard';
  if(view==='peninsula')camera.setView({destination:C.Cartesian3.fromDegrees(127.5,36.2,space?14000000:1000000),orientation:{heading:0,pitch:-Math.PI/2,roll:0}});
  else if(view==='onboard'){
   const asset=equipmentAssets[this.system.id];if(!asset?.model||!asset.eye)return;this.yaw=0;this.pitch=-.05;this.updateEye();this.onStatus((asset.eyeLabel||'해치 관측')+' · 외형 기준 추정 관측 위치 · 드래그·방향키로 둘러보기 · 검증된 내부 구조 아님');
  }else{
   const target=space?C.Cartesian3.fromDegrees(127.5,36.2):this.model?.ready&&view==='site'?this.model.boundingSphere.center:this.model&&view==='site'?C.Matrix4.multiplyByPoint(this.frame,new C.Cartesian3(0,0,asset?.focusHeight||1.5),new C.Cartesian3()):this.anchor;camera.lookAt(target,new C.HeadingPitchRange(C.Math.toRadians(this.model&&view==='site'?145:35),C.Math.toRadians(space?-70:-30),space?12000000:view==='site'?(this.model?this.fitRange(Math.max(asset?.range||15,this.model.ready?this.model.boundingSphere.radius*3.5:0)):['air'].includes(this.mode)?15000:2400):22000));camera.lookAtTransform(C.Matrix4.IDENTITY);
  }
  this.host.dataset.view=view;this.host.querySelectorAll('[data-scene-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sceneView===view)));this.viewer.scene.requestRender();
 }
 inspect(component){
  if(!this.model||!this.frame||!component?.focus||this.watch.failed)return;
  this.stop();const C=this.C,camera=this.viewer.camera;
  if(this.componentMarker)this.viewer.entities.remove(this.componentMarker);
  this.component=component;this.view='component';this.drag=null;
  camera.cancelFlight();camera.lookAtTransform(C.Matrix4.IDENTITY);
  this.viewer.scene.screenSpaceCameraController.enableInputs=true;
  const target=C.Matrix4.multiplyByPoint(this.frame,new C.Cartesian3(...component.focus),new C.Cartesian3());
  const label=component.label||component.title?.ko||component.title;
  this.componentMarker=this.viewer.entities.add({position:target,label:{text:label,font:'14px sans-serif',fillColor:C.Color.WHITE,outlineColor:C.Color.BLACK,outlineWidth:3,style:C.LabelStyle.FILL_AND_OUTLINE,showBackground:true,pixelOffset:new C.Cartesian2(0,-20),disableDepthTestDistance:Infinity},point:{pixelSize:9,color:C.Color.fromCssColorString('#ace3c9'),outlineColor:C.Color.BLACK,outlineWidth:2,disableDepthTestDistance:Infinity}});
  if(this.marker)this.marker.show=false;if(this.water)this.water.show=true;
  camera.lookAt(target,new C.HeadingPitchRange(C.Math.toRadians(145),C.Math.toRadians(component.pitch??-20),this.fitRange(component.range)));camera.lookAtTransform(C.Matrix4.IDENTITY);
  this.host.dataset.view='component';this.host.querySelectorAll('[data-scene-view]').forEach(b=>b.setAttribute('aria-pressed','false'));
  this.viewer.scene.requestRender();
 }
 updateEye(){const C=this.C,asset=equipmentAssets[this.system.id];this.viewer.camera.setView({destination:C.Matrix4.multiplyByPoint(this.frame,new C.Cartesian3(...asset.eye),new C.Cartesian3()),orientation:{heading:this.yaw,pitch:this.pitch,roll:0}});this.viewer.scene.requestRender();}
 play(){this.stop();if(!this.system||document.hidden||this.watch.failed)return;if(this.reduced.matches){this.onStatus('모션 감소 설정 · 관람 시점 버튼으로 직접 탐색하세요.');return;}this.animation=1;const stops=[['peninsula','한반도에서 활동 영역 확인'],['context','실제 지형과 장비 외형 자료 관찰'],['site','현장 관측과 공개 사업 근거 확인']];stops.forEach(([view,text],i)=>this.timers.push(setTimeout(()=>{if(!this.host.closest('dialog')?.open)return this.stop();this.setView(view);this.onStatus((i+1)+' / 3 · '+text)},i*5000)));this.timers.push(setTimeout(()=>{this.stop();this.onStatus('환경 시연 완료 · 카메라 관람 시연입니다. 장비 운용·성능·실제 궤도를 재현하지 않습니다.')},15000));}
 stop(){this.watch?.media?.pause();this.timers.forEach(clearTimeout);this.timers=[];this.animation=0;this.assetViewer.stop();if(this.viewer&&!this.viewer.isDestroyed())this.viewer.camera.cancelFlight();}
 home(){this.stop();this.setView('context');this.assetViewer.home();}
 fitRange(range){const canvas=this.viewer.canvas;return range*Math.max(1,canvas.clientWidth/Math.max(1,canvas.clientHeight)/1.6);}
 resize(){this.viewer?.resize();if(this.viewer&&this.system&&!this.watch.failed){if(this.view==='site')this.setView('site');else if(this.view==='component'&&this.component)this.inspect(this.component)}this.viewer?.scene.requestRender();}
 disposeViewer(){this.stop();this.version++;this.initVersion++;this.events?.abort();this.observer?.disconnect();if(this.viewer&&!this.viewer.isDestroyed())this.viewer.destroy();this.viewer=null;this.model=null;this.water=null;}
 async retry(){const system=this.system,mode=this.mode;this.disposeViewer();try{await this.init();if(system&&this.viewer)await this.setSystem(system,mode)}catch{}}
 destroy(){this.disposeViewer();this.watch.dispose();this.assetViewer.destroy();}
}
