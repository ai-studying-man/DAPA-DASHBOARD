# 사진 색상 참고 PBR·기업 연결 보강 — 2026-11-02

## 구현 결과

- 첫 장비 선택에서 바로 3D 둘러보기 진입. 중간 메뉴를 거치지 않고 고정된 둘러보기 / 3D 시뮬레이션 / 실제 영상 탭 전환.
- 같은 화면의 이전·다음 버튼과 native select로 전체39종을 전환. 기업 필터 및 카드/3D 화면의 회사·역할·공개 원문 링크.
- 기존23종+21종 목록의 합집합39종 유지, 25종에 기업 연결. 나머지14종은 자료 확인 중으로 명시. 체계종합·구성품·플랫폼 역할을 단일 제조사로 뭉뚱그리지 않음. K151현궁형은 기아 플랫폼과 현궁 통합업체 확인 상태를 구분.
- K9에 한화 공식 실제 기동 영상 플레이어 연결. 외부 플레이어는 네트워크/제공자 정책에 의존하며 파일 재배포하지 않음.
- Blender4.5.9에서 K2/K9 사진 참고 표면 보강본 생성, 기존 파일을 보존하고 새 GLB로 관람/기존 상세/실제 지형/군별 장면/21종 검토의 K2/K9를 연결.
- 가상 전시 장면은 기존 타일 격자 대신 한국 산악·해안 참고 절차적 지형·자연광·원거리 안개 사용. 거친 인물이나 전투 동작 추가 없음. 실제 DEM은 별도 기존 위성·고도 관찰 경로에 유지.

## Blender 산출물과 정확한 방법

- scripts/blender/photo_pbr.py
- public/models/k2-photo-pbr.glb, k9-photo-pbr.glb
- artifacts/3d/photo-pbr/k2.blend, k9.blend
- 같은 폴더의 k2/k9-after.png, paint/normal/roughness PNG, provenance.json, audit.json.

원본 실제 사진의 지정된 작은 영역에서 색상을 샘플링하고, 25% 샘플+75% 제작 도장색을 혼합했다. 위장무늬와 미세 요철은 제작한 패턴이다. **사진 표면 전체를 복원하거나 사진측량으로 형상을 생성한 것이 아니다.** 큰 외장 면의 UV를 다시 생성해 기존 무늬 누락을 수정했다. 도장/고무/금속/광학재질 분리, roughness/normal map과 제작한 먼지 tint를 내보냈다. 차체 외부 패널·볼트 및 작은 edge bevel을 보강했다. 소스별 사진 저작권/기존 외형 모델 조건은 public/models/PHOTO-PBR-ATTRIBUTION.md에 연결했다.

**실사 수준 달성·정밀 형상 복원·제조사 CAD·스캔 재질·검증된 조종/비행/항해 성능은 아직 아니다.** K2/K9 기본 차체·포탑·궤도 형상은 이전 사진 참고 추정 외형을 유지한다. 다른23개 GLB는 이번 PBR 제작 대상이 아니며 기존 품질 유지. 참조 이미지에는 이전 AI 생성 참고판도 남아 있으며 실제 사진과 구분한다.

## 공식 연결 근거

- K2 및 K1구난: https://www.hyundai-rotem.co.kr/en/business/defense/details.do?productCt03=defense0101 및 K1 ARV 제품 페이지.
- K9: https://www.hanwhaaerospace.com/kor/whatwedo/product/land.do?category=6
- K9 실제 영상: https://www.youtube.com/watch?v=a8cDf8WPRBg (Hanwha 공식 채널)
- 기아 소형전술차 플랫폼: https://org-military.kia.com/en/kltv
- K216/K242는 한화2018 공식 Profile 계열 소개를 역사적 사업 기준으로 표시, 현재 제조 계약이라고 단정하지 않음.
- 나머지는 기존 exhibition-data/catalogSources의 기업별 역할·근거를 재사용. 모든39종의 현재 계약 제조사를 검증한 보고서가 아님.

## 검증 범위

- npm run build 통과. 기존 큰 Three/GLTF 청크 경고 유지. Lighthouse 미측정.
- scripts/qa/photo-pbr.mjs: 새 GLB2개, 계층, normal/roughness/UV, 고무·금속 기본 색상, 기존 파일 보존, 관람/지형 바인딩 및 기업25종 근거URL 검증.
- scripts/qa/visitor-realism.cjs: 390×844/1440×1000/1080×1920의 기업 필터·직접3D진입·장비선택·탭 전환, 오류0. 애니메이션 완료 후15개 캡처.
- scripts/qa/visitor-coverage.mjs: 39종×4화면=156상태, 모델25종 방향키/포인터 이동·초기화, 목표 도착, 언어 전환, 오류0. 최종 보고서/캡처 artifacts/visitor/coverage/.
- scripts/qa/visitor-accessibility.cjs: 기본6화면 자동 WCAG2A/AA/2.1AA 위반0. 실물 접근성 인증 아님.
- 기존 21 GLB·20 AI 참고 이미지 목록/유한 geometry·지형 연결 유지 검사 통과.
- 실물 키오스크 HW/장시간 운영·외부영상 전체 재생 보장·사진과 모델의 정밀 일치 검증은 범위 밖.

로컬 http://127.0.0.1:4181/ 에 반영. Git commit/push 및 배포는 수행하지 않음.

## 최종 접지 그림자 보완

실시간 지면 그림자의 분리 아티팩트 대신 K2/K9에 Cycles Shadow Catcher로 실제 외형 메시의 평지 기준 접지 그림자를512px RGBA로 렌더했다. scripts/blender/contact_shadows.py와 src/photo-shadow-assets.json으로 재현하며, 이동·회전 시 모델과 함께 변환한다. 실제 지면 그림자/실시간 태양광 역학의 검증은 아니다. 해당 바닥만 이 베이크를 사용하며 모델의 자체 그림자는 유지한다. 다른 체계는 기존 동적 렌더링을 유지한다.

최종검증은 전체156상태 통과 후 접지 그림자가 변경된 K2/K9의8상태를 선택 재실행해 전체보고서에 병합했다. K2/K9 실제 위성지형20뷰도 통과했으며 기존134뷰 보고서의 다른 항목은 이전 검증 기록이다. 전체134뷰를 이번에 새로 검증한 것으로 해석하지 않는다. 원본21개 검토 자산/20개 참고 이미지 검사 및 기본6화면 자동 접근성 검사도 통과했다. 사진과 모델의 정밀 일치는 미검증이다.
