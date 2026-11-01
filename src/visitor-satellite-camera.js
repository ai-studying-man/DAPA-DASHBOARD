export class SatelliteCamera{
 constructor(stage){this.stage=stage;this.heading=-.65;this.pitch=-.3;this.context=false;this.onboard=false;this.pointers=new Map()}
 get target(){const s=this.stage;return s.model?.boundingSphere.center||s.anchor}
 fit(){const s=this.stage;if(!s.viewer||!s.anchor)return;const aspect=s.viewer.canvas.clientWidth/Math.max(1,s.viewer.canvas.clientHeight),fov=s.viewer.camera.frustum.fov;const vertical=aspect>1?2*Math.atan(Math.tan(fov/2)/aspect):fov,horizontal=aspect>1?fov:2*Math.atan(Math.tan(fov/2)*aspect);const margin=s.item.id==='nuri'&&aspect<1.3?1.9:1.22;this.range=Math.max(8,(s.model?.boundingSphere.radius||300)/Math.sin(Math.min(vertical,horizontal)/2)*margin);this.update()}
 update(){
  const s=this.stage;if(!s.viewer||!s.anchor||s.disposed)return;const C=s.C,camera=s.viewer.camera;
  camera.lookAtTransform(C.Matrix4.IDENTITY);
  if(this.onboard&&s.model){
   const heights={k2:3.25,k9:3.75},height=heights[s.item.id]||s.model.boundingSphere.radius*1.4;
   const eye=C.Matrix4.multiplyByPoint(s.model.modelMatrix,new C.Cartesian3(-.65,-1.2,height),new C.Cartesian3());
   camera.setView({destination:eye,orientation:{heading:Math.PI+s.heading,pitch:this.pitch,roll:0}});
  }else{
   const range=this.context?Math.max(2200,this.range*8):this.range;
   camera.lookAt(this.target,new C.HeadingPitchRange(this.heading,this.context?-.65:this.pitch,range));camera.lookAtTransform(C.Matrix4.IDENTITY);
  }
  s.viewer.scene.requestRender();
 }
 bind(){
  const s=this.stage,canvas=s.viewer.canvas,signal=s.events.signal;canvas.tabIndex=0;canvas.style.touchAction='none';
  s.viewer.scene.screenSpaceCameraController.enableInputs=false;
  canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);canvas.focus();this.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY})},{signal});
  canvas.addEventListener('pointermove',event=>{
   const previous=this.pointers.get(event.pointerId);if(!previous)return;
   const current={x:event.clientX,y:event.clientY};
   if(this.pointers.size===1){this.heading+=(current.x-previous.x)*.006;this.pitch=Math.max(-1.35,Math.min(.2,this.pitch-(current.y-previous.y)*.004))}
   else{const other=[...this.pointers.entries()].find(([id])=>id!==event.pointerId)?.[1];if(other){const old=Math.hypot(previous.x-other.x,previous.y-other.y),next=Math.hypot(current.x-other.x,current.y-other.y);if(next>4)this.range=Math.max(3,Math.min(2000000,this.range*old/next))}}
   this.pointers.set(event.pointerId,current);this.update();
  },{signal});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,event=>this.pointers.delete(event.pointerId),{signal});
  canvas.addEventListener('wheel',event=>{event.preventDefault();this.range=Math.max(3,Math.min(2000000,this.range*Math.exp(event.deltaY*.001)));this.update()},{signal,passive:false});
  s.host.querySelector('[data-map-context]').onclick=event=>{this.context=!this.context;event.currentTarget.textContent=this.context?s.text.close:s.text.map;this.update()};
  const view=document.querySelector('#visit-view');
  if(view)view.onclick=()=>{this.onboard=!this.onboard;this.context=false;view.textContent=this.onboard?s.text.outside:s.text.onboard;this.pitch=this.onboard?-.12:-.3;this.update()};
 }
 reset(){this.heading=-.65;this.pitch=-.3;this.context=false;this.onboard=false;this.fit()}
}
