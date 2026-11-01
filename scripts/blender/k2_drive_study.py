"""Bake a reversible exhibit drive into a sibling K2 asset, not vehicle physics."""
from pathlib import Path
import json
import math
import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(Path('public/models/k2-photo-study.glb').resolve()))
imported = list(bpy.context.scene.objects)
rig = bpy.data.objects.new('ExhibitDriveRoot', None)
bpy.context.collection.objects.link(rig)
rig['classification'] = 'AI texture study; approximate exterior; illustrative drive, not validated vehicle dynamics'
rig['source_photo'] = 'https://commons.wikimedia.org/wiki/File:K2_Black_Panther_20161106.jpg'
rig['credit'] = 'KBS VIEW - theDEEP / CC BY 3.0; unseen faces AI-inferred'
for item in imported:
    if item.parent not in imported:
        world = item.matrix_world.copy()
        item.parent = rig
        item.matrix_world = world
scene = bpy.context.scene
scene.render.fps = 30
scene.frame_start, scene.frame_end = 0, 240
wheels = [item for item in imported if item.name.startswith('Wheel_')]
for frame in range(0, 241, 10):
    phase = 1 - abs(frame / 120 - 1)
    rig.location.y = phase * 8
    rig.keyframe_insert(data_path='location', frame=frame, group='ExhibitDrive')
    for wheel in wheels:
        wheel.rotation_mode = "XYZ"
        wheel.rotation_euler.x = phase * math.tau * 3
        wheel.keyframe_insert(data_path='rotation_euler', frame=frame, group='ExhibitWheelTurn')
scene.frame_set(0)
for item in bpy.context.scene.objects:
    item.select_set(True)
Path('artifacts/3d/k2-drive-study').mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(Path('public/models/k2-drive-study.glb').resolve()), export_format='GLB', export_animations=True, export_animation_mode='SCENE', export_frame_range=True, export_extras=True)
bpy.ops.wm.save_as_mainfile(filepath=str(Path('artifacts/3d/k2-drive-study/source.blend').resolve()))
Path('artifacts/3d/k2-drive-study/report.json').write_text(json.dumps({'blender':bpy.app.version_string,'frames':241,'fps':30,'wheelObjects':len(wheels),'meshObjects':sum(item.type=='MESH' for item in imported),'source':'k2-photo-study.glb','photorealismVerified':False,'physicsValidated':False},indent=2),encoding='utf-8')
