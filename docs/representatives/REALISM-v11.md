# Online satellite and equipment rendering

The exhibition combines internet-served Esri World Imagery and Terrain3D elevation with CesiumJS (Apache-2.0) and glTF equipment assets. Terrain heights remain 1:1. The exhibit coordinates are presentation positions, not deployments.

This iteration adds sun lighting, terrain receiving model shadows, FXAA, and a prefiltered CC0 outdoor HDR environment map for metallic reflections. The environment map is Greg Zaal's Kiara 6 Afternoon from Poly Haven, in the CesiumJS implementation's KTX2 format. It is reflection lighting, not a Korean background photograph. Pinned origin, license and checksum are in public/lighting/ATTRIBUTION.md.

FA-50, KAAV and Dosan-class assets are real loaded GLB resources from this repository's open reference reconstruction generators and retain their source notices. Nuri's existing GLB uses the same renderer. K2's third-party public 3D viewer remains connected alongside the satellite environment. A public model viewer and a downloadable GLB are distinct delivery mechanisms.

Sources investigated:

- https://github.com/CesiumGS/cesium/tree/201f20f232f7fb046a43568fc51324acb4a846cc
- https://cesium.com/learn/cesiumjs/ref-doc/Model.html
- https://cesium.com/learn/cesiumjs/ref-doc/ImageBasedLighting.html
- https://polyhaven.com/a/kiara_6_afternoon
- https://polyhaven.com/license
- https://github.com/Kevin-Liu-01/Claude-of-Tanks/blob/main/docs/ATTRIBUTION.md

The investigated tank repository marks its Armored Warfare K2 comparison asset as provenance-inconclusive and not for public shipping. It was not copied. Open-source software licensing is checked separately from each model's licensing. No unrelated F-16 or generic tank is substituted for a Korean representative.

Rendering stays on demand, with a 1024px shadow map on narrow devices and 2048px elsewhere. The globe exploration overview keeps its original lighting for readable geographic navigation; physical lighting is enabled in equipment environment scenes. Original movies retain their existing user-initiated playback and source captions.

The camera target now samples terrain even for equipment delivered through an external viewer. The K2 target previously remained at ellipsoid height 0 while the sampled mountain ground was 736.43m, placing close views below the terrain. `scripts/qa/terrain-anchor.cjs` failed before the repair and passed after it (refined target 736.97m). Refinement updates both the target and its marker. Final screenshots wait for the visible scene's terrain/imagery loading indicator to disappear before recording a camera state.
