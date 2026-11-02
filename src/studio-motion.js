import {AnimationMixer,Vector2,Raycaster,Box3,Vector3} from 'three';
import {studioText as t} from './model-studio-ui.js';

// Shared by K2/K9 inspection: GLB clips own motion; manual pivots keep their existing controls.
export class StudioMotion{
 constructor(studio,clips){
  this.studio=studio;this.clips=clips;this.mixer=new AnimationMixer(studio.root);
  const select=studio.ui.querySelector('[data-studio-clip]');
  select.parentElement.hidden=clips.length===0;
  select.replaceChildren(...clips.map(clip=>{const option=document.createElement('option');option.value=clip.name;option.textContent=t(clip.name);return option}));
  const canvas=studio.renderer.domElement,signal=studio.events.signal;
  const active=new Set();
  canvas.addEventListener('pointerdown',event=>{active.add(event.pointerId);this.start=active.size===1?{x:event.clientX,y:event.clientY,id:event.pointerId}:null},{signal});
  canvas.addEventListener('pointercancel',event=>{active.delete(event.pointerId);this.start=null},{signal});
  canvas.addEventListener('pointerup',event=>{
   active.delete(event.pointerId);const start=this.start;this.start=null;
   if(!start||start.id!==event.pointerId||Math.hypot(event.clientX-start.x,event.clientY-start.y)>5)return;
   const rect=canvas.getBoundingClientRect(),ray=new Raycaster();
   ray.setFromCamera(new Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),studio.camera);
   let object=ray.intersectObject(studio.root,true)[0]?.object;
   while(object){const entry=Object.entries(studio.parts).find(([,part])=>part===object);if(entry){studio.selectPart(entry[0]);studio.ui.querySelector('[data-studio-part]').value=entry[0];break}object=object.parent;}
  },{signal});
  select.addEventListener('change',()=>studio.resetParts(),{signal});
 }
 play(){
  if(this.studio.reduced.matches||!this.clips.length)return false;
  const name=this.studio.ui.querySelector('[data-studio-clip]').value;
  this.mixer.clipAction(this.clips.find(clip=>clip.name===name)).reset().play();this.active=true;return true;
 }
 update(dt){if(this.active){this.mixer.update(dt);if(this.studio.selectedPart)this.studio.selection.setFromObject(this.studio.selectedPart)}}
 stop(){this.mixer.stopAllAction();this.active=false;}
 focus(part){
  if(!part)return;const center=new Box3().setFromObject(part).getCenter(new Vector3());
  const offset=this.studio.camera.position.clone().sub(this.studio.controls.target);
  this.studio.controls.target.copy(center);this.studio.camera.position.copy(center).add(offset);this.studio.controls.update();
 }
 destroy(){this.stop();this.mixer.uncacheRoot(this.studio.root)}
}
