# K2 사진 참고 재질 시험

이 결과는 실사화 완성본이 아니다. 실제 K2 사진 한 장을 참고해 AI가 보이지 않는 면을 추정한 참고판을 만들고, 기존 초안 메시 위에 방향별 UV 투영을 적용했다. 형상 자체는 정밀 재구축하지 않았다. 패널과 차륜 정합, 표면 늘어짐, 일부 배경색 투영이 남아 있어 기본 모델로 승격하지 않는다.

- 원본: `public/media/representatives/k2.jpg` — KBS VIEW–theDEEP / CC BY 3.0, https://commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg
- AI 참고판: `k2-ai-fourview.png`, 1536×1024. 실제 촬영 4면 사진이나 도면이 아니다.
- 생성 지시의 핵심: 제공한 실제 K2 사진을 참고하여 좌측면·상면·정면·후면을 회색 배경에 배치하고 위장색과 외형 정보를 유지하되 가려진 부분을 보완한다. 문자 없이 텍스처 참고용으로 구성한다. 이 설명은 생성 지시의 요약이며 원문 전체 기록이 아니다.
- Blender: 4.5.9 LTS, hash `8bf95cbd38d1`. 공식 포터블 ZIP SHA256은 `docs/3d-progress.md` 참조.
- 실행: `.local/tools/blender-4.5.9-windows-x64/blender.exe --background --factory-startup --python-exit-code 1 --python scripts/blender/photo_study.py -- scripts/blender/k2-photo-study.json`
- 원본/시험본 비교: `artifacts/3d/k2-photo-study/before.png`, `after.png`. 같은 카메라·조명으로 실제 Blender 렌더.
- 수정 가능한 원본: `artifacts/3d/k2-photo-study/source.blend` (참고판 packed).
- 웹 시험: `?system=k2&model=photo-study`. 기본 K2 및 K9 자산은 유지한다.

다음 품질 단계는 사용 허가된 다각도 사진 또는 검증된 메시 확보, 부품별 형상 수정, UV unwrap과 표면별 재질 제작, 사진과 실루엣 대조다. 현재 투영 시험만으로 이를 완료했다고 주장하지 않는다.
