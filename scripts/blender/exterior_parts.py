"""Exterior-only Blender modeling tools. Dimensions are visual estimates."""
from __future__ import annotations

import math
from collections import defaultdict
import bpy
from mathutils import Vector


def group(name: str, parent: bpy.types.Object | None = None) -> bpy.types.Object:
    item = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(item)
    item.parent = parent
    return item


def pivot(item: bpy.types.Object, position: tuple[float,float,float]) -> None:
    offset=Vector(position)
    for child in item.children:
        child.location-=offset
    item.location+=offset


def finish(item: bpy.types.Object, name: str, material: bpy.types.Material,
           parent: bpy.types.Object, edge: float = 0) -> bpy.types.Object:
    item.name, item.parent = name, parent
    item.data.materials.append(material)
    if edge > 0:
        bpy.context.view_layer.objects.active = item
        bevel = item.modifiers.new('Edge highlight', 'BEVEL')
        bevel.width, bevel.segments = edge, 2
        bpy.ops.object.modifier_apply(modifier=bevel.name)
    return item


def box(name: str, position: tuple[float, float, float], size: tuple[float, float, float],
        material: bpy.types.Material, parent: bpy.types.Object, edge: float = 0) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1, location=position)
    item = bpy.context.object
    item.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(item, name, material, parent, edge)


def cylinder(name: str, position: tuple[float, float, float], radius: float, depth: float,
             material: bpy.types.Material, parent: bpy.types.Object,
             axis: str = 'Z', vertices: int = 32) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=position)
    item = bpy.context.object
    match axis:
        case 'X': item.rotation_euler.y = math.pi / 2
        case 'Y': item.rotation_euler.x = math.pi / 2
        case 'Z': item.rotation_euler.z = 0
        case _: raise ValueError(axis)
    for face in item.data.polygons:
        face.use_smooth = len(face.vertices) == 4
    return finish(item, name, material, parent)


def loft(name: str, rings: list[list[tuple[float, float, float]]],
         material: bpy.types.Material, parent: bpy.types.Object) -> bpy.types.Object:
    count = len(rings[0])
    vertices = [p for ring in rings for p in ring]
    faces = [tuple(reversed(range(count))), tuple(range((len(rings)-1)*count, len(rings)*count))]
    for i in range(len(rings)-1):
        for j in range(count):
            k = (j+1) % count
            faces.append((i*count+j, i*count+k, (i+1)*count+k, (i+1)*count+j))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    item = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(item)
    return finish(item, name, material, parent, .016)


def wheel_dish(position: tuple[float,float,float], direction: int,
               material: bpy.types.Material, parent: bpy.types.Object) -> None:
    """Concentric recessed dish instead of a flat cylinder cap."""
    profile=((.07,.05),(.16,.04),(.27,-.018),(.36,-.01),(.4,.025),(.42,.03))
    vertices=[(position[0]+direction*depth,position[1]+math.sin(i*math.tau/48)*r,
               position[2]+math.cos(i*math.tau/48)*r) for r,depth in profile for i in range(48)]
    faces=[(ring*48+i,ring*48+(i+1)%48,(ring+1)*48+(i+1)%48,(ring+1)*48+i)
           for ring in range(len(profile)-1) for i in range(48)]
    mesh=bpy.data.meshes.new('Recessed wheel dish')
    mesh.from_pydata(vertices,[],faces)
    for face in mesh.polygons:
        face.use_smooth=True
    item=bpy.data.objects.new('Recessed wheel dish',mesh)
    bpy.context.collection.objects.link(item)
    finish(item,item.name,material,parent)


def compact(parent: bpy.types.Object) -> None:
    """Merge static material batches while keeping component and wheel pivots."""
    for child in list(parent.children):
        if child.type == 'EMPTY':
            compact(child)
    buckets = defaultdict(list)
    for child in list(parent.children):
        if child.type == 'MESH':
            buckets[child.data.materials[0]].append(child)
    for material, items in buckets.items():
        bpy.ops.object.select_all(action='DESELECT')
        for item in items:
            item.select_set(True)
        bpy.context.view_layer.objects.active = items[0]
        bpy.ops.object.join()
        items[0].name = parent.name + '_' + material.name


def running_gear(root: bpy.types.Object, armor: bpy.types.Material,
                 rubber: bpy.types.Material, steel: bpy.types.Material, width: float) -> None:
    gear = group('RunningGear', root)
    for side in (-1, 1):
        track = group('Track_L' if side < 0 else 'Track_R', gear)
        x = side * (width/2-.29)
        for i in range(6):
            y = -2.35 + i*.94
            wheel = group(f'RoadWheel_{side}_{i+1}', track)
            wheel['visible_reference'] = 'six road wheels per side; sizes visually estimated'
            cylinder('Tire', (x,y,.61), .475, .43, rubber, wheel, 'X', 48)
            for offset in (-.19, .19):
                wheel_dish((x+offset,y,.61),1 if offset>0 else -1,armor,wheel)
                cylinder('Hub flange', (x+offset*1.2,y,.61), .18, .035, armor, wheel, 'X')
            cylinder('Grease cap', (x+side*.26,y,.61), .092, .035, steel, wheel, 'X')
            for j in range(10):
                a = j*math.tau/10
                cylinder('Hub bolt', (x+side*.245,y+math.sin(a)*.27,.61+math.cos(a)*.27), .021, .02, steel, wheel, 'X', 6)
            pivot(wheel,(x,y,.61))
        for y in (-3.0, 3.0):
            cylinder('End wheel', (x,y,.73), .47, .42, steel, track, 'X', 40)
            cylinder('End wheel inset', (x+side*.23,y,.73), .32, .025, armor, track, 'X')
            for j in range(14):
                a=j*math.tau/14
                box('Sprocket tooth', (x,y+math.sin(a)*.47,.73+math.cos(a)*.47), (.4,.075,.075), steel, track)
        straight, arc = 6., math.pi*.65
        for j in range(104):
            d = j/104*(straight*2+arc*2)
            if d < straight: y,z,a = -3+d,1.38,0
            elif d < straight+arc:
                a=(d-straight)/.65; y,z=3+math.sin(a)*.65,.73+math.cos(a)*.65
            elif d < straight*2+arc: y,z,a=3-(d-straight-arc),.08,math.pi
            else:
                a=math.pi+(d-straight*2-arc)/.65; y,z=-3+math.sin(a)*.65,.73+math.cos(a)*.65
            shoe=box('Track shoe', (x,y,z), (.58,.143,.065), steel, track)
            shoe.rotation_euler.x=-a
            pad=box('Rubber pad', (x,y+math.sin(a)*.044,z+math.cos(a)*.044), (.34,.09,.035), rubber, track)
            pad.rotation_euler.x=-a
            for offset in (-.25,.25):
                pin=box('Track end connector', (x+offset,y,z), (.06,.12,.10), steel, track)
                pin.rotation_euler.x=-a
