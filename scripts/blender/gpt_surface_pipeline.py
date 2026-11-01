"""GPT ImageGen reference + Blender authored exterior, without external image-to-3D APIs."""
from __future__ import annotations
import json
import sys
from pathlib import Path
import bpy
import numpy as np
sys.path.insert(0,str(Path('scripts/blender').resolve()))
from photo_study import bounds, studio, render
from refine_environment_assets import surface_uv

SOURCES={'k9':'k9-photo-pbr.glb','k21':'k21-referenced-v2.glb',
         'k216':'k216-referenced-v2.glb','chunmoo':'chunmoo-referenced-v2.glb'}
OUT=Path('artifacts/3d/gpt-blender');OUT.mkdir(parents=True,exist_ok=True)


def data_map(name: str, values: np.ndarray) -> bpy.types.Image:
    """Pack an artistic material data map; never claim this is a measured scan."""
    height,width=values.shape[:2]
    image=bpy.data.images.new(name,width=width,height=height)
    image.colorspace_settings.name='Non-Color'
    rgba=np.concatenate((values,np.ones((height,width,1))),axis=2).astype(np.float32)
    image.pixels.foreach_set(rgba.ravel());image.pack()
    return image


def build(identifier: str, source: str) -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(Path('public/models',source).resolve()))
    meshes=[obj for obj in bpy.context.scene.objects if obj.type=='MESH']
    albedo=bpy.data.images.load(str(Path('public/media/gpt-reference/paint-albedo.png').resolve()))
    albedo.pack();width,height=albedo.size
    pixels=np.asarray(albedo.pixels[:],dtype=np.float32).reshape(height,width,4)
    gray=pixels[:,:,:3].mean(axis=2)
    # High-frequency artistic grain only; camouflage boundaries must not become embossed geometry.
    smooth=sum(np.roll(np.roll(gray,y,axis=0),x,axis=1) for y in range(-2,3) for x in range(-2,3))/25
    grain=gray-smooth;dy,dx=np.gradient(grain*.15)
    normal=np.stack((-dx,-dy,np.ones_like(dx)),axis=-1)
    normal/=np.linalg.norm(normal,axis=-1,keepdims=True)
    maps={'Base Color':albedo,'Roughness':data_map('Artistic roughness',np.repeat(np.clip(.82+grain*.3,0,1)[:,:,None],3,axis=2)),
          'Normal':data_map('Artistic micro normal',normal*.5+.5)}
    changed=[]
    for material in bpy.data.materials:
        if not material.use_nodes or not any(word in material.name.lower() for word in ['camouflage','paint']):continue
        shader=material.node_tree.nodes.get('Principled BSDF')
        if not shader:continue
        for socket,image in maps.items():
            for link in list(shader.inputs[socket].links):material.node_tree.links.remove(link)
            node=material.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;node.extension='REPEAT'
            if socket=='Normal':
                mapper=material.node_tree.nodes.new('ShaderNodeNormalMap');mapper.inputs['Strength'].default_value=.25
                material.node_tree.links.new(node.outputs['Color'],mapper.inputs['Color']);material.node_tree.links.new(mapper.outputs['Normal'],shader.inputs[socket])
            else:material.node_tree.links.new(node.outputs['Color'],shader.inputs[socket])
        changed.append(material.name)
    if not changed:raise ValueError(f'No exterior paint materials in {identifier}')
    for obj in meshes:
        if any(m and m.name in changed for m in obj.data.materials):surface_uv(obj)
    bpy.context.view_layer.update();low,high=bounds(meshes)
    bpy.ops.object.select_all(action='SELECT')
    output=Path('public/models',identifier+'-gpt-blender.glb')
    bpy.ops.export_scene.gltf(filepath=str(output.resolve()),export_format='GLB',use_selection=True,export_animations=False)
    (OUT/f'{identifier}.json').write_text(json.dumps({'source':source,'output':str(output),'paintMaterials':changed,
        'method':'GPT ImageGen artistic albedo + Blender authored geometry/UV/material maps',
        'limitations':'Approximate geometry; inferred artistic surface maps, not calibrated scan or certified CAD'},indent=2),encoding='utf-8')
    studio((low+high)*.5,high-low,low.z);render(OUT/f'{identifier}.png')
    bpy.ops.wm.save_as_mainfile(filepath=str((OUT/f'{identifier}.blend').resolve()))


if __name__=='__main__':
    for identity,filename in SOURCES.items():build(identity,filename)
