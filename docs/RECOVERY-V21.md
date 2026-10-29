# Interrupted-work recovery · v21 · 2026-10-29

## Cause and recovery scope

The earlier local-only v19/v20 work stopped before a verified main ref update.
Automatic workspace maintenance then removed that local checkout and its local
commits, source edits, editable Blender files and temporary validation outputs.
The surviving remote main was 825b408 (WORK connection check).
The original source ZIP and image searches did not yield a newer source backup.

This is a reconstructed recovery revision, NOT a byte-identical recovery of the
old 4e4df33 / 970b0dc commits. The earlier generated four-view images were not
found in Library and were regenerated from the same attributed public photos.
No previous-turn tests are represented as tests of this new revision.

## Restored functionality

- Six existing GLBs use the same native Three.js studio: K2, K9, KAAV, FA-50,
  Dosan Ahn Changho class and Nuri. Unavailable parts have no invented controls.
- Local photographic terrain (diffuse/normal/roughness) and outdoor HDR lighting.
  The central exhibit footprint is level. Hills, water and sky are scenic, not
  actual deployment locations or surveyed geographic terrain. Cesium retains
  its separate Esri imagery/elevation and uses the same selected GLB paths.
- K2/K9 Blender 4.5.3 editable sources, inferred four-view boards and cameras,
  welded mesh corners, selected 12mm edge finishes, projected image UVs and
  authored microsurface maps. Existing dimensions/proportions and part pivots
  are preserved. No manufacturer CAD, engineering model or photogrammetry scan.
- Original photos and AI references are separately identified in the web viewer.
  The generated views may disagree on wheels, scale, paint and hidden fittings;
  they are visual studies, not geometry or performance measurements. Projected
  colors contain baked lighting and may stretch or misplace visible features.
- Complete 23-entry asset inventory: six local exterior drafts, thirteen with
  photographs only, four needing further reference acquisition. None is approved
  as fully photo-matched. The remaining seventeen have no local high-quality mesh.
- A local licensed-GLB registration command with explicit source/author/license,
  unit scale and basic self-contained GLB checks. It does not validate legal rights
  or certify model accuracy; external resource paths and required compression
  decoders are rejected.

## Source artifacts

- assets/blender/k2-reference-v21.blend and k9-reference-v21.blend: editable,
  packed references, view cameras, original part hierarchy and review lighting.
- scripts/blender/build-ground-reference.py: reproducible batch processing.
- public/media/model-reference/*-ai-multiview-v21.png: regenerated AI studies.
- docs/reference/GENERATION-PROMPTS.json: exact prompts, built-in image generation.
- public/models/*-blender-v21-ATTRIBUTION.md: source photos, rights and limitations.
- public/materials/rocky-terrain/ATTRIBUTION.md and manifest.json: outdoor assets.

The posted pipeline description was read in the preceding work at
https://www.threads.com/@kim.18041/post/DfA8ecPk5Nu (shared short link resolved
from BAJFXyj6a1): photos → generated Side/Top/Front/Rear → coded 3D → orbitable HTML.
The post itself did not mention REA; using REA was a separate user instruction.

## REA and host limitations

REA 6.4.0 is invoked through the official npm package. Safe artifact inspection
can inventory the official Blender ELF and its identity. The full source semantic
analysis previously failed at this host's process-ownership check (`ps` reported
`fatal library error, lookup self`). Native layout inspection also lacked its
configured pwntools provider, and the GLB inspection target was unsupported.
These are not successful semantic decompilation or mesh recovery. Current
invocation results are recorded separately in REA-RECOVERY-EVIDENCE.json.
No ownership check, login or protected manufacturer asset extraction is bypassed.
Blender editing is performed through its documented bpy batch interface.

## Rebuild and verify

Blender binary used: official Blender 4.5.3 LTS Linux x64 distribution.
The tool installation/archive stays local and is not redistributed.

```sh
npm ci
blender -b --factory-startup --python scripts/blender/build-ground-reference.py -- k2
blender -b --factory-startup --python scripts/blender/build-ground-reference.py -- k9
node scripts/audit-model-assets.mjs
npm run fonts:subset
npm run build
node scripts/qa/recovery.cjs
```

Set CHROME_PATH when a compatible local Chromium executable is elsewhere. The
browser test starts and stops its own Vite child; the review renders use Blender
Cycles CPU. Tests generate screenshots/results under ignored .local/qa/.

The production build keeps relative paths for GitHub Pages. The studio's >500KB
bundle warning remains; no warning limit was raised. Actual handset FPS, complete
four-language visual approval and geographic Cesium tile/contact success remain
unverified. An appearance improvement is not an all-system realism completion.

## Recovery verification result

Production build PASS (73 modules). Both GLBs: Khronos validator zero errors and
zero warnings; one informational non-power-of-two image notice each. Actual local
Chromium software rendering PASS for all six models with HDR; terrain maps present
for land/air, skipped for water. K2/K9 each expose five part groups. Turret input,
explode/reset, six front/home views, environment toggle, 404 retry and canvas
disposal PASS. Actual K2 route at 375×812: KO/EN/JA/ZH replacement and horizontal
fit PASS; coverage disclosure has 23 rows. No uncaught page errors. These are
software-renderer checks, not handset GPU / geographic tile / appearance approval.

### Surface regression found during recovery

Visual review caught a blue/mirrored surface despite valid glTF structure. The
authored images had their color space set after their pixel buffers were filled,
which reset the generated image data before export. The build now sets the color
space first, fills/saves/packs the images, and checks the exported bytes with
`python scripts/qa/validate-surfaces.py` (Pillow required). Both final normal maps
have blue-channel means above 254 and ORM green means about 209/255. K2/K9 renders,
controls, missing-file handling and mobile locales were rerun after the fix.
