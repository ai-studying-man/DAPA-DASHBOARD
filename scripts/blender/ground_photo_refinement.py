"""K2/K9 exterior reconstruction against public photos; not a metrology scan."""
from __future__ import annotations
import json
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0, str(Path('scripts/blender').resolve()))
from exterior_parts import group, box, cylinder, loft, compact, running_gear, pivot
from photo_study import bounds, studio, render
from refine_environment_assets import surface_uv

OUT = Path('artifacts/3d/ground-photo-refinement')
OUT.mkdir(parents=True, exist_ok=True)


def material(name: str, color: tuple[float,float,float,float], roughness: float,
             metallic: float, image: bpy.types.Image | None = None) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = color
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metallic
    if image:
        node = mat.node_tree.nodes.new('ShaderNodeTexImage')
        node.image = image
        mat.node_tree.links.new(node.outputs['Color'], shader.inputs['Base Color'])
    return mat


def body_ring(y: float, low: float, high: float, bottom_width: float, top_width: float) -> list[tuple[float,float,float]]:
    return [(-bottom_width,y,low),(bottom_width,y,low),(top_width,y,high),(-top_width,y,high)]


def build_vehicle(identity: str) -> None:
    k9 = identity == 'k9'
    width = 3.4 if k9 else 3.6
    root = group(identity.upper()+'_Photo_Refinement')
    root['classification'] = 'public exterior reference reconstruction; visually estimated; not CAD'
    root['units'] = 'metres'
    root['reference'] = 'actual public equipment photos and manufacturer exterior material'
    image = bpy.data.images.load(str(Path('artifacts/3d/k2-surface-refinement/authored-camo.png').resolve()))
    image.scale(512,512)
    image.pack()
    armor = material('Camouflage paint',(.24,.27,.17,1),.8,.07,image)
    rubber = material('Rubber tires and pads',(.018,.022,.019,1),.95,0)
    steel = material('Track steel and fasteners',(.12,.14,.13,1),.66,.7)
    dark = material('Grille and openings',(.012,.016,.014,1),.87,.1)
    glass = material('Optical glass',(.025,.065,.07,1),.12,.2)
    hull, turret = group('Hull',root), group('Turret',root)
    running_gear(root,armor,rubber,steel,width)
    loft('Sloped hull shell',[
        body_ring(-3.7,.7,1.6,1.18,1.46),body_ring(-3.25,.42,1.64,1.22,1.47),
        body_ring(2.5,.42,1.6,1.22,1.47),body_ring(3.75,.95,1.27,1.15,1.5)],armor,hull)
    cylinder('Turret ring',(0,-.8 if k9 else -.2,1.67),1.05,.16,steel,hull)
    for side in (-1,1):
        for i in range(6):
            panel=box('Side skirt panel',(side*(width/2-.055),-2.9+i*1.05,1.35 if k9 else 1.28),(.09,1.025,.46 if k9 else .72),armor,hull,.012)
            for y in (-.35,.35):
                cylinder('Skirt fastener',(side*(width/2+.004),panel.location.y+y,panel.location.z+.14),.021,.018,steel,hull,'X',6)
        for y in (-3.25,3.28):
            box('Fender',(side*(width/2-.3),y,1.33),(.58,.75,.065),armor,hull,.02)
        cylinder('Headlight bezel',(side*1.15,3.27,1.43),.115,.12,steel,hull,'Y')
        cylinder('Headlight lens',(side*1.15,3.34,1.43),.085,.02,glass,hull,'Y')
        for i in range(17):
            box('Rear deck cooling grille',(side*.65,-2.6+i*.04,1.65),(.85,.02,.025),dark,hull)
        for i in range(7):
            cylinder('Stowed rods',(side*(width/2-.08),-1.45,1.48+i*.045),.019,2.55,armor,hull,'Y',12)
    if k9:
        loft('Tall rear turret',[
            body_ring(-3.15,1.78,2.83,1.3,1.17),body_ring(-2.85,1.74,2.91,1.44,1.26),
            body_ring(-.35,1.76,2.91,1.42,1.25),body_ring(.65,1.92,2.76,.89,.85)],armor,turret)
        for side in (-1,1):
            box('Turret access door',(side*1.405,-1.9,2.28),(.05,1.05,.78),armor,turret,.025)
            for y in (-2.3,-1.52):
                box('Door hinge',(side*1.45,y,2.27),(.09,.09,.25),steel,turret)
            box('Door handle',(side*1.46,-1.8,2.4),(.035,.18,.035),steel,turret)
        gun_z, gun_start, gun_end = 2.32,.3,8.25
    else:
        loft('K2 angular turret',[
            body_ring(-2.4,1.8,2.35,1.35,1.25),body_ring(-1.9,1.75,2.4,1.48,1.29),
            body_ring(.65,1.8,2.43,1.44,1.17),body_ring(1.35,1.89,2.27,.56,.49)],armor,turret)
        for side in (-1,1):
            cheek=loft('Wedge cheek',[
                body_ring(.1,1.83,2.35,.49,.39),body_ring(1.25,1.92,2.29,.49,.35)],armor,turret)
            cheek.location.x=side*.94
            cheek.rotation_euler.z=side*.15
            for i in range(3):
                box('Turret side module',(side*1.48,-1.95+i*.7,2.05),(.11,.66,.46),armor,turret,.015)
        gun_z, gun_start, gun_end = 2.12,1.0,7.05
    gun = group('Gun',turret)
    cylinder('Mantlet',(0,gun_start,gun_z),.29,.65,armor,gun,'Y',48)
    cylinder('Barrel',(0,(gun_start+gun_end)/2,gun_z),.112 if k9 else .097,gun_end-gun_start,armor,gun,'Y',48)
    cylinder('Fume extractor',(0,gun_start+2.15,gun_z),.19 if k9 else .16,.7,armor,gun,'Y',48)
    for i in range(5):
        cylinder('Thermal sleeve collar',(0,gun_start+.8+i*.84,gun_z),.122 if k9 else .106,.055,steel,gun,'Y')
    cylinder('Muzzle',(0,gun_end-.12,gun_z),.18 if k9 else .115,.38 if k9 else .18,steel,gun,'Y',48)
    cylinder('Muzzle opening',(0,gun_end+.075,gun_z),.11 if k9 else .085,.012,dark,gun,'Y',48)
    if k9:
        for i in range(7):
            cylinder('Muzzle brake rib',(0,gun_end-.27+i*.052,gun_z),.192,.022,steel,gun,'Y',48)
    roof=2.94 if k9 else 2.46
    for side in (-1,1):
        cylinder('Roof hatch',(side*.65,-1.2,roof),.31,.065,armor,turret)
        for i in range(5):
            box('Vision block',(side*.65-.22+i*.11,-.92,roof+.05),(.075,.055,.05),glass,turret)
        cylinder('Antenna',(side*.95,-2.05,roof+.35),.012,.7,steel,turret,'Z',12)
        for i in range(6 if not k9 else 3):
            cylinder('Smoke discharger',(side*1.38,(-.9 if k9 else .48)-i*.13,roof-.35),.048,.22,dark,turret,'X',16)
        for y in (-2.6,-2.05,-1.5):
            box('Stowage rail upright',(side*1.57,y,roof-.11),(.025,.025,.56),steel,turret)
        for z in (roof-.36,roof+.16):
            box('Stowage rail',(side*1.57,-2.05,z),(.025,1.2,.025),steel,turret)
    box('Sight housing',(.65,.05,roof+.16),(.32,.34,.3),armor,turret,.025)
    box('Sight lens',(.65,.226,roof+.16),(.23,.015,.18),glass,turret)
    bpy.context.view_layer.update()
    for item in list(bpy.context.scene.objects):
        if item.type=='MESH':
            surface_uv(item)
    compact(root)
    pivot(gun,(0,gun_start,gun_z))
    pivot(turret,(0,-.8 if k9 else -.2,1.7))
    bpy.context.view_layer.update()
    meshes=[item for item in bpy.context.scene.objects if item.type=='MESH']
    low,high=bounds(meshes)
    root.location.z-=low.z
    bpy.context.view_layer.update()
    low,high=bounds(meshes)
    bpy.ops.object.select_all(action='DESELECT')
    for item in bpy.context.scene.objects:
        item.select_set(True)
    target=Path('public/models',identity+'-photo-refined.glb')
    bpy.ops.export_scene.gltf(filepath=str(target.resolve()),export_format='GLB',use_selection=True,use_active_scene=True,export_extras=True)
    studio((low+high)*.5,high-low,0)
    bpy.context.scene.cycles.samples=24
    render(OUT/(identity+'-three-quarter.png'))
    camera=bpy.context.scene.camera
    center=(low+high)*.5
    camera.location=center+Vector((14,0,0))
    camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.ortho_scale=max(high-low)*1.15
    render(OUT/(identity+'-side.png'))
    (OUT/(identity+'-report.json')).write_text(json.dumps({'id':identity,'bounds':list(high-low),'referencePhoto':'public/media/equipment/k9.webp' if k9 else 'public/media/representatives/k2.jpg','materials':'authored PBR and camouflage; not photo scan','shapeVerification':'visual estimate, no calibrated multi-view or CAD','wheelCount':12,'trackShoes':208,'newGeometry':['hull loft','turret loft','mantlet and muzzle','wheel dishes and hubs','individual track shoes and connectors'],'units':'metres'},indent=2),encoding='utf-8')


def main() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    first=bpy.context.scene
    for index, identity in enumerate(('k2','k9')):
        # Blender names are global across scenes; free component names so each
        # exported GLB retains the inspection viewer's Hull/Turret/Gun contract.
        if index:
            for item in list(bpy.data.objects):
                item.name='Previous_'+item.name
        scene=first if index==0 else bpy.data.scenes.new(identity)
        scene.name=identity.upper()+'_Photo_Refinement'
        bpy.context.window.scene=scene
        build_vehicle(identity)
    bpy.context.window.scene=first
    bpy.ops.wm.save_as_mainfile(filepath=str((OUT/'source.blend').resolve()))


if __name__=='__main__':
    main()
