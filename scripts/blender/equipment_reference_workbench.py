"""Prepare packed reference scenes. Image empties are not vehicle meshes."""
from __future__ import annotations
import json
import math
from dataclasses import dataclass
from pathlib import Path
from mathutils import Quaternion, Vector
import bpy

@dataclass(frozen=True, slots=True)
class ReferenceItem:
    identity: str
    label: str
    image: Path | None

class InvalidCatalogError(Exception):
    """Generated catalog has an unexpected structure."""

def read_items(path: Path) -> list[ReferenceItem]:
    result: list[ReferenceItem] = []
    for record in json.loads(path.read_text(encoding='utf-8')):
        match record:
            case {'id': str(identity), 'label': str(label), 'image': str(image)}:
                result.append(ReferenceItem(identity, label, path.parent / image))
            case {'id': str(identity), 'label': str(label), 'image': None}:
                result.append(ReferenceItem(identity, label, None))
            case _:
                raise InvalidCatalogError(record)
    return result

def prepare() -> None:
    items = read_items(Path('docs/modeling/visual-targets/equipment-catalog.json'))
    bpy.ops.wm.read_factory_settings(use_empty=True)
    initial = bpy.context.scene
    imported_count = 0
    image_count = 0
    for index, item in enumerate(items):
        scene = initial if index == 0 else bpy.data.scenes.new(item.identity)
        scene.name = f'{index + 1:02d}_{item.identity}'
        bpy.context.window.scene = scene
        scene['catalog_label'] = item.label
        scene['stage'] = 'AI reference setup; mesh reconstruction pending'
        references = bpy.data.collections.new('Reference_' + item.identity)
        models = bpy.data.collections.new('Model_' + item.identity)
        scene.collection.children.link(references)
        scene.collection.children.link(models)
        if item.image is not None:
            image = bpy.data.images.load(str(item.image.resolve()), check_existing=True)
            image.pack()
            board = bpy.data.objects.new('AI_REFERENCE_NOT_MESH_' + item.identity, None)
            board.empty_display_type = 'IMAGE'
            board.data = image
            board.empty_display_size = 14
            board.location = (-10, 0, 3)
            board.rotation_euler.x = math.pi / 2
            board['classification'] = 'AI-inferred exterior reference; not measured blueprint'
            references.objects.link(board)
            image_count += 1
        else:
            scene['image_status'] = 'generation blocked; original catalog entry preserved'
        source = {'k2': 'k2-surface-refinement.glb', 'k9': 'k9-exhibit.glb'}.get(item.identity)
        if source is not None:
            before = set(scene.objects)
            bpy.ops.import_scene.gltf(filepath=str(Path('public/models', source).resolve()))
            imported = set(scene.objects) - before
            for obj in imported:
                if obj.parent not in imported:
                    obj.location.x += 10
                for collection in list(obj.users_collection):
                    collection.objects.unlink(obj)
                models.objects.link(obj)
            scene['mesh_status'] = 'existing approximate mesh for comparison, not new precision reconstruction'
            imported_count += 1
    bpy.context.window.scene = bpy.data.scenes['08_k9']
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == 'VIEW_3D':
                region = area.spaces.active.region_3d
                region.view_perspective = 'ORTHO'
                region.view_location = Vector((0, 0, 3))
                region.view_distance = 35
                region.view_rotation = Quaternion((.7071068, .7071068, 0, 0))
    output = Path('artifacts/3d/equipment-reference-workbench')
    output.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str((output / 'equipment-reference-workbench.blend').resolve()))
    (output / 'report.json').write_text(json.dumps({'scenes':len(items),'packedReferenceImages':image_count,'existingMeshComparisons':imported_count,'newPrecisionModels':0,'blocked':['km187'],'photorealMeshCompletion':False},indent=2),encoding='utf-8')

if __name__ == '__main__':
    prepare()
