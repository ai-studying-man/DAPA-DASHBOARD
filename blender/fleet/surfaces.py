# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# How to run: imported by blender/fleet/build.py inside Blender.
"""Authored surface maps for untextured exteriors; preserve licensed source maps."""
from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Final

import bpy
import numpy as np
from mathutils import Vector

MAPS: Final = Path("artifacts/3d/fleet/maps")


def material(name: str, color: tuple[float, float, float]) -> bpy.types.Material:
    """Create one explicit exterior material role."""
    result = bpy.data.materials.new(name)
    result.use_nodes = True
    shader = result.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = .72
    shader.inputs["Metallic"].default_value = .1
    return result


def image(name: str, pixels: np.ndarray) -> bpy.types.Image:
    """Save and pack an independently authored raster, never a photograph."""
    MAPS.mkdir(parents=True, exist_ok=True)
    result = bpy.data.images.new(name, width=128, height=128)
    result.pixels.foreach_set(pixels.astype(np.float32).ravel())
    result.filepath_raw = str((MAPS / f"{name}.png").resolve())
    result.file_format = "PNG"
    result.save()
    result.pack()
    return result


def apply(meshes: list[bpy.types.Object]) -> None:
    """UV and PBR on missing surfaces only; existing photographic maps stay intact."""
    changed: set[bpy.types.Material] = set()
    for mat in {m for obj in meshes for m in obj.data.materials if m}:
        mat.use_nodes = True
        shader = mat.node_tree.nodes.get("Principled BSDF")
        if shader is None:
            continue
        # Existing maps and their UVs are an inseparable, attributed source asset.
        if any(node.type == "TEX_IMAGE" for node in mat.node_tree.nodes):
            continue
        changed.add(mat)
        color = np.array(shader.inputs["Base Color"].default_value[:], dtype=np.float32)
        seed = int(hashlib.sha256(mat.name.encode()).hexdigest()[:8], 16)
        grain = np.random.default_rng(seed).normal(0, .006, (128, 128, 1))
        pixels = np.ones((128, 128, 4), dtype=np.float32)
        pixels[:, :, :3] = np.clip(color[:3] + grain, 0, 1)
        tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
        tex.image = image("AuthoredColor_" + str(seed), pixels)
        if not shader.inputs["Base Color"].is_linked:
            mat.node_tree.links.new(tex.outputs["Color"], shader.inputs["Base Color"])
        pixels[:, :, 0], pixels[:, :, 1], pixels[:, :, 2] = 1, shader.inputs["Roughness"].default_value, shader.inputs["Metallic"].default_value
        data = mat.node_tree.nodes.new("ShaderNodeTexImage")
        data.image = image("AuthoredMetalRough_" + str(seed), pixels)
        data.image.colorspace_settings.name = "Non-Color"
        separate = mat.node_tree.nodes.new("ShaderNodeSeparateColor")
        mat.node_tree.links.new(data.outputs["Color"], separate.inputs["Color"])
        mat.node_tree.links.new(separate.outputs["Green"], shader.inputs["Roughness"])
        mat.node_tree.links.new(separate.outputs["Blue"], shader.inputs["Metallic"])
        # Flat authored normal defaults are explicit, not invented measured detail.
        pixels[:, :, :3] = (.5, .5, 1)
        normal = mat.node_tree.nodes.new("ShaderNodeTexImage")
        normal.image = image("AuthoredNormal_" + str(seed), pixels)
        normal.image.colorspace_settings.name = "Non-Color"
        mapping = mat.node_tree.nodes.new("ShaderNodeNormalMap")
        mat.node_tree.links.new(normal.outputs["Color"], mapping.inputs["Color"])
        mat.node_tree.links.new(mapping.outputs["Normal"], shader.inputs["Normal"])
        mat["surface_status"] = "Authored color and PBR defaults; no scanned normal or baked AO"
    for obj in meshes:
        if not any(mat in changed for mat in obj.data.materials):
            continue
        uv = obj.data.uv_layers.active or obj.data.uv_layers.new(name="AuthoredSurfaceUV")
        # Normalize each constant-color face's local projection. Tiny bevel faces
        # must not inherit collapsed UVs; textured-source faces are never remapped.
        for polygon in obj.data.polygons:
            if obj.data.materials[polygon.material_index] not in changed:
                continue
            points = [obj.data.vertices[obj.data.loops[i].vertex_index].co for i in polygon.loop_indices]
            normal = polygon.normal
            axis = min((Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))), key=lambda v: abs(v.dot(normal)))
            u = normal.cross(axis).normalized()
            v = normal.cross(u).normalized()
            span = max((p - points[0]).length for p in points) or 1
            for loop, point in zip(polygon.loop_indices, points, strict=True):
                relative = (point - points[0]) / span
                uv.data[loop].uv = (relative.dot(u), relative.dot(v))
