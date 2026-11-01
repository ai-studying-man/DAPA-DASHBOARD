# K2 / K9 photo-colour-informed surface study

Generated with Blender 4.5.9 by `scripts/blender/photo_pbr.py`.

- Geometry derives from the preserved `k2-photo-refined.glb` / `k9-photo-refined.glb` exterior reconstructions. Their respective `*-photo-refined-ATTRIBUTION.md` conditions remain applicable.
- K2 photo: KBS VIEW – theDEEP, CC BY 3.0, https://commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg
- K9 photo: Republic of Korea Armed Forces, CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:K-9_자주포_(7445556056)_(2).jpg
- Colour references use small documented paint-area samples blended 25% with 75% authored paint targets. Camouflage shapes, roughness and normal maps are authored, not scans of the photo surface. Lighting/shadows from the photos are not projected onto the mesh.
- World-space face UVs, small exterior bevels, deck-panel fasteners, authored dust tint and separate paint/steel/rubber/optics materials are provided. Native Blender sources and provenance JSON are in `artifacts/3d/photo-pbr/`.

This is an exterior material study. It is not photogrammetry, manufacturer CAD, measured geometry, a verified cockpit, or a completed photoreal digital twin. Hidden surfaces and proportions remain estimates. Do not describe the source images as newly captured project photographs or the authored texture as a scanned material. K2/K9 legacy models remain at their original paths.

Contact shadows: `scripts/blender/contact_shadows.py` renders actual exterior meshes onto a Cycles shadow catcher under overhead soft area lights. Flat-ground baked contact only; not real-time sun/terrain physics. PNGs are bound by `src/photo-shadow-assets.json` and follow exhibition motion.
