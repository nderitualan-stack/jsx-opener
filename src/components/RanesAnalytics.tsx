import { useState, useMemo, useRef, useEffect } from "react";
import {
  ComposedChart, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, Cell
} from "recharts";

/* ─── PALETTE ──────────────────────────────────────────── */
const M="#7B0028",M2="#9B0033",M3="#C0003E",M4="#4A0018",M5="#3A0012";
const N="#0B1829",N2="#0F2240",N3="#162E54",N4="#1E3D6E",N5="#264D8A";
const GD="#C8962A",GD2="#E5B94A";
const WH="#FFFFFF",BG2="#F7F9FC",BRD="#E2E8F0";
const TX="#1A2B40",TX2="#4A5E78",TX3="#8A9BB8";
const M_BG="#FBF0F3",N_BG="#EEF3FC";
const AN="'Arial Narrow',Arial,sans-serif";

/* ─── LOGO using uploaded image ────────────────────────── */
function LogoLockup({onClick,onDark=false}){
  return(
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}}>
      <img src="/images/ranes-logo.png" alt="Ranes Analytics" style={{height:40,width:"auto"}}/>
    </div>
  );
}

/* ─── BRAND ROBOT AVATAR (navy + maroon) ───────────────── */
function RobotAvatar({size=32}:{size?:number}){
  return(
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="14" width="20" height="14" rx="3" fill={N2}/>
      <rect x="8" y="5" width="16" height="12" rx="2.5" fill={N3}/>
      <line x1="16" y1="5" x2="16" y2="2" stroke={M3} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="16" cy="1.5" r="1.5" fill={M3}/>
      <rect x="10" y="9" width="4" height="3" rx="1" fill={M3}/>
      <rect x="18" y="9" width="4" height="3" rx="1" fill={M3}/>
      <rect x="10.5" y="9.5" width="3" height="2" rx="0.5" fill={M2} opacity="0.6"/>
      <rect x="18.5" y="9.5" width="3" height="2" rx="0.5" fill={M2} opacity="0.6"/>
      <rect x="11" y="13.5" width="10" height="1.5" rx="0.75" fill={N4}/>
      <rect x="9" y="17" width="14" height="7" rx="1.5" fill={N4} opacity="0.6"/>
      <rect x="11" y="19" width="3" height="3" rx="0.5" fill={M}/>
      <rect x="15" y="18" width="3" height="4" rx="0.5" fill={M2}/>
      <rect x="19" y="20" width="2" height="2" rx="0.5" fill={M3}/>
      <rect x="2" y="15" width="4" height="8" rx="2" fill={N3}/>
      <rect x="26" y="15" width="4" height="8" rx="2" fill={N3}/>
      <rect x="14" y="12.5" width="4" height="2" rx="1" fill={N4}/>
    </svg>
  );
}

/* ─── NAV ICON SVGs ────────────────────────────────────── */
function NavIcon({id,size=14,col="#fff"}:{id:string;size?:number;col?:string}){
  const w=size,h=size;
  if(id==="dashboard") return <svg width={w} height={h} viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="6" rx="1" fill={col} opacity="0.9"/><rect x="8" y="1" width="5" height="3" rx="1" fill={col} opacity="0.7"/><rect x="1" y="9" width="5" height="4" rx="1" fill={col} opacity="0.6"/><rect x="8" y="6" width="5" height="7" rx="1" fill={col} opacity="0.8"/></svg>;
  if(id==="active") return <svg width={w} height={h} viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke={col} strokeWidth="1.2"/><circle cx="7" cy="7" r="2.5" fill={col} opacity="0.5"/><circle cx="7" cy="7" r="1.2" fill={col}/></svg>;
  if(id==="deals") return <svg width={w} height={h} viewBox="0 0 14 14" fill="none"><rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke={col} strokeWidth="1.2"/><path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke={col} strokeWidth="1" strokeLinecap="round"/></svg>;
  if(id==="news") return <svg width={w} height={h} viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke={col} strokeWidth="1.2"/><rect x="3.5" y="4.5" width="3" height="3" rx="0.5" fill={col} opacity="0.6"/><path d="M8 5.5h3M8 7h3M3.5 9h7" stroke={col} strokeWidth="1" strokeLinecap="round"/></svg>;
  if(id==="ai") return <svg width={w} height={h} viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke={col} strokeWidth="1.2"/><circle cx="4.8" cy="6" r="0.9" fill={col}/><circle cx="9.2" cy="6" r="0.9" fill={col}/><path d="M4.5 9.5C5 8.5 5.8 8 7 8s2 .5 2.5 1.5" stroke={col} strokeWidth="1" strokeLinecap="round"/></svg>;
  if(id==="svc") return <svg width={w} height={h} viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke={col} strokeWidth="1.2"/><path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke={col} strokeWidth="1.2" strokeLinecap="round"/></svg>;
  return <span style={{color:col,fontSize:size}}>·</span>;
}

/* ─── KPI ICON SVGs ────────────────────────────────────── */
function KPIIcon({id}:{id:string}){
  const c=M,n=N4,sz=22;
  const p={width:sz,height:sz};
  if(id==="cal") return <svg {...p} viewBox="0 0 22 22" fill="none"><rect x="2" y="4" width="18" height="15" rx="2" stroke={c} strokeWidth="1.4"/><path d="M2 8h18" stroke={c} strokeWidth="1.3"/><path d="M7 2v3M15 2v3" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="13" r="1" fill={c} opacity="0.6"/><circle cx="11" cy="13" r="1" fill={c} opacity="0.6"/><circle cx="15" cy="13" r="1" fill={c} opacity="0.6"/></svg>;
  if(id==="money") return <svg {...p} viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8.5" stroke={c} strokeWidth="1.4"/><path d="M11 6v1.5M11 14.5V16" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><path d="M8 9.5c0-1.1.9-2 2.5-2s2.5.9 2.5 2-1.8 1.8-2.5 2-2.5.9-2.5 2 .9 2 2.5 2 2.5-.9 2.5-2" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>;
  if(id==="trophy") return <svg {...p} viewBox="0 0 22 22" fill="none"><path d="M7 3h8v7a4 4 0 01-8 0V3z" stroke={c} strokeWidth="1.4"/><path d="M4.5 4.5H7M15 4.5h2.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><path d="M11 14v3.5M7.5 17.5h7" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  if(id==="peak") return <svg {...p} viewBox="0 0 22 22" fill="none"><path d="M3 16l5-6 4 3 5-8 2 11" stroke={c} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/><path d="M3 19h16" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>;
  if(id==="down") return <svg {...p} viewBox="0 0 22 22" fill="none"><path d="M11 4v14M5 14l6 6 6-6" stroke={n} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if(id==="up") return <svg {...p} viewBox="0 0 22 22" fill="none"><path d="M11 18V4M5 8l6-6 6 6" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if(id==="hash") return <svg {...p} viewBox="0 0 22 22" fill="none"><path d="M5 9h12M5 13h12M9 4l-2 14M13 4l-2 14" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>;
  if(id==="star") return <svg {...p} viewBox="0 0 22 22" fill="none"><path d="M11 2.5l2.4 5h5.1l-4.2 3.2 1.6 5.3-4.9-3.3-4.9 3.3 1.6-5.3L3.5 7.5h5.1z" stroke={c} strokeWidth="1.3"/></svg>;
  return <span style={{color:c,fontSize:sz-4}}>·</span>;
}

/* ─── COUNTRY BADGE (no flag emojis) ───────────────────── */
function FlagBadge({code,size=20}:{code:string;size?:number}){
  const COLS:Record<string,string>={NG:M,EG:N4,KE:M2,ZA:N3,MA:"#1A6E3C",CI:M4,GH:N5,SN:M3,TZ:N4,TN:M4,RW:M5};
  const col=COLS[code]||TX3;
  return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size*1.6,height:size,borderRadius:3,background:col+"22",border:`1px solid ${col}55`,fontFamily:AN,fontSize:size*0.52,fontWeight:700,color:col,letterSpacing:0.5,flexShrink:0}}>{code}</span>;
}

/* ─── CSV EXPORT ───────────────────────────────────────── */
function exportToCSV(data:any[],filename:string){
  if(!data||!data.length) return;
  const headers=Object.keys(data[0]);
  const rows=[headers.join(","),...data.map(row=>headers.map(h=>{const v=String(row[h]??"").replace(/"/g,'""');return v.includes(",")?`"${v}"`:v;}).join(","))];
  const blob=new Blob([rows.join("\n")],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=filename||"ranes-export.csv";a.click();
  URL.revokeObjectURL(url);
}

/* ─── DATA 2019–Q1 2026 ─────────────────────────────────── */
const ANNUAL=[
  {year:"2019",total:2100,equity:1900,debt:200,deals:427,investors:450,unicorns:0,topSector:"Fintech",note:"Pre-COVID momentum; strong Nigeria and Kenya growth"},
  {year:"2020",total:900,equity:800,debt:100,deals:359,investors:420,unicorns:1,topSector:"Fintech",note:"COVID impact; Flutterwave and Wave raised major rounds"},
  {year:"2021",total:4300,equity:3800,debt:500,deals:818,investors:780,unicorns:5,topSector:"Fintech",note:"Record boom; 12 mega-deals; OPay $400M; TymeBank and Flutterwave unicorns"},
  {year:"2022",total:5000,equity:4100,debt:900,deals:1034,investors:987,unicorns:4,topSector:"Fintech",note:"All-time peak; Africa only region with positive YoY globally; 1,000+ investors"},
  {year:"2023",total:2900,equity:1700,debt:1200,deals:668,investors:527,unicorns:2,topSector:"Fintech",note:"Funding winter; -42% YoY; equity -60%; global rate hikes drove US VC retreat"},
  {year:"2024",total:2200,equity:1500,debt:700,deals:490,investors:330,unicorns:1,topSector:"Fintech",note:"-25% YoY; 2nd consecutive decline; Egypt and SA resilient; debt growing"},
  {year:"2025",total:3200,equity:2000,debt:1200,deals:700,investors:346,unicorns:3,topSector:"Logistics/Energy",note:"+40% rebound; strongest since 2022; Q4 $997M record quarter; 8 deals over $100M"},
  {year:"2026 Q1",total:711,equity:212,debt:499,deals:75,investors:180,unicorns:0,topSector:"Fintech",note:"Debt 57% of capital (historic first); Egypt leads; logistics +340% YoY"},
];

const QUARTERLY=[
  {q:"Q1 '22",year:2022,total:1410,equity:1150,debt:260,deals:258},{q:"Q2 '22",year:2022,total:1320,equity:1080,debt:240,deals:270},
  {q:"Q3 '22",year:2022,total:1180,equity:980,debt:200,deals:268},{q:"Q4 '22",year:2022,total:1090,equity:890,debt:200,deals:238},
  {q:"Q1 '23",year:2023,total:900,equity:540,debt:360,deals:185},{q:"Q2 '23",year:2023,total:820,equity:490,debt:330,deals:178},
  {q:"Q3 '23",year:2023,total:700,equity:420,debt:280,deals:162},{q:"Q4 '23",year:2023,total:480,equity:250,debt:230,deals:143},
  {q:"Q1 '24",year:2024,total:520,equity:360,debt:160,deals:132},{q:"Q2 '24",year:2024,total:580,equity:400,debt:180,deals:118},
  {q:"Q3 '24",year:2024,total:620,equity:430,debt:190,deals:130},{q:"Q4 '24",year:2024,total:480,equity:310,debt:170,deals:110},
  {q:"Q1 '25",year:2025,total:408,equity:245,debt:163,deals:145},{q:"Q2 '25",year:2025,total:795,equity:490,debt:305,deals:180},
  {q:"Q3 '25",year:2025,total:1000,equity:620,debt:380,deals:210},{q:"Q4 '25",year:2025,total:997,equity:645,debt:352,deals:165},
  {q:"Q1 '26",year:2026,total:711,equity:212,debt:499,deals:75},
];

const MONTHLY=[
  {m:"Oct '24",equity:160,debt:60,deals:42},{m:"Nov '24",equity:140,debt:55,deals:38},
  {m:"Dec '24",equity:180,debt:60,deals:30},{m:"Jan '25",equity:82,debt:55,deals:48},
  {m:"Feb '25",equity:60,debt:59,deals:38},{m:"Mar '25",equity:103,debt:49,deals:59},
  {m:"Apr '25",equity:148,debt:90,deals:62},{m:"May '25",equity:178,debt:108,deals:60},
  {m:"Jun '25",equity:164,debt:107,deals:58},{m:"Jul '25",equity:218,debt:132,deals:72},
  {m:"Aug '25",equity:199,debt:121,deals:68},{m:"Sep '25",equity:203,debt:127,deals:70},
  {m:"Oct '25",equity:198,debt:232,deals:58},{m:"Nov '25",equity:162,debt:84,deals:48},
  {m:"Dec '25",equity:285,debt:108,deals:59},{m:"Jan '26",equity:140,debt:102,deals:26},
  {m:"Feb '26",equity:188,debt:159,deals:33},{m:"Mar '26",equity:112,debt:78,deals:18},
];

const COUNTRY_HIST=[
  {country:"Nigeria",flag:"NG",y2021:1570,y2022:1680,y2023:400,y2024:380,y2025:520,q1_26:78},
  {country:"Egypt",flag:"EG",y2021:490,y2022:730,y2023:590,y2024:310,y2025:820,q1_26:190},
  {country:"Kenya",flag:"KE",y2021:760,y2022:1050,y2023:674,y2024:420,y2025:610,q1_26:114},
  {country:"S.Africa",flag:"ZA",y2021:480,y2022:860,y2023:590,y2024:480,y2025:560,q1_26:157},
  {country:"Morocco",flag:"MA",y2021:60,y2022:110,y2023:90,y2024:120,y2025:190,q1_26:23},
  {country:"Ghana",flag:"GH",y2021:260,y2022:340,y2023:27,y2024:10,y2025:38,q1_26:4},
];

const SECTOR_HIST=[
  {sector:"Fintech",y2022:2100,y2023:980,y2024:650,y2025:890,q1_26:221,irr:24},
  {sector:"Logistics",y2022:480,y2023:210,y2024:180,y2025:420,q1_26:149,irr:31},
  {sector:"Energy",y2022:340,y2023:280,y2024:310,y2025:580,q1_26:141,irr:28},
  {sector:"Agritech",y2022:390,y2023:220,y2024:170,y2025:210,q1_26:58,irr:19},
  {sector:"Healthtech",y2022:330,y2023:190,y2024:160,y2025:240,q1_26:34,irr:22},
  {sector:"E-Commerce",y2022:480,y2023:200,y2024:120,y2025:180,q1_26:50,irr:23},
  {sector:"B2B SaaS",y2022:240,y2023:130,y2024:100,y2025:160,q1_26:28,irr:26},
  {sector:"Defence",y2022:10,y2023:15,y2024:20,y2025:60,q1_26:33,irr:38},
];

const ALL_DEALS:any[]=[
  {company:"SolarAfrica",flag:"ZA",country:"South Africa",sector:"Energy",year:2026,quarter:"Q1",amount:94,round:"Project Debt",type:"debt",investors:"Rand Merchant Bank, Investec",url:"https://innovation-village.com/african-startup-funding-jumps-to-346-9-million-in-february-2026/"},
  {company:"ValU",flag:"EG",country:"Egypt",sector:"Fintech",year:2026,quarter:"Q1",amount:63.6,round:"Debt",type:"debt",investors:"National Bank of Egypt",url:"https://thecondia.com/african-startups-funding-q1-2026/"},
  {company:"Spiro",flag:"KE",country:"Kenya",sector:"E-Mobility",year:2026,quarter:"Q1",amount:57,round:"Debt",type:"debt",investors:"Mirova, BII",url:"https://techcabal.com/2026/03/12/africas-2026-startup-funding/"},
  {company:"Sistema.bio",flag:"KE",country:"Kenya",sector:"Agritech",year:2026,quarter:"Q1",amount:53,round:"Growth",type:"equity",investors:"Novastar, IFC",url:"https://insights.techcabal.com/over-700m-raised-in-q1-2026/"},
  {company:"Breadfast",flag:"EG",country:"Egypt",sector:"E-Commerce",year:2026,quarter:"Q1",amount:50,round:"Pre-Series C",type:"equity",investors:"Undisclosed",url:"https://launchbaseafrica.com/2026/04/01/africas-most-active-startup-investors-in-q1-2026-and-where-they-put-their-money/"},
  {company:"GoCab",flag:"CI",country:"Cote d'Ivoire",sector:"Mobility",year:2026,quarter:"Q1",amount:45,round:"Growth",type:"hybrid",investors:"Azur Innovation Fund",url:"https://thecondia.com/african-startups-funding-q1-2026/"},
  {company:"Terra Industries",flag:"NG",country:"Nigeria",sector:"Defence",year:2026,quarter:"Q1",amount:33,round:"Multi-tranche",type:"equity",investors:"Lux Capital, Nova Global",url:"https://techcabal.com/2026/03/12/africas-2026-startup-funding/"},
  {company:"Zeno",flag:"KE",country:"Kenya",sector:"E-Mobility",year:2026,quarter:"Q1",amount:25,round:"Series A",type:"equity",investors:"Novastar Ventures",url:"https://launchbaseafrica.com/2026/03/02/african-startup-funding-in-early-2026-more-money-less-venture/"},
  {company:"Wasoko",flag:"KE",country:"Kenya",sector:"Logistics",year:2025,quarter:"Q4",amount:125,round:"Series B",type:"equity",investors:"Tiger Global",url:"https://technext24.com/2026/01/12/funding-african-startups-raised-32b-2025/"},
  {company:"Helios Towers",flag:"GH",country:"Ghana",sector:"Telecom",year:2025,quarter:"Q3",amount:120,round:"Debt",type:"debt",investors:"IFC, multiple DFIs",url:"https://technext24.com/2026/01/12/funding-african-startups-raised-32b-2025/"},
  {company:"Moniepoint",flag:"NG",country:"Nigeria",sector:"Fintech",year:2025,quarter:"Q1",amount:110,round:"Series C",type:"equity",investors:"Development Partners, Google",url:"https://techcabal.com/2025/02/04/moniepoint-series-c/"},
  {company:"Bboxx",flag:"RW",country:"Pan-African",sector:"Energy",year:2025,quarter:"Q3",amount:100,round:"Series D",type:"equity",investors:"Tokyo Gas, Mitsubishi",url:"https://technext24.com/2026/01/12/funding-african-startups-raised-32b-2025/"},
  {company:"Wave",flag:"SN",country:"Senegal",sector:"Fintech",year:2025,quarter:"Q4",amount:90,round:"Series B",type:"equity",investors:"Sequoia Heritage, Founders Fund",url:"https://techcabal.com/2025/wave/"},
  {company:"MNT-Halan",flag:"EG",country:"Egypt",sector:"Fintech",year:2024,quarter:"Q1",amount:157,round:"Series D",type:"equity",investors:"GB Corp, Global Ventures",url:"https://disrupt-africa.com/2024/"},
  {company:"Moove",flag:"NG",country:"Nigeria",sector:"Mobility",year:2024,quarter:"Q2",amount:100,round:"Series B",type:"equity",investors:"Uber",url:"https://disrupt-africa.com/2024/"},
  {company:"Flutterwave",flag:"NG",country:"Nigeria",sector:"Fintech",year:2022,quarter:"Q1",amount:250,round:"Series D",type:"equity",investors:"B Capital, Altimeter",url:"https://techcabal.com/2022/flutterwave/"},
  {company:"OPay",flag:"NG",country:"Nigeria",sector:"Fintech",year:2022,quarter:"Q1",amount:400,round:"Series C+",type:"equity",investors:"SoftBank Vision Fund",url:"https://disrupt-africa.com/2022/"},
  {company:"TymeBank",flag:"ZA",country:"South Africa",sector:"Fintech",year:2022,quarter:"Q2",amount:180,round:"Series C",type:"equity",investors:"Apis Growth Fund, Norrsken",url:"https://disrupt-africa.com/2022/"},
  {company:"TradeDepot",flag:"NG",country:"Nigeria",sector:"Logistics",year:2022,quarter:"Q4",amount:110,round:"Series B",type:"equity",investors:"IFC, Novastar",url:"https://disrupt-africa.com/2022/"},
  {company:"Chipper Cash",flag:"GH",country:"Pan-African",sector:"Fintech",year:2021,quarter:"Q2",amount:250,round:"Series C",type:"equity",investors:"FTX Ventures, Bezos Expeditions",url:"https://disrupt-africa.com/2021/"},
  {company:"Andela",flag:"NG",country:"Nigeria",sector:"B2B SaaS",year:2021,quarter:"Q4",amount:200,round:"Series E",type:"equity",investors:"SoftBank Vision Fund",url:"https://disrupt-africa.com/2021/"},
  {company:"OPay",flag:"NG",country:"Nigeria",sector:"Fintech",year:2021,quarter:"Q3",amount:400,round:"Series C",type:"equity",investors:"SoftBank, QED Investors",url:"https://disrupt-africa.com/2021/"},
];

const ACTIVE_DEALS=[
  {company:"Arc Ride",flag:"KE",city:"Nairobi",sector:"E-Mobility",stage:"Series A",range:"$8M–$15M",status:"Closing",desc:"EV motorcycle ride-hailing in Nairobi. Novastar-backed Q1 2026.",investors:"Novastar Ventures",confidence:92,source:"LaunchBase / TechCabal Q1"},
  {company:"NowPay",flag:"EG",city:"Cairo",sector:"HR Fintech",stage:"Series B",range:"$12M–$20M",status:"Announced",desc:"Earned-wage-access fintech. Active fundraise Jan 2026.",investors:"Egypt institutional",confidence:88,source:"TechCabal / Africa:TBD"},
  {company:"GoSwap",flag:"TN",city:"Tunis",sector:"BaaS",stage:"Seed+",range:"$3M–$6M",status:"Closing",desc:"Battery-swapping for EV 2/3-wheelers across North Africa. Azur confirmed.",investors:"Azur Innovation Fund",confidence:91,source:"LaunchBase Africa Q1"},
  {company:"Axmed",flag:"KE",city:"Nairobi",sector:"Healthtech",stage:"Series A",range:"$10M–$18M",status:"Closing",desc:"Health supply chain and pharma distribution. Equity round Feb 2026.",investors:"Impact DFI",confidence:86,source:"Innovation Village"},
  {company:"OmniRetail",flag:"NG",city:"Lagos",sector:"B2B E-Commerce",stage:"Series B",range:"$25M–$40M",status:"In-process",desc:"B2B FMCG distribution. Flour Mills anchored Series A. Q2 2026 target.",investors:"Flour Mills, TLcom",confidence:74,source:"Global Venturing"},
];

const NEWS=[
  {title:"African startups raise $711M in Q1 2026, debt overtakes equity for first time",source:"TechCabal Insights",date:"Apr 2 2026",url:"https://insights.techcabal.com/over-700m-raised-in-q1-2026/",s:"neutral"},
  {title:"2025 rebound: African startups raise $3.2B, 40% year on year growth",source:"Technext24",date:"Jan 2026",url:"https://technext24.com/2026/01/12/funding-african-startups-raised-32b-2025/",s:"positive"},
  {title:"IFC leads Q1 2026 with 4 deals; Novastar and Azur close 3 each",source:"LaunchBase Africa",date:"Apr 1 2026",url:"https://launchbaseafrica.com/2026/04/01/africas-most-active-startup-investors-in-q1-2026-and-where-they-put-their-money/",s:"positive"},
  {title:"SolarAfrica closes $94M project debt from Rand Merchant Bank",source:"Innovation Village",date:"Feb 2026",url:"https://innovation-village.com/african-startup-funding-jumps-to-346-9-million-in-february-2026/",s:"positive"},
  {title:"US investor participation in African deals crashes 53% in early 2026",source:"LaunchBase Africa",date:"Mar 2026",url:"https://launchbaseafrica.com/2026/03/02/african-startup-funding-in-early-2026-more-money-less-venture/",s:"negative"},
  {title:"Logistics overtakes fintech in Feb 2026, Spiro $57M and GoCab $45M lead",source:"TechCabal",date:"Mar 2026",url:"https://techcabal.com/2026/03/12/africas-2026-startup-funding/",s:"positive"},
  {title:"2023 funding winter: Africa startup funding falls 42% as global VCs retreat",source:"Infomineo",date:"Jan 2024",url:"https://infomineo.com/funding-trends/african-startup-ecosystem-rise-challenges-and-resilience/",s:"negative"},
  {title:"Egypt startup funding surges 130% in 2025, $330M raised",source:"Futurize / Techpoint Africa",date:"Aug 2025",url:"https://www.futurize.studio/blog/startup-funding-in-africa-2025",s:"positive"},
];

const LEGAL:Record<string,any>={
  privacy:{title:"Privacy Policy",secs:[
    {h:"Data Controller",t:"Ranes Analytics. To contact us, use the message form at the bottom of this page."},
    {h:"Data We Collect",t:"Registration data (name, email, company); usage data (search queries, features used). No payment data is collected at this time."},
    {h:"Your Rights",t:"Under GDPR, Kenya DPA 2019 and Nigeria NDPR: access, rectification, erasure, restriction, portability. Submit requests via the contact form. Complaints to ODPC (Kenya) or NITDA (Nigeria)."},
    {h:"Last Updated",t:"April 2026, Ranes Analytics."},
  ]},
  terms:{title:"Terms & Conditions",secs:[
    {h:"Parties",t:"Ranes Analytics operates this platform. By accessing it you agree to these Terms."},
    {h:"Not Investment Advice",t:"Nothing on Ranes Analytics constitutes investment advice, a solicitation, or a regulated financial service."},
    {h:"Access",t:"Ranes Analytics is currently free to access. Exclusive premium features may be introduced in future. You will be notified in advance."},
    {h:"Governing Law",t:"Laws of Kenya. Disputes: High Court of Kenya, Commercial Division, Nairobi. April 2026."},
  ]},
  gdpr:{title:"GDPR Compliance",secs:[
    {h:"Controller",t:"Ranes Analytics. Contact us via the message form on this platform."},
    {h:"Privacy by Design",t:"GDPR Article 25: data minimisation, purpose limitation, automated deletion schedules."},
    {h:"Breach Notification",t:"Supervisory authority notified within 72 hours (Article 33). Affected users notified for high-risk breaches (Article 34)."},
  ]},
  kdpa:{title:"Kenya & Nigeria DPA",secs:[
    {h:"Kenya DPA 2019",t:"Ranes Analytics complies with Kenya's Data Protection Act 2019."},
    {h:"Nigeria NDPR",t:"Ranes Analytics complies with NDPR 2019 as administered by NITDA."},
    {h:"Contact",t:"Use the contact form at the bottom of this platform."},
  ]},
  disclaimer:{title:"Investment Disclaimer",secs:[
    {h:"Informational Only",t:"All content is for informational and research purposes only. Nothing constitutes investment advice or an offer to purchase any security."},
    {h:"Not Regulated",t:"Ranes Analytics is not authorised by CMA (Kenya), SEC (Nigeria), FSCA (South Africa), or any financial regulator."},
    {h:"Data Accuracy",t:"IRR proxies are estimates. Not guarantees of future returns. Always conduct independent due diligence."},
    {h:"Contact",t:"Use the contact form on this platform. Ranes Analytics. 2026."},
  ]},
};

const SECTORS_LIST=["All","Fintech","Energy","Logistics","E-Mobility","Agritech","Healthtech","E-Commerce","B2B SaaS","Mobility","Proptech","Defence","Telecom"];
const COUNTRIES_LIST=["All","Nigeria","Kenya","Egypt","South Africa","Ghana","Morocco","Senegal","Cote d'Ivoire","Tanzania","Pan-African"];
const TYPES_LIST=["All","equity","debt","hybrid"];

/* ─── ANALYTICS ENGINE ─────────────────────────────────── */
const Analytics={
  sectorQ1(){ return SECTOR_HIST.map(s=>({label:s.sector,value:s.q1_26||0,irr:s.irr})).sort((a,b)=>b.value-a.value); },
  countryQ1(){ return COUNTRY_HIST.map(c=>({label:c.country,value:c.q1_26})).sort((a,b)=>b.value-a.value); },
  annualTrend(){ return ANNUAL.map(y=>({label:y.year,value:y.equity,value2:y.debt})); },
  topDeals(n=8){ return [...ALL_DEALS].sort((a:any,b:any)=>b.amount-a.amount).slice(0,n); },
  chartForQuery(q:string){
    const l=q.toLowerCase();
    if(/sector|fintech|logistic|energy|agritech|climate/i.test(l))
      return {type:"bar",title:"Q1 2026 Sector Funding ($M)",data:this.sectorQ1().slice(0,7),colors:[M,N4,GD,M3,N5,M4,M2]};
    if(/annual|year|trend|2019|2020|2021|2022|2023|2024|2025/i.test(l))
      return {type:"bar",title:"Annual Funding 2019–2026 ($M)",data:ANNUAL.map(y=>({label:y.year,value:y.total})),colors:[M]};
    if(/country|nigeria|kenya|egypt|south africa/i.test(l))
      return {type:"bar",title:"Country Funding Q1 2026 ($M)",data:this.countryQ1(),colors:[M,N4,GD,M3,N5,M4]};
    if(/irr|return|benchmark/i.test(l))
      return {type:"bar",title:"IRR Proxy by Sector (%)",data:this.sectorQ1().map(s=>({label:s.label,value:s.irr})).sort((a,b)=>b.value-a.value),colors:[M]};
    return null;
  },
};

/* ─── FALLBACK RESPONSES ───────────────────────────────── */
function FALLBACK(q:string){
  const l=q.toLowerCase();
  if(/founder|raising|series.a|series.b|seed|pre.seed|investor.for|who.invest|right.investor|screen/i.test(l)) return "**Investor Screening, Local Data:**\n\nBased on Q1 2026 activity:\n\n**Most active by deal count:** IFC (4 deals), Novastar Ventures (3), Azur Innovation Fund (3), Mirova (2), Partech Africa (2), TLcom Capital (2), BII (2)\n\n**By stage:**\n• Pre-seed to Seed: Azur Innovation Fund (Francophone/North Africa), Enza Capital (MENA), Novastar (East Africa)\n• Series A: Novastar, Partech Africa, TLcom Capital, IFC\n• Series B+: IFC, BII, Mirova (debt/energy), Partech Africa\n\nUS investors fell 53% YoY in Q1 2026. DFIs (IFC, BII, Mirova) are now dominant.\n\nSource: LaunchBase Africa Q1 2026 Report";
  if(/active|fundrais|right now/i.test(l)) return "**Active Fundraises Q1/Q2 2026:**\n• **Arc Ride** (Kenya, E-Mobility, Series A, $8-15M) , Closing, Novastar-backed\n• **GoSwap** (Tunisia, BaaS, Seed+, $3-6M) , Closing, Azur confirmed\n• **NowPay** (Egypt, HR Fintech, Series B, $12-20M) , Announced\n• **Axmed** (Kenya, Healthtech, Series A, $10-18M) , Closing\n• **OmniRetail** (Nigeria, B2B E-Commerce, Series B, $25-40M) , Q2 2026\n\nSource: LaunchBase Africa Q1 2026";
  if(/irr|return|benchmark/i.test(l)) return "**IRR Proxy Benchmarks, Q1 2026:**\n• AI/DeepTech: ~42% (high risk)\n• Defence: ~38% (very high risk)\n• Logistics: ~31% (medium risk, structural breakout sector)\n• Energy: ~28% (low risk, asset-backed)\n• Fintech: ~24% (medium risk)\n• B2B SaaS: ~26% (medium risk)\n• Healthtech: ~22% (medium risk)\n• Agritech: ~19% (high risk, weather/FX exposure)\n\nSource: Ranes Analytics Benchmark Model";
  if(/2023|winter|crash/i.test(l)) return "**2023 Funding Winter:**\n• $2.9B raised, down 42% from $5.0B in 2022\n• Equity fell 60% year on year\n• US VCs retreated: 50% of investor count decline was North American\n• 527 active investors vs 987 in 2022\n\nSource: Africa:The Big Deal / AVCA Africa";
  if(/2025|rebound/i.test(l)) return "**2025 Rebound (+40% to $3.2B):**\n• $3.2B raised, strongest since 2022\n• Q4 2025: $997M record quarter\n• 8 deals over $100M (vs 5 in 2024)\n• Egypt surged 130% year on year\n\nSource: Technext24 / Africa:The Big Deal";
  if(/valuation|dilution|term|priced|safe|convertible/i.test(l)) return "**Deal Terms, African Market 2024-2026:**\n• Pre-seed: $200K-$1M, 10-20% dilution, SAFE or convertible common\n• Seed: $500K-$3M, 15-25% dilution\n• Series A: $3-15M, 20-30% dilution, board seat expected\n• Series B: $10-40M, 15-25% dilution\n• Revenue multiples: 3-8x ARR depending on sector\n\nNote: In Q1 2026, Series B equity rounds = zero. Debt is 57% of Q1 capital.\n\nSource: Africa:The Big Deal / LaunchBase Africa Q1 2026";
  return "**Q1 2026 Snapshot:**\n• $711M raised across 75 deals in 14 countries\n• Debt = 57% of capital (historic first)\n• Egypt leads by capital ($190M), Nigeria leads by deal count (14 deals)\n• Logistics surging +340% year on year\n\nTell me whether you are an investor or a founder and I will tailor my answer to what you actually need.\n\nSource: TechCabal Insights / Condia / LaunchBase Africa";
}

/* ─── INLINE MINI CHART ────────────────────────────────── */
function MiniChart({config}:any){
  if(!config||!config.data||!config.data.length) return null;
  const {title,data,colors=[M,N4,GD]}=config;
  return(
    <div style={{marginTop:14,marginBottom:4}}>
      <div style={{fontFamily:AN,fontSize:10,fontWeight:700,color:TX2,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8}}>{title}</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{left:-24,right:8,top:4,bottom:data.length>5?28:14}}>
          <CartesianGrid stroke={BRD} strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="label" tick={{fill:TX3,fontSize:9,fontFamily:"Arial Narrow,Arial"}} axisLine={false} tickLine={false} interval={0} angle={data.length>5?-30:0} textAnchor={data.length>5?"end":"middle"}/>
          <YAxis tick={{fill:TX3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={(v:number)=>v>=1000?`$${(v/1000).toFixed(1)}B`:`$${v}M`}/>
          <Tooltip contentStyle={{fontFamily:"Arial Narrow,Arial",fontSize:11,border:`1px solid ${BRD}`,borderRadius:6,background:WH}} formatter={(v:any)=>[v>=1000?`$${(v/1000).toFixed(1)}B`:`$${v}M`,"Value"]}/>
          <Bar dataKey="value" radius={[3,3,0,0]}>
            {data.map((_:any,i:number)=><Cell key={i} fill={colors[i%colors.length]}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── STYLES ───────────────────────────────────────────── */
const STYLES=`
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Arial Narrow',Arial,sans-serif;background:${WH};color:${TX};overflow-x:hidden;}
  ::-webkit-scrollbar{width:5px;background:${N3};}::-webkit-scrollbar-thumb{background:${N4};border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ticker{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.4s ease both;}
  .pulse{animation:pulse 1.8s ease-in-out infinite;}
  .spin{display:inline-block;animation:spin 0.9s linear infinite;}
  .card{background:${WH};border:1px solid ${BRD};border-radius:8px;transition:border-color 0.18s,box-shadow 0.18s;}
  .card:hover{border-color:${M}44;box-shadow:0 4px 16px ${M}10;}
  .card-tint{background:${BG2};border:1px solid ${BRD};border-radius:8px;}
  .btn{display:inline-flex;align-items:center;gap:6px;border:none;border-radius:5px;cursor:pointer;font-family:'Arial Narrow',Arial,sans-serif;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;transition:all 0.18s;}
  .bp{background:${M};color:#fff;padding:9px 20px;font-size:13px;}.bp:hover{background:${M2};transform:translateY(-1px);}
  .bs{background:${N3};color:#fff;padding:9px 18px;font-size:13px;}.bs:hover{background:${N4};}
  .bo{background:transparent;color:${TX2};border:1px solid ${BRD};padding:7px 14px;font-size:12px;}
  .bo:hover{border-color:${M};color:${M};background:${M_BG};}
  .bo.on{border-color:${M};color:${M};background:${M_BG};font-weight:700;}
  .nav-btn{background:none;border:none;cursor:pointer;font-family:'Arial Narrow',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;color:rgba(255,255,255,0.55);padding:6px 11px;border-radius:4px;transition:all 0.18s;border-bottom:2px solid transparent;}
  .nav-btn:hover{color:rgba(255,255,255,0.9);}.nav-btn.on{color:#fff;border-bottom-color:${M3};}
  .sb-btn{display:flex;align-items:center;gap:9px;width:100%;background:none;border:none;cursor:pointer;font-family:'Arial Narrow',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:rgba(255,255,255,0.5);padding:9px 14px;border-radius:5px;transition:all 0.18s;border-left:3px solid transparent;text-align:left;}
  .sb-btn:hover{color:#fff;background:rgba(255,255,255,0.08);}.sb-btn.on{color:#fff;background:${M}28;border-left-color:${M3};}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;font-family:'Arial Narrow',Arial,sans-serif;}
  .bm{background:${M_BG};color:${M};border:1px solid ${M}33;}.bn{background:${N_BG};color:${N4};border:1px solid ${N4}33;}
  .bgn{background:#F0FAF4;color:#1A6E3C;border:1px solid #1A6E3C44;}.brd{background:#FFF0F0;color:#C0392B;border:1px solid #C0392B44;}
  .bbl{background:#EEF4FF;color:${N4};border:1px solid ${N4}44;}.bhy{background:#F0FAF0;color:#2D7A2D;border:1px solid #2D7A2D44;}
  .bg{background:#FFFBEA;color:${GD};border:1px solid ${GD}44;}.bcl{background:#FFFBEA;color:${GD};border:1px solid ${GD};}
  .ban{background:${M_BG};color:${M};border:1px solid ${M};}.bip{background:${N_BG};color:${N4};border:1px solid ${N4};}
  input,select,textarea{background:${WH};border:1px solid ${BRD};color:${TX};border-radius:5px;padding:9px 13px;font-family:'Arial Narrow',Arial,sans-serif;font-size:13px;outline:none;transition:border 0.18s;}
  input:focus,select:focus{border-color:${M};box-shadow:0 0 0 3px ${M}15;}
  input::placeholder{color:${TX3};}select option{background:${WH};}
  .progress{height:5px;background:${BRD};border-radius:3px;overflow:hidden;}
  .pf{height:100%;border-radius:3px;background:linear-gradient(90deg,${M},${M2});transition:width 0.7s;}
  .src{display:inline-block;font-size:9px;color:${TX3};background:${BG2};border:1px solid ${BRD};border-radius:3px;padding:1px 6px;font-style:italic;font-family:'Arial Narrow',Arial,sans-serif;}
  .ldot{width:7px;height:7px;border-radius:50%;background:${GD2};display:inline-block;animation:pulse 1.4s ease-in-out infinite;}
  .chat-win{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:12px;background:${BG2};border:1px solid ${BRD};border-radius:8px 8px 0 0;border-bottom:none;}
  .row-user{display:flex;justify-content:flex-end;align-items:flex-end;gap:8px;animation:slideUp 0.22s ease both;}
  .bub-user{background:${M};color:#fff;padding:11px 14px;border-radius:18px 18px 4px 18px;font-size:13px;line-height:1.65;max-width:76%;font-family:'Arial Narrow',Arial,sans-serif;}
  .row-ai{display:flex;justify-content:flex-start;align-items:flex-end;gap:8px;animation:slideUp 0.22s ease both;}
  .bub-ai{background:${WH};color:${TX};padding:13px 15px;border-radius:18px 18px 18px 4px;font-size:13px;line-height:1.72;max-width:84%;border:1px solid ${BRD};font-family:'Arial Narrow',Arial,sans-serif;}
  .bub-sys{background:#FFFBEA;color:#7A5A00;padding:10px 14px;border-radius:8px;font-size:12px;border:1px solid ${GD}44;font-family:'Arial Narrow',Arial,sans-serif;}
  .row-sys{display:flex;justify-content:center;animation:slideUp 0.22s ease both;}
  .ai-lbl{font-size:9px;font-weight:700;color:${M};letter-spacing:0.5px;text-transform:uppercase;margin-bottom:5px;font-family:'Arial Narrow',Arial,sans-serif;}
  .dots{display:flex;gap:4px;padding:6px 0;}
  .dot{width:7px;height:7px;border-radius:50%;background:${TX3};animation:pulse 1.2s ease-in-out infinite;}
  .dot:nth-child(2){animation-delay:.2s;}.dot:nth-child(3){animation-delay:.4s;}
  .chips{padding:8px 14px;background:${WH};border:1px solid ${BRD};display:flex;gap:6px;flex-wrap:wrap;}
  .input-bar{display:flex;gap:10px;padding:11px 14px;background:${WH};border:1px solid ${BRD};border-top:none;border-radius:0 0 8px 8px;}
  .modal-ov{position:fixed;inset:0;background:rgba(11,24,41,0.78);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
  .modal-box{background:${WH};border:1px solid ${BRD};border-radius:10px;max-width:680px;width:100%;max-height:88vh;overflow-y:auto;animation:modalIn 0.22s ease both;}
  .tr-h:hover{background:${BG2};}
  a.ext{color:${M};text-decoration:none;font-family:'Arial Narrow',Arial,sans-serif;}a.ext:hover{color:${M2};text-decoration:underline;}
  .fl{background:none;border:none;color:rgba(255,255,255,0.42);font-size:12px;cursor:pointer;font-family:'Arial Narrow',Arial,sans-serif;transition:color 0.18s;padding:0;text-align:left;}.fl:hover{color:rgba(255,255,255,0.85);}
  table{border-collapse:collapse;width:100%;}
  th{background:${BG2};font-size:10px;letter-spacing:1px;color:${TX2};text-transform:uppercase;padding:11px 13px;text-align:left;border-bottom:2px solid ${BRD};white-space:nowrap;font-family:'Arial Narrow',Arial,sans-serif;}
  td{padding:10px 13px;border-bottom:1px solid ${BRD};font-size:13px;color:${TX};font-family:'Arial Narrow',Arial,sans-serif;}
  .sh{font-family:'Arial Narrow',Arial,sans-serif;font-size:24px;font-weight:700;color:${TX};}
  .sh-sub{font-size:13px;color:${TX2};margin-top:4px;font-family:'Arial Narrow',Arial,sans-serif;}
  .pill{background:${BG2};border:1px solid ${BRD};border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Arial Narrow',Arial,sans-serif;transition:all 0.18s;color:${TX2};}
  .pill:hover{border-color:${M};color:${M};}.pill.on{background:${M};color:#fff;border-color:${M};}
`;

/* ─── LEGAL MODAL ──────────────────────────────────────── */
function LegalModal({docKey,onClose}:{docKey:string;onClose:()=>void}){
  const doc=LEGAL[docKey];
  if(!doc) return null;
  return(
    <div className="modal-ov" onClick={(e:any)=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div style={{padding:"18px 22px",borderBottom:`1px solid ${BRD}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:WH,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <LogoLockup onClick={()=>{}}/>
            <div style={{width:1,height:28,background:BRD,margin:"0 4px"}}/>
            <span style={{fontFamily:AN,fontSize:18,fontWeight:700,color:TX}}>{doc.title}</span>
          </div>
          <button onClick={onClose} style={{background:BG2,border:`1px solid ${BRD}`,borderRadius:5,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke={TX2} strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{padding:"22px",display:"flex",flexDirection:"column",gap:16}}>
          {doc.secs.map((s:any,i:number)=>(
            <div key={i}>
              <div style={{fontSize:13,fontWeight:700,color:M,borderLeft:`3px solid ${M}`,paddingLeft:10,marginBottom:7,fontFamily:AN}}>{i+1}. {s.h}</div>
              <p style={{fontSize:13,color:TX2,lineHeight:1.75,paddingLeft:13,fontFamily:AN}}>{s.t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CONTACT BOX ──────────────────────────────────────── */
function ContactBox(){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [msg,setMsg]=useState("");
  const [sent,setSent]=useState(false);
  const [err,setErr]=useState("");

  const submit=()=>{
    if(!name.trim()||!email.trim()||!msg.trim()){setErr("Please fill in all fields.");return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setErr("Please enter a valid email address.");return;}
    const sub=encodeURIComponent("Ranes Analytics: Message from "+name);
    const body=encodeURIComponent("Name: "+name+"\nEmail: "+email+"\n\nMessage:\n"+msg);
    window.location.href="mailto:lava.lot23@gmail.com?subject="+sub+"&body="+body;
    setSent(true);setErr("");
  };

  return(
    <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"24px 26px",marginBottom:6}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="5" width="18" height="12" rx="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4"/><path d="M2 7l9 6 9-6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round"/></svg>
        <div>
          <div style={{fontFamily:AN,fontSize:16,fontWeight:700,color:WH}}>Get in Touch</div>
          <div style={{fontFamily:AN,fontSize:12,color:"rgba(255,255,255,0.45)"}}>Questions, partnerships, feedback</div>
        </div>
      </div>
      <div style={{height:1,background:"rgba(255,255,255,0.1)",marginBottom:18}}/>
      {sent?(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(26,110,60,0.2)",border:"2px solid rgba(26,110,60,0.5)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5 8-8" stroke="#5BEA8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{fontFamily:AN,fontSize:15,fontWeight:700,color:WH,marginBottom:4}}>Message prepared in your mail app</div>
          <div style={{fontFamily:AN,fontSize:12,color:"rgba(255,255,255,0.45)"}}>Just press Send to complete.</div>
          <button className="btn bo" style={{marginTop:14,fontSize:12}} onClick={()=>{setSent(false);setName("");setEmail("");setMsg("");}}>Send another</button>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{fontFamily:AN,fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Your Name</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:WH,borderRadius:6,padding:"9px 12px",fontFamily:AN,fontSize:13}}/>
          </div>
          <div>
            <div style={{fontFamily:AN,fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Your Email</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:WH,borderRadius:6,padding:"9px 12px",fontFamily:AN,fontSize:13}}/>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <div style={{fontFamily:AN,fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Message</div>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Tell us about your interest, partnership, data request, feedback, or just a hello!" rows={4} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:WH,borderRadius:6,padding:"9px 12px",fontFamily:AN,fontSize:13,resize:"vertical"}}/>
          </div>
          {err&&<div style={{gridColumn:"1/-1",fontFamily:AN,fontSize:12,color:"#FF9090"}}>{err}</div>}
          <div style={{gridColumn:"1/-1",display:"flex",justifyContent:"flex-end"}}>
            <button className="btn bp" onClick={submit} style={{padding:"10px 24px",fontSize:13}}>Send Message</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AI VIEW (uses Supabase edge function) ────────────── */
function AIView(){
  const WELCOME={role:"assistant" as const,content:"Good to have you here. I'm Ranes AI, built on seven years of verified African deal data.\n\nBefore I dive in: **are you an investor evaluating opportunities, or a founder working on a capital raise?** That shapes everything about how I answer.\n\nOr if you already have a specific question, just ask it and I'll route from there."};
  const [msgs,setMsgs]=useState<any[]>([WELCOME]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [sysNote,setSysNote]=useState("");
  const [activeTab,setActiveTab]=useState("chat");
  const btm=useRef<HTMLDivElement>(null);
  const inp=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(activeTab==="chat") btm.current?.scrollIntoView({behavior:"smooth"});
  },[msgs,loading,sysNote,activeTab]);

  const send=async(overrideQ?:string)=>{
    const q=(overrideQ||input).trim();
    if(!q||loading) return;
    setSysNote("");
    const history=[...msgs,{role:"user",content:q}];
    setMsgs(history);setInput("");setLoading(true);
    try{
      const res=await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ranes-chat`,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`},
        body:JSON.stringify({messages:history.map(m=>({role:m.role,content:m.content}))})
      });
      let data;try{data=await res.json();}catch{throw new Error("Response parse error.");}
      if(res.status===429){
        setSysNote("Rate limited, please wait a moment");
        setMsgs(p=>[...p,{role:"assistant",content:`Rate limited. From the Ranes Analytics database:\n\n${FALLBACK(q)}`,chart:Analytics.chartForQuery(q),isLocal:true}]);
        setLoading(false);return;
      }
      if(res.status===402){
        setSysNote("AI credits exhausted. Using local data.");
        setMsgs(p=>[...p,{role:"assistant",content:FALLBACK(q),chart:Analytics.chartForQuery(q),isLocal:true}]);
        setLoading(false);return;
      }
      if(!res.ok){
        setMsgs(p=>[...p,{role:"assistant",content:`${FALLBACK(q)}`,chart:Analytics.chartForQuery(q),isLocal:true}]);
        setLoading(false);return;
      }
      const text=data.content||"";
      setMsgs(p=>[...p,{role:"assistant",content:text||"Please try rephrasing.",chart:Analytics.chartForQuery(q)}]);
    }catch{
      setMsgs(p=>[...p,{role:"assistant",content:`Connection issue. Using local data.\n\n${FALLBACK(q)}`,chart:Analytics.chartForQuery(q),isLocal:true}]);
    }
    setLoading(false);setTimeout(()=>inp.current?.focus(),80);
  };

  const md=(t:string)=>t
    .replace(/\*\*(.*?)\*\*/g,`<strong style="color:${TX};font-weight:700">$1</strong>`)
    .replace(/`(.*?)`/g,`<code style="background:${BG2};border:1px solid ${BRD};border-radius:3px;padding:1px 5px;font-size:11px">$1</code>`)
    .replace(/^•\s/gm,`<span style="color:${M};font-weight:700">• </span>`)
    .replace(/\n\n/g,"<br/><br/>").replace(/\n/g,"<br/>");

  const SUGG=[
    {label:"I'm an investor",q:"I'm an investor. I'm looking at fintech opportunities in East Africa for a Series A cheque of around $5M. Where should I be looking?"},
    {label:"I'm a founder",q:"I'm a founder. We are a B2B logistics SaaS in Nigeria at $400K ARR, growing 15% month on month. Who are the right Series A investors for us?"},
    {label:"Top sectors now",q:"Which sectors are attracting the most capital in Africa right now and why?"},
    {label:"Who is investing",q:"Who are the most active investors in Africa in Q1 2026 and what are they backing?"},
    {label:"Fundraise benchmarks",q:"What are realistic Series A valuations and dilution ranges for African fintechs in 2025 and 2026?"},
    {label:"Annual trend",q:"Show me the annual African funding trend from 2019 to Q1 2026 with a chart"},
    {label:"Investor screening",q:"I need to screen investors for a $3M seed round in a Kenyan healthtech company. Who should I approach?"},
    {label:"IRR by sector",q:"What are the IRR proxy benchmarks by sector for African private market investments?"},
  ];

  const AnalyticsTab=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:N_BG,border:`1px solid ${N4}33`,borderRadius:8,padding:"12px 16px",fontSize:12,color:TX2,fontFamily:AN}}>These charts run directly on the verified Ranes Analytics dataset. No API call required.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[
          {title:"Q1 2026 Sector Funding ($M)",data:Analytics.sectorQ1().slice(0,7),colors:[M,N4,GD,M3,N5,M4,M2],key:"value",irrMode:false},
          {title:"Annual Funding 2019–2026 ($M)",data:ANNUAL.map(y=>({label:y.year,value:y.total})),colors:[M],key:"value",irrMode:false},
          {title:"IRR Proxy by Sector (%)",data:Analytics.sectorQ1().sort((a,b)=>b.irr-a.irr).map(s=>({label:s.label,value:s.irr})),colors:[M],key:"value",irrMode:true},
          {title:"Country Funding Q1 2026 ($M)",data:Analytics.countryQ1(),colors:[M,N4,GD,M3,N5,M4],key:"value",irrMode:false},
        ].map((ch,ci)=>(
          <div key={ci} className="card" style={{padding:"18px"}}>
            <div style={{fontFamily:AN,fontSize:12,fontWeight:700,color:TX,marginBottom:12}}>{ch.title}</div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={ch.data} layout="vertical" margin={{left:0,right:28,top:0,bottom:0}}>
                <XAxis type="number" tick={{fill:TX3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={(v:number)=>ch.irrMode?`${v}%`:`$${v}M`}/>
                <YAxis type="category" dataKey="label" tick={{fill:TX,fontSize:10,fontFamily:"Arial Narrow,Arial"}} axisLine={false} tickLine={false} width={80}/>
                <Tooltip contentStyle={{fontFamily:"Arial Narrow,Arial",fontSize:11,border:`1px solid ${BRD}`,borderRadius:6,background:WH}} formatter={(v:any)=>[ch.irrMode?`${v}%`:`$${v}M`,"Value"]}/>
                <Bar dataKey={ch.key} radius={[0,4,4,0]}>{ch.data.map((_:any,i:number)=><Cell key={i} fill={ch.colors[i%ch.colors.length]}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:"18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontFamily:AN,fontSize:13,fontWeight:700,color:TX}}>Top Deals, All Years</div>
          <button className="btn bp" style={{fontSize:11,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}
            onClick={()=>exportToCSV(ALL_DEALS.map((d:any)=>({Company:d.company,Country:d.country,Sector:d.sector,Year:d.year,Quarter:d.quarter||"",Amount_USD_M:d.amount,Round:d.round,Type:d.type,Investors:d.investors})),"ranes-all-deals.csv")}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M2 8l4 3 4-3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>Export all
          </button>
        </div>
        <div style={{overflow:"auto"}}>
          <table>
            <thead><tr>{["Company","Country","Sector","Year","Amount","Round","Type"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {Analytics.topDeals(8).map((d:any,i:number)=>(
                <tr key={i} className="tr-h">
                  <td style={{fontWeight:700}}><a href={d.url} target="_blank" rel="noreferrer" className="ext">{d.company}</a></td>
                  <td style={{color:TX2}}>{d.country}</td>
                  <td><span className="badge bn">{d.sector}</span></td>
                  <td style={{color:TX2}}>{d.year}</td>
                  <td style={{fontFamily:AN,fontWeight:700,color:M}}>${d.amount}M</td>
                  <td><span className="badge bm">{d.round}</span></td>
                  <td><span className={`badge ${d.type==="equity"?"bgn":d.type==="debt"?"bbl":"bhy"}`}>{d.type}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <RobotAvatar size={44}/>
          <div>
            <h2 className="sh">Ranes AI</h2>
            <p className="sh-sub">Dual-mode intelligence agent, African investment ecosystem, 2019–Q1 2026</p>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span className="ldot"/>
          <span style={{fontSize:11,color:GD,fontWeight:700,fontFamily:AN}}>LIVE</span>
          <span className="badge bgn">For Investors</span>
          <span className="badge bm">For Founders</span>
          <span className="badge bn">2019–Q1 2026</span>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <div style={{background:M_BG,border:`1px solid ${M}33`,borderRadius:7,padding:"10px 14px"}}>
          <div style={{fontFamily:AN,fontSize:10,fontWeight:700,color:M,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Investor Mode</div>
          <p style={{fontFamily:AN,fontSize:12,color:TX2,lineHeight:1.6}}>Sector trends, deal comps, country analysis, IRR benchmarks, active deal flow, due diligence context</p>
        </div>
        <div style={{background:N_BG,border:`1px solid ${N4}33`,borderRadius:7,padding:"10px 14px"}}>
          <div style={{fontFamily:AN,fontSize:10,fontWeight:700,color:N4,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Founder Mode</div>
          <p style={{fontFamily:AN,fontSize:12,color:TX2,lineHeight:1.6}}>Investor screening, raise benchmarks, term guidance, who is active in your sector, how to prepare</p>
        </div>
      </div>

      <div style={{display:"flex",gap:0,borderBottom:`2px solid ${BRD}`,marginBottom:18}}>
        {[["chat","Chat"],["analytics","Analytics"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{padding:"9px 20px",border:"none",background:"transparent",cursor:"pointer",fontFamily:AN,fontSize:12,fontWeight:700,letterSpacing:0.6,textTransform:"uppercase",color:activeTab===id?M:TX2,borderBottom:`2px solid ${activeTab===id?M:"transparent"}`,marginBottom:-2,transition:"all 0.18s"}}>{label}</button>
        ))}
      </div>

      {activeTab==="analytics"&&<AnalyticsTab/>}

      {activeTab==="chat"&&(
        <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 320px)",minHeight:480,maxHeight:680}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12,flexShrink:0}}>
            {SUGG.map((s,i)=>(
              <button key={i} className="btn bo" style={{fontSize:10,padding:"5px 12px",borderRadius:20}} onClick={()=>send(s.q)}>{s.label}</button>
            ))}
          </div>
          <div className="chat-win">
            {msgs.map((m:any,i:number)=>(
              <div key={i} className={m.role==="user"?"row-user":"row-ai"}>
                {m.role==="assistant"&&<div style={{flexShrink:0}}><RobotAvatar size={32}/></div>}
                <div className={m.role==="user"?"bub-user":"bub-ai"}>
                  {m.role==="assistant"&&(
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <div className="ai-lbl">Ranes AI</div>
                      {m.isLocal&&<span className="badge bg" style={{fontSize:8,padding:"1px 5px"}}>Local data</span>}
                    </div>
                  )}
                  <div dangerouslySetInnerHTML={{__html:md(m.content)}} style={{fontSize:13,lineHeight:1.78}}/>
                  {m.chart&&<MiniChart config={m.chart}/>}
                </div>
                {m.role==="user"&&<div style={{width:28,height:28,borderRadius:"50%",background:M,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:WH,flexShrink:0,fontFamily:AN}}>U</div>}
              </div>
            ))}
            {loading&&(
              <div className="row-ai">
                <div style={{flexShrink:0}}><RobotAvatar size={32}/></div>
                <div className="bub-ai">
                  <div className="ai-lbl">Ranes AI</div>
                  <div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
                </div>
              </div>
            )}
            {sysNote&&<div className="row-sys"><div className="bub-sys">{sysNote}</div></div>}
            <div ref={btm} style={{height:1}}/>
          </div>
          <div className="chips">
            {SUGG.slice(0,5).map((s,i)=>(
              <button key={i} className="btn bo" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>send(s.q)}>{s.label}</button>
            ))}
          </div>
          <div className="input-bar">
            <input ref={inp} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask about any sector, country, deal, investor or trend 2019–2026..." disabled={loading} style={{flex:1,opacity:loading?0.6:1}}/>
            <button className="btn bp" onClick={()=>send()} disabled={loading||!input.trim()} style={{opacity:(!input.trim()||loading)?0.5:1,minWidth:80,justifyContent:"center"}}>
              {loading?<span className="spin">⟳</span>:"Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── DASHBOARD ────────────────────────────────────────── */
function DashboardView(){
  const [period,setPeriod]=useState("annual");
  const [yearRange,setYearRange]=useState([2019,2026]);
  const [sectorF,setSectorF]=useState("All");
  const [countryF,setCountryF]=useState("All");
  const YEARS=["2019","2020","2021","2022","2023","2024","2025","2026"];
  const annualFiltered=ANNUAL.filter(d=>{const y=parseInt(d.year);return y>=yearRange[0]&&y<=yearRange[1];});
  const quarterlyFiltered=QUARTERLY.filter(d=>d.year>=yearRange[0]&&d.year<=yearRange[1]);
  const dealsFiltered=useMemo(()=>ALL_DEALS.filter((d:any)=>{
    if(sectorF!=="All"&&d.sector!==sectorF) return false;
    if(countryF!=="All"&&d.country!==countryF) return false;
    if(d.year<yearRange[0]) return false;
    if(d.year===2026&&yearRange[1]<2026) return false;
    return true;
  }),[sectorF,countryF,yearRange]);
  const totalFiltered=dealsFiltered.reduce((a:number,d:any)=>a+d.amount,0);
  const countryData=COUNTRY_HIST.map(c=>({
    country:c.country,flag:c.flag,
    value:Math.round((yearRange[0]<=2021?c.y2021:0)+(yearRange[0]<=2022&&yearRange[1]>=2022?c.y2022:0)+(yearRange[0]<=2023&&yearRange[1]>=2023?c.y2023:0)+(yearRange[0]<=2024&&yearRange[1]>=2024?c.y2024:0)+(yearRange[0]<=2025&&yearRange[1]>=2025?c.y2025:0)+(yearRange[1]>=2026?c.q1_26:0))
  })).sort((a,b)=>b.value-a.value).slice(0,6);
  const sectorYear=(yearRange[1]===2026?"q1_26":yearRange[1]===2025?"y2025":yearRange[1]===2024?"y2024":yearRange[1]===2023?"y2023":"y2022") as string;
  const sectorData=SECTOR_HIST.map(s=>({name:s.sector,amount:(s as any)[sectorYear]||0,irr:s.irr})).sort((a,b)=>b.amount-a.amount);
  const peakYear=[...annualFiltered].sort((a,b)=>b.total-a.total)[0];
  const totalInRange=annualFiltered.reduce((a,d)=>a+(parseInt(d.year)<2026?d.total:0),0)+(yearRange[1]>=2026?711:0);
  const CT=({active,payload,label}:any)=>{if(!active||!payload?.length)return null;return(<div style={{background:WH,border:`1px solid ${BRD}`,borderRadius:8,padding:"10px 14px",fontSize:12,fontFamily:AN}}><p style={{color:TX2,fontSize:11,marginBottom:5}}>{label}</p>{payload.map((p:any,i:number)=><p key={i} style={{color:p.color||TX,fontWeight:700}}>${p.value}M <span style={{color:TX2,fontWeight:400}}>{p.name}</span></p>)}</div>);};

  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:"#F0FAF4",border:"1px solid #1A6E3C33",borderRadius:8,padding:"10px 16px",display:"flex",gap:10,alignItems:"center"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#1A6E3C",flexShrink:0}}/>
        <span style={{fontSize:12,color:TX2,fontFamily:AN}}><strong style={{color:TX}}>Verified Q1 2026 Data</strong> , TechCabal Insights · Condia · LaunchBase Africa · Africa: The Big Deal · Synced Apr 2026</span>
      </div>
      <div className="card" style={{padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14,marginBottom:16}}>
          <div><div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:TX,marginBottom:3}}>Time Range &amp; Filters</div><p style={{fontSize:12,color:TX2,fontFamily:AN}}>Select any period from 2019 to Q1 2026</p></div>
          <div style={{display:"flex",gap:8}}>{["annual","quarterly","monthly"].map(p=>(<button key={p} className={`pill ${period===p?"on":""}`} onClick={()=>setPeriod(p)} style={{textTransform:"capitalize"}}>{p}</button>))}</div>
        </div>
        {period==="annual"&&(<><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}><span style={{fontSize:11,color:TX2,fontFamily:AN,marginRight:4,alignSelf:"center"}}>From:</span>{YEARS.slice(0,-1).map(y=>(<button key={y} className={`pill ${yearRange[0]===parseInt(y)?"on":""}`} onClick={()=>setYearRange([parseInt(y),Math.max(parseInt(y),yearRange[1])])}>{y}</button>))}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><span style={{fontSize:11,color:TX2,fontFamily:AN,marginRight:4,alignSelf:"center"}}>To:</span>{YEARS.map(y=>(<button key={y} className={`pill ${yearRange[1]===parseInt(y)?"on":""}`} onClick={()=>setYearRange([Math.min(yearRange[0],parseInt(y)),parseInt(y)])}>{y==="2026"?"2026 (Q1)":y}</button>))}</div></>)}
        <div style={{display:"flex",gap:12,marginTop:14,flexWrap:"wrap",alignItems:"center"}}>
          <div><span style={{fontSize:11,color:TX2,fontFamily:AN,marginRight:6}}>Sector:</span><select value={sectorF} onChange={e=>setSectorF(e.target.value)} style={{minWidth:130,padding:"5px 10px",fontSize:12}}>{SECTORS_LIST.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><span style={{fontSize:11,color:TX2,fontFamily:AN,marginRight:6}}>Country:</span><select value={countryF} onChange={e=>setCountryF(e.target.value)} style={{minWidth:130,padding:"5px 10px",fontSize:12}}>{COUNTRIES_LIST.map(c=><option key={c}>{c}</option>)}</select></div>
          {(sectorF!=="All"||countryF!=="All")&&(<><button className="btn bo" style={{fontSize:11,padding:"5px 12px"}} onClick={()=>{setSectorF("All");setCountryF("All");}}>Clear filters</button><span className="badge bgn">{dealsFiltered.length} deals · ${totalFiltered.toFixed(0)}M</span></>)}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12}}>
        {[["cal","2019–Q1 2026","Full dataset","7-year coverage","Africa:TBD"],["money",`$${(totalInRange/1000).toFixed(1)}B`,"Total in Range",`${yearRange[0]}–${yearRange[1]}`,`${annualFiltered.length} year(s)`],["trophy",peakYear?.year||"2022","Peak Year",`$${peakYear?.total||5000}M raised`,"Africa: The Big Deal"],["peak","$5.0B","All-Time Peak","2022 · 1,034 deals","AVCA"],["down","$0.9B","COVID Low","2020 · 359 deals","Africa:TBD"],["up","$3.2B","2025 Rebound","+40% year on year","Technext24"],["hash","6,000+","Total Deals","2019–2026 verified","Ranes Analytics"],["star","16+","Unicorns","2019–2025","Partech / Disrupt Africa"]].map(([icon,val,label,sub,src])=>(
          <div key={label as string} className="card" style={{padding:"15px"}}><div style={{marginBottom:6}}><KPIIcon id={icon as string}/></div><div style={{fontFamily:AN,fontSize:22,fontWeight:700,color:M,lineHeight:1}}>{val}</div><div style={{fontSize:11,fontWeight:700,color:TX,margin:"4px 0 2px",fontFamily:AN,textTransform:"uppercase",letterSpacing:0.4}}>{label}</div><div style={{fontSize:11,color:TX2,fontFamily:AN}}>{sub}</div><span className="src" style={{marginTop:4,display:"inline-block"}}>{src}</span></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16}}>
        <div className="card" style={{padding:"20px"}}>
          <div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:TX,marginBottom:4}}>{period==="annual"?"Annual Funding: Equity vs Debt":period==="quarterly"?"Quarterly Funding Trend":"Monthly Funding (Last 18 months)"}</div>
          <div style={{fontSize:11,color:TX2,marginBottom:14,fontFamily:AN}}><span className="src">Africa: The Big Deal / TechCabal Insights</span></div>
          <ResponsiveContainer width="100%" height={185}>
            {period==="annual"?(
              <ComposedChart data={annualFiltered}><CartesianGrid stroke={BRD} strokeDasharray="3 3"/><XAxis dataKey="year" tick={{fill:TX2,fontSize:10,fontFamily:"Arial Narrow,Arial"}} axisLine={false} tickLine={false}/><YAxis yAxisId="l" tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={(v:number)=>`$${v}M`}/><YAxis yAxisId="r" orientation="right" tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false}/><Tooltip content={<CT/>}/><Bar yAxisId="l" dataKey="debt" fill={N4} radius={[3,3,0,0]} stackId="s" name="Debt"/><Bar yAxisId="l" dataKey="equity" fill={M} radius={[3,3,0,0]} stackId="s" name="Equity"/><Line yAxisId="r" type="monotone" dataKey="deals" stroke={GD} strokeWidth={2} dot={{fill:GD,r:3}} name="Deals"/></ComposedChart>
            ):period==="quarterly"?(
              <ComposedChart data={quarterlyFiltered}><CartesianGrid stroke={BRD} strokeDasharray="3 3"/><XAxis dataKey="q" tick={{fill:TX2,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={(v:number)=>`$${v}M`}/><Tooltip/><Bar dataKey="debt" fill={N4} radius={[3,3,0,0]} stackId="s" name="Debt"/><Bar dataKey="equity" fill={M} radius={[3,3,0,0]} stackId="s" name="Equity"/></ComposedChart>
            ):(
              <AreaChart data={MONTHLY}><defs><linearGradient id="ge2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={M} stopOpacity={0.3}/><stop offset="95%" stopColor={M} stopOpacity={0}/></linearGradient><linearGradient id="gd2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={N4} stopOpacity={0.3}/><stop offset="95%" stopColor={N4} stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke={BRD} strokeDasharray="3 3"/><XAxis dataKey="m" tick={{fill:TX2,fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={(v:number)=>`$${v}M`}/><Tooltip/><Area type="monotone" dataKey="equity" stroke={M} fill="url(#ge2)" name="Equity"/><Area type="monotone" dataKey="debt" stroke={N4} fill="url(#gd2)" name="Debt"/></AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:"20px"}}>
          <div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:TX,marginBottom:14}}>Top Markets , {yearRange[0]===yearRange[1]?yearRange[0]:`${yearRange[0]}–${yearRange[1]}`}</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {countryData.map((c,i)=>(<div key={i}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,fontFamily:AN,display:"flex",alignItems:"center",gap:6}}><FlagBadge code={c.flag} size={18}/>{c.country}</span><span style={{fontFamily:AN,fontSize:14,fontWeight:700,color:M}}>${c.value}M</span></div><div className="progress"><div className="pf" style={{width:`${Math.round((c.value/countryData[0].value)*100)}%`}}/></div></div>))}
          </div>
        </div>
      </div>
      <div className="card" style={{padding:"20px"}}>
        <div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:TX,marginBottom:14}}>Sector Funding , {yearRange[1]===2026?"Q1 2026":yearRange[1]}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <ResponsiveContainer width="100%" height={195}><BarChart data={sectorData.slice(0,7)} layout="vertical" margin={{left:0,right:28}}><XAxis type="number" tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={(v:number)=>`$${v}M`}/><YAxis type="category" dataKey="name" tick={{fill:TX,fontSize:11,fontFamily:"Arial Narrow,Arial"}} axisLine={false} tickLine={false} width={80}/><Tooltip formatter={(v:any)=>[`$${v}M`,"Raised"]}/><Bar dataKey="amount" fill={M} radius={[0,4,4,0]} cursor="pointer" onClick={(d:any)=>setSectorF(d.name==="All"?"All":d.name)}/></BarChart></ResponsiveContainer>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{sectorData.slice(0,8).map((s,i)=>(<div key={i} className="card-tint" style={{padding:"10px 12px",cursor:"pointer",border:sectorF===s.name?`2px solid ${M}`:`1px solid ${BRD}`,borderRadius:7}} onClick={()=>setSectorF(sectorF===s.name?"All":s.name)}><div style={{fontSize:11,color:TX2,fontFamily:AN,marginBottom:4}}>{s.name}</div><div style={{fontFamily:AN,fontSize:17,fontWeight:700,color:M,lineHeight:1}}>${s.amount}M</div><div style={{fontSize:11,color:N4,fontWeight:700,fontFamily:AN,marginTop:3}}>~{s.irr}% IRR</div></div>))}</div>
        </div>
      </div>
      {(sectorF!=="All"||countryF!=="All")&&(<div className="card" style={{padding:"20px"}}><div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:TX,marginBottom:12}}>Filtered: {sectorF!=="All"&&<span className="badge bm" style={{marginRight:6}}>{sectorF}</span>}{countryF!=="All"&&<span className="badge bn">{countryF}</span>}<span style={{fontSize:13,color:TX2,fontWeight:400,marginLeft:10}}>{dealsFiltered.length} deals · ${totalFiltered.toFixed(0)}M</span></div><div style={{overflow:"auto"}}><table><thead><tr>{["Company","Country","Sector","Year","Amount","Round","Type"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{dealsFiltered.sort((a:any,b:any)=>b.year-a.year||b.amount-a.amount).map((d:any,i:number)=>(<tr key={i} className="tr-h"><td style={{fontWeight:700}}><a href={d.url} target="_blank" rel="noreferrer" className="ext" style={{display:"flex",alignItems:"center",gap:6}}><FlagBadge code={d.flag}/>{d.company}</a></td><td style={{color:TX2}}>{d.country}</td><td><span className="badge bn">{d.sector}</span></td><td style={{color:TX2}}>{d.year}</td><td style={{fontFamily:AN,fontSize:14,fontWeight:700,color:M}}>${d.amount}M</td><td><span className="badge bm">{d.round}</span></td><td><span className={`badge ${d.type==="equity"?"bgn":d.type==="debt"?"bbl":"bhy"}`}>{d.type}</span></td></tr>))}</tbody></table></div></div>)}
      {period==="annual"&&(<div className="card" style={{padding:"20px"}}><div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:TX,marginBottom:14}}>Annual Summary {yearRange[0]}–{yearRange[1]}</div><div style={{overflow:"auto"}}><table><thead><tr>{["Year","Total","Equity","Debt","Deals","Investors","Unicorns","Top Sector","Context"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{annualFiltered.map((d,i)=>{const isPeak=d.total===5000;const isLow=d.total===900;return(<tr key={i} className="tr-h" style={{background:isPeak?M_BG:isLow?N_BG:undefined}}><td style={{fontWeight:700,fontSize:14,color:isPeak?M:isLow?N4:TX}}>{d.year}{isPeak?" ·PEAK":""}</td><td style={{fontFamily:AN,fontSize:15,fontWeight:700,color:M}}>${d.total.toLocaleString()}M</td><td style={{color:TX2}}>${d.equity.toLocaleString()}M</td><td style={{color:N4}}>${d.debt.toLocaleString()}M</td><td style={{color:TX2}}>{d.deals.toLocaleString()}</td><td style={{color:TX2}}>{d.investors.toLocaleString()}</td><td style={{textAlign:"center"}}>{d.unicorns>0?<span className="badge bgn">{d.unicorns+" new"}</span>:"·"}</td><td><span className="badge bn">{d.topSector}</span></td><td style={{color:TX2,fontSize:11,maxWidth:260,lineHeight:1.4}}>{d.note}</td></tr>);})}</tbody></table></div></div>)}
    </div>
  );
}

/* ─── ACTIVE DEALS ─────────────────────────────────────── */
function ActiveDealsView(){
  const [statusF,setStatusF]=useState("All");
  const filtered=statusF==="All"?ACTIVE_DEALS:ACTIVE_DEALS.filter(d=>d.status===statusF);
  const cc=(c:number)=>c>=90?"#1A6E3C":c>=80?GD:M;
  const bl=(s:string)=>s==="Closing"?GD:s==="Announced"?M:N4;
  const bc=(s:string)=>s==="Closing"?"bcl":s==="Announced"?"ban":"bip";
  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}><div><h2 className="sh">Active Deals</h2><p className="sh-sub">Companies currently fundraising · Verified signals · Q1/Q2 2026</p></div><span className="badge bm" style={{fontSize:12,padding:"4px 12px"}}>{ACTIVE_DEALS.length} Live</span></div>
      <div style={{background:M_BG,border:`1px solid ${M}33`,borderRadius:8,padding:"12px 16px",fontSize:12,color:TX2,lineHeight:1.7,fontFamily:AN}}><strong style={{color:M}}>How to read this page:</strong> Confidence scores reflect multi-source verification. 90%+ means almost certainly closing. Always verify directly. <strong style={{color:TX}}>This is not investment advice.</strong></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:12,color:TX2,fontFamily:AN}}>Filter:</span>{["All","Closing","Announced","In-process"].map(s=>(<button key={s} className={`btn bo ${statusF===s?"on":""}`} onClick={()=>setStatusF(s)} style={{fontSize:12,padding:"6px 14px"}}>{s}</button>))}</div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map((d,i)=>(<div key={i} className="card" style={{padding:"22px 24px",borderLeft:`5px solid ${bl(d.status)}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:12}}><div style={{display:"flex",alignItems:"center",gap:12}}><FlagBadge code={d.flag} size={24}/><div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span style={{fontFamily:AN,fontSize:19,fontWeight:700,color:TX}}>{d.company}</span><span className={`badge ${bc(d.status)}`}>{d.status}</span></div><div style={{display:"flex",gap:8}}><span style={{fontSize:12,color:TX2,fontFamily:AN}}>{d.city}</span><span className="badge bn">{d.sector}</span><span className="badge bm">{d.stage}</span></div></div></div><div style={{textAlign:"right"}}><div style={{fontFamily:AN,fontSize:24,fontWeight:700,color:M,lineHeight:1}}>{d.range}</div></div></div><p style={{fontSize:13,color:TX2,lineHeight:1.75,marginBottom:14,fontFamily:AN,borderLeft:`3px solid ${BRD}`,paddingLeft:12}}>{d.desc}</p><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><span style={{fontSize:12,fontFamily:AN}}><span style={{color:TX2}}>Investors: </span><strong>{d.investors}</strong></span><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:11,color:TX2,fontFamily:AN}}>Confidence:</span><div style={{width:56,height:4,background:BRD,borderRadius:2,overflow:"hidden",display:"inline-block"}}><div style={{height:"100%",width:`${d.confidence}%`,background:cc(d.confidence),borderRadius:2}}/></div><span style={{fontSize:12,fontWeight:700,color:cc(d.confidence),fontFamily:AN}}>{d.confidence}%</span><span className="src">{d.source}</span></div></div></div>))}
      </div>
    </div>
  );
}

/* ─── DEALS DATABASE ───────────────────────────────────── */
function DealsView(){
  const [yearF,setYearF]=useState("All");
  const [sectorF,setSectorF]=useState("All");
  const [typeF,setTypeF]=useState("All");
  const [search,setSearch]=useState("");
  const filtered=useMemo(()=>ALL_DEALS.filter((d:any)=>{
    if(yearF!=="All"&&d.year.toString()!==yearF) return false;
    if(sectorF!=="All"&&d.sector!==sectorF) return false;
    if(typeF!=="All"&&d.type!==typeF) return false;
    if(search&&!d.company.toLowerCase().includes(search.toLowerCase())&&!d.sector.toLowerCase().includes(search.toLowerCase())&&!d.country.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }),[yearF,sectorF,typeF,search]);
  const total=filtered.reduce((a:number,d:any)=>a+d.amount,0);
  const tb=(t:string)=>t==="equity"?"bgn":t==="debt"?"bbl":"bhy";
  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}><div><h2 className="sh">Deal Database, 2019 to Q1 2026</h2><p className="sh-sub">{ALL_DEALS.length} verified deals · 7-year history</p></div><button className="btn bp" style={{display:"flex",alignItems:"center",gap:6}} onClick={()=>exportToCSV(filtered.map((d:any)=>({Company:d.company,Country:d.country,Sector:d.sector,Year:d.year,Quarter:d.quarter||"",Amount_USD_M:d.amount,Round:d.round,Type:d.type,Investors:d.investors})),`ranes-deals-${yearF==="All"?"all":yearF}.csv`)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M2 8l4 3 4-3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>Export CSV</button></div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company, sector, country..." style={{flex:1,minWidth:200}}/>
        <div><div style={{fontSize:10,color:TX2,letterSpacing:1,marginBottom:4,fontFamily:AN}}>YEAR</div><select value={yearF} onChange={e=>setYearF(e.target.value)} style={{minWidth:100}}><option>All</option>{["2021","2022","2023","2024","2025","2026"].map(y=><option key={y}>{y}</option>)}</select></div>
        <div><div style={{fontSize:10,color:TX2,letterSpacing:1,marginBottom:4,fontFamily:AN}}>SECTOR</div><select value={sectorF} onChange={e=>setSectorF(e.target.value)} style={{minWidth:130}}>{SECTORS_LIST.map(s=><option key={s}>{s}</option>)}</select></div>
        <div><div style={{fontSize:10,color:TX2,letterSpacing:1,marginBottom:4,fontFamily:AN}}>TYPE</div><select value={typeF} onChange={e=>setTypeF(e.target.value)} style={{minWidth:100}}>{TYPES_LIST.map(t=><option key={t}>{t}</option>)}</select></div>
        {(yearF!=="All"||sectorF!=="All"||typeF!=="All"||search)&&(<button className="btn bo" style={{fontSize:11,padding:"5px 12px",alignSelf:"flex-end"}} onClick={()=>{setYearF("All");setSectorF("All");setTypeF("All");setSearch("");}}>Clear</button>)}
        <span className="badge bgn" style={{alignSelf:"flex-end",marginBottom:2}}>{filtered.length} deals · ${total.toFixed(0)}M</span>
      </div>
      <div className="card" style={{overflow:"auto"}}><table><thead><tr>{["Company","Country","Sector","Year","Amount","Round","Type","Investors"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{filtered.sort((a:any,b:any)=>b.year-a.year||b.amount-a.amount).map((d:any,i:number)=>(<tr key={i} className="tr-h"><td style={{fontWeight:700}}><a href={d.url} target="_blank" rel="noreferrer" className="ext" style={{display:"flex",alignItems:"center",gap:6}}><FlagBadge code={d.flag}/>{d.company}</a></td><td style={{color:TX2}}>{d.country}</td><td><span className="badge bn">{d.sector}</span></td><td style={{fontWeight:700,color:N4}}>{d.year}</td><td style={{fontFamily:AN,fontSize:15,fontWeight:700,color:M}}>${d.amount}M</td><td><span className="badge bm">{d.round}</span></td><td><span className={`badge ${tb(d.type)}`}>{d.type}</span></td><td style={{color:TX2,fontSize:12,maxWidth:160}}>{d.investors}</td></tr>))}</tbody></table></div>
    </div>
  );
}

/* ─── NEWS ─────────────────────────────────────────────── */
function NewsView(){
  const sc=(s:string)=>s==="positive"?"#1A6E3C":s==="negative"?"#C0392B":GD;
  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div><h2 className="sh">Intelligence Feed</h2><p className="sh-sub">Verified primary sources · Click any headline to open the full article</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {NEWS.map((n,i)=>(<a key={i} href={n.url} target="_blank" rel="noreferrer" style={{textDecoration:"none",display:"block"}}><div className="card" style={{padding:"15px 18px",display:"flex",gap:14,cursor:"pointer"}}><div style={{width:4,background:sc(n.s),borderRadius:4,flexShrink:0,minHeight:34,alignSelf:"stretch"}}/><div style={{flex:1}}><h3 style={{fontSize:14,fontWeight:700,color:TX,lineHeight:1.5,marginBottom:6,fontFamily:AN}}>{n.title}</h3><div style={{display:"flex",gap:10,alignItems:"center"}}><span className="src">{n.source}</span><span style={{fontSize:11,color:TX2,fontFamily:AN}}>{n.date}</span></div></div><div style={{color:TX3,fontSize:16,display:"flex",alignItems:"center"}}>↗</div></div></a>))}
      </div>
    </div>
  );
}

/* ─── SERVICES VIEW ────────────────────────────────────── */
function ServicesView({goTo}:{goTo:(id:string)=>void}){
  const [activeTab,setActiveTab]=useState("founders");
  const FOUNDER_SERVICES=[
    {n:1,title:"Capital Raising Strategy",sub:"Know who to target, when to go out and how to tell your story.",detail:"We map your company's stage, metrics and market position against what active African investors are actually deploying into right now. You get a shortlist of relevant funds, a honest view of your valuation range based on comparable deals, and a fundraising timeline that accounts for how long African due diligence actually takes.",tags:["Series A–C","Pre-seed to growth","Strategic advisory"],proof:"Based on Q1 2026 data, the median time from first investor contact to close on a Series A in East Africa is 14 weeks."},
    {n:2,title:"Investor-Ready Documentation",sub:"The materials that move deals from 'interesting' to term sheet.",detail:"We prepare financial models built on your actual unit economics, use-of-proceeds breakdowns that hold up in due diligence, cap table analysis showing dilution scenarios, and investment memoranda that speak the language active African fund managers expect.",tags:["Financial models","IM preparation","Cap table analysis"],proof:"Founders who arrive with a complete data room close 40% faster."},
    {n:3,title:"Transaction Structuring",sub:"Get the terms right. Understand what you are agreeing to.",detail:"We model the long-term dilution impact of different instruments, SAFEs, convertibles, priced rounds, and show you what each looks like at exit under realistic scenarios.",tags:["Term sheet review","Dilution modelling","Instrument structuring"],proof:"In 2025, 34% of African growth-stage deals included some form of debt component."},
    {n:4,title:"Due Diligence Coordination",sub:"Keep deals on track. Most fall apart in the last 20 metres.",detail:"We coordinate information flow between you and investors during diligence, tracking outstanding requests and managing the pace of disclosure to keep momentum.",tags:["Process management","Investor comms","Q&A preparation"],proof:"Most deals that collapse do so in due diligence, not at term sheet."},
    {n:5,title:"Benchmarking and Investment Case",sub:"Know how your numbers compare before investors tell you.",detail:"We pull comparable metrics from our verified deal database for companies in your sector and stage that have successfully raised in Africa.",tags:["Unit economics review","Sector benchmarks","Comparable analysis"],proof:"Founders who understand how their metrics compare to funded peers enter investor conversations with confidence."},
  ];
  const INVESTOR_SERVICES=[
    {n:1,title:"Deal Flow Intelligence",sub:"See more of the market. Miss fewer of the deals worth seeing.",detail:"We surface active fundraises, track announced rounds and monitor signals from our network before deals reach crowded public databases.",tags:["Active deal sourcing","Sector filtering","Early signals"],proof:"In Q1 2026, 5 tracked fundraises were active in our system before appearing in any public tracker."},
    {n:2,title:"Market Entry and Landscape Analysis",sub:"Understand a new market before you commit capital to it.",detail:"We map competitive dynamics, regulatory context and recent deal history for any African sector or country you are evaluating.",tags:["Country analysis","Sector mapping","Regulatory context"],proof:"The investors who perform best in Africa are those who understood what made 2022's peak unsustainable before 2023 proved it."},
    {n:3,title:"Portfolio Company Support",sub:"Help your investments perform, not just survive.",detail:"We provide ongoing benchmarking against sector peers, support for follow-on fundraising and a second pair of eyes on metrics that matter as the business scales.",tags:["Follow-on support","Board prep","Performance benchmarking"],proof:"The difference between a write-off and a recovery is often 12 months of clear-eyed operational assessment."},
    {n:4,title:"Comparative Due Diligence",sub:"Test what founders tell you against what the market actually shows.",detail:"We pull comparable metrics for any company you are evaluating: deal terms, valuation benchmarks, revenue multiples, margin profiles, from our verified African deal database.",tags:["Valuation benchmarks","Red flag analysis","Peer comparisons"],proof:"A Series A fintech in Lagos valued at 8x ARR is either exceptional or overpriced. We tell you which, with data."},
  ];
  const services=activeTab==="founders"?FOUNDER_SERVICES:INVESTOR_SERVICES;
  const accentCol=activeTab==="founders"?M:N4;
  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:0}}>
      <div style={{background:`linear-gradient(155deg,${N} 0%,${N2} 50%,${M5} 100%)`,padding:"52px 48px 44px",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,opacity:0.02,backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",backgroundSize:"52px 52px"}}/><div style={{position:"relative",maxWidth:820}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><div style={{height:2,width:28,background:M3,borderRadius:1}}/><span style={{fontFamily:AN,fontSize:10,fontWeight:700,color:M3,letterSpacing:3,textTransform:"uppercase"}}>Ranes Analytics · Advisory Services</span></div><h1 style={{fontFamily:AN,fontSize:42,fontWeight:700,color:WH,lineHeight:1.15,marginBottom:18}}>The intelligence layer your<br/>deal doesn't come with.</h1><p style={{fontFamily:AN,fontSize:16,color:"rgba(255,255,255,0.65)",lineHeight:1.85,maxWidth:620}}>Ranes Analytics is an investment intelligence platform first. For founders preparing to raise and investors evaluating opportunities, we also offer advisory support grounded in verified data.</p></div></div>
      <div style={{background:BG2,padding:"24px 48px",borderBottom:`1px solid ${BRD}`}}><div style={{maxWidth:820,display:"flex",gap:16,alignItems:"flex-start"}}><div style={{width:4,height:"auto",minHeight:40,background:GD,borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/><p style={{fontFamily:AN,fontSize:14,color:TX,lineHeight:1.78}}>Our advisory work is selective. We do not promise introductions or guaranteed outcomes. We offer informed analysis, well-prepared documentation and honest advice drawn from the same data on this platform. If that is what you need, use the contact form at the bottom of this page.</p></div></div>
      <div style={{padding:"40px 48px 0",background:WH}}><div style={{display:"flex",gap:0,borderBottom:`2px solid ${BRD}`,marginBottom:0,maxWidth:680}}>{[["founders","For Founders","Growth-stage companies preparing to raise"],["investors","For Investors","Funds and family offices evaluating opportunities"]].map(([id,label,sub])=>(<button key={id} onClick={()=>setActiveTab(id)} style={{padding:"14px 28px",border:"none",background:"transparent",cursor:"pointer",textAlign:"left",borderBottom:`3px solid ${activeTab===id?(id==="founders"?M:N4):"transparent"}`,marginBottom:-2,transition:"all 0.18s"}}><div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:activeTab===id?TX:TX2,marginBottom:3}}>{label}</div><div style={{fontFamily:AN,fontSize:11,color:TX3}}>{sub}</div></button>))}</div></div>
      <div style={{padding:"36px 48px 52px",background:WH}}><div style={{display:"flex",flexDirection:"column",gap:0,maxWidth:860}}>{services.map((s,i)=>(<div key={i} style={{borderTop:`1px solid ${BRD}`,padding:"32px 0"}}><div style={{display:"flex",gap:24,alignItems:"flex-start"}}><div style={{width:36,height:36,borderRadius:8,background:`${accentCol}14`,border:`1.5px solid ${accentCol}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:AN,fontSize:14,fontWeight:700,color:accentCol}}>{s.n}</span></div><div style={{flex:1}}><div style={{fontFamily:AN,fontSize:18,fontWeight:700,color:TX,marginBottom:5}}>{s.title}</div><div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:accentCol,marginBottom:14}}>{s.sub}</div><p style={{fontFamily:AN,fontSize:14,color:TX2,lineHeight:1.82,marginBottom:16}}>{s.detail}</p><div style={{background:BG2,border:`1px solid ${BRD}`,borderLeft:`3px solid ${GD}`,borderRadius:6,padding:"10px 14px",marginBottom:16}}><div style={{fontFamily:AN,fontSize:10,fontWeight:700,color:GD,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>In practice</div><p style={{fontFamily:AN,fontSize:12,color:TX2,lineHeight:1.7}}>{s.proof}</p></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{s.tags.map(t=><span key={t} className="badge bn">{t}</span>)}</div></div></div></div>))}<div style={{borderTop:`1px solid ${BRD}`}}/></div></div>
      <div style={{background:N2,padding:"48px 48px"}}><div style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}><div style={{fontFamily:AN,fontSize:28,fontWeight:700,color:WH,marginBottom:14}}>{activeTab==="founders"?"Ready to sharpen your raise?":"Looking for deeper market intelligence?"}</div><p style={{fontFamily:AN,fontSize:15,color:"rgba(255,255,255,0.58)",lineHeight:1.82,marginBottom:28}}>Use the contact form below to tell us about your needs. We respond within two business days.</p><div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}><button className="btn bp" style={{fontSize:14,padding:"12px 28px"}} onClick={()=>{document.querySelector('#contact-anchor')?.scrollIntoView({behavior:'smooth'});}}>Get in touch via the contact form</button><button className="btn" style={{fontFamily:AN,fontSize:14,fontWeight:700,padding:"12px 24px",background:"rgba(255,255,255,0.08)",color:WH,border:"1px solid rgba(255,255,255,0.2)",borderRadius:5,cursor:"pointer",textTransform:"uppercase",letterSpacing:0.6}} onClick={()=>goTo("dashboard")}>Explore the data first</button></div></div></div>
    </div>
  );
}

/* ─── HOMEPAGE ─────────────────────────────────────────── */
function HomeView({goTo}:{goTo:(id:string)=>void}){
  const [open,setOpen]=useState<number|null>(null);
  const STORIES=[
    {col:M,tag:"Homegrown capital",hook:"The money was already here.",opener:"Before a single dollar arrived from Palo Alto or London, Africans were working on the continent's hardest problems.",body:"What has changed is not the ingenuity. It is the infrastructure around it. Novastar Ventures, the IFC, BII and Azur Innovation Fund are now channelling capital into companies built from the inside out.",pull:"Africa does not need to be discovered. It needs to be taken seriously, on its own terms.",s1:"$3.2B raised across Africa in 2025, up 40% year on year",s1s:"Technext24 / Africa: The Big Deal",s2:"IFC (4 deals), Novastar (3) and Azur (3) led Q1 2026",s2s:"LaunchBase Africa Apr 1, 2026"},
    {col:N4,tag:"Interconnected markets",hook:"The deal in Nairobi is a bet on Kampala too.",opener:"The most expensive mistake in African investment is treating 54 countries as 54 separate decisions.",body:"When Spiro closed a $57M debt round for electric motorcycles in Kenya, the story was not about one company in one city. It was about early infrastructure for a cross-border EV network.",pull:"The question is not whether to invest in Africa. It is whether you understand which deals are nodes in a continental network.",s1:"AfCFTA: 54 countries, $3.4 trillion combined GDP",s1s:"African Union / World Bank",s2:"Logistics sector up 340% year on year in Q1 2026",s2s:"TechCabal Insights Q1 2026"},
    {col:"#1A6E3C",tag:"Resource sovereignty",hook:"Africa holds the keys to the electric era.",opener:"For generations the pattern was simple: extract raw materials, process elsewhere, sell back at a premium. That pattern is breaking.",body:"SolarAfrica's $94M project debt round was financed by Rand Merchant Bank and Investec, South African institutions on South African terms.",pull:"The continent that supplies the raw materials for electric vehicles is now building them.",s1:"Energy sector: $141M raised Q1 2026, IRR proxy ~28%",s1s:"Ranes Analytics Benchmark Model",s2:"SolarAfrica $94M financed entirely by African institutions",s2s:"Innovation Village, February 2026"},
    {col:GD,tag:"The demographic thesis",hook:"By 2040, one in four people on Earth will be African.",opener:"Africa's 700 million people under 25 are not a statistic to be managed. They are the continent's largest consumer cohort.",body:"Moniepoint, Andela, Wave and LemFi were all built by Africans under 40 who understood their users because they are their users.",pull:"Youth is not a variable to be managed. It is the thesis itself.",s1:"60% of Africa's population is under 25",s1s:"UN Population Division 2024",s2:"Moniepoint, Andela, Wave and LemFi all built by Africans under 40",s2s:"Company records / TechCabal"},
    {col:M4,tag:"African capital",hook:"The capital is already here. It just needs somewhere good to go.",opener:"Africa's pension funds manage over $1.8 trillion in assets. The diaspora sends $90 billion home annually.",body:"Ranes Analytics exists because African investors, founders and institutions deserve the same quality of intelligence that counterparts in New York have always taken for granted.",pull:"The continent's greatest untapped capital pool is in African pension funds, family offices and diaspora accounts.",s1:"African diaspora remittances: $90B+ annually",s1s:"World Bank 2024",s2:"African pension funds hold $1.8 trillion. Less than 5% in African PE.",s2s:"AVCA Africa / World Bank"},
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:0}}>
      <div style={{background:`linear-gradient(155deg,${N} 0%,${N2} 45%,${M5} 100%)`,padding:"64px 48px 56px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)",backgroundSize:"52px 52px"}}/>
        <div style={{position:"relative",maxWidth:860}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}><div style={{height:2,width:28,background:M3,borderRadius:1}}/><span style={{fontFamily:AN,fontSize:10,fontWeight:700,color:M3,letterSpacing:3,textTransform:"uppercase"}}>Ranes Analytics · Africa Investment Intelligence</span></div>
          <h1 style={{fontFamily:AN,fontSize:52,fontWeight:700,color:WH,lineHeight:1.1,marginBottom:24,letterSpacing:-0.5}}>Africa is not the world's<br/>next opportunity.<br/><span style={{color:GD2}}>It never stopped being one.</span></h1>
          <p style={{fontFamily:AN,fontSize:17,color:"rgba(255,255,255,0.68)",lineHeight:1.85,marginBottom:34,maxWidth:660}}>While global capital chased its own correction, African entrepreneurs quietly rebuilt the continent's financial, energy and logistics infrastructure from the inside out.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="btn bp" style={{fontSize:14,padding:"12px 28px"}} onClick={()=>goTo("dashboard")}>See 7 years of data</button>
            <button onClick={()=>goTo("active")} style={{fontFamily:AN,fontSize:14,fontWeight:700,padding:"12px 24px",background:"rgba(255,255,255,0.08)",color:WH,border:"1px solid rgba(255,255,255,0.2)",borderRadius:5,cursor:"pointer",textTransform:"uppercase",letterSpacing:0.6}}>Active fundraises now</button>
            <button onClick={()=>goTo("services")} style={{fontFamily:AN,fontSize:14,fontWeight:700,padding:"12px 24px",background:"transparent",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:5,cursor:"pointer",textTransform:"uppercase",letterSpacing:0.6}}>Advisory services</button>
          </div>
        </div>
        <div style={{position:"relative",display:"flex",gap:14,marginTop:44,flexWrap:"wrap"}}>
          {[["$3.2B","Raised in Africa · 2025","Technext24"],["$711M","Q1 2026 · 14 countries","TechCabal Insights"],["+40%","Year on year · 2025","Africa: The Big Deal"],["1.4B","People · one market","African Union"]].map(([val,label,src])=>(
            <div key={val} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"14px 20px"}}><div style={{fontFamily:AN,fontSize:26,fontWeight:700,color:GD2,lineHeight:1}}>{val}</div><div style={{fontFamily:AN,fontSize:11,color:"rgba(255,255,255,0.55)",marginTop:4}}>{label}</div><div style={{fontFamily:AN,fontSize:9,color:"rgba(255,255,255,0.28)",marginTop:2,fontStyle:"italic"}}>{src}</div></div>
          ))}
        </div>
      </div>

      <div style={{background:BG2,padding:"38px 48px",borderBottom:`1px solid ${BRD}`}}><div style={{maxWidth:720,margin:"0 auto"}}><div style={{height:3,width:36,background:M,borderRadius:2,marginBottom:18}}/><p style={{fontFamily:AN,fontSize:18,color:TX,lineHeight:1.82,fontStyle:"italic",marginBottom:12}}>"The most important investment thesis right now is being written in the daily decisions of 1.4 billion people building the 21st century's most dynamic economies."</p><div style={{fontFamily:AN,fontSize:11,color:TX3}}>Ranes Analytics · Editorial position · 2026</div></div></div>

      <div style={{background:WH,padding:"44px 48px",borderBottom:`1px solid ${BRD}`}}>
        <div style={{fontFamily:AN,fontSize:11,fontWeight:700,color:TX2,letterSpacing:2,textTransform:"uppercase",marginBottom:20,textAlign:"center"}}>Who is this platform for?</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,maxWidth:860,margin:"0 auto"}}>
          <div className="card" style={{padding:"28px 30px",borderTop:`4px solid ${M}`,cursor:"pointer"}} onClick={()=>goTo("services")}><div style={{fontFamily:AN,fontSize:11,fontWeight:700,color:M,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>For Founders</div><div style={{fontFamily:AN,fontSize:18,fontWeight:700,color:TX,lineHeight:1.3,marginBottom:12}}>Preparing to raise your next round?</div><p style={{fontFamily:AN,fontSize:13,color:TX2,lineHeight:1.75,marginBottom:16}}>See what sectors investors are deploying into, what valuations comparable companies achieved, and which investors have been most active.</p><button className="btn bp" style={{fontSize:12,padding:"8px 16px"}} onClick={e=>{e.stopPropagation();goTo("services");}}>See founder services</button></div>
          <div className="card" style={{padding:"28px 30px",borderTop:`4px solid ${N4}`,cursor:"pointer"}} onClick={()=>goTo("dashboard")}><div style={{fontFamily:AN,fontSize:11,fontWeight:700,color:N4,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>For Investors</div><div style={{fontFamily:AN,fontSize:18,fontWeight:700,color:TX,lineHeight:1.3,marginBottom:12}}>Evaluating African opportunities?</div><p style={{fontFamily:AN,fontSize:13,color:TX2,lineHeight:1.75,marginBottom:16}}>Track live fundraises, pull comparable deal terms and valuation benchmarks, and understand the sector dynamics driving returns.</p><button className="btn bs" style={{fontSize:12,padding:"8px 16px"}} onClick={e=>{e.stopPropagation();goTo("active");}}>See active deals</button></div>
        </div>
      </div>

      <div style={{padding:"52px 48px",background:WH}}>
        <div style={{marginBottom:38,maxWidth:680}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{height:2,width:28,background:M,borderRadius:1}}/><span style={{fontFamily:AN,fontSize:10,fontWeight:700,color:M,letterSpacing:3,textTransform:"uppercase"}}>Five things worth knowing</span></div><h2 style={{fontFamily:AN,fontSize:30,fontWeight:700,color:TX,lineHeight:1.2,marginBottom:12}}>Five perspectives that change how you read African deals</h2></div>
        <div>{STORIES.map((s,i)=>{const isOpen=open===i;return(<div key={i} style={{borderTop:`1px solid ${BRD}`}}><button onClick={()=>setOpen(isOpen?null:i)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"26px 0 22px",display:"flex",alignItems:"flex-start",gap:20,textAlign:"left"}}><div style={{width:46,height:46,borderRadius:10,flexShrink:0,background:isOpen?s.col+"18":BG2,border:`1.5px solid ${isOpen?s.col+"55":BRD}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",marginTop:2,color:isOpen?s.col:TX3,fontSize:16,fontWeight:700}}>{i+1}</div><div style={{flex:1}}><div style={{fontFamily:AN,fontSize:10,fontWeight:700,color:isOpen?s.col:TX3,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{s.tag}</div><div style={{fontFamily:AN,fontSize:20,fontWeight:700,color:TX,lineHeight:1.25}}>{s.hook}</div>{!isOpen&&<p style={{fontFamily:AN,fontSize:13,color:TX2,lineHeight:1.65,maxWidth:620,marginTop:7}}>{s.opener}</p>}</div><div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,marginTop:8,background:isOpen?s.col:BG2,border:`1.5px solid ${isOpen?s.col:BRD}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:isOpen?WH:TX3,transform:isOpen?"rotate(45deg)":"none",transition:"all 0.2s"}}>+</div></button>{isOpen&&(<div style={{paddingBottom:38,paddingLeft:66,animation:"slideUp 0.25s ease both"}}><p style={{fontFamily:AN,fontSize:15,color:TX,lineHeight:1.85,marginBottom:18,maxWidth:680}}>{s.opener}</p><p style={{fontFamily:AN,fontSize:14,color:TX2,lineHeight:1.85,marginBottom:26,maxWidth:680}}>{s.body}</p><div style={{borderLeft:`4px solid ${s.col}`,paddingLeft:20,marginBottom:26,maxWidth:600}}><p style={{fontFamily:AN,fontSize:16,fontStyle:"italic",color:TX,lineHeight:1.72}}>{s.pull}</p></div><div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>{[[s.s1,s.s1s],[s.s2,s.s2s]].map(([stat,src])=>(<div key={stat} style={{background:BG2,border:`1px solid ${BRD}`,borderRadius:8,padding:"12px 16px",flex:1,minWidth:220}}><div style={{fontFamily:AN,fontSize:13,fontWeight:700,color:s.col,marginBottom:4,lineHeight:1.4}}>{stat}</div><div style={{fontFamily:AN,fontSize:10,color:TX3,fontStyle:"italic"}}>{src}</div></div>))}</div><button className="btn bp" style={{fontSize:12,padding:"8px 18px"}} onClick={()=>goTo("dashboard")}>See the data</button></div>)}</div>);})}<div style={{borderTop:`1px solid ${BRD}`}}/></div>
      </div>

      <div style={{background:BG2,padding:"52px 48px",borderTop:`1px solid ${BRD}`}}>
        <div style={{marginBottom:32}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{height:2,width:28,background:N4,borderRadius:1}}/><span style={{fontFamily:AN,fontSize:10,fontWeight:700,color:N4,letterSpacing:3,textTransform:"uppercase"}}>Regional intelligence</span></div><h2 style={{fontFamily:AN,fontSize:28,fontWeight:700,color:TX,lineHeight:1.2,marginBottom:10}}>Three markets. One continental story.</h2></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[{region:"East Africa",col:M,flags:["KE","TZ","RW"],hed:"One ecosystem. Four flags.",body:"M-Pesa changed how the whole region thinks about financial infrastructure.",stat:"Kenya: $114M raised Q1 2026",act:"active"},{region:"West Africa",col:N4,flags:["NG","GH","SN"],hed:"The continent's largest consumer market.",body:"Nigeria's 220 million people set the volume. Ghana runs experiments. Senegal's Wave showed Francophone scale.",stat:"Nigeria: $78M Q1 2026",act:"dashboard"},{region:"North Africa",col:"#1A6E3C",flags:["EG","MA","TN"],hed:"Egypt's fintech moment.",body:"Egypt's answer to financial exclusion was built from precise knowledge of how 105 million people actually manage money.",stat:"Egypt: $190M raised Q1 2026",act:"deals"}].map((r,i)=>(<div key={i} className="card" style={{padding:"26px",cursor:"pointer",borderTop:`3px solid ${r.col}`}} onClick={()=>goTo(r.act)}><div style={{display:"flex",gap:6,marginBottom:14}}>{r.flags.map(code=><FlagBadge key={code} code={code} size={20}/>)}</div><div style={{fontFamily:AN,fontSize:10,fontWeight:700,color:r.col,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>{r.region}</div><div style={{fontFamily:AN,fontSize:17,fontWeight:700,color:TX,lineHeight:1.25,marginBottom:12}}>{r.hed}</div><p style={{fontFamily:AN,fontSize:13,color:TX2,lineHeight:1.78,marginBottom:16}}>{r.body}</p><div style={{fontFamily:AN,fontSize:11,color:r.col,fontWeight:700,borderTop:`1px solid ${BRD}`,paddingTop:12}}>{r.stat}</div></div>))}
        </div>
      </div>

      <div style={{background:N2,padding:"52px 48px"}}>
        <div style={{maxWidth:720,margin:"0 auto 40px",textAlign:"center"}}><h2 style={{fontFamily:AN,fontSize:28,fontWeight:700,color:WH,marginBottom:12}}>Start with the data. Take it further if you need to.</h2><p style={{fontFamily:AN,fontSize:15,color:"rgba(255,255,255,0.55)",lineHeight:1.82}}>The platform is free to use. If you need advisory support on top of that, we are available.</p></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12,maxWidth:1040,margin:"0 auto"}}>
          {[{id:"dashboard",label:"Dashboard",desc:"Seven years of verified funding data."},{id:"active",label:"Active Deals",desc:"Companies actively raising right now."},{id:"deals",label:"Deal Database",desc:"Every major deal from 2021 to Q1 2026."},{id:"news",label:"Intelligence Feed",desc:"Stories behind the numbers."},{id:"ai",label:"Ranes AI",desc:"Ask specific questions. Get sourced answers."}].map(s=>(<div key={s.id} onClick={()=>goTo(s.id)} style={{background:"rgba(255,255,255,0.055)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"20px 18px",cursor:"pointer",transition:"all 0.18s"}} onMouseEnter={(e:any)=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";}} onMouseLeave={(e:any)=>{e.currentTarget.style.background="rgba(255,255,255,0.055)";}}><div style={{marginBottom:10}}><NavIcon id={s.id} size={18} col={M3}/></div><div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:WH,marginBottom:6}}>{s.label}</div><div style={{fontFamily:AN,fontSize:12,color:"rgba(255,255,255,0.46)",lineHeight:1.68}}>{s.desc}</div></div>))}
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ─────────────────────────────────────────── */
export default function RanesAnalytics(){
  const [view,setView]=useState("home");
  const [srch,setSrch]=useState("");
  const [srchOpen,setSrchOpen]=useState(false);
  const [modal,setModal]=useState<string|null>(null);
  const goTo=(id:string)=>setView(id);

  const NAV_ITEMS=[
    {id:"services",label:"Services",icon:"svc",isServices:true},
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"active",label:"Active Deals",icon:"active",badge:true},
    {id:"deals",label:"Deal Database",icon:"deals"},
    {id:"news",label:"News",icon:"news"},
    {id:"ai",label:"Ranes AI",icon:"ai"},
  ];

  const COMP:Record<string,any>={
    home:()=><HomeView goTo={goTo}/>,
    services:()=><ServicesView goTo={goTo}/>,
    dashboard:DashboardView,
    active:ActiveDealsView,
    deals:DealsView,
    news:NewsView,
    ai:AIView,
  };
  const Active=COMP[view]||COMP.home;

  const sres=srch.length>1?ALL_DEALS.filter((d:any)=>
    d.company.toLowerCase().includes(srch.toLowerCase())||
    d.sector.toLowerCase().includes(srch.toLowerCase())||
    d.country.toLowerCase().includes(srch.toLowerCase())
  ).slice(0,6):[];

  const tickerDeals=ALL_DEALS.filter((d:any)=>d.year===2026);
  const ticker=tickerDeals.map((d:any)=>`[${d.flag}] ${d.company} · $${d.amount}M ${d.round} · ${d.country}`).join("   ·   ");

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}}/>
      {modal&&<LegalModal docKey={modal} onClose={()=>setModal(null)}/>}

      <div style={{minHeight:"100vh",background:WH}}>

        <nav style={{background:N2,position:"sticky",top:0,zIndex:200,borderBottom:`2px solid ${M4}`}}>
          <div style={{maxWidth:1600,margin:"0 auto",padding:"0 20px",height:58,display:"flex",alignItems:"center",gap:14}}>
            <LogoLockup onClick={()=>goTo("home")} onDark/>
            <button onClick={()=>goTo("home")} className={`nav-btn ${view==="home"?"on":""}`} style={{fontFamily:AN}}>Home</button>
            <div style={{width:1,height:18,background:"rgba(255,255,255,0.15)",margin:"0 2px"}}/>
            <button onClick={()=>goTo("services")} className={`nav-btn ${view==="services"?"on":""}`} style={{display:"flex",alignItems:"center",gap:5}}>
              <NavIcon id="svc" size={12} col={view==="services"?"#fff":"rgba(255,255,255,0.55)"}/>
              Services
            </button>
            <div style={{width:1,height:18,background:"rgba(255,255,255,0.15)",margin:"0 2px"}}/>
            <div style={{display:"flex",gap:1,flex:1,overflow:"hidden"}}>
              {NAV_ITEMS.filter(v=>!v.isServices).map(v=>(
                <button key={v.id} onClick={()=>goTo(v.id)} className={`nav-btn ${view===v.id?"on":""}`}>
                  <NavIcon id={v.icon} size={12} col={view===v.id?"#fff":"rgba(255,255,255,0.55)"}/> {v.label}
                  {v.badge&&<span style={{marginLeft:4,background:M,color:"#fff",borderRadius:8,fontSize:9,fontWeight:700,padding:"1px 5px"}}>{ACTIVE_DEALS.length}</span>}
                </button>
              ))}
            </div>
            <div style={{position:"relative"}}>
              <input value={srch} onChange={e=>{setSrch(e.target.value);setSrchOpen(true);}} onFocus={()=>setSrchOpen(true)} onBlur={()=>setTimeout(()=>setSrchOpen(false),200)}
                placeholder="Search..." style={{width:170,paddingLeft:28,fontSize:12,background:N3,border:`1px solid ${N4}`,color:"#fff"}}/>
              <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:TX3,fontSize:13}}>⌕</span>
              {srchOpen&&sres.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:WH,border:`1px solid ${BRD}`,borderRadius:7,marginTop:4,zIndex:300,boxShadow:`0 8px 28px ${N}33`}}>
                  {sres.map((r:any,i:number)=>(
                    <div key={i} className="tr-h" style={{padding:"9px 13px",cursor:"pointer",borderBottom:i<sres.length-1?`1px solid ${BRD}`:undefined}} onClick={()=>{goTo("deals");setSrch("");}}>
                      <div style={{fontSize:13,fontWeight:700,color:TX,fontFamily:AN,display:"flex",alignItems:"center",gap:6}}><FlagBadge code={r.flag}/>{r.company} , ${r.amount}M · {r.year}</div>
                      <div style={{fontSize:11,color:TX2,fontFamily:AN}}>{r.sector} · {r.country}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        <div style={{background:M,borderBottom:`1px solid ${M4}`,padding:"6px 0",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{background:M4,padding:"0 14px",display:"flex",alignItems:"center",gap:7,height:24,flexShrink:0}}>
              <span className="ldot"/>
              <span style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"#fff",fontFamily:AN}}>RANES ANALYTICS · LIVE Q1 2026 DEALS</span>
            </div>
            <div style={{overflow:"hidden",flex:1}}>
              <div style={{display:"inline-block",animation:"ticker 90s linear infinite",whiteSpace:"nowrap",fontSize:11,color:"rgba(255,255,255,0.85)",paddingLeft:20,fontFamily:AN}}>
                {ticker}&nbsp;&nbsp;&nbsp;{ticker}
              </div>
            </div>
          </div>
        </div>

        {(view==="home"||view==="services")?(
          <div><Active/></div>
        ):(
          <div style={{maxWidth:1600,margin:"0 auto",padding:"22px 20px",display:"flex",gap:20}}>
            <div style={{width:186,flexShrink:0}}>
              <div style={{position:"sticky",top:88,background:`linear-gradient(175deg,${N2} 0%,${N3} 100%)`,borderRadius:10,border:`1px solid ${N4}`,overflow:"hidden",padding:"14px 8px"}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,paddingLeft:14,fontFamily:AN}}>Navigation</div>
                <button onClick={()=>goTo("home")} className={`sb-btn ${view==="home"?"on":""}`}><NavIcon id="dashboard" size={13} col="rgba(255,255,255,0.55)"/>Home</button>
                <button onClick={()=>goTo("services")} className={`sb-btn ${view==="services"?"on":""}`}><NavIcon id="svc" size={13} col="rgba(255,255,255,0.55)"/>Advisory Services</button>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,marginTop:10,paddingLeft:14,fontFamily:AN}}>Data Tools</div>
                {NAV_ITEMS.filter(v=>!v.isServices).map(v=>(
                  <button key={v.id} onClick={()=>goTo(v.id)} className={`sb-btn ${view===v.id?"on":""}`}>
                    <NavIcon id={v.id} size={13} col="rgba(255,255,255,0.55)"/>{v.label}
                    {v.badge&&<span style={{marginLeft:"auto",background:M,color:"#fff",borderRadius:8,fontSize:9,fontWeight:700,padding:"1px 5px"}}>{ACTIVE_DEALS.length}</span>}
                  </button>
                ))}
                <div style={{height:1,background:"rgba(255,255,255,0.12)",margin:"12px 0"}}/>
                <div style={{padding:"12px",background:`${M}26`,borderRadius:7,border:`1px solid ${M}38`,margin:"4px 2px"}}>
                  <p style={{fontSize:12,fontWeight:700,color:M3,marginBottom:4,fontFamily:AN}}>Ask Ranes AI</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.38)",lineHeight:1.5,marginBottom:8,fontFamily:AN}}>Query 7 years of African investment data</p>
                  <button className="btn bp" style={{width:"100%",justifyContent:"center",fontSize:11,padding:"7px"}} onClick={()=>goTo("ai")}>Open Ranes AI</button>
                </div>
              </div>
            </div>
            <div style={{flex:1,minWidth:0}}><Active/></div>
          </div>
        )}

        <footer style={{background:N2,borderTop:`2px solid ${M4}`,padding:"30px 20px 22px"}}>
          <div style={{maxWidth:1600,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:20}}>
              <div><LogoLockup onClick={()=>goTo("home")} onDark/><p style={{fontSize:12,color:"rgba(255,255,255,0.36)",maxWidth:210,lineHeight:1.65,marginTop:10,fontFamily:AN}}>Africa's investment intelligence platform. 2019 to Q1 2026.</p></div>
              <div style={{display:"flex",gap:36,flexWrap:"wrap"}}>
                <div><div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",letterSpacing:1,textTransform:"uppercase",marginBottom:10,fontFamily:AN}}>Platform</div><div style={{marginBottom:6}}><button className="fl" onClick={()=>goTo("home")}>Home</button></div><div style={{marginBottom:6}}><button className="fl" onClick={()=>goTo("services")}>Advisory Services</button></div>{NAV_ITEMS.filter(v=>!v.isServices).map(v=><div key={v.id} style={{marginBottom:6}}><button className="fl" onClick={()=>goTo(v.id)}>{v.label}</button></div>)}</div>
                <div><div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",letterSpacing:1,textTransform:"uppercase",marginBottom:10,fontFamily:AN}}>Legal</div>{[["Privacy Policy","privacy"],["Terms & Conditions","terms"],["GDPR Compliance","gdpr"],["Kenya & Nigeria DPA","kdpa"],["Investment Disclaimer","disclaimer"]].map(([l,d])=>(<div key={l} style={{marginBottom:6}}><button className="fl" onClick={()=>setModal(d)}>{l}</button></div>))}</div>
                <div><div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",letterSpacing:1,textTransform:"uppercase",marginBottom:10,fontFamily:AN}}>Data Sources</div>{[["TechCabal Insights","https://insights.techcabal.com"],["LaunchBase Africa","https://launchbaseafrica.com"],["Africa: The Big Deal","https://africabigdeal.com"],["Condia Tracker","https://thecondia.com"]].map(([l,url])=>(<div key={l} style={{marginBottom:6}}><a href={url} target="_blank" rel="noreferrer" style={{fontSize:12,color:"rgba(255,255,255,0.36)",textDecoration:"none",fontFamily:AN}}>{l} ↗</a></div>))}</div>
              </div>
            </div>
            <div id="contact-anchor"><ContactBox/></div>
            <div style={{height:1,background:"rgba(255,255,255,0.1)",margin:"18px 0 14px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontFamily:AN}}>© 2026 <strong style={{color:"rgba(255,255,255,0.6)"}}>Ranes Analytics</strong> · All rights reserved.<span style={{margin:"0 8px",opacity:0.25}}>|</span><button style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:12,cursor:"pointer",fontFamily:AN}} onClick={()=>setModal("disclaimer")}>Not investment advice.</button><span style={{margin:"0 8px",opacity:0.25}}>|</span><button style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:12,cursor:"pointer",fontFamily:AN}} onClick={()=>setModal("gdpr")}>GDPR</button></div>
              <div style={{display:"flex",gap:8}}><span className="badge bgn">Verified</span><span className="badge bm">Ranes AI</span><span className="badge bn">2019–2026</span></div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
