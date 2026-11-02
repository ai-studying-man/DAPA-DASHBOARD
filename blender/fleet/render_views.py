# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# How to run: blender --background --python-exit-code 1 --python blender/fleet/render_views.py
"""Render verified saved Blender candidates without regenerating their assets."""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path
from typing import Final

import bpy
from mathutils import Vector

ROOT: Final = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts/blender"))
from photo_study import bounds, render


def run() -> None:
    """Read-only model inputs; only camera render PNGs are written."""
    entries = json.loads((ROOT / "src/fleet-assets.json").read_text(encoding="utf-8"))
    output = ROOT / "docs/modeling/fleet"
    for entry in entries:
        identity = entry["id"]
        if identity == "k2":
            for view in ("front", "side", "three-quarter"):
                shutil.copyfile(ROOT / "docs/modeling/k2/pipeline" / (view + ".png"), output / f"k2-{view}.png")
            continue
        bpy.ops.wm.open_mainfile(filepath=str(ROOT / entry["blend"]))
        meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and obj.name != "ComparisonFloor"]
        low, high = bounds(meshes)
        center, span = (low + high) * .5, high - low
        camera = bpy.context.scene.camera
        for name, direction in (("front", (0, 1, .1)), ("side", (1, 0, .1)), ("three-quarter", (1, 1.4, .9))):
            camera.location = center + Vector(direction).normalized() * span.length * 2
            camera.rotation_euler = (center - camera.location).to_track_quat("-Z", "Y").to_euler()
            render(output / f"{identity}-{name}.png")


if __name__ == "__main__":
    run()
