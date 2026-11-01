# Detailed exterior asset provenance

Updated 2026-11-02. These are exhibition exteriors, not manufacturer CAD, calibrated scans, or certified training assets. Real satellite imagery does not certify model accuracy. Existing prototype models remain in the advanced review pages.

## Photo-derived Blender exports

`k9-photo-reconstructed.glb`, `k21-photo-reconstructed.glb`, `k216-photo-reconstructed.glb`, `fa50-photo-reconstructed.glb` use SAM 3 3D Objects single-image reconstruction, then Blender 4.5.9 import, preserved UV/albedo, estimated metre scaling, static export. Generated topology includes inferred unseen surfaces and visible distortions. They are **review versions**, not finished photoreal assets. Roughness 0.78 and metalness 0.08 are artistic constants, not scanned PBR maps. Textures are 1024 px. No image is passed off as a movable 3D object.

| Asset | Photograph creator / licence | Source | Generation job |
|---|---|---|---|
| K9 | Republic of Korea Armed Forces, CC BY-SA 2.0 | [Wikimedia photograph](https://commons.wikimedia.org/wiki/File:K-9_자주포_(7445556056)_(2).jpg) | 898e3fe9-e277-4699-bb6f-26555e31d408 |
| K21 | Republic of Korea Armed Forces, CC BY-SA 2.0 | [Wikimedia cropped photograph](https://commons.wikimedia.org/?curid=155897460) | 61a197a2-f3ba-4491-9a9d-9deddc5e1ccc |
| K216 | Cpl. Chloe Johnson, US Marine Corps, Public Domain | [DVIDS photo 8039572](https://www.dvidshub.net/image/8039572/dig-your-heels-rok-cbrn-marines-set-up-camp) | fb4462e8-3520-497d-b0b0-7ac0a8ac91a3 |
| FA-50 | Republic of Korea Air Force / KAI, CC BY 2.0 | [Wikimedia photograph](https://commons.wikimedia.org/wiki/File:Light_Combat_FA-50_Fighting_Eagle.jpg) | 1769e2df-ef9e-4e73-bb41-c1e6952fa40b |

Photo-derived K9/K21 exports are distributed under [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/). FA-50 derived export is [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). Credit and modification notices must accompany redistribution. K216 source is public domain; the additional project processing is CC0. Native Blender review files and dimension/texture reports: `artifacts/3d/photo-reconstructed/`. Regeneration script: `scripts/blender/import_photo_reconstruction.py`. Estimated dimensions are deliberately identified as approximate.

K2 candidate `k2-photo-reconstructed.glb` was **not promoted**: camouflage-net geometry is visibly melted/distorted. Photograph: [KBSVIEW–the DEEP, CC BY 3.0](https://commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg). Job edc16477-53e5-472c-bf04-9d6afe95c072. This candidate is an experimental [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) derivative. Existing K2 model remains selected.

Chunmoo photo reconstruction job d193a6eb-561e-4ee1-8200-218f14af8a77 **failed**; no generated GLB was fabricated or substituted.

## Dosan Ahn Changho / KSS-III

`dosan-detailed-cc0.glb`: [public BlenderKit exterior](https://www.blendkit.com/asset-gallery-detail/dceebb2a-0d80-49a8-a272-9554b39a1609/), creator **물범 북극**, author 250547, CC0; version fbf78ede-2053-4552-a7a3-2f0e9e229282. Original 2K albedo, normal, roughness and metalness maps preserved. Download used the provider's public free endpoint with its required scene UUID.

Blender changes: static evaluated exterior, removed missile meshes, rig and animations, decimated large batches to 58%, grounded Z origin; public GLB only contains exterior meshes. `scripts/blender/import_kss3.py` reproduces this export from the downloaded source. It is a detailed public creator model, **not a measured manufacturer model**. Waterline 7.6 m is an exhibition placement approximation.

## Equipment-specific authored drafts

`chungnam-referenced-v2.glb`, `chunmoo-referenced-v2.glb`: Blender exterior drafts with class-specific hull/cab, external fittings and material variation. **Photoreal quality not achieved.** Chungnam is an approximation of FFG-828, not the retired FF-953. Reference: [DAPA launch announcement](https://www.dapa.go.kr/dapa/doc/selectDoc.do?bbsSeq=326&docSeq=16812&menuSeq=3069). No manufacturer mesh was obtained.

Chunmoo cab photo patch uses [K239 Chunmoo](https://commons.wikimedia.org/wiki/File:K239_Chunmoo.jpg), 후니포커스 (사진출사정보), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), cropped/projected onto the authored exterior. Draft export is CC BY 3.0. Other locally authored draft geometry is CC0. No paid, non-downloadable or NoAI models were extracted.

## Terrain

Visitor runtime uses Esri World Imagery and ArcGIS WorldElevation3D/Terrain3D through Cesium, with provider attribution visible. Terrain vertical exaggeration is 1. Placement sites are illustrative public locations, **not deployments**. Satellite imagery is not an eye-level scan: trees, waves, buildings and small surface relief are not reconstructed as photoreal meshes.
