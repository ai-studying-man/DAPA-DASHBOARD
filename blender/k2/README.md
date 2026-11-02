# K2 재현 파이프라인

저장소 루트에서 실행한다. Blender는 기존 공식 포터블 4.5.9 LTS를 사용했다. 생성 도구의 GPL과 자산의 CC BY 3.0은 별개다. 모델·텍스처·모션은 전시 후보이며 실사 형상·성능 인증이 아니다.

```powershell
./.local/tools/blender-4.5.9-windows-x64/blender.exe --background --factory-startup --python-exit-code 1 --python blender/k2/build.py
npm run models:k2:optimize
npm run qa:k2-pipeline
npm run qa:models
npm run build
```

`source.blend`에는 baseColor/normal/metallicRoughness 이미지가 모두 packed되어 있다. 도장 표면은 절차적 표현이며 측정한 normal/AO가 아니다. AO는 별도로 베이크하지 않았다. 원본 형상은 재구축하지 않았고 도장 UV를 새로 펼쳤다. 자료와 권리는 `public/models/k2-pipeline-ATTRIBUTION.md` 참조.

Blender 좌표는 Z-up, GLB는 +Y-up / -Z 전방, 미터 단위다. 기존 Hull/Turret/Gun/RunningGear/Wheel_*/Track_L/R 피벗 관계를 보존한다. Gun은 Turret 하위이며 turntable만 추가 ExhibitRoot를 회전한다. NLA 이름 Turntable/TurretTraverse/BarrelElevation은 각 4초 교육용 모션으로 glTF 클립에 대응한다. 실제 각도 한계·속도·조작 절차를 의미하지 않는다.

생성물:

- `artifacts/3d/k2-pipeline/raw.glb`: Blender 직접 export. 그릴의 무텍스처 재질에도 생성된 불필요 접선 일부가 0벡터인 exporter 문제를 원본 보고서에 기록한다.
- `normalized.glb`: glTF-Transform에서 **normal map을 소비하지 않는 재질**의 불필요 TANGENT만 제거한다. 실제 도장 normal-map용 접선 19개는 유지. UV·형상·노드·애니메이션은 삭제하지 않는다.
- `public/models/k2-pipeline.glb`: dedup/weld 최적화. Draco/meshopt 디코더가 필요 없는 표준 GLB. 정규화 전후 validator 결과와 크기는 `optimization-report.json`에 기록한다.
- `artifacts/3d/k2-pipeline/`: front/side/three-quarter 실제 Cycles 렌더, validator 원문, 웹 증거.
- `source-hashes.json`: 기존 3개 K2 GLB의 SHA256. QA에서 보존 확인.

전체 산출물을 자동 재생성하지 말고 마지막 체크포인트의 다음 명령만 실행한다. 카메라/형상 검토가 필요한 경우에만 Blender를 다시 실행한다.
