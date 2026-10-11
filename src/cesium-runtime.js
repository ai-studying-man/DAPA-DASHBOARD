let engine;
export function loadCesium(){
 engine??=new Promise((resolve,reject)=>{
  if(window.Cesium)return resolve(window.Cesium);
  const base=new URL('./cesium/',document.baseURI).href;window.CESIUM_BASE_URL=base;
  const css=document.createElement('link');css.rel='stylesheet';css.href=base+'Widgets/widgets.css';document.head.append(css);
  const script=document.createElement('script');script.src=base+'Cesium.js';script.onload=()=>resolve(window.Cesium);script.onerror=()=>{engine=null;reject(new Error('위성 지도 엔진 연결 실패'))};document.head.append(script);
 });return engine;
}
export async function createSatelliteViewer(host){
 const C=await loadCesium();
 const [imagery,terrain]=await Promise.all([
  C.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'),
  C.ArcGISTiledElevationTerrainProvider.fromUrl('https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'),
 ]);
 const viewer=new C.Viewer(host,{baseLayer:new C.ImageryLayer(imagery),terrainProvider:terrain,animation:false,timeline:false,baseLayerPicker:false,geocoder:false,homeButton:false,sceneModePicker:false,navigationHelpButton:false,fullscreenButton:false,infoBox:false,selectionIndicator:false,requestRenderMode:true,maximumRenderTimeChange:Infinity});
 viewer.clock.currentTime=C.JulianDate.fromIso8601('2026-06-15T02:00:00Z');viewer.scene.highDynamicRange=true;viewer.resolutionScale=Math.min(devicePixelRatio||1,1.5);viewer.scene.verticalExaggeration=1;viewer.scene.globe.depthTestAgainstTerrain=true;viewer.scene.screenSpaceCameraController.minimumZoomDistance=2;
 return {C,viewer};
}
