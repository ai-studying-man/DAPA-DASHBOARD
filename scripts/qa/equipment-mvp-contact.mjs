// Analysis-only contact sheets of captured UI evidence; no source imagery edits.
import fs from 'node:fs';import {PNG} from 'pngjs';
const items=JSON.parse(fs.readFileSync('src/equipment-mvp.json'));
const output='artifacts/3d/equipment-mvp/contacts';fs.mkdirSync(output,{recursive:true});
for(const [folder,views] of [['browser',['home','front','back','left','right','top']],['terrain',['exterior','hatch','driver','region','peninsula']]].filter(([folder])=>!process.argv[2]||process.argv[2]===folder))for(const width of [1440,390])for(let page=0;page<3;page++){
 const rows=items.slice(page*7,page*7+7),tileWidth=220,tileHeight=180;
 const canvas=new PNG({width:views.length*tileWidth,height:rows.length*tileHeight});canvas.data.fill(245);
 for(let row=0;row<rows.length;row++)for(let col=0;col<views.length;col++){
  const file=`artifacts/3d/equipment-mvp/${folder}/${rows[row].id}-${views[col]}-${width}.png`;
  if(!fs.existsSync(file))continue;
  const source=PNG.sync.read(fs.readFileSync(file));
  const scale=Math.min((tileWidth-6)/source.width,(tileHeight-6)/source.height);
  const w=Math.floor(source.width*scale),h=Math.floor(source.height*scale);
  const left=col*tileWidth+Math.floor((tileWidth-w)/2),top=row*tileHeight+3;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const from=(Math.floor(y/scale)*source.width+Math.floor(x/scale))*4,to=((top+y)*canvas.width+left+x)*4;
   source.data.copy(canvas.data,to,from,from+4);
  }
 }
 const name=`${folder}-${width}-${page+1}`;
 fs.writeFileSync(`${output}/${name}.png`,PNG.sync.write(canvas));
 fs.writeFileSync(`${output}/${name}.json`,JSON.stringify({rows:rows.map(item=>item.id),columns:views},null,2));
}
console.log('Contact sheets generated; see paired JSON for row/column identities');
