# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# How to run: blender --background --factory-startup --python-exit-code 1 --python blender/fleet/build.py
"""Build independent, resumable Blender candidates for every catalogue entry."""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Final

import bpy

ROOT: Final = Path(__file__).resolve().parents[2]
sys.path[:0] = [str(ROOT / "blender/fleet"), str(ROOT / "scripts/blender")]
from new_exteriors import Palette, create
from surfaces import material, apply, finish_layers
from motions import add
from refine_airframe import refine_kf21
from photo_study import bounds, studio, render

OUT: Final = ROOT / "artifacts/3d/fleet"
BLENDS: Final = ROOT / "blender/fleet/models"
PARTS: Final = ("Hull", "Turret", "Gun", "RunningGear", "MainRotor", "Propeller", "Wings", "Tail", "SolarPanels", "Antenna", "Payload")


def run() -> None:
    """Existing completed candidates are skipped; use --only ID for a targeted rebuild."""
    catalog = json.loads((ROOT / "blender/fleet/catalog.json").read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    BLENDS.mkdir(parents=True, exist_ok=True)
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
    for entry in catalog:
        identity = entry["id"]
        if identity == "k2" or only is not None and identity != only:
            continue
        if "--new" in sys.argv and entry["source"]:
            continue
        target = OUT / identity
        target.mkdir(parents=True, exist_ok=True)
        if only is None and "--new" not in sys.argv and (target / "build.json").exists() and (target / "raw.glb").exists():
            continue
        bpy.ops.wm.read_factory_settings(use_empty=True)
        if entry["source"]:
            bpy.ops.import_scene.gltf(filepath=str(ROOT / "public" / entry["source"][2:]))
            if identity == "kf21":
                refine_kf21()
            imported = list(bpy.context.scene.objects)
            for obj in imported:
                obj.animation_data_clear()
        else:
            m = Palette(material("Paint", (.22, .27, .17) if entry["domain"] == "land" else (.38, .42, .46)), material("Optics", (.025, .065, .08)), material("Steel", (.16, .18, .19)), material("Rubber", (.025, .028, .025)), material("Solar cells", (.025, .055, .2)))
            m.glass.node_tree.nodes.get("Principled BSDF").inputs["Roughness"].default_value = .22
            m.steel.node_tree.nodes.get("Principled BSDF").inputs["Metallic"].default_value = .75
            create(identity, m)
            imported = list(bpy.context.scene.objects)
        rig = bpy.data.objects.new("ExhibitRoot", None)
        bpy.context.collection.objects.link(rig)
        rig["classification"] = "Educational exterior study, not verified photorealism, CAD or operating performance"
        rig["source_asset"] = entry["source"] or "Independently authored public-exterior study"
        for obj in imported:
            if obj.parent not in imported:
                world = obj.matrix_world.copy()
                obj.parent = rig
                obj.matrix_world = world
        if bpy.data.objects.get("Hull") is None:
            hull = bpy.data.objects.new("Hull", None)
            bpy.context.collection.objects.link(hull)
            hull.parent = rig
            for child in list(rig.children):
                if child != hull:
                    world = child.matrix_world.copy()
                    child.parent = hull
                    child.matrix_world = world
            imported.append(hull)
        meshes = [obj for obj in imported if obj.type == "MESH"]
        for obj in meshes:
            obj.data.update()
        bpy.context.view_layer.update()
        apply(meshes)
        finish_layers(identity, meshes)
        for obj in meshes:
            if any(len(polygon.vertices) > 4 for polygon in obj.data.polygons):
                bpy.context.view_layer.objects.active = obj
                triangulate = obj.modifiers.new("Portable tangent topology", "TRIANGULATE")
                bpy.ops.object.modifier_apply(modifier=triangulate.name)
        bpy.context.view_layer.update()
        low, high = bounds(meshes)
        clips = add(rig)
        scene = bpy.context.scene
        scene.render.fps = 30
        scene.frame_start, scene.frame_end = 0, 120
        scene.frame_set(0)
        bpy.ops.object.select_all(action="DESELECT")
        for obj in [*imported, rig]:
            obj.select_set(True)
        bpy.ops.export_scene.gltf(filepath=str(target / "raw.glb"), export_format="GLB", use_selection=True, export_extras=True, export_tangents=True, export_animations=True, export_animation_mode="NLA_TRACKS", export_frame_range=True)
        studio((low + high) * .5, high - low, low.z)
        scene.render.engine = "CYCLES"
        scene.cycles.samples = 8
        scene.render.resolution_x, scene.render.resolution_y = 640, 420
        bpy.ops.file.pack_all()
        bpy.ops.wm.save_as_mainfile(filepath=str(BLENDS / (identity + ".blend")), compress=True)
        render(target / "render.png")
        parts = [name for name in PARTS if bpy.data.objects.get(name) is not None]
        (target / "build.json").write_text(json.dumps({"id": identity, "blender": bpy.app.version_string, "parts": parts, "clips": clips, "span": list(high - low), "photorealismVerified": False}, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    run()
