# K-방산 3D 디지털 전시관 — Codex 구현 전략 및 작업 지시서

작성 기준: 2026-11-02
대상: https://github.com/ai-studying-man/DAPA-DASHBOARD
배포: https://ai-studying-man.github.io/DAPA-DASHBOARD/

## 1. 제품 목표

단순히 회전하는 무기체계 3D 모델의 나열을 넘어, 한국의 방위산업 기술을 누구나 이해할 수 있는 재미있는 체험형 디지털 전시관으로 구현한다. 공식 공개 자료를 근거로 외형을 묘사하며, 설명용 시뮬레이션은 실제 성능 재현과 명확히 구분한다.

핵심 체험: (1) 3D 회전·확대·포커스, (2) 주요 부품 선택 및 쉬운 설명, (3) 시나리오형 연출, (4) 육·해·공·우주 분류, (5) 모바일과 저성능 환경 지원, (6) 출처 및 모델 신뢰도 표시.

## 2. 기존 저장소에서 확인한 내용

- `package.json`: Vite 7.3.7, three 0.180.0, cesium 1.146.0 등 사용. React 기반으로 작성되었다고 가정하지 말 것.
- `docs/MODEL-ASSET-STATUS.json`: 등록 체계 23, 로컬 GLB 모델 6, 미확보 17.
- 확인된 6종: K2, K9, KAAV, FA-50, 도산안창호급, 누리호.
- 6종 모두 `untextured-exterior-draft`, `photorealismVerified: false`, 이미지 텍스처 0으로 기록. 실사화 완료 주장 금지.
- 기존의 `npm run qa:models`, `npm run qa:realism`, `npm run qa:local-models`, `npm run build` 등 실제 사용 가능 여부를 먼저 확인.

## 3. 룩소 주니어 워크플로의 무기체계 적용

1. 3면도/참고도: 공개된 전후좌우 사진·정면/측면/상면 도면 등을 수집한다. 생성형 AI 3면도는 참고용 초안일 뿐 치수·디테일을 확정하는 근거가 아님. 서로 다른 사진과 공식 공개 제원을 대조한다.
2. Blender 모델링: 기존 GLB를 import해 재사용 가능 부품 파악; 차체, 포탑, 포신, 바퀴, 궤도 등을 별도 메시로 구성. 필요 시 `bpy` 자동 생성 스크립트 제작. 단순 primitive 형태를 사진 같은 완성품으로 오인하지 말 것.
3. 재질: UV/베이크, baseColor, normal, metallicRoughness, AO 등의 PBR 텍스처; 공개자료에 없는 기밀·내부 구조는 추측하지 않는다.
4. 리깅: 캐릭터 본 기반보다 부품별 pivot/parent hierarchy 우선. K2/K9는 공개된 범위의 포탑 회전·포신 고저·서스펜션 연출. 무장 운용의 실제 제어 알고리즘을 재현하지 않는다.
5. 애니메이션: 등장, 턴테이블, 분해/재조립(교육적 연출), 시연 모드. 정교한 기동학적 물리 재현이 아니라 교육·홍보용이라는 표기를 둔다.
6. GLB: Blender glTF exporter로 변환 후 validator 검사, glTF-Transform으로 압축하고 비교 렌더 이미지 생성.
7. Three.js: GLTFLoader, AnimationMixer, OrbitControls, Raycaster로 관찰·클릭 및 UI 연결. 필요한 경우에만 물리 엔진 추가.
8. GitHub Pages: 기존 Vite base path 및 배포 workflow 유지. 웹 브라우저에서 모델 404, 경로, 이미지 로딩 및 프레임레이트 점검.

## 4. GitHub 오픈소스 후보 — 역할 및 선택

| 기술 | 공식 저장소 | 역할 | 결정 |
| --- | --- | --- | --- |
| Blender | https://github.com/blender/blender | 자동 모델링, UV, 리깅, 렌더 | 필수 |
| Blender glTF IO | https://github.com/KhronosGroup/glTF-Blender-IO | GLB export/import | 필수 |
| Three.js | https://github.com/mrdoob/three.js | 기존 웹 뷰어 및 인터랙션 | 유지·강화 |
| glTF-Transform | https://github.com/donmccurdy/glTF-Transform | 메시·텍스처 최적화 | 필수 |
| glTF-Validator | https://github.com/KhronosGroup/glTF-Validator | GLB 구조 검증 | 필수 |
| COLMAP | https://github.com/colmap/colmap | 다양한 시점의 실제 사진 기반 3D 복원 | 선택: 사진이 충분한 경우 |
| Meshroom | https://github.com/alicevision/Meshroom | 포토그래메트리 파이프라인 | 선택: 촬영자료 충분 시 |
| Nerfstudio | https://github.com/nerfstudio-project/nerfstudio | NeRF/Gaussian Splat 비교 실험 | 선택: 실사 배경·정적 전시 |
| React Three Fiber | https://github.com/pmndrs/react-three-fiber | React 컴포넌트 기반 3D 구성 | 추후, 전면 마이그레이션 금지 |
| Drei | https://github.com/pmndrs/drei | React 3D 헬퍼 | React 채택 시에만 |
| React Three Rapier | https://github.com/pmndrs/react-three-rapier | 물리 상호작용 | React 채택 시에만 |
| CesiumJS | https://github.com/CesiumGS/cesium | 지리공간 시각화 | 기존 환경 유지 |

모든 GitHub 오픈소스를 전수조사했다고 주장하지 않는다. 채택 전 각 프로젝트의 최근 커밋, 호환성, LICENSE, 애셋 라이선스, 성능 검증 필요. 생성된 모델 자체의 이용 허락은 도구의 오픈소스 라이선스와 별개다.

## 5. UX 설계

- 메인: 한국 지도 또는 군별 카테고리와 영웅 비주얼(대형 3D 모델 1개) + 하단 무기체계 카드.
- 상세: 가운데 3D 모델, 좌측 3~4개 스토리 텍스트, 우측 '360° 보기 / 부품 살펴보기 / 시연 / 비교' 탭.
- 30초 체험: K2 카드 → 3D 로드 → 주요 부품 클릭 → 설명 카드 → 시연 연출 → 다른 체계 탐색.
- 접근성: 애니메이션 줄이기, 자막, 키보드 조작, 터치, 저품질 모드, 로딩 상태 및 2D 폴백.
- 브랜드: 밝은 토스 계열 UI, 절제된 블루 포인트, 3D 렌더를 돋보이게 하는 여백. 과도한 화염/폭발 효과보다 기술과 디자인에 집중.

## 6. 우선순위 및 인수기준

### Phase A — K2 1종 실사화 품질 게이트
- 기존 K2 GLB와 공개 참고사진을 비교해 형상 오류/누락 요소 목록 작성.
- `blender/`에 재현 가능한 모델 생성·보정 스크립트 및 .blend 파일, `public/models/`에 GLB 산출.
- body, turret, barrel, wheel, track 등 공용 파트 이름 규칙 설정.
- PBR 텍스처 최소 1개 이상 포함 여부를 자동 검사하되, 텍스처 존재만으로 실사 품질을 인증하지 않는다.
- 턴테이블/포탑/포신 애니메이션과 터치 지원; 공개 기술자료 이상의 기능 구현 금지.
- 참조 이미지와 Blender 렌더를 나란히 보여주는 비교 증빙 PNG 작성.
- `npm run qa:models`, `npm run build` 통과 및 브라우저 스모크 테스트.

### Phase B — K9 확장
- K2 파이프라인 재사용, 포탑·포신·차체 계층 정의, 소재·기동 모션 보강.
- K2/K9 공통 인터랙션 컴포넌트화.

### Phase C — 확장
- KAAV, FA-50, 도산안창호급, 누리호의 기존 GLB 품질 진단 후 난이도에 따라 제작.
- 새로운 17개 체계는 자산의 실제 확보와 라이선스·공식 근거가 먼저.
- 대형 파일은 필요할 때만 로딩, LOD/텍스처 압축 도입, 저사양 모드.

## 7. CODEX에 그대로 붙여넣을 마스터 프롬프트

```text
당신은 Blender Python(bpy), Three.js, Vite, glTF/GLB, 3D 웹 최적화 전문가이자 시니어 개발자입니다.

작업 저장소: https://github.com/ai-studying-man/DAPA-DASHBOARD
목표: 대한민국 무기체계의 뛰어난 외형과 기술적 특징을 대중에게 흥미롭게 보여주는 3D 디지털 전시관.

먼저 git status, 현재 branch, origin/main HEAD, 최신 커밋, 기존 변경사항을 확인하세요. 로컬 변경사항을 무조건 덮어쓰지 마세요. 필요 시 작업 브랜치 생성 후 origin/main을 안전하게 통합하세요.

기존 package.json, 모델 자산 감사 JSON, QA 스크립트, Three.js 뷰어, Vite base 설정 및 GitHub Pages 배포 워크플로를 읽어 현재 구조를 정확히 파악하세요. React를 사용한다고 가정하거나 처음부터 리라이트하지 마세요.

우선 K2 모델 하나만 끝까지 완성하세요.
1) 공인된 공개 자료 출처·이용권한을 조사하고, 정면·측면·상면 및 3/4 시점 참고 이미지를 정리하세요. AI 생성 3면도만으로 실제 구조를 확정하지 마세요.
2) 기존 GLB의 부품, 형상, 재질, 텍스처, 애니메이션을 검토하고 실제 사진과 오류를 비교 기록하세요.
3) 실행 가능한 Blender bpy 스크립트 및 .blend 파일로 외형을 보정하세요. 차체/포탑/포신/바퀴/궤도를 개별 노드로 정의하고 올바른 pivot을 배치하세요. 기존 자산을 사용하되 실제 외형과 다르면 수정하세요.
4) UV/PBR 재질 및 텍스처를 제작하세요. 출처나 허락을 확인하지 못한 이미지·3D 파일을 그대로 재배포하지 마세요. 기밀이나 비공개 도면·성능은 재현하지 마세요.
5) 교육 및 홍보용 turntable, 포탑 회전, 포신 고저 모션을 추가하고 정적/동적 설명을 구현하세요. 실제 무장 운용·교전 제어를 추정 구현하지 마세요.
6) GLB를 내보내고 glTF-Validator 및 glTF-Transform 검사를 거쳐 최적화하세요. 최적화 전후 비교 및 애니메이션 검증을 남기세요.
7) 기존 Three.js UI에 통합하세요. 모바일 터치, 클릭/포커스, loading/fallback, reduced-motion을 지원하세요.
8) 실제 Blender 렌더 PNG 3개(정면/측면/3-4면), 웹 화면 캡처 PNG, 모델 검증 결과, 테스트 로그를 artifacts/ 또는 docs/에 남기세요.
9) npm ci, npm run qa:models, npm run build 및 가능한 브라우저 테스트를 실행하세요. 실패 시 원인과 재현 방법을 명시하고 해결하세요.
10) 완성된 변경만 작은 단위로 커밋하고 GitHub Pages 배포가 올바른 커밋을 사용했는지 확인하세요. 배포 검증 전에는 완료라고 말하지 마세요.

K2가 기준을 통과하면 K9에 동일한 파이프라인을 재사용하세요. 그 다음 나머지 체계로 확장하세요. 1회 작업이 길어지면 docs/3D-PROGRESS.md에 완료 항목, 변경 파일, 마지막 성공 테스트, 다음 정확한 명령을 남기고 종료하세요. 코드·산출물 없이 계획만 작성하고 끝내지 마세요.

매 단계에서 수행 명령, 생성 파일, 테스트 결과, git commit SHA, 배포 URL을 요약하세요. 실제로 실행하지 못한 부분은 명확히 미완료로 표시하세요.
```

## 8. 단계별 재개 명령

```text
현재 브랜치와 docs/3D-PROGRESS.md, 최근 커밋, 미커밋 변경사항을 분석하고 마지막 성공한 체크포인트 바로 다음 단계부터 재개해. 이미 검증된 자산은 재생성하지 마. 이번 실행에서는 미완료 작업 1가지를 구현·테스트·커밋하고 다음 체크포인트를 기록해.
```

## 9. 선결 검증 질문

- 모델과 공식 사진의 실루엣·비례가 충분히 유사한가?
- 사용된 이미지/3D 모델의 제작자·라이선스·재배포 허가가 분명한가?
- 3면 AI 생성 이미지에 생긴 착시/환각이 실제 디테일로 굳어지지 않았는가?
- GLB 내 PBR 텍스처, 애니메이션, 좌표계, 단위, 노드 이름이 맞는가?
- 모바일 웹에서 프레임 유지와 로드 실패 폴백이 검증됐는가?
- 교육용 연출과 사실 기반 설명을 화면에서 명확히 구분하는가?
- 공개 가능한 외형 정보만 사용했는가?

## 10. 참고

- Three.js: https://github.com/mrdoob/three.js
- Blender glTF IO: https://github.com/KhronosGroup/glTF-Blender-IO
- glTF-Transform: https://gltf-transform.dev/
- Validator: https://github.com/KhronosGroup/glTF-Validator
- COLMAP: https://colmap.github.io/
- React Three Fiber: https://github.com/pmndrs/react-three-fiber
- Rapier wrapper: https://github.com/pmndrs/react-three-rapier
- Nerfstudio: https://github.com/nerfstudio-project/nerfstudio
