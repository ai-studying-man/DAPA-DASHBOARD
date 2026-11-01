"""Normalize licensed-photo SAM reconstructions without replacing their authored UVs."""
from __future__ import annotations
import json
import sys
from pathlib import Path
import bpy
from mathutils import Vector

sys.path.insert(0, str(Path('scripts/blender').resolve()))
from photo_study import bounds, studio, render

# Exhibition dimensions are approximate. A single photograph cannot certify hidden surfaces.
SIZES = {'k216': (2.85, 5.7, 2.7), 'k21': (3.4, 6.9, 2.8),
         'k9': (3.4, 12., 3.6), 'k2': (3.6, 10.8, 3.2), 'fa50': (9.45, 13.14, 4.82)}


def prepare(identifier: str) -> None:
    """Keep generated topology and photo texture, export a metre-scale reviewable exterior."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    source = Path(f'.local/asset-research/{identifier}-sam-source.glb')
    bpy.ops.import_scene.gltf(filepath=str(source.resolve()))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    bpy.context.view_layer.update()
    low, high = bounds(meshes)
    original_span = high-low
    target = Vector(SIZES[identifier])
    # Bake hierarchy transforms before unit normalization. Preserve original UV coordinates.
    for obj in meshes:
        matrix = obj.matrix_world.copy()
        obj.parent = None
        obj.matrix_world.identity()
        for vertex in obj.data.vertices:
            point = matrix @ vertex.co
            vertex.co = Vector(((point.x-(low.x+high.x)/2)*target.x/original_span.x,
                                (point.y-(low.y+high.y)/2)*target.y/original_span.y,
                                (point.z-low.z)*target.z/original_span.z))
        obj['provenance'] = 'Single licensed photograph; AI inferred unseen surfaces; estimated scale'
    for material in bpy.data.materials:
        if material.use_nodes:
            shader = material.node_tree.nodes.get('Principled BSDF')
            if shader:
                shader.inputs['Roughness'].default_value = .78
                shader.inputs['Metallic'].default_value = .08
    for image in bpy.data.images:
        if image.type == 'IMAGE':
            image.pack()
    bpy.context.view_layer.update()
    low, high = bounds(meshes)
    output = Path('artifacts/3d/photo-reconstructed')
    output.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in meshes:
        obj.select_set(True)
    glb = Path(f'public/models/{identifier}-photo-reconstructed.glb')
    bpy.ops.export_scene.gltf(filepath=str(glb.resolve()), export_format='GLB',
                             use_selection=True, export_animations=False, export_extras=True)
    report = {'id': identifier, 'source': str(source), 'output': str(glb),
              'method': 'SAM 3 3D image reconstruction, Blender unit normalization; original UV albedo',
              'originalBounds': list(original_span), 'estimatedBoundsMetres': list(high-low),
              'triangles': sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes),
              'images': [{'name': i.name, 'size': list(i.size)} for i in bpy.data.images],
              'limitations': 'Single view; unseen surfaces inferred. No calibrated geometry or measured PBR.'}
    (output/f'{identifier}.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    studio((low+high)*.5, high-low, 0)
    # Consistent object framing and illumination; no backdrop photograph stands in for geometry.
    render(output/f'{identifier}.png')
    bpy.ops.wm.save_as_mainfile(filepath=str((output/f'{identifier}.blend').resolve()))


if __name__ == '__main__':
    for name in sys.argv[sys.argv.index('--')+1:]:
        prepare(name)
