export function exhibitSite(item){
 if(item.id==='nuri')return {longitude:127.535069,latitude:34.431867,altitude:0,label:'나로우주센터 제2발사대 일대 · 전시용 배치',grounded:true,fixed:true};
 const sites={
  land:{longitude:128.7063,latitude:37.6677,altitude:0,label:'강원 평창 광장 일대 · 전시용 배치',grounded:true},
  sea:{longitude:129.58,latitude:36.08,altitude:0,label:'포항 동해 연안 · 전시용 해역',grounded:false},
  air:{longitude:128.7063,latitude:37.6677,altitude:1200,label:'강원 상공 · 전시용 고도',grounded:false},
  space:{longitude:127.5,latitude:36.3,altitude:450000,label:'한반도 상공 · 전시용 위치, 실제 궤도 아님',grounded:false,fixed:true},
 };
 return sites[item.domain]||sites.land;
}
