# GPT ImageGen → Blender workflow (2026-11-02 revision)

User-directed workflow: **Do not use Higgsfield APIs or credits.** No Higgsfield call was made in this revision. Previously generated SAM exterior GLBs are disconnected from the default visitor registry and preserved only as historical review candidates. Their provenance has not been rewritten.

## New outputs

- `media/gpt-reference/k9-atlas.png`: GPT ImageGen four-view artistic reference based on the licensed foreground K9 photograph. Not calibrated orthographic photography. Source: [Republic of Korea Armed Forces / CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:K-9_자주포_(7445556056)_(2).jpg). Generated side view still has perspective; do not present as a measured blueprint. Image derivative retains CC BY-SA 2.0.
- `media/gpt-reference/paint-albedo.png`: GPT ImageGen artistic matte camouflage texture, generated from text. Not an actual photograph or a scanned PBR material. Seam quality is an artistic approximation.
- K9, K21, K216 and Chunmoo: original authored Blender part meshes, UV mapping, generated albedo, artistic roughness/micro-normal maps, rubber/steel/glass materials retained, native `.blend` plus GLB export. Blender script: `scripts/blender/gpt_surface_pipeline.py`. Native files and review renders: `artifacts/3d/gpt-blender/`.
- FA-50 uses the locally authored Blender surface model; no SAM/Higgsfield mesh is selected. Dosan retains its openly licensed CC0 detailed exterior. Chungnam remains the local Blender exterior draft.

The K9 atlas guides visual comparison; the whole vehicle image is **not pasted across all 3D parts**. The generated texture tile is what is actually connected to the paint shaders. This pass improves surface rendering; it does not automatically create missing bolts, accurate welds, or certified geometry. All equipment still needs per-part photo comparison before any claim of completed photorealism.

## Image generation prompts

Built-in GPT ImageGen was used, not a CLI key or a third-party generator.

K9 atlas: "Create a photorealistic exterior modeling reference atlas of the foreground South Korean K9 tracked howitzer in the provided licensed photograph. Museum/static exhibit ONLY, no firing, no people, no technical schematics, no internals. One 2x2 grid, equal panels with flat neutral gray backgrounds: upper left exact full left side profile, barrel pointing left; upper right top-down full overhead; lower left straight front; lower right straight rear. Whole vehicle and entire barrel fit within each panel with margins. Consistent green/tan/brown South Korean camouflage in all views, six road wheels per side, boxy angular tall turret, real rough matte painted steel, visible exterior weld seams, panel edges, bolts, rubber wheel rims, metal track shoes, subtle dust and wear. Bright diffuse neutral illumination suitable for color reference, minimal baked shadows. Preserve recognizable proportions from source, infer obscured surfaces conservatively. No labels, text, decorative borders or watermarks. This is an AI artistic multi-view reference, not a measured CAD blueprint. Save generated output for use as a Blender UV reference."

Paint tile: "Generate a square seamless tileable photorealistic surface texture for a museum 3D reconstruction of matte painted Korean military vehicle exterior steel. Texture only, flat orthographic macro surface, no vehicle, no objects, no text. Large organically irregular muted olive green, desaturated tan and dark brown camouflage paint patches. Real fine orange-peel paint grain, sparse tiny scratches, restrained dust, small worn paint flecks at micro scale. Uniform diffuse albedo, absolutely no directional illumination, no cast shadows, no highlights, no fake bolts or panels baked in. Physically plausible subtle surface variation, realistic not illustrative. Edge-to-edge repeating texture. High resolution square image, neutral subdued colors."

## Existing licences

Existing geometry and photographic patches retain the source credits and licences in [DETAILED-ASSETS.md](DETAILED-ASSETS.md) and [PHOTO-PBR-ATTRIBUTION.md](PHOTO-PBR-ATTRIBUTION.md). Changing the generation provider does not remove those obligations. Satellite imagery/elevation attribution stays visible. The 360° viewer renders actual GLB geometry, while inferred/approximate modelling remains labelled.
