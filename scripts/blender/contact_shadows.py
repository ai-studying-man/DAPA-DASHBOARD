"""Render actual Blender shadow-catcher contact sheets for the exterior meshes."""
from pathlib import Path
import json
import bpy
from mathutils import Vector

for identity in ('k2','k9'):
    bpy.ops.wm.open_mainfile(filepath=str(Path('artifacts/3d/photo-pbr',identity+'.blend').resolve()))
    scene=bpy.context.scene
    meshes=[o for o in scene.objects if o.type=='MESH' and o.name!='ComparisonFloor']
    points=[o.matrix_world @ Vector(corner) for o in meshes for corner in o.bound_box]
    low=Vector(tuple(min(p[k] for p in points) for k in range(3)))
    high=Vector(tuple(max(p[k] for p in points) for k in range(3)))
    center=(low+high)*.5
    extent=max(high-low)*1.5
    for mesh in meshes:
        mesh.visible_camera=False
    floor=scene.objects['ComparisonFloor'];floor.is_shadow_catcher=True
    scene.render.film_transparent=True
    scene.camera.location=(center.x,center.y,40)
    scene.camera.rotation_euler=(Vector((center.x,center.y,0))-scene.camera.location).to_track_quat('-Z','Y').to_euler()
    scene.camera.data.ortho_scale=extent
    for light in [o for o in scene.objects if o.type=='LIGHT']:
        light.location=(center.x,center.y,18);light.data.size=12;light.data.energy=900
        light.rotation_euler=(center-light.location).to_track_quat('-Z','Y').to_euler()
    scene.render.resolution_x=scene.render.resolution_y=512
    scene.cycles.samples=48
    scene.render.filepath=str(Path('public/models',identity+'-contact-shadow.png').resolve())
    bpy.ops.render.render(write_still=True)
    Path('artifacts/3d/photo-pbr',identity+'-shadow.json').write_text(json.dumps({'id':identity,'extent':extent,'center':list(center),'method':'Cycles shadow catcher, actual exterior mesh, overhead soft area light, flat ground assumption'}),encoding='utf-8')

records={}
for identity in ('k2','k9'):
    result=json.loads(Path('artifacts/3d/photo-pbr',identity+'-shadow.json').read_text())
    records[identity]={'image':f'./models/{identity}-contact-shadow.png','extent':result['extent'],'center':[result['center'][0],.025,-result['center'][1]]}
Path('src/photo-shadow-assets.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
