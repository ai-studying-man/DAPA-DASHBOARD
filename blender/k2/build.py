# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# How to run: blender --background --factory-startup --python-exit-code 1 --python blender/k2/build.py
"""Bake authored surface maps and educational pivots into a sibling K2 asset."""
from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path
from typing import Final

import bpy
import numpy as np
from mathutils import Vector

ROOT: Final = Path(__file__).resolve().parents[2]
OUT: Final = ROOT / "blender/k2"
EVIDENCE: Final = ROOT / "artifacts/3d/k2-pipeline"
SOURCE: Final = ROOT / "public/models/k2-surface-refinement.glb"
sys.path.insert(0, str(ROOT / "scripts/blender"))
from photo_study import bounds, studio, render


def packed_image(name: str, pixels: np.ndarray) -> bpy.types.Image:
    """Pack a linear data image; no photographs or inferred details are baked."""
    image = bpy.data.images.new(name, width=256, height=256)
    image.colorspace_settings.name = "Non-Color"
    image.pixels.foreach_set(pixels.astype(np.float32).ravel())
    image.filepath_raw = str(OUT / f"{name}.png")
    image.file_format = "PNG"
    image.save()
    image.pack()
    return image


def surface_maps() -> None:
    """Authored microtexture is explicitly separate from measured surface data."""
    y, x = np.mgrid[0:256, 0:256].astype(np.float32) / 256 * math.tau
    normal_pixels = np.ones((256, 256, 4), dtype=np.float32)
    normal_pixels[:, :, 0] = .5 + .025 * np.sin(x * 16) * np.cos(y * 16)
    normal_pixels[:, :, 1] = .5 + .025 * np.cos(x * 16) * np.sin(y * 16)
    normal_pixels[:, :, 2] = np.sqrt(1 - (normal_pixels[:, :, 0] * 2 - 1) ** 2 - (normal_pixels[:, :, 1] * 2 - 1) ** 2) * .5 + .5
    orm = np.ones_like(normal_pixels)
    orm[:, :, 1] = .77 + .04 * np.sin(x * 8) * np.sin(y * 8)
    orm[:, :, 2] = .12
    normal = packed_image("AuthoredPaintNormal", normal_pixels)
    material_data = packed_image("AuthoredPaintMetalRough", orm)
    armor = bpy.data.materials["Painted armor | authored camouflage"]
    shader = armor.node_tree.nodes.get("Principled BSDF")
    node = armor.node_tree.nodes.new("ShaderNodeTexImage")
    node.image = normal
    mapping = armor.node_tree.nodes.new("ShaderNodeNormalMap")
    armor.node_tree.links.new(node.outputs["Color"], mapping.inputs["Color"])
    armor.node_tree.links.new(mapping.outputs["Normal"], shader.inputs["Normal"])
    node = armor.node_tree.nodes.new("ShaderNodeTexImage")
    node.image = material_data
    separate = armor.node_tree.nodes.new("ShaderNodeSeparateColor")
    armor.node_tree.links.new(node.outputs["Color"], separate.inputs["Color"])
    armor.node_tree.links.new(separate.outputs["Green"], shader.inputs["Roughness"])
    armor.node_tree.links.new(separate.outputs["Blue"], shader.inputs["Metallic"])


def animate(item: bpy.types.Object, name: str, values: list[Vector]) -> None:
    """One named NLA track per motion exports a distinct, user-initiated clip."""
    item.rotation_mode = "XYZ"
    for frame, value in zip((0, 30, 60, 90, 120), values, strict=True):
        item.rotation_euler = value
        item.keyframe_insert(data_path="rotation_euler", frame=frame)
    action = item.animation_data.action
    action.name = name
    track = item.animation_data.nla_tracks.new()
    track.name = name
    track.strips.new(name, 0, action)
    item.animation_data.action = None
    track.mute = True
    item.rotation_euler = (0, 0, 0)


def run() -> None:
    """Import existing geometry without replacing it; save reproducible evidence."""
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    sources = [SOURCE, ROOT / "public/models/k2-exhibit.glb", ROOT / "public/models/k2-photo-pbr.glb"]
    hashes = {p.relative_to(ROOT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in sources}
    (OUT / "source-hashes.json").write_text(json.dumps(hashes, indent=2) + "\n", encoding="utf-8")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(SOURCE))
    imported = list(bpy.context.scene.objects)
    meshes = [item for item in imported if item.type == "MESH"]
    # Bevel-created faces inherited collapsed UVs from the source. Unwrap the
    # surfaces before exporting a portable, explicit tangent basis.
    bpy.ops.object.select_all(action="DESELECT")
    for item in meshes:
        bpy.context.view_layer.objects.active = item
        item.select_set(True)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.smart_project(island_margin=.02)
        bpy.ops.object.mode_set(mode="OBJECT")
        item.select_set(False)
    surface_maps()
    rig = bpy.data.objects.new("ExhibitRoot", None)
    bpy.context.collection.objects.link(rig)
    rig["classification"] = "Educational exterior candidate; not photorealism verified or actual operating performance"
    rig["license"] = "CC BY 3.0 / DAPA DASHBOARD"
    for item in imported:
        if item.parent not in imported:
            world = item.matrix_world.copy()
            item.parent = rig
            item.matrix_world = world
    scene = bpy.context.scene
    scene.render.fps = 30
    scene.frame_start, scene.frame_end = 0, 120
    animate(rig, "Turntable", [Vector((0, 0, a)) for a in (0, math.pi / 2, math.pi, math.pi * 1.5, math.tau)])
    animate(bpy.data.objects["Turret"], "TurretTraverse", [Vector((0, 0, a)) for a in (0, .4, 0, -.4, 0)])
    animate(bpy.data.objects["Gun"], "BarrelElevation", [Vector((a, 0, 0)) for a in (0, .18, .3, .18, 0)])
    scene.frame_set(0)
    bpy.context.view_layer.update()
    bpy.ops.object.select_all(action="DESELECT")
    for item in [*imported, rig]:
        item.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(EVIDENCE / "raw.glb"), export_format="GLB", use_selection=True, export_extras=True, export_tangents=True, export_animations=True, export_animation_mode="NLA_TRACKS", export_frame_range=True)
    low, high = bounds(meshes)
    center, span = (low + high) * .5, high - low
    studio(center, span, low.z)
    scene.cycles.samples = 12
    scene.render.resolution_x, scene.render.resolution_y = 960, 640
    camera = scene.camera
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "source.blend"))
    for name, direction in (("front", (0, 1, .12)), ("side", (1, 0, .12)), ("three-quarter", (1, 1.4, .9))):
        camera.location = center + Vector(direction).normalized() * span.length * 2
        camera.rotation_euler = (center - camera.location).to_track_quat("-Z", "Y").to_euler()
        render(EVIDENCE / f"{name}.png")
    (OUT / "build-report.json").write_text(json.dumps({"blender": bpy.app.version_string, "source": SOURCE.relative_to(ROOT).as_posix(), "clips": ["Turntable", "TurretTraverse", "BarrelElevation"], "fps": 30, "durationSeconds": 4, "geometryRebuilt": False, "authoredSurfaceMaps": True, "photorealismVerified": False, "physicsValidated": False}, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    run()
