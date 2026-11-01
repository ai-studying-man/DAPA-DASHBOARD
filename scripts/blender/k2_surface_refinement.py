# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Still K2 exterior refinement candidate; no measured/CAD or photogrammetry claim."""
from pathlib import Path
import json
import math
import sys
import bpy
import numpy as np
from mathutils import Vector
sys.path.insert(0, str(Path('scripts/blender').resolve()))
from photo_study import bounds, studio, render

OUT = Path('artifacts/3d/k2-surface-refinement')
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(Path('public/models/k2-photo-study.glb').resolve()))
original = list(bpy.context.scene.objects)
meshes = [item for item in original if item.type == 'MESH']
bpy.context.view_layer.update()
low, high = bounds(meshes)
studio((low + high) * .5, high - low, low.z)
render(OUT / 'before.png')
# Re-import original categorical materials instead of trying to unwarp AI inventions.
for item in original:
    bpy.data.objects.remove(item, do_unlink=True)
bpy.ops.import_scene.gltf(filepath=str(Path('public/models/k2-exhibit.glb').resolve()))
parts = [item for item in bpy.context.scene.objects if item.type not in {'LIGHT', 'CAMERA'} and item.name != 'ComparisonFloor']
meshes = [item for item in parts if item.type == 'MESH']
bpy.context.view_layer.update()

# Shared, deterministic repeat texture. Colors are hand tuned against visible olive/sand
# regions in the photograph; patch topology is authored, not a real K2 camouflage scan.
size = 1024
yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
x, y = xx / size * math.tau, yy / size * math.tau
field = np.sin(x*2 + np.sin(y*3)*.9) + np.cos(y*2-x*.7) + .36*np.sin(x*5+y*4)
palette = np.array([[.105,.125,.072],[.245,.265,.16],[.39,.355,.245]], dtype=np.float32)
indices = np.where(field < -.55, 0, np.where(field > .7, 2, 1))
rng = np.random.default_rng(42)
noise = rng.normal(0,.008,(size,size,1)).astype(np.float32)
rgba = np.concatenate((np.clip(palette[indices]+noise,0,1),np.ones((size,size,1),dtype=np.float32)),axis=2)
image = bpy.data.images.new('Authored_camo_not_photo_scan',width=size,height=size)
image.pixels.foreach_set(rgba.ravel())
image.filepath_raw = str((OUT / 'authored-camo.png').resolve())
image.file_format = 'PNG'
image.save()
image.pack()

def material(name: str, color: tuple[float,float,float,float], roughness: float, metalness: float, textured: bool = False) -> bpy.types.Material:
    """Explicit material roles avoid painting steel/rubber with fake panel imagery."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = color
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metalness
    if textured:
        node = mat.node_tree.nodes.new('ShaderNodeTexImage')
        node.image = image
        node.extension = 'REPEAT'
        mat.node_tree.links.new(node.outputs['Color'],shader.inputs['Base Color'])
    return mat
armor = material('Painted armor | authored camouflage',(.22,.25,.14,1),.77,.12,True)
rubber = material('Rubber | roadwheel tires and track pads',(.025,.03,.025,1),.94,0)
steel = material('Weathered steel | tracks and bolts',(.11,.125,.12,1),.68,.72)
dark = material('Recesses and grille',(.028,.035,.027,1),.85,.12)
glass = material('Optical glass',(.035,.075,.065,1),.18,.25)

for item in meshes:
    index = int(item.name.split('_')[-1].split('.')[0])
    old = item.data.materials[0]
    shader = old.node_tree.nodes.get('Principled BSDF')
    color = shader.inputs['Base Color'].default_value
    rgb = list(color[:3])
    # Categorize based on the original material's physical role and visible component.
    if item.parent and item.parent.name.startswith('Wheel_'):
        offset = (index-6)%4 if index < 30 else (index-32)%4
        chosen = [rubber,armor,steel,dark][offset]
    elif index in {30,56}: chosen = steel
    elif index in {31,57}: chosen = rubber
    elif shader.inputs['Roughness'].default_value < .3: chosen = glass
    elif max(rgb) < .05: chosen = dark
    elif index in {2,5,59,60,65,67}: chosen = steel
    else: chosen = armor
    item.data.materials.clear()
    item.data.materials.append(chosen)
    for attribute in list(item.data.color_attributes):
        item.data.color_attributes.remove(attribute)
    # Face-normal projection creates repeatable color patches, not invented features.
    uv = item.data.uv_layers.new(name='SurfaceUV')
    world = item.matrix_world
    normal = world.to_3x3().inverted().transposed()
    for polygon in item.data.polygons:
        axis = max(range(3),key=lambda k: abs((normal @ polygon.normal)[k]))
        for loop_index in polygon.loop_indices:
            point = world @ item.data.vertices[item.data.loops[loop_index].vertex_index].co
            match axis:
                case 0: u,v = point.y,point.z
                case 1: u,v = point.x,point.z
                case 2: u,v = point.x,point.y
            uv.data[loop_index].uv = (u*.22,v*.22)
    # Weld duplicate triangle corners before beveling; original exporter split them.
    bpy.context.view_layer.objects.active = item
    item.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=.0001)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    bevel = item.modifiers.new('Physical edge highlights','BEVEL')
    bevel.width = .012 if index in {30,31,56,57} else .018
    bevel.segments = 2
    bevel.limit_method = 'ANGLE'
    bevel.angle_limit = .5
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    if item.parent and item.parent.name.startswith('Wheel_'):
        for polygon in item.data.polygons:
            polygon.use_smooth = abs(polygon.normal.x) < .95
    item.select_set(False)

# Raised rim fasteners add actual geometric highlights, not photographed bolt decals.
fasteners = 0
for parent in [item for item in parts if item.name.startswith('Wheel_')]:
    side = -1 if '_-1_' in parent.name else 1
    for j in range(8):
        angle = j*math.tau/8
        bpy.ops.mesh.primitive_cylinder_add(vertices=6,radius=.022,depth=.022)
        bolt = bpy.context.object
        bolt.name = f'RimFastener_{parent.name}_{j}'
        bolt.parent = parent
        bolt.location = (side*.25,math.sin(angle)*.18,math.cos(angle)*.18)
        # Imported Blender coordinates: axle is X, wheel face is YZ.
        bolt.rotation_euler.y = math.pi/2
        bolt.data.materials.append(steel)
        parts.append(bolt)
        fasteners += 1
for item in bpy.context.scene.objects:
    item.select_set(item in parts)
bpy.ops.export_scene.gltf(filepath=str(Path('public/models/k2-surface-refinement.glb').resolve()),export_format='GLB',use_selection=True,export_extras=True)
bpy.ops.wm.save_as_mainfile(filepath=str((OUT / 'source.blend').resolve()))
render(OUT / 'after.png')
report = {'blender':bpy.app.version_string,'source':'k2-exhibit.glb','comparisonBefore':'k2-photo-study.glb','addedRimFasteners':fasteners,'materialRoles':['painted armor','rubber','steel','recess','optical glass'],'texture':'authored camouflage repeat; not photo scan','geometryChanges':'weld split triangles; bevel exterior edges; raised wheel rim fasteners','photorealismVerified':False,'preciseSilhouetteVerified':False,'defaultPromoted':False}
(OUT/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
