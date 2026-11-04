"""Visible KF-21 contours in the coordinate frame of the retained canopy and gear."""
import math

import bmesh
import bpy
from exterior_parts import group, cylinder, box
from surfaces import material


def refine_500md():
    """500D five-blade silhouette and the rails visible in the ROK Army photograph."""
    rotor = bpy.data.objects["MainRotor"]
    old = bpy.data.objects["MainRotor_MVP exposed metal"]
    steel = old.data.materials[0]
    bpy.data.objects.remove(old, do_unlink=True)
    cylinder("Rotor mast", (0,0,2.95), .09,.6,steel,rotor)
    for index in range(5):
        angle = index * math.tau / 5
        blade = box("500D rotor blade", (1.99*math.sin(angle),1.99*math.cos(angle),3.15),
                    (.16,3.82,.032),steel,rotor,.01)
        blade.rotation_euler.z = -angle
    hull = bpy.data.objects["Hull"]
    paint = bpy.data.objects["Hull_MVP olive paint"].data.materials[0]
    # The photographed aircraft carries its stabilizer on top of the fin.
    # Rebuild the joined paint shell in the exhibit copy; keep the tail rotor.
    tail = bpy.data.objects["Tail"]
    bpy.data.objects.remove(bpy.data.objects["Tail_MVP olive paint"], do_unlink=True)
    angles = [math.tau*i/24 for i in range(24)]
    # Fit the lower cabin to the visible silhouette and retain the separate glazing.
    bpy.data.objects.remove(bpy.data.objects["Hull_MVP olive paint"], do_unlink=True)
    cabin = [(-1.55,.16,1.97,2.44),(-1.35,.43,1.52,2.65),
             (-1.05,.64,1.16,2.81),(-.65,.74,.96,2.91),
             (-.2,.77,.87,2.94),(.35,.75,.86,2.86),
             (.75,.66,.93,2.66),(1.07,.54,1.06,2.32),
             (1.34,.41,1.22,1.94),(1.52,.21,1.45,1.82)]
    shell("Rounded cabin and belly",
          [[(width*math.cos(a),y,(top+bottom)/2+(top-bottom)/2*math.sin(a))
            for a in angles] for y,width,bottom,top in cabin], hull, paint)
    boom = [(-.85,2.20,.34,.34),(-1.55,2.27,.25,.24),
            (-2.75,2.43,.15,.16),(-4.05,2.64,.085,.095)]
    shell("Tapered tail boom", [[(w*math.cos(a),y,z+h*math.sin(a)) for a in angles]
                                for y,z,w,h in boom],tail,paint)
    fin = [(1.98,-3.98,.12),(2.65,-4.03,.32),(3.64,-4.35,.26)]
    shell("Swept tail fin", [[(.055*math.cos(a),y+chord*math.sin(a),z) for a in angles]
                             for z,y,chord in fin],tail,paint)
    box("High stabilizer",(0,-4.35,3.63),(2.16,.34,.06),paint,tail,.018)
    for side in (-1,1):
        box("Stabilizer tip plate",(side*1.07,-4.35,3.66),(.032,.38,.17),paint,tail,.012)

    def rail(name, points, thickness, mat, parent):
        from mathutils import Vector
        for start,end in zip(points,points[1:]):
            a,b = Vector(start),Vector(end)
            segment = cylinder(name,(a+b)/2,thickness,(b-a).length,mat,parent,vertices=12)
            segment.rotation_euler = (b-a).to_track_quat('Z','Y').to_euler()

    gear = bpy.data.objects["RunningGear"]
    bpy.data.objects.remove(bpy.data.objects["RunningGear_MVP exposed metal"], do_unlink=True)
    for side in (-1,1):
        rail("Skid runner",[(side*.95,-1.47,.25),(side*.95,1.45,.25),
                            (side*.95,1.59,.28),(side*.95,1.69,.37)],.055,steel,gear)
        for y in (-.77,.73):
            rail("Skid support",[(side*.95,y-.08,.25),(side*.84,y,.60),
                                 (side*.48,y,1.39)],.05,steel,gear)
    for longitude in (-.98,0,.98):
        path=[]
        for i in range(15):
            latitude=-.45+1.69*i/14
            path.append((.671*math.sin(longitude)*math.cos(latitude),
                         .882+.847*math.cos(longitude)*math.cos(latitude),
                         2.05+.806*math.sin(latitude)))
        rail("Cockpit frame",path,.016,paint,hull)


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
    return obj


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
    control_paint = material("Trailing control surface gray", (.195, .222, .24))
    for side in (-1,1):
        # Rounded engine shoulders taper into the paired exhausts visible in the dorsal photo.
        fairing = [(-7.94,.45,.40,.37),(-7.25,.48,.45,.43),(-5.4,.54,.51,.51),
                   (-3.6,.58,.49,.53),(-1.7,.57,.38,.43),(.25,.49,.25,.28)]
        shell("Engine shoulder", [[(side*offset+w*math.cos(a),y,1.56+h*math.sin(a))
                                   for a in angles] for y,offset,w,h in fairing],hull,paint)
        for name, parent, sections in [
            ("Blended wing", wings, [(.63,3.25,-4.8,1.65,.47),(1.08,2.25,-4.85,1.63,.34),
              (1.55,1.36,-4.9,1.60,.22),(2.15,.55,-4.95,1.57,.16),
              (4.2,-1.45,-5,1.54,.095),(5.8,-3.12,-4.71,1.51,.045)]),
            ("Stabilator", hull, [(.76,-4.7,-7.85,1.64,.095),(3.32,-6.8,-7.94,1.55,.035)])]:
            surface = shell(name, [[(side*x, (lead+trail)/2+(lead-trail)/2*math.cos(a),
                            z+h*math.sin(a)*(1+.36*math.cos(a))) for a in angles]
                          for x,lead,trail,z,h in sections],parent,paint)
            if name == "Blended wing":
                surface.data.materials.append(control_paint)
                for face in surface.data.polygons:
                    # Use the same vertices on both finishes so the hinge boundary follows the wing.
                    station, chord = divmod(min(face.vertices), len(angles))
                    if len(face.vertices) == 4 and station >= 2 and 11 <= chord < 21:
                        face.material_index = 1
        shell("Canted fin", [[(side*x+.075*scale*math.sin(a), mid+chord*math.cos(a),z)
                               for a in angles] for x,mid,chord,z,scale in
                              [(.79,-6.48,1.53,1.65,1),(1.06,-6.58,1.3,2.34,.83),
                               (1.72,-7.04,.72,3.88,.36)]],hull,paint)
