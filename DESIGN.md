# K-방산 ATLAS 디자인 시스템

## 자료 연결 관람 v9 · 2026-10-13

기존 v8 밝은 표면과 Action/FilterChip/Status primitive를 유지한다. GuidePanel은 데스크톱에서는 시연 옆 inspector 상단, 모바일에서는 시연 아래 elevated 표면, r3 radius, s5 padding, s3 gap, t1 본문/t3 제목으로 구성한다. 언어 선택은 label이 있는 native select(48px), 부위 선택은 기존 Action의 aria-pressed 상태, 자막은 항상 표시하고 해당 BCP47 lang을 지정한다. KO/EN/JA/ZH 선택은 안내 내용과 TTS에 적용하며 탐색 UI 전체 번역이라고 표시하지 않는다. 브라우저의 해당 언어 음성 유무를 실제 inventory로 표시하고 미설치 시 잘못된 언어 음성으로 대체하지 않는다.

KAAV/FA-50/도산안창호급/누리호의 공개 근거 기반 부위 관찰은 추정 ENU 좌표로 카메라를 이동한다. 부위 마커는 관찰 중인 하나만 표시하고 공식 원문 링크와 제조사 CAD 아님을 함께 제공한다. 카메라 이동은 기존 즉시 시점 방식, 사용자 선택 및 안내 재생에서만 발생한다. 안내 순서는 환경→외형 부위→관련 전시 사례. 발화 종료에만 다음 부위로 전환하며 음성 없음/오류/중지/닫기/체계·언어 변경/탭 비활성에서 자동 진행을 취소한다. 모션 감소에서는 같은 정지 시점과 자막을 제공한다.

한화·KAI·KARI 및 Saab/Naval Group 사례는 실제 수행 범위와 당 프로젝트의 적용 방법을 구분하여 원문을 연결한다. 사진 재구성 외형의 재질·부위 관찰을 강화하되 제조사 실측 모델·검증 실내·물리 성능으로 표현하지 않는다. 모바일 GuidePanel은 세로 흐름, 모든 버튼 줄바꿈 및48px. 현장 하드웨어·스피커 청취 품질·각 OS 음성 설치는 별도 현장 검증 범위다.

## 0. Research Log
- 기획 기준: docs/PRD-MVP-v0.1.md와 사용자의 다중 화면·유연한 메뉴·검색 요구.
- 내장 후보: Linear, Vercel, Supabase. soft-skill + Linear 선택: 어두운 다층 표면·선명한 계층·넓은 지도 작업면. 브랜드·로고는 복제하지 않는다.
- 인터랙션: beui.dev/r/tabs/raw 확인. 오버슈트 없는 선택 강조와 reduced-motion 적용. vanilla CSS로 구현.
- Lazyweb: map dashboard navigation 1회 검색, Mapbox 통계 화면과 Google Maps 소개 화면 2개 실제 열람. Mapbox의 고정 탐색 레일·상단 필터와 Maps의 지도 중심 설명 구조를 차용. 스크린샷은 임시 자료만 사용하고 제품에 복제하지 않음.
- Imagen: 해당 생성 도구가 이 세션에 없어 생략. 생성 이미지를 기능 화면 대신 사용하지 않는다.
- 지도: datasets/geo-countries의 Natural Earth 해안선. 실제 DEM 대신 일정 높이로 돌출한 설명용 지리 모형.

## 1. Atmosphere & Identity
디지털 과학관의 탐색 테이블. 어두운 남색 유리 패널 뒤에 민트빛 한반도가 입체로 떠 있다. 세 가지 검토 방향(군 작전실, 통계 포털, 과학관) 중 과학관을 선택한다. 장비의 역할→사업→국가로 이어지는 선택이 기억에 남는 경험이다. 기관 로고나 실시간 군 상황처럼 보이는 표현은 쓰지 않는다.

## 2. Color
CSS token: bg #080f18, panel #101c29, elevated #182939, line #294052, text #eff5f6, muted #a0b4c4, dim #7891a5, accent #84e6c4, accent-dark #102c27, air #91c5ff, sea #78d6ed, space #cab3ff, warning #f4ca85, land #84e6c4, black #040a10. Material alpha: white 0.04/0.08/0.12, black 0.12/0.24. 3D: sea #0d2637, north #23474f, surrounding #173544, korea #458f80, outline #85ead3, model #b5d9d5, model-dark #375e66, grid #345263. Country surface #204552. 선택과 환경에만 색을 사용하고 모두 텍스트를 병기한다.

## 3. Typography
로컬 Noto Sans KR, monospace ui-monospace. 12/14/16/18/22/28/36px 토큰, 제목 600~700, 본문 400~500, line-height 1.55. body 최소 14px. 한국어 word-break keep-all, overflow-wrap anywhere. 전시 모드 UI 밀도와 글씨 확대. 영어 기술명은 보조 정보다.

## 4. Spacing & Layout
4px 기본 단위: 4/8/12/16/20/24/32/40/48/64. radius 8/12/20/28. 터치 48px 최소. shell height 100dvh. header 80px, footer 36px, rail 96px, detail 320px, compact detail 280px. Shell은 header/body/footer로 구성하고 목록·상세 영역만 각각 스크롤한다. 지도가 중앙 공간의 주인이다. 세로·900px 미만은 하단 nav + 지도/상세 상하 배치. 600px 미만은 검색·필터 줄바꿈, 상세 정보는 지도 아래 스크롤. 수동 좌측 메뉴에서도 좁은 화면에는 가로 nav로 안전하게 재배치한다. 자동/가로/세로 구성은 프레임 배치만 바꾸며 화면을 강제 회전시키지 않는다.

## 5. Components
- Action: button/a; default/hover/pressed/focus/disabled; 48px, radius 12, 선택 aria-pressed. 네이티브 키보드.
- ModeNav: nav>button, 아이콘+이름; 한반도/수출/관계망/목록. 선택 상태 동일 컴포넌트가 좌측·하단 재사용.
- FilterChip: button; 영역/군 선택과 결과 수, 선택 aria-pressed, 빈 결과는 초기화 동작 제공.
- SystemCard: button; 체계명/영역/설명, 선택 테두리·배경, 이름이 긴 경우 줄바꿈, 리스트 스크롤 소유.
- DetailPanel: heading/section/source links; 설명·관계·원문·기준일. 자체 스크롤, 체계 선택 시 콘텐츠 변경.
- Status: role=status 로딩/빈 결과/실패/완료. 실패 시 실제 재시도 및 목록 대안.
- Settings: native dialog; 자동/가로/세로, 메뉴 위치, 전시 밀도. Escape 닫기·초점 복귀.
- MapStage: canvas + DOM selectable labels. 캔버스는 설명을 제공하고 모든 체계는 목록으로도 선택 가능.
- RelationGraph: SVG lines + DOM buttons. 지식 관계만 표시, 각 노드가 실제 선택/필터/수출 이동에 연결.
- Primitive showcase: /?showcase=1. 동일 primitive의 모든 상태를 표시한다.

## 6. Motion & Interaction
150ms press, 240ms emphasis, cubic-bezier(.22,1,.36,1). transform/opacity와 색상 상태 강조. 지도 회전은 사용자의 drag 또는 시점 버튼으로만 발생한다. 장비 자동 비행·전투 효과는 없다. reduced-motion은 transitions 제거 및 즉시 카메라 이동. 버튼 active scale .98, focus 2px accent ring. 선택한 지도 label이 상세와 연결된다.

## 7. Depth & Surface
Mixed: Linear의 near-black 층과 hairline rim, soft의 이중 프레임을 차용. 패널 상단 white/0.04 gradient + inset white/0.08 1px highlight, 바깥 프레임 line. 배경 radial sea glow. 캔버스는 실제 mesh·조명·입체 측면과 지리 경계를 렌더링한다. 제품 화면을 이미지로 대체하지 않는다.

## 8. Accessibility Constraints & Accepted Debt
목표 WCAG 2.2 AA: 48px 조작, visible focus, 네이티브 버튼과 검색 label, 라이브 결과 알림, 모션 감소, canvas와 별개 목록. 대시보드에 정확한 작전 배치 없음.
제약(사용자 승인된 부채가 아닌 MVP 범위): 내부 업무바통·실시간 AI·전체 사업 통계·DEM·정밀 장비 모델 미구현. 지도·프로그램과 콘텐츠는 로컬 HTTP 제공; 출처 원문 열기는 인터넷 필요. 4K 실물 터치 장비와 장시간 운영은 별도 현장 검증 필요.

## 2026-10-08 밝은 전시 시스템 개편 (이 절이 앞선 어두운 토큰을 대체)

사용자 요청: 밝은 디자인, 첫 화면 무기체계 선택, 군/환경별 큰 분류, 변천 비교.
공식 참고: Fluent 2 https://fluent2.microsoft.design/color 의 neutral/brand 분리, Material 3 https://m3.material.io/styles/color/the-color-system 의 surface/container/selected 역할, Palantir https://www.palantir.com/explore/platforms/foundry/ontology/ 의 체계와 연결 정보 구조. 브랜드 복제나 공식 제품이라고 표시하지 않는다.

표면: bg #f5f7fa, panel #ffffff, elevated #edf2f8, line #d0d9e5, text #172b4d, muted #52657d, dim #5d7085. 선택: accent #145caa, accent-dark #e7f0fc. 환경 텍스트: land #176348, sea #096681, air #225da9, space #654aa0, warning #8c570d. 명도 대비를 우선한다. white-low/mid/high는 청색 0.025/0.05/0.08; shade는 청색 0.08. primary-action의 글자는 #ffffff. 집중된 표면과 얕은 그림자로 계층을 표현한다.
지도: 밝은 바다 #e1edf5, 주변 땅 #d2dce7, 북한 #b9c9d9, 대한민국 #5d9fc9, 윤곽 #266c9c, 그리드 #c9dbe9. 흰 광원, 어두운 모델 하부 #36536d. 지도 색은 src/scene-theme.js에 별도 역할 토큰으로 관리한다.

새 재사용 요소: WelcomeCategory(군 4개·환경 3개/우주 확장), WelcomeSystem(실제 체계 직접 선택), EraCard(과거/현재/미래 상태·날짜·근거), JourneyNav(홈 복귀), TimelineView(3열→좁은 화면 1열). 기본/hover/pressed/focus 상태는 공통 선택 토큰과 150ms 전환을 사용한다. 정보 없는 미래는 미확인 상태로 표시한다.

첫 진입은 선택 화면. 카드 선택→해당 필터가 적용된 지도 또는 직접 체계 상세로 이동. 왼쪽/하단 탐색 메뉴와 처음으로 버튼으로 재탐색 가능. 선택 화면에는 큰 제목·군별 선택·환경별 선택·대표 체계 직접 선택이 있다. 헤더/메뉴는 고정, 선택 본문은 자체 스크롤. 지도 JS는 지도 선택 후 로드한다.
변천 화면은 공개 수록 기록 비교다. 단일 발표만 있으면 과거를 추정하지 않는다. 현재는 최신 수록 발표 기준이며 2026년 실시간 상태가 아니다. 미래는 공개자료의 계획/기대만 표시하고 확정 실적과 구분한다. 역사적 선행·후속 체계 비교는 별도 검수 데이터 추가가 필요하다.
키오스크 초심자: 이름 몰라도 군/환경으로 진입. 직원: 체계 선택→변천→근거. 저시력/키보드 사용자: 48px 터치, 대비, focus, 색과 텍스트 병기. 실제 현장 장비·정식 온톨로지·전체 통계 범위는 기존 제한을 유지한다.

## 관람객 전시 경험 (2026-10-08)

공식 사례 조사: Inhance aerospace / EBC의 단계적 이야기·실시간 3D, Saab Underwater Virtual Booth의 주제별 진입, Museum of Flight/point2explore의 모델 조작과 투어, Hanwha virtual showroom의 제품별 탐색. 출처는 docs/EXHIBITION-RESEARCH.md에 보관. 기존 밝은 테마를 유지한다.

분류 원칙: 군(누가 사용하는가)과 환경(어디에서 사용하는가)을 독립된 탭으로 구분한다. 한 번에 하나의 분류만 진입하며 다른 분류의 잔여 필터는 초기화한다. category 탭은 selected/aria-selected와 안내문을 가진다. 음성 전시 시작은 첫 화면의 주 동작이며 버튼을 누른 뒤만 발화한다.
새 요소: ClassificationTabs, AudioTourDialog(큰 자막·3D 모델·이전/다음·재생/정지), RoleSummary, OrganizationCard(기업/연구기관/사업기관 및 근거 링크), RegionPicker(공개 도시 단위 산업 연결), ModelViewer(동일 renderer 재사용), MapObjectPicking(드래그와 클릭 구분). 기존 spacing/touch/focus/motion 토큰 사용, 지역 선택은 텍스트와 선택 상태 병기.
모델뷰어 높이 220px(detail) / minmax(240px,1fr)(tour), 음성 투어 최대폭 1100px·높이 85dvh, 도시버튼과 음성버튼 48px 이상. 모델은 직접 제작한 설명용 3D 모형이며 실측 제조사 CAD로 표시하지 않는다.
음성: SpeechSynthesis ko voice를 사용하고 같은 내용의 자막을 항상 표시. 한국어 음성 미설치/오류 상태에서는 글로 탐색할 수 있고 자동 재생은 정지한다. 이전/다음/닫기/홈 이동 시 기존 발화를 취소하여 겹치지 않는다. 텍스트만 환경에서도 모든 정보 접근 가능.
지역: 사천/울산/창원 등 공식 기업 자료에 공개된 도시 수준의 산업 연결. 전시 모델 위치와 산업 연결 마커는 구분하며 실제 배치 위치로 표현하지 않는다. 참여기관은 검증 가능한 공개 역할만 표시하고 정보기관 참여는 추정하지 않는다.
사용자 흐름: 홈 군/환경 선택 → 지도에서 체계/지역 선택 → 역할·3D 모델·기관과 근거 → 듣기/변천. 음성 투어는 육·해·공·해병·우주 5개 장면을 명시적으로 선택·전환하며 자동 넘김은 선택 옵션이다. 키보드와 터치·자막 대체를 유지한다.

## 객체 중심 체계 시연 v4
팔란티어 공식 Ontology core concepts의 객체·속성·관계·동작 개념을 참고한다. 실제 Foundry SDK나 OWL 추론 엔진은 아니다. System/Organization/Project/Region/Source와 타입 있는 관계를 로컬 데이터로 구성하며 원문 근거와 설명용 분류를 구분한다. 공통 환경/기관 연결은 실제 무기 간 상호운용이나 전술 협업을 입증하지 않는다.
SystemDemo: 기존 1100px·85dvh 밝은 native dialog를 재사용. 외형/구성/역할 단계 button(aria-pressed), 3D stage와 관계 탐색 inspector, 이전 화면으로 복귀. 구성은 실물 내부 부품이 아닌 설명 모형의 외형 그룹이다. 역할 단계는 사용자가 재생할 때만 6초의 단순 이동/관측 표현을 시연하고 중지/초기화 가능. 실제 속도·사거리·임무 계획을 표현하지 않는다. 모션 감소·탭 비활성·닫기에서는 재생을 중지한다.
기존 token과 네이티브 dialog 초점관리 사용. beui center-morph-modal 소스의 controlled open/close·reduced-motion 원칙을 참고하되 React/Motion 의존성은 추가하지 않는다. 관계 카드는 공통 환경/공개기관 여부와 근거 링크를 명시하며 체계 버튼은 다음 객체의 시연으로 이동한다.

## 실물 외형 자료 v5
장비의 임의 도형과 외형 조각 펼치기를 전시에서 제거한다. 지도에는 장비를 의미하는 중립 마커를 사용한다. 장비별 공개 3D / 실물 사진 / 자료 준비 중을 구분한다. K9는 위장 도색 공개 3D, K2는 상세 외형이나 실물 도색과 다른 공개 3D다. FA-50·천무는 실제 사진으로 표시하며 3D라고 부르지 않는다. 모든 자산에 저작자·사용권·원본을 표시한다. 외부 뷰어·사진에는 인터넷이 필요하다. 동작 애니메이션 미확보 상태에서 임의 이동을 재생하지 않는다. 아직 없는 장비 자산은 정직한 준비 상태와 기존 공개 정보로 탐색한다.

## 한반도 운용 환경 v6
기존 밝은 색·48px 버튼·native dialog를 유지한다. EnvironmentScene은 공개 DEM의 지형과 지상/수면/수중/공중/연안/우주 환경을 연결한다. 지형 높이와 항공·수중 레이어 간격은 전시에서 보기 쉽도록 과장한다. 공개 고도 데이터를 로컬로 가공하여 외부 지형 서비스 연결 없이 표시한다. 실제 배치·항로·잠항 수심·작전이나 성능을 표현하지 않는다.
장비 외형과 운용 환경은 별도 탭으로 동일 체계에 연결한다. 외형은 검증된 공개 3D/사진을 유지하고 환경 시연의 이동 표시는 이름이 붙은 중립 마커다. 공개 모델 iframe을 현지 Three.js 지형에 삽입한 것으로 표현하지 않는다. 사진 장비도 환경 시연이 가능하나 장비 자체 3D 동작은 아니다. 제조사 사용권 있는 GLB 확보 후 동일 장면에 실물 외형 자산을 통합할 수 있다.
EnvironmentHost 높이430px/모바일340px, 환경 안내·지형 출처·재생/중지/전체 시점 버튼 제공. 선택시 적합한 환경으로 자동 연결: 전차·자주포·천무=지상, 충남함=수면, 도산안창호급=수중, FA-50/MUAV=공중, KAAV=연안, 위성=우주. 지상만 산악/평지 선택 제공. 지도 자체도 DEM과 해당 높이 레이어로 마커 배치. 육해공 군 분류와 운용 환경은 독립된 관계로 표시한다.
환경 이동은 명시적 재생 시8초, 종료/닫기/체계 변경/탭 비활성에서 취소. 모션 감소 시 정지 지점과 자막으로 동일 내용을 제공한다. 모든 환경 설명은 텍스트 대안, 전체 체계는 목록으로 선택 가능. 로딩/실패/재시도 상태 제공. DEM은 0.05도 샘플로 정밀 현장 지형이나 항해 자료로 사용할 수 없다.
환경 토큰: terrain-low #6ba787, terrain-high #ced7c9, terrain-rock #7e927f, terrain-base #a7c3b1, water-deep #8ebdd0, water-surface #b8dce9, sky #edf6fc. 색보다 환경 이름·범례가 분류의 기준이다.

## 관람객 스크롤 전시 v7 · Toss 참고
사용자 요청은 토스의 UI/UX 원칙을 K-방산 전시에 적용하는 것이다. 금융 화면·로고·글꼴·브랜드 콘텐츠의 픽셀 복제가 아니다. 2026-10-08 실제 Chrome ko-KR에서 https://toss.im/ 를390/768/1440px로 열어 첫 장면과 스크롤 장면, computedStyle을 docs/evidence/story-v7/reference에 기록했다. /ko는404여서 참고에서 제외했고 한국어 루트의 정상 캡처로 대체했다. 확인값: desktop navigation16px/500, mobile hero40px/700/46px line-height, tablet hero60px/700/72px. 큰 제목, 이미지 중심 장면, 장면별 짧은 설명, 여백, 시각적 스크롤 전개를 차용한다. 제품은 로컬 Noto Sans KR 유지. Toss Product Sans는 복제하지 않는다.

토큰 v7(밝은 기본 토큰을 대체): text #191f28, muted #4e5968, dim #6b7684, bg #f7f8fa, panel #ffffff, elevated #f2f4f6, line #e5e8eb, accent #1b64da, accent-dark #e8f3ff; blue-hover #1557c0, sky-light #eef6ff, hero-tint #dcecff. spacing은 기존4px단위, 추가section96/128px, max-story-width1200px. radius action16px, media32px, pill999px. 제목 story40/60/72px, subsection28/40/48px, body18/20px, caption12/14px. mobile title32px로한국어어절을보존한다. contrastAA목표, linkunderline, 최소48px터치.
StorySection: 한장면한제목·짧은설명·1주동작. Hero에는실제FA-50사진(원본CCBY2),명확한군4선택. 다음 장면은공개DEM한반도3D, 다음은공개계약세계3D, 마지막은전체체계와군/환경선택. 상세정보는기존탐색/시연으로이어지고출처는접을수있는details로제공한다. 숫자는수록데이터범위,수출은폴란드1개국·계약사례이며세계전체시장이나납품실적으로칭하지않는다. 제조사CAD·모든실사자산미확보범위유지.
StoryCTA: defaultblue/hoverblue-hover/pressscale.98/focusring/disablednative. StoryJump: native anchor orbutton smoothscroll(600msbrowsernative),touchmomentumnative. Reveal: IntersectionObserverroot.main, contentvisiblebydefault; enteropacity0→1,y24→0,600mscubic-bezier(.22,1,.36,1), nooutgoinghidden. Onkeyboardfocusreveal즉시. Sectionactivepill showscurrentchapter,progressbartransformscaleX. Stage3D: realThree.jsexistingAtlasMap reuseAPI, on-demandlazyload, loading/error/retryDOM, sourcedataandaccessibledetailbuttons. Scroll-driven3D changescamera/connection reveal onlyactiveviewport, userrotationdisableprogrammaticupdateuntilscene-reset; noindefinitedecorativerotation. worldline한국→폴란드는계약관계,실제운송경로아님.
PageTransition: scoped .main opacity0→1+translateY12→0,320ms; WAAPI; cancelpreviousanimationrapidnavigation. Dialog open same320ms fade/translate, close nativefocusrestore. Reducedmotiondisablestransformreveal/page/cameraanimationsandnativejumpinstant, finalstaticstate&allcontentavailable. documenthidden/nohome stopsstoryframes. Passive scroll schedulesoneRAFperframe, no wheel/touch hijack, no scroll trap.
MenuToggle: nativebutton aria-expanded. Home leavesnavigationcollapsed, menuopensdrawer; explorationcanmanuallyhideleft/bottomnav; duringdemoauto-collapseandrestorepreviousmenustateonclose. Demo focusplay hidesinspectorandauxiliarycopy, explicitinformationbuttonrestoresrelatedsystems; stop/endrestores. Closeandpendingplayversionguardsremain.
Persona: museumfirstvisitor seeshero→branch→visual; portraittouchuser controlsreachablebottomand48px; keyboardreaderusesanchors/buttonsandnoncanvasdata; employeeopenspublicsources/details. Debt: actualhardwareGPU/24h/volume/offlinemodelintegrationnotcertified. Syntheticqualitynumbersmustbeobservednotinvented. Video footageisnotavailableunderverifiedlocallicense; useactualphotoandreal-time3Dmotion,noclaimfinishedvideo.
実装細部補足: StoryHeroの実写はFA-50写真であり飛行動画とは表記しない。hero alphaはsky-lightの.98/.95/.35/.1、横herogradient90deg・縦180deg。HeroCTA56px/mobile48px、choice64px/mobile56px、export72px、mobilecredit10px(補助著作権のみ)、mobilecanvas400px・desktop560px、maxcanvas680px。StoryMapは展示スクロールを優先しOrbitControls無効、詳細地図で回転/拡大が可能。detail-moreはnative detailsで企業/事業/契約/出典を開閉しgraphの根拠動作で自動展開。menuEscapeはダイアログがない時閉じてbuttonにfocus復帰。page320msの値とcopyはトスから直接コピーせず展示固有のルール。
세로 하드웨어 보정: 화면폭만으로가로배치를선택하지않는다. aspect-ratio3/4이하·601px이상은hero상단8dvh(64~160px),title60px,한반도/세계장면singlecolumn,canvas45dvh(560~900px),군버튼80px. 현재장면의번호는accent색으로선택배경에서AA대비를유지한다. overlayportraitalpha.96/.08.


## 위성 전시 v8 · 2026-10-12 토스 실측 적용

사용자 요청에 따라 토스 공식 홈페이지 https://toss.im/ 의 현재 런타임을 다시 확인했다. 최신 레퍼런스는 상단 16px/500 메뉴, 12px 다운로드 버튼 radius, 60px/700/72px hero 제목, 40px/700/56px 장면 제목, 큰 둥근 미디어와 문구 단위 translate 전개다. 금융 영상·브랜드 로고·전용 글꼴은 이 프로젝트 자산으로 복제하지 않는다. 기존 v7의 밝은 표면·큰 제목·실사 장면을 유지하면서 미디어 깊이와 장면 연결을 강화한다. 정확한 화면 복제가 아닌 전시용 디자인 시스템 적용이다.

토큰 추가: --motion-reveal 720ms, --motion-stagger 90ms, --motion-fast 200ms, --motion-panel 360ms, --motion-shift 24px, --motion-hero-shift 48px, --motion-hero-scale 1.06, --motion-media-shift 32px, --motion-hero-travel 64px, --motion-spring cubic-bezier(.16,1,.3,1), --motion-press-scale .98. Lenis 홈 전용 wheel lerp .085, wheelMultiplier1, 프로그램 이동 duration .9초, easing min(1,1.001-2**(-10*t)). 터치는 네이티브 관성을 유지한다. 모든 수치는 전시 적응용 결정이며 토스 고유 애니메이션의 정확한 시간으로 주장하지 않는다.

기존 primitive를 재사용: StoryCTA/Action/FilterChip/SystemCard에 같은 press/focus/selected 토큰; StoryHeading은 글자 단위 대신 한국어 의미 단위 span을 90ms 간격으로 드러낸다. StoryMedia는 같은 reveal primitive를 사용하며 viewport 안에서만 scroll transform 최대32px. HeroMedia는 확대1.06→1과 64px 이내 이동, HeroHeading은 짧은 문구 단위 전개. StoryChapters는 현재 위치를 명시하고 progress transform을 연속 갱신한다. MotionShowcase는 기존 /?showcase=1에서 상태를 확인한다.

홈 .main만 Lenis로 부드럽게 이동한다. 지도 탐색·자체 스크롤 목록·native dialog·3D pointer controls는 네이티브 조작을 유지한다. 홈 종료, dialog 열림, document hidden, reduced motion 변경에는 Lenis를 제거하거나 정지하고 pending RAF/WAAPI 취소. 모든 프로그램 이동은 interruptible, 클릭·키보드 입력을 잠그지 않는다. reveal 기본 DOM은 읽기 가능하며 focus 즉시 표시. 모션 감소에서는 모든 transform 효과·smooth wheel을 제거하고 최종 상태와 동일한 콘텐츠를 제공한다. 모션은 장면 순서·현재 위치·선택 반응을 설명하는 데 사용하고 무기 동작을 꾸미지 않는다.

위성 지형은 실제 Esri World Imagery와 ArcGIS Terrain3D 고도1:1, CesiumJS 렌더링이다. v6의 과장 지형·중립 이동 마커 설명은 이 절로 대체한다. KAAV/FA-50/도산안창호급/누리호 GLB는 공개 자료 기반 외형 재구성, 제조사 CAD·검증된 실내 아님. 공식 원문 내부 자료는 별도 OfficialResource 카드에서 기관·자료 범위·사용권을 명시한다. 원본CAD 재배포권한과 측정좌표 없는 자료로 현재 추정 시점을 검증된 탑승 시점으로 바꾸지 않는다.

접근성/부채: 기존 48px 터치·focus·한국어 keep-all·본문대비 유지. 저사양GPU·오프라인지형·실측내부는 미검증이다. 모바일터치에wheel을강제하지않고 reveal은유한한진입동작이다. 성능점수는측정없이주장하지않는다.

OfficialResource primitive: 기관+자료명+확인범위+원문열기+사용권. 공식 자료를 확인한 체계에만 표시하고 실측CAD·검증내부 여부를 scope/rights로 구분. surface elevated, radius r3, padding s5, gap s3, heading t3, body t1, caption t0, link accent/underline, hover accent-dark, focus 기존2px. 같은 component를 상세와시연 inspector에 재사용. Showcase는 FA-50 카드·CTA default/disabled/selected를공통토큰으로표시.

HeroMedia v8 프레임: 토스 1280px 실제화면의 inset16과 큰라운드미디어를 참고하여 width calc(100%-s8), margin s4 auto s8, radius story-radius. 전시 고유 FA-50사진을사용. HeroCTA는 3D전시둘러보기1개만primary, 위성장비직접진입과음성은secondary로계층분리.

OfficialResourceFacts는 공식문서에서확인된구성항목을dl(dt/ dd)로표시. font t1/line1.65, gap s3, dd margin s1, dt600/text, ddmuted. 3D내부검증과일치성을추정하지않는다.

MapLabelLayout: 한반도에서체계이름이겹치면화면좌표·실제font측정으로충돌라벨만숨긴다. 선택체계는항상우선표시. 모든23개point와목록은유지하고zoom/drag/resize후재계산한다. label14px/600·centeranchor, 실제문자폭+20px배경/여유, height28px. export국가레이어는기존표시유지.

지도모바일가독성: 라벨가로는실제화면폭내로제한. 수출7개국/기준점 라벨은28px단계로최대84px까지세로옮겨겹침을피하고지리point/연결선은원좌표유지. 한반도는선택우선충돌숨김, 목록은모두유지.

SceneViewControls도최소48px, actionradius r2. 모바일사진자료는toolbar2행높이+s10 위에배치하여서로의터치영역을가리지않는다.

SourceTerm: Warning Lights/L/G Panel/Side Stick/Throttle Grip 및붙는조사어절은nowrap으로기술명중간분절을막는다. 카드폭보다짧은검증된기술명에만적용한다.

## 군별 대표 실사 전시 v10

기존 Toss 참고의 밝은 표면·StorySection·Action·48px focus·native dialog를 재사용한다. 대표 체계는 육군 K2, 해군 도산안창호급, 공군 FA-50, 해병대 KAAV이며 홈의 대표 관람 섹션에서 실제 사진으로 선택한다. RepresentativeCard는 media radius story-radius, 표면 panel, 제목 t3, 군·짧은 설명 t1, 출처 t0. 4열→태블릿2열→600px이하1열, 이미지16:9 object-fit:cover; 정확한 전체 외형은 원본/시연에서 contain으로 보여준다. 콘텐츠 축은 한 장면 한 메시지이며 기업·사업·수출·사용권은 details로 단계 공개한다.

RepresentativeDialog는 native modal, header/scroll-owned body/footer로 구성한다. 최대폭 1200px, 높이90dvh; 2400px이상2000px. 실제 영상16:9 contain, 세로에서 전체 영상을 자르지 않는다. 선택군4개는 Action/aria-pressed, 관람 단계는 실제 영상·3D 지도/외형·사업/수출. 3D 동작은 기존 체계 시연으로 이어진다. 공개 사진 기반 모델과 실제 영상의 종류·원본·저작자를 항상 구분한다. 날짜는 촬영/공개 사실과 자료 확인을 분리한다.

영상은 사용자가 재생을 누른 후만 로드하고 자동 소리/자동 순환을 하지 않는다. 로컬·공개 스트림은 native video controls/playsinline/preload none, 공식 외부 영상은 iframe과 원문 링크를 제공한다. 영상 준비·로드 실패·네트워크 차단 시 실제 사진·글·원문 대안을 유지한다. 새 체계 선택/닫기/다른 관람 단계/탭 비활성에서는 기존 영상 정지 또는 iframe 제거. 새로운 미디어의 loadeddata와 iframe load는 각각 다르며 iframe load를 재생 성공으로 표시하지 않는다. 모바일·세로에서 버튼을 영상 위에 겹치지 않는다.

beui center-morph-modal의 controlled open/close·focus restore·reduced-motion 원칙을 native dialog로 적용한다. 진입은 기존 page-duration 320ms opacity/translate, 모션 감소에서는 정지 표면. 닫기 후 실제 opener로 초점 복귀, 3D 전환에서는 새 dialog 초점을 방해하지 않는다. 소리 없는 상황에도 역할·자료 범위·출처를 글로 제공한다. 공식 영상의 자체 자막 유무와 앱 안내를 구분하고 없는 대사를 생성하여 붙이지 않는다. 제조사 CAD·확보되지 않은 실내·자산 다운로드 사용권은 추정하지 않는다.
RepresentativeDialog backdrop는 기존 native dialog와 같은 rgb(23 43 77 / .3)를 --modal-backdrop로 명명한다. Play affordance는 기존 s2/s8/shade 그림자를 사용하고 cover hover는 기존 motion-hero-scale 토큰을 공유한다.
RepresentativeMedia는 width min(100%,40dvh×16/9)로 높이도 제한해 PC에서 영상 컨트롤과 다음 동작을 볼 수 있게 한다. 큰 가로 화면의 군 선택·보조 동작은 t4/64px로 확대한다. 대표 시연은 ?representative=id 주소로 공유하고, 닫으면 이전 URL·초점을 복원한다. 체계 선택 때 현재 대표 주소만 갱신하고, 3D 전환 때 기존 system 주소 체계로 이어진다.
Native 영상의 첫 실제 playing에서 설명 패널을 자동 접고(관람자가 펼친 설명은 버퍼링·재개 때 유지), pause/ended/stop/error이면 복원한다. 외부 iframe은 사용자 연결 요청에만 집중 상태로 진입하며 load를 실제 playing으로 취급하지 않는다. 집중 버튼 aria-controls는 실제 representative-context와 연결한다.

## 온라인 실사 장면 v11
CesiumJS의 실제 위성 영상·고도1:1을 유지하며 태양광, 모델 그림자, FXAA와 물리 기반 환경 반사를 적용한다. Poly Haven Greg Zaal의 CC0 Kiara 6 Afternoon KTX2를 모델 반사광으로 사용하고 한국 지형 사진으로 표현하지 않는다. 원문 조명 근거는 public/lighting/ATTRIBUTION.md에 기록한다. 기존 native Action·48px 컨트롤과 지도/외형/사진 비교는 유지한다. 모델 원본 GLB와 사진의 자산 범위를 바꾸어 표시하지 않는다. 지상 모델은 지형 높이, 공중 체계는 전시 고도, 수면 체계는 수선 기준으로 배치한다. 하드웨어 해상도별 그림자맵 1024/2048과 on-demand render를 사용하여 유휴 GPU 작업을 줄인다.
현장 관측 기준점은 로컬 GLB 유무와 무관하게 공개 고도를 샘플링해 지면 높이에 둔다. 세부 지형 갱신 시 기준점·마커·근접 카메라도 함께 보정하며 관측 좌표의 분류는 전시용으로 유지한다.
