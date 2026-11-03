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


def finish_layers(identity, meshes):
    """Exhibit finish estimates keyed to the actual source material slots."""
    roles = {
        "fa50": {"Material_0": (.24,.35), "Material_1": (.22,.37), "Material_3": (.9,.075)},
        "kaav": {"Material_0": (.08,.56), "Material_1": (.08,.50), "Material_5": (.8,.09)},
        "dosan": {"kss3": (.12,.48), "Side_Window": (.85,.09)},
        "chungnam": {"Naval painted steel": (.16,.45), "Optical glass": (.85,.08)},
        "k9": {"Camouflage paint.001": (.08,.55), "Optical glass.001": (.8,.08)},
        "muav": {"Paint": (.26,.36), "Optics": (.85,.08)},
        "remoeye": {"Paint": (.20,.42), "Optics": (.85,.08)},
    }
    common_finishes = {
        "MVP olive paint": (.08,.55), "MVP gray paint": (.20,.38),
        "MVP optical glass": (.85,.08), "Optical glass": (.85,.08),
        "Authored Korean camouflage": (.08,.55), "Optics": (.85,.08),
        "Paint": (.13,.46),
    }
    for mat in {m for obj in meshes for m in obj.data.materials if m}:
        finish = roles.get(identity, {}).get(mat.name, common_finishes.get(mat.name))
        if finish:
            shader = mat.node_tree.nodes.get("Principled BSDF")
            shader.inputs["Coat Weight"].default_value = finish[0]
            shader.inputs["Coat Roughness"].default_value = finish[1]


def apply(meshes: list[bpy.types.Object], detailed: bool = True) -> None:
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
        if detailed:
            # Periodic surface relief stays continuous at a wrapping UV seam.
            y, x = np.indices((128, 128)) * (np.pi / 64)
            optical = any(tag in mat.name.lower() for tag in ("glass", "optic", "lens", "canopy"))
            strength = .004 if optical else .035
            height = np.sin(3*x + 2*np.sin(y)) * np.cos(5*y) + .23*np.cos(19*x - 11*y)
            pixels[:, :, 1] = np.clip(pixels[:, :, 1] + strength * height, .04, 1)
        data = mat.node_tree.nodes.new("ShaderNodeTexImage")
        data.image = image("AuthoredMetalRough_" + str(seed), pixels)
        data.image.colorspace_settings.name = "Non-Color"
        separate = mat.node_tree.nodes.new("ShaderNodeSeparateColor")
        mat.node_tree.links.new(data.outputs["Color"], separate.inputs["Color"])
        mat.node_tree.links.new(separate.outputs["Green"], shader.inputs["Roughness"])
        mat.node_tree.links.new(separate.outputs["Blue"], shader.inputs["Metallic"])
        # Flat authored normal defaults are explicit, not invented measured detail.
        pixels[:, :, :3] = (.5, .5, 1)
        if detailed:
            dx = np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)
            dy = np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)
            vectors = np.stack((-strength * dx, -strength * dy, np.ones_like(dx)), axis=-1)
            pixels[:, :, :3] = .5 + .5 * vectors / np.linalg.norm(vectors, axis=-1, keepdims=True)
        normal = mat.node_tree.nodes.new("ShaderNodeTexImage")
        normal.image = image("AuthoredNormal_" + str(seed), pixels)
        normal.image.colorspace_settings.name = "Non-Color"
        mapping = mat.node_tree.nodes.new("ShaderNodeNormalMap")
        mat.node_tree.links.new(normal.outputs["Color"], mapping.inputs["Color"])
        mat.node_tree.links.new(mapping.outputs["Normal"], shader.inputs["Normal"])
        mat["surface_status"] = "Authored color and procedural micro-relief" if detailed else "Authored color and PBR defaults; no scanned normal or baked AO"
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
