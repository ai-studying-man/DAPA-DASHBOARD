const fs=require('node:fs');
const subset=require('subset-font');
(async()=>{
  const text=fs.readdirSync('src').filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync('src/'+f,'utf8')).join('')+Array.from({length:95},(_,i)=>String.fromCharCode(i+32)).join('');
  for(const weight of [400,500,700]){
    const input=fs.readFileSync(`node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-${weight}-normal.woff2`);
    fs.writeFileSync(`src/assets/noto-kr-${weight}.woff2`,await subset(input,text,{targetFormat:'woff2'}));
  }
})().catch(e=>{console.error(e);process.exitCode=1});
