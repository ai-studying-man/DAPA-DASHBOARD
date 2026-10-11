import {createSatelliteViewer} from './cesium-runtime.js';
import {regions} from './exhibition-data.js';
import {exportLocations} from './export-locations.js';
import './satellite-exhibition.css';
export class AtlasMap{
 constructor(host,onSelect,onStatus,onRegion){this.host=host;this.onSelect=onSelect;this.onStatus=onStatus;this.onRegion=onRegion;this.mode='korea';}
 async init(){
  const canvasHost=document.createElement('div');canvasHost.className='satellite-canvas';this.host.prepend(canvasHost);
  Object.assign(this,await createSatelliteViewer(canvasHost));const C=this.C;
  this.viewer.canvas.setAttribute('aria-label','실제 위성·항공 영상과 고도 지형. 체계 위치는 전시용입니다.');
  this.handler=new C.ScreenSpaceEventHandler(this.viewer.canvas);
  this.handler.setInputAction(e=>{const entity=this.viewer.scene.pick(e.position)?.id;if(entity?.systemId)this.onSelect(entity.systemId);if(entity?.regionId)this.onRegion?.(entity.regionId)},C.ScreenSpaceEventType.LEFT_CLICK);
  this.labelMeasure=document.createElement('canvas').getContext('2d');this.removeLabelLayout=this.viewer.scene.postRender.addEventListener(()=>this.declutter());
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this.host);this.home();this.onStatus('위성 지도 준비 완료',false);
 }
 async load(mode){this.mode=mode;this.viewer.entities.removeAll();this.home();return true;}
 label(text,color){const C=this.C;return{text,horizontalOrigin:C.HorizontalOrigin.CENTER,verticalOrigin:C.VerticalOrigin.CENTER,font:'600 14px sans-serif',fillColor:C.Color.WHITE,outlineColor:C.Color.BLACK,outlineWidth:3,style:C.LabelStyle.FILL_AND_OUTLINE,showBackground:true,backgroundColor:C.Color.fromCssColorString(color).withAlpha(.9),pixelOffset:new C.Cartesian2(0,-18),disableDepthTestDistance:Infinity,distanceDisplayCondition:new C.DistanceDisplayCondition(0,3e7)};}
 update(systems,selected){
  this.activeSystems=systems;this.selectedId=selected;this.viewer.entities.removeAll();const C=this.C;
  if(this.mode==='world'){
   const countries=[...new Set(systems.flatMap(s=>s.events.map(e=>e.country)))];
   for(const country of countries){const coords=exportLocations[country];if(!coords)continue;
    const related=systems.filter(s=>s.events.some(e=>e.country===country));
    this.viewer.entities.add({position:C.Cartesian3.fromDegrees(...coords),label:this.label(country+' · '+related.length+' 체계','#275961'),point:{pixelSize:8,color:C.Color.CYAN,disableDepthTestDistance:Infinity}});
    const positions=Array.from({length:65},(_,i)=>{const t=i/64;return C.Cartesian3.fromDegrees(127.5+(coords[0]-127.5)*t,36.2+(coords[1]-36.2)*t,Math.sin(t*Math.PI)*1800000)});
    this.viewer.entities.add({polyline:{positions,width:2,material:C.Color.fromCssColorString('#93d8cc').withAlpha(.75)}});
   }
   this.viewer.entities.add({position:C.Cartesian3.fromDegrees(127.5,36.2),label:this.label('대한민국','#275961')});
  }else{
   for(const system of systems){const domain=system.domains.includes('space')?'space':system.domains[0],height=system.id==='nuri'?1000:domain==='space'?450000:domain==='air'?7000:1000;
    const entity=this.viewer.entities.add({position:C.Cartesian3.fromDegrees(system.coords[0],system.coords[1],height),label:this.label(system.name,system.id===selected?'#346d64':'#172f40'),point:{pixelSize:system.id===selected?12:6,color:C.Color.fromCssColorString('#ace3c9'),disableDepthTestDistance:Infinity}});entity.systemId=system.id;
   }
   for(const region of regions){const entity=this.viewer.entities.add({position:C.Cartesian3.fromDegrees(region.coords[0],region.coords[1],100),label:{...this.label(region.name+' · 산업','#514b35'),font:'12px sans-serif',pixelOffset:new C.Cartesian2(0,18)}});entity.regionId=region.id;}
  }this.render();
 }
 declutter(){
  const C=this.C,time=this.viewer.clock.currentTime,rectangles=[],world=this.mode==='world',canvas=this.viewer.canvas;let changed=false;
  const entities=this.viewer.entities.values.filter(entity=>entity.label).sort((a,b)=>Number(b.systemId===this.selectedId)-Number(a.systemId===this.selectedId));
  for(const entity of entities){const label=entity.label,point=C.SceneTransforms.worldToWindowCoordinates(this.viewer.scene,entity.position.getValue(time));if(!point)continue;
   this.labelMeasure.font=label.font.getValue(time);const width=this.labelMeasure.measureText(label.text.getValue(time)).width+20;
   const base=entity.regionId?18:-18,x=Math.max(width/2,Math.min(canvas.clientWidth-width/2,point.x));let box,offset;
   for(const delta of world?[0,-28,28,-56,56,-84,84]:[0]){const y=point.y+base+delta,candidate={left:x-width/2,right:x+width/2,top:y-14,bottom:y+14};
    if(!rectangles.some(other=>candidate.left<other.right&&candidate.right>other.left&&candidate.top<other.bottom&&candidate.bottom>other.top)){box=candidate;offset=new C.Cartesian2(x-point.x,base+delta);break;}
   }
   const inside=point.x>=0&&point.x<=canvas.clientWidth&&point.y>=0&&point.y<=canvas.clientHeight,show=inside&&(Boolean(box)||entity.systemId===this.selectedId);
   if(show){rectangles.push(box||{left:x-width/2,right:x+width/2,top:point.y+base-14,bottom:point.y+base+14});offset??=new C.Cartesian2(x-point.x,base);if(!C.Cartesian2.equals(label.pixelOffset.getValue(time),offset)){label.pixelOffset=offset;changed=true;}}
   if(label.show?.getValue(time)!==show){label.show=show;changed=true;}
  }if(changed)this.render();
 }
 home(){if(!this.viewer)return;const C=this.C;this.viewer.camera.cancelFlight();this.viewer.camera.setView({destination:C.Cartesian3.fromDegrees(this.mode==='world'?75:127.6,this.mode==='world'?28:36.5,this.mode==='world'?18000000:1050000),orientation:{heading:0,pitch:C.Math.toRadians(this.mode==='world'?-90:-75),roll:0}});this.render();}
 top(){const C=this.C;this.viewer.camera.setView({orientation:{heading:0,pitch:-Math.PI/2,roll:0}});this.render();}
 zoom(factor){const camera=this.viewer.camera;const amount=camera.positionCartographic.height*Math.abs(1-factor);if(factor<1)camera.zoomIn(amount);else camera.zoomOut(amount);this.render();}
 resize(){this.viewer?.resize();this.render();}
 render(){this.viewer?.scene.requestRender();}
 setInteractive(value){this.viewer.scene.screenSpaceCameraController.enableInputs=value;this.viewer.canvas.style.touchAction=value?'none':'pan-y';}
 destroy(){this.removeLabelLayout?.();this.observer?.disconnect();this.handler?.destroy();this.viewer?.destroy();}
}
