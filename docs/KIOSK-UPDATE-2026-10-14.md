# Kiosk update — 2026-10-14

## Execution
- Completed: inspect existing story, playback, navigation and approved draft.
- Completed: implement semantic portrait welcome and user-supplied video.
- Completed: simplify Korean story and decorative English labels with existing public sources.
- Completed: responsive captures of five chapters at 375/768/1280, portrait 941×1672 and three translated welcome headers.
- Completed: independent design/code integrity and visual/CJK reviews, both PASS on 59369410ecd89ed1163423ccb952dc932412cdc0.
- Completed: merged remote representative footage and terrain/lighting updates without dropping them.
- Delivery: publish this reviewed source and evidence record through the existing GitHub Pages workflow.

## Evidence
Muted autoplay observed in browser: readyState 4, paused false, currentTime 9.236378, muted true. Pause button changed to replay and paused true. Welcome Korean/English/Japanese/Chinese controls changed actual DOM text. Chapter links navigated to Korea, world and equipment selection. Browser console error list was empty. Initial production build with Vite runner and inline-styles completed with exit 0. Final merged build completed with exit 0 (47 modules, 10.21 seconds). Native progress seeking observed paused at actual currentTime 0.1, range value 0.1. Sound toggle changed muted false and back to true. Fresh home reload observed paused false, muted true, currentTime 5.341763. Existing K2 representative local video replay remained available after merging remote changes. No automated test suites or Lighthouse audits were run.

## Boundaries
The language footer translates the welcome; 3D narration language is separately selected inside the exhibit. Browser-native TTS requires compatible device voices. Local equipment reconstructions remain photo/dimension based, not manufacturer CAD or verified interiors. Video includes CGI scenes. Ranking is SIPRI 2021–2025 major arms exports, not overall military power. Video/logo provenance: public/media/KIOSK-ASSETS.md.

## Visual review ledger
- kiosk_delivery_integrity: PASS, source SHA 59369410ecd89ed1163423ccb952dc932412cdc0, fresh docs/evidence/kiosk-v10 captures; final 375 home capture closes evidence gap.
- kiosk_delivery_visual: PASS, same SHA and complete 15-view responsive set plus portrait/locales/K2. No CJK orphans, clipping or visible overflow.
- Pixel diff is not numeric visual fidelity evidence: variable video, draft texture and amended content produce 1/100 similarity. No pixel-perfect claim.
- Prior untracked home-v1 through home-v4 drafts are preserved locally. Approved v5 reference is committed.
