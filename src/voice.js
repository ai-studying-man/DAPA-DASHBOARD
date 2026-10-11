export class SpeechGuide {
  constructor(onStatus) { this.onStatus=onStatus; this.generation=0; this.synth=globalThis.speechSynthesis; }
  stop(message='음성 안내를 멈췄습니다.') { this.generation++; this.synth?.cancel(); this.onStatus(message); }
  async speak(text,onEnd) {
    this.stop('한국어 음성을 준비하고 있습니다.');
    const generation=this.generation;
    if(!this.synth || !globalThis.SpeechSynthesisUtterance) { this.onStatus('이 브라우저는 음성을 지원하지 않습니다. 아래 글로 안내를 확인하세요.'); return false; }
    if(!this.synth.getVoices().length) await new Promise(resolve=>{
      const finish=()=>{clearTimeout(timer);this.synth.removeEventListener('voiceschanged',finish);resolve()};
      const timer=setTimeout(finish,1500);this.synth.addEventListener('voiceschanged',finish);
    });
    if(generation!==this.generation)return false;
    const voice=this.synth.getVoices().find(v=>v.lang.toLowerCase().startsWith('ko'));
    if(!voice) { this.onStatus('한국어 음성이 설치되지 않았습니다. 글로 안내를 확인하거나 다음 체계를 선택하세요.'); return false; }
    const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang='ko-KR';utterance.rate=0.92;
    utterance.onstart=()=>{if(generation===this.generation)this.onStatus('음성 안내 중 · 자막으로도 확인할 수 있습니다.')};
    utterance.onend=()=>{if(generation===this.generation){this.onStatus('음성 안내를 마쳤습니다.');onEnd?.()}};
    utterance.onerror=()=>{if(generation===this.generation)this.onStatus('음성을 재생하지 못했습니다. 글로 안내를 확인하거나 다시 들어보세요.')};
    this.utterance=utterance;this.synth.speak(utterance);return true;
  }
}
