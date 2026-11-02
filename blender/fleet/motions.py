# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# How to run: imported by blender/fleet/build.py inside Blender.
"""User-triggered educational motion tracks; no operational vehicle simulation."""
from __future__ import annotations

import math
from dataclasses import dataclass

import bpy
from mathutils import Vector


@dataclass(frozen=True, slots=True)
class Motion:
    name: str
    axis: int
    values: tuple[float, ...]


def rotation(item: bpy.types.Object, motion: Motion) -> None:
    """Preserve source rest rotation while adding one independently named NLA clip."""
    item.rotation_mode = "XYZ"
    base = item.rotation_euler.copy()
    for i, value in enumerate(motion.values):
        item.rotation_euler = base.copy()
        item.rotation_euler[motion.axis] += value
        item.keyframe_insert(data_path="rotation_euler", frame=i * 120 / (len(motion.values) - 1))
    action = item.animation_data.action
    action.name = motion.name + "_" + item.name
    track = item.animation_data.nla_tracks.new()
    track.name = motion.name
    track.strips.new(motion.name, 0, action)
    item.animation_data.action = None
    track.mute = True
    item.rotation_euler = base


def add(root: bpy.types.Object) -> list[str]:
    """Animate existing physical groups; unavailable components get no fake controls."""
    rotation(root, Motion("Turntable", 2, (0, math.pi / 2, math.pi, math.pi * 1.5, math.tau)))
    names = ["Turntable"]
    objects = {obj.name: obj for obj in root.children_recursive}
    for part, name, axis, values in [
        ("Turret", "TurretTraverse", 2, (0, .35, 0, -.35, 0)),
        ("Gun", "BarrelElevation", 0, (0, .15, .25, .15, 0)),
        ("MainRotor", "RotorStudy", 2, tuple(j * math.pi / 2 for j in range(9))),
        ("Propeller", "PropellerStudy", 1, tuple(j * math.pi / 2 for j in range(9))),
    ]:
        if part in objects:
            rotation(objects[part], Motion(name, axis, values))
            names.append(name)
    # Exterior group separation is a diagram, not an assertion of internal assembly.
    parts = [objects[name] for name in ("Turret", "RunningGear", "Wings", "SolarPanels", "Antenna", "MainRotor", "Tail", "Payload") if name in objects and objects[name].parent is not None]
    if parts:
        for obj in parts:
            base = obj.location.copy()
            distance = max(1, max(obj.dimensions)) * .2
            for frame, amount in ((0, 0), (30, 1), (90, 1), (120, 0)):
                obj.location = base + Vector((0, 0, distance * amount))
                obj.keyframe_insert(data_path="location", frame=frame)
            action = obj.animation_data.action
            action.name = "ExplodedView_" + obj.name
            track = obj.animation_data.nla_tracks.new()
            track.name = "ExplodedView"
            track.strips.new("ExplodedView", 0, action)
            obj.animation_data.action = None
            track.mute = True
            obj.location = base
        names.append("ExplodedView")
    return names
