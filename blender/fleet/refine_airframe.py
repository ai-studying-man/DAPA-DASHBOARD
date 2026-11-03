"""Visible KF-21 contours in the coordinate frame of the retained canopy and gear."""
import math

import bmesh
import bpy
from exterior_parts import group
from surfaces import material


def shell(name, sections, parent, paint):
    count = len(sections[0])
    vertices = [point for ring in sections for point in ring]
    last = len(vertices) - count
    faces = [tuple(range(count)), tuple(range(last, last + count))]
    for start in range(0, last, count):
        for i in range(count):
            j = (i + 1) % count
            faces.append((start+i, start+j, start+count+j, start+count+i))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    mesh.materials.append(paint)
    for face in mesh.polygons:
        face.use_smooth = len(face.vertices) == 4


def refine_kf21():
    hull = bpy.data.objects["Hull"]
    # Only replace the combined paint shell in this imported working copy.
    bpy.data.objects.remove(bpy.data.objects["Hull_MVP gray paint"], do_unlink=True)
    paint = material("Airframe satin gray", (.23, .265, .285))
    angles = [math.tau*i/32 for i in range(32)]
    stations = [(-7.96,.85,.38,1.47),(-7.2,1.03,.47,1.5),(-5,1.26,.61,1.51),
                (-2.4,1.39,.69,1.53),(0,1.19,.66,1.55),(1.55,.84,.59,1.57),
                (2.8,.62,.5,1.62),(4.4,.54,.41,1.59),(5.9,.38,.29,1.54),
                (7.3,.15,.13,1.45),(8,.018,.02,1.42)]
    shell("Rounded fuselage", [[(w*math.cos(a),y,z+h*math.sin(a)) for a in angles]
                               for y,w,h,z in stations], hull, paint)
    wings = group("Wings", hull)
    for side in (-1,1):
        for name, parent, sections in [
            ("Blended wing", wings, [(.63,3.25,-4.8,1.65,.47),(1.08,2.25,-4.85,1.63,.34),
              (1.55,1.36,-4.9,1.60,.22),(2.15,.55,-4.95,1.57,.16),
              (4.2,-1.45,-5,1.54,.095),(5.8,-3.12,-4.71,1.51,.045)]),
            ("Stabilator", hull, [(.76,-4.7,-7.85,1.64,.095),(3.32,-6.8,-7.94,1.55,.035)])]:
            shell(name, [[(side*x, (lead+trail)/2+(lead-trail)/2*math.cos(a),
                            z+h*math.sin(a)*(1+.36*math.cos(a))) for a in angles]
                          for x,lead,trail,z,h in sections],parent,paint)
        shell("Canted fin", [[(side*x+.075*scale*math.sin(a), mid+chord*math.cos(a),z)
                               for a in angles] for x,mid,chord,z,scale in
                              [(.79,-6.48,1.53,1.65,1),(1.06,-6.58,1.3,2.34,.83),
                               (1.72,-7.04,.72,3.88,.36)]],hull,paint)
