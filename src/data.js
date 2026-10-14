import { catalogSources, catalogSystems, catalogExportEvents } from './catalog-expansion.js';
import { extraSources, profiles } from './exhibition-data.js';
const dapa = (id) => `https://dapa.go.kr/dapa/doc/selectDoc.do?bbsSeq=326&docSeq=${id}&menuSeq=3069`;
export const sources = {
  marineShared: {title:'해병대 공개 장비 사례 · K9·천무',publisher:'대한민국 정책브리핑 · 청와대',date:'2026-06-24',url:'https://www.korea.kr/news/policyNewsView.do?newsId=148967061',locator:'본문: 해병대 연평부대 K-9 자주포·천무 시찰 및 K9A1 탑승 설명'},
  navy: { title: 'K방산 기술집약체 충남함 해군 인도', publisher: '방위사업청', date: '2024-12-18', url: dapa(20423), locator: '본문: 울산급 Batch-III 선도함 인도식' },
  poland: { title: '폴란드 K2 추가계약 발표 및 기존 이행계약', publisher: '방위사업청', date: '2025-07-02', url: dapa(21346), locator: '본문: 2022년 4종 체계 1차 이행계약 및 후속 이행계약 설명' },
  rotem: { title: '현대로템 연혁', publisher: '현대로템', date: '2025-08-01', url: 'https://www.hyundai-rotem.co.kr/en/company/history/content.do', locator: '2025: 폴란드 K2 2차 이행계약' },
  muav: { title: '감시·정찰능력 향상과 미래 방산수출에 기여한다', publisher: '방위사업청', date: '2024-01-25', url: dapa(18746), locator: '본문: 중고도정찰용무인항공기 양산사업 착수' },
  satellite: { title: '킬체인의 눈, 본격 임무 시작!', publisher: '방위사업청', date: '2024-08', url: dapa(19681), locator: '본문: 2024-08-13 425사업 1호기 전투용 적합 판정' },
  satellite5: {title:'425사업 5호 정찰위성 목표 궤도 진입',publisher:'대한민국 정부 Korea.net · 국방부 발표 인용',date:'2025-11-04',url:'https://www.korea.net/NewsFocus/policies/view?articleId=281615&koreanId=281592',locator:'본문: 2025년 11월 2일 발사·목표 궤도 진입·지상국 통신 확인'},
  marine: { title: '상륙돌격장갑차 원격사격통제체계 전력화 완료', publisher: '방위사업청', date: '2023-12-26', url: dapa(18573), locator: '본문: 해병대 운용 상륙돌격장갑차와 RCWS' },
  smallsat: { title: '초소형위성체계 개발 정상 추진 중', publisher: '방위사업청', date: '2025-04-04', url: dapa(20862), locator: '본문: 상세설계검토회의 및 군·국민 안전 분야 활용 계획' },
};
Object.assign(sources, extraSources, catalogSources);
export const domains = [
  { id: 'all', name: '전체', color: 'accent', icon: 'layers' },
  { id: 'land', name: '지상', color: 'land', icon: 'land' },
  { id: 'sea', name: '해상', color: 'sea', icon: 'sea' },
  { id: 'air', name: '공중', color: 'air', icon: 'air' },
  { id: 'space', name: '우주', color: 'space', icon: 'space' },
  { id: 'cyber', name: '사이버·전자', color: 'warning', icon: 'network' },
];
export const branches = ['전체', '육군', '해군', '공군', '해병대', '합동'];
// All coordinates below are EXHIBIT positions, not deployment or factory locations.
export const systems = [
  {id:'dosan',name:'도산안창호급',subtitle:'잠수함 · 장보고-III',english:'SUBMARINE / KSS-III',domains:['sea'],branches:['해군'],mission:'수중',maker:'대우조선해양',project:'장보고-III Batch-I',sourceIds:['dosan'],model:'submarine',coords:[130.4,37.0,-1],summary:'수중 환경에서 활동하는 국내 잠수함을 살펴보세요.',fact:'방위사업청은 2021년 8월 13일 도산안창호함 인도·인수 및 취역식을 발표했습니다. 당시 공개된 후속 전력화 계획과 실제 완료 실적은 구분합니다.',events:[]},
  { id: 'chungnam', name: '충남함', subtitle: '호위함 · 울산급 Batch-III', english: 'FRIGATE / BATCH-III', domains: ['sea'], branches: ['해군'], mission: '해상', maker: 'HD현대중공업', project: '울산급 Batch-III', sourceIds: ['navy'], model: 'ship', coords: [131.1, 34.8, 0.22], summary: '국내 조선 기술이 연결된 해군 함정을 만나보세요.', fact: '2024년 12월 18일 방위사업청은 울산 HD현대중공업에서 울산급 Batch-III 선도함 충남함의 해군 인도식을 개최했다고 밝혔습니다. 이는 국내 인도이며 해외 수출 사건으로 집계하지 않습니다.', events: [] },
  { id: 'k2', name: 'K2', subtitle: '전차', english: 'MAIN BATTLE TANK', domains: ['land'], branches: ['육군'], mission: '기동', maker: '현대로템', project: 'K2 전차', sourceIds: ['poland', 'rotem'], model: 'tank', coords: [127.0, 36.1, 0.65], summary: '지상에서 기동하는 전차를 만나보세요.', fact: '방위사업청은 폴란드의 K2 1차 이행계약을 설명했습니다. 현대로템 연혁에는 2025년 8월 1일 2차 이행계약이 기록되어 있습니다.', events: [{ country: '폴란드', year: 2022, kind: '이행계약', source: 'poland' }, { country: '폴란드', year: 2025, kind: '2차 이행계약', source: 'rotem' }] },
  { id: 'k9', name: 'K9', subtitle: '자주포', english: 'SELF-PROPELLED HOWITZER', domains: ['land'], branches: ['육군', '해병대'], mission: '화력 지원', maker: '제작사 연결 조사 중', project: 'K9 자주포', sourceIds: ['poland', 'marineShared'], model: 'howitzer', coords: [128.0, 37.3, 0.65], summary: '이동형 포 체계와 관련 수출 사례를 살펴보세요.', fact: '방위사업청 공개자료에 폴란드 K9 1차 이행계약과 2023년 2차 이행계약이 설명되어 있습니다.', events: [{ country: '폴란드', year: 2022, kind: '이행계약', source: 'poland' }, { country: '폴란드', year: 2023, kind: '2차 이행계약', source: 'poland' }] },
  { id: 'chunmoo', name: '천무', subtitle: '다연장로켓', english: 'MULTIPLE ROCKET LAUNCHER', domains: ['land'], branches: ['육군', '해병대'], mission: '화력 지원', maker: '제작사 연결 조사 중', project: '천무', sourceIds: ['poland', 'marineShared'], model: 'launcher', coords: [126.6, 35.0, 0.65], summary: '지상 체계가 세계와 연결되는 이야기를 찾아보세요.', fact: '방위사업청 공개자료에 폴란드 천무 1차 이행계약과 2024년 2차 이행계약이 설명되어 있습니다.', events: [{ country: '폴란드', year: 2022, kind: '이행계약', source: 'poland' }, { country: '폴란드', year: 2024, kind: '2차 이행계약', source: 'poland' }] },
  { id: 'fa50', name: 'FA-50', subtitle: '항공기', english: 'LIGHT COMBAT AIRCRAFT', domains: ['air'], branches: ['공군'], mission: '항공', maker: '제작사 연결 조사 중', project: 'FA-50', sourceIds: ['poland'], model: 'plane', coords: [129.0, 36.2, 2.5], summary: '공중의 기술과 공개된 해외 계약 사례를 만나보세요.', fact: '방위사업청은 2022년 폴란드와 체결한 4종 무기체계 1차 이행계약에 FA-50이 포함된다고 설명했습니다.', events: [{ country: '폴란드', year: 2022, kind: '이행계약', source: 'poland' }] },
  { id: 'muav', name: 'MUAV', subtitle: '중고도 무인항공기', english: 'UNMANNED AERIAL VEHICLE', domains: ['air'], branches: ['공군'], mission: '감시·정찰', maker: '참여기관 연결 조사 중', project: '중고도정찰용무인항공기 양산', sourceIds: ['muav'], model: 'drone', coords: [125.6, 37.2, 2.5], summary: '사람이 탑승하지 않는 항공기의 공개 사업을 알아보세요.', fact: '2024년 1월 25일 방위사업청은 중고도정찰용무인항공기 양산사업 착수를 발표했습니다. 수출은 이 자료에서 미래 기대이며 확정 실적으로 표시하지 않습니다.', events: [] },
  { id: 'kaav', name: '상륙돌격장갑차', subtitle: '해병대 · 지상과 해상', english: 'AMPHIBIOUS ASSAULT VEHICLE', domains: ['sea', 'land'], branches: ['해병대'], mission: '상륙·기동', maker: '참여기관 연결 조사 중', project: '상륙돌격장갑차 RCWS', sourceIds: ['marine'], model: 'amphibious', coords: [124.9, 35.6, 0.55], summary: '지상과 해상을 잇는 해병대 체계를 살펴보세요.', fact: '방위사업청은 2023년 12월 26일 해병대 운용 상륙돌격장갑차용 복합화기 원격사격통제체계 전력화 완료를 발표했습니다.', events: [] },
  { id: '425', name: '425사업', subtitle: '군 정찰위성', english: 'RECONNAISSANCE SATELLITE', domains: ['space'], branches: ['합동'], mission: '감시·정찰', maker: '항우연 · 국과연 · 국내 기업', project: '군 정찰위성 425사업', sourceIds: ['satellite','satellite5'], model: 'satellite', coords: [127.5, 39.0, 4.7], summary: '우주 기술과 연구기관의 협력 관계를 만나보세요.', fact: '425사업 1호기는 2024년 8월 전투용 적합 판정을 획득했습니다. 2025년 11월 2일에는 5호기가 발사되어 목표 궤도 진입과 지상국 통신이 확인됐습니다. 발사 성공과 각 위성의 임무 운용 상태는 구분합니다.', events: [] },
  { id: 'smallsat', name: '초소형위성체계', subtitle: '우주 · 연구개발', english: 'SMALL SATELLITE SYSTEM', domains: ['space'], branches: ['합동'], mission: '감시·정찰', maker: '방사청 · 우주항공청 · 해경', project: '초소형위성체계 개발', sourceIds: ['smallsat'], model: 'satellite', coords: [130.0, 38.7, 4.0], summary: '국방과 국민 안전 분야에 연결되는 우주 연구를 살펴보세요.', fact: '2025년 4월 4일 공개자료는 상세설계검토회의와 개발 진행을 설명합니다. 향후 활용 계획과 이미 완료된 성과를 구분합니다.', events: [] },
];
export const modes = [
  {id:'forces',name:'전군 현황',icon:'grid',label:'K-방산, 전군 무기체계 현황',description:'육군·해군·공군·해병대와 공통 활용 체계를 공개자료로 둘러보세요.'},
  { id: 'timeline', name: '변천 비교', icon: 'layers', label: '과거 · 현재 · 미래의 K-방산', description: '체계를 선택하고 공개 기록과 향후 계획을 비교해 보세요.' },
  { id: 'korea', name: '한반도 3D', icon: 'map', label: '대한민국의 기술을 만나다', description: '지상에서 우주까지, 지도 위의 체계를 선택해 보세요.' },
  { id: 'world', name: '세계 수출', icon: 'globe', label: '세계와 연결되는 K-방산', description: '공개 근거로 확인한 계약·공급 사례를 탐색합니다.' },
  { id: 'graph', name: '지식 관계망', icon: 'network', label: '하나의 체계, 연결된 이야기', description: '임무·사업·기관·국가를 관계로 따라가 보세요.' },
  { id: 'list', name: '체계 도감', icon: 'grid', label: 'K-방산 체계 도감', description: '이름·군·영역으로 찾아보고 공개자료를 확인하세요.' },
];

systems.push(...catalogSystems);
for (const [id, events] of Object.entries(catalogExportEvents)) {
  const system = systems.find(s => s.id === id);
  system.events.push(...events);
  system.sourceIds.push(...events.map(e => e.source).filter(source => !system.sourceIds.includes(source)));
}

for(const system of systems) {
  const company=profiles[system.id].organizations.find(o=>o.type==='기업');
  if(company) system.maker=company.name;
}
