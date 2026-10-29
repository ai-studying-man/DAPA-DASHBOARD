# K2 photo-study QA · 2026-10-29

## Scope and verdict

- Code review (independent read-only): PASS. Opt-in fixed asset path, original defaults preserved, embedded image/UV/groups verified. No blocking regression identified.
- Initial visual review: conditional badge/note integration PASS; evidence coverage REVISE. A fresh independent review after corrected captures returned **PASS for experimental badge, note and layout**, inspecting all 20 active `web*.png` captures and both Blender renders. **Final photorealism FAIL** remains: distorted panels, camouflage and wheel alignment prevent production promotion.
- This is a reproducible experiment checkpoint, not completion of the user's photoreal K2/K9 goal.

## Evidence

- `before.png` / `after.png`: actual Blender renders with identical camera and lighting.
- `source.blend`: actual packed Blender source; `blender-report.json`: processing report.
- `web-*-viewport.png`: browser captures cropped only to remove blank compositor padding. No model/UI pixels were composited or replaced. Actual narrow layout measured `innerWidth=376`, `innerHeight=812`; Chrome user zoom affected viewport override sizing.
- The initial native screenshot had missing WebGL pixels; the initial top view was scrolled/clipped. Both were moved to ignored `.local/capture-outtakes/`, excluded from evidence. `web-mobile-376-viewport.png` shows the textured model; `web-mobile-top-repaired-viewport.png` restores the full top view.
- KO/EN/JA/ZH note captures were subsequently added. Japanese final `ん。` orphan was identified and the copy was split into short sentences in source. After browser-control timeouts, a reset recovered access through the in-app browser. `web-disclosure-ja-final.png` and `web-mobile-final.png` are fresh actual 375×812 captures; the final Japanese wording was independently approved. Other language strings were not changed by that correction.
- K2 and K9 original default viewers were opened and reached ready state with original `전시용 외형` badge. Six directional study buttons and turret 1° input/output were checked; a full animation, touch-device and performance benchmark suite was not run.

## Remaining release gates

1. Replace approximate geometry / correct per-part UV mapping against permitted multi-view sources. Current photo texture projection is visibly insufficient.
2. Experimental UI review is closed within the supplied K2 study scope; no sitewide visual approval is implied.
3. Measure download/render performance and verify on a physical mobile device.
4. Only after K2 quality passes, expand to K9. Default assets remain untouched.
