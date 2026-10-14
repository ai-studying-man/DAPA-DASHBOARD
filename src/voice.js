import {getLocale,translateText} from './i18n.js';
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
    this.language=getLocale();this.pendingVoices=new Set();this.utterance=null;
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop()});
    globalThis.addEventListener('pagehide',()=>this.stop());
  }
  stop(message=voiceStatus(this.language,'stopped')){
    this.generation++;
    if(this.utterance){this.utterance.onstart=null;this.utterance.onend=null;this.utterance.onerror=null;this.utterance=null}
    this.synth?.cancel();
    for(const finish of [...this.pendingVoices])finish();
    this.onStatus(translateText(message,this.language));
  }
  setLanguage(code){
    if(!Object.hasOwn(languages,code))return false;
    this.language=code;this.stop(voiceStatus(code,'selected'));return true;
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
    this.stop(voiceStatus(code,'loading'));
    const generation=this.generation;
    let failureReported=false;
    const fail=message=>{
      if(generation!==this.generation||failureReported)return false;
      failureReported=true;
      if(this.utterance){this.utterance.onstart=null;this.utterance.onend=null;this.utterance.onerror=null;this.utterance=null}
      this.onStatus(translateText(message,this.language));
      if(generation===this.generation)onFailure?.();
      return false;
    };
    try{
    if(!this.synth||!globalThis.SpeechSynthesisUtterance)return fail(voiceStatus(code,'unsupported'));
    await this.waitForVoices();
    if(generation!==this.generation)return false;
    if(document.hidden){this.stop();return false}
    const voices=this.synth.getVoices().filter(voice=>voiceMatches(voice,code));
    const voice=voices.find(voice=>voice.lang.toLowerCase().replaceAll('_','-')===selected.locale.toLowerCase())||voices[0];
    if(!voice)return fail(voiceStatus(code,'missing'));
    const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang=voice.lang.replaceAll('_','-');utterance.rate=.92;
    utterance.onstart=()=>{if(generation===this.generation)this.onStatus(voiceStatus(code,'playing'))};
    utterance.onend=()=>{if(generation===this.generation){this.utterance=null;this.onStatus(voiceStatus(code,'done'));onEnd?.()}};
    utterance.onerror=()=>fail(voiceStatus(code,'failed'));
    this.utterance=utterance;
    this.synth.speak(utterance);return true;
    }catch{return fail(voiceStatus(code,'failed'))}
  }
}

const voiceMessages={
 ko:{stopped:'음성 안내를 멈췄습니다.',unsupported:'이 브라우저는 음성을 지원하지 않습니다. 자막으로 확인하세요.',selected:'한국어 안내를 선택했습니다.',loading:'음성을 준비하고 있습니다.',playing:'음성 안내 중 · 자막으로도 확인할 수 있습니다.',done:'음성 안내를 마쳤습니다.',missing:'선택한 언어의 음성이 설치되지 않았습니다. 자막으로 확인하세요.',failed:'음성을 재생하지 못했습니다. 자막으로 확인하거나 다시 들어보세요.'},
 en:{stopped:'Audio guide stopped.',unsupported:'This browser does not support speech. Read the captions instead.',selected:'English guide selected.',loading:'Preparing audio…',playing:'Audio guide playing · captions are also available.',done:'Audio guide finished.',missing:'A voice for this language is not installed. Read the captions instead.',failed:'Audio could not play. Read the captions or try again.'},
 ja:{stopped:'音声案内を停止しました。',unsupported:'このブラウザーは音声に対応していません。字幕をご覧ください。',selected:'日本語の案内を選択しました。',loading:'音声を準備しています…',playing:'音声案内中・字幕でも確認できます。',done:'音声案内が終了しました。',missing:'選択した言語の音声がインストールされていません。字幕をご覧ください。',failed:'音声を再生できませんでした。字幕をご覧いただくか、再試行してください。'},
 zh:{stopped:'语音讲解已停止。',unsupported:'此浏览器不支持语音。请阅读字幕。',selected:'已选择中文讲解。',loading:'正在准备语音…',playing:'正在播放语音讲解 · 也可阅读字幕。',done:'语音讲解结束。',missing:'未安装所选语言的语音。请阅读字幕。',failed:'无法播放语音。请阅读字幕或重试。'}
};
const voiceStatus=(code,state)=>voiceMessages[code][state];
