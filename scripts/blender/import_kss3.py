"""Prepare the publicly downloadable CC0 KSS-III exterior for the web exhibit."""
from __future__ import annotations
import json
import sys
from pathlib import Path
import bpy
from mathutils import Vector

sys.path.insert(0,str(Path('scripts/blender').resolve()))
from photo_study import studio,render,bounds

OUT=Path('artifacts/3d/verified-assets');OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(Path('.local/asset-research/kss3-original.blend').resolve()))
scene=bpy.context.scene
scene.frame_set(1)
source=[o for o in scene.objects if o.type=='MESH' and len(o.data.polygons)>0 and 'missle' not in o.name.lower() and 'missile' not in o.name.lower()]
# Freeze authored exterior pose. No deployment mechanism or interior is exported.
graph=bpy.context.evaluated_depsgraph_get()
prepared=[]
for original in source:
    evaluated=original.evaluated_get(graph)
    mesh=bpy.data.meshes.new_from_object(evaluated,depsgraph=graph)
    item=bpy.data.objects.new(original.name+'_Exterior',mesh)
    scene.collection.objects.link(item);item.matrix_world=original.matrix_world.copy()
    if len(mesh.polygons)>10000:
        bpy.context.view_layer.objects.active=item
        modifier=item.modifiers.new('Web exterior LOD','DECIMATE');modifier.ratio=.58
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    prepared.append(item)
for original in list(scene.objects):
    if original not in prepared:bpy.data.objects.remove(original,do_unlink=True)
bpy.context.view_layer.update()
low,high=bounds(prepared)
for item in prepared:item.location.z-=low.z
bpy.context.view_layer.update();low,high=bounds(prepared)
# The source material already contains real authored UVs and 2K albedo/normal/roughness/metalness.
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(Path('public/models/dosan-detailed-cc0.glb').resolve()),export_format='GLB',
    use_selection=True,use_active_scene=True,export_animations=False,export_extras=True)
triangles=sum(sum(len(face.vertices)-2 for face in item.data.polygons) for item in prepared)
record={'id':'dosan','source':'https://www.blendkit.com/asset-gallery-detail/dceebb2a-0d80-49a8-a272-9554b39a1609/',
 'author':'물범 북극 (BlenderKit author 250547)','license':'CC0','version':'fbf78ede-2053-4552-a7a3-2f0e9e229282',
 'triangles':triangles,'bounds':list(high-low),'textures':'original packed 2048 PBR maps',
 'changes':'static evaluated exterior, removed missile meshes/rig/animation, reduced high-poly batches to 58%, ground normalized',
 'verification':'public creator asset, not manufacturer CAD or a measured scan'}
(OUT/'dosan-provenance.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8')
studio((low+high)*.5,high-low,0)
scene.cycles.samples=24
render(OUT/'dosan-after.png')
bpy.ops.wm.save_as_mainfile(filepath=str((OUT/'dosan-detailed.blend').resolve()))
