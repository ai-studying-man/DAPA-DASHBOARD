# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# How to run: imported by blender/fleet/build.py inside Blender.
"""Public-exterior study meshes for the twelve previously missing systems."""
from __future__ import annotations

import math
import random
from dataclasses import dataclass

import bpy
from exterior_parts import box, cylinder, group, loft
from mvp_shapes import ellipsoid, panel


@dataclass(frozen=True, slots=True)
class Palette:
    paint: bpy.types.Material
    glass: bpy.types.Material
    steel: bpy.types.Material
    rubber: bpy.types.Material
    solar: bpy.types.Material


def blanket(size, side, column, crosswise, foil, hull):
    """Triangulated quilt with puckered fasteners and diagonal fold ridges."""
    rng = random.Random(120 + 3*side + column + 100*crosswise)
    vertices, faces = [], []
    nx, nz = 12, 24
    width = .238 if crosswise else .30
    depth = .507 if crosswise else .407
    for j in range(nz+1):
        for i in range(nx+1):
            u, v = i/nx, j/nz
            if 0 < i < nx:
                u += rng.uniform(-.26,.26)/nx
            if 0 < j < nz:
                v += rng.uniform(-.26,.26)/nz
            tension = (math.sin(math.pi*u)*math.sin(math.pi*v))**.54
            fold = abs(math.sin(8*u+12*v+1.7*math.sin(6*v+column)))
            relief = tension*(.006+.025*fold**8+.005*rng.random())
            along = (column-1)*(width+.012)+(u-.5)*width
            outward = side*(depth+relief)
            x,y = (outward,along) if crosswise else (along,outward)
            vertices.append((size*x,size*y,size*(.055+.89*v)))
            if i and j:
                d = j*(nx+1)+i
                a,b,c = d-nx-2,d-nx-1,d-1
                triangles = [(a,b,d),(a,d,c)] if rng.random()<.5 else [(a,b,c),(b,d,c)]
                faces.extend(tri if (side<0) != crosswise else tri[::-1] for tri in triangles)
    mesh = bpy.data.meshes.new("Pinched thermal foil")
    mesh.from_pydata(vertices, [], faces)
    obj = bpy.data.objects.new("Quilted insulation", mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = hull
    mesh.materials.append(foil)


def satellite(identity: str, m: Palette) -> bpy.types.Object:
    """Distinct public concept exteriors; never an undisclosed flight configuration."""
    root = group(identity + "_ExteriorStudy")
    hull, arrays, antenna = group("Hull", root), group("SolarPanels", root), group("Antenna", root)
    small = identity == "smallsat"
    size = .7 if small else 2.5 if identity == "425" else 3.2
    box("External bus", (0, 0, size / 2), (size, size * .8, size), m.paint, hull, .025)
    if identity in {"425", "smallsat"}:
        foil = m.steel.copy()
        foil.name = "Aluminized thermal blanket"
        shader = foil.node_tree.nodes.get("Principled BSDF")
        shader.inputs["Base Color"].default_value = (.64, .34, .065, 1)
        shader.inputs["Roughness"].default_value = .36
        for side in (-1, 1):
            for column in range(3):
                blanket(size, side, column, False, foil, hull)
                blanket(size, side, column, True, foil, hull)
            box("Array hinge", (side * size * .54, 0, size * .55),
                (size * .16, size * .12, size * .08), m.steel, arrays)
        for x in (-.48, .48):
            for y in (-.38, .38):
                cylinder("Corner rail", (x*size, y*size, size*.5), size*.023, size, m.steel, hull)
    for side in (-1, 1):
        for j in range(2 if small else 3):
            x = side * (size * .7 + j * size * .8)
            box("Panel frame", (x, 0, size * .55), (size * .75, size * .9, .06), m.steel, arrays)
            box("Solar cell face", (x, 0, size * .55 + .04), (size * .7, size * .85, .012), m.solar, arrays)
            for row in range(8):
                box("Cell division", (x, size * (-.37 + row * .105), size * .55 + .05), (size * .7, .008, .003), m.steel, arrays)
    if identity == "anasis":
        for side in (-1, 1):
            cylinder("Public antenna dish", (side * size * .65, 0, size * .9), size * .35, .1, m.glass, antenna, "X", 48)
    elif identity == "425":
        cylinder("Concept sensor aperture", (0, 0, size * 1.1), size * .34, size * .25, m.glass, antenna, vertices=48)
    else:
        cylinder("Concept instrument housing", (0, 0, size * 1.1), .13, .25, m.glass, antenna)
    root["identity_limit"] = "Public program concept; not a specific satellite serial, measured layout or hidden sensor design"
    return root


def vehicle(identity: str, m: Palette) -> bpy.types.Object:
    """Separate K10 resupply, K808 eight-wheel, Redback and closed launcher studies."""
    root = group(identity + "_ExteriorStudy")
    hull, gear = group("Hull", root), group("RunningGear", root)
    wheeled = identity in {"k808", "cheongung"}
    length, width = (9.4, 2.8) if identity == "cheongung" else (7.4, 2.8) if wheeled else (7.5, 3.4)
    box("Lower hull", (0, 0, 1), (width * .87, length, .8), m.paint, hull, .08)
    if wheeled:
        for side in (-1, 1):
            for index, y in enumerate((-length * .34, -length * .13, length * .13, length * .34)):
                wheel = group(f"Wheel_{side}_{index}", gear)
                wheel.location = (side * width * .45, y, .62)
                cylinder("Tire", (0, 0, 0), .59, .35, m.rubber, wheel, "X", 40)
                cylinder("Wheel rim", (side * .19, 0, 0), .33, .035, m.steel, wheel, "X", 32)
    else:
        for side in (-1, 1):
            track = group("Track_L" if side < 0 else "Track_R", gear)
            x = side * width * .43
            box("Track belt", (x, 0, .65), (.55, length * .96, 1.05), m.rubber, track, .12)
            count = 7 if identity == "redback" else 6
            for j in range(count):
                wheel = group(f"Wheel_{side}_{j}", track)
                wheel.location = (x + side * .25, -length * .37 + j * length * .74 / (count - 1), .61)
                cylinder("Road wheel", (0, 0, 0), .43, .08, m.paint, wheel, "X", 32)
                cylinder("Hub", (side * .05, 0, 0), .13, .03, m.steel, wheel, "X")
            for j in range(44):
                for z in (.15, 1.17):
                    box("Track shoe", (x, -length * .46 + j * length * .92 / 43, z), (.58, .13, .035), m.steel, track)
    if identity == "cheongung":
        box("Cab", (0, length * .32, 2), (2.6, 2.3, 1.9), m.paint, hull, .08)
        box("Windshield", (0, length * .32 + 1.17, 2.35), (2.1, .04, .65), m.glass, hull)
        launcher = group("Payload", root)
        for x in (-.57, .57):
            for y in (-1, .2):
                box("Closed exterior canister", (x, y, 3.6), (.95, .95, 4.3), m.paint, launcher, .035)
        return root
    loft("Upper hull", [[(-width * .44, y, 1.2), (width * .44, y, 1.2), (width * .35, y, z), (-width * .35, y, z)] for y, z in [(-length / 2, 2), (length * .27, 2.3), (length / 2, 1.5)]], m.paint, hull)
    if identity == "k10":
        box("Closed resupply superstructure", (0, -.7, 2.4), (2.7, 4.2, 1.9), m.paint, hull, .08)
        box("Stowed exterior conveyor", (0, 2.1, 2.8), (.65, 2.2, .5), m.steel, hull)
    if identity == "redback":
        turret = group("Turret", root)
        turret.location = (0, -.3, 2.25)
        box("Turret exterior", (0, 0, .35), (2, 2.5, .8), m.paint, turret, .1)
        gun = group("Gun", turret)
        gun.location = (0, 1.1, .5)
        cylinder("Closed barrel exterior", (0, 1.15, 0), .065, 2.3, m.steel, gun, "Y")
    for side in (-1, 1):
        cylinder("Roof hatch", (side * .6, .8, 2.35), .32, .08, m.steel, hull)
    return root


def aircraft(identity: str, m: Palette) -> bpy.types.Object:
    """Distinct conventional trainer and long-wing pusher-UAV external proportions."""
    root = group(identity + "_ExteriorStudy")
    hull, wings, tail = group("Hull", root), group("Wings", root), group("Tail", root)
    length, span = (13, 25) if identity == "muav" else (10.3, 10.6) if identity == "kt1" else (13.1, 9.45)
    ellipsoid("Fuselage", (0, 0, 1.7), (.65, length / 2, .7), m.paint, hull)
    ellipsoid("Canopy or sensor cover", (0, length * .24, 2.15), (.47, length * .12, .45), m.glass, hull)
    for side in (-1, 1):
        panel("Wing", [(side * .45, length * .08, 1.8), (side * span / 2, -length * .07, 1.8), (side * span / 2, -length * .18, 1.8), (side * .45, -length * .23, 1.8)], m.paint, wings)
        panel("Tailplane", [(side * .3, -length * .32, 1.9), (side * span * .17, -length * .44, 1.9), (side * span * .15, -length * .49, 1.9), (side * .3, -length * .46, 1.9)], m.paint, tail)
    panel("Vertical tail", [(0, -length * .29, 1.9), (0, -length * .43, 4), (0, -length * .5, 3.8), (0, -length * .49, 1.9)], m.paint, tail)
    if identity in {"muav", "kt1"}:
        prop = group("Propeller", root)
        prop.location = (0, -length * .5 if identity == "muav" else length * .5, 1.7)
        cylinder("Hub", (0, 0, 0), .18, .2, m.steel, prop, "Y")
        for j in range(4):
            angle = j * math.tau / 4
            blade = box("Propeller blade", (math.sin(angle) * .6, 0, math.cos(angle) * .6), (.16, .05, 1.2), m.rubber, prop)
            blade.rotation_euler.y = angle
    else:
        cylinder("Single exhaust", (0, -length * .49, 1.7), .45, .4, m.steel, hull, "Y", 40)
    gear = group("RunningGear", root)
    for x, y in ((-.9, -1.2), (.9, -1.2), (0, length * .27)):
        cylinder("Strut", (x, y, .8), .05, 1, m.steel, gear)
        cylinder("Tire", (x, y, .3), .3, .2, m.rubber, gear, "X")
    return root


def helicopter(m: Palette) -> bpy.types.Object:
    """LAH external study, with a five-blade main-rotor pivot."""
    root = group("LAH_ExteriorStudy")
    hull, tail = group("Hull", root), group("Tail", root)
    ellipsoid("Fuselage", (0, 0, 2), (.95, 3.7, 1.1), m.paint, hull)
    ellipsoid("Canopy", (0, 2.1, 2.15), (.88, 1.5, .85), m.glass, hull)
    cylinder("Tail boom", (0, -4.6, 2.3), .22, 4.8, m.paint, tail, "Y")
    panel("Tail fin", [(0, -6.9, 2.1), (0, -6.5, 4), (0, -5.4, 3.5)], m.paint, tail)
    rotor = group("MainRotor", root)
    rotor.location = (0, 0, 3.8)
    cylinder("Rotor mast", (0, 0, -.2), .12, .65, m.steel, rotor)
    for j in range(5):
        angle = j * math.tau / 5
        blade = box("Rotor blade", (math.sin(angle) * 3, math.cos(angle) * 3, 0), (.24, 6, .04), m.rubber, rotor)
        blade.rotation_euler.z = -angle
    return root


def ship(m: Palette) -> bpy.types.Object:
    """Hansando training-ship public silhouette with flight deck and large bridge."""
    root = group("Hansando_ExteriorStudy")
    hull, deck, antenna = group("Hull", root), group("Payload", root), group("Antenna", root)
    loft("Continuous hull", [[(-w, y, 9), (-w * .7, y, 1), (w * .7, y, 1), (w, y, 9)] for y, w in [(-70, 9), (-55, 11), (35, 11), (65, 5), (72, .3)]], m.paint, hull)
    box("Aft flight deck", (0, -42, 9), (19, 45, .2), m.rubber, deck)
    for y, z, size in [(0, 14, (18, 50, 10)), (16, 21, (15, 20, 5)), (-12, 21, (7, 8, 7))]:
        box("Superstructure", (0, y, z), size, m.paint, hull, .18)
    for x in range(-6, 7, 2):
        box("Bridge glazing", (x, 26.1, 22), (1.5, .05, 1.5), m.glass, hull)
    for y in (10, -8):
        cylinder("Mast", (0, y, 30), .25, 14, m.steel, antenna)
        box("Public sensor housing", (0, y, 35), (4, 2, 1), m.glass, antenna)
    return root


def create(identity: str, m: Palette) -> bpy.types.Object:
    """Dispatch only the twelve explicitly catalogued missing assets."""
    if identity == "remoeye":
        root = group("RemoEyeExterior")
        hull, wings, tail = group("Hull", root), group("Wings", root), group("Tail", root)
        m.paint.node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value = (.77, .77, .74, 1)
        box("Composite fuselage shell", (0, .23, .15), (.144, .55, .173), m.paint, hull, .047)
        cylinder("Tail boom", (0, -.32, .16), .019, .76, m.paint, tail, "Y")
        for side in (-1, 1):
            panel("Outer wing", [(0, .23, .21), (side*.9, .14, .245), (side*.87, -.02, .245), (0, -.04, .21)], m.paint, wings)
            panel("Horizontal stabilizer", [(0, -.52, .16), (side*.23, -.60, .16), (side*.21, -.72, .16), (0, -.7, .16)], m.paint, tail)
            panel("Aileron hinge line", [(side*.48, .004, .232), (side*.82, .010, .245), (side*.82, .014, .245), (side*.48, .008, .232)], m.steel, wings)
            for y in (.05, .18, .31, .44):
                cylinder("Access panel fastener", (side*.073, y, .147), .0031, .002, m.steel, hull, "X", 12)
        panel("Vertical stabilizer", [(0, -.51, .16), (0, -.57, .37), (0, -.65, .37), (0, -.71, .16)], m.paint, tail)
        payload = group("Payload", hull)
        cylinder("Sensor joint", (0, .505, .172), .081, .022, m.rubber, payload, "Y", 48)
        ellipsoid("Nose camera housing", (0, .603, .172), (.083, .117, .079), m.paint, payload)
        lens = cylinder("Camera lens", (0, .695, .135), .024, .01, m.glass, payload, "Y", 32)
        lens.rotation_euler.x -= .34
        box("Wing saddle", (0, .15, .216), (.19, .19, .04), m.paint, hull, .015)
        prop = group("Propeller", hull)
        prop.location = (0, -.19, .28)
        box("Motor pylon", (0, -.135, .218), (.028, .077, .094), m.paint, hull, .007)
        cylinder("Motor housing", (0, -.14, .27), .038, .11, m.paint, hull, "Y")
        ellipsoid("Two blade propeller", (0, 0, 0), (.157, .008, .016), m.rubber, prop)
        return root
    if identity in {"425", "smallsat", "anasis"}:
        return satellite(identity, m)
    if identity in {"k10", "k808", "redback", "cheongung"}:
        return vehicle(identity, m)
    if identity in {"muav", "kt1", "t50"}:
        return aircraft(identity, m)
    if identity == "lah":
        return helicopter(m)
    if identity == "hansando":
        return ship(m)
    raise KeyError(identity)
