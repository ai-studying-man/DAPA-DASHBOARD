# 전체 무기체계 고도화

2026-11-02 사용자가 K2 한 종의 품질 게이트를 기다리지 말고 모든 체계에 진행하도록 범위를 확대했다. 원문 MD는 보존하고 이번 지시를 우선한다. 기존 대시보드23종 + 기존 장비목록21종에서 중복을 제거한 **39종**을 대상으로 한다. 해외 비교2종과 명칭 확인 항목도 보존한다.

시작: main `b5d2191`, clean. `git fetch origin` 후 HEAD와 origin/main 차이0. 기존 모델을 덮어쓰지 않는다. 원본별 SHA256, 사진/AI 이미지 구분, 라이선스, 새 모델 및 Blender 경로를 `blender/fleet/catalog.json`에 기록한다.

K2 기존 검증 산출물은 재생성하지 않는다. 나머지 기존 GLB는 별도 후보에 재사용한다. 로컬 GLB가 없는12종은 공개 외형의 독립 제작 전시 연구 모형을 추가한다. 위성의 미공개 세부와 명칭 미확인 항목을 실제 검증 형상으로 취급하지 않는다. 실사 정확도 미달을 작업 미진행의 이유로 쓰지 않고 각 체계의 남은 품질 과제로 기록한다.

1. 전체 자산·출처·원본 해시 목록 확정.
2. Blender 원본/PBR/부품 피벗/교육용 모션과 별도 GLB 생성, 전 체계 validator·원본 보존 검사.
3. 전체39종이 실제 선택·로딩되는 뷰어, 군별/유형별 부품·모션, 저사양·터치·동작 감소·폴백.
4. 전 체계 브라우저·빌드·배포 검증, 커밋과 재개 명령 기록.

실사화 또는 제조사 검증 완료를 전체 공통 배지로 표시하지 않는다. 새 페이지는 기존 지도/대시보드/21종 검토 경로와 병존한다. 원본 모델의 이용 조건은 보존하며 새로 라이선스를 허위 부여하지 않는다.

## 모델·재질·리깅 체크포인트 · 2026-11-03

- 대상/출처 목록 커밋 `ddcde61`. 재사용27종(K2는 검증본 그대로), 신규 외형12종, 최종39종이다.
- `blender/fleet/build.py` 실제 Blender 4.5.9 실행 완료. 새 `.blend`38개는 `blender/fleet/models/`에 packed 이미지와 함께 저장(최대 약12.4MB, 전체 약60.7MB). K2는 `blender/k2/source.blend`를 재사용한다. 기존 원본 GLB27개를 변경하지 않았다.
- 신규12종은 MUAV/425/초소형위성/K10/K808/레드백/LAH/T-50/KT-1/ANASIS-II/천궁-II/한산도함. 공개 사진·제조사·정부 자료의 외형을 참고한 독립 제작 연구 모형이다. 위성은 사업 개념형, 특정 호기·센서 상세 검증 모형이 아니다. 원문 자료 이미지를 무단 텍스처로 복제하지 않았다.
- 원본의 사진·AI 재질·CC0 상세 자산과 사용 조건을 보존했다. 무텍스처 면에는 독립 제작 baseColor/metallicRoughness/normal 기본값을 추가했다. 새 normal 기본값은 평면 맵이며 스캔 요철·AO 베이크라고 표시하지 않는다.
- 신규 원통 캡 n-gon이 Blender tangent 생성을 막는 원인을 실제 exporter 로그에서 확인해 삼각분할로 해결. 신규12종 normal fallback0. 기존 일부 UV 퇴화 프리미티브는 원본 형상·색을 유지하고 해당 프리미티브에만 flat normal 재질 변형을 사용한다. 체계별 수량은 감사 JSON에 기록한다. 투과·굴절을 포함한 glTF 확장은 등록하여 보존한다.
- `node scripts/optimize-fleet.mjs` 및 `node scripts/qa/fleet-models.mjs` 통과. 39종 모두 validator 오류0/경고0, PBR 이미지·ExhibitRoot·Turntable·실제 부품 노드·Blender 원본 존재·원본 SHA 보존 검사 통과. 87개 교육용 클립. 전 체계 실사 검증은 미완료 상태다.
- 체계별 실제 Cycles 렌더38개: `docs/modeling/fleet/`. K2 비교 렌더는 기존 `docs/modeling/k2/pipeline/` 재사용.
- Python 규칙 검사 4개 파일 위반0. `npm run qa:models`, `npm run qa:k2-pipeline` 회귀 통과. 빌드 성공, 기존 대형 chunk 경고 유지.
- 재개: 검증 모델을 일괄 재생성하지 말 것. `node scripts/qa/fleet-models.mjs` 후 전체 뷰어 브라우저 검증부터 이어간다. 생성기 기본 실행은 완료한 항목을 건너뛰고 `--only ID`로 필요한 항목만 수정한다.

## 전체 관찰 UI 체크포인트 · 2026-11-03

- 모델 생성 커밋 `794fa61`. `?view=fleet`에서39종 전체를 선택하며 기존 지도/21종 검토/기존 모델 경로는 유지한다. 체험관 상단 및 장비 출처 패널에 현재 장비·언어를 유지하는 전체3D 링크를 제공한다.
- 실제 소유한 부품만 select에 등록. 회전/부품 분리·재조립/포탑/포신/로터/프로펠러는 전시용이며 실제 운용·성능·내부 조립을 뜻하지 않는다. 위성 개념형, 해외 비교2종, 명칭 확인 항목, 사진/AI/이미지미확보와 사용 조건을 구분한다.
- production `fleet-browser.mjs`: 전39종×375/768/1280=117개 모델 화면, 추가 언어/동작감소12개 화면. 총129개 캡처. 87클립 모두 실제 position/quaternion 변화, 원본별 부품 선택, 이미지decode, 원본폐기/캔버스교체,4분류/4언어/저사양/reduced-motion, overflow0/pageerror0 통과.
- `fleet-interactions.mjs`:6종 모션의 정지/중간/복원18프레임, native touch, 재생 중 reduced-motion 중단,404/재시도,뒤로가기 복원 통과.
- 독립 검토2건에서 키보드 장비 변경 시 포커스 소실과 영문 괄호설명의 줄바꿈을 찾았다. 포커스 소실을 수정 전 실패 테스트로 재현했고 동등 조작자 포커스를 복원해 `fleet-keyboard.mjs`가 연속 ArrowDown/분류/언어/다음 버튼에서 통과했다. 괄호 설명은 공통 escaped markup으로 묶고 실제 전체 이름은 접근성에 유지했다.
- 수정 후129개 전체 캡처/9개 개요시트/19개 상호작용 이미지를 다시 생성했다. 두 독립 검토 모두 전체117개 모델·뷰포트를 개요시트로 확인하고 언어·동작감소·긴이름 원본을 직접 확인하여 UI 범위 PASS. 실사 형상 정확도 인증은 아니다.
- 증거: `docs/modeling/fleet/web/` 전체 캡처와 보고서, `interactions/`, `overview/`. 정면/측면/사선 Blender 실제 렌더117개와 자료 비교보드39개는 같은 상위 폴더 및 `comparisons/`에 보존했다. 렌더 작업은 저장된 Blender를 읽기만 하며 모델을 재생성하지 않았다.
- 기존 `qa:local-models`, `qa:k2-browser`, `qa:realism` 회귀도 통과. Pages workflow에 전39종 validator 게이트를 추가했다. 다음은 lockfile 재설치/최종 빌드 및 main push 후 공개39종 검증이다.

## 배포 준비 체크포인트 · 2026-11-03

- UI/검증 증거 커밋 `c916ca8`, 모델 생성 `794fa61`, 전체 대상 계약 `ddcde61`.
- 최종 `npm ci` 성공. `qa:models`, `qa:k2-pipeline`, `qa:fleet-models`, `build` 모두 재통과했다. 기존 의존성 취약점5개와 대형 chunk 경고는 별도 기존 부채로 유지하며 무관한 major 업그레이드는 하지 않았다.
- 모든 모델은 이미 검증되었으므로 재생성하지 않는다. 다음 단계는 원격을 다시 fetch해 변경을 보존하고 main 일반 push, GitHub Actions SHA 및 공개 build-info 일치 후 전39종의 실제 공개 브라우저 검증이다.

```powershell
git status --short
git fetch origin
git log -5 --oneline
gh run list --workflow deploy-pages.yml --limit 3
$env:QA_URL='https://ai-studying-man.github.io/DAPA-DASHBOARD/'
$env:QA_OUT='artifacts/3d/fleet/pages'
$env:QA_WIDTHS='375,1280'
$env:QA_FPS='1'
node scripts/qa/fleet-browser.mjs
node scripts/qa/fleet-interactions.mjs
node scripts/qa/fleet-keyboard.mjs
```

## 공개 Pages 전체 검증 완료 · 2026-11-03

- 배포 확인 SHA `f0d69c9dc746f0783d59e4b3a07eeb3f50c329a5`. Actions https://github.com/ai-studying-man/DAPA-DASHBOARD/actions/runs/41473851470 성공. 공개 build-info.json HTTP200과 SHA 일치를 확인했다.
- 공개 URL: https://ai-studying-man.github.io/DAPA-DASHBOARD/?view=fleet
- `QA_URL=https://ai-studying-man.github.io/DAPA-DASHBOARD/ QA_WIDTHS=375,1280 QA_FPS=1 node scripts/qa/fleet-browser.mjs` 실제 실행 성공. **전39종×모바일/데스크톱=78개 모델 화면,87모션,등록 자료 decode,부품 선택,4언어/분류/저사양/reduced-motion,교체/폐기,overflow0/pageerror0**.
- `fleet-interactions.mjs`, `fleet-keyboard.mjs`도 공개 사이트에서 통과. native touch,6모션 전후 프레임,재생 중 동작 감소,404/재시도,뒤로가기,연속키보드 장비변경과 포커스를 확인했다.
- 39종 각각 실제 렌더callback60프레임을 관찰했다. 이 PC Chrome의 375px viewport에서 약59.99~60.01fps, p95약16.8ms였다. 실제 휴대폰·저성능 GPU·장시간 성능이나 움직이는 실제 장비의 재현을 보장하는 수치가 아니다.
- 공개 증거 원문·캡처: `docs/modeling/fleet/pages/report.json`, 같은 폴더의78+상태8개 PNG, `interactions/`. 로컬117+언어/상태12개는 `web/`에서 별도 보존한다.
- 기존 코드/원본 자산 삭제·강제 push 없이39종 모두 제작·관찰 파이프라인을 적용했다. 이 단계는 전시용 외형/PBR/교육용 리깅/GLB/웹/배포 범위다. 모든 체계의 실측·실사 품질 검증, 미확보 다각도 실사, AO 베이크, LOD/KTX2 및 현장 장시간 검증은 별도 후속 과제로 명시한다.
- 더 이상 K2 품질 게이트 때문에 다른 체계를 보류하지 않는다. 이미39종 모두 진행했다. 다음 작업은 감사 JSON의 개별 체계와 비교 보드를 읽고 필요한 한 종의 형상·UV·자료를 보완하는 것이다. 검증한 전체 모델을 다시 만들지 않는다.

```powershell
git status --short
git log -6 --oneline
npm run qa:fleet-models
Get-Content docs/FLEET-ASSET-STATUS.json
# 필요한 ID 한 종만 보정 후 생성·검증
./.local/tools/blender-4.5.9-windows-x64/blender.exe --background --factory-startup --python-exit-code 1 --python blender/fleet/build.py -- --only k808
npm run models:fleet:optimize
npm run qa:fleet-models
```

K2는 기존 `blender/k2/` 파이프라인을 별도로 유지한다. 이 공개 검증 증거를 기록하는 후속 커밋은 런타임·모델을 변경하지 않는다. 후속 Pages 게시에도 최종 SHA 일치를 확인한다.

## 2026-11-04 웹 모델 검수

764c635에서 KF-21 엔진 덮개와 425사업·초소형 위성 단열재를 보정했다. 전체 40종 GLB 검증에서 오류와 경고가 없었고 로컬 프로덕션 빌드에서 Chrome으로 정면·우측·후면·상면·사선 200컷을 캡처했다. 세 체계의 새 비교판은 docs/modeling/representative-angles에 있다. 두 위성은 공개 사업 개념형이다. 다음 검수는 KF-21 날개 조종면 경계와 드론의 사진 대조, 미확보 대표사진 12종이다. Unreal 검수는 보류한다.
2026-11-04 K1 구난전차 대표사진을 등록했다. 2010년 국방화보의 정비훈련 사진으로 왼쪽 차량이 구난전차다. 원본 SHA-1 b480391846b092e61bce665dd2f1c559bcc3e56c와 일치하며, 공개 실사 대표사진은 29/40종이다.
KF-21 조종면 도장 경계와 리모아이-002B의 날개 단면·끝단을 수정했다. 전체 40종 GLB 검증, 대표 11종 55시점 렌더 및 리모아이 프로펠러 회전을 확인했다. 현궁 탑재차량은 K153C1 발사대 실사 스틸을 추가하여 대표사진 30/40종이다. K242A1 실사 훈련사진은 국방일보 원문 링크로 제공한다.
ANASIS-II 자료에 방위사업청 제공 발사 준비 실물 사진과 Airbus 위성 사진을 함께 수록한 연합뉴스 원문을 연결했다. 재게시 조건 미확인으로 사진 파일은 보류했고 대표사진 집계는 30/40이다.
KM187 대표사진(김남용, CC BY-SA 2.0)은 원본 SHA-1 b0b81de9bfef718fa372ab2cf98e75c862d95244와 일치하며 Blender 비교판에도 반영했다. K10·KM9 제독차, KM181, K332에 훈련 또는 제품 원문을 연결했다. 실사 대표사진 31/40, 미등록 9종 모두 장비 자료 링크가 있다.
