"""Refine existing exhibition meshes; not CAD or image-to-3D reconstruction."""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path
from typing import Final

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path('scripts/blender').resolve()))
from photo_study import bounds, studio, render

OUTPUT: Final = Path('artifacts/3d/environment-assets')
SOURCES: Final = (
    ('k9', 'k9-exhibit.glb'),
    ('dosan', 'dosan-reference.glb'),
    ('fa50', 'fa50-reference.glb'),
    ('kaav', 'kaav-reference.glb'),
)


def refine_mesh(item: bpy.types.Object, edge_width: float) -> None:
    """Weld exporter corners and bevel physical edges without moving pivots."""
    bpy.context.view_layer.objects.active = item
    bpy.ops.object.select_all(action='DESELECT')
    item.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=edge_width * .01)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.mesh.dissolve_limited(angle_limit=.01, delimit={'MATERIAL', 'SEAM', 'SHARP'})
    bpy.ops.object.mode_set(mode='OBJECT')
    bevel = item.modifiers.new('Exterior edge highlights', 'BEVEL')
    bevel.width = edge_width
    bevel.segments = 1
    bevel.limit_method = 'ANGLE'
    bevel.angle_limit = .6
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    item['geometry_status'] = 'existing silhouette; welded and beveled; unverified dimensions'


def refine_material(material: bpy.types.Material, camouflage: bpy.types.Image | None) -> None:
    """Keep source colors, separate optics, rubber, paint and exposed metal."""
    material.use_nodes = True
    shader = material.node_tree.nodes.get('Principled BSDF')
    if shader is None:
        return
    color = shader.inputs['Base Color'].default_value
    original_roughness = shader.inputs['Roughness'].default_value
    original_metallic = shader.inputs['Metallic'].default_value
    if original_roughness < .3:
        role, roughness, metallic = 'Optics', .19, .15
    elif max(color[:3]) < .045:
        role, roughness, metallic = 'Rubber and recesses', .91, .02
    elif original_metallic > .35:
        role, roughness, metallic = 'Exposed steel', .56, .72
    else:
        role, roughness, metallic = 'Painted exterior', .74, .08
    material.name = role + ' | ' + material.name
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metallic
    material['surface_role'] = role
    if camouflage is not None and role == 'Painted exterior':
        texture = material.node_tree.nodes.new('ShaderNodeTexImage')
        texture.image = camouflage
        material.node_tree.links.new(texture.outputs['Color'], shader.inputs['Base Color'])


def surface_uv(item: bpy.types.Object) -> None:
    """Project repeat paint into world space; never bake photographic shadows."""
    uv = item.data.uv_layers.new(name='ExteriorPaintUV')
    world = item.matrix_world
    normal = world.to_3x3().inverted().transposed()
    for polygon in item.data.polygons:
        axis = max(range(3), key=lambda k: abs((normal @ polygon.normal)[k]))
        axes = [k for k in range(3) if k != axis]
        for loop in polygon.loop_indices:
            point = world @ item.data.vertices[item.data.loops[loop].vertex_index].co
            uv.data[loop].uv = (point[axes[0]] * .22, point[axes[1]] * .22)


def build() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    reports = []
    first = bpy.context.scene
    for index, (identity, source) in enumerate(SOURCES):
        scene = first if index == 0 else bpy.data.scenes.new(identity)
        scene.name = identity.upper() + '_Exterior_Study'
        bpy.context.window.scene = scene
        bpy.ops.import_scene.gltf(filepath=str(Path('public/models', source).resolve()))
        parts = list(scene.objects)
        meshes = [part for part in parts if part.type == 'MESH']
        bpy.context.view_layer.update()
        low, high = bounds(meshes)
        span = high - low
        materials = {mat for mesh in meshes for mat in mesh.data.materials if mat}
        camouflage = None
        if identity in {'k9', 'kaav'}:
            camouflage = bpy.data.images.load(str(Path('artifacts/3d/k2-surface-refinement/authored-camo.png').resolve()), check_existing=True)
            camouflage.scale(512, 512)
            camouflage.pack()
        for material in materials:
            refine_material(material, camouflage)
        for mesh in meshes:
            if camouflage is not None:
                surface_uv(mesh)
            refine_mesh(mesh, max(span) * .00065)
        for part in scene.objects:
            part.select_set(part in parts)
        output = Path('public/models', identity + '-surface-refinement.glb')
        bpy.ops.export_scene.gltf(filepath=str(output.resolve()), export_format='GLB',
                                  use_selection=True, export_extras=True)
        studio((low + high) * .5, span, low.z)
        scene.render.engine = 'CYCLES'
        scene.cycles.samples = 12
        scene.render.resolution_x = 900
        scene.render.resolution_y = 600
        render(OUTPUT / (identity + '-after.png'))
        scene['status'] = 'exhibition approximation; no measured silhouette validation'
        reports.append({'id': identity, 'source': source, 'output': str(output),
                        'meshes': len(meshes), 'materials': len(materials),
                        'bounds': list(span), 'precisionVerified': False})
    bpy.context.window.scene = first
    bpy.ops.wm.save_as_mainfile(filepath=str((OUTPUT / 'source.blend').resolve()))
    (OUTPUT / 'report.json').write_text(json.dumps(reports, indent=2), encoding='utf-8')


if __name__ == '__main__':
    build()
