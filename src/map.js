import {loadTerrain,terrainMesh,terrainY,surfaceHeight,markerHeight} from './terrain.js';
import { regions } from './exhibition-data.js';
import { sceneTheme as palette } from './scene-theme.js';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const koreaPoint = ([lon, lat, altitude = 0]) => new T.Vector3((lon - 127.5) * 1.25, altitude, -(lat - 37.3) * 1.6);
const globePoint = (lon, lat, radius = 5) => {
  const a = T.MathUtils.degToRad(lon), b = T.MathUtils.degToRad(lat);
  return new T.Vector3(radius * Math.cos(b) * Math.sin(a), radius * Math.sin(b), radius * Math.cos(b) * Math.cos(a));
};

export class AtlasMap {
  constructor(host, onSelect, onStatus, onRegion) {
    this.host = host; this.onSelect = onSelect; this.onStatus = onStatus;
    this.onRegion=onRegion; this.raycaster=new T.Raycaster();
    this.mode = 'korea'; this.markers = []; this.labels = [];
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(37, 1, 0.1, 400);
    this.renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x080f18, 0);
    this.renderer.domElement.setAttribute('aria-label', '한반도 및 세계의 설명용 3D 지도. 아래 체계 목록으로 동일한 항목을 선택할 수 있습니다.');
    this.renderer.domElement.setAttribute('role', 'img');
    host.prepend(this.renderer.domElement);
    this.labelLayer = document.createElement('div'); this.labelLayer.className = 'map-labels'; host.append(this.labelLayer);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = false; this.controls.minDistance = 8; this.controls.maxDistance = 45;
    this.controls.maxPolarAngle = Math.PI / 2.05; this.controls.enablePan = false;
    this.controls.addEventListener('change', () => this.render());
    this.scene.add(new T.HemisphereLight(palette.skyLight, palette.surrounding, 2.2));
    const sun = new T.DirectionalLight(palette.sun, 3.2); sun.position.set(-8, 18, 10); this.scene.add(sun);
    this.content = new T.Group(); this.scene.add(this.content);
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(host);
    this.renderer.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); onStatus('3D 연결이 중단되었습니다. 새로 불러오거나 체계 도감에서 탐색하세요.', true); });
    this.renderer.domElement.addEventListener('webglcontextrestored', () => this.load(this.mode));
    this.renderer.domElement.addEventListener('pointerdown',e=>{this.pointerStart={x:e.clientX,y:e.clientY}});
    this.renderer.domElement.addEventListener('pointerup',e=>{
      if(this.mode!=='korea'||!this.pointerStart||Math.hypot(e.clientX-this.pointerStart.x,e.clientY-this.pointerStart.y)>6)return;
      const rect=this.renderer.domElement.getBoundingClientRect();
      this.raycaster.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),this.camera);
      for(const hit of this.raycaster.intersectObjects(this.content.children,true)){
        let object=hit.object;while(object&& !object.userData.systemId && !object.userData.regionId)object=object.parent;
        if(object?.userData.systemId){this.onSelect(object.userData.systemId);break}
        if(object?.userData.regionId){this.onRegion?.(object.userData.regionId);break}
      }
    });
    document.fonts.ready.then(()=>this.render());
    document.fonts.addEventListener('loadingdone',()=>this.render());
    this.resize(); this.home();
  }
  async init() {
    const response = await fetch('./data/region.json');
    if (!response.ok) throw new Error('지도 데이터를 불러오지 못했습니다.');
    this.region = await response.json();this.terrain=await loadTerrain();
    await this.load('korea');
  }
  clear() {
    this.content.traverse((object) => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose());
      else object.material?.dispose();
    });
    this.content.clear(); this.labelLayer.replaceChildren(); this.markers = []; this.labels = [];
  }
  async load(mode) {
    this.requestedMode = mode;
    if (mode === 'world' && !this.world) {
      this.onStatus('세계 지도 준비 중…', false);
      this.worldPromise ??= fetch('./data/world.json').then((response) => {
        if (!response.ok) throw new Error('세계 지도 데이터를 불러오지 못했습니다.');
        return response.json();
      });
      this.world = await this.worldPromise;
      if (this.requestedMode !== mode) return false;
    }
    this.mode = mode; this.clear();
    if (mode === 'world') this.buildWorld(); else this.buildKorea();
    this.home(); this.onStatus('지도 준비 완료', false);
    return true;
  }
  buildKorea() {
    const ocean = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshStandardMaterial({ color: palette.ocean, roughness: 0.85, metalness: 0.1 }));
    ocean.rotation.x = -Math.PI / 2; ocean.position.y = -0.04; this.content.add(ocean);this.ocean=ocean;
    const grid = new T.GridHelper(80, 80, palette.grid, palette.surrounding); grid.position.y = 0.005; this.content.add(grid);
    for (const feature of this.region) {
      const south = feature.name === 'South Korea', north = feature.name === 'North Korea';
      const depth = south ? 0.46 : north ? 0.28 : 0.12;
      for (const polygon of feature.polygons) {
        const ring = polygon[0];
        if (!ring.some(([lon, lat]) => lon > 117 && lon < 139 && lat > 29 && lat < 46)) continue;
        const points = ring.map(([lon, lat]) => new T.Vector2((lon - 127.5) * 1.25, (lat - 37.3) * 1.6));
        const area = Math.abs(T.ShapeUtils.area(points));
        if (area < 0.035 || points.length < 3) continue;
        const shape = new T.Shape(points);
        const geometry = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
        geometry.rotateX(-Math.PI / 2);
        const mesh = new T.Mesh(geometry, new T.MeshStandardMaterial({ color: south ? palette.korea : north ? palette.north : palette.surrounding, roughness: 0.65, metalness: 0.25 }));
        this.content.add(mesh);
        const outline = ring.map(([lon, lat]) => koreaPoint([lon, lat, depth + 0.014]));
        this.content.add(new T.Line(new T.BufferGeometry().setFromPoints(outline), new T.LineBasicMaterial({ color: south ? palette.outline : palette.grid, transparent: true, opacity: south ? 0.9 : 0.55 })));
      }
    }
    this.content.add(terrainMesh(this.terrain));
    for(const region of regions){
      const point=koreaPoint(region.coords);point.y=terrainY(this.terrain,...region.coords)+.1;
      const marker=new T.Mesh(new T.SphereGeometry(.12,16,12),new T.MeshBasicMaterial({color:palette.connection}));marker.position.copy(point);marker.userData.regionId=region.id;this.content.add(marker);
      const label=document.createElement('button');label.type='button';label.className='region-map-pin';label.textContent=region.name;label.setAttribute('aria-label',region.name+' 산업 연결 보기');label.onclick=()=>this.onRegion?.(region.id);this.labelLayer.append(label);this.labels.push({element:label,point:point.clone().add(new T.Vector3(0,.2,0)),regionId:region.id});
    }
    this.addText('대한민국', koreaPoint([127.7, 35.9, 0.5]), 'country-label');
    this.addText('북한', koreaPoint([126.8, 40.4, 0.3]), 'country-label subdued');
    this.addText('설명용 공중 영역', koreaPoint([130.0, 35.2, 1.4]), 'sea-label');
  }
  buildWorld() {
    this.controls.maxPolarAngle = Math.PI;
    const earth = new T.Mesh(new T.SphereGeometry(5, 64, 40), new T.MeshStandardMaterial({ color: palette.ocean, roughness: 0.8, metalness: 0.25 })); this.content.add(earth);
    for (const country of this.world) {
      for (const polygon of country.polygons) {
        const ring = polygon[0]; if (ring.length < 4) continue;
        const points = ring.map(([lon, lat]) => globePoint(lon, lat, 5.016));
        this.content.add(new T.Line(new T.BufferGeometry().setFromPoints(points), new T.LineBasicMaterial({ color: palette.korea, transparent: true, opacity: 0.65 })));
      }
    }
    const a = globePoint(127.5, 36.2, 5.08), b = globePoint(19.1, 52.2, 5.08);
    const middle = a.clone().add(b).normalize().multiplyScalar(7.7);
    const path = new T.QuadraticBezierCurve3(a, middle, b);
    this.connection = new T.Group(); this.content.add(this.connection);
    this.connection.add(new T.Mesh(new T.TubeGeometry(path, 48, 0.025, 6, false), new T.MeshBasicMaterial({ color: palette.connection })));
    for (const [name, position] of [['대한민국', a], ['폴란드', b]]) {
      const marker = new T.Mesh(new T.SphereGeometry(0.08, 12, 8), new T.MeshBasicMaterial({ color: palette.connection })); marker.position.copy(position); this.connection.add(marker);
      this.addText(name, position, 'country-label world-label');
    }
  }
  addText(text, point, className) {
    const label = document.createElement('span'); label.className = className; label.textContent = text;
    this.labelLayer.append(label); this.labels.push({ element: label, point });
  }
  update(systems, selectedId) {
    this.activeSystems = systems; this.selectedId = selectedId;
    if(this.mode==='korea'&&this.ocean){this.ocean.material.transparent=selectedId==='dosan';this.ocean.material.opacity=selectedId==='dosan'?.35:1;this.ocean.material.depthWrite=selectedId!=='dosan';}
    for (const item of this.markers) {
      this.content.remove(item.group); item.group.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); }); item.element.remove();
    }
    this.labels = this.labels.filter((l) => !l.systemId); this.markers = [];
    if (this.mode === 'world') {
      this.connection.visible = systems.some((s) => s.events.length > 0);
      this.render(); return;
    }
    for (const system of systems) {
      const color = system.domains.includes('space') ? palette.space : system.domains.includes('air') ? palette.air : system.domains.includes('sea') ? palette.sea : palette.connection;
      const point = koreaPoint(system.coords);point.y=system.id==='dosan'?-1:system.domains.includes('space')?5:system.domains.includes('air')?3.3:system.domains.includes('land')?markerHeight(this.terrain,system.coords[0],system.coords[1]):.14;
      const group = new T.Mesh(new T.CylinderGeometry(.13,.13,.12,24), new T.MeshStandardMaterial({color})); group.userData.systemId=system.id; group.position.copy(point); group.scale.setScalar(system.id === selectedId ? 1.12 : 0.88); this.content.add(group);
      const ground = new T.Vector3(point.x, Math.max(.04,terrainY(this.terrain,...system.coords)), point.z);
      group.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, 0), ground.sub(point)]), new T.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })));
      const element = document.createElement('button'); element.type = 'button'; element.className = `map-pin ${system.id === selectedId ? 'selected' : ''}`;
      element.textContent = system.name; element.setAttribute('aria-label', `${system.name} 상세 보기`); element.setAttribute('aria-pressed', String(system.id === selectedId)); element.onclick = () => this.onSelect(system.id);
      this.labelLayer.append(element);
      this.labels.push({ element, point: point.clone().add(new T.Vector3(0, 0.7, 0)), systemId: system.id });
      this.markers.push({ group, element });
    }
    this.render();
  }
  home() {
    this.controls.target.set(0, 0, 0);
    if (this.mode === 'world') this.camera.position.copy(globePoint(74, 35, 20));
    else { this.controls.maxPolarAngle = Math.PI / 2.05; this.controls.target.set(0, 0, -0.3); this.camera.position.set(3.6, 14, 18); }
    this.controls.update(); this.render();
  }
  zoom(factor) { this.camera.position.sub(this.controls.target).multiplyScalar(factor).add(this.controls.target); this.controls.update(); this.render(); }
  top() {
    if (this.mode === 'world') return this.home();
    this.camera.position.set(0, 22, 0.01); this.controls.update(); this.render();
  }
  resize() {
    const width = this.host.clientWidth, height = this.host.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height); this.render();
  }
  render() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => { this.frame = 0; this.draw(); });
  }
  draw() {
    this.renderer.render(this.scene, this.camera);
    const occupied = [];
    const ordered = [...this.labels].sort((a, b) => Number(b.systemId === this.selectedId) - Number(a.systemId === this.selectedId) || Number(Boolean(b.systemId)) - Number(Boolean(a.systemId)));
    for (const label of ordered) {
      const vector = label.point.clone().project(this.camera);
      const visible = vector.z < 1 && Math.abs(vector.x) < 0.98 && Math.abs(vector.y) < 0.98;
      const front = this.mode !== 'world' || (this.connection.visible && label.point.dot(this.camera.position) > 22);
      label.element.hidden = !visible || !front;
      if (label.element.hidden) continue;
      const width = label.element.offsetWidth, height = label.element.offsetHeight;
      const originX = (vector.x * 0.5 + 0.5) * this.host.clientWidth;
      const originY = (-vector.y * 0.5 + 0.5) * this.host.clientHeight;
      const options = (label.systemId || label.regionId) ? [[0, 0], [0, -55], [0, 55], [-90, 0], [90, 0], [-90, -55], [90, -55], [-90, 55], [90, 55], [0, -110], [0, 110], [-130, -110], [130, 110]] : [[0, 0]];
      let location;
      for (const [dx, dy] of options) {
        const x = Math.max(width / 2 + 8, Math.min(this.host.clientWidth - width / 2 - 8, originX + dx));
        const y = Math.max(height / 2 + 64, Math.min(this.host.clientHeight - height / 2 - 105, originY + dy));
        const box = { left: x - width / 2 - 3, right: x + width / 2 + 3, top: y - height / 2 - 3, bottom: y + height / 2 + 3 };
        if (occupied.every((b) => box.right < b.left || box.left > b.right || box.bottom < b.top || box.top > b.bottom)) { location = { x, y, box }; break; }
      }
      if (!location) { label.element.hidden = true; continue; }
      occupied.push(location.box);
      label.element.style.transform = 'translate(-50%, -50%) translate(' + location.x + 'px, ' + location.y + 'px)';
    }
  }
}
