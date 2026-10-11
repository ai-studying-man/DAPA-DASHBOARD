import { initStory, transitionPage } from './story-controller.js';
import {environmentFor,environments} from './environment-data.js';
import {equipmentAssets} from './equipment-assets.js';
import { demoInspector, demoModes } from './system-demo.js';
import { SpeechGuide } from './voice.js';
import { narration, regionPicker } from './exhibition.js';
import { regions, profiles, tourStops } from './exhibition-data.js';
import './exhibition.css';
import { timeline } from './journey.js';
import './journey.css';
import './fonts.css';
import './styles.css';
import './responsive.css';
import './story.css';
import { systems, modes } from './data.js';
import { card, detail, graph, showcase } from './components.js';
import { shell } from './shell.js';

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const state = { home: !params.has('system'), region: null, classification: 'branch', mode: 'korea', selected: systems.some((s) => s.id === params.get('system')) ? params.get('system') : 'k2', domain: 'all', branch: '전체', query: '', layout: 'auto', dock: 'auto', density: 'standard' };
let demoMode='environment', demoOpener,environmentViewer,environmentPromise,environmentPreset,demoVersion=0;
let viewer, viewerPromise, tourIndex=0, tourAdvanceTimer, voiceMessage='버튼을 누르면 한국어 음성으로 안내합니다.';
const voice=new SpeechGuide(message=>{voiceMessage=message;document.querySelectorAll('[data-voice-status]').forEach(e=>e.textContent=message)});
let storyController, menuHidden=false, menuBeforeDemo=false;
let map, mapReady = false, mapLoading = false, toastTimer;
function toast(message) {
  $('#toast').textContent = message; $('#toast').hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4000);
}
function filtered() {
  const query = state.query.trim().toLowerCase();
  return systems.filter((s) => (!state.region || regions.find(r=>r.id===state.region).systems.includes(s.id)) && (state.domain === 'all' || s.domains.includes(state.domain)) && (state.branch === '전체' || s.branches.includes(state.branch)) && (!query || [s.name, s.subtitle, s.english, s.mission, s.maker, s.project, ...s.branches, ...s.events.map((e) => e.country)].join(' ').toLowerCase().includes(query)));
}
function render() {
  $('.shell').dataset.home = String(state.home);
  storyController?.setHome(state.home);
  updateMenu();
  document.querySelectorAll('[data-classification]').forEach(b=>{const active=b.dataset.classification===state.classification;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1});
  $('#branch-categories').hidden=state.classification!=='branch';$('#environment-categories').hidden=state.classification!=='environment';
  $('#region-picker').hidden=state.mode!=='korea';$('#region-picker').innerHTML=regionPicker(state.region);
  const items = filtered();
  if (!items.some((s) => s.id === state.selected)) state.selected = items[0]?.id || null;
  const selected = items.find((s) => s.id === state.selected);
  const mode = modes.find((m) => m.id === state.mode);
  $('#mode-title').textContent = mode.label; $('#mode-description').textContent = mode.description;
  document.querySelectorAll('[data-mode]').forEach((b) => { b.classList.toggle('selected', !state.home && b.dataset.mode === state.mode); b.setAttribute('aria-pressed', String(!state.home && b.dataset.mode === state.mode)); });
  document.querySelectorAll('.domain-chips [data-domain]').forEach((b) => { b.classList.toggle('selected', b.dataset.domain === state.domain); b.setAttribute('aria-pressed', String(b.dataset.domain === state.domain)); });
  $('#branch').value = state.branch; $('#search').value = state.query;
  $('#collection').innerHTML = items.length ? items.map((s) => card(s, state.selected)).join('') : '<div class="empty-inline">검색 결과가 없습니다. 검색어를 바꾸거나 필터를 초기화해 주세요.</div>';
  $('#collection-count').textContent = String(items.length).padStart(2, '0');
  const events = items.flatMap((s) => s.events);
  $('#result-count').textContent = state.mode === 'world' ? `${new Set(events.map((e) => e.country)).size}개국 · ${events.length}개 계약 사건` : `${items.length}개 체계 · 선택해서 탐색`;
  $('#detail').innerHTML = detail(selected, state.mode);
  if(!state.home && selected) syncViewer();
  document.querySelectorAll('[data-voice-status]').forEach(e=>e.textContent=voiceMessage);
  const isMap = ['korea', 'world'].includes(state.mode);
  $('#map-host').hidden = !isMap; $('#map-toolbar').hidden = !isMap;
  $('#graph-view').hidden = state.mode !== 'graph'; $('#list-view').hidden = state.mode !== 'list';
  $('#timeline-view').hidden = state.mode !== 'timeline';
  if(state.mode === 'timeline') $('#timeline-view').innerHTML = timeline(selected);
  if(!state.home && isMap) ensureMap();
  if (state.mode === 'graph') $('#graph-view').innerHTML = graph(selected);
  if (state.mode === 'list') $('#list-view').innerHTML = items.length ? `<div class="catalog-intro"><h2>이름을 몰라도 찾아보세요</h2><p>영역이나 군을 선택하면 관련 체계를 모아볼 수 있습니다.</p></div><div class="catalog-grid">${items.map((s) => card(s, state.selected)).join('')}</div>` : '<div class="empty"><h2>검색 결과가 없습니다</h2><p>다른 검색어나 영역으로 찾아보세요.</p><button class="action" data-clear>필터 초기화</button></div>';
  $('#stage-badge').textContent = { korea: 'PENINSULA / 3D', world: 'GLOBAL CONNECTIONS', graph: 'KNOWLEDGE GRAPH', list: 'SYSTEM COLLECTION', timeline: 'PUBLIC RECORD / TIMELINE' }[state.mode];
  $('#map-disclaimer').hidden = state.mode === 'timeline';
  $('#map-disclaimer').textContent = state.mode === 'world' ? '연결선은 계약 관계입니다 · 실제 운송 경로가 아닙니다 · 수록 사례 1개국' : state.mode === 'graph' ? '공개 근거와 설명용 분류의 연결 · 완전한 전체 사업 온톨로지가 아닙니다' : state.mode === 'list' ? '공개자료로 확인한 대표 사례 · 선택 항목의 근거와 발표일을 확인하세요' : '공개 고도 기반 지형 · 높이 과장 · 장비 위치는 전시용 · 실제 배치·궤도가 아닙니다';
  if (mapReady) map.requestedMode=state.mode;
  if (mapReady && isMap) {
    if (map.mode !== state.mode) {
      const targetMode = state.mode;
      map.load(targetMode).then((loaded) => {
        if (loaded && state.mode === targetMode) { map.update(filtered(), state.selected); map.resize(); }
      }).catch(() => { $('#map-status').hidden = false; $('#map-status').textContent = '세계 지도를 불러오지 못했습니다. 한반도 또는 도감으로 탐색해 주세요.'; });
    } else { map.update(items, state.selected); map.resize(); $('#map-status').hidden=true; }
  }
  const url = new URL(location.href); url.searchParams.delete('system'); if (state.selected && !state.home) url.searchParams.set('system', state.selected); history.replaceState(null, '', url);
}
function layout() {
  const narrow = innerWidth < 900;
  const stack = narrow || state.layout === 'tall' || (state.layout === 'auto' && innerHeight > innerWidth);
  $('.shell').dataset.stack = String(stack);
  $('.shell').dataset.dock = state.dock === 'bottom' || narrow || (state.dock === 'auto' && stack) ? 'bottom' : 'side';
  $('.shell').dataset.density = state.density;
  requestAnimationFrame(() => map?.resize());
}
function clearFilters() { stopVoice(); state.region=null; state.domain = 'all'; state.branch = '전체'; state.query = ''; render(); }
function setMode(mode) { transitionPage($('.main')); $('.shell').dataset.menuOpen='false'; stopVoice(); state.home = false; state.mode = mode; render(); layout(); $('.main').scrollTop = 0; }
function select(id) { transitionPage($('.main')); stopVoice(); state.home = false; state.selected = id; render(); layout(); $('.detail-panel').scrollTop=0; $('.main').scrollTop=0; requestAnimationFrame(()=>{if($('.shell').dataset.stack==='true')$('.detail-panel').scrollIntoView({block:'start'})}); }
function closeSettings() { $('#settings').close(); $('#settings-open').focus(); }
if (params.has('showcase')) {
  $('#app').innerHTML = showcase();
} else {
  if (!$('.shell')) $('#app').innerHTML = shell();
  render(); layout();
  storyController=initStory({onSystem:id=>{select(id);openDemo()},onRegion:chooseRegion});
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('button'); if (!button || button.disabled) return;
    if(button.dataset.storySystem){state.region=null;state.branch='전체';state.domain='all';state.query='';select(button.dataset.storySystem);openDemo()}
    if(button.hasAttribute('data-demo-info')){setDemoFocus($('#system-demo').dataset.playing!=='true')}
    if(button.hasAttribute('data-demo-open'))openDemo();
    if(button.dataset.demoMode)changeDemoMode(button.dataset.demoMode);
    if(button.hasAttribute('data-demo-play')){if(await changeDemoMode('environment')){environmentViewer?.play();if(environmentViewer?.animation&&!document.hidden)setDemoFocus(true)}}
    if(button.hasAttribute('data-demo-stop')){setDemoFocus(false);demoVersion++;if(demoMode==='environment'){environmentViewer?.setSystem(systems.find(s=>s.id===state.selected),environmentPreset)}else viewer?.home();$('#demo-play-status').textContent='초기 장면으로 돌아왔습니다.'}
    if(button.dataset.environmentPreset){environmentPreset=button.dataset.environmentPreset;await changeDemoMode('environment')}
    if(button.hasAttribute('data-environment-retry'))location.reload();
    if(button.dataset.demoRelated){state.region=null;state.branch='전체';state.domain='all';state.query='';select(button.dataset.demoRelated);openDemo()}
    if(button.dataset.classification) { state.classification=button.dataset.classification;render(); }
    if(button.dataset.region) chooseRegion(button.dataset.region);
    if(button.hasAttribute('data-region-clear')) clearFilters();
    if(button.hasAttribute('data-listen')) voice.speak(narration(systems.find(s=>s.id===state.selected)));
    if(button.hasAttribute('data-voice-stop')) stopVoice();
    if(button.hasAttribute('data-model-home')){if(demoMode==='environment'&&$('#system-demo').open)environmentViewer?.home();else viewer?.home();}
    if(button.dataset.tourStep!==undefined) tourStep(Number(button.dataset.tourStep));
    if(button.hasAttribute('data-start-branch') || button.hasAttribute('data-start-domain') || button.hasAttribute('data-start-all') || button.hasAttribute('data-start-timeline')) {
      state.region=null; state.branch = button.dataset.startBranch || '전체'; state.domain = button.dataset.startDomain || 'all'; state.query = '';
      setMode(button.hasAttribute('data-start-timeline') ? 'timeline' : 'korea'); $('.main').scrollTop = 0;
    }
    if (button.dataset.mode) setMode(button.dataset.mode);
    if (button.dataset.system) select(button.dataset.system);
    if (button.dataset.domain) { stopVoice(); state.domain = button.dataset.domain; render(); }
    if (button.dataset.search) { stopVoice(); state.query = button.dataset.search; render(); $('#search').focus(); }
    if (button.hasAttribute('data-to-graph')) setMode('graph');
    if (button.hasAttribute('data-to-world')) setMode('world');
    if (button.hasAttribute('data-clear')) clearFilters();
    if (button.hasAttribute('data-focus-sources')) { const source = $('.source-card'); if(source?.closest('details'))source.closest('details').open=true; source?.focus(); source?.scrollIntoView({ block: 'nearest' }); }
    switch (button.id) {
      case 'menu-toggle':
        if(state.home){const open=$('.shell').dataset.menuOpen!=='true';$('.shell').dataset.menuOpen=String(open)}else menuHidden=!menuHidden;updateMenu();layout();break;
      case 'settings-open': $('#settings').showModal(); break;
      case 'settings-close': case 'settings-done': closeSettings(); break;
      case 'clear-filters': clearFilters(); break;
      case 'voice-tour-open': openTour(); break;
      case 'demo-close': $('#system-demo').close(); break;
      case 'tour-close': $('#voice-tour').close(); break;
      case 'tour-prev': tourStep(Math.max(0,tourIndex-1)); break;
      case 'tour-next': tourStep(Math.min(tourStops.length-1,tourIndex+1)); break;
      case 'tour-listen': speakTour(); break;
      case 'reset': transitionPage($('.main')); $('.shell').dataset.menuOpen='false'; stopVoice(); state.region=null; state.home = true; state.domain = 'all'; state.branch = '전체'; state.query = ''; state.selected = 'k2'; state.mode = 'korea'; render(); layout(); $('.main').scrollTop = 0; break;
      case 'home-view': map?.home(); break;
      case 'top-view': map?.top(); break;
      case 'zoom-in': map?.zoom(0.85); break;
      case 'zoom-out': map?.zoom(1.15); break;
      case 'map-retry': location.reload(); break;
      case 'map-list': setMode('list'); break;
      case 'fullscreen':
        try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
        catch { toast('이 브라우저에서는 전체 화면을 지원하지 않습니다. 브라우저의 전체 화면 기능을 사용해 주세요.'); }
        break;
      case 'share':
        try { await navigator.clipboard.writeText(location.href); toast('선택한 체계의 링크를 복사했습니다. 같은 PC 또는 배포된 주소에서 열 수 있습니다.'); }
        catch { toast('주소창의 링크를 복사하면 선택한 체계를 다시 열 수 있습니다.'); }
        break;
    }
  });
  $('#search').addEventListener('input', (event) => { stopVoice(); state.query = event.target.value; render(); });
  $('#branch').addEventListener('change', (event) => { stopVoice(); state.branch = event.target.value; render(); });
  $('#settings').addEventListener('change', (event) => { if (['layout', 'dock', 'density'].includes(event.target.name)) { state[event.target.name] = event.target.value; layout(); } });
  $('#settings').addEventListener('cancel', () => $('#settings-open').focus());
  $('#system-demo').addEventListener('close',()=>{$('.shell').dataset.demoOpen='false';menuHidden=menuBeforeDemo;setDemoFocus(false);updateMenu();layout();demoVersion++;environmentViewer?.stop();viewer?.stop();stopVoice();syncViewer();if(demoOpener?.isConnected)demoOpener.focus();else $('#detail [data-demo-open]')?.focus()});
  $('#voice-tour').addEventListener('close',()=>{stopVoice();syncViewer();$('#settings-open').focus()});
  $('.classification-tabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();state.classification=(e.key==='Home'||e.key==='ArrowLeft')?'branch':'environment';render();$('[data-classification="'+state.classification+'"]').focus()}});
  addEventListener('pagehide',()=>stopVoice());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)setDemoFocus(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('.shell').dataset.menuOpen==='true'&&!document.querySelector('dialog[open]')){$('.shell').dataset.menuOpen='false';updateMenu();$('#menu-toggle').focus()}});
  addEventListener('resize', layout);

}
function ensureMap() {
  if(mapReady || mapLoading) return;
  mapLoading = true;
  const status = (message, error) => {
    const element = $('#map-status'); element.hidden = !error && message === '지도 준비 완료'; element.textContent = message;
    if(error) element.insertAdjacentHTML('beforeend', '<div class="cluster"><button id="map-retry" class="action">다시 불러오기</button><button id="map-list" class="action">도감으로 보기</button></div>');
  };
  import('./map.js').then(async ({ AtlasMap }) => {
    try { map = new AtlasMap($('#map-host'), id=>{select(id);openDemo()}, status, chooseRegion); await map.init(); mapReady = true;
      if (state.mode === 'korea') { map.update(filtered(), state.selected); map.resize(); }
      else render(); }
    catch (error) { status(error instanceof Error ? error.message : '3D 지도를 사용할 수 없습니다.', true); }
  }).catch(() => status('지도 프로그램을 불러오지 못했습니다.', true));
}

function stopVoice(){clearTimeout(tourAdvanceTimer);voice.stop()}
function chooseRegion(id){if(!regions.some(r=>r.id===id))return;stopVoice();state.region=id;state.branch='전체';state.domain='all';state.query='';state.selected=regions.find(r=>r.id===id).systems[0];setMode('korea');$('.detail-panel').scrollTop=0;}
async function syncViewer(){
  if($('#system-demo').open&&demoMode==='environment')return syncEnvironment();
  const host=$('#system-demo').open?$('#demo-model-host'):$('#voice-tour').open?$('#tour-model-host'):$('#system-model-host');
  if(!host || state.home)return;
  try{viewerPromise ??= import('./model-viewer.js').then(({ModelViewer})=>new ModelViewer());viewer=await viewerPromise;
    const currentHost=$('#system-demo').open?$('#demo-model-host'):$('#voice-tour').open?$('#tour-model-host'):$('#system-model-host');
    if(!state.home&&currentHost){viewer.attach(currentHost,systems.find(s=>s.id===state.selected));viewer.setMode($('#system-demo').open?demoMode:'exterior');}
  }catch{host.textContent='3D 모델을 사용할 수 없습니다. 역할과 참여기관을 글로 확인하세요.';}
}
function openTour(){state.home=false;state.region=null;state.branch='전체';state.domain='all';state.query='';$('#voice-tour').showModal();tourStep(0);}
function tourStep(index){stopVoice();tourIndex=index;state.selected=tourStops[index];state.mode='korea';render();layout();
  const system=systems.find(s=>s.id===state.selected),profile=profiles[system.id];
  $('#tour-step').textContent=(index+1)+' / '+tourStops.length+' · '+(system.branches[0]==='합동'?'우주':system.branches[0]);
  $('#tour-system').textContent=system.name;$('#tour-caption').textContent=profile.role;
  $('#tour-organizations').textContent=profile.organizations.map(o=>o.name+' · '+o.role).join(' / ');
  document.querySelectorAll('[data-tour-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.tourStep)===index)));
  $('#tour-prev').disabled=index===0;$('#tour-next').disabled=index===tourStops.length-1;speakTour();
}
function speakTour(){clearTimeout(tourAdvanceTimer);voice.speak(narration(systems.find(s=>s.id===state.selected)),()=>{
  if($('#voice-tour').open&&$('#tour-auto').checked&&tourIndex<tourStops.length-1)tourAdvanceTimer=setTimeout(()=>{if($('#voice-tour').open&&$('#tour-auto').checked)tourStep(tourIndex+1)},1800);
});}

function openDemo(){
 if(!state.selected)return;stopVoice();environmentViewer?.stop();environmentPreset=null;demoMode='environment';const dialog=$('#system-demo');if(!dialog.open){menuBeforeDemo=menuHidden;menuHidden=true;$('.shell').dataset.demoOpen='true';updateMenu();layout();demoOpener=document.activeElement;dialog.showModal();transitionPage(dialog)}setDemoFocus(false);
 const system=systems.find(s=>s.id===state.selected);$('#demo-title').textContent=system.name+' · 체계 시연';$('#demo-inspector').innerHTML=demoInspector(system);$('.demo-body').scrollTop=0;changeDemoMode(demoMode);syncViewer();
}
async function syncEnvironment(){
 const selected=state.selected,host=$('#demo-environment-host');if(!$('#system-demo').open||demoMode!=='environment')return;
 try{environmentPromise??=import('./environment-viewer.js').then(async({EnvironmentViewer})=>{const instance=new EnvironmentViewer(host,message=>{$('#demo-play-status').textContent=message;if(message.startsWith('환경 시연 완료')||message.startsWith('환경 준비 완료'))setDemoFocus(false)});await instance.init();return instance});environmentViewer=await environmentPromise;
  if($('#system-demo').open&&demoMode==='environment'&&state.selected===selected){const system=systems.find(s=>s.id===selected),mode=environmentPreset||environmentFor(system);environmentViewer.setSystem(system,mode);$('#environment-heading').textContent=system.name+' · '+environments[mode].name;$('#environment-summary').textContent=environments[mode].text;$('#terrain-presets').hidden=environmentFor(system)!=='land';document.querySelectorAll('[data-environment-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.environmentPreset===mode)));}
 }catch(error){host.textContent=error.message;$('#demo-play-status').textContent='환경 자료 연결 실패 · 아래 다시 불러오기를 사용하세요.';environmentPromise=null;}
}
async function changeDemoMode(mode){const version=++demoVersion,selected=state.selected;demoMode=mode;setDemoFocus(false);environmentViewer?.stop();const environment=mode==='environment';$('#demo-environment-host').hidden=!environment;$('#demo-model-host').hidden=environment;$('#environment-tools').hidden=!environment;$('#environment-footnote').hidden=!environment;document.querySelectorAll('[data-demo-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demoMode===mode)));$('#demo-mode-description').hidden=environment;$('#demo-mode-description').textContent=demoModes.find(m=>m.id===mode).text;$('#demo-play-status').textContent=environment?'환경 준비 중…':mode==='role'?'역할과 공개 근거를 확인하세요.':equipmentAssets[state.selected]?.kind==='3d'?'드래그·확대로 공개 3D 외형을 살펴보세요.':equipmentAssets[state.selected]?.kind==='photo'?'실제 사진 자료입니다. 회전 기능은 제공하지 않습니다.':'정확한 외형 자료를 준비하고 있습니다.';if(environment)await syncEnvironment();else syncViewer();return version===demoVersion&&$('#system-demo').open&&demoMode===mode&&state.selected===selected;}

function updateMenu(){const shell=$('.shell');if(!shell)return;shell.dataset.menuHidden=String(menuHidden);const button=$('#menu-toggle');const expanded=state.home?shell.dataset.menuOpen==='true':!menuHidden;button?.setAttribute('aria-expanded',String(expanded));button?.setAttribute('aria-label',expanded?'메뉴 숨기기':'메뉴 보기');}
function setDemoFocus(value){const dialog=$('#system-demo');if(!dialog)return;dialog.dataset.playing=String(value);const button=$('[data-demo-info]');button?.setAttribute('aria-expanded',String(!value));if(button)button.textContent=value?'연계 체계 보기':'시연에 집중하기';requestAnimationFrame(()=>environmentViewer?.resize());}
