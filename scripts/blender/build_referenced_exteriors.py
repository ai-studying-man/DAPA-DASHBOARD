"""Produce per-equipment photo-reference exteriors, not category silhouettes."""
from __future__ import annotations
import json
import sys
from pathlib import Path
import bpy
sys.path.insert(0,str(Path('scripts/blender').resolve()))
from exterior_parts import compact
from photo_study import bounds,studio,render
from reference_surfaces import materials
from refine_environment_assets import surface_uv
from rebuild_tracked import build as tracked
from rebuild_large_exteriors import ship,truck

OUT=Path('artifacts/3d/verified-assets');OUT.mkdir(parents=True,exist_ok=True)
BUILDERS={'k21':lambda m:tracked('k21',m),'k216':lambda m:tracked('k216',m),'chungnam':ship,'chunmoo':truck}


def surface_detail(mat: bpy.types.Material) -> None:
    """Add exportable PBR maps without flattening photo/paint base colour."""
    shader=mat.node_tree.nodes.get('Principled BSDF')
    if shader.inputs['Roughness'].default_value<.3:return
    for name,socket in [('roughness','Roughness'),('normal','Normal')]:
        if shader.inputs[socket].is_linked:continue
        image=bpy.data.images.load(str(Path('artifacts/3d/photo-pbr/k2-'+name+'.png').resolve()),check_existing=True)
        image.colorspace_settings.name='Non-Color';image.pack()
        texture=mat.node_tree.nodes.new('ShaderNodeTexImage');texture.image=image
        if name=='normal':
            normal=mat.node_tree.nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.18
            mat.node_tree.links.new(texture.outputs['Color'],normal.inputs['Color']);mat.node_tree.links.new(normal.outputs['Normal'],shader.inputs[socket])
        else:mat.node_tree.links.new(texture.outputs['Color'],shader.inputs[socket])


for identity,builder in BUILDERS.items():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    mats=materials();root=builder(mats)
    bpy.context.view_layer.update()
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    for mesh in meshes:
        if 'texture_status' not in mesh:
            for layer in list(mesh.data.uv_layers):mesh.data.uv_layers.remove(layer)
            surface_uv(mesh)
    for mat in {m for obj in meshes for m in obj.data.materials if m}:surface_detail(mat)
    compact(root)
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    low,high=bounds(meshes);root.location.z-=low.z
    bpy.context.view_layer.update();low,high=bounds(meshes)
    bpy.ops.object.select_all(action='SELECT')
    output=Path('public/models',identity+'-referenced-v2.glb')
    bpy.ops.export_scene.gltf(filepath=str(output.resolve()),export_format='GLB',use_selection=True,use_active_scene=True,export_extras=True)
    report={'id':identity,'triangles':sum(sum(len(face.vertices)-2 for face in obj.data.polygons) for obj in meshes),
            'bounds':list(high-low),'meshCount':len(meshes),'status':'per-equipment photo-reference exterior; unmeasured geometry',
            'photoTexture':identity in {'k21','k216','chunmoo'},'notClaimed':['photogrammetry','manufacturer CAD','verified dimensions','finished photorealism']}
    (OUT/(identity+'-provenance.json')).write_text(json.dumps(report,indent=2),encoding='utf-8')
    studio((low+high)*.5,high-low,0);bpy.context.scene.cycles.samples=24
    render(OUT/(identity+'-after.png'))
    bpy.ops.wm.save_as_mainfile(filepath=str((OUT/(identity+'-referenced.blend')).resolve()))
