
## 실물 외형 전시 v5
- 완료: 공개 자산 품질·라이선스 확인, K9/K2 공개 3D 및 FA-50/천무 실물 사진 연결.
- 완료: 임의 도형 장비와 구성 펼치기·가짜 이동 제거, 지도 중립 마커, 자산별 출처·인터넷 안내·초기 시점 복원.
- 검증: docs/evidence/realism-v5의 최종 캡처·상호작용·두 리뷰 참조.
- 미확보: 기타 5개 체계의 전시 사용권 있는 실물 자료; 전 장비 제조사 승인 고정밀 3D와 동작 애니메이션; 완전 오프라인 자산. 임의 모델로 대체하지 않음.

## 한반도 운용 환경 v6
- 완료: 공개 고도 자료 18타일→로컬 33,971개 표본, 산악·계곡·수중 지형과 원자료 출처.
- 완료: 10개 체계의 지상/수면/수중/공중/연안/우주 자동 연결, 지상 산악/평지 비교, 환경 재생/중지/전환.
- 완료: 도산안창호급 잠수함 공개 사업·참여기관·실물 사진·관계·수중 환경 추가.
- 검증: 환경 45개 캡처·실물 자료 30개 캡처, 4K/세로 터치 에뮬레이션, 축소 모션, 초기 로딩 닫기/중지/탭 전환, 실제 삼각형·구체 반경의 지형 교차 확인. 결과 docs/evidence/environment-v6.
- 미확보: 실물 장비 GLB/CAD를 지형 안에 직접 삽입하는 자산·동작. 실물 전시 하드웨어 및 장기 운영 검증은 별도. 현재 마커 동작을 실제 장비 동작으로 표현하지 않음.

## v7 · Toss 참고 스크롤 전시
- [x] 기존 레이아웃·자료 범위 확인, 실제 한국어 토스 홈페이지 3크기 캡처와 디자인 계약 기록.
- [x] 실제 사진 중심 홈, 한반도/세계 3D 장면, 한 장면 핵심 정보·접근 가능한 탐색 구현.
- [x] 메뉴 자동 접기·복원, 부드러운 페이지 전환·스크롤 공개·모션 감소 구현.
- [x] production build, 실제 Chrome 가로/세로/모바일/터치·키보드·장비 시연 회귀, 독립 시각/기능 검토.

## GitHub Pages 공개 배포
- [x] 로컬 Git·원격 저장소·인증·Pages 상태 확인: 원격은 공개 빈 저장소, 인증 사용자는 ai-studying-man.
- [x] 배포 경로 호환 및 main 자동 배포 workflow 구성·로컬 하위 경로 검증.
- [x] 원격 push·Pages 활성화·실제 공개 URL의 지도/이미지/시연 검증.

## 군별 대표 시연 v10
- [x] 대표4체계 선정 및 기존 Cesium/자료/공식 원문 범위 확인.
- [x] 영상·사진·기업·사업·수출·자료 사용권 확보와 manifest 작성.
- [x] 대표 카드·영상 관람·기존 3D 연결·출처/실패/정지 동작 구현.
- [x] production build·실제 브라우저 4체계/5크기/미디어 검증·독립 기능/시각 검토 통과.
- 배포: main 자동 배포 workflow로 공개하며 실행 SHA·결과와 공개 URL 검증은 docs/evidence/representatives-v10/deployment.json에 기록.

## 온라인 실사 장면 v11
- [x] 기존 GLB·위성/고도 통합과 공개 3D 데이터·사용권 조사.
- [x] CC0 HDR·태양광·그림자·실제 지형 품질 및 K2 기준점 고도 적용.
- [x] 실제 브라우저 5크기/153상태·고도 회귀 검사·독립 기능/화면 검토.
- main 자동 배포 및 공개 검증 실행 결과는 docs/evidence/realism-v11/deployment.json에 기록.

## VIP 전시 개선 v13 · 2026-10-14
- [x] 첨부 제안서와 현재 기능·원격 상태 확인.
- [x] 인트로·간부 시연 동선 및 기존 집중 모드 보강.
- [x] 네 언어 콘텐츠·음성·접근성·저장 정책 통합.
- [x] WebGL 로딩·실패·context lost 복구와 실제 자료 대체 경로 구현 (실제 GPU 손실은 행사 기기 미검증).
- [x] 공식 수출 계약 카드·자산 권리 상태·미디어 교체 문서.
- [x] 실제 브라우저 정상·실패·반응형·키보드·회귀 및 수정 후 독립 기능·CJK 화면 검토 PASS. 행사장 GPU/음성 및 실제 200% 확대는 별도 미검증으로 결과 문서에 기록.
- 이번 요청의 로컬 구현만 수행하며 공개 범위·인증·배포 설정은 변경하지 않는다. 행사장 기기 검증은 장비 미제공으로 별도 미검증.

## Touch / 전군 현황 v14
- [x] Read Claude review and user clarified exhibition goal; inspect current branches/source/render paths.
- [x] Add touch-first all-service catalog/dashboard and verified shared branch links.
- [x] Integrate existing story, menu, search, detail/3D and four locales.
- [x] Manual rendered verification complete; independent functional/CJK reviews APPROVE/PASS; scope and evidence ledger documented.

## Mobile viewport slides v15
- [x] Preserve existing six story chapters and equipment/demo routes.
- [x] Implement viewport-sized vertical mobile / horizontal desktop-kiosk deck with common heading/content/navigation regions.
- [x] Observe next/previous, page picker, native mobile scrolling and independent content scroll; compact 667px English home fits.
- [x] Fresh 19-screen packet, build and independent functional/visual reviews PASS; limits documented.

## Content-led mobile pages v16
- [x] Separate representative equipment, introductions, maps and choices; balance centered content and action spacing.
- [x] Observe fourteen pages across three widths plus short KO/EN homes; 44 captures and independent integrity/visual reviews PASS.

## Final caption and spacing polish v17
- [x] Left-align blue chapter captions, fit title focus outlines to text, redistribute home whitespace.
- [x] Build and record 47 responsive/short-screen captures; preserve visible 48px controls.
- [x] Independent integrity and visual reviews PASS; six source hashes and 47 captures recorded.

## K2 / K9 articulated exhibition models v18
- [x] Read supplied modeling guide; audit existing meshes and public manufacturer sources; prioritize K2/K9.
- [x] Author distinct local GLB models with stable part names/pivots and provenance.
- [x] Integrate native inspection controls, illustrative articulation and photo/source comparison.
- [x] Build and manually observe native responsive/exterior controls; record geographic tile timeout and unexercised fault paths; obtain independent integrity/visual PASS on 30 captures.

## Interrupted-work recovery v21 · 2026-10-29
- Restored source from remote 825b408 after automatic local workspace pruning.
- Reconstructed six native exhibits, scenic terrain/HDR and 23-system asset status.
- Regenerated inferred K2/K9 references; rebuilt actual editable Blender files and GLBs with stable part pivots.
- Re-run validation for this recovery revision; do not reuse old local-only commit claims.
- Outstanding: approved photo-matched geometry/materials and seventeen further local high-quality meshes.
