import './terrain-experience.css';

const site = { longitude: 128.7063, latitude: 37.6677 };
const views = [
  ['exterior', '외부 관찰', '장비 주변을 회전하고 확대해 외형을 살펴보세요.'],
  ['hatch', '해치 관측', '해치 위 탑승자의 눈높이에서 주변 지형을 둘러보세요.'],
  ['driver', '조종수 관측', '차체 전방 관측 위치에서 지형을 보세요. 실내는 재현하지 않습니다.'],
  ['region', '주변 지형', '위성 영상과 실제 고도 지형을 넓게 살펴보세요.'],
  ['peninsula', '한반도', '한반도에서 시연 지역의 위치를 확인하세요.'],
];

export async function mountTerrainExperience(host) {
  document.title = '실제 지형 · 탑승 관측 | K-방산 ATLAS';
  host.innerHTML = `<main class="terrain-experience" data-view="exterior">
    <header class="terrain-header"><a href="./" class="terrain-back">← ATLAS</a><div><span class="terrain-eyebrow">실제 지형 · 장비 관람</span><h1>대관령에서, 탑승자의 시선으로.</h1></div><button type="button" data-fullscreen>전체 화면</button></header>
    <section class="terrain-stage" aria-label="위성 영상과 고도 지형 위 장비 관람">
      <div id="terrain-canvas"></div>
      <div class="terrain-location"><span>강원 · 평창 올림픽 플라자 일대</span><small>37.6677° N / 128.7063° E · 전시용 배치</small></div>
      <div class="terrain-view-label"><span id="terrain-view-name">외부 관찰</span><small id="terrain-eye-height">지형·장비 준비 중</small></div>
      <div class="terrain-periscope" aria-hidden="true"><span>전방 관측 · 실내 미재현</span></div>
      <div class="terrain-loading" role="status"><strong>위성 영상과 실제 지형을 불러옵니다.</strong><span>장비 외형과 지면 높이를 확인하고 있습니다.</span></div>
      <div class="terrain-status" role="status" aria-live="polite"></div>
      <div class="terrain-compass" aria-label="현재 시선 방향"><span>시선 방향</span><strong id="terrain-heading">—</strong></div>
    </section>
    <section class="terrain-controls" aria-label="관람 조작">
      <div class="terrain-views" role="group" aria-label="관람 시점">${views.map(([id,name])=>`<button type="button" data-view="${id}" aria-pressed="${id==='exterior'}" disabled>${name}</button>`).join('')}</div>
      <p id="terrain-view-help">${views[0][2]}</p>
      <div class="terrain-actions"><div class="terrain-look" role="group" aria-label="탑승 시선 조절"><button data-look="left" aria-label="왼쪽 보기" disabled>←</button><button data-look="up" aria-label="위쪽 보기" disabled>↑</button><button data-look="down" aria-label="아래쪽 보기" disabled>↓</button><button data-look="right" aria-label="오른쪽 보기" disabled>→</button><button data-center disabled>정면 보기</button></div><div class="terrain-tour"><button data-tour disabled>안내 시연 시작</button><button data-reset disabled>처음 시점</button></div></div>
    </section>
    <details class="terrain-information"><summary><span><strong>T-80U</strong> · 공개 외형 모델</span><span>장비·지도 자료와 관측 시점 안내 ＋</span></summary><div class="terrain-information-grid"><div><h2>같은 공간, 다른 눈높이</h2><p>외부에서 장비의 크기와 형태를 살핀 다음 해치와 조종수 관측 위치로 전환합니다. 탑승 시점에서는 드래그·방향키·화살표 버튼으로 시선을 움직입니다. 외부 관찰에서는 드래그로 이동, 우클릭 드래그로 회전, 휠로 확대합니다.</p><p>관측 위치는 모델 외형을 기준으로 추정한 전시용 위치입니다. 검증된 실내, 잠망경 광학계, 운용 성능을 재현한 훈련 시뮬레이터는 아닙니다.</p></div><div><h2>자료 출처</h2><p>장비: <a href="https://sketchfab.com/3d-models/tank-t-80u-ebf4b55eeabb421cbf2758a2ec948439" target="_blank" rel="noopener noreferrer">javanilga · Tank T-80U</a> · CC BY 4.0. 공개 모델은 제조사 CAD가 아니며 한국군 도색 모델이 아닙니다. <a href="./models/ATTRIBUTION.md" target="_blank" rel="noopener noreferrer">사용권과 변환 기록</a></p><p>지도: Esri World Imagery 위성·항공 영상 / ArcGIS Terrain3D 고도. 실제 좌표와 높이 배율 1을 사용합니다. 촬영 시점과 해상도는 지역별로 다르며 인터넷 연결이 필요합니다.</p></div></div></details>
  </main>`;
  const root = host.querySelector('.terrain-experience');
  const status = text => { root.querySelector('.terrain-status').textContent = text; };
  let viewer;
  try {
    const C = await loadCesium();
    viewer = new TerrainExperience(root, C, status);
    await viewer.init();
    viewer.setView('region');
    await viewer.waitForScene();
    viewer.setView('exterior');
    await viewer.waitForScene();
    root.querySelector('.terrain-loading').hidden = true;
    root.querySelectorAll('[data-view], [data-look], [data-center], [data-tour], [data-reset]').forEach(button=>{ if (button.tagName==='BUTTON') button.disabled=false; });
    root.dataset.ready = 'true';
  } catch (error) {
    root.querySelector('.terrain-loading').innerHTML = '<strong>실제 지형 시연을 불러오지 못했습니다.</strong><span>인터넷 연결과 WebGL 지원을 확인하고 다시 시도하세요.</span><button type="button" data-retry>다시 불러오기</button>';
    status(error instanceof Error ? error.message : '지도 연결 실패');
    viewer?.destroy();
  }
  root.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.view) viewer?.setView(button.dataset.view);
    if (button.dataset.look) viewer?.look(button.dataset.look);
    if (button.hasAttribute('data-center')) viewer?.center();
    if (button.hasAttribute('data-tour')) viewer?.toggleTour();
    if (button.hasAttribute('data-reset')) viewer?.setView('exterior');
    if (button.hasAttribute('data-retry')) location.reload();
    if (button.hasAttribute('data-fullscreen')) {
      try { if (document.fullscreenElement) await document.exitFullscreen(); else await root.requestFullscreen(); }
      catch { status('브라우저에서 전체 화면을 사용할 수 없습니다.'); }
    }
  });
  addEventListener('pagehide', ()=>viewer?.destroy(), {once:true});
}

async function loadCesium() {
  const base = new URL('./cesium/', document.baseURI).href;
  window.CESIUM_BASE_URL = base;
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = base+'Widgets/widgets.css'; document.head.append(css);
  await new Promise((resolve,reject)=>{
    const script = document.createElement('script');
    script.src = base+'Cesium.js'; script.onload = resolve;
    script.onerror = ()=>reject(new Error('3D 지도 엔진을 불러오지 못했습니다.'));
    document.head.append(script);
  });
  return window.Cesium;
}

class TerrainExperience {
  constructor(root, C, status) {
    this.root=root; this.C=C; this.status=status; this.view='exterior'; this.yaw=0; this.pitch=-.05; this.tourTimers=[];
  }
  async init() {
    const C=this.C;
    const [imagery,terrain] = await Promise.all([
      C.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'),
      C.ArcGISTiledElevationTerrainProvider.fromUrl('https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'),
    ]);
    this.viewer=new C.Viewer(this.root.querySelector('#terrain-canvas'), {
      baseLayer: new C.ImageryLayer(imagery), terrainProvider:terrain,
      animation:false, timeline:false, baseLayerPicker:false, geocoder:false,
      homeButton:false, sceneModePicker:false, navigationHelpButton:false,
      fullscreenButton:false, infoBox:false, selectionIndicator:false,
      requestRenderMode:true, maximumRenderTimeChange:Infinity,
    });
    const scene=this.viewer.scene;
    scene.globe.depthTestAgainstTerrain=true;
    scene.globe.maximumScreenSpaceError=1;
    scene.verticalExaggeration=1;
    scene.highDynamicRange=true;
    scene.screenSpaceCameraController.minimumZoomDistance=2;
    this.viewer.resolutionScale=Math.min(window.devicePixelRatio || 1,1.5);
    this.viewer.clock.currentTime=C.JulianDate.fromIso8601('2026-06-15T02:00:00Z');
    this.viewer.shadows=true;
    scene.shadowMap.maximumDistance=1200;
    imagery.errorEvent.addEventListener(()=>this.status('일부 위성 영상 타일을 불러오지 못했습니다. 연결을 확인하세요.'));
    terrain.errorEvent.addEventListener(()=>this.status('일부 고도 타일을 불러오지 못했습니다. 연결을 확인하세요.'));
    scene.renderError.addEventListener(()=>this.status('3D 표시가 중단되었습니다. 페이지를 다시 불러오세요.'));
    const center=C.Cartographic.fromDegrees(site.longitude,site.latitude);
    const samples=[center,C.Cartographic.fromDegrees(site.longitude,site.latitude+.000035),C.Cartographic.fromDegrees(site.longitude+.000023,site.latitude)];
    await C.sampleTerrainMostDetailed(terrain,samples);
    if (!samples.every(p=>Number.isFinite(p.height))) throw new Error('시연 위치의 실제 고도를 확인하지 못했습니다.');
    this.center=center;
    this.samples=samples;
    this.height=center.height;
    this.anchor=C.Cartesian3.fromRadians(center.longitude,center.latitude,center.height+.1);
    this.frame=C.Transforms.eastNorthUpToFixedFrame(this.anchor);
    const northSlope=Math.atan2(samples[1].height-center.height,3.88);
    const eastSlope=Math.atan2(samples[2].height-center.height,2.03);
    const orientation=this.groundMatrix(northSlope,eastSlope);
    this.model=scene.primitives.add(await C.Model.fromGltfAsync({
      url:new URL('./models/t80u.glb',document.baseURI).href,
      modelMatrix:orientation, forwardAxis:C.Axis.X, scale:3.6/4.095700446516275, shadows:C.ShadowMode.ENABLED,
      imageBasedLighting:new C.ImageBasedLighting({imageBasedLightingFactor:new C.Cartesian2(.8,1)}),
    }));
    await new Promise((resolve,reject)=>{
      if(this.model.ready) return resolve();
      this.model.readyEvent.addEventListener(resolve);
      this.model.errorEvent.addEventListener(reject);
    });
    this.root.dataset.modelReady='true'; this.root.dataset.terrainHeight=String(this.height);
    this.installLookControls();
    scene.postRender.addEventListener(()=>{
      this.alignToRenderedGround();
      const degrees=(C.Math.toDegrees(this.viewer.camera.heading)+360)%360;
      this.root.querySelector('#terrain-heading').textContent=Math.round(degrees)+'°';
    });
    this.observer=new ResizeObserver(()=>{this.viewer.resize();scene.requestRender();});
    this.observer.observe(this.root.querySelector('.terrain-stage'));
    document.addEventListener('visibilitychange',this.onVisibility=()=>{if(document.hidden)this.stopTour();});
    this.status('위성 영상 · 실제 고도 지형 · T-80U 외형 준비 완료');
  }
  waitForScene() {
    const scene=this.viewer.scene;
    return new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>{remove();reject(new Error('지도 타일 연결이 지연되었습니다. 다시 불러오기를 사용하세요.'));},30000);
      const remove=scene.postRender.addEventListener(()=>{
        if(Number.isFinite(scene.globe.getHeight(this.center))){clearTimeout(timeout);remove();resolve();}
      });
      scene.requestRender();
    });
  }
  groundMatrix(northSlope,eastSlope) {
    const C=this.C;
    const slope=C.Matrix3.multiply(C.Matrix3.fromRotationX(northSlope),C.Matrix3.fromRotationY(-eastSlope),new C.Matrix3());
    C.Matrix3.multiply(slope,C.Matrix3.fromRotationZ(Math.PI),slope);
    return C.Matrix4.multiply(this.frame,C.Matrix4.fromRotationTranslation(slope),new C.Matrix4());
  }
  alignToRenderedGround() {
    const C=this.C,globe=this.viewer.scene.globe;
    const height=globe.getHeight(this.center);
    if(!Number.isFinite(height)||Math.abs(height-this.height)<.08)return;
    const previous=this.anchor;
    this.height=height;
    this.anchor=C.Cartesian3.fromRadians(this.center.longitude,this.center.latitude,height+.1);
    this.frame=C.Transforms.eastNorthUpToFixedFrame(this.anchor);
    const north=globe.getHeight(this.samples[1]),east=globe.getHeight(this.samples[2]);
    this.model.modelMatrix=this.groundMatrix(Math.atan2((north??height)-height,3.88),Math.atan2((east??height)-height,2.03));
    if(this.isOnboard())this.updateEye();
    else C.Cartesian3.add(this.viewer.camera.position,C.Cartesian3.subtract(this.anchor,previous,new C.Cartesian3()),this.viewer.camera.position);
    this.root.dataset.terrainHeight=String(height);
    this.viewer.scene.requestRender();
  }
  setView(view,fromTour=false) {
    if(!fromTour)this.stopTour();
    const C=this.C,camera=this.viewer.camera;
    camera.cancelFlight(); camera.lookAtTransform(C.Matrix4.IDENTITY);
    this.view=view;this.root.dataset.view=view;
    this.root.querySelectorAll('button[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
    const entry=views.find(v=>v[0]===view);
    this.root.querySelector('#terrain-view-name').textContent=entry[1];
    this.root.querySelector('#terrain-view-help').textContent=entry[2]+(this.isOnboard()?' 드래그 또는 방향키로 둘러보기.':'');
    this.root.querySelector('.terrain-look').hidden=!this.isOnboard();
    const controls=this.viewer.scene.screenSpaceCameraController;
    controls.enableInputs=!this.isOnboard();
    camera.frustum.fov=C.Math.toRadians(view==='driver'?50:65);
    this.model.show=view!=='driver';
    if(this.isOnboard()) {
      this.yaw=0;this.pitch=view==='hatch'?-.12:-.03;this.updateEye();
      this.root.querySelector('#terrain-eye-height').textContent=(view==='hatch'?'해치 위 약 2.6 m':'전방 관측 약 1.2 m')+' · 외형 기반 추정';
    } else {
      const range=view==='exterior'?19:view==='region'?1800:1100000;
      const target=view==='peninsula'?C.Cartesian3.fromDegrees(127.8,37.8):C.Matrix4.multiplyByPoint(this.frame,new C.Cartesian3(0,0,1),new C.Cartesian3());
      camera.lookAt(target,new C.HeadingPitchRange(C.Math.toRadians(view==='exterior'?145:15),C.Math.toRadians(view==='exterior'?-20:view==='region'?-30:-75),range));
      camera.lookAtTransform(C.Matrix4.IDENTITY);
      this.root.querySelector('#terrain-eye-height').textContent=view==='exterior'?'실물 비율 · 고도 배율 1':'위성·항공 영상 · 고도 배율 1';
    }
    this.viewer.scene.requestRender();
  }
  isOnboard(){return this.view==='hatch'||this.view==='driver';}
  updateEye() {
    const C=this.C;
    const local=this.view==='hatch'?new C.Cartesian3(.65,-1.3,2.6):new C.Cartesian3(0,2.4,1.2);
    const eye=C.Matrix4.multiplyByPoint(this.frame,local,new C.Cartesian3());
    this.viewer.camera.setView({destination:eye,orientation:{heading:this.yaw,pitch:this.pitch,roll:0}});
    this.viewer.scene.requestRender();
  }
  look(direction) {
    if(!this.isOnboard())return;
    this.stopTour();
    const step=this.C.Math.toRadians(10);
    if(direction==='left')this.yaw-=step;
    if(direction==='right')this.yaw+=step;
    if(direction==='up')this.pitch+=step;
    if(direction==='down')this.pitch-=step;
    this.pitch=Math.max(-.75,Math.min(.65,this.pitch));this.updateEye();
  }
  center(){if(this.isOnboard()){this.stopTour();this.yaw=0;this.pitch=this.view==='hatch'?-.12:-.03;this.updateEye();}}
  installLookControls() {
    const canvas=this.viewer.canvas;
    canvas.tabIndex=0;canvas.setAttribute('aria-label','실제 지형과 T-80U · 탑승 시점에서는 방향키로 둘러보기');
    canvas.addEventListener('pointerdown',e=>{this.stopTour();if(!this.isOnboard())return;this.drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.focus();});
    canvas.addEventListener('wheel',()=>this.stopTour(),{passive:true});
    canvas.addEventListener('pointermove',e=>{if(!this.drag||!this.isOnboard())return;this.yaw+=(e.clientX-this.drag.x)*.004;this.pitch=Math.max(-.75,Math.min(.65,this.pitch-(e.clientY-this.drag.y)*.003));this.drag={x:e.clientX,y:e.clientY};this.updateEye();});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>{this.drag=null;});
    canvas.addEventListener('keydown',e=>{const direction={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];if(direction&&this.isOnboard()){e.preventDefault();this.look(direction);}});
  }
  toggleTour() {
    if(this.tourTimers.length){this.stopTour();return;}
    const stops=['peninsula','region','exterior','hatch','driver'];
    this.root.querySelector('[data-tour]').textContent='안내 시연 중지';
    this.root.querySelector('[data-tour]').setAttribute('aria-pressed','true');
    stops.forEach((view,index)=>this.tourTimers.push(setTimeout(()=>{
      this.setView(view,true);this.status(`안내 ${index+1} / ${stops.length} · ${views.find(v=>v[0]===view)[1]}`);
    },index*6000)));
    this.tourTimers.push(setTimeout(()=>{this.stopTour();this.status('안내 완료 · 관람 시점을 선택해 계속 둘러보세요.');},stops.length*6000));
  }
  stopTour(){this.tourTimers.forEach(clearTimeout);this.tourTimers=[];const button=this.root.querySelector('[data-tour]');button.textContent='안내 시연 시작';button.setAttribute('aria-pressed','false');}
  destroy(){this.stopTour();this.observer?.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);if(this.viewer&&!this.viewer.isDestroyed())this.viewer.destroy();}
}
