# 전체 체계 Blender 재현

원본과 결과는 `catalog.json`, `src/fleet-assets.json`, `docs/FLEET-ASSET-STATUS.json`에 대응한다. `.blend`38개와 기존 K2 원본1개, 총39종이다. 외형 연구 모형이며 제조사 CAD·측량·실사 형상 검증 완료가 아니다.

```powershell
node scripts/prepare-fleet.mjs
./.local/tools/blender-4.5.9-windows-x64/blender.exe --background --factory-startup --python-exit-code 1 --python blender/fleet/build.py
node scripts/optimize-fleet.mjs
node scripts/qa/fleet-models.mjs
```

완료한 항목을 자동으로 건너뛴다. 필요한 한 종만 수정할 때 `-- --only k808`을 추가한다. 신규 미확보12종의 n-gon 삼각분할 수정에만 `-- --new`를 사용했다. 이미 검증된 원본을 무조건 다시 만들지 않는다.

모션은 전시대 회전, 외형 분리/재조립 및 실제 메시가 있는 경우에만 포탑·포신·주 회전익·프로펠러를 제공한다. 실제 속도·작동 절차·내부 조립 관계·기동 물리를 의미하지 않는다. 고정익·함정·발사체의 없는 가동부를 임의로 리깅하지 않는다.

기존 텍스처와 UV는 보존한다. 텍스처 없는 재질에는 독립 제작 표면 맵을 넣는다. normal 기본값은 평면이며 실제 표면 스캔이 아니다. AO는 베이크하지 않았다. glTF-Transform은 normal tangent가 없는/퇴화한 프리미티브만 flat normal 변형으로 명시하고, 원본 메시·색과 실제 재질 확장을 유지한다. 개별 원본 라이선스를 소프트웨어 라이선스로 덮어쓰지 않는다. 프로젝트 MVP의 외부 재배포 조건 미확정 상태도 보존한다.

Blender의 +Y 전방 / +Z 위를 glTF로 변환하면 -Z 전방 / +Y 위다. 원본들의 축·위치는 임포트 계층 안에 보존하고 교육용 ExhibitRoot를 추가한다. 카메라는 실제 bounding box에 맞춘다.
