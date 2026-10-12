const languages={
  ko:{locale:'ko-KR',name:'한국어'},
  en:{locale:'en-US',name:'영어'},
  ja:{locale:'ja-JP',name:'일본어'},
  zh:{locale:'zh-CN',name:'중국어'},
};
const voiceMatches=(voice,code)=>{
  const locale=voice.lang.toLowerCase().replaceAll('_','-');
  return locale===code||locale.startsWith(`${code}-`);
};

export class SpeechGuide {
  constructor(onStatus){
    this.onStatus=onStatus;this.generation=0;this.synth=globalThis.speechSynthesis;
    this.language='ko';this.pendingVoices=new Set();this.utterance=null;
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop()});
    globalThis.addEventListener('pagehide',()=>this.stop());
  }
  stop(message='음성 안내를 멈췄습니다.'){
    this.generation++;
    if(this.utterance){this.utterance.onstart=null;this.utterance.onend=null;this.utterance.onerror=null;this.utterance=null}
    this.synth?.cancel();
    for(const finish of [...this.pendingVoices])finish();
    this.onStatus(message);
  }
  setLanguage(code){
    if(!Object.hasOwn(languages,code))return false;
    this.stop(`${languages[code].name} 음성 안내를 선택했습니다.`);
    this.language=code;return true;
  }
  async waitForVoices(){
    if(!this.synth||this.synth.getVoices().length)return;
    await new Promise(resolve=>{
      const finish=()=>{clearTimeout(timer);this.synth.removeEventListener('voiceschanged',finish);this.pendingVoices.delete(finish);resolve()};
      const timer=setTimeout(finish,1500);
      this.pendingVoices.add(finish);this.synth.addEventListener('voiceschanged',finish);
    });
  }
  async availableLanguages(){
    await this.waitForVoices();
    const voices=this.synth?.getVoices()||[];
    const supported=Boolean(this.synth&&globalThis.SpeechSynthesisUtterance);
    return Object.fromEntries(Object.keys(languages).map(code=>[code,supported&&voices.some(voice=>voiceMatches(voice,code))]));
  }
  async speak(text,onEnd,onFailure){
    const code=this.language,selected=languages[code];
    this.stop(`${selected.name} 음성을 준비하고 있습니다.`);
    const generation=this.generation;
    let failureReported=false;
    const fail=message=>{
      if(generation!==this.generation||failureReported)return false;
      failureReported=true;
      if(this.utterance){this.utterance.onstart=null;this.utterance.onend=null;this.utterance.onerror=null;this.utterance=null}
      this.onStatus(message);
      if(generation===this.generation)onFailure?.();
      return false;
    };
    try{
    if(!this.synth||!globalThis.SpeechSynthesisUtterance)return fail('이 브라우저는 음성을 지원하지 않습니다. 아래 글로 안내를 확인하세요.');
    await this.waitForVoices();
    if(generation!==this.generation)return false;
    if(document.hidden){this.stop();return false}
    const voices=this.synth.getVoices().filter(voice=>voiceMatches(voice,code));
    const voice=voices.find(voice=>voice.lang.toLowerCase().replaceAll('_','-')===selected.locale.toLowerCase())||voices[0];
    if(!voice)return fail(`${selected.name} 음성이 설치되지 않았습니다. 글로 안내를 확인하거나 사용 가능한 언어를 선택하세요.`);
    const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang=voice.lang.replaceAll('_','-');utterance.rate=.92;
    utterance.onstart=()=>{if(generation===this.generation)this.onStatus(`${selected.name} 음성 안내 중 · 자막으로도 확인할 수 있습니다.`)};
    utterance.onend=()=>{if(generation===this.generation){this.utterance=null;this.onStatus(`${selected.name} 음성 안내를 마쳤습니다.`);onEnd?.()}};
    utterance.onerror=()=>fail(`${selected.name} 음성을 재생하지 못했습니다. 글로 안내를 확인하거나 다시 들어보세요.`);
    this.utterance=utterance;
    this.synth.speak(utterance);return true;
    }catch{return fail(`${selected.name} 음성을 재생하지 못했습니다. 글로 안내를 확인하거나 다시 들어보세요.`)}
  }
}
