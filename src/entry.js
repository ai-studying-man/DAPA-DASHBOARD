const entryParams=new URLSearchParams(location.search);
if(!entryParams.has('view')&&!entryParams.has('system')&&!entryParams.has('experience')&&!entryParams.has('showcase')||entryParams.get('view')==='visit'){
 import('./visitor.js').catch(()=>{document.querySelector('#app').innerHTML='<p>체험을 불러오지 못했습니다. <a href="?view=dashboard">상세 대시보드 열기</a></p>'});
}else if(new URLSearchParams(location.search).get('view')==='equipment'){
 import('./equipment-mvp.js').catch(()=>{document.querySelector('#app').textContent='전체 장비 관람을 불러오지 못했습니다. 페이지를 새로고침해 주세요.'});
}else if(new URLSearchParams(location.search).get('view')==='service'){
 import('./service-experience.js').catch(()=>{document.querySelector('#app').innerHTML='<p>3D 체험을 불러오지 못했습니다. <a href="./">대시보드로 돌아가기</a></p>'});
}else{import('./main.js')}
