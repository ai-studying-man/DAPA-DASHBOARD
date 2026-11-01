import * as T from 'three';

// Authored landscape inspired by Korean inland/coastal morphology; not a DEM.
const smooth=(a,b,x)=>T.MathUtils.smoothstep(x,a,b);
const ridge=(x,z,cx,cz,sx,sz,h)=>h*Math.exp(-(((x-cx)/sx)**2+((z-cz)/sz)**2));
export function serviceTerrainHeight(branch,x,z){
  const coastal=branch==='navy'||branch==='marine';
  const hills=ridge(x,z,-64,-35,26,44,30)+ridge(x,z,58,-58,38,23,38)+ridge(x,z,70,28,25,35,29)+ridge(x,z,-62,62,31,28,24);
  const detail=(Math.sin(x*.12+z*.04)*Math.cos(z*.15)+Math.sin(x*.28-z*.13)*.35)*1.5;
  const clearing=smooth(28,48,Math.hypot(x,z));
  let height=(hills+detail)*clearing;
  if(coastal){const shoreline=-20+Math.sin(x*.045)*5;const shore=smooth(shoreline-7,shoreline+9,z);height=height*shore-(1-shore)*5;}
  return height;
}
export function createServiceLandscape(scene,branch){
 const group=new T.Group();group.name=`KoreaInspiredLandscape_${branch}`;
 group.userData.classification='Procedural Korean-inspired landscape; not surveyed DEM or installation';
 const heightAt=(x,z)=>serviceTerrainHeight(branch,x,z);
 const geometry=new T.PlaneGeometry(260,260,160,160);geometry.rotateX(-Math.PI/2);
 const position=geometry.attributes.position,colors=[];
 const soil=new T.Color(0x8b8069),grass=new T.Color(0x6f795a),forest=new T.Color(0x425a43),sand=new T.Color(0xc2b28a),rock=new T.Color(0x8c8e84);
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),z=position.getZ(i),h=heightAt(x,z);position.setY(i,h);
  const tone=(Math.sin(x*2.1+z*.7)*Math.cos(z*1.8-x*.4)+1)*.5;
  const color=grass.clone().lerp(soil,tone*.22).lerp(forest,smooth(4,19,h)*.7).lerp(rock,smooth(24,43,h)*.55);
  if((branch==='navy'||branch==='marine')&&z< -8)color.lerp(sand,1-smooth(-1,4,h));
  // Gravel access strip on the flat visitor clearing.
  if(branch==='army'&&Math.abs(x)<3&&Math.abs(z)<27)color.copy(soil).lerp(rock,.25);
  colors.push(color.r,color.g,color.b);
 }
 geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
 const terrain=new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,roughness:1}));terrain.name='ContinuousTerrain';terrain.receiveShadow=true;group.add(terrain);
 const coastal=branch==='navy'||branch==='marine';
 if(coastal){const water=new T.Mesh(new T.PlaneGeometry(260,260,1,1),new T.MeshStandardMaterial({color:0x426d7b,roughness:.3,metalness:.12}));water.rotation.x=-Math.PI/2;water.position.set(0,-.2,-145);water.name='CoastalWater';group.add(water);}
 const treeGeometry=new T.IcosahedronGeometry(1,1);const treeMaterial=new T.MeshStandardMaterial({color:0x364d39,roughness:1});
 const trees=new T.InstancedMesh(treeGeometry,treeMaterial,750);trees.name='DistantForestCanopies';
 const transform=new T.Object3D();let count=0;
 for(let i=0;i<1800&&count<750;i++){
  const x=Math.sin(i*12.9898)*110,z=Math.cos(i*7.233)*110,h=heightAt(x,z);
  if(Math.hypot(x,z)<38||h<2||(coastal&&z< -12))continue;
  const size=.8+(Math.sin(i*3.2)+1)*.6;
  transform.position.set(x,h+size*1.4,z);transform.scale.set(size,size*1.8,size);transform.rotation.y=i*.7;transform.updateMatrix();trees.setMatrixAt(count++,transform.matrix);
 }
 trees.count=count;trees.instanceMatrix.needsUpdate=true;group.add(trees);
 group.userData.heightAt=heightAt;group.userData.walkSurface=terrain;
 group.userData.waterLevel=coastal?-.2:null;
 scene.add(group);return group;
}
