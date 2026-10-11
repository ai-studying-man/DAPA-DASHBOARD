# GitHub Pages 배포

- 저장소: https://github.com/ai-studying-man/DAPA-DASHBOARD
- 공개 주소: https://ai-studying-man.github.io/DAPA-DASHBOARD/
- 배포 방식: main push → GitHub Actions → npm ci → npm run build → dist 업로드 → Pages 배포.
- workflow: .github/workflows/deploy-pages.yml. Node.js 22와 SHA로 고정한 Actions를 사용한다.

## 경로와 자료

Vite base는 ./이며 HTML·폰트·동적 모듈·지도 JSON·사진·지형 출처 링크가 현재 문서 디렉터리에 상대적으로 연결된다. 저장소 하위 경로에서 사이트 루트를 잘못 참조하지 않는다. CSS 인라인·초기 HTML 렌더링 이후에도 같은 경로를 유지한다.

지도·고도 JSON 및 홈 사진은 public에 포함한다. 실물 외형의 외부 Sketchfab/사진 자료와 공개 근거 원문은 인터넷 연결이 필요하다. GitHub Pages에는 정적 대시보드를 배포하며 별도 서버나 데이터 수집 백엔드는 포함하지 않는다.

## 실행과 검증

```
npm ci
npm run build
npm run preview
```

```
QA_URL=https://ai-studying-man.github.io/DAPA-DASHBOARD/ QA_EVIDENCE_DIR=docs/evidence/pages/live node scripts/qa/story.cjs
QA_URL=https://ai-studying-man.github.io/DAPA-DASHBOARD/ QA_EVIDENCE_DIR=docs/evidence/pages/live node scripts/qa/story-motion.cjs
```

QA_EVIDENCE_DIR은 캡처·보고서 출력 위치다. Windows PowerShell에서는 $env:QA_URL과 $env:QA_EVIDENCE_DIR로 환경 변수를 설정한다. 브라우저 검증은 설치된 Chrome을 사용하며 영상 캡처는 Playwright ffmpeg가 필요하다.

node_modules, dist, .local, .codegraph, 환경 파일과 로컬 QA 캡처 docs/evidence는 Git에서 제외한다. 배포물 dist는 Actions가 생성하여 Pages에 업로드한다. 공개 원자료·사진·글꼴의 출처·사용권은 기존 표시를 유지한다.

## 최초 공개 배포 확인

GitHub Actions 실행 38147300845가 성공했고 공개 URL의 HTML·사진·지도·지형·출처 자료가 HTTP 200으로 응답했다. 실제 공개 URL에서 51개 화면을 검사하여 브라우저 오류·axe 위반·가로 넘침이 없음을 확인했다. 이후 로고와 컴포넌트 화면의 홈 링크도 ./로 수정하고, 홈 복귀 검사를 포함한 52개 화면을 저장소 하위 경로에서 재검증했다. 영상·화면 캡처·상세 결과는 Git에서 제외한 로컬 docs/evidence/pages에 보관한다.
