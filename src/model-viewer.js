import {refreshLocalization} from './i18n.js';
import {equipmentAssets} from './equipment-assets.js';
let sdkPromise;
function loadSDK(){return sdkPromise??=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';script.onload=resolve;script.onerror=()=>reject(new Error('viewer unavailable'));document.head.append(script)})}
export class ModelViewer {
 constructor(){this.version=0;this.observer=new ResizeObserver(()=>this.fit())}
 fit(){if(!this.api||!this.initialCamera||!this.host)return;const {position,target}=this.initialCamera;const scale=this.system.id==='k2'?2.3:1.5;this.api.setCameraLookAt(position.map((p,i)=>target[i]+(p-target[i])*scale),target,0);}

 attach(host,system){
  if(!host||!system)return;
  const version=++this.version;this.native?.destroy();this.native=null;
  if(this.frame?.isConnected&&this.frame.contentWindow)this.api?.stop();this.api=null;this.frame=null;this.initialCamera=null;clearTimeout(this.timeout);this.observer.disconnect();this.host=host;this.observer.observe(host);this.system=system;this.asset=equipmentAssets[system.id];host.removeAttribute('role');host.setAttribute('aria-label',system.name+' 장비 외형 자료');
  if(this.asset?.studio&&!host.classList.contains('scene-asset')){
   host.replaceChildren();host.textContent='3D 모델링 체험 준비 중…';
   import('./model-studio.js').then(({ModelStudio})=>{if(version!==this.version||!host.isConnected)return;this.native=new ModelStudio(host,system,this.asset,()=>this.attach(host,system));}).catch(()=>{if(version===this.version){host.textContent='3D 모듈을 불러오지 못했습니다. 새로고침 후 다시 시도하세요.';}});return;
  }
  const asset=this.asset?.studio?{...this.asset,kind:'photo',image:this.asset.referencePhoto,note:'실사 비교 사진 · 지도 위 외형은 전시용 재구성',author:this.asset.photoCredit,license:'',url:this.asset.photoUrl}:this.asset;host.replaceChildren();
  const stage=document.createElement('div');stage.className='equipment-visual';
  if(asset?.kind==='3d'){
   const frame=document.createElement('iframe');this.frame=frame;frame.title=system.name+' 공개 3D 외형';frame.allow='fullscreen; xr-spatial-tracking';frame.allowFullscreen=true;stage.append(frame);
   const status=document.createElement('p');status.className='micro equipment-loading';status.setAttribute('role','status');status.textContent='온라인 3D 연결 중…';stage.append(status);
   this.timeout=setTimeout(()=>{if(frame.isConnected)status.textContent='연결이 지연됩니다. 인터넷 연결을 확인하거나 아래 원본을 열어주세요.'},20000);
   loadSDK().then(()=>{if(!frame.isConnected)return;new window.Sketchfab(frame).init(asset.uid,{autostart:1,preload:1,ui_theme:'light',success:api=>{if(!frame.isConnected)return;this.api=api;api.start();api.addEventListener('viewerready',()=>{if(!frame.isConnected)return;clearTimeout(this.timeout);status.remove();stage.dataset.ready='true';setTimeout(()=>{if(frame.isConnected)api.getCameraLookAt((error,camera)=>{if(!error&&frame.isConnected){this.initialCamera=structuredClone(camera);this.fit()}})},2500)});},error:()=>{clearTimeout(this.timeout);status.textContent='3D 연결 실패 · 아래 원본을 열어주세요.'}})}).catch(()=>{clearTimeout(this.timeout);status.textContent='3D 연결 실패 · 인터넷 연결과 아래 원본을 확인하세요.'});
  }else if(asset?.kind==='photo'){
   const img=document.createElement('img');img.src=asset.image;img.alt=system.name+' 실제 장비 사진';img.addEventListener('error',()=>{stage.textContent='사진을 불러오지 못했습니다. 아래 원문에서 확인하세요.'});stage.append(img);
  }else{
   stage.classList.add('equipment-pending');const title=document.createElement('strong');title.textContent=system.name+' · 실물 자료 준비 중';const text=document.createElement('p');text.textContent='정확한 외형과 전시 사용권을 확인한 자료가 필요합니다. 역할·사업·참여기관과 공개 근거는 오른쪽 또는 아래에서 탐색하세요.';stage.append(title,text);
  }
  host.append(stage);
  const caption=document.createElement('p');caption.className='equipment-credit micro';caption.append(document.createTextNode(asset?asset.note+' · 인터넷 연결 필요 · '+asset.author+' · '+asset.license+' · ': '임의 도형을 실제 장비로 표시하지 않습니다. '));
  if(asset){const a=document.createElement('a');a.href=asset.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='원본·사용 조건 확인';caption.append(a)}host.append(caption);refreshLocalization();
 }
 destroy(){this.version++;this.native?.destroy();this.native=null;this.stop();clearTimeout(this.timeout);this.observer.disconnect();this.frame?.remove();this.frame=null;this.api=null;this.host=null;}
 setMode(){}
 stop(){this.native?.stop();if(this.frame?.isConnected&&this.frame.contentWindow)this.api?.pause();}
 play(onStatus,role){onStatus(role+' · 이 자산에는 검증된 동작 애니메이션이 없습니다. 외형과 관계를 살펴보세요.');return false}
 home(){if(this.native){this.native.setView('home');return;}if(this.api&&this.initialCamera){this.fit();this.api.start()}else if(this.host&&this.system)this.attach(this.host,this.system)}
}
