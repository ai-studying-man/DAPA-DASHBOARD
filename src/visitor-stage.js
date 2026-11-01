import * as T from 'three';
import {ModelStudio} from './model-studio.js';

// Exhibition movement only: no weapon operation, flight dynamics or cockpit model.
export function mountVisitorStage({host,item,simulation,language,retry}){
 const words={ko:['탑승 시점','밖에서 보기','표시된 원 안으로 이동해 보세요. 탑승 시점은 추정 외부 관측 시점입니다.','도착했어요! 다른 장비도 체험해 보세요.'],en:['Onboard view','Exterior view','Move into the ring. Onboard view is an estimated exterior viewpoint.','You made it! Try another equipment.'],ja:['搭乗視点','外から見る','円の中に移動しましょう。搭乗視点は推定の外部視点です。','到着しました！別の装備も体験しましょう。'],zh:['乘员视角','外部视角','移动到圆圈内。乘员视角为估计的外部观察位置。','到达了！试试其他装备吧。']}[language];
 const studio=new ModelStudio(host,{id:item.id,name:item.name},{...item.asset,model:item.model,fitMargin:1.12,studioBadge:language==='ko'?'전시용 외형':'Exhibition exterior',studioNote:language==='ko'?'공개자료를 참고한 외형 재구성입니다.':'Exterior reconstruction from public references.'},retry);
 host.querySelector('.studio-canvas').setAttribute('aria-label',item.name+' 3D');
 const controller=new AbortController(),keys=new Set();let onboard=false,base,center,marker,finished=false,landscapeReady=false,landscape;
 const signal=controller.signal,ui=document.querySelector('.visit-shell');let failed=false;
 const clear=()=>keys.clear();
 const fail=studio.fail.bind(studio);studio.fail=()=>{failed=true;clear();ui.querySelectorAll('[data-move],#visit-view,#visit-reset').forEach(button=>button.disabled=true);fail()};
 const mappings={ArrowUp:'forward',w:'forward',ArrowDown:'back',s:'back',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
 if(simulation){
  addEventListener('keydown',event=>{if(failed||event.target.matches('input,select,textarea')||!mappings[event.key])return;event.preventDefault();keys.add(mappings[event.key])},{signal});
  addEventListener('keyup',event=>keys.delete(mappings[event.key]),{signal});
  addEventListener('blur',clear,{signal});document.addEventListener('visibilitychange',clear,{signal});
  ui.querySelectorAll('[data-move]').forEach(button=>{
   button.addEventListener('pointerdown',event=>{if(failed)return;event.preventDefault();button.setPointerCapture(event.pointerId);keys.add(button.dataset.move)},{signal});
   for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,()=>keys.delete(button.dataset.move),{signal});
  });
  ui.querySelector('#visit-view').onclick=()=>{onboard=!onboard;studio.controls.enabled=!onboard;ui.querySelector('#visit-view').textContent=words[onboard?1:0];if(!onboard){studio.center.copy(center).add(studio.root.position.clone().sub(base));studio.setView('home')}};
  ui.querySelector('#visit-reset').onclick=()=>{clear();studio.root.position.copy(base);studio.root.rotation.y=0;marker.material.color.setHex(0x145caa);studio.center.copy(center);onboard=false;finished=false;studio.controls.enabled=true;studio.setView('home');ui.querySelector('#visit-view').textContent=words[0];progress(false)};
 }
 function progress(done){const node=ui.querySelector('#visit-progress');if(node)node.textContent=words[done?3:2]}
 const draw=studio.draw.bind(studio);let previous;
 studio.draw=time=>{
  if(studio.root&&!landscapeReady){landscapeReady=true}
  if(simulation&&studio.root&&!failed){
   const dt=previous===undefined?0:Math.min((time-previous)/1000,.05);previous=time;
   if(!base){
    base=studio.root.position.clone();center=studio.center.clone();
    marker=new T.Mesh(new T.RingGeometry(studio.radius*.65,studio.radius*.8,48),new T.MeshBasicMaterial({color:0x145caa,side:T.DoubleSide}));marker.rotation.x=-Math.PI/2;marker.position.set(0,.02,-studio.radius*2);studio.scene.add(marker);
    ui.querySelectorAll('[data-move],#visit-view,#visit-reset').forEach(button=>button.disabled=false);progress(false);
   }
   const turn=Number(keys.has('left'))-Number(keys.has('right')),forward=Number(keys.has('forward'))-Number(keys.has('back'));
   studio.root.rotation.y+=turn*dt;const speed=studio.radius*.8;
   const delta=new T.Vector3(-Math.sin(studio.root.rotation.y)*forward*speed*dt,0,-Math.cos(studio.root.rotation.y)*forward*speed*dt);
   const old=studio.root.position.clone(),limit=studio.radius*4;studio.root.position.add(delta);studio.root.position.x=T.MathUtils.clamp(studio.root.position.x,-limit,limit);studio.root.position.z=T.MathUtils.clamp(studio.root.position.z,-limit,limit);
   const moved=studio.root.position.clone().sub(old);studio.center.copy(center).add(studio.root.position.clone().sub(base));
   if(onboard){const eye=studio.center.clone().add(new T.Vector3(0,studio.radius*.35,0));studio.camera.position.copy(eye);studio.camera.lookAt(eye.clone().add(new T.Vector3(-Math.sin(studio.root.rotation.y),0,-Math.cos(studio.root.rotation.y)).multiplyScalar(studio.radius*2)));studio.controls.target.copy(eye.clone().add(new T.Vector3(-Math.sin(studio.root.rotation.y),0,-Math.cos(studio.root.rotation.y))))}
   else{studio.camera.position.add(moved);studio.controls.target.copy(studio.center)}
   if(!finished&&Math.hypot(studio.root.position.x-marker.position.x,studio.root.position.z-marker.position.z)<studio.radius*.8){finished=true;marker.material.color.setHex(0x176348);progress(true)}
  }
  if(landscape?.userData.contactShadow){landscape.userData.contactShadow.position.copy(studio.root.position);landscape.userData.contactShadow.rotation.y=studio.root.rotation.y}
  draw(time);
 };
 return {destroy(){controller.abort();clear();studio.destroy()}};
}
