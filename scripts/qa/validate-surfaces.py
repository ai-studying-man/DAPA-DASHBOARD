"""Reject missing/zero normal or roughness images even in structurally valid GLBs."""
import json,struct,io
from pathlib import Path
from PIL import Image,ImageStat
for id in ['k2','k9']:
 b=Path(f'public/models/{id}-blender-v21.glb').read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);data=b[28+n:];material=next(m for m in j['materials'] if 'AI_INFERRED' in m.get('name',''))
 def means(index):
  im=j['images'][j['textures'][index]['source']];v=j['bufferViews'][im['bufferView']];raw=data[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];return ImageStat.Stat(Image.open(io.BytesIO(raw)).convert('RGB')).mean
 normal=means(material['normalTexture']['index']);rough=means(material['pbrMetallicRoughness']['metallicRoughnessTexture']['index'])
 assert 80<normal[0]<180 and 80<normal[1]<180 and normal[2]>220,(id,'invalid normal',normal)
 assert 80<rough[1]<250,(id,'invalid roughness',rough)
 print(id,'normal RGB',normal,'roughness RGB',rough)
