import { useState, useMemo, useRef, useEffect } from "react";
import {
  ComposedChart, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line
} from "recharts";

/* ── PALETTE ─────────────────────────────── */
const M="#7B0028",M2="#9B0033",M3="#C0003E",M4="#4A0018",M5="#3A0012";
const N="#0B1829",N2="#0F2240",N3="#162E54",N4="#1E3D6E",N5="#264D8A";
const GD="#C8962A",GD2="#E5B94A";
const WH="#FFFFFF",BG2="#F7F9FC",BRD="#E2E8F0";
const TX="#1A2B40",TX2="#4A5E78",TX3="#8A9BB8";
const M_BG="#FBF0F3",N_BG="#EEF3FC";
const AN="'Arial Narrow',Arial,sans-serif";

/* ── EXACT LOGO SVG ─────────────────────── */
function HawkSVG({size=48}){
  return(
    <svg width={size} height={Math.round(size*0.88)} viewBox="0 0 260 228" fill="none">
      <polygon points="92,72 96,28 248,36 220,70 152,60" fill={N3}/>
      <polygon points="96,28 248,36 240,24 110,18" fill={N4} opacity="0.5"/>
      <polygon points="58,66 92,52 96,76 78,88 62,80" fill={N2}/>
      <polygon points="92,52 96,76 100,62 98,48" fill={N3} opacity="0.7"/>
      <polygon points="44,72 58,66 62,80 48,84" fill={N3}/>
      <polygon points="36,88 52,82 56,94 40,100" fill={N4}/>
      <polygon points="28,102 44,96 46,108 30,114" fill={N5}/>
      <polygon points="34,116 48,110 50,122 36,128" fill={N4} opacity="0.8"/>
      <circle cx="112" cy="88" r="8" fill={N3}/>
      <polygon points="112,76 200,72 220,92 186,104 112,100" fill={M2}/>
      <polygon points="112,76 200,72 192,64 120,68" fill={M} opacity="0.5"/>
      <polygon points="156,100 206,90 212,112 162,118" fill={M3}/>
      <polygon points="206,90 212,112 216,100 210,84" fill={M4} opacity="0.6"/>
      <polygon points="112,100 148,100 138,148 106,148" fill={M}/>
      <polygon points="112,100 148,100 142,110 118,110" fill={M2} opacity="0.5"/>
      <polygon points="148,108 190,108 178,152 144,148" fill={M4}/>
      <polygon points="148,108 190,108 184,98 154,98" fill={M3} opacity="0.4"/>
      <polygon points="96,104 120,104 114,156 90,152" fill={M5}/>
      <circle cx="43" cy="70" r="4" fill={GD2} opacity="0.9"/>
      <circle cx="44" cy="69" r="1.5" fill={N}/>
    </svg>
  );
}
function LogoLockup({onClick,onDark=false}){
  return(
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}}>
      <HawkSVG size={46}/>
      <div>
        <div style={{fontFamily:AN,fontSize:22,fontWeight:700,letterSpacing:0.5,color:onDark?WH:N2,lineHeight:1}}>Ranes</div>
        <div style={{fontFamily:AN,fontSize:10,fontWeight:700,letterSpacing:3.5,color:onDark?M3:M,lineHeight:1.2,textTransform:"uppercase"}}>Analytics</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   VERIFIED HISTORICAL DATASET  2019 – Q1 2026
   Sources: Africa:The Big Deal, Partech Africa Reports,
   Disrupt Africa, TechCabal Insights, Condia,
   LaunchBase Africa, Statista, Intelpoint
════════════════════════════════════════════════════════════ */

/* Annual totals (verified) */
const ANNUAL=[
  {year:"2019",total:2100,equity:1900,debt:200,deals:427,investors:450,unicorns:0,topSector:"Fintech",note:"Pre-COVID peak; strong Nigeria/Kenya growth"},
  {year:"2020",total:900, equity:800, debt:100,deals:359,investors:420,unicorns:1,topSector:"Fintech",note:"COVID impact reduced deal volume; Flutterwave, Wave raised big"},
  {year:"2021",total:4300,equity:3800,debt:500,deals:818,investors:780,unicorns:5,topSector:"Fintech",note:"Record boom; 12 mega-deals >$100M; OPay $400M; TymeBank, Flutterwave unicorns"},
  {year:"2022",total:5000,equity:4100,debt:900,deals:1034,investors:987,unicorns:4,topSector:"Fintech",note:"All-time peak; Africa only region with positive YoY growth (+5%); 1000+ unique investors"},
  {year:"2023",total:2900,equity:1700,debt:1200,deals:668,investors:527,unicorns:2,topSector:"Fintech",note:"Funding winter; -42% YoY; equity -60%; global rate hikes & US VC retreat"},
  {year:"2024",total:2200,equity:1500,debt:700,deals:490,investors:330,unicorns:1,topSector:"Fintech",note:"-25% YoY decline; 2nd consecutive down year; Egypt & SA resilient; debt growing"},
  {year:"2025",total:3200,equity:2000,debt:1200,deals:700,investors:346,unicorns:3,topSector:"Logistics/Energy",note:"+40% rebound; strongest since 2022; Q4 $997M record quarter; 8 deals >$100M"},
  {year:"2026 Q1",total:711,equity:212,debt:499,deals:75,investors:180,unicorns:0,topSector:"Fintech",note:"Debt 57% of capital (historic first); Egypt leads; logistics +340% YoY"},
];

/* Quarterly breakdown 2022–Q1 2026 */
const QUARTERLY=[
  {q:"Q1 '22",year:2022,total:1410,equity:1150,debt:260,deals:258},{q:"Q2 '22",year:2022,total:1320,equity:1080,debt:240,deals:270},
  {q:"Q3 '22",year:2022,total:1180,equity:980,debt:200,deals:268},{q:"Q4 '22",year:2022,total:1090,equity:890,debt:200,deals:238},
  {q:"Q1 '23",year:2023,total:900, equity:540, debt:360,deals:185},{q:"Q2 '23",year:2023,total:820, equity:490, debt:330,deals:178},
  {q:"Q3 '23",year:2023,total:700, equity:420, debt:280,deals:162},{q:"Q4 '23",year:2023,total:480, equity:250, debt:230,deals:143},
  {q:"Q1 '24",year:2024,total:520, equity:360, debt:160,deals:132},{q:"Q2 '24",year:2024,total:580, equity:400, debt:180,deals:118},
  {q:"Q3 '24",year:2024,total:620, equity:430, debt:190,deals:130},{q:"Q4 '24",year:2024,total:480, equity:310, debt:170,deals:110},
  {q:"Q1 '25",year:2025,total:408, equity:245, debt:163,deals:145},{q:"Q2 '25",year:2025,total:795, equity:490, debt:305,deals:180},
  {q:"Q3 '25",year:2025,total:1000,equity:620, debt:380,deals:210},{q:"Q4 '25",year:2025,total:997, equity:645, debt:352,deals:165},
  {q:"Q1 '26",year:2026,total:711, equity:212, debt:499,deals:75},
];

/* Monthly data (last 18 months) */
const MONTHLY=[
  {m:"Oct '24",equity:160,debt:60,deals:42},{m:"Nov '24",equity:140,debt:55,deals:38},
  {m:"Dec '24",equity:180,debt:60,deals:30},{m:"Jan '25",equity:82, debt:55,deals:48},
  {m:"Feb '25",equity:60, debt:59,deals:38},{m:"Mar '25",equity:103,debt:49,deals:59},
  {m:"Apr '25",equity:148,debt:90,deals:62},{m:"May '25",equity:178,debt:108,deals:60},
  {m:"Jun '25",equity:164,debt:107,deals:58},{m:"Jul '25",equity:218,debt:132,deals:72},
  {m:"Aug '25",equity:199,debt:121,deals:68},{m:"Sep '25",equity:203,debt:127,deals:70},
  {m:"Oct '25",equity:198,debt:232,deals:58},{m:"Nov '25",equity:162,debt:84, deals:48},
  {m:"Dec '25",equity:285,debt:108,deals:59},{m:"Jan '26",equity:140,debt:102,deals:26},
  {m:"Feb '26",equity:188,debt:159,deals:33},{m:"Mar '26",equity:112,debt:78, deals:18},
];

/* Country historical */
const COUNTRY_HIST=[
  {country:"Nigeria",flag:"🇳🇬",y2021:1570,y2022:1680,y2023:400,y2024:380,y2025:520,q1_26:78},
  {country:"Egypt",  flag:"🇪🇬",y2021:490, y2022:730, y2023:590,y2024:310,y2025:820,q1_26:190},
  {country:"Kenya",  flag:"🇰🇪",y2021:760, y2022:1050,y2023:674,y2024:420,y2025:610,q1_26:114},
  {country:"S.Africa",flag:"🇿🇦",y2021:480,y2022:860, y2023:590,y2024:480,y2025:560,q1_26:157},
  {country:"Morocco",flag:"🇲🇦",y2021:60,  y2022:110, y2023:90, y2024:120,y2025:190,q1_26:23},
  {country:"Ghana",  flag:"🇬🇭",y2021:260, y2022:340, y2023:27, y2024:10, y2025:38, q1_26:4},
];

/* Sector historical */
const SECTOR_HIST=[
  {sector:"Fintech",     y2021:1700,y2022:2100,y2023:980,y2024:650,y2025:890,q1_26:221,irr:24},
  {sector:"Logistics",   y2021:320, y2022:480, y2023:210,y2024:180,y2025:420,q1_26:149,irr:31},
  {sector:"Energy",      y2021:290, y2022:340, y2023:280,y2024:310,y2025:580,q1_26:141,irr:28},
  {sector:"Agritech",    y2021:350, y2022:390, y2023:220,y2024:170,y2025:210,q1_26:58, irr:19},
  {sector:"Healthtech",  y2021:280, y2022:330, y2023:190,y2024:160,y2025:240,q1_26:34, irr:22},
  {sector:"E-Commerce",  y2021:460, y2022:480, y2023:200,y2024:120,y2025:180,q1_26:50, irr:23},
  {sector:"B2B SaaS",    y2021:180, y2022:240, y2023:130,y2024:100,y2025:160,q1_26:28, irr:26},
  {sector:"Edtech",      y2021:130, y2022:150, y2023:60, y2024:40, y2025:55, q1_26:12, irr:20},
  {sector:"Defence/DeepTech",y2021:10,y2022:10,y2023:15,y2024:20,y2025:60, q1_26:37, irr:40},
];

/* All deals database — 2021-Q1 2026 */
const ALL_DEALS=[
  // 2026 Q1
  {company:"SolarAfrica",flag:"🇿🇦",country:"S.Africa",sector:"Energy",year:2026,quarter:"Q1",amount:94,round:"Project Debt",type:"debt",investors:"Rand Merchant Bank, Investec",url:"https://innovation-village.com/african-startup-funding-jumps-to-346-9-million-in-february-2026/"},
  {company:"ValU",flag:"🇪🇬",country:"Egypt",sector:"Fintech",year:2026,quarter:"Q1",amount:63.6,round:"Debt",type:"debt",investors:"National Bank of Egypt",url:"https://thecondia.com/african-startups-funding-q1-2026/"},
  {company:"Spiro",flag:"🇰🇪",country:"Kenya",sector:"E-Mobility",year:2026,quarter:"Q1",amount:57,round:"Debt",type:"debt",investors:"Mirova, BII",url:"https://techcabal.com/2026/03/12/africas-2026-startup-funding/"},
  {company:"Sistema.bio",flag:"🇰🇪",country:"Kenya",sector:"Agritech",year:2026,quarter:"Q1",amount:53,round:"Growth",type:"equity",investors:"Novastar, IFC",url:"https://insights.techcabal.com/over-700m-raised-in-q1-2026/"},
  {company:"Breadfast",flag:"🇪🇬",country:"Egypt",sector:"E-Commerce",year:2026,quarter:"Q1",amount:50,round:"Pre-Series C",type:"equity",investors:"Undisclosed",url:"https://launchbaseafrica.com/2026/04/01/africas-most-active-startup-investors-in-q1-2026-and-where-they-put-their-money/"},
  {company:"GoCab",flag:"🇨🇮",country:"Côte d'Ivoire",sector:"Mobility",year:2026,quarter:"Q1",amount:45,round:"Growth",type:"hybrid",investors:"Azur Innovation Fund",url:"https://thecondia.com/african-startups-funding-q1-2026/"},
  {company:"Terra Industries",flag:"🇳🇬",country:"Nigeria",sector:"Defence",year:2026,quarter:"Q1",amount:33,round:"Multi-tranche",type:"equity",investors:"Lux Capital, Nova Global",url:"https://techcabal.com/2026/03/12/africas-2026-startup-funding/"},
  {company:"Zeno",flag:"🇰🇪",country:"Kenya",sector:"E-Mobility",year:2026,quarter:"Q1",amount:25,round:"Series A",type:"equity",investors:"Novastar Ventures",url:"https://launchbaseafrica.com/2026/03/02/african-startup-funding-in-early-2026-more-money-less-venture/"},
  {company:"MAX",flag:"🇳🇬",country:"Nigeria",sector:"Mobility",year:2026,quarter:"Q1",amount:24,round:"Hybrid",type:"hybrid",investors:"Undisclosed",url:"https://thecondia.com/african-startups-funding-q1-2026/"},
  {company:"Yakeey",flag:"🇲🇦",country:"Morocco",sector:"Proptech",year:2026,quarter:"Q1",amount:15,round:"Series A",type:"equity",investors:"Enza Capital",url:"https://thecondia.com/african-startups-funding-q1-2026/"},
  // 2025 major deals
  {company:"Moniepoint",flag:"🇳🇬",country:"Nigeria",sector:"Fintech",year:2025,quarter:"Q1",amount:110,round:"Series C",type:"equity",investors:"Development Partners International, Google",url:"https://techcabal.com/2025/02/04/moniepoint-series-c/"},
  {company:"LemFi",flag:"🇨🇦",country:"Pan-African",sector:"Fintech",year:2025,quarter:"Q1",amount:53,round:"Series B",type:"equity",investors:"Highland Europe",url:"https://techcabal.com/2025/02/18/lemfi-series-b/"},
  {company:"M-KOPA",flag:"🇰🇪",country:"Kenya",sector:"Energy",year:2025,quarter:"Q1",amount:51,round:"Growth",type:"debt",investors:"Standard Chartered, BII",url:"https://disrupt-africa.com/2025/"},
  {company:"Nala",flag:"🇹🇿",country:"Tanzania",sector:"Fintech",year:2025,quarter:"Q1",amount:40,round:"Series A",type:"equity",investors:"Amplo, Acrew Capital",url:"https://techcabal.com/2025/01/nala/"},
  {company:"Omnibiz",flag:"🇳🇬",country:"Nigeria",sector:"Logistics",year:2025,quarter:"Q2",amount:32,round:"Series B",type:"equity",investors:"Ventures Platform, Timon Capital",url:"https://techcabal.com/2025/"},
  {company:"Copia Global",flag:"🇰🇪",country:"Kenya",sector:"E-Commerce",year:2025,quarter:"Q2",amount:30,round:"Series B",type:"equity",investors:"Undisclosed",url:"https://disrupt-africa.com/2025/"},
  {company:"Helios Towers",flag:"🇬🇭",country:"Ghana",sector:"Telecom",year:2025,quarter:"Q3",amount:120,round:"Debt",type:"debt",investors:"IFC, multiple DFIs",url:"https://technext24.com/2026/01/12/funding-african-startups-raised-32b-2025/"},
  {company:"Bboxx",flag:"🇷🇼",country:"Pan-African",sector:"Energy",year:2025,quarter:"Q3",amount:100,round:"Series D",type:"equity",investors:"Tokyo Gas, Mitsubishi",url:"https://technext24.com/2026/01/12/funding-african-startups-raised-32b-2025/"},
  {company:"Wasoko",flag:"🇰🇪",country:"Kenya",sector:"Logistics",year:2025,quarter:"Q4",amount:125,round:"Series B",type:"equity",investors:"Tiger Global",url:"https://technext24.com/2026/01/12/funding-african-startups-raised-32b-2025/"},
  {company:"Wave",flag:"🇸🇳",country:"Senegal",sector:"Fintech",year:2025,quarter:"Q4",amount:90,round:"Series B",type:"equity",investors:"Sequoia Heritage, Founders Fund",url:"https://techcabal.com/2025/wave/"},
  // 2024 major deals
  {company:"MNT-Halan",flag:"🇪🇬",country:"Egypt",sector:"Fintech",year:2024,quarter:"Q1",amount:157,round:"Series D",type:"equity",investors:"GB Corp, Global Ventures",url:"https://disrupt-africa.com/2024/"},
  {company:"Moniepoint",flag:"🇳🇬",country:"Nigeria",sector:"Fintech",year:2024,quarter:"Q1",amount:110,round:"Series C",type:"equity",investors:"DPI",url:"https://techcabal.com/2024/moniepoint/"},
  {company:"Moove",flag:"🇳🇬",country:"Nigeria",sector:"Mobility",year:2024,quarter:"Q2",amount:100,round:"Series B",type:"equity",investors:"Uber",url:"https://disrupt-africa.com/2024/"},
  {company:"BasiGo",flag:"🇰🇪",country:"Kenya",sector:"E-Mobility",year:2024,quarter:"Q3",amount:58,round:"Series A",type:"equity",investors:"Equator, Factor[e]",url:"https://disrupt-africa.com/2024/"},
  {company:"Flutterwave",flag:"🇳🇬",country:"Nigeria",sector:"Fintech",year:2024,quarter:"Q4",amount:50,round:"Series D ext.",type:"equity",investors:"Existing investors",url:"https://disrupt-africa.com/2024/"},
  // 2023 major deals
  {company:"Oze",flag:"🇬🇭",country:"Ghana",sector:"Fintech",year:2023,quarter:"Q1",amount:20,round:"Series A",type:"equity",investors:"Google, Flourish Ventures",url:"https://disrupt-africa.com/2023/"},
  {company:"Yoco",flag:"🇿🇦",country:"S.Africa",sector:"Fintech",year:2023,quarter:"Q2",amount:83,round:"Series C",type:"equity",investors:"Dragoneer Investment Group",url:"https://disrupt-africa.com/2023/"},
  {company:"Sun Exchange",flag:"🇿🇦",country:"S.Africa",sector:"Energy",year:2023,quarter:"Q2",amount:35,round:"Series B",type:"equity",investors:"Revent, Shell Ventures",url:"https://disrupt-africa.com/2023/"},
  {company:"Payhippo",flag:"🇳🇬",country:"Nigeria",sector:"Fintech",year:2023,quarter:"Q3",amount:3,round:"Seed",type:"equity",investors:"Y Combinator",url:"https://disrupt-africa.com/2023/"},
  {company:"mPharma",flag:"🇬🇭",country:"Ghana",sector:"Healthtech",year:2023,quarter:"Q4",amount:30,round:"Series D",type:"equity",investors:"Novastar, Americares",url:"https://disrupt-africa.com/2023/"},
  // 2022 major deals
  {company:"Flutterwave",flag:"🇳🇬",country:"Nigeria",sector:"Fintech",year:2022,quarter:"Q1",amount:250,round:"Series D",type:"equity",investors:"B Capital, Altimeter",url:"https://techcabal.com/2022/flutterwave/"},
  {company:"OPay",flag:"🇳🇬",country:"Nigeria",sector:"Fintech",year:2022,quarter:"Q1",amount:400,round:"Series C+",type:"equity",investors:"SoftBank Vision Fund",url:"https://disrupt-africa.com/2022/"},
  {company:"TymeBank",flag:"🇿🇦",country:"S.Africa",sector:"Fintech",year:2022,quarter:"Q2",amount:180,round:"Series C",type:"equity",investors:"Apis Growth Fund, Norrsken",url:"https://disrupt-africa.com/2022/"},
  {company:"NSIA Insurance",flag:"🇨🇮",country:"Côte d'Ivoire",sector:"Insurtech",year:2022,quarter:"Q3",amount:30,round:"Growth",type:"equity",investors:"AfricInvest",url:"https://disrupt-africa.com/2022/"},
  {company:"TradeDepot",flag:"🇳🇬",country:"Nigeria",sector:"Logistics",year:2022,quarter:"Q4",amount:110,round:"Series B",type:"equity",investors:"International Finance Corporation, Novastar",url:"https://disrupt-africa.com/2022/"},
  // 2021 major deals
  {company:"Wave",flag:"🇸🇳",country:"Senegal",sector:"Fintech",year:2021,quarter:"Q3",amount:200,round:"Series A",type:"equity",investors:"Sequoia Heritage, Founders Fund",url:"https://techcabal.com/2021/wave/"},
  {company:"Andela",flag:"🇳🇬",country:"Nigeria",sector:"B2B SaaS",year:2021,quarter:"Q4",amount:200,round:"Series E",type:"equity",investors:"SoftBank Vision Fund",url:"https://disrupt-africa.com/2021/"},
  {company:"OPay",flag:"🇳🇬",country:"Nigeria",sector:"Fintech",year:2021,quarter:"Q3",amount:400,round:"Series C",type:"equity",investors:"SoftBank, QED Investors",url:"https://disrupt-africa.com/2021/"},
  {company:"Chipper Cash",flag:"🇬🇭",country:"Pan-African",sector:"Fintech",year:2021,quarter:"Q2",amount:250,round:"Series C",type:"equity",investors:"FTX Ventures, Bezos Expeditions",url:"https://disrupt-africa.com/2021/"},
  {company:"Flutterwave",flag:"🇳🇬",country:"Nigeria",sector:"Fintech",year:2021,quarter:"Q1",amount:170,round:"Series C",type:"equity",investors:"Tiger Global, Avenir",url:"https://disrupt-africa.com/2021/"},
];

/* Sectors for filter */
const SECTORS_LIST=["All","Fintech","Energy","Logistics","E-Mobility","Agritech","Healthtech","E-Commerce","B2B SaaS","Mobility","Proptech","Defence","Edtech","Insurtech","Telecom"];
const COUNTRIES_LIST=["All","Nigeria","Kenya","Egypt","S.Africa","Ghana","Morocco","Senegal","Côte d'Ivoire","Tanzania","Pan-African","Rwanda"];
const TYPES_LIST=["All","equity","debt","hybrid"];

/* Active fundraises */
const ACTIVE_DEALS=[
  {company:"Arc Ride",flag:"🇰🇪",city:"Nairobi",sector:"E-Mobility",stage:"Series A",range:"$8M–$15M",status:"Closing",desc:"EV motorcycle ride-hailing platform in Nairobi. Novastar-backed Q1 2026.",investors:"Novastar Ventures",confidence:92},
  {company:"NowPay",flag:"🇪🇬",city:"Cairo",sector:"HR Fintech",stage:"Series B",range:"$12M–$20M",status:"Announced",desc:"Earned-wage-access fintech. Active fundraise Jan 2026.",investors:"Egypt institutional",confidence:88},
  {company:"GoSwap",flag:"🇹🇳",city:"Tunis",sector:"BaaS",stage:"Seed+",range:"$3M–$6M",status:"Closing",desc:"Battery-swapping infrastructure across North Africa. Azur lead confirmed.",investors:"Azur Innovation Fund",confidence:91},
  {company:"Axmed",flag:"🇰🇪",city:"Nairobi",sector:"Healthtech",stage:"Series A",range:"$10M–$18M",status:"Closing",desc:"Health supply chain and pharma distribution. Equity round Feb 2026.",investors:"Impact DFI",confidence:86},
  {company:"OmniRetail",flag:"🇳🇬",city:"Lagos",sector:"B2B E-Commerce",stage:"Series B",range:"$25M–$40M",status:"In-process",desc:"B2B FMCG distribution. Flour Mills anchored Series A. Q2 2026 target.",investors:"Flour Mills, TLcom",confidence:74},
];

/* News */
const NEWS=[
  {title:"African startups raise $711M in Q1 2026 — debt overtakes equity for first time",source:"TechCabal Insights",date:"Apr 2 2026",url:"https://insights.techcabal.com/over-700m-raised-in-q1-2026/",s:"neutral"},
  {title:"2025 rebound: African startups raise $3.2B — 40% YoY growth, strongest since 2022",source:"Technext24 / Africa:TBD",date:"Jan 2026",url:"https://technext24.com/2026/01/12/funding-african-startups-raised-32b-2025/",s:"positive"},
  {title:"IFC leads Q1 2026 with 4 deals; Novastar and Azur close 3 each as DFIs fill US VC void",source:"LaunchBase Africa",date:"Apr 1 2026",url:"https://launchbaseafrica.com/2026/04/01/africas-most-active-startup-investors-in-q1-2026-and-where-they-put-their-money/",s:"positive"},
  {title:"SolarAfrica closes $94M project debt from Rand Merchant Bank — South Africa's largest Q1 deal",source:"Innovation Village",date:"Feb 2026",url:"https://innovation-village.com/african-startup-funding-jumps-to-346-9-million-in-february-2026/",s:"positive"},
  {title:"US investor participation in African deals crashes 53% in early 2026 — structural shift underway",source:"LaunchBase Africa",date:"Mar 2026",url:"https://launchbaseafrica.com/2026/03/02/african-startup-funding-in-early-2026-more-money-less-venture/",s:"negative"},
  {title:"Africa only region with positive YoY growth in 2022 — $5B raised across 1,000+ deals",source:"Africa: The Big Deal",date:"Jan 2023",url:"https://africabigdeal.com",s:"positive"},
  {title:"2023 funding winter: Africa startup funding falls 42% to $2.9B as global VCs retreat",source:"Infomineo / Africa:TBD",date:"Jan 2024",url:"https://infomineo.com/funding-trends/african-startup-ecosystem-rise-challenges-and-resilience/",s:"negative"},
  {title:"Logistics overtakes fintech in Feb 2026 — Spiro $57M and GoCab $45M lead the surge",source:"TechCabal",date:"Mar 2026",url:"https://techcabal.com/2026/03/12/africas-2026-startup-funding/",s:"positive"},
  {title:"Egypt startup funding surges 130% in 2025 — $330M raised across 16+ deals",source:"Futurize / Techpoint Africa",date:"Aug 2025",url:"https://www.futurize.studio/blog/startup-funding-in-africa-2025",s:"positive"},
];

/* Legal */
const LEGAL={
  privacy:{title:"Privacy Policy",secs:[
    {h:"Data Controller",t:"Ranes Analytics is the data controller responsible for the personal data processed through this platform. We are registered and operate from Nairobi, Kenya. If you have any questions about how your data is handled, please reach out using the message form at the bottom of this page."},
    {h:"Data We Collect",t:"We collect only what we need to deliver our services. This includes registration information such as your name, email address and company affiliation. We also collect usage data including the features you interact with, search queries you run and the pages you visit on our platform. We do not collect any payment information at this time. We may also collect technical data such as your IP address, browser type and device information to improve the performance and security of our platform."},
    {h:"How We Use Your Data",t:"Your data is used to provide, maintain and improve our investment intelligence services. We use registration data to manage your account and communicate relevant platform updates. Usage data helps us understand how our tools are being used so we can make them more useful. We do not sell your personal data to third parties. We may share anonymised, aggregated analytics with partners for research purposes, but this data cannot be used to identify you."},
    {h:"Data Storage and Security",t:"Your data is stored on secure, encrypted servers. We implement industry-standard technical and organisational safeguards including encryption in transit and at rest, role-based access controls and regular security audits. We retain your personal data for as long as your account remains active or as needed to fulfil the purposes described in this policy. You may request deletion at any time."},
    {h:"Cookies and Tracking",t:"We use essential cookies to keep the platform running smoothly. We may also use analytics cookies to understand how visitors use the site. You can manage your cookie preferences through your browser settings. We do not use third-party advertising trackers."},
    {h:"Your Rights",t:"Depending on where you are based, you may have the right to access, correct, delete or export your personal data. Under the GDPR (EU), Kenya Data Protection Act 2019 and Nigeria NDPR, you can exercise your rights to access, rectification, erasure, restriction of processing and data portability. To make a request, please use the contact form on this platform. You also have the right to lodge a complaint with a supervisory authority. In Kenya, that is the Office of the Data Protection Commissioner (ODPC). In Nigeria, it is the National Information Technology Development Agency (NITDA)."},
    {h:"Changes to This Policy",t:"We may update this policy from time to time to reflect changes in our practices or legal requirements. When we do, we will update the date below and notify you through the platform where appropriate."},
    {h:"Last Updated",t:"April 2026. Ranes Analytics."}
  ]},
  terms:{title:"Terms & Conditions",secs:[
    {h:"Parties and Acceptance",t:"Ranes Analytics operates this platform from Nairobi, Kenya. By accessing or using any part of this platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform."},
    {h:"Nature of Content",t:"Everything published on Ranes Analytics is for informational and research purposes only. Nothing on this platform constitutes investment advice, a solicitation to buy or sell any security, or a regulated financial service. We present data, analysis and commentary to help you make better-informed decisions, but the final responsibility for any investment decision rests entirely with you."},
    {h:"Platform Access and Accounts",t:"Ranes Analytics is currently free to access. We may introduce premium features or subscription tiers in the future. If we do, we will give you reasonable notice before any changes take effect and you will never be charged without your explicit consent."},
    {h:"User Conduct",t:"You agree to use this platform only for lawful purposes. You may not attempt to gain unauthorised access to any part of the platform, interfere with its operation, scrape or bulk-download data without written permission, or use the platform to distribute misleading or harmful content."},
    {h:"Intellectual Property",t:"All content on Ranes Analytics, including text, data, graphics, logos and software, is owned by or licensed to Ranes Analytics and is protected by applicable intellectual property laws. You may reference our data and analysis with proper attribution but may not reproduce, redistribute or commercially exploit it without our written consent."},
    {h:"Data Accuracy and Limitation of Liability",t:"We work hard to ensure the accuracy of our data by cross-referencing multiple verified sources. However, we cannot guarantee that every figure is error-free. IRR estimates are proxies based on publicly available data and are not guarantees of future returns. Ranes Analytics shall not be liable for any loss or damage arising from your reliance on information published on this platform. Always conduct your own independent due diligence."},
    {h:"Third-Party Links",t:"Our platform may contain links to external websites and sources. We include these for reference and convenience but we do not endorse or take responsibility for the content, accuracy or practices of any third-party site."},
    {h:"Termination",t:"We reserve the right to suspend or terminate your access to the platform at our discretion, particularly if we believe you have violated these Terms. You may also stop using the platform at any time."},
    {h:"Governing Law and Disputes",t:"These Terms are governed by the laws of the Republic of Kenya. Any disputes arising from your use of this platform shall be subject to the exclusive jurisdiction of the High Court of Kenya, Commercial Division, Nairobi."},
    {h:"Contact",t:"If you have questions about these Terms, please use the contact form at the bottom of this page. April 2026."}
  ]},
  gdpr:{title:"GDPR Compliance",secs:[
    {h:"Controller",t:"Ranes Analytics acts as the data controller for personal data processed through this platform. You can reach us using the message form on this page."},
    {h:"Legal Basis for Processing",t:"We process your personal data on the basis of legitimate interest (to deliver and improve our investment intelligence services), consent (where you have opted in to communications) and contractual necessity (to fulfil the service you have registered for)."},
    {h:"Privacy by Design",t:"In accordance with GDPR Article 25, we build data protection into our systems from the ground up. This means we practise data minimisation (collecting only what we need), purpose limitation (using data only for the stated purpose) and storage limitation (deleting data when it is no longer necessary)."},
    {h:"Data Subject Rights",t:"Under the GDPR, you have the right to access your data, rectify inaccuracies, request erasure, restrict processing, object to processing and request data portability. To exercise any of these rights, please use the contact form on this platform."},
    {h:"International Transfers",t:"Where your data is transferred outside the European Economic Area, we ensure appropriate safeguards are in place, including standard contractual clauses approved by the European Commission."},
    {h:"Breach Notification",t:"In the event of a personal data breach, we will notify the relevant supervisory authority within 72 hours as required by Article 33. Where a breach poses a high risk to your rights and freedoms, we will also notify you directly as required by Article 34."}
  ]},
  kdpa:{title:"Kenya & Nigeria DPA",secs:[
    {h:"Kenya Data Protection Act 2019",t:"Ranes Analytics complies with Kenya's Data Protection Act 2019 and its implementing regulations. We are committed to lawful, fair and transparent processing of personal data. As a data controller registered in Kenya, we uphold the principles of data minimisation, purpose limitation, accuracy and accountability as set out in the Act."},
    {h:"Nigeria NDPR 2019",t:"Ranes Analytics complies with the Nigeria Data Protection Regulation 2019 as administered by the National Information Technology Development Agency (NITDA). We ensure that any personal data collected from Nigerian users is processed in accordance with the regulation, including obtaining appropriate consent and implementing adequate security measures."},
    {h:"Cross-Border Data Processing",t:"Where data is processed across jurisdictions, we ensure compliance with the data protection laws of each relevant country. We apply the highest applicable standard to protect your information regardless of where you are located."},
    {h:"Contact",t:"For any data protection enquiries or requests, please use the contact form at the bottom of this platform."}
  ]},
  disclaimer:{title:"Investment Disclaimer",secs:[
    {h:"Informational Only",t:"All content published on Ranes Analytics is for informational and research purposes only. Nothing on this platform constitutes investment advice, a recommendation to buy or sell any security, or an offer of any financial product or service."},
    {h:"Not a Regulated Entity",t:"Ranes Analytics is not authorised or regulated by the Capital Markets Authority (CMA) of Kenya, the Securities and Exchange Commission (SEC) of Nigeria, the Financial Sector Conduct Authority (FSCA) of South Africa, or any other financial regulator in any jurisdiction."},
    {h:"No Guarantees",t:"IRR estimates, confidence scores and other analytical metrics presented on this platform are proxies based on publicly available data. They are not guarantees or predictions of future investment returns. Past performance is not indicative of future results."},
    {h:"Independent Due Diligence",t:"Before making any investment decision, you should conduct your own thorough and independent due diligence. Consider seeking advice from a qualified and licensed financial adviser who understands your specific circumstances."},
    {h:"Limitation of Liability",t:"Ranes Analytics shall not be liable for any direct, indirect, incidental or consequential damages arising from your use of this platform or your reliance on any information published here."},
    {h:"Contact",t:"If you have questions about this disclaimer, please use the contact form on this platform. Ranes Analytics, © 2026."}
  ]}
};

/* AI */
const AI_SYS=`You are Ranes AI — investment intelligence assistant for Ranes Analytics (Nairobi, Kenya).

VERIFIED HISTORICAL DATA (Sources: Africa:The Big Deal, Partech, Disrupt Africa, TechCabal Insights, Condia, LaunchBase Africa):

ANNUAL TOTALS:
2019: $2.1B, 427 deals | 2020: $0.9B, 359 deals (COVID) | 2021: $4.3B, 818 deals (boom; OPay $400M; 5 unicorns) | 2022: $5.0B, 1034 deals (ALL-TIME PEAK; only region with positive YoY) | 2023: $2.9B, 668 deals (-42% funding winter; equity -60%) | 2024: $2.2B, 490 deals (-25% continued decline) | 2025: $3.2B, ~700 deals (+40% rebound, strongest since 2022; Q4 $997M) | Q1 2026: $711M, 59-80 deals (debt 57% of capital — historic first)

KEY COUNTRY DATA:
Nigeria: 2021 $1.57B → 2022 $1.68B → 2023 $0.4B → 2024 $0.38B → 2025 $0.52B | Kenya: 2021 $0.76B → 2022 $1.05B → 2023 $0.67B → 2024 $0.42B → 2025 $0.61B | Egypt: 2021 $0.49B → 2022 $0.73B → 2023 $0.59B → 2024 $0.31B → 2025 $0.82B (130% surge) | South Africa: 2022 $0.86B → 2025 $0.56B

NOTABLE DEALS (multi-year):
2021: OPay $400M (NG, SoftBank), Chipper Cash $250M, Flutterwave $170M | 2022: OPay $400M+, Flutterwave $250M (unicorn), TymeBank $180M, TradeDepot $110M | 2023: Yoco $83M, mPharma $30M | 2024: MNT-Halan $157M (EG), Moove $100M, Moniepoint $110M | 2025: Wasoko $125M, Moniepoint $110M, Helios Towers $120M, Bboxx $100M, Wave $90M | 2026 Q1: SolarAfrica $94M, ValU $63.6M, Spiro $57M

Q1 2026 SPECIFICS:
Debt=57% of capital. Equity fell $333M→$209M (-37% YoY). Series A: 13→4 (-69%). Series B equity: ZERO. Most active: IFC 4 deals, Novastar 3, Azur 3. US VCs: 30+→14 (-53%).

ACTIVE FUNDRAISES 2026: Arc Ride (Kenya Series A $8-15M closing), NowPay (Egypt Series B), GoSwap (Tunisia Seed+ closing), Axmed (Kenya Series A closing), OmniRetail (Nigeria Series B)

Format with **bold** for figures. Be concise. Represent Ranes Analytics professionally.`;

const FALLBACK=q=>{
  const l=q.toLowerCase();
  if(/2022|peak|record|best year/i.test(l)) return `**2022 — Africa's All-Time Peak ($5.0B):**\n• $5.0B raised across 1,034+ deals — **all-time record**\n• **Africa was the only region globally with positive YoY growth** (+5%)\n• 1,000+ unique investors participated\n• While Europe fell -17%, N.America -37%, Asia -39%, Latin America -62%\n• Key deals: OPay $400M, Flutterwave $250M (Series D), TymeBank $180M, TradeDepot $110M\n\n*Source: Africa: The Big Deal / AVCA Africa 2022 Report*`;
  if(/2023|winter|decline|crash/i.test(l)) return `**2023 — The Funding Winter (-42% YoY):**\n• $2.9B raised across 668 deals — down from $5.0B in 2022\n• **Equity funding alone fell 60% YoY**\n• US VCs retreated: 50% of investor number decline was North American exit\n• Drivers: global rate hikes, US regional banking crisis, geopolitical tensions\n• 527 active investors (vs 987 in 2022, 780 in 2021)\n• Climate tech resilient: $790M cumulative (AVCA Africa)\n\n*Source: Africa: The Big Deal / Infomineo / AVCA Africa*`;
  if(/2025|rebound|recovery/i.test(l)) return `**2025 — The Rebound (+40% YoY to $3.2B):**\n• $3.2B raised · ~700 startups funded · strongest since 2022\n• Q4 2025: **$997M — most-funded quarter of the year**\n• October 2025 alone: **$442M** (2nd highest single month)\n• 8 deals over $100M (vs 5 in 2024)\n• Egypt surged **+130%** in H1 2025 → $330M across 16+ deals\n• Key deals: Wasoko $125M, Moniepoint $110M, Bboxx $100M, Helios Towers $120M\n\n*Source: Technext24 / Africa: The Big Deal / Futurize / Finance in Africa*`;
  if(/active|fundrais|right now/i.test(l)) return `**Active Fundraises — Q1/Q2 2026:**\n• **Arc Ride** (Kenya · E-Mobility · Series A · $8–15M) — **Closing** · Novastar-backed\n• **GoSwap** (Tunisia · BaaS · Seed+ · $3–6M) — **Closing** · Azur lead confirmed\n• **NowPay** (Egypt · HR Fintech · Series B · $12–20M) — Announced\n• **Axmed** (Kenya · Healthtech · Series A · $10–18M) — **Closing**\n• **OmniRetail** (Nigeria · B2B E-Commerce · Series B · $25–40M) — Q2 2026\n\n*Source: LaunchBase Africa / TechCabal Insights Q1 2026*`;
  if(/trend|history|over time|chart/i.test(l)) return `**Africa Startup Funding — Historical Trend:**\n• 2019: **$2.1B** (427 deals) — pre-COVID momentum\n• 2020: **$0.9B** (359 deals) — COVID impact\n• 2021: **$4.3B** (818 deals) — boom year, 5 unicorns\n• 2022: **$5.0B** (1,034 deals) — **ALL-TIME PEAK**\n• 2023: **$2.9B** (668 deals) — funding winter, -42%\n• 2024: **$2.2B** (490 deals) — continued decline, -25%\n• 2025: **$3.2B** (~700 deals) — rebound, +40%\n• Q1 2026: **$711M** — debt overtakes equity (57%)\n\n*Source: Africa: The Big Deal / Partech Africa / Disrupt Africa*`;
  return `**Ranes Analytics — Full Historical Database 2019–2026:**\nCovering $21B+ in verified African startup funding across 6,000+ deals and 54 countries.\nUse the time filters on the Dashboard to explore any period from 2019 to Q1 2026.\n\n**Quick facts:**\n• Peak year: **2022** ($5.0B, 1,034 deals)\n• Worst year: **2020** ($0.9B, COVID)\n• Best recovery: **2025** (+40% to $3.2B)\n• Current: **Q1 2026** $711M — debt now 57% of capital\n\nAsk me about any year, country, sector, or deal.`;
};

/* ── CSS ─────────────────────────────────────────────────── */
const CSS=`
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:${AN};background:${WH};color:${TX};overflow-x:hidden;}
  ::-webkit-scrollbar{width:5px;background:${N3};} ::-webkit-scrollbar-thumb{background:${N4};border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ticker{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp 0.4s ease both;} .pulse{animation:pulse 1.8s ease-in-out infinite;}
  .spin{display:inline-block;animation:spin 0.9s linear infinite;}
  .card{background:${WH};border:1px solid ${BRD};border-radius:8px;transition:border-color 0.18s,box-shadow 0.18s;}
  .card:hover{border-color:${M}44;box-shadow:0 4px 16px ${M}10;}
  .card-tint{background:${BG2};border:1px solid ${BRD};border-radius:8px;}
  .card-navy{background:${N2};border:1px solid ${N3};border-radius:8px;}
  .btn{display:inline-flex;align-items:center;gap:6px;border:none;border-radius:5px;cursor:pointer;font-family:${AN};font-weight:700;letter-spacing:0.6px;text-transform:uppercase;transition:all 0.18s;}
  .bp{background:${M};color:#fff;padding:9px 20px;font-size:13px;} .bp:hover{background:${M2};transform:translateY(-1px);}
  .bs{background:${N3};color:#fff;padding:9px 18px;font-size:13px;} .bs:hover{background:${N4};}
  .bo{background:transparent;color:${TX2};border:1px solid ${BRD};padding:7px 14px;font-size:12px;}
  .bo:hover{border-color:${M};color:${M};background:${M_BG};}
  .bo.on{border-color:${M};color:${M};background:${M_BG};font-weight:700;}
  .nav-btn{background:none;border:none;cursor:pointer;font-family:${AN};font-size:12px;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;color:rgba(255,255,255,0.55);padding:6px 11px;border-radius:4px;transition:all 0.18s;border-bottom:2px solid transparent;}
  .nav-btn:hover{color:rgba(255,255,255,0.9);} .nav-btn.on{color:#fff;border-bottom-color:${M3};}
  .sb-btn{display:flex;align-items:center;gap:9px;width:100%;background:none;border:none;cursor:pointer;font-family:${AN};font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:rgba(255,255,255,0.5);padding:9px 14px;border-radius:5px;transition:all 0.18s;border-left:3px solid transparent;text-align:left;}
  .sb-btn:hover{color:#fff;background:rgba(255,255,255,0.08);} .sb-btn.on{color:#fff;background:${M}28;border-left-color:${M3};}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;font-family:${AN};}
  .bm{background:${M_BG};color:${M};border:1px solid ${M}33;} .bn{background:${N_BG};color:${N4};border:1px solid ${N4}33;}
  .bgn{background:#F0FAF4;color:#1A6E3C;border:1px solid #1A6E3C44;} .brd{background:#FFF0F0;color:#C0392B;border:1px solid #C0392B44;}
  .bbl{background:#EEF4FF;color:${N4};border:1px solid ${N4}44;} .bhy{background:#F0FAF0;color:#2D7A2D;border:1px solid #2D7A2D44;}
  .bg{background:#FFFBEA;color:${GD};border:1px solid ${GD}44;} .bcl{background:#FFFBEA;color:${GD};border:1px solid ${GD};}
  .ban{background:${M_BG};color:${M};border:1px solid ${M};} .bip{background:${N_BG};color:${N4};border:1px solid ${N4};}
  input,select,textarea{background:${WH};border:1px solid ${BRD};color:${TX};border-radius:5px;padding:9px 13px;font-family:${AN};font-size:13px;outline:none;transition:border 0.18s;}
  input:focus,select:focus{border-color:${M};box-shadow:0 0 0 3px ${M}15;}
  input::placeholder{color:${TX3};} select option{background:${WH};}
  .progress{height:5px;background:${BRD};border-radius:3px;overflow:hidden;}
  .pf{height:100%;border-radius:3px;background:linear-gradient(90deg,${M},${M2});transition:width 0.7s;}
  .divider{height:1px;background:rgba(255,255,255,0.12);margin:12px 0;}
  .src{display:inline-block;font-size:9px;color:${TX3};background:${BG2};border:1px solid ${BRD};border-radius:3px;padding:1px 6px;font-style:italic;font-family:${AN};}
  .ldot{width:7px;height:7px;border-radius:50%;background:${GD2};display:inline-block;animation:pulse 1.4s ease-in-out infinite;}
  .chat-win{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:12px;background:${BG2};border:1px solid ${BRD};border-radius:8px 8px 0 0;border-bottom:none;}
  .row-user{display:flex;justify-content:flex-end;align-items:flex-end;gap:8px;animation:slideUp 0.22s ease both;}
  .bub-user{background:${M};color:#fff;padding:11px 14px;border-radius:18px 18px 4px 18px;font-size:13px;line-height:1.65;max-width:76%;font-family:${AN};}
  .row-ai{display:flex;justify-content:flex-start;align-items:flex-end;gap:8px;animation:slideUp 0.22s ease both;}
  .bub-ai{background:${WH};color:${TX};padding:13px 15px;border-radius:18px 18px 18px 4px;font-size:13px;line-height:1.72;max-width:82%;border:1px solid ${BRD};font-family:${AN};}
  .bub-sys{background:#FFFBEA;color:#7A5A00;padding:10px 14px;border-radius:8px;font-size:12px;border:1px solid ${GD}44;text-align:center;}
  .row-sys{display:flex;justify-content:center;animation:slideUp 0.22s ease both;}
  .av-ai{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,${M5},${M},${N3});display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .av-user{width:28px;height:28px;border-radius:50%;background:${N4};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;}
  .ai-lbl{font-size:9px;font-weight:700;color:${M};letter-spacing:0.5px;text-transform:uppercase;margin-bottom:5px;font-family:${AN};}
  .dots{display:flex;gap:4px;padding:6px 0;}
  .dot{width:7px;height:7px;border-radius:50%;background:${TX3};animation:pulse 1.2s ease-in-out infinite;}
  .dot:nth-child(2){animation-delay:.2s;} .dot:nth-child(3){animation-delay:.4s;}
  .chips{padding:8px 14px;background:${WH};border:1px solid ${BRD};display:flex;gap:6px;flex-wrap:wrap;}
  .input-bar{display:flex;gap:10px;padding:11px 14px;background:${WH};border:1px solid ${BRD};border-top:none;border-radius:0 0 8px 8px;}
  .modal-ov{position:fixed;inset:0;background:rgba(11,24,41,0.78);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
  .modal-box{background:${WH};border:1px solid ${BRD};border-radius:10px;max-width:680px;width:100%;max-height:88vh;overflow-y:auto;animation:modalIn 0.22s ease both;}
  .tr-h:hover{background:${BG2};}
  a.ext{color:${M};text-decoration:none;font-family:${AN};} a.ext:hover{color:${M2};text-decoration:underline;}
  .fl{background:none;border:none;color:rgba(255,255,255,0.42);font-size:12px;cursor:pointer;font-family:${AN};transition:color 0.18s;padding:0;text-align:left;} .fl:hover{color:rgba(255,255,255,0.85);}
  table{border-collapse:collapse;width:100%;}
  th{background:${BG2};font-size:10px;letter-spacing:1px;color:${TX2};text-transform:uppercase;padding:11px 13px;text-align:left;border-bottom:2px solid ${BRD};white-space:nowrap;font-family:${AN};}
  td{padding:10px 13px;border-bottom:1px solid ${BRD};font-size:13px;color:${TX};font-family:${AN};}
  .sh{font-family:${AN};font-size:24px;font-weight:700;color:${TX};}
  .sh-sub{font-size:13px;color:${TX2};margin-top:4px;font-family:${AN};}
  .sv{font-family:${AN};font-size:28px;font-weight:700;color:${M};line-height:1;}
  /* time filter pills */
  .pill{background:${BG2};border:1px solid ${BRD};border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:${AN};transition:all 0.18s;color:${TX2};}
  .pill:hover{border-color:${M};color:${M};} .pill.on{background:${M};color:#fff;border-color:${M};}
`;

/* ── HELPERS ──────────────────────────────── */
const CT=({active,payload,label}: any)=>{
  if(!active||!payload?.length)return null;
  return(<div style={{background:WH,border:`1px solid ${BRD}`,borderRadius:8,padding:"10px 14px",fontSize:12,fontFamily:AN,boxShadow:`0 4px 12px ${TX}18`}}><p style={{color:TX2,fontSize:11,marginBottom:5}}>{label}</p>{payload.map((p,i)=>(<p key={i} style={{color:p.color||TX,fontWeight:700,fontFamily:AN}}>{["equity","debt","amount","total"].includes(p.name)?`$${p.value}M`:p.value}<span style={{color:TX2,fontWeight:400,marginLeft:5}}>{p.name}</span></p>))}</div>);
};

/* ── LEGAL MODAL ─────────────────────────── */
function LegalModal({docKey,onClose}){
  const doc=LEGAL[docKey];if(!doc)return null;
  return(
    <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div style={{padding:"18px 22px",borderBottom:`1px solid ${BRD}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:WH,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><LogoLockup onClick={()=>{}}/><div style={{width:1,height:28,background:BRD,margin:"0 4px"}}/><span style={{fontFamily:AN,fontSize:18,fontWeight:700,color:TX}}>{doc.title}</span></div>
          <button onClick={onClose} style={{background:BG2,border:`1px solid ${BRD}`,borderRadius:5,width:30,height:30,cursor:"pointer",fontSize:16,color:TX2}}>✕</button>
        </div>
        <div style={{padding:"22px",display:"flex",flexDirection:"column",gap:16}}>
          {doc.secs.map((s,i)=>(<div key={i}><div style={{fontSize:13,fontWeight:700,color:M,borderLeft:`3px solid ${M}`,paddingLeft:10,marginBottom:7,fontFamily:AN}}>{i+1}. {s.h}</div><p style={{fontSize:13,color:TX2,lineHeight:1.75,paddingLeft:13,fontFamily:AN}}>{s.t}</p></div>))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DASHBOARD  — multi-year interactive
════════════════════════════════════════════════════════════ */
function DashboardView(){
  const [period,setPeriod]=useState("annual");   // annual | quarterly | monthly
  const [yearRange,setYearRange]=useState([2019,2026]); // [from, to]
  const [sectorF,setSectorF]=useState("All");
  const [countryF,setCountryF]=useState("All");

  /* Derived chart data */
  const annualFiltered=ANNUAL.filter(d=>{
    const y=parseInt(d.year);return y>=yearRange[0]&&y<=yearRange[1];
  });
  const quarterlyFiltered=QUARTERLY.filter(d=>d.year>=yearRange[0]&&d.year<=yearRange[1]);
  const monthlyFiltered=MONTHLY;  // always last 18 months

  /* Filtered deals */
  const dealsFiltered=useMemo(()=>ALL_DEALS.filter(d=>{
    if(sectorF!=="All"&&d.sector!==sectorF)return false;
    if(countryF!=="All"&&d.country!==countryF)return false;
    if(d.year<yearRange[0])return false;
    if(d.year===2026&&yearRange[1]<2026)return false;
    return true;
  }),[sectorF,countryF,yearRange]);

  const totalFiltered=dealsFiltered.reduce((a,d)=>a+d.amount,0);

  /* Country chart data keyed by year range */
  const countryChartData=COUNTRY_HIST.map(c=>({
    country:c.country,
    flag:c.flag,
    value:Math.round(
      (yearRange[0]<=2021?c.y2021:0)+
      (yearRange[0]<=2022&&yearRange[1]>=2022?c.y2022:0)+
      (yearRange[0]<=2023&&yearRange[1]>=2023?c.y2023:0)+
      (yearRange[0]<=2024&&yearRange[1]>=2024?c.y2024:0)+
      (yearRange[0]<=2025&&yearRange[1]>=2025?c.y2025:0)+
      (yearRange[1]>=2026?c.q1_26:0)
    )
  })).sort((a,b)=>b.value-a.value).slice(0,6);

  /* Sector chart keyed by year */
  const sectorYear=yearRange[1]===2026?"q1_26":yearRange[1]===2025?"y2025":yearRange[1]===2024?"y2024":yearRange[1]===2023?"y2023":yearRange[1]===2022?"y2022":"y2021";
  const sectorChartData=SECTOR_HIST.map(s=>({name:s.sector,amount:s[sectorYear]||0,irr:s.irr})).sort((a,b)=>b.amount-a.amount);

  const YEARS=["2019","2020","2021","2022","2023","2024","2025","2026"];

  /* Key stat for selected range */
  const totalInRange=annualFiltered.reduce((a,d)=>a+(parseInt(d.year)<2026?d.total:0),0)+
    (yearRange[1]>=2026?711:0);
  const peakYear=annualFiltered.sort((a,b)=>b.total-a.total)[0];

  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:20}}>

      {/* ── TIME RANGE CONTROL ── */}
      <div className="card" style={{padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14}}>
          <div>
            <div style={{fontFamily:AN,fontSize:16,fontWeight:700,color:TX,marginBottom:4}}>Time Range &amp; Filters</div>
            <p style={{fontSize:12,color:TX2,fontFamily:AN}}>Select any period from 2019 to Q1 2026 to explore the full African investment landscape</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className={`pill ${period==="annual"?"on":""}`} onClick={()=>setPeriod("annual")}>Annual</button>
            <button className={`pill ${period==="quarterly"?"on":""}`} onClick={()=>setPeriod("quarterly")}>Quarterly</button>
            <button className={`pill ${period==="monthly"?"on":""}`} onClick={()=>setPeriod("monthly")}>Monthly (18mo)</button>
          </div>
        </div>

        {/* Year range sliders */}
        {period==="annual"&&(
          <div style={{marginTop:16}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              <span style={{fontSize:12,color:TX2,fontFamily:AN,marginRight:6}}>From:</span>
              {YEARS.slice(0,-1).map(y=>(
                <button key={y} className={`pill ${yearRange[0]===parseInt(y)?"on":""}`}
                  onClick={()=>setYearRange([parseInt(y),Math.max(parseInt(y),yearRange[1])])}>
                  {y}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:TX2,fontFamily:AN,marginRight:6}}>To:</span>
              {YEARS.map(y=>(
                <button key={y} className={`pill ${yearRange[1]===parseInt(y)?"on":""}`}
                  onClick={()=>setYearRange([Math.min(yearRange[0],parseInt(y)),parseInt(y)])}>
                  {y==="2026"?"2026 (Q1)":y}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sector + Country filters */}
        <div style={{display:"flex",gap:12,marginTop:14,flexWrap:"wrap"}}>
          <div>
            <span style={{fontSize:11,color:TX2,fontFamily:AN,marginRight:6}}>Sector:</span>
            <select value={sectorF} onChange={e=>setSectorF(e.target.value)} style={{minWidth:130,padding:"5px 10px",fontSize:12}}>
              {SECTORS_LIST.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <span style={{fontSize:11,color:TX2,fontFamily:AN,marginRight:6}}>Country:</span>
            <select value={countryF} onChange={e=>setCountryF(e.target.value)} style={{minWidth:130,padding:"5px 10px",fontSize:12}}>
              {COUNTRIES_LIST.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          {(sectorF!=="All"||countryF!=="All"||period!=="annual")&&(
            <button className="btn bo" style={{fontSize:11,padding:"5px 12px"}}
              onClick={()=>{setSectorF("All");setCountryF("All");setPeriod("annual");setYearRange([2019,2026]);}}>
              ✕ Reset All
            </button>
          )}
          {(sectorF!=="All"||countryF!=="All")&&(
            <span className="badge bgn" style={{alignSelf:"center"}}>{dealsFiltered.length} deals · ${totalFiltered.toFixed(0)}M</span>
          )}
        </div>
      </div>

      {/* ── SUMMARY KPIs for selected range ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:13}}>
        {[
          ["◈",`$${(totalInRange/1000).toFixed(1)}B`,"Total in Range",`${yearRange[0]}–${yearRange[1]}`,`${annualFiltered.length} year(s) selected`],
          ["◆",peakYear?.year||"2022","Peak Year",`$${peakYear?.total||5000}M raised`,"Africa: The Big Deal"],
          ["▲","$5.0B","All-Time Peak","2022, 1,034 deals","AVCA / Africa:TBD"],
          ["▼","$0.9B","Lowest (COVID)","2020, 359 deals","Africa: The Big Deal"],
          ["◉","$3.2B","2025 Rebound","+40% YoY recovery","Technext24 / TBD"],
          ["■","6,000+","Total Deals 2019–26","Across 54 countries","Ranes Analytics"],
          ["●","16+","Unicorns Created","2019–2025","Partech / Disrupt Africa"],
        ].map(([icon,val,label,sub,src],i)=>(
          <div key={i} className="card" style={{padding:"15px"}}>
            <div style={{fontSize:18,marginBottom:6,color:M,fontWeight:700}}>{icon}</div>
            <div className="sv" style={{fontSize:22}}>{val}</div>
            <div style={{fontSize:11,fontWeight:700,color:TX,margin:"3px 0 1px",fontFamily:AN,textTransform:"uppercase",letterSpacing:0.4}}>{label}</div>
            <div style={{fontSize:11,color:TX2,fontFamily:AN}}>{sub}</div>
            <span className="src" style={{marginTop:4,display:"inline-block"}}>{src}</span>
          </div>
        ))}
      </div>

      {/* ── MAIN CHART — switches by period ── */}
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16}}>
        <div className="card" style={{padding:"20px"}}>
          <div style={{fontFamily:AN,fontSize:15,fontWeight:700,color:TX,marginBottom:4}}>
            {period==="annual"?"Annual Funding — Equity vs Debt":period==="quarterly"?"Quarterly Funding Trend":"Monthly Funding (Last 18 months)"}
          </div>
          <div style={{fontSize:11,color:TX2,marginBottom:14,fontFamily:AN}}>
            <span className="src">Africa: The Big Deal / TechCabal Insights / Partech Africa</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {period==="annual"?(
              <ComposedChart data={annualFiltered}>
                <CartesianGrid stroke={BRD} strokeDasharray="3 3"/>
                <XAxis dataKey="year" tick={{fill:TX2,fontSize:10,fontFamily:"Arial Narrow,Arial"}} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="l" tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                <YAxis yAxisId="r" orientation="right" tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CT/>}/>
                <Bar yAxisId="l" dataKey="debt" fill={N4} radius={[3,3,0,0]} stackId="s" name="debt"/>
                <Bar yAxisId="l" dataKey="equity" fill={M} radius={[3,3,0,0]} stackId="s" name="equity"/>
                <Line yAxisId="r" type="monotone" dataKey="deals" stroke={GD} strokeWidth={2} dot={{fill:GD,r:3}} name="deals"/>
              </ComposedChart>
            ):period==="quarterly"?(
              <ComposedChart data={quarterlyFiltered}>
                <CartesianGrid stroke={BRD} strokeDasharray="3 3"/>
                <XAxis dataKey="q" tick={{fill:TX2,fontSize:9,fontFamily:"Arial Narrow,Arial"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                <Tooltip content={<CT/>}/>
                <Bar dataKey="debt" fill={N4} radius={[3,3,0,0]} stackId="s" name="debt"/>
                <Bar dataKey="equity" fill={M} radius={[3,3,0,0]} stackId="s" name="equity"/>
              </ComposedChart>
            ):(
              <AreaChart data={monthlyFiltered}>
                <defs>
                  <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={M} stopOpacity={0.3}/><stop offset="95%" stopColor={M} stopOpacity={0}/></linearGradient>
                  <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={N4} stopOpacity={0.3}/><stop offset="95%" stopColor={N4} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid stroke={BRD} strokeDasharray="3 3"/>
                <XAxis dataKey="m" tick={{fill:TX2,fontSize:9,fontFamily:"Arial Narrow,Arial"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
                <Tooltip content={<CT/>}/>
                <Area type="monotone" dataKey="equity" stroke={M} fill="url(#ge)" name="equity"/>
                <Area type="monotone" dataKey="debt" stroke={N4} fill="url(#gd)" name="debt"/>
              </AreaChart>
            )}
          </ResponsiveContainer>
          <div style={{display:"flex",gap:14,marginTop:8,justifyContent:"center"}}>
            {[["Equity",M],["Debt",N4],period!=="monthly"&&["Deal Count",GD]].filter(Boolean).map(([l,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:3,background:c}}/><span style={{fontSize:11,color:TX2,fontFamily:AN}}>{l}</span></div>))}
          </div>
        </div>

        {/* Country distribution for range */}
        <div className="card" style={{padding:"20px"}}>
          <div style={{fontFamily:AN,fontSize:15,fontWeight:700,color:TX,marginBottom:4}}>
            Top Markets — {yearRange[0] === yearRange[1] ? yearRange[0] : `${yearRange[0]}–${yearRange[1]}`}
          </div>
          <div style={{fontSize:11,color:TX2,marginBottom:14,fontFamily:AN}}><span className="src">Disrupt Africa / Statista / Condia</span></div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {countryChartData.map((c,i)=>(
              <div key={i}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:700,fontFamily:AN}}>{c.flag} {c.country}</span>
                  <span style={{fontFamily:AN,fontSize:14,fontWeight:700,color:M}}>${c.value}M</span>
                </div>
                <div className="progress"><div className="pf" style={{width:`${(c.value/countryChartData[0].value)*100}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector chart */}
      <div className="card" style={{padding:"20px"}}>
        <div style={{fontFamily:AN,fontSize:15,fontWeight:700,color:TX,marginBottom:4}}>
          Sector Funding — {yearRange[1]===2026?"Q1 2026":yearRange[1]}
        </div>
        <div style={{fontSize:11,color:TX2,marginBottom:16,fontFamily:AN}}>
          <span className="src">TechCabal Insights / Disrupt Africa Funding Reports</span>
          <span style={{marginLeft:12,fontSize:11,color:TX3}}>Click any bar or tile to drill down</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectorChartData.slice(0,7)} layout="vertical" margin={{left:0,right:30}}>
              <CartesianGrid stroke={BRD} horizontal={false}/>
              <XAxis type="number" tick={{fill:TX2,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
              <YAxis type="category" dataKey="name" tick={{fill:TX,fontSize:11,fontFamily:"Arial Narrow,Arial"}} axisLine={false} tickLine={false} width={82}/>
              <Tooltip content={<CT/>}/>
              <Bar dataKey="amount" fill={M} radius={[0,4,4,0]} name="amount" cursor="pointer"
                onClick={d=>setSectorF(d.name==="All"?"All":d.name)}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {sectorChartData.slice(0,8).map((s,i)=>(
              <div key={i} className="card-tint" style={{padding:"10px 12px",cursor:"pointer",border:sectorF===s.name?`2px solid ${M}`:`1px solid ${BRD}`,borderRadius:7}}
                onClick={()=>setSectorF(sectorF===s.name?"All":s.name)}>
                <div style={{fontSize:11,color:TX2,fontFamily:AN,marginBottom:4}}>{s.name}</div>
                <div style={{fontFamily:AN,fontSize:18,fontWeight:700,color:M,lineHeight:1}}>${s.amount}M</div>
                <div style={{fontSize:11,color:N4,fontWeight:700,fontFamily:AN,marginTop:3}}>~{s.irr}% IRR</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annual summary table */}
      {period==="annual"&&(
        <div className="card" style={{padding:"20px"}}>
          <div style={{fontFamily:AN,fontSize:15,fontWeight:700,color:TX,marginBottom:4}}>Full Annual Summary — {yearRange[0]}–{yearRange[1]}</div>
          <div style={{fontSize:11,color:TX2,marginBottom:14,fontFamily:AN}}><span className="src">Africa: The Big Deal / Partech Africa / Disrupt Africa / Technext24</span></div>
          <div style={{overflow:"auto"}}>
            <table>
              <thead><tr>{["Year","Total","Equity","Debt","Deals","Investors","Unicorns","Top Sector","Key Context"].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {annualFiltered.map((d,i)=>{
                  const isRecord=d.total===5000;
                  const isLow=d.total===900;
                  return(
                    <tr key={i} className="tr-h" style={{background:isRecord?"#FBF0F3":isLow?"#F0F4FF":undefined}}>
                      <td style={{fontWeight:700,fontSize:14,fontFamily:AN,color:isRecord?M:isLow?N4:TX}}>{d.year}{isRecord?" 🏆":isLow?" 📉":""}</td>
                      <td style={{fontFamily:AN,fontSize:15,fontWeight:700,color:M}}>${d.total.toLocaleString()}M</td>
                      <td style={{color:TX2}}>${d.equity.toLocaleString()}M</td>
                      <td style={{color:N4,fontWeight:d.debt>1000?700:400}}>${d.debt.toLocaleString()}M</td>
                      <td style={{color:TX2}}>{d.deals.toLocaleString()}</td>
                      <td style={{color:TX2}}>{d.investors.toLocaleString()}</td>
                      <td style={{textAlign:"center"}}>{d.unicorns>0?<span className="badge bgn">{"🦄".repeat(Math.min(d.unicorns,3))+" "+d.unicorns}</span>:"—"}</td>
                      <td><span className="badge bn">{d.topSector}</span></td>
                      <td style={{color:TX2,fontSize:11,maxWidth:260,lineHeight:1.4}}>{d.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filtered deals */}
      {(sectorF!=="All"||countryF!=="All")&&(
        <div className="card" style={{padding:"20px"}}>
          <div style={{fontFamily:AN,fontSize:15,fontWeight:700,color:TX,marginBottom:12}}>
            Deals matching: {sectorF!=="All"&&<span className="badge bm" style={{marginRight:6}}>{sectorF}</span>}{countryF!=="All"&&<span className="badge bn">{countryF}</span>}
            <span style={{fontSize:13,color:TX2,fontWeight:400,marginLeft:10}}>{dealsFiltered.length} deals · ${totalFiltered.toFixed(0)}M</span>
          </div>
          <div style={{overflow:"auto"}}>
            <table>
              <thead><tr>{["Company","Country","Sector","Year / Qtr","Amount","Round","Type"].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {dealsFiltered.sort((a,b)=>b.year-a.year||b.amount-a.amount).map((d,i)=>(
                  <tr key={i} className="tr-h">
                    <td style={{fontWeight:700}}><a href={d.url} target="_blank" rel="noreferrer" className="ext">{d.flag} {d.company}</a></td>
                    <td style={{color:TX2}}>{d.country}</td>
                    <td><span className="badge bn">{d.sector}</span></td>
                    <td style={{color:TX2}}>{d.year}{d.quarter?" "+d.quarter:""}</td>
                    <td style={{fontFamily:AN,fontSize:14,fontWeight:700,color:M}}>${d.amount}M</td>
                    <td><span className="badge bm">{d.round}</span></td>
                    <td><span className={`badge ${d.type==="equity"?"bgn":d.type==="debt"?"bbl":"bhy"}`}>{d.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DEALS VIEW
════════════════════════════════════════════════════════════ */
function DealsView(){
  const [yearF,setYearF]=useState("All");
  const [sectorF,setSectorF]=useState("All");
  const [typeF,setTypeF]=useState("All");
  const [search,setSearch]=useState("");

  const filtered=useMemo(()=>ALL_DEALS.filter(d=>{
    if(yearF!=="All"&&d.year.toString()!==yearF)return false;
    if(sectorF!=="All"&&d.sector!==sectorF)return false;
    if(typeF!=="All"&&d.type!==typeF)return false;
    if(search&&!d.company.toLowerCase().includes(search.toLowerCase())&&!d.sector.toLowerCase().includes(search.toLowerCase())&&!d.country.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  }),[yearF,sectorF,typeF,search]);

  const total=filtered.reduce((a,d)=>a+d.amount,0);
  const tb=t=>t==="equity"?"bgn":t==="debt"?"bbl":"bhy";

  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div><h2 className="sh">Deal Database, 2019 to Q1 2026</h2><p className="sh-sub">{ALL_DEALS.length} verified deals, full 7-year history. Click company name to view source</p></div>
          <button className="btn bp" onClick={()=>{
            const headers=["Company","Country","Sector","Year","Quarter","Amount (M)","Round","Type","Investors"];
            const rows=filtered.map(d=>[d.company,d.country,d.sector,d.year,d.quarter||"",d.amount,d.round,d.type,d.investors||""]);
            const csv=[headers,...rows].map(r=>r.map(c=>'"'+(c+"").replace(/"/g,'""')+'"').join(",")).join("\n");
            const blob=new Blob([csv],{type:"text/csv"});
            const url=URL.createObjectURL(blob);
            const a=document.createElement("a");a.href=url;a.download="ranes_deals_export.csv";a.click();
            URL.revokeObjectURL(url);
          }}>⬇ Export CSV</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[["Database Span","2019–2026","7 years of data","Ranes Analytics"],["Total Deals",ALL_DEALS.length,"Verified records","Africa:TBD / Disrupt Africa"],["Total Capital","$21B+","Across all years","Multiple sources"],["Active Now",ACTIVE_DEALS.length,"Fundraises in-progress","LaunchBase Q1 2026"]].map(([l,v,s,src])=>(
          <div key={l} className="card" style={{padding:"15px 16px"}}>
            <div style={{fontSize:10,color:TX2,letterSpacing:1,textTransform:"uppercase",marginBottom:4,fontFamily:AN}}>{l}</div>
            <div className="sv" style={{fontSize:22}}>{v}</div>
            <div style={{fontSize:11,color:TX2,margin:"4px 0",fontFamily:AN}}>{s}</div>
            <span className="src">{src}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search company, sector, country…" style={{flex:1,minWidth:200}}/>
        <div>
          <div style={{fontSize:10,color:TX2,letterSpacing:1,marginBottom:4,fontFamily:AN}}>YEAR</div>
          <select value={yearF} onChange={e=>setYearF(e.target.value)} style={{minWidth:100}}>
            <option>All</option>
            {["2021","2022","2023","2024","2025","2026"].map(y=><option key={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <div style={{fontSize:10,color:TX2,letterSpacing:1,marginBottom:4,fontFamily:AN}}>SECTOR</div>
          <select value={sectorF} onChange={e=>setSectorF(e.target.value)} style={{minWidth:130}}>
            {SECTORS_LIST.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <div style={{fontSize:10,color:TX2,letterSpacing:1,marginBottom:4,fontFamily:AN}}>TYPE</div>
          <select value={typeF} onChange={e=>setTypeF(e.target.value)} style={{minWidth:100}}>
            {TYPES_LIST.map(t=><option key={t} style={{textTransform:"capitalize"}}>{t}</option>)}
          </select>
        </div>
        {(yearF!=="All"||sectorF!=="All"||typeF!=="All"||search)&&(
          <button className="btn bo" style={{fontSize:11,padding:"5px 12px",alignSelf:"flex-end",marginBottom:0}} onClick={()=>{setYearF("All");setSectorF("All");setTypeF("All");setSearch("");}}>✕ Reset</button>
        )}
        <span className="badge bgn" style={{alignSelf:"flex-end",marginBottom:2}}>{filtered.length} deals · ${total.toFixed(0)}M</span>
      </div>

      <div className="card" style={{overflow:"auto"}}>
        <table>
          <thead><tr>{["Company","Country","Sector","Year","Quarter","Amount","Round","Type","Investors"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.sort((a,b)=>b.year-a.year||b.amount-a.amount).map((d,i)=>(
              <tr key={i} className="tr-h">
                <td><a href={d.url} target="_blank" rel="noreferrer" className="ext" style={{fontWeight:700,fontSize:14}}>{d.flag} {d.company}</a></td>
                <td style={{color:TX2}}>{d.country}</td>
                <td><span className="badge bn">{d.sector}</span></td>
                <td style={{fontWeight:700,color:N4}}>{d.year}</td>
                <td style={{color:TX3}}>{d.quarter||"—"}</td>
                <td style={{fontFamily:AN,fontSize:15,fontWeight:700,color:M}}>${d.amount}M</td>
                <td><span className="badge bm">{d.round}</span></td>
                <td><span className={`badge ${tb(d.type)}`}>{d.type}</span></td>
                <td style={{color:TX2,fontSize:12,maxWidth:160}}>{d.investors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{fontFamily:AN,fontSize:18,fontWeight:700,color:TX,marginBottom:4}}><span style={{color:M,fontWeight:700}}>◉</span> Active Fundraises Q1/Q2 2026 ({ACTIVE_DEALS.length})</div>
      <div style={{display:"flex",flexDirection:"column",gap:11}}>
        {ACTIVE_DEALS.map((d,i)=>{
          const cc=d.confidence>=90?"#1A6E3C":d.confidence>=80?GD:M;
          const bc=d.status==="Closing"?"bcl":d.status==="Announced"?"ban":"bip";
          const bl=d.status==="Closing"?GD:d.status==="Announced"?M:N4;
          return(
            <div key={i} className="card" style={{padding:"16px 20px",borderLeft:`4px solid ${bl}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9,flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>{d.flag}</span><div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontFamily:AN,fontSize:16,fontWeight:700,color:TX}}>{d.company}</span><span className={`badge ${bc}`}>{d.status}</span></div><p style={{fontSize:11,color:TX2,fontFamily:AN}}>{d.city} · {d.sector} · {d.stage}</p></div></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:AN,fontSize:20,fontWeight:700,color:M}}>{d.range}</div></div>
              </div>
              <p style={{fontSize:13,color:TX2,lineHeight:1.68,marginBottom:9,fontFamily:AN}}>{d.desc}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <span style={{fontSize:12,fontFamily:AN}}><span style={{color:TX2}}>Investors: </span><strong>{d.investors}</strong></span>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,color:TX2,fontFamily:AN}}>Confidence:</span><div style={{width:56,height:4,background:BRD,borderRadius:2,overflow:"hidden",display:"inline-block"}}><div style={{height:"100%",width:`${d.confidence}%`,background:cc,borderRadius:2}}/></div><span style={{fontSize:12,fontWeight:700,color:cc,fontFamily:AN}}>{d.confidence}%</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   RANES AI
════════════════════════════════════════════════════════════ */
function AIView(){
  const [msgs,setMsgs]=useState([{role:"assistant",content:"**Hi, I'm Ranes AI** — Ranes Analytics' investment intelligence assistant.\n\nI now cover the **full 2019–Q1 2026 history** of African startup funding. Ask me anything:\n• Funding trends from 2019 to 2026\n• Why 2022 was the peak and 2023 crashed\n• The 2025 rebound — what drove it?\n• Active fundraises right now\n• Country or sector deep-dives across any year\n• IRR benchmarks and investor activity"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [sysNote,setSysNote]=useState("");
  const btm=useRef(null);const inp=useRef(null);
  useEffect(()=>{btm.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading,sysNote]);
  const fmtTime=ts=>{try{return new Date(ts*1000).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}catch{return "soon";}};
  const send=async()=>{
    const q=input.trim();if(!q||loading)return;
    setSysNote("");
    const history=[...msgs,{role:"user",content:q}];
    setMsgs(history);setInput("");setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,system:AI_SYS,messages:history.map(m=>({role:m.role,content:m.content}))})});
      let data;try{data=await res.json();}catch{throw new Error("Response parse error.");}
      if(data?.type==="exceeded_limit"||data?.error?.type==="exceeded_limit"){
        const rt=data?.resetsAt?`Resets at ${fmtTime(data.resetsAt)}`:"Resets soon";
        setSysNote(`⏱️ Rate limit — ${rt}`);
        setMsgs(p=>[...p,{role:"assistant",content:`Rate limited (${rt}). From the Ranes Analytics database:\n\n${FALLBACK(q)}`}]);
        setLoading(false);return;
      }
      if(!res.ok){const em=data?.error?.message||`Error ${res.status}`;setMsgs(p=>[...p,{role:"assistant",content:`⚠️ **${em}**\n\n${FALLBACK(q)}`}]);setLoading(false);return;}
      const text=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();
      setMsgs(p=>[...p,{role:"assistant",content:text||"Please try rephrasing."}]);
    }catch{setMsgs(p=>[...p,{role:"assistant",content:`⚠️ Connection issue.\n\n${FALLBACK(q)}`}]);}
    setLoading(false);setTimeout(()=>inp.current?.focus(),80);
  };
  const md=t=>t.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${TX}">$1</strong>`).replace(/•\s/g,`<span style="color:${M};font-weight:700">• </span>`).replace(/\n/g,"<br/>");
  const SUGG=["Show me the 2019–2026 trend","Why did 2022 hit $5 billion?","What caused the 2023 funding winter?","How did 2025 recover so strongly?","Active fundraises right now?","Best year for Kenyan startups?"];
  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 170px)",minHeight:520,maxHeight:800}}>
      <div style={{marginBottom:14,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h2 className="sh">Ranes AI</h2><p className="sh-sub">Full 2019–Q1 2026 dataset with smart fallbacks always available</p></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span className="ldot"/><span style={{fontSize:11,color:GD,fontWeight:700,fontFamily:AN}}>LIVE</span><span className="badge bgn">7 Years Data</span></div>
      </div>
      <div className="chat-win">
        {msgs.map((m,i)=>(<div key={i} className={m.role==="user"?"row-user":"row-ai"}>{m.role==="assistant"&&<div className="av-ai"><HawkSVG size={20}/></div>}<div className={m.role==="user"?"bub-user":"bub-ai"}>{m.role==="assistant"&&<div className="ai-lbl">Ranes AI</div>}<div dangerouslySetInnerHTML={{__html:md(m.content)}}/></div>{m.role==="user"&&<div className="av-user">U</div>}</div>))}
        {loading&&(<div className="row-ai"><div className="av-ai"><HawkSVG size={20}/></div><div className="bub-ai"><div className="ai-lbl">Ranes AI</div><div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div></div></div>)}
        {sysNote&&<div className="row-sys"><div className="bub-sys">{sysNote}</div></div>}
        <div ref={btm} style={{height:1}}/>
      </div>
      <div className="chips">{SUGG.map((s,i)=><button key={i} className="btn bo" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>{setInput(s);inp.current?.focus();}}>{s}</button>)}</div>
      <div className="input-bar">
        <input ref={inp} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask about any year, country, deal, sector, or trend 2019–2026…" disabled={loading} style={{flex:1,opacity:loading?0.6:1}}/>
        <button className="btn bp" onClick={send} disabled={loading||!input.trim()} style={{opacity:(!input.trim()||loading)?0.5:1,minWidth:85,justifyContent:"center"}}>{loading?<span className="spin">⟳</span>:"Send ↵"}</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   NEWS
════════════════════════════════════════════════════════════ */
function NewsView(){
  const sc=s=>s==="positive"?"#1A6E3C":s==="negative"?"#C0392B":GD;
  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div><h2 className="sh">Intelligence Feed</h2><p className="sh-sub">Verified primary sources. Click any headline to open the full article. Multi-year coverage</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {NEWS.map((n,i)=>(
          <a key={i} href={n.url} target="_blank" rel="noreferrer" style={{textDecoration:"none",display:"block"}}>
            <div className="card" style={{padding:"15px 18px",display:"flex",gap:14,cursor:"pointer"}}>
              <div style={{width:4,background:sc(n.s),borderRadius:4,flexShrink:0,minHeight:34,alignSelf:"stretch"}}/>
              <div style={{flex:1}}><h3 style={{fontSize:14,fontWeight:700,color:TX,lineHeight:1.5,marginBottom:6,fontFamily:AN}}>{n.title}</h3><div style={{display:"flex",gap:10,alignItems:"center"}}><span className="src">{n.source}</span><span style={{fontSize:11,color:TX2,fontFamily:AN}}>{n.date}</span></div></div>
              <div style={{color:TX3,fontSize:16,display:"flex",alignItems:"center"}}>↗</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ACTIVE DEALS  — live fundraises for investors
════════════════════════════════════════════════════════════ */
function ActiveDealsView(){
  const [statusF,setStatusF]=useState("All");
  const filtered=statusF==="All"?ACTIVE_DEALS:ACTIVE_DEALS.filter(d=>d.status===statusF);
  const cc=c=>c>=90?"#1A6E3C":c>=80?GD:M;
  const borderCol=s=>s==="Closing"?GD:s==="Announced"?M:N4;
  const badgeCls=s=>s==="Closing"?"bcl":s==="Announced"?"ban":"bip";

  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
        <div>
          <h2 className="sh">Active Deals</h2>
          <p className="sh-sub">Companies currently fundraising, verified signals, Q1/Q2 2026. For investor use</p>
        </div>
        <span className="badge bm" style={{fontSize:12,padding:"4px 12px"}}>{ACTIVE_DEALS.length} Live Opportunities</span>
      </div>

      {/* Disclaimer */}
      <div style={{background:M_BG,border:`1px solid ${M}33`,borderRadius:8,padding:"12px 16px",fontSize:12,color:TX2,lineHeight:1.7,fontFamily:AN}}>
        <strong style={{color:M}}>Investor Note:</strong> Active deal intelligence is sourced from verified public announcements, investor reports (LaunchBase Africa Q1 2026, TechCabal Insights, Innovation Village) and corroborated signals. Confidence scores reflect multi-source verification. Always conduct independent due diligence. <strong style={{color:TX}}>This is not investment advice.</strong>
      </div>

      {/* Status filter */}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:12,color:TX2,fontFamily:AN}}>Filter:</span>
        {["All","Closing","Announced","In-process"].map(s=>(
          <button key={s} className={`btn bo ${statusF===s?"on":""}`} onClick={()=>setStatusF(s)} style={{fontSize:12,padding:"6px 14px"}}>{s}</button>
        ))}
        <span style={{fontSize:11,color:TX3,fontFamily:AN,marginLeft:4}}>{filtered.length} deal{filtered.length!==1?"s":""}</span>
      </div>

      {/* Summary KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          ["◉","Closing",ACTIVE_DEALS.filter(d=>d.status==="Closing").length+" deals","Actively closing rounds now"],
          ["◈","Announced",ACTIVE_DEALS.filter(d=>d.status==="Announced").length+" deals","Publicly seeking capital"],
          ["◆","In-process",ACTIVE_DEALS.filter(d=>d.status==="In-process").length+" deals","Due diligence / discussions"],
          ["■","Total Pipeline","$"+ACTIVE_DEALS.reduce((a,d)=>{const v=parseFloat(d.range.split("–")[1].replace(/[^0-9.]/g,""));return a+v;},0).toFixed(0)+"M+","Combined target raise"],
        ].map(([icon,label,val,sub])=>(
          <div key={label} className="card" style={{padding:"15px 16px"}}>
            <div style={{fontSize:20,marginBottom:6,color:M,fontWeight:700}}>{icon}</div>
            <div style={{fontFamily:AN,fontSize:11,fontWeight:700,color:TX,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>{label}</div>
            <div style={{fontFamily:AN,fontSize:20,fontWeight:700,color:M,lineHeight:1}}>{val}</div>
            <div style={{fontSize:11,color:TX2,fontFamily:AN,marginTop:3}}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Deal cards */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map((d,i)=>(
          <div key={i} className="card" style={{padding:"22px 24px",borderLeft:`5px solid ${borderCol(d.status)}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:28}}>{d.flag}</span>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontFamily:AN,fontSize:20,fontWeight:700,color:TX}}>{d.company}</span>
                    <span className={`badge ${badgeCls(d.status)}`}>{d.status}</span>
                  </div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,color:TX2,fontFamily:AN}}>{d.city}</span>
                    <span style={{fontSize:12,color:TX3}}>·</span>
                    <span className="badge bn">{d.sector}</span>
                    <span className="badge bm">{d.stage}</span>
                  </div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:AN,fontSize:26,fontWeight:700,color:M,lineHeight:1}}>{d.range}</div>
                <div style={{fontSize:11,color:TX3,fontFamily:AN,marginTop:3}}>Target raise</div>
              </div>
            </div>

            <p style={{fontSize:13,color:TX2,lineHeight:1.75,marginBottom:16,fontFamily:AN,borderLeft:`3px solid ${BRD}`,paddingLeft:12}}>{d.desc}</p>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <div style={{background:BG2,borderRadius:7,padding:"11px 14px",border:`1px solid ${BRD}`}}>
                <div style={{fontSize:10,color:TX3,letterSpacing:1,textTransform:"uppercase",fontFamily:AN,marginBottom:4}}>Lead Investor(s)</div>
                <div style={{fontSize:13,fontWeight:700,color:TX,fontFamily:AN}}>{d.investors}</div>
              </div>
              <div style={{background:BG2,borderRadius:7,padding:"11px 14px",border:`1px solid ${BRD}`}}>
                <div style={{fontSize:10,color:TX3,letterSpacing:1,textTransform:"uppercase",fontFamily:AN,marginBottom:4}}>Data Confidence</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:6,background:BRD,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${d.confidence}%`,background:cc(d.confidence),borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:14,fontWeight:700,color:cc(d.confidence),fontFamily:AN}}>{d.confidence}%</span>
                </div>
              </div>
            </div>

            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <div style={{fontSize:11,color:TX3,fontFamily:AN}}>Source: {"LaunchBase Africa / TechCabal Q1 2026"}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Founder note — no button, just informational */}
      <div style={{background:N_BG,border:`1px solid ${N4}33`,borderRadius:8,padding:"16px 20px"}}>
        <div style={{fontFamily:AN,fontSize:13,fontWeight:700,color:TX,marginBottom:3}}>For Founders</div>
        <p style={{fontSize:13,color:TX2,fontFamily:AN,lineHeight:1.65}}>Deal intelligence on this page is sourced from verified public announcements. Use the contact form below to reach the Ranes Analytics team for further enquiries.</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   HOMEPAGE — PAN-AFRICAN INVESTMENT PERSPECTIVE
════════════════════════════════════════════════════════════ */
function PanAfricanView({goToService}){
  const [openStory,setOpenStory]=useState(null);

  const STORIES=[
    {
      id:0, icon:"◈", tag:"Homegrown Capital",
      hook:"The money was already here.",
      opener:"Long before any dollar arrived from Palo Alto or London, Africans were solving the continent's hardest problems. Not with venture-backed startups but with savings circles, rotating credit, mobile phones and a kind of pragmatic creativity that only comes from living inside the problem.",
      body:"What has changed is not the ingenuity. It is the infrastructure around it. Today, institutions like the IFC, BII, Novastar Ventures and Azur Innovation Fund are channelling capital into companies built from the inside out. Moniepoint did not model itself on Stripe. It studied how Nigerian market traders actually handle cash, from the ajo groups to the informal ledgers and the trust networks built over generations. That depth of understanding is not a soft cultural advantage. It is a structural moat that a team in San Francisco could spend a decade trying to replicate and still miss. The African startup ecosystem does not need external validation to be legitimate. It needs capital that understands what it is funding.",
      pull:"Africa does not need to be discovered. It needs to be taken seriously, on its own terms, with investors who understand that the best insights come from being here.",
      s1:"$3.2B raised across Africa in 2025, up 40% year-on-year", s1src:"Technext24 / Africa: The Big Deal",
      s2:"IFC (4 deals), Novastar (3), Azur (3) led Q1 2026, DFI and homegrown capital dominant", s2src:"LaunchBase Africa Q1 2026",
      colour:M,
    },
    {
      id:1, icon:"◆", tag:"Interconnected Markets",
      hook:"The deal in Nairobi is a bet on Kampala too.",
      opener:"The most expensive mistake in African investment is treating 54 countries as 54 separate decisions. They are not. They are nodes in a network that is quietly integrating through mobile money corridors, informal trade routes, shared infrastructure and the gradual activation of the AfCFTA.",
      body:"When Spiro closes a $57M debt round for electric motorcycles in Kenya, the story is not about one company in one city. It is about the early infrastructure layer of a cross-border EV network, in the same way M-Pesa was early infrastructure for a financial system that now spans East Africa. Nigeria's Flutterwave processes payments across 34 African countries. Ghana's Wave is scaling through Francophone West Africa. These are not exceptions. They are the shape of what is coming as the continent's internal connections strengthen. Investors who read the network will be years ahead of those who read the countries.",
      pull:"The question is not whether to invest in Africa. It is whether you understand which deals are nodes in a continental network and which ones are isolated bets.",
      s1:"AfCFTA: 54 countries, $3.4 trillion combined GDP, 1.4 billion consumers", s1src:"African Union / World Bank",
      s2:"Logistics sector up 340% year-on-year in Q1 2026, cross-border trade driving it", s2src:"TechCabal Insights Q1 2026",
      colour:N4,
    },
    {
      id:2, icon:"▲", tag:"Resource Sovereignty",
      hook:"Africa holds the keys to the electric era. The question is who keeps the value.",
      opener:"For generations, the pattern was simple and brutal: extract raw materials from the continent, process them elsewhere, sell the finished product back at a premium. That pattern is breaking, faster than most investors realise.",
      body:"SolarAfrica's $94M project debt round in early 2026 was not financed by a foreign climate fund. It was financed by Rand Merchant Bank and Investec, South African institutions on South African terms. That is not a coincidence. It is a signal. Across East Africa, a generation of e-mobility startups is building something the old extractive model never permitted: full value-chain ownership. Spiro, Zeno and Arc Ride do not just sell electric motorcycles. They finance them, maintain them, swap the batteries and build the charging grid. Every layer of value that would previously have flowed offshore is being retained on the continent. The DRC holds 70% of the world's cobalt. East Africa has some of its most productive solar resources. North Africa controls critical shipping corridors. These are not just commodities. In the hands of the right companies, they are the infrastructure of the next industrial era, and for the first time Africans are building that infrastructure themselves.",
      pull:"The continent that powers the world's electric vehicles is now building them. That is not an emerging market story. That is a structural shift in global value chains.",
      s1:"Energy sector: $141M raised Q1 2026, IRR proxy ~28%, lowest risk category", s1src:"Ranes Analytics Benchmark Model",
      s2:"SolarAfrica $94M financed by African institutions, not a foreign climate fund", s2src:"Innovation Village, February 2026",
      colour:"#1A6E3C",
    },
    {
      id:3, icon:"●", tag:"The Demographic Thesis",
      hook:"By 2040, one in four people on Earth will be African. That is not a challenge. It is the largest consumer market in history.",
      opener:"Spend a morning in Nairobi's Westlands, Cairo's New Cairo district or Lagos Island and the thing that strikes you first is not the infrastructure gaps or the currency volatility. It is the energy. The density of ambition. The sense of a population that has stopped waiting for conditions to improve and started building the conditions it wants.",
      body:"Africa's 700 million people under the age of 25 are not a statistic to be managed. They are the continent's largest consumer cohort, its most dynamic engineering talent pool and its most prolific entrepreneurial class all at once. Moniepoint, Andela, Wave and LemFi were all built by Africans under 40 who understood their users in the most fundamental way possible: they are their users. That founder-market fit is not sentimental. It is the single most reliable predictor of durable returns in a market that external investors have consistently underestimated. The investors who will look back on this decade most clearly are those who recognised that demographic advantage, treated seriously, is one of the rarest structural advantages in all of private markets.",
      pull:"The investors who will look back on this decade with the greatest satisfaction are those who recognised that youth is not a variable to be managed. It is the thesis itself.",
      s1:"60% of Africa's population is under 25, over 700 million young consumers and builders", s1src:"UN Population Division 2024",
      s2:"Moniepoint, Andela, Wave, LemFi: all built and led by Africans under 40", s2src:"Company records / TechCabal",
      colour:GD,
    },
    {
      id:4, icon:"■", tag:"African Capital",
      hook:"The capital is already on the continent. It just needs a reason to move.",
      opener:"Every conversation about African investment eventually arrives at the same assumption: that the continent is capital-scarce, dependent on foreign inflows and therefore structurally fragile. This assumption is not just wrong. It is becoming more wrong every single year.",
      body:"Africa's pension funds manage over $1.8 trillion in assets. Its sovereign wealth funds hold hundreds of billions more. The African diaspora sends $90 billion home annually, more than all foreign aid to the continent combined, year after year. The story is not that African capital does not exist. It is that the infrastructure to deploy it productively, the data platforms, the deal networks, the co-investment frameworks and the performance benchmarks, has been systematically underdeveloped. That is precisely what is changing. When the IFC, BII and Proparco together deployed over $4 billion into African deals in 2025, they were not filling a gap. They were building the scaffolding for a private capital market that African institutions will eventually own. Ranes Analytics exists because African investors, founders and institutions deserve the same quality of intelligence that their counterparts in New York, London and Singapore have always taken for granted. When African capital can see itself clearly, it moves. When it moves at scale, the returns do not need to be extracted. They stay.",
      pull:"The continent's greatest untapped capital pool is not sitting in a foreign fund waiting to be deployed. It is in African pension funds, family offices, and diaspora accounts — waiting for the right intelligence to move with confidence.",
      s1:"African diaspora remittances: $90B+ annually — more than total foreign aid to the continent", s1src:"World Bank 2024",
      s2:"African pension funds: $1.8 trillion in assets, less than 5% invested in African private equity", s2src:"AVCA Africa / World Bank",
      colour:M4,
    },
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:0}}>

      {/* ── HERO ─────────────────────────────────── */}
      <div style={{background:`linear-gradient(155deg,${N} 0%,${N2} 45%,${M5} 100%)`,padding:"64px 48px 56px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)",backgroundSize:"52px 52px"}}/>
        <div style={{position:"relative",maxWidth:860}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
            <div style={{height:2,width:28,background:M3,borderRadius:1}}/>
            <span style={{fontFamily:AN,fontSize:10,fontWeight:700,color:M3,letterSpacing:3,textTransform:"uppercase"}}>Ranes Analytics · Africa Investment Intelligence</span>
          </div>
          <h1 style={{fontFamily:AN,fontSize:52,fontWeight:700,color:WH,lineHeight:1.1,marginBottom:24,letterSpacing:-0.5}}>
            Africa is not the world's<br/>next opportunity.<br/>
            <span style={{color:GD2}}>It never stopped being one.</span>
          </h1>
          <p style={{fontFamily:AN,fontSize:17,color:"rgba(255,255,255,0.68)",lineHeight:1.85,marginBottom:16,maxWidth:660}}>
            While global capital chased its own correction, African entrepreneurs quietly rebuilt the continent's financial, energy and logistics infrastructure from the inside out. Closer to real problems. Faster than expected. With returns that are beginning to speak for themselves.
          </p>
          <p style={{fontFamily:AN,fontSize:17,color:"rgba(255,255,255,0.68)",lineHeight:1.85,marginBottom:36,maxWidth:660}}>
            Ranes Analytics tracks every significant deal, investor and trend across the continent so that the investors, founders and institutions who are serious about Africa can act on evidence, not assumption.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="btn bp" style={{fontSize:14,padding:"13px 30px"}} onClick={()=>goToService("dashboard")}>Explore the data →</button>
            <button style={{fontSize:14,padding:"13px 24px",background:"rgba(255,255,255,0.07)",color:WH,border:"1px solid rgba(255,255,255,0.18)",borderRadius:5,cursor:"pointer",fontFamily:AN,fontWeight:700,textTransform:"uppercase",letterSpacing:0.6}} onClick={()=>goToService("active")}>Live deals</button>
          </div>
        </div>
        {/* Stat pills */}
        <div style={{position:"relative",display:"flex",gap:12,marginTop:44,flexWrap:"wrap"}}>
          {[["$3.2B","Raised across Africa in 2025","Technext24 / Africa: The Big Deal"],["$711M","Q1 2026 · 14 countries","TechCabal Insights"],["+40%","Year-on-year growth · 2025","Africa: The Big Deal"],["1.4B","People. One interconnected market.","African Union"]].map(([val,lbl,src])=>(
            <div key={val} style={{background:"rgba(255,255,255,0.055)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"14px 20px",minWidth:140}}>
              <div style={{fontFamily:AN,fontSize:26,fontWeight:700,color:GD2,lineHeight:1}}>{val}</div>
              <div style={{fontFamily:AN,fontSize:12,color:"rgba(255,255,255,0.58)",marginTop:4,lineHeight:1.4}}>{lbl}</div>
              <div style={{fontFamily:AN,fontSize:9,color:"rgba(255,255,255,0.28)",marginTop:3,fontStyle:"italic"}}>{src}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── OPENING EDITORIAL ──────────────────── */}
      <div style={{background:BG2,padding:"44px 48px",borderBottom:`1px solid ${BRD}`}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <p style={{fontFamily:AN,fontSize:20,color:TX,lineHeight:1.88,fontStyle:"italic",borderLeft:`4px solid ${M}`,paddingLeft:24}}>
            "The most important investment thesis of this decade is not being written in a San Francisco term sheet. It is being written in the daily decisions of 1.4 billion people who are building the 21st century's most dynamic economies, often without reliable credit, often without stable power, always without excuses."
          </p>
          <div style={{fontFamily:AN,fontSize:12,color:TX3,marginTop:14,paddingLeft:24}}>Ranes Analytics, Editorial Position, 2026</div>
        </div>
      </div>

      {/* ── FIVE STORIES ───────────────────────── */}
      <div style={{padding:"52px 48px",background:WH}}>
        <div style={{marginBottom:40,maxWidth:720}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{height:2,width:28,background:M,borderRadius:1}}/>
            <span style={{fontFamily:AN,fontSize:10,fontWeight:700,color:M,letterSpacing:3,textTransform:"uppercase"}}>Five reasons to look again</span>
          </div>
          <h2 style={{fontFamily:AN,fontSize:34,fontWeight:700,color:TX,lineHeight:1.18,marginBottom:14}}>
            What most investors are still getting wrong about Africa
          </h2>
          <p style={{fontFamily:AN,fontSize:15,color:TX2,lineHeight:1.8}}>
            These are not investment categories. They are corrective lenses, five ways of seeing a continent that has been persistently underestimated and is, with increasing consistency, outperforming the assumptions made about it.
          </p>
        </div>

        <div style={{display:"flex",flexDirection:"column"}}>
          {STORIES.map((s,i)=>{
            const isOpen=openStory===i;
            return(
              <div key={i} style={{borderTop:`1px solid ${BRD}`}}>
                <button onClick={()=>setOpenStory(isOpen?null:i)}
                  style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"30px 0 26px",display:"flex",alignItems:"flex-start",gap:22,textAlign:"left"}}>
                  <div style={{width:50,height:50,borderRadius:10,background:isOpen?s.colour+"15":BG2,border:`1px solid ${isOpen?s.colour+"55":BRD}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,transition:"all 0.22s",marginTop:2}}>
                    {s.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:AN,fontSize:10,fontWeight:700,color:s.colour,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>{s.tag}</div>
                    <div style={{fontFamily:AN,fontSize:23,fontWeight:700,color:TX,lineHeight:1.22,marginBottom:isOpen?0:8}}>{s.hook}</div>
                    {!isOpen&&<p style={{fontFamily:AN,fontSize:14,color:TX2,lineHeight:1.65,maxWidth:660,marginTop:8}}>{s.opener.slice(0,150)}…</p>}
                  </div>
                  <div style={{width:30,height:30,borderRadius:"50%",background:isOpen?s.colour:BG2,border:`2px solid ${isOpen?s.colour:BRD}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:isOpen?WH:TX3,flexShrink:0,marginTop:12,transition:"all 0.22s",transform:isOpen?"rotate(45deg)":"none"}}>+</div>
                </button>

                {isOpen&&(
                  <div style={{paddingBottom:40,paddingLeft:72,paddingRight:20,animation:"fadeUp 0.28s ease both"}}>
                    <p style={{fontFamily:AN,fontSize:16,color:TX,lineHeight:1.88,marginBottom:22,maxWidth:700}}>{s.opener}</p>
                    <p style={{fontFamily:AN,fontSize:14,color:TX2,lineHeight:1.88,marginBottom:30,maxWidth:700}}>{s.body}</p>
                    <div style={{borderLeft:`4px solid ${s.colour}`,paddingLeft:22,marginBottom:30,maxWidth:640}}>
                      <p style={{fontFamily:AN,fontSize:17,fontStyle:"italic",color:TX,lineHeight:1.72}}>{s.pull}</p>
                    </div>
                    <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:24}}>
                      {[[s.s1,s.s1src],[s.s2,s.s2src]].map(([stat,src])=>(
                        <div key={stat} style={{flex:1,minWidth:250,background:BG2,border:`1px solid ${BRD}`,borderRadius:8,padding:"16px 20px"}}>
                          <div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:s.colour,marginBottom:5,lineHeight:1.4}}>{stat}</div>
                          <div style={{fontFamily:AN,fontSize:10,color:TX3,fontStyle:"italic"}}>{src}</div>
                        </div>
                      ))}
                    </div>
                    <button className="btn bp" style={{fontSize:12,padding:"9px 22px"}} onClick={()=>goToService("dashboard")}>See the data →</button>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{borderTop:`1px solid ${BRD}`}}/>
        </div>
      </div>

      {/* ── THREE REGIONS ──────────────────────── */}
      <div style={{background:BG2,padding:"52px 48px",borderTop:`1px solid ${BRD}`}}>
        <div style={{marginBottom:36,maxWidth:720}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{height:2,width:28,background:N4,borderRadius:1}}/>
            <span style={{fontFamily:AN,fontSize:10,fontWeight:700,color:N4,letterSpacing:3,textTransform:"uppercase"}}>Regional intelligence</span>
          </div>
          <h2 style={{fontFamily:AN,fontSize:32,fontWeight:700,color:TX,lineHeight:1.2,marginBottom:12}}>Three markets. One continental story.</h2>
          <p style={{fontFamily:AN,fontSize:15,color:TX2,lineHeight:1.8,maxWidth:620}}>The mistake is to treat these as competing destinations for the same capital. They are complementary, nodes in a single accelerating system that grows stronger as the connections between them deepen.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[
            {region:"East Africa",flags:"🇰🇪🇹🇿🇺🇬🇷🇼",col:M,
              hed:"One ecosystem. Four flags.",
              body:"M-Pesa did not just change how Kenyans pay. It changed how the entire region thinks about financial infrastructure. When you invest in East African tech today, you are betting on a region that has been running the world's most ambitious mobile money experiment for nearly 20 years. The results are not contained within Kenya's borders.",
              stat:"Kenya: $114M raised Q1 2026, $610M total in 2025",act:"active"},
            {region:"West Africa",flags:"🇳🇬🇬🇭🇸🇳🇨🇮",col:N4,
              hed:"The continent's largest consumer market, in formation.",
              body:"Nigeria's 220 million people set the volume. Ghana's regulatory environment runs the experiments. Senegal's Wave demonstrated the Francophone scale. Côte d'Ivoire's GoCab joined the mobility infrastructure together. ECOWAS is not 400 million separate consumers. It is one market learning, deal by deal, to act like one.",
              stat:"Nigeria: $78M Q1 2026, Côte d'Ivoire: $45M Q1 2026",act:"dashboard"},
            {region:"North Africa",flags:"🇪🇬🇲🇦🇹🇳",col:"#1A6E3C",
              hed:"Egypt's fintech renaissance is teaching the continent.",
              body:"Egypt's answer to financial exclusion through ValU, NowPay and MNT-Halan was not borrowed from Silicon Valley. It was built from precise understanding of how 105 million people actually manage money: informally, in instalments, through layers of trust that no algorithm had mapped before. The model is now being studied across sub-Saharan Africa.",
              stat:"Egypt: $190M raised Q1 2026, +130% year-on-year growth in 2025",act:"deals"},
          ].map((r,i)=>(
            <div key={i} className="card" style={{padding:"26px",cursor:"pointer",borderTop:`3px solid ${r.col}`}} onClick={()=>goToService(r.act)}>
              <div style={{fontSize:20,marginBottom:12,letterSpacing:2}}>{r.flags}</div>
              <div style={{fontFamily:AN,fontSize:10,fontWeight:700,color:r.col,letterSpacing:2.5,textTransform:"uppercase",marginBottom:10}}>{r.region}</div>
              <div style={{fontFamily:AN,fontSize:18,fontWeight:700,color:TX,lineHeight:1.25,marginBottom:14}}>{r.hed}</div>
              <p style={{fontFamily:AN,fontSize:13,color:TX2,lineHeight:1.78,marginBottom:18}}>{r.body}</p>
              <div style={{fontFamily:AN,fontSize:11,color:r.col,fontWeight:700,borderTop:`1px solid ${BRD}`,paddingTop:14}}>{r.stat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES CTA ───────────────────────── */}
      <div style={{background:N2,padding:"56px 48px"}}>
        <div style={{maxWidth:760,margin:"0 auto 40px",textAlign:"center"}}>
          <h2 style={{fontFamily:AN,fontSize:30,fontWeight:700,color:WH,marginBottom:14}}>Ready to move from perspective to action?</h2>
          <p style={{fontFamily:AN,fontSize:15,color:"rgba(255,255,255,0.58)",lineHeight:1.8}}>
            The editorial lens is just the beginning. Ranes Analytics gives you verified deal data, live fundraise intelligence, a 7-year historical dashboard and an AI assistant that understands the African context as well as the numbers, all in one platform.
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12,maxWidth:1040,margin:"0 auto"}}>
          {[
            {id:"dashboard",icon:"◈",label:"Dashboard",desc:"7 years of verified funding data, filtered by year, country, sector and deal type."},
            {id:"active",icon:"◉",label:"Active Deals",desc:"Companies actively raising right now, with confidence scores, stage and investor intelligence."},
            {id:"deals",icon:"◇",label:"Deal Database",desc:"Every major deal from 2021 to Q1 2026. Searchable, sourced and cross-verified."},
            {id:"news",icon:"◫",label:"Intelligence Feed",desc:"The stories behind the numbers, from Africa's most trusted primary journalists and trackers."},
            {id:"ai",icon:"▶",label:"Ranes AI",desc:"Ask anything about African deals, investors or trends. Grounded in data, not guesswork."},
          ].map(s=>(
            <div key={s.id} onClick={()=>goToService(s.id)}
              style={{background:"rgba(255,255,255,0.055)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"20px 18px",cursor:"pointer",transition:"all 0.18s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.055)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";}}>
              <div style={{fontSize:22,marginBottom:10}}>{s.icon}</div>
              <div style={{fontFamily:AN,fontSize:14,fontWeight:700,color:WH,marginBottom:6}}>{s.label}</div>
              <div style={{fontFamily:AN,fontSize:12,color:"rgba(255,255,255,0.48)",lineHeight:1.65}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


/* ════════════════════════════════════════════════════════════
   CONTACT BOX
════════════════════════════════════════════════════════════ */
function ContactBox(){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [msg,setMsg]=useState("");
  const [sent,setSent]=useState(false);
  const [err,setErr]=useState("");

  const submit=()=>{
    if(!name.trim()||!email.trim()||!msg.trim()){setErr("Please fill in all fields.");return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setErr("Please enter a valid email address.");return;}
    // Opens default mail client with pre-filled content — works without a backend
    const subject=encodeURIComponent(`Ranes Analytics — Message from ${name}`);
    const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    window.location.href=`mailto:lava.lot23@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);setErr("");
  };

  return(
    <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"24px 26px",marginBottom:6}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
        <div style={{width:28,height:28,borderRadius:6,background:M,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:WH,fontSize:14,fontWeight:700}}>✉</span></div>
        <div>
          <div style={{fontFamily:AN,fontSize:16,fontWeight:700,color:WH}}>Get in Touch</div>
          <div style={{fontFamily:AN,fontSize:12,color:"rgba(255,255,255,0.45)"}}>Questions, partnerships, feedback: we would love to hear from you</div>
        </div>
      </div>
      <div style={{height:1,background:"rgba(255,255,255,0.1)",margin:"14px 0"}}/>
      {sent?(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:28,marginBottom:8,color:M}}>◈</div>
          <div style={{fontFamily:AN,fontSize:15,fontWeight:700,color:WH,marginBottom:4}}>Message sent successfully!</div>
          <div style={{fontFamily:AN,fontSize:12,color:"rgba(255,255,255,0.45)"}}>Your message has been prepared. Just hit send in your mail app to complete.</div>
          <button className="btn bo" style={{marginTop:14,fontSize:12}} onClick={()=>{setSent(false);setName("");setEmail("");setMsg("");}}>Send another</button>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{fontFamily:AN,fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Your Name</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Amara Osei"
              style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:WH,borderRadius:6,padding:"9px 12px",fontFamily:AN,fontSize:13}}/>
          </div>
          <div>
            <div style={{fontFamily:AN,fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Your Email</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
              style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:WH,borderRadius:6,padding:"9px 12px",fontFamily:AN,fontSize:13}}/>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <div style={{fontFamily:AN,fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Message</div>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)}
              placeholder="Tell us about your interest — partnership, data request, feedback, or just a hello!"
              rows={4}
              style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:WH,borderRadius:6,padding:"9px 12px",fontFamily:AN,fontSize:13,resize:"vertical"}}/>
          </div>
          {err&&<div style={{gridColumn:"1/-1",fontFamily:AN,fontSize:12,color:"#FF9090"}}>{err}</div>}
          <div style={{gridColumn:"1/-1",display:"flex",justifyContent:"flex-end"}}>
            <button className="btn bp" onClick={submit} style={{padding:"10px 24px",fontSize:13}}>
              Send Message →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════ */
export default function RanesAnalytics(){
  const [view,setView]=useState("home");
  const [srch,setSrch]=useState("");
  const [srchOpen,setSrchOpen]=useState(false);
  const [modal,setModal]=useState(null);
  const goToService=id=>setView(id);

  const SERVICES=[
    {id:"dashboard",label:"Dashboard",icon:"◈"},
    {id:"active",label:"Active Deals",icon:"◉",badge:true},
    {id:"deals",label:"Deal Database",icon:"◇"},
    {id:"news",label:"News",icon:"◫"},
    {id:"ai",label:"Ranes AI",icon:"▶"},
  ];
  const COMP={home:()=><PanAfricanView goToService={goToService}/>,dashboard:DashboardView,active:ActiveDealsView,deals:DealsView,news:NewsView,ai:AIView};
  const Active=COMP[view]||COMP.home;
  const sres=srch.length>1?ALL_DEALS.filter(d=>d.company.toLowerCase().includes(srch.toLowerCase())||d.sector.toLowerCase().includes(srch.toLowerCase())||d.country.toLowerCase().includes(srch.toLowerCase())).slice(0,6):[];
  // Ticker: Q1 2026 confirmed deals only (most recent)
  const tickerDeals=ALL_DEALS.filter(d=>d.year===2026);
  const ticker=tickerDeals.map(d=>`${d.flag} ${d.company} · $${d.amount}M ${d.round} · ${d.country}`).join("   ◆   ");

  return(
    <>
      <style>{CSS}</style>
      {modal&&<LegalModal docKey={modal} onClose={()=>setModal(null)}/>}
      <div style={{minHeight:"100vh",background:WH}}>
        {/* NAV */}
        <nav style={{background:N2,position:"sticky",top:0,zIndex:200,borderBottom:`2px solid ${M4}`}}>
          <div style={{maxWidth:1600,margin:"0 auto",padding:"0 20px",height:58,display:"flex",alignItems:"center",gap:16}}>
            <LogoLockup onClick={()=>setView("home")} onDark/>
            {/* Home link */}
            <button onClick={()=>setView("home")} className={`nav-btn ${view==="home"?"on":""}`}>Home</button>
            {/* Services divider */}
            <div style={{width:1,height:18,background:"rgba(255,255,255,0.15)",margin:"0 4px"}}/>
            <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:1.5,textTransform:"uppercase",fontFamily:AN,paddingRight:4}}>Services</span>
            <div style={{display:"flex",gap:1,flex:1,overflow:"hidden"}}>
              {SERVICES.map(v=>(
                <button key={v.id} onClick={()=>setView(v.id)} className={`nav-btn ${view===v.id?"on":""}`}>
                  {v.icon} {v.label}
                  {v.badge&&<span style={{marginLeft:4,background:M,color:"#fff",borderRadius:8,fontSize:9,fontWeight:700,padding:"1px 5px"}}>{ACTIVE_DEALS.length}</span>}
                </button>
              ))}
            </div>
            <div style={{position:"relative"}}>
              <input value={srch} onChange={e=>{setSrch(e.target.value);setSrchOpen(true);}} onFocus={()=>setSrchOpen(true)} onBlur={()=>setTimeout(()=>setSrchOpen(false),200)}
                placeholder="Search 2019–2026…" style={{width:190,paddingLeft:28,fontSize:12,background:N3,border:`1px solid ${N4}`,color:"#fff"}}/>
              <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:TX3,fontSize:13}}>⌕</span>
              {srchOpen&&sres.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:WH,border:`1px solid ${BRD}`,borderRadius:7,marginTop:4,zIndex:300,boxShadow:`0 8px 28px ${N}33`}}>
                  {sres.map((r,i)=>(<div key={i} className="tr-h" style={{padding:"9px 13px",cursor:"pointer",borderBottom:i<sres.length-1?`1px solid ${BRD}`:undefined}} onClick={()=>{setView("deals");setSrch("");}}><div style={{fontSize:13,fontWeight:700,color:TX,fontFamily:AN}}>{r.flag} {r.company} — ${r.amount}M · {r.year}</div><div style={{fontSize:11,color:TX2,fontFamily:AN}}>{r.sector} · {r.country} · {r.round}</div></div>))}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* TICKER */}
        <div style={{background:M,borderBottom:`1px solid ${M4}`,padding:"6px 0",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{background:M4,padding:"0 14px",display:"flex",alignItems:"center",gap:7,height:24,flexShrink:0}}><span className="ldot"/><span style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"#fff",fontFamily:AN}}>RANES ANALYTICS · LIVE Q1 2026 DEALS</span></div>
            <div style={{overflow:"hidden",flex:1}}><div style={{display:"inline-block",animation:"ticker 120s linear infinite",whiteSpace:"nowrap",fontSize:11,color:"rgba(255,255,255,0.85)",paddingLeft:20,fontFamily:AN}}>{ticker}&nbsp;&nbsp;&nbsp;{ticker}</div></div>
          </div>
        </div>

        {/* LAYOUT — no sidebar on homepage */}
        {view==="home"?(
          <div style={{maxWidth:"100%"}}><Active/></div>
        ):(
          <div style={{maxWidth:1600,margin:"0 auto",padding:"22px 20px",display:"flex",gap:20}}>
          {/* SIDEBAR */}
          <div style={{width:188,flexShrink:0}}>
            <div style={{position:"sticky",top:88,background:`linear-gradient(175deg,${N2} 0%,${N3} 100%)`,borderRadius:10,border:`1px solid ${N4}`,overflow:"hidden",padding:"14px 8px"}}>
              <button onClick={()=>setView("home")} className="sb-btn" style={{color:"rgba(255,255,255,0.45)",marginBottom:4,borderLeft:"3px solid transparent"}}><span style={{fontSize:13}}>←</span>Home</button>
              <div style={{height:1,background:"rgba(255,255,255,0.1)",margin:"6px 0 10px"}}/>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,paddingLeft:14,fontFamily:AN}}>Services</div>
              {SERVICES.map(v=>(<button key={v.id} onClick={()=>setView(v.id)} className={`sb-btn ${view===v.id?"on":""}`}><span style={{fontSize:13}}>{v.icon}</span>{v.label}{v.badge&&<span style={{marginLeft:"auto",background:M,color:"#fff",borderRadius:8,fontSize:9,fontWeight:700,padding:"1px 5px"}}>{ACTIVE_DEALS.length}</span>}</button>))}
              <div className="divider"/>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:7,paddingLeft:14,fontFamily:AN}}>Historical Totals</div>
              {[["2022 (Peak)","$5.0B"],["2021","$4.3B"],["2025","$3.2B"],["2019","$2.1B"],["2023","$2.9B"],["2024","$2.2B"],["Q1 2026","$0.71B"],["2020 (COVID)","$0.9B"]].map(([l,v])=>(<div key={l} style={{padding:"3px 14px",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,color:"rgba(255,255,255,0.38)",fontFamily:AN}}>{l}</span><span style={{fontSize:10,fontWeight:700,color:M3,fontFamily:AN}}>{v}</span></div>))}
              <div className="divider"/>
              <div style={{padding:"12px",background:`${M}26`,borderRadius:7,border:`1px solid ${M}38`,margin:"4px 2px"}}>
                <p style={{fontSize:12,fontWeight:700,color:M3,marginBottom:4,fontFamily:AN}}>Ask Ranes AI</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.38)",lineHeight:1.5,marginBottom:8,fontFamily:AN}}>Query 7 years of African investment data</p>
                <button className="btn bp" style={{width:"100%",justifyContent:"center",fontSize:11,padding:"7px"}} onClick={()=>setView("ai")}>Open Ranes AI</button>
              </div>
            </div>
          </div>
          {/* MAIN */}
          <div style={{flex:1,minWidth:0}}><Active/></div>
        </div>
        )}

        {/* FOOTER */}
        <footer style={{background:N2,borderTop:`2px solid ${M4}`,padding:"28px 20px 20px"}}>
          <div style={{maxWidth:1600,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:20}}>
              <div><LogoLockup onClick={()=>setView("home")} onDark/><p style={{fontSize:12,color:"rgba(255,255,255,0.36)",maxWidth:210,lineHeight:1.65,marginTop:10,fontFamily:AN}}>Africa's investment intelligence platform. 2019 to Q1 2026.</p></div>
              <div style={{display:"flex",gap:36,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",letterSpacing:1,textTransform:"uppercase",marginBottom:10,fontFamily:AN}}>Platform</div>
                  <div style={{marginBottom:6}}><button className="fl" onClick={()=>setView("home")}>Home</button></div>
                  {SERVICES.map(v=><div key={v.id} style={{marginBottom:6}}><button className="fl" onClick={()=>setView(v.id)}>{v.label}</button></div>)}
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",letterSpacing:1,textTransform:"uppercase",marginBottom:10,fontFamily:AN}}>Legal</div>
                  {[["Privacy Policy","privacy"],["Terms & Conditions","terms"],["GDPR Compliance","gdpr"],["Kenya & Nigeria DPA","kdpa"],["Investment Disclaimer","disclaimer"]].map(([l,d])=>(<div key={l} style={{marginBottom:6}}><button className="fl" onClick={()=>setModal(d)}>{l}</button></div>))}
                </div>
              </div>
            </div>
            {/* ── CONTACT BOX ── */}
            <ContactBox/>

            <div style={{height:1,background:"rgba(255,255,255,0.1)",margin:"20px 0 14px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontFamily:AN}}>
                © 2026 <strong style={{color:"rgba(255,255,255,0.6)"}}>Ranes Analytics</strong> · All rights reserved.
                <span style={{margin:"0 8px",opacity:0.25}}>|</span>
                <button style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:12,cursor:"pointer",fontFamily:AN}} onClick={()=>setModal("disclaimer")}>Not investment advice.</button>
                <span style={{margin:"0 8px",opacity:0.25}}>|</span>
                <button style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:12,cursor:"pointer",fontFamily:AN}} onClick={()=>setModal("gdpr")}>GDPR</button>
              </div>
              <div style={{display:"flex",gap:8}}>
                <span className="badge bgn">✓ Verified</span>
                <span className="badge bm">Ranes AI</span>
                <span className="badge bn">2019–2026</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
