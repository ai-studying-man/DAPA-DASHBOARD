# K2/K9 사진 기반 3D 고도화 진행 기록

## 조사 체크포인트 · 2026-10-29 KST

- 시작 브랜치 main, HEAD `79f2b9a`. 시작 시 추적/미추적 변경 없음(로컬 도구·과거 증거는 .gitignore 대상).
- HTML/CSS/vanilla JS + Three.js 0.180.0 / Cesium 1.146.0 / Vite 7.3.7. React Three Fiber가 아니다.
- 로컬 GLB 6종(K2/K9/KAAV/FA-50/도산안창호급/누리호), 나머지는 사진·외부 자산·미확보 상태. `docs/MODEL-ASSET-STATUS.json`의 범위를 따른다.
- 기존 GLB에는 이미지 텍스처가 없으며 기존 코드는 UV를 제거한 단색/정점색 초안이다. 정밀 모델·실사화·검증된 내부를 구현한 것으로 간주하지 않는다.
- 최근 복구 커밋은 여섯 로컬 모델을 native 뷰어에 연결하고 가동 부품 유무에 따라 조작을 비활성화했다. 기존 변경을 보존한다.

## Threads 직접 확인

- 대상: https://www.threads.com/@kim.18041/post/DfA8ecPk5Nu
- 일반 웹 읽기 도구는 접근 실패했지만, 사용자가 열어 둔 Chrome의 실제 페이지에서 본문과 K9 영상 프레임을 확인했다.
- 게시자의 공개 설명은 사진 1~3장 → Gemini에서 Side/Top/Front/Rear 참고 이미지 → Claude로 3D 자산 → HTML 회전 관찰 순서다. 후속 댓글에 Blender 보완 결과와 4면 참고 틀이 있다.
- 영상에서 K9에 위장·패널·차륜 표면 정보가 표현되는 것을 관찰했다. 이것만으로 실제 메시 구성, 사진측량 여부, 제조사 정합이나 Blender 작업 과정을 입증하지 않는다.
- 확인한 본문/노출된 작성자 댓글에는 GLB/.blend 다운로드와 재배포 허가가 없다. 게시자의 이미지·영상에서 텍스처를 무단 추출하거나, 영상 자체를 우리 모델로 대체하지 않는다.
- 공개 게시물을 방법 참고로 사용한다. AI로 보완한 보이지 않는 면은 실측 자료가 아닌 추정이다.

## REA 역할 검증

- https://github.com/morluto/rea 의 README를 확인했다. REA는 native binary / JS·Electron / 웹사이트 / runtime 분석 도구다.
- 현 세션에는 REA 분석 도구들이 노출돼 있으나, Blender 장면 생성·사진→메시 변환 기능은 공식 README에서 확인되지 않았다. REA를 모델 생성기로 사용했다고 주장하지 않는다.
- Higgsfield `/use-blender` 설명도 읽었으나, 이는 별도 로컬 Blender MCP 연결 절차다. 조회만 했으며 MCP 설치·등록이나 유료 클라우드 생성을 실행하지 않았다.

## Blender 실행 경로

- 최초 PATH, Program Files/Blender Foundation, 사용자 Programs, Downloads 제한 검색에서 기존 실행 파일을 찾지 못했다. PC 전체 미설치를 증명하는 전수 검색은 아니다.
- 공식 download.blender.org의 Blender 4.5.9 LTS Windows x64 포터블 ZIP을 작업 폴더 `.local/tools/`에 준비한다. 시스템 PATH·기본 앱·설정은 바꾸지 않는다.
- 공식 SHA256: `41da973b9bf95bb312cbeff4d1982feb13259b43c821686b9bafea4dfe5477cf`. 다운로드 ZIP의 계산값 일치 확인.
- 압축 해제, 버전 확인, 실제 처리·렌더 결과는 아래 실행 기록으로 추가한다. 준비만으로 Blender 작업 완료를 주장하지 않는다.

## 이번 파이프라인

1. K2 실제 사진(CC BY 3.0)을 참고해 4면 **AI 추정 참고판** 제작. 원본 사진·생성 참고판·실제 촬영 자료를 구분한다.
2. 기존 K2 GLB의 부품 계층을 보존한 별도 Blender 작업 파일에서 UV·재질·내보내기를 처리한다. 기존 파일에 덮어쓰지 않는다.
3. 중성광에서 기존/신규 렌더와 사진을 비교한다. 파란 normal map이 baseColor로 연결되지 않도록 색상/데이터 텍스처 역할을 구분한다.
4. 개선 결과를 실제로 확인한 경우에만 대시보드 연결을 변경한다. 미흡하면 시험 자산으로 남기고 그 한계를 기록한다.
5. K2 품질 확인 후 K9로 확장한다. 다운로드 후보가 있다는 것과 실제로 확보·재사용 허가가 확인됐다는 것은 다르다.

## 검증 상태

- 조사 및 원본 보존: 완료.
- Threads 본문/대표 영상 프레임: 직접 확인. 원본 다운로드 자산: 미확보.
- Blender 실행/렌더: 완료. 공식 포터블 4.5.9 LTS (`8bf95cbd38d1`)에서 실제 CLI 실행. 초기 world 초기화 오류 수정 후 `--python-exit-code 1` 실행 성공.
- 4면 추정 참고판 및 표면 시험: 생성. 기존 형상은 그대로이며 완성된 실사 모델이 아니다.
- 새 GLB: 4,140,280 bytes, 이미지 1개 내장, 69개 메시, 20,304 삼각형, 모든 primitive UV 및 기존 5개 부품 그룹 검사 통과.
- 웹 연결: `?system=k2&model=photo-study`에서만 선택. 기본 K2/K9와 기존 6종 자산 파일 변경 없음.
- `npm run qa:models`, `node scripts/audit-photo-study.mjs`, `npm run build`: 통과. 빌드에는 기존 Three.js 관련 500 kB 초과 chunk 경고가 남는다.
- 실제 Chrome에서 시험본 로딩, 6방향 버튼 전환, 포탑 슬라이더 1° 출력, KO/EN/JA/ZH 시험 표시·한계 문구를 확인했다. 실제 프레임·초당 프레임·저사양 기기 성능은 정량 측정하지 않았다.
- 모바일 CSS viewport는 사용자 브라우저 배율 영향으로 요청값과 달랐다. 실제 `innerWidth=376`, `innerHeight=812` 확인 후 캡처했다. 원본 스크린샷에는 오른쪽·아래 합성 여백이 붙어 `*-viewport.png`는 해당 여백만 잘라낸 증거다. `web-mobile-native`는 캔버스 합성 누락으로 검증 증거에서 제외한다. 캡처 타임아웃도 발생해 4개 언어 모든 스크롤 위치의 시각 검증 완료로 보지 않는다.
- 지도 외부 타일 로딩 지연 안내가 표시됐다. 이번 로컬 모델 로딩과 구분하며 위성 지도 성공을 주장하지 않는다.
- 위성 지도 외부 타일, 실내·실제 주행/사격 물리: 이번 단계의 완료 범위가 아님.

## 결과와 다음 품질 게이트

- 작업 원본: `artifacts/3d/k2-photo-study/source.blend` (AI 참고판 packed).
- 실제 Blender 전후 렌더: 같은 폴더 `before.png`, `after.png`.
- 재현 스크립트: `scripts/blender/photo_study.py`, 설정 `scripts/blender/k2-photo-study.json`.
- 원본 사진·AI 참고판·시험 GLB의 사용 조건은 `docs/asset-sources.md`, `docs/modeling/k2/README.md`, `public/models/k2-photo-study-ATTRIBUTION.md`에 구분했다.
- **최종 실사 품질 미달:** 차륜·패널 투영 위치 불일치, 거친 형상, 늘어짐, 일부 회색 배경 투영이 남는다. 사진측량, 제조사 CAD, 검증된 4면 정합이 아니다.
- 기본 자산으로 승격하지 않는다. K9에 같은 오류를 확대 적용하지 않았다. K2 부품별 형상/UV 수정과 충분한 허가 자료 확보 후 K9로 확장한다.
- 독립 코드 검토 PASS. 최초 시각 검토의 빈 캔버스·상면 잘림 캡처는 제외하고 대체 캡처 및 4개 언어 안내 캡처를 추가했다. 일본어 문장 끝 한 글자 줄바꿈도 수정했다. 브라우저 제어 연결 복구 후 실제 375×812 화면을 다시 캡처했고, 새로운 독립 검토가 활성 웹 캡처 20개와 전후 렌더를 확인해 **시험 표시·안내·레이아웃 PASS / 최종 실사 품질 FAIL**로 판정했다. 사이트 전체 시각 검증이 아닌 K2 시험 기능 범위다. 상세: `artifacts/3d/k2-photo-study/QA.md`.

## 2026-11-02 · チェックポイント 1 / K2 생성·검증

- 원문 MD를 `docs/K-DEFENSE-3D-INSTRUCTIONS.md`로 보존했다. 입력/복사본 SHA256 `647a8d471b3a6ba147cd1328d05dc6eaca653c26db819a46451cfb867fb76afc` 일치. 기준 동기화 SHA `f9e14ec`, 지시서 커밋 `90cddec`.
- `npm ci` 성공. 기존 의존성 감사에서 5개 취약점(중간 1/높음 3/치명 1) 보고. 이번 작업에서 일괄 major 업그레이드하지 않았다.
- `blender/k2/build.py` 실제 실행 완료. 기존 표면 보정 GLB를 재사용하여 UV를 펼치고 도장 normal/metallicRoughness를 독립 제작했다. baseColor 포함 3개 packed 이미지. `blender/k2/source.blend` 실제 열기·이미지 packed 확인 성공. 형상 정밀 재구축과 AO 베이크는 미완료다.
- 부품 계층/피벗 유지, NLA 교육용 4초 클립 Turntable/TurretTraverse/BarrelElevation을 실제 GLB로 내보냈다. 실성능·무장 제어 모형이 아니다.
- Blender의 무텍스처 재질용 불필요 접선 159개 오류를 확인했다. glTF-Transform에서 사용하지 않는 접선 속성 146개만 제거, 도장 normal-map용 19개는 유지. 독립 read-only 진단 3건이 같은 원인과 0오류 결과를 확인했다.
- `node scripts/optimize-k2.mjs` 성공. 정규화 GLB 7,239,336 → 최적화 7,049,400 bytes, 189,936 bytes 절감. 정규화/최적화 Khronos validator 각각 오류 0 / 경고 0. Blender 직접 export의 오류 원문도 artifacts에 보존했다.
- `node scripts/qa/k2-pipeline.mjs` 성공: 이미지/UV/12차륜/궤도/부모 관계/3클립/원본 3개 해시 보존.
- `npm run qa:models` 성공: 실제 현재 카탈로그 23종/로컬 모델 9종. 선택적 Markings를 필수 가동부로 오인하던 감사를 수정했고 다른 필수 부품 검사는 유지했다. 새 후보는 기본 자산으로 승격하지 않는다.
- 실제 Cycles 정면/측면/3-4면과 사진 나란히 비교: `docs/modeling/k2/pipeline/`. 최적화 전후 같은 브라우저 카메라·조명의 픽셀 차이 0 확인. 사진 가림·시점 차이 때문에 실측 정합 증거로 간주하지 않는다.
- Python 규칙 검사: Blender 내장 Python으로 실행, 위반 0. `npm run build` 성공, 기존 대형 chunk 경고 잔존.
- 현재 **K2 실사 품질 게이트 FAIL**: 단순화된 실루엣/패널/궤도, 무가림 다각도 참조 미확보. K9 확장 보류. 다음은 웹 기능·회귀 테스트와 후보 선택 경로 배포 검증.
