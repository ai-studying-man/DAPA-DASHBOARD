"""Build every catalog entry as a Blender-linked exhibition MVP, not precision CAD."""
from __future__ import annotations
import json
import shutil
import sys
from pathlib import Path
import bpy
sys.path.insert(0,str(Path('scripts/blender').resolve()))
from exterior_parts import group, compact
from mvp_shapes import helicopter, jet, ground, mortar
from photo_study import bounds
from refine_environment_assets import surface_uv


def material(name: str, color: tuple[float,float,float,float], rough: float, metal: float) -> bpy.types.Material:
    result=bpy.data.materials.new(name)
    result.use_nodes=True
    shader=result.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value=color
    shader.inputs['Roughness'].default_value=rough
    shader.inputs['Metallic'].default_value=metal
    return result


def build() -> None:
    catalog=json.loads(Path('docs/modeling/visual-targets/equipment-catalog.json').read_text(encoding='utf-8'))
    output=Path('artifacts/3d/equipment-mvp');output.mkdir(parents=True,exist_ok=True)
    models=Path('public/models/mvp');models.mkdir(parents=True,exist_ok=True)
    images=Path('public/media/mvp');images.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    paint=material('MVP olive paint',(.21,.26,.16,1),.78,.08)
    gray=material('MVP gray paint',(.27,.31,.33,1),.7,.1)
    glass=material('MVP optical glass',(.025,.085,.11,1),.17,.2)
    steel=material('MVP exposed metal',(.11,.13,.13,1),.6,.65)
    rubber=material('MVP rubber',(.018,.021,.02,1),.94,0)
    initial=bpy.context.scene
    records=[]
    previous=None
    for index,entry in enumerate(catalog):
        identity=entry['id']
        if previous is not None:
            for item in list(previous.objects):item.name=previous['catalog_id']+'_'+item.name
        scene=initial if index==0 else bpy.data.scenes.new(identity)
        bpy.context.window.scene=scene
        scene.name=f'{index+1:02d}_{identity}'
        scene['catalog_id'],scene['catalog_label']=identity,entry['label']
        scene['stage']='MVP exterior approximation; not verified photoreal geometry'
        if identity in {'k2','k9'}:
            bpy.ops.import_scene.gltf(filepath=str(Path('public/models',identity+'-photo-refined.glb').resolve()))
            root=next(o for o in scene.objects if o.parent is None)
            kind='photo-informed-existing'
        else:
            root=group(identity.upper()+'_MVP')
            root['classification']='authored category silhouette; AI visual reference not reconstructed by photogrammetry'
            root['units']='metres; approximate dimensions'
            if identity in {'500md','ah1s','ah64e','surion','uh60p'}:
                helicopter(identity,root,paint,glass,steel,rubber)
            elif identity in {'f22','f117','kf21'}:
                jet(identity,root,gray,glass,steel,rubber)
            elif identity in {'km181','km187'}:
                mortar(root,paint,steel)
                if identity=='km187':root.scale=(1.2,1.2,1.2)
            else:
                ground(identity,root,paint,glass,steel,rubber)
            compact(root)
            kind='category-mesh-mvp'
        parts=[root]+list(root.children_recursive)
        meshes=[item for item in parts if item.type=='MESH']
        bpy.context.view_layer.update()
        low,high=bounds(meshes)
        root.location.z-=low.z
        bpy.context.view_layer.update()
        low,high=bounds(meshes)
        bpy.ops.object.select_all(action='DESELECT')
        for part in parts:part.select_set(True)
        target=models/(identity+'.glb')
        bpy.ops.export_scene.gltf(filepath=str(target.resolve()),export_format='GLB',use_selection=True,use_active_scene=True,export_extras=True)
        reference=None
        if entry['image']:
            source=Path('docs/modeling/visual-targets',entry['image'])
            reference=f'./media/mvp/{identity}.png'
            shutil.copyfile(source,images/(identity+'.png'))
            image=bpy.data.images.load(str(source.resolve()),check_existing=True);image.pack()
            board=bpy.data.objects.new('AI_REFERENCE_NOT_MESH',None)
            board.empty_display_type='IMAGE';board.data=image;board.empty_display_size=12
            board.location=(-16,0,4);board.rotation_euler.x=1.5707963268
            scene.collection.objects.link(board)
        span=high-low
        records.append({'order':entry['order'],'id':identity,'name':entry['label'],'category':entry['category'],
                        'model':f'./models/mvp/{identity}.glb','image':reference,'referenceKind':'ai-generated' if reference else 'pending',
                        'meshStage':kind,'review':entry.get('reviewNotes','형상·재질 검토 필요'),'verification':entry['verification'],
                        'size':list(span),'range':max(6 if identity in {'km181','km187'} else 4,max(span)*1.8),'altitude':120 if identity in {'500md','ah1s','ah64e','surion','uh60p','f22','f117','kf21'} else 0})
        previous=scene
    bpy.context.window.scene=initial
    bpy.ops.wm.save_as_mainfile(filepath=str((output/'equipment-mvp.blend').resolve()))
    Path('src/equipment-mvp.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
    (output/'report.json').write_text(json.dumps({'entries':len(records),'newMvpMeshes':19,'reusedPhotoInformedMeshes':2,'referenceImages':20,'imagePending':['km187'],'precisionVerified':False},indent=2),encoding='utf-8')


if __name__=='__main__':
    build()
