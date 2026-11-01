"""UV photo patches and authored PBR for public-photo exterior reconstructions."""
from pathlib import Path
import bpy
from exterior_parts import group,box,cylinder,loft,wheel_dish


def material(name, color, roughness=.78, metal=0):
    mat=bpy.data.materials.new(name);mat.use_nodes=True
    shader=mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value=(*color,1)
    shader.inputs['Roughness'].default_value=roughness;shader.inputs['Metallic'].default_value=metal
    return mat


def materials():
    paint=material('Authored Korean camouflage',(.22,.26,.16),.82,.04)
    shader=paint.node_tree.nodes.get('Principled BSDF')
    for suffix,socket in [('paint','Base Color'),('roughness','Roughness')]:
        image=bpy.data.images.load(str(Path('artifacts/3d/photo-pbr/k2-'+suffix+'.png').resolve()),check_existing=True)
        image.pack();node=paint.node_tree.nodes.new('ShaderNodeTexImage');node.image=image
        paint.node_tree.links.new(node.outputs['Color'],shader.inputs[socket])
    normal=bpy.data.images.load(str(Path('artifacts/3d/photo-pbr/k2-normal.png').resolve()),check_existing=True);normal.colorspace_settings.name='Non-Color';normal.pack()
    node=paint.node_tree.nodes.new('ShaderNodeTexImage');node.image=normal
    mapper=paint.node_tree.nodes.new('ShaderNodeNormalMap');mapper.inputs['Strength'].default_value=.3
    paint.node_tree.links.new(node.outputs['Color'],mapper.inputs['Color']);paint.node_tree.links.new(mapper.outputs['Normal'],shader.inputs['Normal'])
    return {'paint':paint,'rubber':material('Rubber',(.018,.022,.018),.94),
            'steel':material('Exposed steel',(.12,.13,.12),.6,.7),
            'dark':material('Recess',(.012,.016,.014),.92),
            'glass':material('Optical glass',(.025,.06,.07),.16,.2)}


def photo_patch(name, vertices, pixels, source, parent):
    """Map inspected photo quadrilateral directly; occluded surfaces are not inferred as scans."""
    image=bpy.data.images.load(str(Path(source).resolve()),check_existing=True);image.pack()
    mat=material(name+' photo material',(1,1,1),.84)
    shader=mat.node_tree.nodes.get('Principled BSDF');node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=image
    mat.node_tree.links.new(node.outputs['Color'],shader.inputs['Base Color'])
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],[(0,3,2,1)]);mesh.update()
    obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj);obj.parent=parent;obj.data.materials.append(mat)
    uv=mesh.uv_layers.new(name='InspectedPhotoPatch')
    for loop in mesh.loops:
        point=pixels[loop.vertex_index];uv.data[loop.index].uv=(point[0]/image.size[0],1-point[1]/image.size[1])
    obj['texture_status']='public-photo projection with estimated four anchors; no calibrated photogrammetry'
    return obj


def ring(y,low,high,bottom,top):
    return [(-bottom,y,low),(bottom,y,low),(top,y,high),(-top,y,high)]


def tracks(parent,length,width,count,mats):
    """Distinct wheel count and individual track shoes, not repeated solid boxes."""
    import math
    gear=group('RunningGear',parent)
    span=length-.9
    for side in (-1,1):
        x=side*(width/2-.27);track=group('Track_'+str(side),gear)
        for index in range(count):
            y=-span/2+.32+index*(span-.64)/(count-1)
            cylinder('Road wheel tire',(x,y,.55),.43,.38,mats['rubber'],track,'X',40)
            wheel_dish((x+side*.19,y,.55),side,mats['paint'],track)
            cylinder('Wheel hub',(x+side*.225,y,.55),.12,.06,mats['steel'],track,'X',24)
            for i in range(8):
                angle=i*math.tau/8
                cylinder('Wheel fastener',(x+side*.23,y+math.sin(angle)*.27,.55+math.cos(angle)*.27),.018,.025,mats['steel'],track,'X',6)
        half=span/2
        for y in (-half,half):cylinder('End sprocket',(x,y,.65),.44,.39,mats['steel'],track,'X',40)
        straight=span;arc=math.pi*.56;perimeter=straight*2+arc*2
        for i in range(92):
            d=i/92*perimeter
            if d<straight:y,z,a=-half+d,1.21,0
            elif d<straight+arc:a=(d-straight)/.56;y,z=half+math.sin(a)*.56,.65+math.cos(a)*.56
            elif d<straight*2+arc:y,z,a=half-(d-straight-arc),.09,math.pi
            else:a=math.pi+(d-straight*2-arc)/.56;y,z=-half+math.sin(a)*.56,.65+math.cos(a)*.56
            shoe=box('Individual track link',(x,y,z),(.55,.14,.06),mats['steel'],track);shoe.rotation_euler.x=-a
            pad=box('Rubber track pad',(x,y+math.sin(a)*.035,z+math.cos(a)*.035),(.32,.085,.035),mats['rubber'],track);pad.rotation_euler.x=-a
