import {forcesDashboard, commonSystem} from './forces-dashboard.js';
import './forces-dashboard.css';
import './export-proof.css';
import {getLocale,translateText,initLocalization,refreshLocalization} from './i18n.js';
import './scene-recovery.css';
import {SceneWatch,sceneError} from './scene-recovery.js';
import './representative.css';
import { initStory, transitionPage } from './story-controller.js';
import {environmentFor,environments} from './environment-data.js';
import {equipmentAssets} from './equipment-assets.js';
import { demoInspector, demoModes } from './system-demo.js';
import { SpeechGuide } from './voice.js';
import {ExhibitGuide} from './exhibit-guide.js';
import './exhibit-guide.css';
import { narration, regionPicker } from './exhibition.js';
import { regions, profiles, tourStops } from './exhibition-data.js';
import './exhibition.css';
import { timeline } from './journey.js';
import './journey.css';
import './fonts.css';
import './styles.css';
import './responsive.css';
import './story.css';
import './exhibition-polish.css';
import { systems, modes } from './data.js';
import { card, detail, graph, showcase } from './components.js';
import { shell } from './shell.js';

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const state = { forcesInspect:false,forceGroup:'전체', home: !params.has('system')&&params.get('view')!=='forces', region: null, classification: 'branch', mode: params.get('view')==='forces'?'forces':'korea', selected: systems.some((s) => s.id === params.get('system')) ? params.get('system') : 'k2', domain: 'all', branch: '전체', query: '', layout: 'auto', dock: 'auto', density: 'standard' };
let demoNavigation=false, environmentImportWatch;
let demoMode='environment', demoOpener,environmentViewer,environmentPromise,environmentPreset,demoVersion=0,environmentSyncVersion=0;
let viewer, viewerPromise, tourIndex=0, tourAdvanceTimer, voiceMessage='버튼을 누르면 한국어 음성으로 안내합니다.';
const voice=new SpeechGuide(message=>{voiceMessage=message;document.querySelectorAll('[data-voice-status]').forEach(e=>e.textContent=message)});
let representativePromise;
function ensureRepresentatives(){return representativePromise??=import('./representative-exhibit.js').then(({initRepresentativeExhibit})=>initRepresentativeExhibit({onOpen:()=>{stopVoice();environmentViewer?.stop()},onInspect:id=>{state.region=null;state.branch='전체';state.domain='all';state.query='';select(id);openDemo()}}))}
let storyController, guide, menuHidden=true, menuBeforeDemo=false;
let map, mapReady = false, mapLoading = false, toastTimer;
function toast(message) {
  $('#toast').textContent = message; $('#toast').hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4000);
}
function filtered() {
  const query = state.query.trim().toLowerCase();
  return systems.filter((s) => (!state.region || regions.find(r=>r.id===state.region).systems.includes(s.id)) && (state.domain === 'all' || s.domains.includes(state.domain)) && (state.branch === '전체' || s.branches.includes(state.branch)) && (!(state.mode==='forces'&&state.forceGroup==='shared') || commonSystem(s)) && (!query || [s.name, s.subtitle, s.english, s.mission, s.maker, s.project, ...s.branches, ...s.events.map((e) => e.country)].flatMap(value=>[value,...['en','ja','zh'].map(code=>translateText(value,code))]).join(' ').toLowerCase().includes(query)));
}
function render() {
  $('.shell').dataset.home = String(state.home);$('.shell').dataset.mode=state.mode;
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
  $('#branch').value = state.branch; $('#search').value = state.query;$('#search').placeholder=state.mode==='forces'?'장비 검색':'체계·사업·국가 검색';
  $('#collection').innerHTML = items.length ? items.map((s) => card(s, state.selected)).join('') : '<div class="empty-inline">검색 결과가 없습니다. 검색어를 바꾸거나 필터를 초기화해 주세요.</div>';
  $('#collection-count').textContent = String(items.length).padStart(2, '0');
  const events = items.flatMap((s) => s.events);
  $('#result-count').textContent = state.mode === 'world' ? `${new Set(events.map((e) => e.country)).size}개국 · ${events.length}개 공개된 수출 이야기` : `${items.length}개 체계 · 선택해서 탐색`;
  $('#detail').hidden=state.mode==='forces'&&!state.forcesInspect;$('#detail').innerHTML = (state.mode==='forces'?'<button type="button" class="action" data-force-return>현황으로 돌아가기</button>':'')+detail(selected, state.mode);
  if(!state.home && selected && !$('#system-demo').open&&(state.mode!=='forces'||state.forcesInspect)) syncViewer();else if(state.mode==='forces'&&!state.forcesInspect)viewer?.stop();
  document.querySelectorAll('[data-voice-status]').forEach(e=>e.textContent=voiceMessage);
  const isMap = ['korea', 'world'].includes(state.mode);
  $('#map-host').hidden = !isMap; $('#map-toolbar').hidden = !isMap;
  $('#graph-view').hidden = state.mode !== 'graph'; $('#list-view').hidden = state.mode !== 'list';
  $('#timeline-view').hidden = state.mode !== 'timeline';$('#forces-view').hidden=state.mode!=='forces';if(state.mode==='forces')$('#forces-view').innerHTML=forcesDashboard(items,state.selected,state.forceGroup==='shared'?'shared':state.branch);
  if(state.mode === 'timeline') $('#timeline-view').innerHTML = timeline(selected);
  if(!state.home && isMap) ensureMap();
  if (state.mode === 'graph') $('#graph-view').innerHTML = graph(selected);
  if (state.mode === 'list') $('#list-view').innerHTML = items.length ? `<div class="catalog-intro"><h2>이름을 몰라도 찾아보세요</h2><p>영역이나 군을 선택하면 관련 체계를 모아볼 수 있습니다.</p></div><div class="catalog-grid">${items.map((s) => card(s, state.selected)).join('')}</div>` : '<div class="empty"><h2>검색 결과가 없습니다</h2><p>다른 검색어나 영역으로 찾아보세요.</p><button class="action" data-clear>필터 초기화</button></div>';
  $('#stage-badge').textContent = { forces:'전군 공개 체계 현황', korea: '한반도 입체 지도', world: '세계로 이어지는 수출', graph: '기업과 사업의 연결', list: '장비 모아보기', timeline: '과거·현재·미래 이야기' }[state.mode];
  $('#map-disclaimer').hidden = ['timeline','forces'].includes(state.mode);
  $('#map-disclaimer').textContent = state.mode === 'world' ? `연결선은 공개 수출 관계 · 실제 운송 경로 아님 · 수록 ${new Set(systems.flatMap(s=>s.events.map(e=>e.country))).size}개국` : state.mode === 'graph' ? '공개 근거와 설명용 분류의 연결 · 모든 사업을 담은 것은 아니에요' : state.mode === 'list' ? '공개자료로 확인한 대표 사례 · 선택 항목의 근거와 발표일을 확인하세요' : '실제 위성·항공 영상과 고도 지형 · 장비 위치는 전시용 · 실제 배치·궤도 아님';
  if (mapReady) map.requestedMode=state.mode;
  if (mapReady && isMap) {
    if (map.mode !== state.mode) {
      const targetMode = state.mode;
      map.load(targetMode).then((loaded) => {
        if (loaded && state.mode === targetMode) { map.update(filtered(), state.selected); map.resize(); }
      }).catch(() => { $('#map-status').hidden = false; $('#map-status').textContent = '세계 지도를 불러오지 못했습니다. 한반도 또는 도감으로 탐색해 주세요.'; });
    } else { map.update(items, state.selected); map.resize(); $('#map-status').hidden=true; }
  }
  const url = new URL(location.href);if(!state.home&&state.mode==='forces')url.searchParams.set('view','forces');else url.searchParams.delete('view');url.searchParams.delete('system'); if (state.selected && !state.home) url.searchParams.set('system', state.selected); history.replaceState(null, '', url);
}
function layout() {
  const narrow = innerWidth < 900;
  const stack = narrow || state.layout === 'tall' || (state.layout === 'auto' && innerHeight > innerWidth);
  $('.shell').dataset.stack = String(stack);
  $('.shell').dataset.dock = state.dock === 'bottom' || narrow || (state.dock === 'auto' && stack) ? 'bottom' : 'side';
  $('.shell').dataset.density = state.density;
  requestAnimationFrame(() => map?.resize());
}
function clearFilters() { stopVoice(); state.forceGroup='전체';state.region=null; state.domain = 'all'; state.branch = '전체'; state.query = ''; render(); }
function setMode(mode) { transitionPage($('.main')); $('.shell').dataset.menuOpen='false'; stopVoice(); state.home = false; state.mode = mode;state.forceGroup='전체';if(mode==='forces'){state.forcesInspect=false;state.region=null;state.domain='all';state.branch='전체';state.query=''}render(); layout(); $('.main').scrollTop = 0; }
function select(id) { transitionPage($('.main')); stopVoice(); state.home = false; state.selected = id; render(); layout(); $('.detail-panel').scrollTop=0; $('.main').scrollTop=0; requestAnimationFrame(()=>{if($('.shell').dataset.stack==='true')$('.detail-panel').scrollIntoView({block:'start'})}); }
function closeSettings() { $('#settings').close(); $('#settings-open').focus(); }
if (params.get('experience') === 'terrain') {
  import('./terrain-experience.js').then(({ mountTerrainExperience }) => mountTerrainExperience($('#app')));
} else if (params.has('showcase')) {
  $('#app').innerHTML = showcase();
} else {
  if (!$('.shell')) $('#app').innerHTML = shell();
  guide=new ExhibitGuide($('#system-demo'),voice,async component=>{const selected=state.selected,version=guide.version;await guide.ready;const ready=demoMode==='environment'&&environmentViewer?.model?true:await changeDemoMode('environment');if(!ready||selected!==state.selected||version!==guide.version||!$('#system-demo').open)return false;if(component)environmentViewer.inspect(component);else environmentViewer.setView('site');return true;});
  render(); layout();
  storyController=initStory({onSystem:id=>{select(id);openDemo()},onRegion:chooseRegion});
  initLocalization();voice.setLanguage(getLocale());storyController.setLanguage?.(getLocale());
  document.addEventListener('app-language-change',()=>{stopVoice();voice.setLanguage(getLocale());guide?.setLanguage(getLocale());storyController.setLanguage?.(getLocale());render();refreshLocalization();});
  if(params.has('representative'))ensureRepresentatives().then(controller=>controller.open(params.get('representative')));
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('button'); if (!button || button.disabled) return;
    const representativeId=button.dataset.representative||(button.closest('.hero-branches')?({'육군':'k2','해군':'dosan','공군':'fa50','해병대':'kaav'})[button.dataset.startBranch]:null);
    if(representativeId){(await ensureRepresentatives()).open(representativeId,button);return;}
    if(button.hasAttribute('data-to-forces')){setMode('forces');return;}
    if(button.dataset.forceGroup){stopVoice();state.forcesInspect=false;state.forceGroup=button.dataset.forceGroup;state.branch=state.forceGroup==='shared'?'전체':state.forceGroup;state.region=null;render();$('[data-force-group="'+button.dataset.forceGroup+'"]')?.focus({preventScroll:true});return;}
    if(button.dataset.forceSystem){state.forcesInspect=true;select(button.dataset.forceSystem);const heading=$('#detail h2');$('#detail').scrollIntoView({block:'start'});if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}return;}
    if(button.hasAttribute('data-force-return')){state.forcesInspect=false;render();const target=$('.forces-grid [data-force-system="'+state.selected+'"]')||$('#forces-heading');target?.scrollIntoView({block:'center'});target?.focus({preventScroll:true});return;}
    if(button.dataset.storySystem){state.region=null;state.branch='전체';state.domain='all';state.query='';select(button.dataset.storySystem);openDemo()}
    if(button.hasAttribute('data-demo-world')){demoNavigation=true;$('#system-demo').close();setMode('world');return;}
    if(button.hasAttribute('data-demo-info')){setDemoFocus($('#system-demo').dataset.playing!=='true')}
    if(button.hasAttribute('data-demo-open'))openDemo();
    if(button.dataset.demoMode)changeDemoMode(button.dataset.demoMode);
    if(button.hasAttribute('data-demo-play')){if(await changeDemoMode('environment')){environmentViewer?.play();if(environmentViewer?.animation&&!document.hidden)setDemoFocus(true)}}
    if(button.hasAttribute('data-demo-stop')){setDemoFocus(false);demoVersion++;if(demoMode==='environment'){await syncEnvironment()}else viewer?.home();$('#demo-play-status').textContent='초기 장면으로 돌아왔습니다.'}
    if(button.dataset.environmentPreset){environmentPreset=button.dataset.environmentPreset;await changeDemoMode('environment')}
    if(button.hasAttribute('data-environment-retry'))environmentViewer?.retry();
    if(button.dataset.demoRelated){state.region=null;state.branch='전체';state.domain='all';state.query='';select(button.dataset.demoRelated);openDemo()}
    if(button.dataset.classification) { state.classification=button.dataset.classification;render(); }
    if(button.dataset.region) chooseRegion(button.dataset.region);
    if(button.hasAttribute('data-region-clear')) clearFilters();
    if(button.hasAttribute('data-listen')){if($('#system-demo').open&&guide.data)guide.speak();else{voice.setLanguage(getLocale());voice.speak(narration(systems.find(s=>s.id===state.selected)));}}
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
      case 'map-retry': map?.retry(); break;
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
  $('#branch').addEventListener('change', (event) => { stopVoice();state.forceGroup='전체'; state.branch = event.target.value; render(); });
  $('#settings').addEventListener('change', (event) => { if (['layout', 'dock', 'density'].includes(event.target.name)) { state[event.target.name] = event.target.value; layout(); } });
  $('#settings').addEventListener('cancel', () => $('#settings-open').focus());
  $('#system-demo').addEventListener('close',()=>{$('.shell').dataset.demoOpen='false';menuHidden=menuBeforeDemo;setDemoFocus(false);updateMenu();layout();demoVersion++;environmentSyncVersion++;environmentViewer?.stop();viewer?.stop();stopVoice();syncViewer();if(demoNavigation){demoNavigation=false;const title=$('#mode-title');title.tabIndex=-1;title.focus({preventScroll:true})}else if(demoOpener?.isConnected)demoOpener.focus();else $('#detail [data-demo-open]')?.focus()});
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
    const element = $('#map-status'); element.hidden = !error; element.textContent = message;
    if(error) element.insertAdjacentHTML('beforeend', '<div class="cluster"><button id="map-retry" class="action">다시 불러오기</button><button id="map-list" class="action">도감으로 보기</button></div>');
  };
  import('./satellite-map.js').then(async ({ AtlasMap }) => {
    try { map = new AtlasMap($('#map-host'), id=>{select(id);openDemo()}, status, chooseRegion); map.activeSystems=filtered();map.selectedId=state.selected;map.onReady=()=>{mapReady=true;mapLoading=false;render()};await map.init(); mapReady = true;mapLoading=false;
      if (state.mode === 'korea') { map.update(filtered(), state.selected); map.resize(); }
      else render(); }
    catch (error) { status(error instanceof Error ? error.message : '3D 지도를 사용할 수 없습니다.', true); }
  }).catch(() => status('지도 프로그램을 불러오지 못했습니다.', true));
}

function stopVoice(){clearTimeout(tourAdvanceTimer);guide?.stop();voice.stop()}
function chooseRegion(id){if(!regions.some(r=>r.id===id))return;stopVoice();state.region=id;state.branch='전체';state.domain='all';state.query='';state.selected=regions.find(r=>r.id===id).systems[0];setMode('korea');$('.detail-panel').scrollTop=0;}
async function syncViewer(){
  if($('#system-demo').open&&demoMode==='environment')return syncEnvironment();
  const host=$('#system-demo').open?$('#demo-model-host'):$('#voice-tour').open?$('#tour-model-host'):$('#system-model-host');
  if(!host || state.home||(state.mode==='forces'&&!state.forcesInspect&&!document.querySelector('dialog[open]')))return;
  try{viewerPromise ??= import('./model-viewer.js').then(({ModelViewer})=>new ModelViewer());viewer=await viewerPromise;
    const currentHost=$('#system-demo').open?$('#demo-model-host'):$('#voice-tour').open?$('#tour-model-host'):$('#system-model-host');
    if(!state.home&&currentHost&&(state.mode!=='forces'||state.forcesInspect||document.querySelector('dialog[open]'))){viewer.attach(currentHost,systems.find(s=>s.id===state.selected));viewer.setMode($('#system-demo').open?demoMode:'exterior');}
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
function speakTour(){clearTimeout(tourAdvanceTimer);voice.setLanguage(getLocale());voice.speak(narration(systems.find(s=>s.id===state.selected)),()=>{
  if($('#voice-tour').open&&$('#tour-auto').checked&&tourIndex<tourStops.length-1)tourAdvanceTimer=setTimeout(()=>{if($('#voice-tour').open&&$('#tour-auto').checked)tourStep(tourIndex+1)},1800);
});}

function openDemo(){
 if(!state.selected)return;stopVoice();environmentViewer?.stop();environmentPreset=null;demoMode=equipmentAssets[state.selected]?.studio?'exterior':'environment';const dialog=$('#system-demo');if(!dialog.open){menuBeforeDemo=menuHidden;menuHidden=true;$('.shell').dataset.demoOpen='true';updateMenu();layout();demoOpener=document.activeElement;dialog.showModal();transitionPage(dialog)}setDemoFocus(false);
 const system=systems.find(s=>s.id===state.selected);$('#demo-title').textContent=system.name+' · 체계 시연';$('#demo-inspector').innerHTML=demoInspector(system);guide.mount(system);$('.demo-body').scrollTop=0;guide.ready=changeDemoMode(demoMode);
}
async function syncEnvironment(){
 const version=++environmentSyncVersion,selected=state.selected,preset=environmentPreset,host=$('#demo-environment-host');
 if(!$('#system-demo').open||demoMode!=='environment')return false;
 try{
  environmentPromise??=import('./environment-viewer.js').then(async({EnvironmentViewer})=>{
   environmentImportWatch?.dispose();environmentImportWatch=null;const instance=new EnvironmentViewer(host,message=>{if(!$('#system-demo').open||demoMode!=='environment')return;$('#demo-play-status').textContent=message;if(message.startsWith('환경 시연 완료')||message.startsWith('환경 준비 완료'))setDemoFocus(false)});
   environmentViewer=instance;instance.onReady=()=>{const recovering=environmentPromise===null;environmentViewer=instance;environmentPromise=Promise.resolve(instance);if(recovering&&!instance.system&&$('#system-demo').open&&demoMode==='environment')syncEnvironment()};await instance.init();return instance;
  });
  environmentViewer=await environmentPromise;
  if(version!==environmentSyncVersion||!$('#system-demo').open||demoMode!=='environment'||state.selected!==selected)return false;
  const system=systems.find(s=>s.id===selected),mode=preset||environmentFor(system);
  await environmentViewer.setSystem(system,mode);
  if(environmentViewer.watch.failed)return false;
  if(version!==environmentSyncVersion||!$('#system-demo').open||demoMode!=='environment'||state.selected!==selected)return false;
  $('#environment-heading').textContent=system.name+' · '+environments[mode].name;$('#environment-summary').textContent=environments[mode].text;
  refreshLocalization();$('#terrain-presets').hidden=environmentFor(system)!=='land';document.querySelectorAll('[data-environment-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.environmentPreset===mode)));
  return true;
 }catch(error){if(version===environmentSyncVersion){environmentPromise=null;if(!environmentViewer){environmentImportWatch??=new SceneWatch(host,{retry:()=>{environmentImportWatch.dispose();environmentImportWatch=null;host.replaceChildren();syncEnvironment()},onStatus:message=>{$('#demo-play-status').textContent=message}});environmentImportWatch.fail(sceneError(error)||'initialization-failure')}else if(!environmentViewer.watch.failed)environmentViewer.watch.fail(sceneError(error)||'initialization-failure');}return false;}
}
async function changeDemoMode(mode){const version=++demoVersion,selected=state.selected;demoMode=mode;setDemoFocus(false);environmentViewer?.stop();const environment=mode==='environment';$('#demo-environment-host').hidden=!environment;$('#demo-model-host').hidden=environment;$('#environment-tools').hidden=!environment;$('#environment-footnote').hidden=!environment;document.querySelectorAll('[data-demo-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demoMode===mode)));$('#demo-mode-description').hidden=environment;$('#demo-mode-description').textContent=demoModes.find(m=>m.id===mode).text;$('#demo-play-status').textContent=environment?'환경 준비 중…':mode==='role'?'역할과 공개 근거를 확인하세요.':equipmentAssets[state.selected]?.studio?'부품을 선택하고 전시용 동작을 살펴보세요.':equipmentAssets[state.selected]?.kind==='3d'?'드래그·확대로 공개 3D 외형을 살펴보세요.':equipmentAssets[state.selected]?.kind==='photo'?'실제 사진 자료입니다. 회전 기능은 제공하지 않습니다.':'정확한 외형 자료를 준비하고 있습니다.';const ready=environment?await syncEnvironment():(environmentSyncVersion++,syncViewer(),true);return ready&&version===demoVersion&&$('#system-demo').open&&demoMode===mode&&state.selected===selected;}

function updateMenu(){const shell=$('.shell');if(!shell)return;shell.dataset.menuHidden=String(menuHidden);const button=$('#menu-toggle');const expanded=state.home?shell.dataset.menuOpen==='true':!menuHidden;button?.setAttribute('aria-expanded',String(expanded));button?.setAttribute('aria-label',expanded?'메뉴 숨기기':'메뉴 보기');}
function setDemoFocus(value){const dialog=$('#system-demo');if(!dialog)return;dialog.dataset.playing=String(value);$('.demo-body').scrollTop=0;const button=$('[data-demo-info]');button?.setAttribute('aria-expanded',String(!value));if(button)button.textContent=value?'연계 체계 보기':'시연에 집중하기';requestAnimationFrame(()=>environmentViewer?.resize());}
