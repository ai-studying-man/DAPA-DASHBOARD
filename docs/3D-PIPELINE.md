# K2 우선 고도화 · 2026-11-02

작업 계약은 `K-DEFENSE-3D-INSTRUCTIONS.md`의 원문이다. 기존 코드와 모든 원본 GLB를 보존하고 별도 검토 후보를 만든다. vanilla JS/Three.js/Cesium 구조와 Pages의 상대 base, main 배포 workflow를 유지한다.

## 체크포인트 0 · 동기화

- 시작 작업 트리 clean, main `f9e14ecd1ff5424ab0d29041ab40d3f929886e8c`.
- `git fetch origin` 성공 후 `git rev-list --left-right --count HEAD...origin/main` = `0 0`. 충돌 또는 통합할 커밋 없음.
- MD의 초기 6종 감사 수치는 과거 스냅샷이다. 현재 카탈로그와 QA 결과를 새로 기록한다.
- 기존 K2 `k2-surface-refinement.glb`는 독립 제작 위장 텍스처/재질 구분/모서리 보정 후보. 실사 품질 미달 판정은 유지한다.
- 기존 Blender 4.5.9 포터블을 재사용한다. 생성 후보는 기본 자산을 대체하지 않는다.

## K2 근거와 남은 형상 문제

2026-11-02 제조사 제품 페이지와 Commons 사진 원문을 다시 조회했다.

| 자료 | 역할 / 이용 조건 |
| --- | --- |
| https://www.hyundai-rotem.co.kr/en/business/defense/details.do?productCt03=defense0101 | 공개 외형·제원 참고. 사진 재배포 허가로 해석하지 않음 |
| https://commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg | KBS VIEW–theDEEP, CC BY 3.0. 기존 로컬 사진으로 비교하며 저작자·원문·라이선스 표시 |
| 기존 `k2-exhibit.glb`, `k2-surface-refinement.glb` | DAPA DASHBOARD 제작, CC BY 3.0. AI 추정 참고판 텍스처를 새 후보에 전용하지 않음 |

실제 사진은 위장망에 가려진 면이 많다. 정면/상면/후면에 대한 허가된 무가림 참조 세트 미확보. 전면 장갑 경사·포탑 실루엣·광학장비/안테나 위치·궤도 링크·패널 배치의 정합은 미완료다. 반복 위장 무늬, 림 볼트와 표면 요철은 독립 제작 전시 표현이며 실장비 패턴·구조 인증이 아니다. 렌더 비교는 오차를 드러내는 증거이지 실사 인증서가 아니다.

## 완료 기준

1. 별도 Blender 원본, 부품 피벗/부모 계층, PBR 역할, 3개 교육용 클립.
2. 원본/최적화 GLB의 Khronos validator, UV/노드/클립/원본 해시 보존 검사.
3. 정면/측면/3-4면 실제 렌더, 실사 나란히 비교 PNG, 웹 캡처.
4. 기존 QA·빌드와 후보 뷰어의 클릭/터치/실패/동작 감소/해제 테스트.
5. main push 후 Pages가 해당 SHA를 배포했는지 API와 공개 URL로 확인.
6. **실사 형상 게이트 통과 전 K9 확장 및 K2 기본 승격 보류.**

진행/재개 기록은 대소문자만 다른 파일을 중복 생성하지 않고 기존 `docs/3d-progress.md`에 덧붙인다.

## 도구 채택 기록 · 2026-11-02

기존 Three.js 0.180.0(MIT), Blender 4.5.9 LTS(GPL), glTF exporter를 유지했다. glTF-Transform core/functions 4.5.1(MIT), gltf-validator 2.0.0-dev.3.10(Apache-2.0)을 개발 의존성으로 설치하고 실제 Node/Blender/Chrome 처리로 호환성을 검증했다. npm 라이선스는 설치 패키지의 LICENSE를 기준으로 하며 모델의 CC BY 3.0과 별개다. upstream 최신 조회: glTF-Transform `8e2a94a2616d293c4b503d0fb6a4b42e6ec7c62f`(2026-10-16), glTF-Validator `602c54043ba66856b2e68c40fdf2bced975cdb8a`(2026-10-06). 전체 오픈소스 전수조사는 하지 않았다. COLMAP/Meshroom/NeRF/React 전환은 현재 참조·요구 범위에서 추가하지 않았다.
