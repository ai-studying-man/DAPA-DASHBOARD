import {untilAborted,sceneError} from './scene-recovery.js';
let engine;
export function loadCesium(){
 engine??=new Promise((resolve,reject)=>{
  if(window.Cesium)return resolve(window.Cesium);
  const base=new URL('./cesium/',document.baseURI).href;window.CESIUM_BASE_URL=base;
  const css=document.createElement('link');css.rel='stylesheet';css.href=base+'Widgets/widgets.css';document.head.append(css);
  const script=document.createElement('script');script.src=base+'Cesium.js';const timeout=setTimeout(()=>{engine=null;script.remove();reject(new Error('Cesium engine load timeout'))},10000);script.onload=()=>{clearTimeout(timeout);resolve(window.Cesium)};script.onerror=()=>{clearTimeout(timeout);engine=null;script.remove();reject(new Error('위성 지도 엔진 연결 실패'))};document.head.append(script);
 });return engine;
}
export async function createSatelliteViewer(host,{photorealistic=false,watch,signal}={}){
 let viewer;
 try{
 const C=await untilAborted(loadCesium(),signal);
 if(typeof WebGL2RenderingContext==='undefined'){const error=new Error('WebGL not supported');watch?.fail('unavailable');throw error;}
 const [imagery,terrain]=await untilAborted(Promise.all([
  C.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'),
  C.ArcGISTiledElevationTerrainProvider.fromUrl('https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'),
 ]),signal);
 if(signal?.aborted)throw new DOMException('Aborted','AbortError');
 viewer=new C.Viewer(host,{baseLayer:new C.ImageryLayer(imagery),terrainProvider:terrain,animation:false,timeline:false,baseLayerPicker:false,geocoder:false,homeButton:false,sceneModePicker:false,navigationHelpButton:false,fullscreenButton:false,infoBox:false,selectionIndicator:false,shadows:photorealistic,requestRenderMode:true,maximumRenderTimeChange:Infinity});
 viewer.clock.currentTime=C.JulianDate.fromIso8601('2026-06-15T02:00:00Z');viewer.scene.highDynamicRange=true;viewer.resolutionScale=Math.min(devicePixelRatio||1,1.5);viewer.scene.verticalExaggeration=1;viewer.scene.globe.depthTestAgainstTerrain=true;viewer.scene.screenSpaceCameraController.minimumZoomDistance=2;
 if(photorealistic){const scene=viewer.scene;
 scene.light=new C.SunLight({intensity:1.4});
 scene.globe.enableLighting=true;scene.globe.shadows=C.ShadowMode.RECEIVE_ONLY;
 scene.globe.maximumScreenSpaceError=1.5;
 scene.shadowMap.softShadows=true;scene.shadowMap.size=innerWidth<700?1024:2048;
 scene.postProcessStages.fxaa.enabled=true;
 scene.atmosphere.dynamicLighting=C.DynamicAtmosphereLightingType.SUNLIGHT;}
 const cleanups=[],canvas=viewer.canvas;let frames=0;
 const lost=event=>{event.preventDefault();viewer.useDefaultRenderLoop=false;viewer.camera.cancelFlight();watch?.fail('context-lost')};canvas.addEventListener('webglcontextlost',lost);cleanups.push(()=>canvas.removeEventListener('webglcontextlost',lost));
 const offline=()=>watch?.fail('network-failure');window.addEventListener('offline',offline);cleanups.push(()=>window.removeEventListener('offline',offline));
 cleanups.push(viewer.scene.renderError.addEventListener((_scene,error)=>{viewer.useDefaultRenderLoop=false;watch?.fail(sceneError(error)||'initialization-failure')}));
 for(const provider of [imagery,terrain])if(provider.errorEvent)cleanups.push(provider.errorEvent.addEventListener(()=>watch?.fail('network-failure')));
 cleanups.push(viewer.scene.postRender.addEventListener(()=>{if(++frames>1&&viewer.scene.globe.tilesLoaded&&!watch?.pending)watch?.ready()}));
 const destroy=viewer.destroy.bind(viewer);viewer.destroy=()=>{for(const remove of cleanups)remove();return destroy()};
 return {C,viewer};
 }catch(error){if(viewer&&!viewer.isDestroyed())viewer.destroy();const kind=sceneError(error);if(kind)watch?.fail(kind);throw error;}
}
