import fs from 'node:fs';import {PNG} from 'pngjs';
const bounds={west:124,east:132,south:33,north:43.5},width=161,height=211,z=7,n=2**z;
const tileXY=(lon,lat)=>[(lon+180)/360*n,(1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*n];
const [xmin,ymax]=tileXY(bounds.west,bounds.south),[xmax,ymin]=tileXY(bounds.east,bounds.north);const tiles=new Map(),urls=[];
for(let x=Math.floor(xmin);x<=Math.floor(xmax);x++)for(let y=Math.floor(ymin);y<=Math.floor(ymax);y++){
 const url=`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;const r=await fetch(url);if(!r.ok)throw new Error(url+' '+r.status);tiles.set(x+'/'+y,PNG.sync.read(Buffer.from(await r.arrayBuffer())));urls.push(url);
}
const values=[];for(let j=0;j<height;j++)for(let i=0;i<width;i++){const lon=bounds.west+i*(bounds.east-bounds.west)/(width-1),lat=bounds.north-j*(bounds.north-bounds.south)/(height-1);const [tx,ty]=tileXY(lon,lat),png=tiles.get(Math.floor(tx)+'/'+Math.floor(ty));const p=(Math.min(255,Math.floor((ty%1)*256))*256+Math.min(255,Math.floor((tx%1)*256)))*4;values.push(Math.round(png.data[p]*256+png.data[p+1]+png.data[p+2]/256-32768))}
const data={bounds,width,height,values,source:'Mapzen/Tilezen Terrain Tiles (AWS Open Data)',samplingDegrees:.05,accessed:new Date().toISOString(),tileZoom:z,tiles:urls};fs.writeFileSync('public/data/terrain.json',JSON.stringify(data));console.log(JSON.stringify({tiles:urls.length,samples:values.length,min:Math.min(...values),max:Math.max(...values)}));
