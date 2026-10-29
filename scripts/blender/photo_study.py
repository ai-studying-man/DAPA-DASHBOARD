# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# How to run: blender --background --factory-startup --python scripts/blender/photo_study.py -- scripts/blender/k2-photo-study.json
"""Non-destructive Blender UV/photo-reference experiment; uses Blender's bpy/numpy."""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Final, Literal, assert_never

import bpy
import numpy as np
from mathutils import Vector


PARTS: Final = ("Hull", "Turret", "Gun", "RunningGear", "Markings")


@dataclass(frozen=True, slots=True)
class Config:
    source: str
    atlas: str
    output: str
    cells: dict[str, list[int]]
    classification: str
    sourcePhoto: str
    sourceCredit: str
    license: str


def read_config(path: Path) -> Config:
    """Read the explicit local experiment contract before resetting Blender."""
    result = Config(**json.loads(path.read_text(encoding="utf-8")))
    for source in (result.source, result.atlas):
        if not Path(source).is_file():
            raise FileNotFoundError(source)
    if Path(result.source).resolve() == Path(result.output + ".glb").resolve():
        raise FileExistsError("Experiment output must not overwrite the source GLB")
    return result


def bounds(meshes: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    """World-space bounds retain original hierarchy and articulation origins."""
    points = [item.matrix_world @ Vector(corner) for item in meshes for corner in item.bound_box]
    return Vector(tuple(min(p[i] for p in points) for i in range(3))), Vector(tuple(max(p[i] for p in points) for i in range(3)))


def camera_at(center: Vector, span: Vector) -> bpy.types.Object:
    """Use a shared orthographic comparison camera, not a separate flattering shot."""
    data = bpy.data.cameras.new("ComparisonCamera")
    item = bpy.data.objects.new("ComparisonCamera", data)
    bpy.context.collection.objects.link(item)
    item.location = center + Vector((1.0, 1.4, .9)).normalized() * span.length * 2
    item.rotation_euler = (center - item.location).to_track_quat("-Z", "Y").to_euler()
    data.type = "ORTHO"
    data.ortho_scale = span.length * 1.10
    bpy.context.scene.camera = item
    return item


def studio(center: Vector, span: Vector, floor_z: float) -> None:
    """Neutral lighting and one floor stay out of the exported model selection."""
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 24
    scene.cycles.use_denoising = True
    scene.render.resolution_x, scene.render.resolution_y = 1200, 800
    scene.render.resolution_percentage = 100
    scene.world = bpy.data.worlds.new("ComparisonWorld")
    scene.world.color = (.22, .22, .22)
    scene.view_settings.view_transform = "AgX"
    for index, position in enumerate(((8, 10, 14), (-8, 1, 8), (0, -8, 10))):
        data = bpy.data.lights.new(f"StudioArea{index}", "AREA")
        data.energy, data.shape, data.size = (1800, "DISK", 8)
        light = bpy.data.objects.new(data.name, data)
        bpy.context.collection.objects.link(light)
        light.location = center + Vector(position)
        light.rotation_euler = (center - light.location).to_track_quat("-Z", "Y").to_euler()
    bpy.ops.mesh.primitive_plane_add(size=span.length * 20, location=(center.x, center.y, floor_z - .015))
    floor = bpy.context.object
    floor.name = "ComparisonFloor"
    material = bpy.data.materials.new("NeutralFloor")
    material.diffuse_color = (.22, .24, .25, 1)
    floor.data.materials.append(material)
    camera_at(center, span)


def render(path: Path) -> None:
    """Save a real Blender render; it does not prove accurate equipment geometry."""
    bpy.context.scene.render.filepath = str(path.resolve())
    bpy.ops.render.render(write_still=True)


def content_rect(image: bpy.types.Image, cell: list[int]) -> tuple[float, float, float, float]:
    """Exclude neutral generated backdrop from the per-view mapping rectangle."""
    width, height = image.size
    pixels = np.asarray(image.pixels[:], dtype=np.float32).reshape(height, width, 4)
    x0, y0, x1, y1 = cell
    rgb = pixels[y0:y1, x0:x1, :3]
    color_span = rgb.max(axis=2) - rgb.min(axis=2)
    visible = (color_span > .055) | (rgb.max(axis=2) < .28)
    yy, xx = np.nonzero(visible)
    if xx.size == 0:
        raise LookupError(f"No object silhouette detected in atlas cell {cell}")
    return ((x0 + int(xx.min())) / width, (y0 + int(yy.min())) / height,
            (x0 + int(xx.max()) + 1) / width, (y0 + int(yy.max()) + 1) / height)


def photo_material(image: bpy.types.Image) -> bpy.types.Material:
    """Only baseColor receives a color image; no normal/data map masquerades as color."""
    image.colorspace_settings.name = "sRGB"
    image.pack()
    material = bpy.data.materials.new("K2_AI_PhotoReference_Study")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    shader = nodes.get("Principled BSDF")
    shader.inputs["Roughness"].default_value = .86
    shader.inputs["Metallic"].default_value = .14
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = image
    texture.interpolation = "Linear"
    material.node_tree.links.new(texture.outputs["Color"], shader.inputs["Base Color"])
    return material


def project_mesh(item: bpy.types.Object, low: Vector, high: Vector, rectangles: dict[str, tuple[float, float, float, float]]) -> None:
    """Directional UV projection is an appearance experiment, not photogrammetry."""
    mesh = item.data
    uv = mesh.uv_layers.new(name="AI_ReferenceProjection")
    span = high - low
    normal_matrix = item.matrix_world.to_3x3().inverted().transposed()
    for polygon in mesh.polygons:
        normal = normal_matrix @ polygon.normal
        view: Literal["left", "top", "front", "rear"] = "left"
        if abs(normal.z) >= max(abs(normal.x), abs(normal.y)):
            view = "top"
        elif abs(normal.y) > abs(normal.x):
            view = "front" if normal.y > 0 else "rear"
        u0, v0, u1, v1 = rectangles[view]
        for loop_index in polygon.loop_indices:
            point = item.matrix_world @ mesh.vertices[mesh.loops[loop_index].vertex_index].co
            relative = (point - low)
            match view:
                case "left":
                    u, v = 1 - relative.y / span.y, relative.z / span.z
                case "top":
                    u, v = relative.x / span.x, relative.y / span.y
                case "front":
                    u, v = 1 - relative.x / span.x, relative.z / span.z
                case "rear":
                    u, v = relative.x / span.x, relative.z / span.z
                case unreachable:
                    assert_never(unreachable)
            uv.data[loop_index].uv = (u0 + u * (u1 - u0), v0 + v * (v1 - v0))


def run(config: Config) -> None:
    """Import/export a sibling experiment while preserving the deployed source."""
    output = Path(config.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(Path(config.source).resolve()))
    imported = list(bpy.context.scene.objects)
    meshes = [item for item in imported if item.type == "MESH"]
    bpy.context.view_layer.update()
    low, high = bounds(meshes)
    for name in PARTS:
        if bpy.data.objects.get(name) is None:
            raise LookupError(f"Missing original articulation group {name}")
    studio((low + high) * .5, high - low, low.z)
    render(output.with_name(output.name + "-before.png"))
    image = bpy.data.images.load(str(Path(config.atlas).resolve()))
    rectangles = {name: content_rect(image, cell) for name, cell in config.cells.items()}
    material = photo_material(image)
    for item in meshes:
        project_mesh(item, low, high, rectangles)
        item.data.materials.clear()
        item.data.materials.append(material)
        item.data.calc_loop_triangles()
    bpy.ops.object.select_all(action="DESELECT")
    for item in imported:
        item.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(output.with_suffix(".glb").resolve()), export_format="GLB", use_selection=True, export_extras=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(output.with_suffix(".blend").resolve()))
    render(output.with_name(output.name + "-after.png"))
    report = {"blender": bpy.app.version_string, "source": config.source, "atlas": config.atlas,
              "classification": config.classification, "sourceCredit": config.sourceCredit,
              "sourcePhoto": config.sourcePhoto, "license": config.license,
              "projection": "world-space directional projection, not calibrated multi-view reconstruction",
              "rectangles": rectangles, "parts": list(PARTS), "meshObjects": len(meshes),
              "triangles": sum(len(item.data.loop_triangles) for item in meshes),
              "output": str(output.with_suffix(".glb")), "productionPromoted": False}
    output.with_suffix(".json").write_text(json.dumps(report, indent=2), encoding="utf-8")


if __name__ == "__main__":
    run(read_config(Path(sys.argv[sys.argv.index("--") + 1])))
