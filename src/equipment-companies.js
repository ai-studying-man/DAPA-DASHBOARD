import {profiles} from './exhibition-data.js';
import {sources} from './data.js';

const kia={name:'기아',role:'소형전술차 차체·플랫폼',url:'https://org-military.kia.com/en/kltv'};
const additions={
 k1arv:[{name:'현대로템',role:'K1 구난전차 제작',url:'https://www.hyundai-rotem.co.kr/en/business/defense/details.do?productNm=K1+ARV'}],
 k151:[kia],k151at:[{...kia,role:'소형전술차 플랫폼 · 현궁 통합 업체는 별도 확인 중'}],
 k216:[{name:'한화 계열 지상방산 사업',role:'2018 공식 자료의 K200 계열 K216 소개 · 당시 사업 기준',url:'https://www.hanwha.com/content/dam/hanwha/download/Hanwha_Profile_2018_en.pdf'}],
 k242:[{name:'한화 계열 지상방산 사업',role:'2018 공식 자료의 K200 계열 K242 소개 · 당시 사업 기준',url:'https://www.hanwha.com/content/dam/hanwha/download/Hanwha_Profile_2018_en.pdf'}],
};
export function equipmentCompanies(id){
 return additions[id]||profiles[id]?.organizations.filter(org=>org.type==='기업').map(org=>({name:org.name,role:org.role,url:sources[org.source]?.url})).filter(org=>org.url)||[];
}
