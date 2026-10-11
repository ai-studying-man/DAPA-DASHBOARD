import * as T from 'three';
import {sceneTheme as palette} from './scene-theme.js';
let terrainPromise;
export function loadTerrain(){return terrainPromise??=fetch('./data/terrain.json').then(r=>{if(!r.ok)throw new Error('한반도 고도 자료를 불러오지 못했습니다.');return r.json()})}
export function elevation(data,lon,lat){const {bounds:b,width:w,height:h,values}=data;const x=Math.max(0,Math.min(w-1,(lon-b.west)/(b.east-b.west)*(w-1))),y=Math.max(0,Math.min(h-1,(b.north-lat)/(b.north-b.south)*(h-1)));const i=Math.floor(x),j=Math.floor(y),a=values[j*w+i],c=values[j*w+Math.min(i+1,w-1)],d=values[Math.min(j+1,h-1)*w+i],e=values[Math.min(j+1,h-1)*w+Math.min(i+1,w-1)];return (a+(c-a)*(x-i))*(1-(y-j))+(d+(e-d)*(x-i))*(y-j)}
export const terrainY=(data,lon,lat,base=.47)=>base+Math.max(0,elevation(data,lon,lat))*.0008;
export function terrainMesh(data,{base=.47,bathymetry=false}={}){
 const {bounds:b,width:w,height:h,values}=data,vertices=[],colors=[],indices=[];const low=new T.Color(palette.terrainLow),high=new T.Color(palette.terrainHigh),deep=new T.Color(palette.waterDeep);
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){const lon=b.west+i*(b.east-b.west)/(w-1),lat=b.north-j*(b.north-b.south)/(h-1),alt=values[j*w+i];vertices.push((lon-127.5)*1.25,alt>0?base+alt*.0008:alt*.00035,-(lat-37.3)*1.6);const c=alt>0?low.clone().lerp(high,Math.min(1,alt/2200)):deep;colors.push(c.r,c.g,c.b)}
 for(let j=0;j<h-1;j++)for(let i=0;i<w-1;i++){const a=j*w+i,b=a+1,c=a+w,d=c+1;if(bathymetry||Math.max(values[a],values[b],values[c],values[d])>2)indices.push(a,c,b,b,c,d)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();return new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.9,side:T.DoubleSide}));
}
// Match the rendered a-c-b / b-c-d triangle surface, including coastal vertices.
export function surfaceHeight(data,lon,lat,base=.47){const {bounds:b,width:w,height:h,values}=data;const x=Math.max(0,Math.min(w-1,(lon-b.west)/(b.east-b.west)*(w-1))),y=Math.max(0,Math.min(h-1,(b.north-lat)/(b.north-b.south)*(h-1))),i=Math.min(w-2,Math.floor(x)),j=Math.min(h-2,Math.floor(y)),fx=x-i,fy=y-j;const height=index=>values[index]>0?base+values[index]*.0008:values[index]*.00035;const a=height(j*w+i),c=height(j*w+i+1),d=height((j+1)*w+i),e=height((j+1)*w+i+1);return fx+fy<=1?a+(c-a)*fx+(d-a)*fy:e+(d-e)*(1-fx)+(c-e)*(1-fy)}
// Labels use a conservative local envelope so their marker sphere clears steep relief.
export function markerHeight(data,lon,lat,base=.47,radius=.12){const {bounds:b,width:w,height:h,values}=data,dx=(b.east-b.west)/(w-1),dy=(b.north-b.south)/(h-1),x=(lon-b.west)/dx,y=(b.north-lat)/dy;const rx=radius/1.25/dx,ry=radius/1.6/dy;let top=.015;for(let j=Math.max(0,Math.floor(y-ry));j<=Math.min(h-1,Math.ceil(y+ry));j++)for(let i=Math.max(0,Math.floor(x-rx));i<=Math.min(w-1,Math.ceil(x+rx));i++){const alt=values[j*w+i];top=Math.max(top,alt>0?base+alt*.0008:alt*.00035)}return top+radius+.04}
