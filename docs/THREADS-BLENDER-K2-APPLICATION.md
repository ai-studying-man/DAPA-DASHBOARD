# Threads 참고 적용 · K2 Blender 주행 시험

## 확인한 내용
- 사용자 링크: https://www.threads.com/@choi.openai/post/Dc3EZU-D2H2
- 실제 페이지의 본문(3D 기차, Blender/Unreal 제작 사례 요약)을 읽었다. 이어지는 상세 사례는 로그인 안내로 제한됐다. 특정 Blender MCP/API 구현이 공개돼 있다고 단정하지 않는다.
- 원 작성자 Tom Krcha의 공개 글도 확인: https://www.linkedin.com/posts/tomkrcha_so-how-good-really-is-gpt-6-astra-at-3d-modeling-activity-7501528641718165504-79ar . 3,295개 객체는 작성자가 보고한 수치이며 이 프로젝트의 달성 수치가 아니다. 공개 글만으로 재사용 가능한 모델 파일이나 상세 스크립트를 확보하지 않았다.

## 실제 적용
- 수정 가능한 Blender 원본 → GLB 애니메이션 → 웹에서 재생/정지/관찰하는 흐름을 K2에 적용했다.
- `scripts/blender/k2_drive_study.py` 실제 Blender 4.5.9 실행. 원본 `artifacts/3d/k2-drive-study/source.blend`, 모델 `public/models/k2-drive-study.glb`.
- 기존 K2 재질 시험본 69개 메시와 텍스처 보존. 8초 왕복 이동과 12개 차륜 회전을 13개 애니메이션 채널로 내보냈다. 최초 검사에서 차륜 회전 채널 누락을 발견하고 회전 모드 및 키프레임을 수정한 후 12개 회전 채널을 확인했다.
- 군 생활 체험의 육군 장면에서 `K2 전시 주행`, `K2 가까이 보기`. 재생/정지, 전체 일시정지, 원위치, 다른 군 선택 시 해제. 장비 외형 기본 뷰어 파일은 유지한다.
- 실사 재질 정합과 형상 품질은 여전히 미완성. 이번 변경은 정밀 형상 재구축이 아닌 Blender 자산 연동·동작 검증 단계다. 다른 작품의 영상이나 모델을 우리 자산으로 가져오지 않았다. 실제 물리·주행 성능·AI 생존 협력·Astra/Unreal 런타임을 구현했다고 주장하지 않는다.

## 검증 결과
- 실제 Blender 4.5.9 실행 성공, GLB 4,152,640 bytes. `node scripts/audit-k2-drive.mjs` 통과: 이미지 1, 메시 69, 애니메이션 13, 이동 1/차륜 회전 12, 8초 길이, 기존 부품 그룹 보존.
- `npm run build` 통과. Three.js 공유 chunk 크기 경고는 남으며 저사양 장치 성능 측정 완료를 의미하지 않는다.
- 실제 웹에서 주행 선택·전체 정지·원위치, 군별 전환 시 K2 제어 해제/비활성, 대원 시선과 K2 관찰 시점 상호 배타 전환, 모바일 375×812 확인.
- 최초 군별 캡처가 한 장면 늦게 저장돼 증거 검토에서 반려됐다. 선택 상태를 확인한 후 별도 호출로 다시 캡처했다. 최종 파일 `artifacts/3d/k2-drive-study/web/final-*.jpg` 7개는 모두 최종 JS 수정 이후 생성됐다.
- 두 독립 읽기 전용 검토: 코드·시각 통합 PASS(명시된 전시용 시험 범위). 실사 품질·실제 물리·VR 준비 완료는 아니다. 실제 기기 장시간 검증은 남는다.
