"""Exportable aviation surface maps on the existing photo-reference FA-50 exterior."""
from pathlib import Path
import sys
import json
import bpy
import numpy as np
sys.path.insert(0,str(Path('scripts/blender').resolve()))
from refine_environment_assets import surface_uv
from photo_study import bounds,studio,render

OUT=Path('artifacts/3d/verified-assets');OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(Path('public/models/fa50-reference.glb').resolve()))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
size=1024;yy,xx=np.mgrid[:size,:size]
rng=np.random.default_rng(50);grain=rng.random((size,size)).astype(np.float32)
seams=((xx%256<2)|(yy%128<2)).astype(np.float32)
rivets=(((xx%32<2)&(yy%128<5))|((yy%32<2)&(xx%256<5))).astype(np.float32)
maps={
 'Aviation panel roughness':np.repeat(np.clip(.68+grain*.09+seams*.08,0,1)[:,:,None],3,axis=2),
 'Aviation panel normal':np.stack((np.full_like(grain,.5),np.full_like(grain,.5),np.ones_like(grain)),axis=-1),
 'Aviation panel tone':np.repeat((1-seams*.065-rivets*.1-grain*.018)[:,:,None],3,axis=2),
}
dy,dx=np.gradient(seams*.8+rivets*.35+grain*.015)
normal=np.stack((-dx,-dy,np.ones_like(dx)),axis=-1);normal/=np.linalg.norm(normal,axis=-1,keepdims=True)
maps['Aviation panel normal']=normal*.5+.5
images={}
for name,rgb in maps.items():
 image=bpy.data.images.new(name,size,size,alpha=True);image.colorspace_settings.name='Non-Color'
 rgba=np.ones((size,size,4),dtype=np.float32);rgba[:,:,:3]=rgb
 image.pixels.foreach_set(rgba.ravel());image.pack();images[name]=image
for mesh in meshes:
 for layer in list(mesh.data.uv_layers):mesh.data.uv_layers.remove(layer)
 surface_uv(mesh)
for material in {m for obj in meshes for m in obj.data.materials if m}:
 shader=material.node_tree.nodes.get('Principled BSDF')
 if shader.inputs['Roughness'].default_value<.5:continue
 rough=material.node_tree.nodes.new('ShaderNodeTexImage');rough.image=images['Aviation panel roughness']
 material.node_tree.links.new(rough.outputs['Color'],shader.inputs['Roughness'])
 texture=material.node_tree.nodes.new('ShaderNodeTexImage');texture.image=images['Aviation panel normal']
 node=material.node_tree.nodes.new('ShaderNodeNormalMap');node.inputs['Strength'].default_value=.24
 material.node_tree.links.new(texture.outputs['Color'],node.inputs['Color']);material.node_tree.links.new(node.outputs['Normal'],shader.inputs['Normal'])
 # Retain the original base colour factor; no shader-only noise that disappears in GLB.
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(Path('public/models/fa50-surface-v2.glb').resolve()),export_format='GLB',use_selection=True,use_active_scene=True)
low,high=bounds(meshes);studio((low+high)*.5,high-low,0);bpy.context.scene.cycles.samples=24
render(OUT/'fa50-after.png')
bpy.ops.wm.save_as_mainfile(filepath=str((OUT/'fa50-surface.blend').resolve()))
(OUT/'fa50-provenance.json').write_text(json.dumps({'id':'fa50','status':'existing estimated exterior with authored aviation panel roughness/normal; not a photogrammetry mesh','resolution':1024,'source':'public/models/fa50-reference.glb','measuredPanelLayout':False},indent=2),encoding='utf-8')
