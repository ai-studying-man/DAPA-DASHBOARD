# K2 후보 검증 · 2026-11-02

판정: **교육용 제작·웹 후보 PASS / 실사 형상 품질 FAIL**. K9 및 후속 장비에 실사화 완료를 전파하지 않는다.

| 검사 | 실제 결과 |
| --- | --- |
| Blender 4.5.9 bpy 실행 / 저장 원본 재열기 | 성공, 3개 이미지 packed |
| Python no-excuse 규칙 검사 | 위반 0 (Blender 내장 Python으로 실행) |
| glTF-Transform 정규화·dedup·weld | 7,239,336 → 7,049,400 bytes |
| Khronos Validator | 정규화/최적화 각각 오류 0, 경고 0; 정보성 unused UV는 남음 |
| `qa:k2-pipeline` | UV·이미지3·클립3·차륜12·피벗·기존3개파일 해시 보존 성공 |
| `qa:models` | 카탈로그23/로컬9, 실패0 |
| `qa:k2-browser` | 3클립 실제 변환, 3뷰포트×4언어, 탭 선택/터치, 두 손가락 확대, 저사양, 동작 감소, 404/재시도, destroy 성공 |
| `qa:local-models` | 기존6종×6시점, 4언어, 404/재시도/해제 성공 |
| `qa:realism` | 10종×3뷰포트 표시 검사 성공. 실사 품질 인증 아님 |
| `build` | 성공, 기존 500kB 초과 chunk 경고 |
| production `k2-pages.mjs` | 375/1280px 대시보드 실제 경로·재생/정지/닫기·HTTP200·pageerror0 |
| 최적화 렌더 비교 | 같은 카메라·조명, 픽셀 차이0 (`web/render-comparison.json`) |
| 독립 화면 검토 2건 | 중국어 레이블 마지막 글자 고립 수정 후 전체14캡처 재검토 PASS |

`web/`에는 12개 언어/뷰포트, reduced, fallback 캡처와 원문 보고서를 남겼다. `web/production/`은 실제 제품 대화상자의 모델 화면/조작 화면을 각각 담는다. 첫 이미지에서 캔버스가 없는 것은 정상으로 인정하지 않는다. 참고 사진 비교는 실측 시점 정합이 아니며 가려진 형상 확인에 쓸 수 없다.

GLB 직접 export의 불필요 접선 오류는 glTF-Transform 정규화에서 실제로 해결했다. 원문 export 보고서는 로컬 `artifacts/3d/k2-pipeline/blender-export-validator.json`, 원인·수량·최종 해시는 `blender/k2/optimization-report.json`에 기록한다. 원본 메시 자체를 지우거나 접선을 임의 단위 벡터로 위장하지 않았다.

프레임 보고서는 이 PC Chrome의 60 RAF 표본이며 실기기 모바일·저성능 GPU·장시간 키오스크·외부 위성 타일의 성능 보장이 아니다. 세션 중 로컬 서버의 샌드박스 네트워크 접근 제한은 호스트 루프백 서버로 해결했다. 재설치 시 Vite가 잡은 esbuild.exe 파일 잠금은 이 작업의 서버를 중지한 뒤 재설치하여 해결한다.

재개 기록과 다음 정확한 명령은 `docs/3d-progress.md`를 따른다. 공개 Pages 검증은 별도 배포 체크포인트로 남긴다.
