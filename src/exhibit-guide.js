import {exhibitGuides,guideLanguages,foreignGuideExample} from './exhibit-guide-data.js';

const words={
 ko:{heading:'자료로 살펴보는 3D',language:'안내 언어',intro:'전체 외형',play:'부위 안내 재생',listen:'현재 설명 듣기',stop:'안내 중지',source:'부위 설명 근거',example:'실제 구현 사례',scope:'공개 자료 기반 외형 재구성 · 관찰 좌표는 추정 · 제조사 CAD·검증 실내 아님',ready:'언어별 음성 확인 중…',available:'음성 사용 가능',missing:'음성 미설치 · 자막 제공',done:'부위 관람을 마쳤습니다.'},
 en:{heading:'Explore the sourced 3D model',language:'Guide language',intro:'Full exterior',play:'Play component tour',listen:'Listen to this caption',stop:'Stop guide',source:'Component reference',example:'Real implementation example',scope:'Exterior reconstructed from public references · approximate observation points · not manufacturer CAD or a validated interior',ready:'Checking language voices…',available:'Voice available',missing:'Voice unavailable · captions available',done:'Component tour complete.'},
 ja:{heading:'公開資料で見る3D',language:'案内言語',intro:'外観全体',play:'各部の案内を再生',listen:'この説明を聞く',stop:'案内を停止',source:'各部説明の資料',example:'実際の導入事例',scope:'公開資料から再構成した外観・観察座標は推定・メーカーCADや検証済みの内部ではありません',ready:'音声を確認しています…',available:'音声利用可能',missing:'音声未導入・字幕を表示',done:'各部の見学が終了しました。'},
 zh:{heading:'依据公开资料观察3D',language:'讲解语言',intro:'整体外观',play:'播放部件导览',listen:'朗读当前说明',stop:'停止导览',source:'部件说明来源',example:'实际应用案例',scope:'依据公开资料重建的外观 · 观察坐标为估计值 · 非制造商CAD或经验证的内部结构',ready:'正在检查语音…',available:'语音可用',missing:'语音未安装 · 提供字幕',done:'部件导览已结束。'}
};
const speechFailed={ko:'음성을 재생하지 못했습니다. 자막으로 부위를 선택해 주세요.',en:'Audio could not be played. Explore components using the captions.',ja:'音声を再生できませんでした。字幕で各部を選択してください。',zh:'无法播放语音。请通过字幕选择部件。'};

export class ExhibitGuide{
 constructor(dialog,voice,inspect){
  this.dialog=dialog;this.voice=voice;this.inspect=inspect;this.language=voice.language||'ko';this.version=0;this.index=-1;
  this.panel=document.createElement('section');this.panel.className='exhibit-guide';this.panel.hidden=true;
  this.panel.addEventListener('change',e=>{if(e.target.matches('[data-guide-language]')){this.stop();this.language=e.target.value;this.voice.setLanguage(this.language);this.render();this.panel.querySelector('[data-guide-language]').focus();this.checkVoices();const c=this.data.components[this.index];if(c)this.inspect({...c,label:c.title[this.language]});}});
  this.panel.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;
   if(b.dataset.guideComponent!==undefined)this.select(Number(b.dataset.guideComponent));
   if(b.hasAttribute('data-guide-play'))this.play();
   if(b.hasAttribute('data-guide-listen'))this.speak();
   if(b.hasAttribute('data-guide-stop'))this.stop();
  });
  dialog.addEventListener('close',()=>this.stop());
  dialog.addEventListener('click',e=>{if(e.target.closest('[data-demo-mode],[data-demo-stop],[data-demo-play],[data-scene-view],[data-model-home],[data-demo-related]'))this.stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop();});
 }
 mount(system){this.stop();this.voice.setLanguage(this.language);this.system=system;this.data=exhibitGuides[system.id];this.index=-1;this.dialog.querySelector('.demo-inspector').prepend(this.panel);this.panel.hidden=!this.data;if(this.data){this.render();this.checkVoices();}}
 render(){
  const w=words[this.language],locale=guideLanguages[this.language].locale,c=this.data.components[this.index];
  this.panel.lang=locale;
  this.panel.innerHTML=`<div class="guide-heading"><h3>${w.heading}</h3><label>${w.language}<select data-guide-language>${Object.entries(guideLanguages).map(([code,l])=>`<option value="${code}" ${code===this.language?'selected':''}>${l.label}</option>`).join('')}</select></label></div><p class="micro" data-guide-voice role="status">${w.ready}</p><div class="guide-components" role="group" aria-label="${w.heading}"><button type="button" class="action" data-guide-component="-1" aria-pressed="${this.index===-1}">${w.intro}</button>${this.data.components.map((p,i)=>`<button type="button" class="action" data-guide-component="${i}" aria-pressed="${this.index===i}">${i+1}. ${p.title[this.language]}</button>`).join('')}</div><div class="guide-caption"><strong>${c?c.title[this.language]:this.system.english}</strong><p data-guide-caption>${this.caption()}</p>${c?`<a href="${c.source}" target="_blank" rel="noopener noreferrer">${w.source}</a>`:''}</div><div class="voice-controls"><button type="button" class="primary-action" data-guide-play>${w.play}</button><button type="button" class="action" data-guide-listen>${w.listen}</button><button type="button" class="action" data-guide-stop>${w.stop}</button></div><p class="micro">${w.scope}</p><details class="guide-example"><summary>${w.example} · ${this.data.benchmark.title}</summary><p>${this.data.benchmark.text[this.language]}</p><a href="${this.data.benchmark.url}" target="_blank" rel="noopener noreferrer">${this.data.benchmark.title}</a></details>`;
  this.panel.insertAdjacentHTML('beforeend',`<details class="guide-example"><summary>${w.example} · ${foreignGuideExample.title}</summary><p>${foreignGuideExample.text[this.language]}</p><a href="${foreignGuideExample.url}" target="_blank" rel="noopener noreferrer">${foreignGuideExample.title}</a></details>`);
 }
 caption(){return this.index<0?this.data.intro[this.language]:this.data.components[this.index].text[this.language];}
 async checkVoices(){const version=this.version,available=await this.voice.availableLanguages();if(version!==this.version||!this.data)return;const w=words[this.language],status=this.panel.querySelector('[data-guide-voice]');if(status)status.textContent=guideLanguages[this.language].label+' · '+(available[this.language]?w.available:w.missing);}
 stop(){this.version++;this.running=false;this.voice.stop();this.panel.querySelector('[data-guide-play]')?.setAttribute('aria-pressed','false');}
 async select(index){
  this.stop();this.index=index;this.render();this.panel.querySelector(`[data-guide-component="${index}"]`).focus();this.checkVoices();const version=this.version;
  const c=this.data.components[index];await this.inspect(c?{...c,label:c.title[this.language]}:null);
  if(version!==this.version)return;
 }
 speak(){this.stop();const version=this.version;this.voice.speak(this.caption(),undefined,()=>{if(version===this.version)this.panel.querySelector('[data-guide-voice]').textContent=speechFailed[this.language];});}
 async play(){
  this.stop();this.running=true;const version=this.version;
  const next=async(index)=>{
   if(version!==this.version||!this.dialog.open||document.hidden)return;
   this.index=index;this.render();this.panel.querySelector('[data-guide-play]').setAttribute('aria-pressed','true');this.checkVoices();
   const c=this.data.components[index];const ready=await this.inspect({...c,label:c.title[this.language]});
   if(version!==this.version)return;if(!ready){this.stop();return;}
   const finish=()=>{if(version!==this.version)return;this.running=false;this.panel.querySelector('[data-guide-play]')?.setAttribute('aria-pressed','false');};
   const started=await this.voice.speak(this.caption(),()=>{if(version!==this.version)return;if(index+1<this.data.components.length)next(index+1);else{finish();this.panel.querySelector('[data-guide-voice]').textContent=words[this.language].done;}},()=>{finish();if(version===this.version)this.panel.querySelector('[data-guide-voice]').textContent=speechFailed[this.language];});
   if(!started&&version===this.version){this.running=false;this.panel.querySelector('[data-guide-play]')?.setAttribute('aria-pressed','false');}
  };
  await next(0);
 }
}
