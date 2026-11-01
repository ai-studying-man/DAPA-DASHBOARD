"""Exterior-only category silhouettes for the 21-item exhibition MVP."""
from __future__ import annotations
import math
import bpy
from mathutils import Vector
from exterior_parts import group, box, cylinder, loft


def ellipsoid(name: str, position: tuple[float,float,float], size: tuple[float,float,float],
              mat: bpy.types.Material, parent: bpy.types.Object) -> None:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, location=position)
    item=bpy.context.object
    item.name,item.scale,item.parent=name,size,parent
    item.data.materials.append(mat)
    for face in item.data.polygons:
        face.use_smooth=True


def panel(name: str, points: list[tuple[float,float,float]], mat: bpy.types.Material,
          parent: bpy.types.Object) -> bpy.types.Object:
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(points,[],[tuple(range(len(points)))])
    item=bpy.data.objects.new(name,mesh)
    bpy.context.collection.objects.link(item)
    item.parent=parent
    item.data.materials.append(mat)
    return item


def rotor(parent: bpy.types.Object, radius: float, height: float, blades: int,
          steel: bpy.types.Material) -> None:
    pivot=group('MainRotor',parent)
    cylinder('Mast',(0,0,height-.2),.09,.6,steel,pivot)
    for i in range(blades):
        angle=i*math.tau/blades
        blade=box('Rotor blade',(math.sin(angle)*radius/2,math.cos(angle)*radius/2,height),(.2,radius,.035),steel,pivot)
        blade.rotation_euler.z=-angle


def helicopter(identity: str, root: bpy.types.Object, paint: bpy.types.Material,
               glass: bpy.types.Material, steel: bpy.types.Material, rubber: bpy.types.Material) -> None:
    light=identity=='500md'
    attack=identity in {'ah1s','ah64e'}
    length=4.2 if light else 6.4 if attack else 8.4
    width=.7 if light else .65 if attack else 1.25
    hull=group('Hull',root)
    ellipsoid('Fuselage',(0,0,1.9),(width,length*.34,1.05),paint,hull)
    ellipsoid('Canopy',(0,length*.21,2.05),(width*.95,length*.2,.8),glass,hull)
    box('Lower fuselage',(0,-.2,1.3),(width*1.6,length*.58,.6),paint,hull)
    tail=group('Tail',root)
    boom=cylinder('Tail boom',(0,-length*.67,2.1),.22,length*.7,paint,tail,'Y')
    boom.rotation_euler.x=math.pi/2-.08
    panel('Tail fin',[(0,-length*.96,2),(0,-length*1.05,3.6),(0,-length*.8,3.2)],paint,tail)
    box('Tailplane',(0,-length*.85,2.3),(width*3.8,.6,.06),paint,tail)
    cylinder('Tail rotor hub',(.2,-length*.96,2.7),.13,.4,steel,tail,'X')
    for a in (0,math.pi/2):
        blade=box('Tail rotor',(.43,-length*.96,2.7),(.04,1.6,.12),steel,tail)
        blade.rotation_euler.x=a
    rotor(root,3.9 if light else 6.6,3.15 if light else 3.7,2 if identity=='ah1s' else 4,steel)
    gear=group('RunningGear',root)
    for side in (-1,1):
        if identity in {'500md','ah1s'}:
            cylinder('Skid',(side*.95,0,.25),.055,length*.7,steel,gear,'Y')
            for y in (-.8,.8):cylinder('Skid strut',(side*.8,y,.7),.04,.9,steel,gear)
        else:
            for y in (-1.5,1.2):
                cylinder('Strut',(side*1.1,y,.9),.05,1,steel,gear)
                cylinder('Wheel',(side*1.1,y,.4),.3,.2,rubber,gear,'X')
        if attack:
            box('Stub wing',(side*1.3,-.5,1.8),(1.5,.65,.1),paint,hull)
        if not light:
            cylinder('Engine housing',(side*.8,-1.3,2.9),.35,1.8,paint,hull,'Y')
    if identity=='ah64e':cylinder('Mast radome',(0,0,4.05),.6,.35,paint,root)


def jet(identity: str, root: bpy.types.Object, paint: bpy.types.Material,
        glass: bpy.types.Material, steel: bpy.types.Material, rubber: bpy.types.Material) -> None:
    hull=group('Hull',root)
    stealth=identity=='f117'
    length=18 if identity=='f22' else 16
    radius=1.05 if stealth else .75
    loft('Fuselage',[[(-w,y,z),(w,y,z),(w*.65,y,z+h),(-w*.65,y,z+h)] for y,w,z,h in [(-length/2,.85,1.1,.8),(-length*.2,radius,1,1.15),(length*.23,.7,1,.95),(length/2,.035,1.3,.08)]],paint,hull)
    ellipsoid('Canopy',(0,length*.15,2.05),(.5,1.65,.42),glass,hull)
    for side in (-1,1):
        panel('Swept wing',[(side*.6,2,1.55),(side*6,-3.6,1.45),(side*5,-5.2,1.45),(side*.5,-3.6,1.55)],paint,hull)
        panel('Tailplane',[(side*.6,-5,1.7),(side*3.7,-7.2,1.6),(side*3.1,-8,1.6),(side*.6,-7.5,1.7)],paint,hull)
        panel('Canted tail',[(side*.8,-5.3,1.7),(side*1.8,-6,4),(side*2,-8,3.8),(side*.85,-7.8,1.7)],paint,hull)
        cylinder('Exhaust',(side*.45,-length/2,1.45),.36,.8,steel,hull,'Y')
        box('Intake',(side*.9,.7,1.35),(.55,1.3,.65),steel,hull)
    gear=group('RunningGear',root)
    for x,y in ((-.9,-1.8),(.9,-1.8),(0,4)):
        cylinder('Gear strut',(x,y,.65),.045,.8,steel,gear)
        cylinder('Landing tire',(x,y,.23),.23,.16,rubber,gear,'X')


def ground(identity: str, root: bpy.types.Object, paint: bpy.types.Material,
           glass: bpy.types.Material, steel: bpy.types.Material, rubber: bpy.types.Material) -> None:
    hull,gear=group('Hull',root),group('RunningGear',root)
    tracked=identity in {'k1arv','k21','k216','k242'}
    truck=identity in {'k10cbrn','km9'}
    length,width=(7.1,3.15) if tracked else (7.5,2.5) if truck else (4.9,2.15)
    box('Lower hull',(0,0,.95),(width*.88,length,.65),paint,hull,.06)
    if tracked:
        loft('Upper hull',[[(-width*.46,y,.9),(width*.46,y,.9),(width*.38,y,z),(-width*.38,y,z)] for y,z in [(-length/2,1.9),(length*.3,1.9),(length/2,1.3)]],paint,hull)
        for side in (-1,1):
            x=side*(width/2-.2)
            box('Track belt',(x,0,.64),(.45,length,.97),rubber,gear,.12)
            for i in range(6):
                y=-length*.35+i*length*.14
                cylinder('Road wheel',(x+side*.24,y,.6),.43,.08,paint,gear,'X')
                cylinder('Wheel hub',(x+side*.3,y,.6),.12,.04,steel,gear,'X')
            for i in range(28):
                for z in (.14,1.13):box('Track shoe',(x,-length/2+i*length/27,z),(.5,.16,.06),steel,gear)
        if identity=='k21':
            turret=group('Turret',root);box('Turret',(0,-.3,2.1),(1.65,2.1,.8),paint,turret,.12)
            cylinder('Exterior barrel',(0,2,2.25),.065,3.2,steel,turret,'Y')
        elif identity=='k1arv':
            crane=group('RecoveryCrane',root);cylinder('Crane pivot',(-.8,-1.3,2.1),.3,.6,steel,crane)
            box('Stowed recovery boom',(-.8,-.1,2.6),(.35,3.7,.35),paint,crane)
            box('Recovery blade',(0,3.7,.65),(3,.18,.9),paint,hull)
        elif identity=='k242':
            cylinder('External mortar tube',(0,-.6,2.2),.12,1.5,steel,hull)
        else:
            for x in (-.7,.7):box('Sensor housing',(x,-.7,2.15),(.45,.7,.6),paint,hull)
    else:
        for side in (-1,1):
            for y in ((-2.5,-1.2,2.3) if truck else (-1.55,1.55)):
                cylinder('Tire',(side*width/2,y,.62),.54 if truck else .44,.25,rubber,gear,'X')
                cylinder('Wheel rim',(side*(width/2+.14),y,.62),.31,.03,steel,gear,'X')
        box('Cabin',(0,length*.24,1.95),(width*.9,2.15,1.6),paint,hull,.1)
        box('Windshield',(0,length*.24+1.09,2.18),(width*.75,.035,.65),glass,hull)
        for side in (-1,1):box('Side window',(side*width*.46,length*.24,2.2),(.025,1.25,.55),glass,hull)
        if truck:
            cylinder('Tank',(0,-1.15,1.9),.85,3.6,paint,hull,'Y')
            box('Rear equipment rack',(0,-3,1.4),(2,.5,.8),steel,hull)
        else:
            box('Engine bonnet',(0,2,1.45),(1.9,1,.3),paint,hull)
            if identity in {'k151at','k332'}:
                box('Rear mission cabin',(0,-1.15,1.95),(width*.9,2.7,1.45),paint,hull,.06)
            if identity=='k151at':
                cylinder('Roof mounting pedestal',(0,-.5,2.76),.17,.4,steel,hull)
                box('Exterior launcher housing',(0,-.5,3.0),(.5,1.2,.35),paint,hull)
            if identity=='k332':box('Sensor pod',(0,-.4,2.85),(.7,.9,.5),paint,hull)


def mortar(root: bpy.types.Object, paint: bpy.types.Material, steel: bpy.types.Material) -> None:
    hull=group('Hull',root)
    cylinder('Baseplate',(0,0,.05),.35,.08,paint,hull)
    tube=cylinder('Exterior tube',(0,.2,.75),.055,1.35,paint,hull)
    tube.rotation_euler.x=-.35
    collar=cylinder('Shared bipod collar',(0,.24,.86),.095,.14,steel,hull)
    collar.rotation_euler.x=-.35
    for side in (-1,1):
        top,foot=Vector((side*.07,.24,.86)),Vector((side*.48,.85,.05))
        vector=top-foot
        leg=cylinder('Connected support leg',tuple((top+foot)*.5),.025,vector.length,steel,hull)
        leg.rotation_mode='QUATERNION'
        leg.rotation_quaternion=vector.to_track_quat('Z','Y')
