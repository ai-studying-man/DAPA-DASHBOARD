// Reuse the same licensed GLB in the Three.js studio and real geospatial viewer.
export function mountVisitorStage(options){
 const {host,item,simulation,language}=options;
 const ko=language==='ko';let stage,disposed=false,version=0;
 let mode='satellite';
 const bar=document.createElement('div');bar.className='visit-renderer-bar';
 const note=document.createElement('span');note.setAttribute('role','status');
 const toggle=document.createElement('button');toggle.type='button';bar.append(note,toggle);
 host.before(bar);
 async function mount(){
  const ticket=++version;stage?.destroy();stage=null;host.replaceChildren();
  host.dataset.renderer=mode;
  note.textContent='';
  toggle.textContent=mode==='three'?(ko?'실제 지형':'Terrain'):(ko?'모델만 보기':'Model only');
  toggle.disabled=!item.model||item.id==='nuri';
  document.querySelectorAll('[data-move],#visit-view,#visit-reset').forEach(button=>button.disabled=true);
  try{
   const module=mode==='three'?await import('./visitor-stage.js'):await import('./visitor-satellite-stage.js');
   if(disposed||ticket!==version)return;
   stage=module.mountVisitorStage({...options,retry:mount});
  }catch{if(!disposed&&ticket===version)note.textContent=ko?'3D 연결 실패 · 다른 보기로 전환해 주세요.':'3D failed. Try the other view.'}
 }
 toggle.onclick=()=>{mode=mode==='three'?'satellite':'three';mount()};mount();
 return {destroy(){disposed=true;version++;stage?.destroy();bar.remove()}};
}
