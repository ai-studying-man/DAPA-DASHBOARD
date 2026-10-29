"""Recovery v21: reference-guided exterior study, Blender 4.5+. Not photogrammetry.
Run from repo root: blender -b --factory-startup --python this_file.py -- k2
"""
import bpy,bmesh,sys,json,struct,random,math,hashlib
from pathlib import Path
from mathutils import Vector
root=Path.cwd();id=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'k2'
if id not in ['k2','k9']:raise ValueError('Supported systems: k2, k9')
source=root/f'public/models/{id}-exhibit.glb';out=root/f'public/models/{id}-blender-v21.glb';blend=root/f'assets/blender/{id}-reference-v21.blend'
# Name original paint materials explicitly, without changing its geometry/buffer.
b=source.read_bytes();jl=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+jl]);tail=b[20+jl:]
for i,m in enumerate(j['materials']):m['name']=f'RecoveryArmor_{i}' if i in [0,1,3,7] else f'OriginalSurface_{i}'
js=json.dumps(j,separators=(',',':')).encode();js+=b' '*((-len(js))%4);temp=root/f'.local/{id}-named-source.glb';temp.write_bytes(struct.pack('<III',0x46546c67,2,20+len(js)+len(tail))+struct.pack('<II',len(js),0x4e4f534a)+js+tail)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);bpy.ops.import_scene.gltf(filepath=str(temp));objects=list(bpy.context.scene.objects);meshes=[o for o in objects if o.type=='MESH'];bpy.context.view_layer.update()
def ancestors(o):
 names=[]
 while o:names.append(o.name);o=o.parent
 return names
points=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box];lo=Vector([min(p[i] for p in points) for i in range(3)]);hi=Vector([max(p[i] for p in points) for i in range(3)])
hull=[o.matrix_world@Vector(c) for o in meshes if 'Hull' in ancestors(o) for c in o.bound_box];body_min=min(p.y for p in hull);body_max=max(p.y for p in hull)
image=bpy.data.images.load(str(root/f'public/media/model-reference/{id}-ai-multiview-v21.png'));image.pack();width,height=image.size
mat=bpy.data.materials.new(f'{id.upper()}_AI_INFERRED_exterior');mat.use_nodes=True;nodes=mat.node_tree.nodes;shader=nodes.get('Principled BSDF');shader.inputs['Metallic'].default_value=0;shader.inputs['Roughness'].default_value=.8
tex=nodes.new('ShaderNodeTexImage');tex.image=image;tex.extension='EXTEND';mat.node_tree.links.new(tex.outputs['Color'],shader.inputs['Base Color'])
# Authored microsurface maps: visual material treatment, not recovered wear/scan data.
rng=random.Random(20261029);rough=bpy.data.images.new('Authored_roughness',width=256,height=256);normal=bpy.data.images.new('Authored_micro_normal',width=256,height=256);r=[];n=[]
for _ in range(256*256):
 v=.72+rng.random()*.2;r.extend([v,v,v,1]);n.extend([.5+(rng.random()-.5)*.04,.5+(rng.random()-.5)*.04,1,1])
for im in [rough,normal]:im.colorspace_settings.name='Non-Color'
rough.pixels.foreach_set(r);normal.pixels.foreach_set(n)
for name,im in [('roughness',rough),('normal',normal)]:
 im.update();im.filepath_raw=str(root/f'.local/{id}-{name}.png');im.file_format='PNG';im.save();im.pack()
rt=nodes.new('ShaderNodeTexImage');rt.image=rough;mat.node_tree.links.new(rt.outputs['Color'],shader.inputs['Roughness'])
nt=nodes.new('ShaderNodeTexImage');nt.image=normal;nm=nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.25;mat.node_tree.links.new(nt.outputs['Color'],nm.inputs['Color']);mat.node_tree.links.new(nm.outputs['Normal'],shader.inputs['Normal']);mat['provenance']='AI-inferred atlas + independently authored micro maps. Not measured PBR data.'
# Normalized regions of the regenerated sheet; scale fitting is an artistic projection.
rects={'k2':[(120,115,815,435),(974,88,1508,410),(126,510,720,916),(918,516,1475,918)],'k9':[(87,110,819,447),(953,102,1510,421),(110,490,714,910),(857,511,1433,912)]}[id]
def unit(v,a,b):return max(0,min(1,(v-a)/max(1e-6,b-a)))
def pixel(rect,u,v):
 x0,y0,x1,y1=rect;return ((x0+(x1-x0)*u)/1536,1-(y0+(y1-y0)*v)/1024)
beveled=0;projected=0
for obj in meshes:
 names=ancestors(obj)
 if 'Gun' in names or not any(m and m.name.startswith('RecoveryArmor') for m in obj.data.materials):continue
 bm=bmesh.new();bm.from_mesh(obj.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(obj.data);bm.free()
 if 'RunningGear' not in names:
  bpy.context.view_layer.objects.active=obj;obj.select_set(True);mod=obj.modifiers.new('Exhibit edge finish','BEVEL');mod.width=.012;mod.segments=2;mod.limit_method='ANGLE';mod.angle_limit=.6;bpy.ops.object.modifier_apply(modifier=mod.name);obj.select_set(False);beveled+=1
 obj.data.materials.clear();obj.data.materials.append(mat)
 while obj.data.uv_layers:obj.data.uv_layers.remove(obj.data.uv_layers[0])
 uv=obj.data.uv_layers.new(name='AI_Exterior_Projection');normal_matrix=obj.matrix_world.to_3x3().inverted().transposed()
 for face in obj.data.polygons:
  normalv=(normal_matrix@face.normal).normalized();axis=max(range(3),key=lambda i:abs(normalv[i]))
  for loop in face.loop_indices:
   v=obj.matrix_world@obj.data.vertices[obj.data.loops[loop].vertex_index].co
   if axis==2:coord=pixel(rects[1],1-unit(v.y,body_min,body_max),unit(v.x,lo.x,hi.x))
   elif axis==0:coord=pixel(rects[0],1-unit(v.y,body_min,body_max),1-unit(v.z,lo.z,hi.z))
   elif normalv.y>0:coord=pixel(rects[2],unit(v.x,lo.x,hi.x),1-unit(v.z,lo.z,hi.z))
   else:coord=pixel(rects[3],1-unit(v.x,lo.x,hi.x),1-unit(v.z,lo.z,hi.z))
   uv.data[loop].uv=coord
 projected+=1
center=(lo+hi)*.5
for name,position in [('SIDE',(hi.x+18,0,center.z)),('TOP',(0,0,hi.z+20)),('FRONT',(0,hi.y+20,center.z)),('REAR',(0,lo.y-20,center.z)),('REVIEW',(14,19,11))]:
 data=bpy.data.cameras.new(name);data.type='ORTHO';data.ortho_scale=7 if name in ['FRONT','REAR'] else 15.5;cam=bpy.data.objects.new('ReferenceCamera_'+name,data);bpy.context.collection.objects.link(cam);cam.location=position;cam.rotation_euler=(center-cam.location).to_track_quat('-Z','Y').to_euler()
 if name=='REVIEW':bpy.context.scene.camera=cam
collection=bpy.data.collections.new('AI_reference_NOT_measurements');bpy.context.scene.collection.children.link(collection);board=bpy.data.objects.new('Inferred four-view board',None);board.empty_display_type='IMAGE';board.data=image;board.empty_display_size=12;board.location=(18,0,4);board.rotation_euler=(math.pi/2,0,0);board.hide_render=True;collection.objects.link(board)
bpy.ops.object.select_all(action='DESELECT')
for obj in objects:obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',use_selection=True,export_yup=True,export_cameras=False,export_lights=False,export_extras=True,export_image_format='JPEG',export_jpeg_quality=90,export_tangents=True)
scene=bpy.context.scene;scene['reference_status']='AI inferred exterior study. Not measured views or manufacturer CAD.';scene['recovery']='Rebuilt after automatic workspace pruning, 2026-10-29';scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=16;scene.render.resolution_x=1000;scene.render.resolution_y=700;scene.render.resolution_percentage=100;scene.render.film_transparent=True
world=scene.world or bpy.data.worlds.new('Outdoor review');scene.world=world;world.use_nodes=True;world.node_tree.nodes.get('Background').inputs[0].default_value=(.5,.58,.65,1);world.node_tree.nodes.get('Background').inputs[1].default_value=.6
sun=bpy.data.lights.new('ReviewSun','SUN');sun.energy=2;sun.angle=.15;lamp=bpy.data.objects.new('ReviewSun',sun);scene.collection.objects.link(lamp);lamp.rotation_euler=(math.radians(25),math.radians(-25),math.radians(-30));bpy.ops.wm.save_as_mainfile(filepath=str(blend),compress=True)
scene.render.filepath=str(root/f'.local/{id}-blender-review.png');bpy.ops.render.render(write_still=True)
metadata={'tool':bpy.app.version_string,'recoveryRevision':21,'beveledMeshes':beveled,'projectedMeshes':projected,'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'referenceType':'Regenerated AI inferred multiview study','photorealValidated':False,'parts':['Hull','Turret','Gun','RunningGear','Markings']};(root/f'public/models/{id}-blender-v21-metadata.json').write_text(json.dumps(metadata,indent=2));print('RECOVERED_MODEL',json.dumps(metadata))
