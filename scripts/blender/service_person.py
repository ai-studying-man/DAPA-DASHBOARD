import bpy
from pathlib import Path

# Blender bundled Python; original generic exhibition figure, no third-party mesh.
bpy.ops.wm.read_factory_settings(use_empty=True)
def material(name: str, color: tuple[float, float, float, float]) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    return mat
cloth = material('Exhibit olive cloth', (.19,.24,.13,1))
skin = material('Generic face', (.58,.39,.26,1))
boots = material('Boots', (.055,.065,.05,1))
def box(name: str, location: tuple[float,float,float], scale: tuple[float,float,float], mat: bpy.types.Material) -> None:
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    item = bpy.context.object
    item.name = name
    item.scale = scale
    item.data.materials.append(mat)
box('Torso', (0,0,1.2), (.48,.28,.62), cloth)
box('Vest', (0,-.17,1.22), (.4,.12,.43), boots)
for x in [-.14,.14]:
    box('Leg', (x,0,.49), (.19,.22,.73), cloth)
    box('Boot', (x,-.05,.08), (.21,.36,.16), boots)
for x in [-.34,.34]:
    box('Arm', (x,0,1.13), (.17,.22,.64), cloth)
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=.19, location=(0,0,1.73))
bpy.context.object.data.materials.append(skin)
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=.22, location=(0,0,1.84))
bpy.context.object.scale.z = .65
bpy.context.object.data.materials.append(cloth)
output = Path('public/models/service-person.glb').resolve()
bpy.ops.export_scene.gltf(filepath=str(output), export_format='GLB')
bpy.ops.wm.save_as_mainfile(filepath=str(Path('artifacts/3d/service-person.blend').resolve()))
