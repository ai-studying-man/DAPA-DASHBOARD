"""Photo-colour-informed surface treatment, not photogrammetric reconstruction."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import bpy
import numpy as np
from mathutils import Vector

sys.path.insert(0, str(Path('scripts/blender').resolve()))
from photo_study import bounds, studio, render
from exterior_parts import box, cylinder
from refine_environment_assets import surface_uv

OUT = Path('artifacts/3d/photo-pbr')
OUT.mkdir(parents=True, exist_ok=True)
SIZE = 1024


def image_array(path: Path) -> np.ndarray:
    """Read actual source pixels with Blender, retaining the original file."""
    image = bpy.data.images.load(str(path.resolve()), check_existing=True)
    return np.asarray(image.pixels[:], dtype=np.float32).reshape(image.size[1], image.size[0], 4)


def noise(seed: int, cells: int) -> np.ndarray:
    """Periodic bilinear fields avoid hard texture seams in repeated UVs."""
    rng = np.random.default_rng(seed)
    coarse = rng.random((cells, cells)).astype(np.float32)
    point = np.arange(SIZE, dtype=np.float32) * cells / SIZE
    index = point.astype(int)
    fraction = point - index
    fraction = fraction * fraction * (3 - 2 * fraction)
    x, y = np.meshgrid(index, index)
    fx, fy = np.meshgrid(fraction, fraction)
    return (coarse[y, x]*(1-fx)*(1-fy) + coarse[y, (x+1)%cells]*fx*(1-fy)
            + coarse[(y+1)%cells, x]*(1-fx)*fy + coarse[(y+1)%cells, (x+1)%cells]*fx*fy)


def texture(name: str, rgb: np.ndarray, color: bool) -> bpy.types.Image:
    image = bpy.data.images.new(name, SIZE, SIZE, alpha=True)
    image.colorspace_settings.name = 'sRGB' if color else 'Non-Color'
    rgba = np.ones((SIZE, SIZE, 4), dtype=np.float32)
    rgba[:, :, :3] = rgb
    image.pixels.foreach_set(rgba.ravel())
    image.filepath_raw = str((OUT / (name+'.png')).resolve())
    image.file_format = 'PNG'
    image.save()
    image.pack()
    return image


def maps(identity: str) -> tuple[bpy.types.Image, bpy.types.Image, bpy.types.Image]:
    """Sample explicit paint regions, not background vegetation or sky."""
    path = Path('public/media/equipment/k9.webp') if identity == 'k9' else Path('public/media/representatives/k2.jpg')
    photo = image_array(path)
    # Image coordinates are normalized top-left coordinates inspected against actual photos.
    samples = ((.70,.43),(.79,.40),(.84,.48),(.84,.60)) if identity == 'k9' else ((.42,.57),(.50,.60),(.58,.61),(.66,.57))
    palette = []
    for u,v in samples:
        x, y = int(u*photo.shape[1]), int((1-v)*photo.shape[0])
        color = np.median(photo[max(0,y-5):y+5,max(0,x-5):x+5,:3],axis=(0,1))
        palette.append(color)
    palette = np.clip(np.asarray(palette), .045, .66)
    palette = palette[np.argsort(palette.mean(axis=1))]
    paint_targets=np.array([[.10,.12,.08],[.24,.28,.19],[.30,.25,.16],[.48,.44,.31]])
    palette=palette*.25+paint_targets*.75
    # Separate dark/brown/green/tan paints while keeping photo-derived luminance.
    palette[0] *= .65
    field = noise(4,8)*.8 + noise(5,21)*.2
    indices = np.digitize(field, [.33,.49,.64])
    grain = noise(12,180)-.5
    dirt = noise(22,43)
    rgb = np.clip(palette[indices]*(1+grain[:,:,None]*.12),0,1)
    rgb = rgb*(1-dirt[:,:,None]*.08)+np.array([.29,.25,.17])*dirt[:,:,None]*.08
    rough = np.clip(.68+noise(13,31)*.2+grain*.05,.55,.94)
    height = noise(12,180)*.35 + noise(20,512)*.05
    dy,dx = np.gradient(height)
    normal = np.stack((-dx*2,-dy*2,np.ones_like(dx)),axis=-1)
    normal /= np.linalg.norm(normal,axis=-1,keepdims=True)
    report = {'id':identity,'photo':str(path),'samplePoints':samples,'sampledPalette':palette.tolist(),
              'method':'photo colour samples + authored camouflage/noise PBR; no image projection or photogrammetry',
              'geometry':'existing photo-informed exterior retained; bevel detail only', 'resolution':SIZE,'colourBlend':'25% sampled photo palette, 75% authored paint targets; not scanned texture'}
    (OUT/(identity+'-provenance.json')).write_text(json.dumps(report,indent=2),encoding='utf-8')
    return (texture(identity+'-paint',rgb,True),texture(identity+'-roughness',np.repeat(rough[:,:,None],3,axis=2),False),
            texture(identity+'-normal',normal*.5+.5,False))


def treat(material: bpy.types.Material, images: tuple[bpy.types.Image,bpy.types.Image,bpy.types.Image]) -> None:
    shader = material.node_tree.nodes.get('Principled BSDF')
    name = material.name.lower()
    if 'optical' in name:
        shader.inputs['Roughness'].default_value = .13
        shader.inputs['Metallic'].default_value = .25
        return
    for socket in ('Base Color','Roughness','Normal'):
        for link in list(shader.inputs[socket].links):
            material.node_tree.links.remove(link)
    paint = 'camouflage' in name
    shader.inputs['Metallic'].default_value = .04 if paint else .65 if 'steel' in name else 0
    shader.inputs['Roughness'].default_value = .8 if paint else .63 if 'steel' in name else .94
    if paint:
        color = material.node_tree.nodes.new('ShaderNodeTexImage');color.image=images[0]
        material.node_tree.links.new(color.outputs['Color'],shader.inputs['Base Color'])
    rough = material.node_tree.nodes.new('ShaderNodeTexImage');rough.image=images[1]
    material.node_tree.links.new(rough.outputs['Color'],shader.inputs['Roughness'])
    normal = material.node_tree.nodes.new('ShaderNodeTexImage');normal.image=images[2]
    mapping = material.node_tree.nodes.new('ShaderNodeNormalMap')
    mapping.inputs['Strength'].default_value = .38 if paint else .2
    material.node_tree.links.new(normal.outputs['Color'],mapping.inputs['Color'])
    material.node_tree.links.new(mapping.outputs['Normal'],shader.inputs['Normal'])
    if paint:
        tint=material.node_tree.nodes.new('ShaderNodeVertexColor');tint.layer_name='ExteriorSoil'
        mix=material.node_tree.nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1
        links=list(shader.inputs['Base Color'].links)
        if links:
            material.node_tree.links.new(links[0].from_socket,mix.inputs[1])
        else:
            mix.inputs[1].default_value=shader.inputs['Base Color'].default_value
        material.node_tree.links.new(tint.outputs['Color'],mix.inputs[2])
        material.node_tree.links.new(mix.outputs['Color'],shader.inputs['Base Color'])
    material['reference_status']='photo-colour-informed authored PBR, not scanned material'


def build(identity: str) -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(Path('public/models',identity+'-photo-refined.glb').resolve()))
    meshes = [item for item in bpy.context.scene.objects if item.type=='MESH']
    low,high = bounds(meshes)
    images = maps(identity)
    hull=bpy.data.objects.get('Hull')
    armor=next(m for m in bpy.data.materials if 'Camouflage' in m.name)
    steel=next(m for m in bpy.data.materials if 'Track steel' in m.name)
    dark=next(m for m in bpy.data.materials if 'Grille' in m.name)
    if hull:
        # External panel seams and fastener highlights estimated from the photo; not CAD.
        for side in (-1,1):
            box('Front deck inspection plate',(side*.64,2.38,1.625),(.78,.65,.018),armor,hull,.008)
            for x in (-.31,.31):
                for y in (-.24,.24):
                    cylinder('Deck fastener',(side*.64+x,2.38+y,1.644),.018,.012,steel,hull,vertices=8)
            for i in range(8):
                box('Engine deck slotted cover',(side*.60,-2.16+i*.055,1.664),(.68,.024,.012),dark,hull)
        bpy.context.view_layer.update()
        meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    for material in {m for mesh in meshes for m in mesh.data.materials if m}:
        treat(material,images)
    for mesh in meshes:
        for layer in list(mesh.data.uv_layers):
            mesh.data.uv_layers.remove(layer)
        surface_uv(mesh)
        # Bevel only large exterior batches; preserve running gear and component pivots.
        if ('Hull_' in mesh.name or 'Turret_' in mesh.name) and len(mesh.data.polygons)<15000:
            bpy.context.view_layer.objects.active=mesh
            bevel=mesh.modifiers.new('Physical edge glints','BEVEL')
            bevel.width=.003;bevel.segments=2;bevel.limit_method='ANGLE';bevel.angle_limit=.7
            bpy.ops.object.modifier_apply(modifier=bevel.name)
        # Vertex tint gives lower exterior a light accumulated soil layer; it is authored, not scanned.
        colors=mesh.data.color_attributes.new(name='ExteriorSoil',type='FLOAT_COLOR',domain='POINT')
        for vertex,color in zip(mesh.data.vertices,colors.data):
            z=(mesh.matrix_world @ vertex.co).z
            dust=max(0.,min(.24,(1.2-z)*.18))
            color.color=(1-dust*.12,1-dust*.2,1-dust*.36,1)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=str(Path('public/models',identity+'-photo-pbr.glb').resolve()),export_format='GLB',
                              use_selection=True,use_active_scene=True,export_extras=True,
                              export_vertex_color='ACTIVE',export_all_vertex_colors=True,export_active_vertex_color_when_no_material=True)
    studio((low+high)*.5,high-low,low.z)
    bpy.context.scene.cycles.samples=32
    bpy.context.scene.render.resolution_x=1200;bpy.context.scene.render.resolution_y=800
    render(OUT/(identity+'-after.png'))
    bpy.ops.wm.save_as_mainfile(filepath=str((OUT/(identity+'.blend')).resolve()))


if __name__=='__main__':
    for vehicle in ('k2','k9'):
        build(vehicle)
