# 3D 고도화 자산 출처와 사용 상태

| 자료 | 출처·권리 | 사용 상태 |
|---|---|---|
| K2 실제 참고 사진 | KBS VIEW – theDEEP, CC BY 3.0. https://commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg | 기존 `public/media/representatives/k2.jpg`. 원본 유지, 4면 참고 생성 입력. 가림막 때문에 보이지 않는 면은 확인 불가 |
| K9 실제 참고 사진 | 대한민국 국군, CC BY-SA 2.0. https://commons.wikimedia.org/wiki/File%3AK-9%20%EC%9E%90%EC%A3%BC%ED%8F%AC%20(7445556056)%20(2).jpg | 기존 사진 유지. K2 품질 확인 후 사용 |
| Threads 제작 사례 | kim.18041, https://www.threads.com/@kim.18041/post/DfA8ecPk5Nu | 본문·K9 시연 프레임 확인. 재사용 라이선스/GLB 다운로드 미확인. 방법 참고만 하며 영상·이미지 추출 재배포 안 함 |
| Sketchfab K2 후보 | jjj0605, CC Attribution 표시. https://sketchfab.com/3d-models/k-2-black-panther-tank-8f79997ad7e14deea07a5a60c8af5308 | 검색/게시 페이지 기준 343.6k triangles. 원본 GLB 다운로드·실제 재질·현재 상세 조건 미확보. 확보/웹 최적화 완료로 표현하지 않음 |
| Free3D K9 후보 | Iks, https://free3d.com/3d-model/k-9-thunder-5907.html | 유료, Editorial Only 및 무텍스처 표시. 전시용 재사용·실사 재질 충족 자료로 채택하지 않음. 구매하지 않음 |
| Blender 4.5.9 LTS | Blender Foundation 공식 https://download.blender.org/release/Blender4.5/ | 포터블 실행 도구. 공식 SHA256과 비교. 도구 라이선스와 입력 사진/산출 자산의 권리를 혼동하지 않음 |

생성 참고판은 AI 추정 표현으로서 제조사 도면·실제 촬영한 4면 사진이 아니다. 원본 사진 저작자/라이선스를 유지하며, 전시용 근거와 추정 부분을 산출물에 기록한다. 기존 K2/K9 초안의 ATTRIBUTION 파일을 삭제하거나 정밀 모델 인증으로 바꾸지 않는다.
# 실제 생성 산출물 · 2026-10-29

`docs/modeling/k2/k2-ai-fourview.png`는 위 K2 사진을 참고한 AI 추정 참고판이다. 실제 촬영된 4면 자료가 아니다. 이 참고판을 사용한 `public/models/k2-photo-study.glb`는 Blender 4.5.9에서 생성됐으며 기존 형상에 UV와 baseColor 이미지를 적용한 시험이다. 실제 normal/roughness 측정 맵을 확보한 것으로 표시하지 않는다. 제작 원본과 실제 전후 렌더는 `artifacts/3d/k2-photo-study/`에 보관한다. 기본 모델로 승격하지 않았으며 패널·차륜 투영 왜곡이 남아 있다.

