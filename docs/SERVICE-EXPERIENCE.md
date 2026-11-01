# 군별 공간 체험 1차 구현

- 진입: `?view=service`, 기존 대시보드 상단의 군 생활 체험.
- 실제 실행 도구: Blender 4.5.9 LTS. `scripts/blender/service_person.py`로 일반 전시용 인물 메시를 만들고 `public/models/service-person.glb`, `artifacts/3d/service-person.blend`로 저장했다. 대한민국 국군의 검증된 군복·인물 실사 모델은 아니다.
- 육군 K2/K9, 해군 도산안창호급, 공군 FA-50, 해병대 KAAV의 기존 외형 GLB를 재사용한다. 지형·부두·계류장·해변은 창작 전시 공간이며 실제 한반도 DEM이나 군 주둔지를 재구축하지 않았다.
- 바닥 클릭/터치 목적지, 방향키/WASD, 5명 선택, 동행 규칙, 대원 시선, 정지·초기화. 인물 움직임은 단순 보행 표현이며 모션캡처가 아니다.
- Astra/LLM/API/Unreal Engine은 연결하지 않았다. 인터넷 생존 AI 사례의 정확한 원문이 아직 제공되지 않았으며 본 구현은 독립 규칙 기반 에이전트다.
- 실제 체감 품질을 위한 다음 작업: 사용 허가된 군복 캐릭터와 보행 모션, 장비 고정밀 자산, 실측 환경 자료, 충돌·길찾기, 장면별 카메라/동선 고도화. 현재는 외형 실사화·군 복무 VR 완성본이 아니다. HMD/WebXR도 미구현이다.
- 참고: https://www.blender.org/features/pipeline/ (glTF 교환), https://dev.epicgames.com/documentation/en-us/unreal-engine/API/PluginIndex/LearningAgents (Unreal 학습 에이전트). 이 문서는 Astra 연동 근거가 아니다.

## 1차 검증
Blender CLI 종료 성공, 인물 GLB 47,904 bytes와 .blend 생성 확인. Vite production build 통과(기존 대형 Three.js chunk 경고 포함). 실제 브라우저에서 4개 군별 준비 상태, 동행 토글, 방향키 입력 수용, 대원 시선, 정지·초기화와 375×812 모바일 표시 확인. 캡처: artifacts/service/*.jpg. 시각 독립 검토 PASS(조작 시제품 범위). 코드 검토의 인물 로딩 실패 후 잘못된 준비 상태 표시는 초기화 실패를 상위 오류 화면으로 전달하도록 수정했다. 실제 모바일 장치·HMD·경로 충돌·장시간 운용·Astra 추론 성능은 미검증이다.

## Blender 주행 연동 추가
K2는 `k2-drive-study.glb`로 교체해 AI 참고 재질과 Blender 왕복 이동·차륜 회전 애니메이션을 시연한다. 일반 장비 외형 뷰어 기본 GLB는 유지한다. 상세 출처·적용 기록: `docs/THREADS-BLENDER-K2-APPLICATION.md`. 본 변경은 K2 형상 정밀화 완료를 의미하지 않는다.
