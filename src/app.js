{
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rid=()=>Math.random().toString(36).slice(2,10);
const trunc=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s};
const de=s=>String(s).replace('.',',');
const fmtLen=v=>v===''||v==null?'':de(v)+' m';
const opts=(arr,v)=>arr.map(([k,t])=>`<option value="${esc(k)}"${String(k)===String(v)?' selected':''}>${esc(t)}</option>`).join('');
const sn=v=>Math.round(v/10)*10;
const pl=(n,a,b)=>n+' '+(n===1?a:b);

/* ================= catalogue ================= */
const SP={'10M':{v:10,n:'10 Mbit/s',c:'#a16207'},'100M':{v:100,n:'100 Mbit/s',c:'#d97706'},'1G':{v:1e3,n:'1 Gbit/s',c:'#16a34a'},'2.5G':{v:2500,n:'2,5 Gbit/s',c:'#0d9488'},'5G':{v:5e3,n:'5 Gbit/s',c:'#0891b2'},'10G':{v:1e4,n:'10 Gbit/s',c:'#2563eb'},'25G':{v:25e3,n:'25 Gbit/s',c:'#7c3aed'},'40G':{v:4e4,n:'40 Gbit/s',c:'#c026d3'},'100G':{v:1e5,n:'100 Gbit/s',c:'#be123c'}};
const PT={
 rj45:{n:'RJ45',pre:'r',sp:['10M','100M','1G','2.5G','5G','10G'],def:'1G',g:[32,26,36]},
 mgmt:{n:'Management',pre:'g',sp:['100M','1G'],def:'1G',g:[32,26,36]},
 sfp:{n:'SFP',pre:'s',sp:['100M','1G'],def:'1G',g:[40,16,44],ff:'s'},
 sfpp:{n:'SFP+',pre:'p',sp:['1G','10G'],def:'10G',g:[40,16,44],ff:'s'},
 sfp28:{n:'SFP28',pre:'t',sp:['10G','25G'],def:'25G',g:[40,16,44],ff:'s'},
 qsfpp:{n:'QSFP+',pre:'q',sp:['40G'],def:'40G',g:[52,20,58],ff:'q'},
 qsfp28:{n:'QSFP28',pre:'u',sp:['40G','100G'],def:'100G',g:[52,20,58],ff:'q'},
 kj:{n:'RJ45-Buchse',pre:'k',pas:1,g:[30,26,34]},
 lc:{n:'LC-Duplex',pre:'l',pas:1,g:[26,20,30],con:'LC'},
 sc:{n:'SC',pre:'c',pas:1,g:[22,24,28],con:'SC'},
 mpo:{n:'MPO-12',pre:'m',pas:1,g:[30,14,36],con:'MPO'}
};
const PRE=Object.fromEntries(Object.entries(PT).map(([k,v])=>[v.pre,k]));
const isPas=t=>!!PT[t].pas,isCuP=t=>t==='rj45'||t==='mgmt'||t==='kj';
const CAT={cat5e:{n:'Cat5e',r:0,max:5e3},cat6:{n:'Cat6',r:1,max:1e4},cat6a:{n:'Cat6A',r:2,max:1e4},cat7:{n:'Cat7',r:3,max:1e4},cat7a:{n:'Cat7A',r:4,max:1e4},cat8_1:{n:'Cat8.1',r:5,max:4e4,len:30},cat8_2:{n:'Cat8.2',r:6,max:4e4,len:30}};
const SHIELD=['U/UTP','F/UTP','U/FTP','S/FTP','SF/UTP'];
const FG={om1:{n:'OM1',m:'mm',r:0,col:'#f08a24'},om2:{n:'OM2',m:'mm',r:1,col:'#f08a24'},om3:{n:'OM3',m:'mm',r:2,col:'#19b5c9'},om4:{n:'OM4',m:'mm',r:3,col:'#9b5fc0'},om5:{n:'OM5',m:'mm',r:4,col:'#9acd32'},os2:{n:'OS2',m:'sm',r:9,col:'#f2c200'}};
const CONS=['LC','SC','ST','MPO'];
const MED={cu:{n:'Kupfer'},fi:{n:'Glasfaser'},dac:{n:'DAC'},aoc:{n:'AOC'}};
const TR=Object.fromEntries([
 ['1000BASE-SX',{ff:['sfp','sfpp'],m:'mm',v:'1G',con:'LC',r:{om1:275,om2:550,om3:550,om4:550,om5:550},d:'850 nm · LC-Duplex'}],
 ['1000BASE-LX',{ff:['sfp','sfpp'],m:'sm',v:'1G',con:'LC',r:{os2:10000},d:'1310 nm · LC-Duplex'}],
 ['1000BASE-BX',{ff:['sfp','sfpp'],m:'sm',v:'1G',con:'LC',r:{os2:10000},d:'BiDi 1310/1550 nm · eine Faser'}],
 ['1000BASE-T',{ff:['sfp','sfpp'],m:'cu',v:'1G',con:'RJ45',r:{cu:100},d:'RJ45-Modul'}],
 ['10GBASE-SR',{ff:['sfpp','sfp28'],m:'mm',v:'10G',con:'LC',r:{om1:33,om2:82,om3:300,om4:400,om5:400},d:'850 nm · LC-Duplex'}],
 ['10GBASE-LR',{ff:['sfpp','sfp28'],m:'sm',v:'10G',con:'LC',r:{os2:10000},d:'1310 nm · LC-Duplex'}],
 ['10GBASE-ER',{ff:['sfpp'],m:'sm',v:'10G',con:'LC',r:{os2:40000},d:'1550 nm · LC-Duplex'}],
 ['10GBASE-T',{ff:['sfpp'],m:'cu',v:'10G',con:'RJ45',r:{cu:30},d:'RJ45-Modul, wird warm'}],
 ['25GBASE-SR',{ff:['sfp28'],m:'mm',v:'25G',con:'LC',r:{om3:70,om4:100,om5:100},d:'850 nm · LC-Duplex'}],
 ['25GBASE-LR',{ff:['sfp28'],m:'sm',v:'25G',con:'LC',r:{os2:10000},d:'1310 nm · LC-Duplex'}],
 ['40GBASE-SR4',{ff:['qsfpp','qsfp28'],m:'mm',v:'40G',con:'MPO',r:{om3:100,om4:150,om5:150},d:'850 nm · MPO-12, 8 Fasern'}],
 ['40GBASE-SR-BiDi',{ff:['qsfpp','qsfp28'],m:'mm',v:'40G',con:'LC',r:{om3:100,om4:150,om5:150},d:'BiDi 850/900 nm · LC-Duplex'}],
 ['40GBASE-LR4',{ff:['qsfpp','qsfp28'],m:'sm',v:'40G',con:'LC',r:{os2:10000},d:'CWDM 1310 nm · LC-Duplex'}],
 ['100GBASE-SR4',{ff:['qsfp28'],m:'mm',v:'100G',con:'MPO',r:{om3:70,om4:100,om5:100},d:'850 nm · MPO-12, 8 Fasern'}],
 ['100GBASE-CWDM4',{ff:['qsfp28'],m:'sm',v:'100G',con:'LC',r:{os2:2000},d:'CWDM 1310 nm · LC-Duplex'}],
 ['100GBASE-LR4',{ff:['qsfp28'],m:'sm',v:'100G',con:'LC',r:{os2:10000},d:'LAN-WDM 1310 nm · LC-Duplex'}],
 ['100GBASE-DR',{ff:['qsfp28'],m:'sm',v:'100G',con:'LC',r:{os2:500},d:'1310 nm · LC-Duplex'}]
].map(([n,v])=>[n,{...v,n}]));
const COL={auto:{n:'Automatisch',hex:null},blau:{n:'Blau',hex:'#1f5fd1'},gelb:{n:'Gelb',hex:'#f2c200'},gruen:{n:'Grün',hex:'#2e9e4f'},rot:{n:'Rot',hex:'#d0342c'},orange:{n:'Orange',hex:'#ee7a1a'},violett:{n:'Violett',hex:'#8e5bc9'},aqua:{n:'Aqua',hex:'#19b5c9'},lime:{n:'Limette',hex:'#9acd32'},grau:{n:'Grau',hex:'#8a8f96'},schwarz:{n:'Schwarz',hex:'#2a2c2f'},weiss:{n:'Weiß',hex:'#f4f4f2'}};
const HOSTS=[['pc','PC'],['laptop','Notebook'],['printer','Drucker'],['phone','IP-Telefon'],['camera','IP-Kamera'],['nas','NAS'],['tv','Display'],['iot','IoT-Gerät'],['other','Sonstiges']];
const NETS=[['router','Router'],['gateway','Gateway / Controller'],['wlc','WLAN-Controller'],['nas','NAS'],['mc','Medienkonverter'],['modem','Modem / ONT'],['console','Konsolenserver'],['other','Netzwerkgerät']];
const subLbl=d=>((d.kind==='net'?NETS:HOSTS).find(h=>h[0]===d.sub)||(d.kind==='net'?NETS:HOSTS)[0])[1];
const VAS=['500','750','1000','1500','2200','3000','5000','6000','8000','10000'];
const TOPO={vfd:{n:'Offline / Standby (VFD)',s:'Offline · VFD'},vi:{n:'Line-Interactive (VI)',s:'Line-Interactive · VI'},vfi:{n:'Online-Doppelwandler (VFI)',s:'Online · VFI'}};
const RCOL={blau:{n:'Blau',c:'#2563eb'},gruen:{n:'Grün',c:'#16a34a'},ocker:{n:'Ocker',c:'#b7791f'},rot:{n:'Rot',c:'#dc2626'},violett:{n:'Violett',c:'#7c3aed'},grau:{n:'Grau',c:'#6b7280'}};
const RPAL={schwarz:{f:'#26282b',f2:'#18191b',rail:'#33363a',hole:'#0c0d0f',inn:'#0e0f10',txt:'#ffffff',sub:'#a3abb4'},grau:{f:'#dadad5',f2:'#c8c8c3',rail:'#babbb6',hole:'#7f807c',inn:'#2a2c2f',txt:'#1d2126',sub:'#55585d'}};
const SEV={err:{c:'#d0342c',g:'!',r:0},warn:{c:'#d97706',g:'!',r:1},info:{c:'#2563eb',g:'i',r:2}};
const STY={
 lancom:{key:'lancom',n:'Lancom-Stil',g:['#41464e','#25292f'],stroke:'#111316',ear:'#2e3238',earHole:'#141619',hi:.16,text:'#f2f4f7',sub:'#a6aeb8',num:'#ccd2d9',jack:'#a3a9b0',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#aab0b7',offJ:'#6b7178',offC:'#30343a',frame:'#33383f',fm:'fill',ks:'#1e2124',gc2:4,gc1:4,led:'corner'},
 unifi:{key:'unifi',n:'UniFi-Stil',g:['#f8f9fa','#dde0e4'],stroke:'#a9afb6',ear:'#e8eaed',earHole:'#b3b9c0',hi:.9,text:'#1d2126',sub:'#5f6670',num:'#5b626b',jack:'#c9cdd2',jackEdge:'#98a0a8',hole:'#1f2226',cage:'#c4c9cf',offJ:'#8d949c',offC:'#c6cbd1',ks:'#2a2d31',gc2:6,gc1:8,led:'bar',nbo:2},
 hp:{key:'hp',n:'HP-Stil',g:['#81858b','#62666c'],stroke:'#3d4045',ear:'#6d7176',earHole:'#3b3e42',hi:.24,panel:'#8f9399',text:'#ffffff',sub:'#e6e8eb',num:'#f5f6f7',jack:'#b6bbc0',jackEdge:'#4f5358',hole:'#121315',cage:'#b0b5bb',offJ:'#777c82',offC:'#4a4d52',frame:'#d6d9dc',fm:'line',ks:'#26292d',gc2:6,gc1:4,led:'corner'},
 fs:{key:'fs',n:'FS-Stil',g:['#2c2f34','#16181b'],stroke:'#0a0b0c',ear:'#222428',earHole:'#0d0e10',hi:.14,text:'#ffffff',sub:'#9ea5ad',num:'#e3e6ea',jack:'#c3c8ce',jackEdge:'#6b7178',hole:'#0a0b0c',cage:'#c9cdd3',offJ:'#80868d',offC:'#2c2f34',frame:'#6a7079',fm:'line',ks:'#1b1d20',gc2:6,gc1:6,led:'corner'},
 hpe:{key:'hpe',n:'HPE-Stil',g:['#3c4046','#1f2226'],stroke:'#0f1012',ear:'#2a2d32',earHole:'#111214',hi:.14,text:'#ffffff',sub:'#a8b0b8',num:'#d9dde2',jack:'#aab0b7',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#b3b9bf',offJ:'#6b7178',offC:'#30343a',gc2:4,gc1:4,led:'corner',bay:'#2a2d32',bayLed:'#3ddc6a',mg:'iLO',acc:'#01a982'},
 dell:{key:'dell',n:'Dell-Stil',g:['#35383d','#1b1d20'],stroke:'#0c0d0f',ear:'#26292d',earHole:'#0f1012',hi:.14,text:'#ffffff',sub:'#a3abb4',num:'#d9dde2',jack:'#aab0b7',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#b3b9bf',offJ:'#6b7178',offC:'#30343a',gc2:4,gc1:4,led:'corner',bay:'#3b3f45',bayLed:'#4d9dff',mg:'iDRAC',acc:'#0a84ff'},
 smc:{key:'smc',n:'Supermicro-Stil',g:['#dfe2e6','#bec2c8'],stroke:'#8b9198',ear:'#d0d4d9',earHole:'#8f959c',hi:.85,text:'#1b1e22',sub:'#4f565e',num:'#2a3036',jack:'#c6cace',jackEdge:'#7b8188',hole:'#1d2024',cage:'#c9cdd2',offJ:'#8d949c',offC:'#a3a9b0',gc2:4,gc1:4,led:'corner',bay:'#25282c',bayLed:'#3ddc6a',mg:'IPMI',acc:'#2563eb'},
 apc:{key:'apc',n:'APC-Stil',g:['#2a2c30','#141518'],stroke:'#08090a',ear:'#1f2124',earHole:'#0b0c0d',hi:.12,text:'#ffffff',sub:'#9aa1a9',num:'#d9dde2',jack:'#aab0b7',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#b3b9bf',offJ:'#6b7178',offC:'#30343a',gc2:4,gc1:4,led:'corner',mg:'NMC',lcd:'#0b2233',lcdT:'#7fd3ff',grille:'#3b3e43',acc:'#3ddc6a'},
 eaton:{key:'eaton',n:'Eaton-Stil',g:['#4b4f56','#2c2f34'],stroke:'#16181b',ear:'#3a3d43',earHole:'#16181b',hi:.16,text:'#ffffff',sub:'#b4bbc3',num:'#e3e6ea',jack:'#aab0b7',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#b3b9bf',offJ:'#6b7178',offC:'#30343a',gc2:4,gc1:4,led:'corner',mg:'NMC',lcd:'#0f1d2b',lcdT:'#a6e3ff',grille:'#5a5f66',acc:'#43b02a'},
 cp:{key:'cp',n:'CyberPower-Stil',g:['#212326','#0f1012'],stroke:'#050506',ear:'#1a1b1e',earHole:'#08090a',hi:.12,text:'#ffffff',sub:'#a0a6ad',num:'#d9dde2',jack:'#aab0b7',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#b3b9bf',offJ:'#6b7178',offC:'#30343a',gc2:4,gc1:4,led:'corner',mg:'SNMP',lcd:'#1c1a0b',lcdT:'#ffb020',grille:'#34373b',acc:'#f59e0b'},
 aruba:{key:'aruba',n:'Aruba-Stil',g:['#ffffff','#e6e9ed']},
 sophos:{key:'sophos',n:'Sophos-Stil',g:['#2d333b','#171b20'],stroke:'#0b0d10',ear:'#22272d',earHole:'#0d0f12',hi:.14,text:'#ffffff',sub:'#a4adb8',num:'#dbe1e7',jack:'#aab1b9',jackEdge:'#5a616a',hole:'#0a0b0d',cage:'#b6bcc3',offJ:'#6b727a',offC:'#323840',frame:'#3a414a',fm:'fill',ks:'#1d2126',gc2:4,gc1:4,led:'corner',mg:'MGMT',acc:'#2f7cf6',fa:'bar'},
 fortinet:{key:'fortinet',n:'Fortinet-Stil',g:['#4a4e54','#2a2d31'],stroke:'#141518',ear:'#3a3d42',earHole:'#16171a',hi:.16,text:'#ffffff',sub:'#b9bfc6',num:'#e6e9ec',jack:'#b0b6bc',jackEdge:'#5d6369',hole:'#0b0c0e',cage:'#bcc2c8',offJ:'#757b82',offC:'#3a3e43',frame:'#d9dde1',fm:'line',ks:'#222528',gc2:4,gc1:4,led:'corner',mg:'MGMT',acc:'#e1251b',fa:'dot'},
 paloalto:{key:'paloalto',n:'Palo-Alto-Stil',g:['#3b3f45','#202327'],stroke:'#0e0f11',ear:'#2c2f34',earHole:'#101113',hi:.14,text:'#ffffff',sub:'#a9b0b8',num:'#dde1e5',jack:'#aab0b7',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#b3b9bf',offJ:'#6b7178',offC:'#30343a',frame:'#4a4f56',fm:'fill',ks:'#1e2124',gc2:4,gc1:4,led:'corner',mg:'MGT',acc:'#fa582d',fa:'stripe'},
 watchguard:{key:'watchguard',n:'WatchGuard-Stil',g:['#d22a33','#a3161f'],stroke:'#5e0a10',ear:'#b81e27',earHole:'#4a070c',hi:.22,text:'#ffffff',sub:'#ffd9db',num:'#ffffff',jack:'#c9ccd0',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#d0d4d8',offJ:'#e07a80',offC:'#8a1219',frame:'#1d1f22',fm:'fill',ks:'#1d1f22',gc2:4,gc1:4,led:'corner',mg:'MGMT',acc:'#ffffff'},
 opnsense:{key:'opnsense',n:'OPNsense-Stil',g:['#2b2b2d','#141415'],stroke:'#070708',ear:'#1f1f21',earHole:'#09090a',hi:.12,text:'#ffffff',sub:'#a7a7ab',num:'#dedee2',jack:'#aeb2b7',jackEdge:'#5b6168',hole:'#0b0c0e',cage:'#b8bcc1',offJ:'#6d7177',offC:'#2f3135',frame:'#5a5a5f',fm:'line',ks:'#1c1c1e',gc2:4,gc1:4,led:'corner',mg:'MGMT',acc:'#e3591e',fa:'stripe'},
 host:{key:'host',n:'Host',g:['#fbfbf9','#ecece8'],jack:'#c9cdd2',jackEdge:'#8d949c',hole:'#1f2226',cage:'#c4c9cf',offJ:'#8d949c',offC:'#c6cbd1',num:'#5b626b',gc2:99,gc1:99,led:'corner'}
};
const KIND={
 switch:{n:'Switch',rack:1,types:['rj45','sfp','sfpp','sfp28','qsfpp','qsfp28'],styles:['lancom','unifi','hp','fs'],info:172,infoMin:118,maxHe:2},
 fw:{n:'Firewall',rack:1,types:['mgmt','rj45','sfp','sfpp','sfp28','qsfp28'],styles:['sophos','fortinet','paloalto','watchguard','lancom','opnsense'],info:182,infoMin:126,maxHe:2},
 net:{n:'Netzwerkgerät',rack:1,types:['rj45','sfp','sfpp','sfp28','qsfpp','qsfp28'],styles:['lancom','unifi','hp','fs'],info:172,infoMin:118,maxHe:2},
 patch:{n:'Patchpanel',rack:1,types:['kj'],styles:['fs','unifi','hp','lancom'],info:150,infoMin:104,maxHe:2},
 fiber:{n:'LWL-Panel',rack:1,types:['lc','sc','mpo'],styles:['fs','unifi','hp','lancom'],info:150,infoMin:104,maxHe:4},
 server:{n:'Server',rack:1,types:['mgmt','rj45','sfpp','sfp28','qsfp28'],styles:['hpe','dell','smc'],info:150,infoMin:112,maxHe:4},
 ups:{n:'USV',rack:1,types:['mgmt'],styles:['apc','eaton','cp'],info:210,infoMin:170,maxHe:4},
 pdu:{n:'PDU',rack:1,types:['mgmt'],styles:['apc','eaton','cp'],info:176,infoMin:132,maxHe:2},
 ap:{n:'Access Point',rack:0,types:['rj45'],styles:['unifi','lancom','aruba']},
 host:{n:'Host',rack:0,types:['rj45','sfpp'],styles:['host']}
};
const OBJ={rack:{n:'Schrank'},room:{n:'Raum'}};
const MAXC={rj45:52,sfp:48,sfpp:48,sfp28:48,qsfpp:32,qsfp28:32,mgmt:1,kj:48,lc:48,sc:48,mpo:24};
const maxc=(d,t)=>d.kind==='ap'?2:d.kind==='host'?(t==='rj45'?4:2):d.kind==='server'&&t!=='mgmt'?8:MAXC[t];
const minPorts=d=>d.kind==='ups'||d.kind==='pdu'?0:1;
const F={
 name:{l:'Name',t:'text',max:40},
 model:{l:'Modell / Typ',t:'text',max:40,ph:'z. B. 24G + 4SFP+ L2+'},
 role:{l:'Rolle / Betriebssystem',t:'text',max:40,ph:'z. B. Hypervisor, NAS'},
 style:{l:'Optik',t:'seg',o:d=>KIND[d.kind].styles.map(s=>[s,STY[s].n])},
 size:{l:'Bauform',t:'seg',o:d=>d.kind==='ups'?[['frei','Tower'],['19','19″-Rack']]:[['frei','Frei'],['10','10″-Rack'],['19','19″-Rack']]},
 rack:{l:'Einbauort',t:'sel',o:()=>[['','Kein Schrank – frei im Plan'],...state.racks.map(r=>[r.id,'Schrank „'+r.name+'“ ('+r.rsize+'″)'])],show:d=>!!KIND[d.kind]&&!!KIND[d.kind].rack&&state.racks.length>0},
 u:{l:'Position ab HE',t:'num',min:1,max:99,show:d=>!!d.rack&&d.id!=='preview'},
 he:{l:'Höhe',t:'sel',o:d=>Array.from({length:KIND[d.kind].maxHe},(_,i)=>[String(i+1),(i+1)+' HE']),show:d=>d.size!=='frei'},
 bays:{l:'Festplatten-Slots',t:'num',min:0,max:48},
 baysUsed:{l:'davon befüllt',t:'num',min:0,max:48,show:d=>d.bays>0},
 bayForm:{l:'Slot-Größe',t:'seg',o:[['2.5','2,5″'],['3.5','3,5″']],show:d=>d.bays>0},
 bayDir:{l:'Anordnung der Slots',t:'seg',o:[['v','Vertikal (stehend)'],['h','Horizontal (liegend)']],show:d=>d.bays>0},
 bayRows:{l:'Reihen',t:'sel',o:[['1','1 Reihe'],['2','2 Reihen'],['3','3 Reihen'],['4','4 Reihen']],show:d=>d.bays>0&&d.bayDir==='h'},
 rows:{l:'Portreihen',t:'sel',o:[['auto','Automatisch'],['1','Einreihig'],['2','Zweireihig']]},
 pnum:{l:'Nummerierung',t:'sel',o:[['col','Spaltenweise – 1 oben, 2 unten'],['colr','Spaltenweise – 2 oben, 1 unten'],['row','Nebeneinander – oben 1, 2, 3 …'],['rowr','Nebeneinander – unten 1, 2, 3 …']],show:d=>!!KIND[d.kind]&&(d.rows==='2'||(d.rows==='auto'&&autoRows(d)===2))},
 pc:{t:'pc'},
 rj45Speed:{l:'RJ45-Geschwindigkeit',t:'sel',o:PT.rj45.sp.map(s=>[s,SP[s].n]),show:d=>(d.pc.rj45||0)>0},
 poe:{l:'PoE auf allen RJ45-Ports',t:'chk',show:d=>(d.pc.rj45||0)>0},
 wan:{l:'davon WAN-Ports',t:'sel',o:[['0','keiner'],['1','1 (Port 1)'],['2','2'],['3','3'],['4','4']],show:d=>(d.pc.rj45||0)>0},
 cat:{l:'Kategorie',t:'sel',o:Object.entries(CAT).map(([k,v])=>[k,v.n])},
 shield:{l:'Geschirmt (STP)',t:'chk'},
 fg:{l:'Fasertyp',t:'sel',o:Object.entries(FG).map(([k,v])=>[k,v.n+(v.m==='sm'?' (SM)':' (MM)')])},
 pol:{l:'Schliff',t:'sel',o:[['UPC','UPC (blau)'],['APC','APC (grün, 8°)']],show:d=>FG[d.fg].m==='sm'},
 wifi:{l:'WLAN-Standard',t:'sel',o:[['Wi-Fi 5','Wi-Fi 5 · 802.11ac'],['Wi-Fi 6','Wi-Fi 6 · 802.11ax'],['Wi-Fi 6E','Wi-Fi 6E · 6 GHz'],['Wi-Fi 7','Wi-Fi 7 · 802.11be']]},
 poeStd:{l:'PoE-Bedarf',t:'sel',o:[['af','802.3af · PoE, bis 15,4 W'],['at','802.3at · PoE+, bis 30 W'],['bt','802.3bt · PoE++, bis 90 W']]},
 sub:{l:'Gerät',t:'sel',o:d=>d.kind==='net'?NETS:HOSTS},
 pd:{l:'Wird über PoE versorgt',t:'chk'},
 va:{l:'Leistung',t:'sel',o:VAS.map(v=>[v,Number(v).toLocaleString('de-DE')+' VA'])},
 topo:{l:'Bauart (IEC 62040-3)',t:'sel',o:Object.entries(TOPO).map(([k,v])=>[k,v.n])},
 user:{l:'Raum / Benutzer',t:'text',max:60,ph:'z. B. Büro 1.12 · M. Weber'},
 location:{l:'Standort',t:'text',max:60,ph:'z. B. Serverraum UG'},
 ptag:{l:'Kürzel (Patchlegung)',t:'text',max:12,ph:d=>'automatisch: '+panelTag({...d,ptag:''})},
 ip:{l:'IP-Adresse',t:'text',max:40,ph:'10.0.0.2'},
 mac:{l:'MAC-Adresse',t:'text',max:20,ph:'aa:bb:cc:dd:ee:ff'},
 notes:{l:'Notizen',t:'text',max:500},
 watt:{l:'Leistungsaufnahme (W)',t:'num',min:0,max:20000,opt:1,ph:d=>'geschätzt ca. '+estW(d)+' W'},
 psu:{l:'Netzteile',t:'seg',o:[['1','1 Netzteil'],['2','2 (redundant)']]},
 pa:{l:'Netzteil A an',t:'sel',o:d=>srcOpts(d)},
 pb:{l:'Netzteil B an',t:'sel',o:d=>srcOpts(d),show:d=>d.psu==='2'},
 uw:{l:'Wirkleistung (W)',t:'num',min:100,max:200000,opt:1,ph:d=>'Standard '+upsCap(d)+' W'},
 bat:{l:'Akku (Wh)',t:'num',min:10,max:500000,opt:1,ph:'für die Laufzeit'},
 o13:{l:'Steckdosen C13',t:'num',min:0,max:48},
 o19:{l:'Steckdosen C19',t:'num',min:0,max:24},
 amp:{l:'Absicherung',t:'sel',o:[['10','10 A · 2,3 kW'],['16','16 A · 3,7 kW'],['32','32 A · 7,4 kW'],['3x16','3 × 16 A · 11 kW']]},
 year:{l:'Kaufjahr',t:'num',min:1980,max:2100,opt:1,ph:'z. B. 2021'},
 lifeOld:{l:'Veraltet nach (Jahren)',t:'num',min:1,max:50,opt:1,ph:()=>'Standard: '+state.life.old},
 lifeEol:{l:'EOL nach (Jahren)',t:'num',min:1,max:60,opt:1,ph:()=>'Standard: '+state.life.eol},
 rsize:{l:'Breite',t:'seg',o:[['19','19″-Schrank'],['10','10″-Schrank']]},
 minHe:{l:'Höhe',t:'sel',o:[['0','Automatisch – wächst mit'],...[6,9,12,15,18,22,24,27,32,36,42,47].map(n=>[String(n),n+' HE fest'])]},
 rcolor:{l:'Farbe',t:'seg',o:[['schwarz','Schwarz'],['grau','Lichtgrau']]},
 roomc:{l:'Farbe',t:'seg',o:Object.entries(RCOL).map(([k,v])=>[k,v.n])},
 w:{l:'Breite',t:'num',min:300,max:30000,step:10},
 h:{l:'Höhe',t:'num',min:200,max:30000,step:10},
 place:{l:'Position',t:'seg',o:[['right','Rechts neben den Plan'],['around','Um den ganzen Plan']],show:d=>d.id==='preview'}
};
const FORM={
 switch:['name','model','style','size','rack',['he','rows'],'pnum','u','pc',['rj45Speed'],'poe',['location','ip']],
 fw:['name','model','style','size','rack',['he','rows'],'pnum','u','pc',['rj45Speed','wan'],['location','ip']],
 net:['name','sub','model','style','size','rack',['he','rows'],'pnum','u','pc',['rj45Speed','wan'],['location','ip']],
 patch:['name','model','style','size','rack',['he','rows'],'pnum','u','pc',['cat'],'shield',['ptag','location']],
 fiber:['name','model','style','size','rack',['he','rows'],'pnum','u','pc',['fg','pol'],['ptag','location']],
 server:['name','role','style','size','rack',['he','rows'],'pnum','u','pc',['bays','baysUsed'],'bayForm','bayDir','bayRows',['rj45Speed'],['model','ip'],'location'],
 ups:['name','model','style','size','rack',['he','va'],'u','topo','pc',['location','ip']],
 pdu:['name','model','style','size','rack',['he'],'u','pc',['o13','o19'],'amp',['location','ip']],
 ap:['name','model','style','pc',['rj45Speed','wifi'],['poeStd'],['location','ip']],
 host:['name','sub','pc',['rj45Speed'],'pd',['ip','mac'],'user'],
 rack:['name','rsize',['minHe'],'rcolor','location'],
 room:['name','roomc',['w','h'],'place']
};
for(const k of Object.keys(KIND))FORM[k].push('year',['lifeOld','lifeEol']);
const PRESETS={
 switch:[['8 × RJ45 + 2 × SFP · 10″',{size:'10',pc:{rj45:8,sfp:2}}],['24 × RJ45 + 4 × SFP+',{size:'19',pc:{rj45:24,sfpp:4}}],['48 × RJ45 + 4 × SFP+',{size:'19',pc:{rj45:48,sfpp:4}}],['24 × 2,5G PoE + 4 × SFP28',{size:'19',pc:{rj45:24,sfp28:4},rj45Speed:'2.5G',poe:true}],['48 × SFP28 + 6 × QSFP28',{size:'19',pc:{sfp28:48,qsfp28:6},style:'fs'}],['32 × QSFP28 (Spine)',{size:'19',pc:{qsfp28:32},style:'fs'}]],
 fw:[['Desktop · 1 WAN + 7 LAN',{size:'frei',pc:{rj45:8},wan:1}],['Desktop · 2 WAN + 6 LAN + SFP',{size:'frei',pc:{rj45:8,sfp:1},wan:2}],['1 HE · 2 WAN + 8 LAN + 2 SFP+',{size:'19',he:1,pc:{mgmt:1,rj45:10,sfpp:2},wan:2}],['1 HE · 16 × 1G + 8 × SFP+ + 4 × SFP28',{size:'19',he:1,pc:{mgmt:1,rj45:16,sfpp:8,sfp28:4},wan:2}],['2 HE · 8 × SFP28 + 2 × QSFP28',{size:'19',he:2,pc:{mgmt:1,rj45:8,sfp28:8,qsfp28:2},wan:2}]],
 net:[['Router · 1 WAN + 4 LAN',{sub:'router',style:'lancom',size:'frei',pc:{rj45:5},wan:1}],['Gateway · 8 LAN + 2 SFP+',{sub:'gateway',style:'unifi',size:'19',pc:{rj45:9,sfpp:2},wan:1}],['WLAN-Controller',{sub:'wlc',style:'hp',size:'19',pc:{rj45:4,sfpp:2},wan:0}],['Medienkonverter RJ45 ↔ SFP',{sub:'mc',style:'fs',size:'frei',pc:{rj45:1,sfp:1},wan:0}],['Modem / ONT',{sub:'modem',style:'fs',size:'frei',pc:{rj45:1},wan:0}]],
 patch:[['24 × Cat6A geschirmt',{pc:{kj:24},cat:'cat6a',shield:true,size:'19',he:1}],['48 × Cat6A · 1 HE',{pc:{kj:48},cat:'cat6a',size:'19',he:1}],['12 × Cat6A · 10″',{pc:{kj:12},size:'10',he:1}],['24 × Cat6 ungeschirmt',{pc:{kj:24},cat:'cat6',shield:false}]],
 fiber:[['24 × LC-Duplex OS2',{pc:{lc:24},fg:'os2',pol:'UPC'}],['24 × LC-Duplex OM4',{pc:{lc:24},fg:'om4'}],['12 × SC OS2 APC',{pc:{sc:12},fg:'os2',pol:'APC'}],['12 × MPO-12 OM4',{pc:{mpo:12},fg:'om4'}],['48 × LC-Duplex OS2 · 2 HE',{pc:{lc:48},fg:'os2',he:2,size:'19'}]],
 server:[['1 HE · 8 × 2,5″ · 2 × SFP28',{he:1,pc:{mgmt:1,rj45:2,sfp28:2},bays:8,baysUsed:8,bayForm:'2.5',bayDir:'v',bayRows:'1'}],['1 HE · 4 × 3,5″ · 2 × 1G',{he:1,pc:{mgmt:1,rj45:2},bays:4,baysUsed:4,bayForm:'3.5',bayDir:'h',bayRows:'1'}],['2 HE · 12 × 3,5″ · 2 × SFP+',{he:2,pc:{mgmt:1,rj45:4,sfpp:2},bays:12,baysUsed:12,bayForm:'3.5',bayDir:'h',bayRows:'3'}],['2 HE · 24 × 2,5″ · 2 × QSFP28',{he:2,pc:{mgmt:1,rj45:2,qsfp28:2},bays:24,baysUsed:24,bayForm:'2.5',bayDir:'v',bayRows:'1'}],['NAS · 4 × 3,5″ · 2 × 10G',{he:1,pc:{rj45:2},rj45Speed:'10G',role:'NAS',bays:4,baysUsed:4,bayForm:'3.5',bayDir:'h',bayRows:'1'}]],
 pdu:[['1 HE · 8 × C13 · 16 A',{size:'19',he:1,o13:8,o19:0,amp:'16'}],['1 HE · 12 × C13 + 4 × C19 · 32 A',{size:'19',he:1,o13:12,o19:4,amp:'32',pc:{mgmt:1}}],['Gemessen · 8 × C13 · 16 A',{size:'19',he:1,o13:8,o19:0,amp:'16',pc:{mgmt:1},model:'Metered'}],['10″ · 6 × C13 · 10 A',{size:'10',he:1,o13:6,o19:0,amp:'10'}]],
 ups:[['1.500 VA · 1 HE · Line-Interactive',{va:'1500',he:1,topo:'vi',size:'19'}],['3.000 VA · 2 HE · Online',{va:'3000',he:2,topo:'vfi',size:'19'}],['6.000 VA · 3 HE · Online',{va:'6000',he:3,topo:'vfi',size:'19'}],['Tower · 1.000 VA',{va:'1000',size:'frei',topo:'vi'}]],
 ap:[['Wi-Fi 6 · 1 × 1G',{pc:{rj45:1},wifi:'Wi-Fi 6',rj45Speed:'1G',poeStd:'at'}],['Wi-Fi 6E · 1 × 2,5G',{pc:{rj45:1},wifi:'Wi-Fi 6E',rj45Speed:'2.5G',poeStd:'at'}],['Wi-Fi 7 · 1 × 10G',{pc:{rj45:1},wifi:'Wi-Fi 7',rj45Speed:'10G',poeStd:'bt'}],['2 × 1G (Uplink + LAN)',{pc:{rj45:2}}]],
 host:[['PC',{sub:'pc',pc:{rj45:1},pd:false}],['Notebook',{sub:'laptop',pc:{rj45:1},pd:false}],['Drucker',{sub:'printer',pc:{rj45:1},pd:false}],['IP-Telefon · 2 Ports',{sub:'phone',pc:{rj45:2},pd:true}],['IP-Kamera',{sub:'camera',pc:{rj45:1},pd:true}]],
 rack:[['19″ · wächst mit',{rsize:'19',minHe:0}],['19″ · 12 HE',{rsize:'19',minHe:12}],['19″ · 42 HE',{rsize:'19',minHe:42}],['10″ · 6 HE',{rsize:'10',minHe:6}]],
 room:[['Serverraum',{name:'Serverraum',roomc:'blau'}],['Technikraum',{name:'Technikraum',roomc:'grau'}],['Etagenverteiler',{name:'Etagenverteiler',roomc:'violett'}],['Büro',{name:'Büro',roomc:'gruen'}]]
};
const KICON={pdu:'<rect x="2" y="7" width="16" height="6" rx="1.2"/><path d="M5 9.2v1.6M8 9.2v1.6M11 9.2v1.6M14 9.2v1.6"/>',fw:'<rect x="2" y="4" width="16" height="12" rx="1.5"/><path d="M2 8h16M2 12h16M7 4v4M13 8v4M7 12v4"/>',switch:'<rect x="2" y="6" width="16" height="8" rx="1.5"/><path d="M5 10h1.5M8.5 10H10M12 10h1.5M15 10h.5"/>',net:'<rect x="2" y="8" width="16" height="7" rx="1.5"/><path d="M6 8V3.5M14 8V4.5M5 11.5h2"/>',patch:'<rect x="2" y="6" width="16" height="8" rx="1.5"/><path d="M5 8.5v3M8 8.5v3M11 8.5v3M14 8.5v3"/>',fiber:'<rect x="2" y="6" width="16" height="8" rx="1.5"/><circle cx="6" cy="10" r="1.2"/><circle cx="10" cy="10" r="1.2"/><circle cx="14" cy="10" r="1.2"/>',server:'<rect x="3" y="3" width="14" height="6" rx="1"/><rect x="3" y="11" width="14" height="6" rx="1"/><path d="M6 6h1M6 14h1"/>',ups:'<rect x="3" y="4" width="14" height="12" rx="1.5"/><path d="M10.6 6.5 8 10.5h4l-2.6 4"/>',ap:'<circle cx="10" cy="12" r="4.5"/><path d="M4.5 6.5a8 8 0 0 1 11 0"/>',host:'<rect x="3" y="4" width="14" height="9" rx="1"/><path d="M7.5 16.5h5M10 13v3.5"/>',rack:'<rect x="4" y="2" width="12" height="16" rx="1"/><path d="M6.5 6h7M6.5 10h7M6.5 14h7"/>',room:'<rect x="2.5" y="3.5" width="15" height="13" rx="1"/><path d="M2.5 8h6"/>'};
const HICON={pc:'<rect x="4" y="5" width="36" height="24" rx="2"/><path d="M15 37h14M22 29v8"/>',laptop:'<rect x="8" y="7" width="28" height="20" rx="2"/><path d="M3 33h38l-3 4H6z"/>',printer:'<rect x="12" y="4" width="20" height="10"/><rect x="4" y="14" width="36" height="16" rx="2"/><rect x="12" y="24" width="20" height="14"/>',phone:'<rect x="6" y="18" width="32" height="20" rx="3"/><path d="M6 15c0-7 32-7 32 0v3H6z"/><path d="M15 24h2M21 24h2M27 24h2M15 31h2M21 31h2M27 31h2"/>',camera:'<rect x="4" y="10" width="28" height="14" rx="3"/><path d="M32 14l8-4v14l-8-4"/><path d="M14 24v9h12"/><circle cx="12" cy="17" r="3"/>',nas:'<rect x="10" y="4" width="24" height="34" rx="3"/><path d="M15 12h14M15 20h14M15 28h14"/>',tv:'<rect x="3" y="5" width="38" height="25" rx="2"/><path d="M14 37h16M22 30v7"/>',fw:'<rect x="4" y="8" width="36" height="28" rx="2"/><path d="M4 17h36M4 27h36M14 8v9M28 17v10M16 27v9M30 27v9"/>',iot:'<rect x="12" y="12" width="20" height="20" rx="2"/><path d="M17 12V6M22 12V6M27 12V6M17 38v-6M22 38v-6M27 38v-6M12 17H6M12 22H6M12 27H6M38 17h-6M38 22h-6M38 27h-6"/>',other:'<rect x="6" y="6" width="32" height="32" rx="6"/><path d="M18 18a4 4 0 1 1 6 3.5c-1.3.8-2 1.6-2 3v1M22 31v.5"/>'};
const LS='switch-verkabelung-v1';
const KINDP={switch:'Switches',fw:'Firewalls',net:'Netzwerkgeräte',patch:'Patchpanels',fiber:'LWL-Panels',server:'Server',ups:'USVs',pdu:'PDUs',ap:'Access Points'};
const HOSTP={pc:'PCs',laptop:'Notebooks',printer:'Drucker',phone:'IP-Telefone',camera:'IP-Kameras',nas:'NAS',tv:'Displays',iot:'IoT-Geräte',other:'Sonstige Hosts'};
const catOf=d=>d.kind==='host'?['host:'+d.sub,HOSTP[d.sub]||'Hosts']:[d.kind,KINDP[d.kind]];
const catOrder=[...Object.keys(KINDP),...HOSTS.map(h=>'host:'+h[0])];
const YEAR=new Date().getFullYear();
/* ---------- VLANs und IP-Adressen ---------- */
const VLC=['#2563eb','#16a34a','#9333ea','#db2777','#0891b2','#65a30d','#4f46e5','#0d9488','#c026d3','#b45309','#475569','#be123c'];
let HVL=new Map(),SDV=null,IPI=null;
const vlanOf=id=>state.vlans.find(v=>v.id===+id);
const vcol=id=>{const v=vlanOf(id);return v?v.color:'#8a8f96'};
const vshort=id=>{const v=vlanOf(id);return v&&v.name?`${v.id} · ${v.name}`:`VLAN ${id}`};
const vlanPort=(d,pid)=>['switch','fw','net','server'].includes(d.kind)&&!isPas(ptype(pid));
function pvlan(d,pid){if(!vlanPort(d,pid))return null;const cf=pconf(d,pid);if(cf.vm==='trunk')return {m:'trunk',nat:cf.vlan||null,tag:cf.tv||[]};return cf.vlan?{m:'access',v:cf.vlan}:null}
const vlanTxt=pv=>!pv?'':pv.m==='access'?vshort(pv.v):`Trunk${pv.nat?' · nativ '+pv.nat:''}${pv.tag.length?' · '+pv.tag.join(', '):''}`;
const ip2n=t=>{const m=/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(String(t||'').trim().split('/')[0]);if(!m)return null;const a=m.slice(1).map(Number);if(a.some(x=>x>255))return null;return a[0]*16777216+a[1]*65536+a[2]*256+a[3]};
const n2ip=n=>[Math.floor(n/16777216)%256,Math.floor(n/65536)%256,Math.floor(n/256)%256,n%256].join('.');
function cidr(t){const m=/^\s*([\d.]+)\s*\/\s*(\d{1,2})\s*$/.exec(t||'');if(!m)return null;const ip=ip2n(m[1]),b=+m[2];if(ip==null||b>32||b<8)return null;const size=2**(32-b),net=ip-ip%size,bc=net+size-1;return {net,bc,b,first:b>=31?net:net+1,last:b>=31?bc:bc-1,hosts:b>=31?size:size-2,txt:n2ip(net)+'/'+b}}
const inNet=(n,S)=>S&&n!=null&&n>=S.net&&n<=S.bc;
function vnet(v){return v&&cidr(v.subnet)}
function freeIp(v){const S=vnet(v);if(!S)return null;const used=new Set(state.devices.map(d=>ip2n(d.ip)).filter(n=>n!=null));const gw=ip2n(v.gw);for(let n=S.first;n<=S.last&&n<S.first+70000;n++)if(!used.has(n)&&n!==gw)return n2ip(n);return null}
function ipVlan(n){for(const v of state.vlans){const S=vnet(v);if(inNet(n,S))return v}return null}
const LCC={old:{c:'#f08c00',t:'#111',n:'Veraltet',w:'veraltet'},eol:{c:'#d6312b',t:'#fff',n:'EOL',w:'EOL'}};
function lcs(d){if(!d||!d.year)return null;const age=YEAR-d.year,o=+d.lifeOld||state.life.old,e=+d.lifeEol||state.life.eol;return {age,o,e,s:age>=e?'eol':age>=o?'old':'ok',oy:+d.year+o,ey:+d.year+e}}
const lcPill=d=>{const z=lcs(d);return z&&z.s!=='ok'?`<i class="lc ${z.s}">${LCC[z.s].w}</i>`:''};
const lcCount=list=>{let o=0,e=0;for(const d of list){const z=lcs(d);if(z&&z.s==='old')o++;else if(z&&z.s==='eol')e++}return (e?`<i class="lc eol">${e} EOL</i>`:'')+(o?`<i class="lc old">${o} veraltet</i>`:'')};
function lcSVG(d,L){const z=lcs(d);if(!z||z.s==='ok')return '';const C=LCC[z.s],W=L.W,Hh=L.H,txt=`${C.n} · ${d.year}`,pw=Math.round(txt.length*6.2+18);
  let s=d.rack?`<rect x="2.5" y="2.5" width="${W-5}" height="${Hh-5}" rx="3" fill="none" stroke="${C.c}" stroke-width="5"/>`:`<rect x="-5" y="-5" width="${W+10}" height="${Hh+10}" rx="${L.tower?18:12}" fill="none" stroke="${C.c}" stroke-width="5"/>`;
  let px,py;if(d.kind==='host'){px=W-pw;py=-27}else if(d.kind==='ap'){px=W/2-pw/2;py=Hh-8}else if(L.tower){px=W/2-pw/2;py=3}else{px=L.ear+10;py=Hh>=U?5:3}
  return s+`<g class="lcb"><rect x="${px}" y="${py}" width="${pw}" height="16" rx="8" fill="${C.c}" stroke="#111" stroke-opacity=".4"/><text x="${px+pw/2}" y="${py+11.6}" text-anchor="middle" font-size="10.4" font-weight="700" fill="${C.t}">${esc(txt)}</text></g>`}
/* ---------- show / hide tree ---------- */
let HIDL=new Set(),MS=new Set(),selMode=false;const openV=new Set(['rooms','racks','devs','hosts']);
function visTree(){
  const byName=(a,b)=>String(a.name).localeCompare(String(b.name),'de',{numeric:true}),leaf=o=>({id:o.id,n:o.name,o}),D=state.devices;
  const kinds=Object.keys(KINDP).map(k=>({key:'k:'+k,n:KINDP[k],kids:D.filter(d=>d.kind===k).sort(byName).map(leaf)})).filter(g=>g.kids.length);
  const hosts=HOSTS.map(([k])=>({key:'host:'+k,n:HOSTP[k],kids:D.filter(d=>d.kind==='host'&&d.sub===k).sort(byName).map(leaf)})).filter(g=>g.kids.length);
  return [{key:'rooms',n:'Räume',how:'werden transparent',kids:[...state.rooms].sort(byName).map(leaf)},{key:'racks',n:'Schränke',how:'transparent samt Inhalt',kids:[...state.racks].sort(byName).map(leaf)},{key:'devs',n:'Geräte',how:'im Schrank transparent, sonst weg',kids:kinds},{key:'hosts',n:'Hosts',how:'ganz ausgeblendet samt Kabel',kids:hosts}];
}
const leavesOf=n=>n.kids?n.kids.flatMap(leavesOf):[n.id];
function hidLeaves(T){const h=state.view.hide,C=new Set(h.cats),I=new Set(h.ids),out=new Set();
  const walk=(n,on)=>{if(n.kids){const o=on||C.has(n.key);n.kids.forEach(k=>walk(k,o))}else if(on||I.has(n.id))out.add(n.id)};(T||visTree()).forEach(n=>walk(n,false));return out}
function setHid(ids,hide,quiet){const T=visTree(),H=hidLeaves(T);for(const id of ids)hide?H.add(id):H.delete(id);
  const cats=[],out=[];const walk=n=>{if(!n.kids){if(H.has(n.id))out.push(n.id);return}const L=leavesOf(n);if(L.length&&L.every(id=>H.has(id))){cats.push(n.key);return}n.kids.forEach(walk)};
  T.forEach(walk);if(!quiet)ck('hide');state.view.hide={cats,ids:out};if(!quiet)touched()}
function findNode(T,key){for(const n of T){if(n.key===key)return n;if(n.kids&&n.kids[0]&&n.kids[0].kids!==undefined){const f=findNode(n.kids,key);if(f)return f}}return null}

/* ================= state ================= */
let state,sel=null,view={x:0,y:0,z:1},mode='plan',tmode='kabel',AN=new Map(),ISS=[],CH=[],CM=new Map(),HL=null,DL=null,hov=null,drag=null,tipKey='',askRes=null,lastRack='',raf=0,HID=new Set(),FD=new Set(),FR=new Set(),FM=new Set(),closedCats=new Set();
const H={u:[],r:[],key:null,t:0};
const store={ref:null,busy:false,pending:false,tl:0,tc:0};

const dev=id=>state.devices.find(d=>d.id===id);
const rackOf=id=>state.racks.find(r=>r.id===id);
const roomOf=id=>state.rooms.find(r=>r.id===id);
const ptype=pid=>PRE[pid[0]];
const pidx=pid=>parseInt(pid.slice(1),10);
const pconf=(d,pid)=>d.ports[pid]||{};
const total=d=>KIND[d.kind].types.reduce((a,t)=>a+(d.pc[t]||0),0);
const rackable=d=>!!KIND[d.kind].rack&&d.size!=='frei';
const pexists=(d,pid)=>{if(!d||typeof pid!=='string'||!/^[a-z]\d{1,3}$/.test(pid))return false;const t=PRE[pid[0]];if(!t||!KIND[d.kind].types.includes(t))return false;const i=pidx(pid);return i>=1&&i<=(d.pc[t]||0)};
const pspeed=(d,pid)=>{const t=ptype(pid);if(isPas(t))return null;const s=pconf(d,pid).speed;if(s&&PT[t].sp.includes(s))return s;if(t==='rj45')return PT.rj45.sp.includes(d.rj45Speed)?d.rj45Speed:'1G';return PT[t].def};
const ppoe=(d,pid)=>d.kind==='switch'&&ptype(pid)==='rj45'&&(pconf(d,pid).poe??d.poe);
const isWan=(d,pid)=>(d.kind==='net'||d.kind==='fw')&&ptype(pid)==='rj45'&&pidx(pid)<=(d.wan||0);
const pinfo=(d,pid)=>lay(d).by[pid];
function pname(d,pid){const t=ptype(pid);if(t==='mgmt')return STY[d.style].mg||'MGMT';if(isWan(d,pid))return 'WAN '+pidx(pid);if(d.kind==='ap'||d.kind==='host')return (t==='rj45'?'LAN ':'SFP+ ')+pidx(pid);const p=pinfo(d,pid);return 'Port '+(p?p.num:pidx(pid))}
const ek=e=>e.d+':'+e.p+':'+(e.s==='r'?'r':'f');
const cabOf=(d,p,s)=>CM.get(d+':'+p+':'+(s||'f'));
const pfull=e=>{const d=dev(e.d);return `${d.name} · ${pname(d,e.p)}${e.s==='r'?' (Rückseite)':''}`};
const needsPoe=d=>d.kind==='ap'||(d.kind==='host'&&d.pd);
const acol=d=>FG[d.fg].m==='sm'?(d.pol==='APC'?'#16a34a':'#1f6fd1'):d.fg==='om5'?'#9acd32':(d.fg==='om3'||d.fg==='om4')?'#19b5c9':'#d8c69e';
const heTxt=d=>'HE '+d.u+(d.he>1?'–'+(d.u+d.he-1):'');
const where=d=>{const r=d.rack&&rackOf(d.rack);return r?`${r.name}, ${heTxt(d)}`:''};
const whereAll=d=>{const rm=devRoom(d);return [where(d),rm?rm.name:''].filter(Boolean).join(' · ')};
function mkDev(kind,o){
  const base={id:'d'+rid(),kind,name:KIND[kind].n,model:'',style:KIND[kind].styles[0],x:40,y:40,size:KIND[kind].rack?'19':'frei',he:kind==='ups'?2:1,rows:'auto',pc:{},rj45Speed:'1G',poe:false,location:'',ip:'',notes:'',ports:{},cat:'cat6a',shield:true,fg:'os2',pol:'UPC',role:'',wifi:'Wi-Fi 6',poeStd:'at',sub:kind==='net'?'router':'pc',pd:false,user:'',mac:'',pnum:'col',ptag:'',bays:8,baysUsed:8,bayForm:'2.5',bayDir:'v',bayRows:'1',disks:{},raids:[],wan:kind==='fw'?1:0,year:'',lifeOld:'',lifeEol:'',watt:'',psu:'1',pa:'',pb:'',o13:8,o19:0,amp:'16',uw:'',bat:'',va:'1500',topo:'vi',rack:null,u:1};
  const pcs={pdu:{},switch:{rj45:24,sfpp:4},fw:{rj45:8,sfpp:2},net:{rj45:8,sfpp:2},patch:{kj:24},fiber:{lc:24},server:{mgmt:1,rj45:2,sfp28:2},ups:{mgmt:1},ap:{rj45:1},host:{rj45:1}};
  return Object.assign(base,{pc:{...pcs[kind]}},o||{});
}
function cableMap(){const m=new Map();for(const c of state.cables){m.set(ek(c.a),c);m.set(ek(c.b),c)}return m}
function usedPorts(d){return lay(d).ports.filter(p=>CM.has(d.id+':'+p.id+':f')||CM.has(d.id+':'+p.id+':r')).length}
function summary(d){
  if(d.kind==='host')return subLbl(d)+(d.ip?' · '+d.ip:'');
  if(d.kind==='ap')return `${d.wifi} · ${d.pc.rj45||0} × LAN`;
  if(d.kind==='server'&&d.bays){const parts=KIND[d.kind].types.filter(t=>t!=='mgmt'&&d.pc[t]).map(t=>`${d.pc[t]} × ${PT[t].n}`);const DI=diskInfo(d);return [`${d.baysUsed}/${d.bays} × ${d.bayForm.replace('.',',')}″`+(DI.total?` · ${fmtTB(DI.total)}`:''),...parts].join(' · ')+(d.size!=='frei'?` · ${d.size}″ ${d.he} HE`:'')}
  if(d.kind==='pdu')return `${d.o13} × C13${+d.o19?' + '+d.o19+' × C19':''} · ${d.amp==='3x16'?'3 × 16':d.amp} A`+(d.size!=='frei'?` · ${d.size}″ ${d.he} HE`:'');
  if(d.kind==='ups')return `${Number(d.va).toLocaleString('de-DE')} VA · ${TOPO[d.topo].s}${d.size==='frei'?' · Tower':` · ${d.he} HE`}`;
  const parts=KIND[d.kind].types.filter(t=>t!=='mgmt'&&d.pc[t]).map(t=>`${d.pc[t]} × ${t==='kj'?CAT[d.cat].n:PT[t].n}`);
  return (d.kind==='net'?subLbl(d)+' · ':'')+parts.join(' · ')+(d.size!=='frei'?` · ${d.size}″ ${d.he} HE`:'');
}
function cspec(c){const l=c.len!==''?' · '+fmtLen(c.len):'';if(c.med==='cu')return `${CAT[c.cat].n} ${c.shield}${l}`;if(c.med==='fi')return `${FG[c.fg].n} ${c.ca}/${c.cb}${FG[c.fg].m==='sm'&&c.pol==='APC'?' APC':''}${l}`;return `${MED[c.med].n}${c.med==='dac'?' '+c.dac:''}${l}`}
function autoTr(t,m,sp){const L=Object.values(TR).filter(x=>x.ff.includes(t)&&x.m===m);const f=L.find(x=>x.v===sp)||L[0];return f?f.n:''}

/* ================= racks ================= */
const U=124,TW={'10':663,'19':1260},RAIL=46,HEAD=64,FOOT=34,LC=new Map();
function rgeom(r){const devs=state.devices.filter(d=>d.rack===r.id).sort((a,b)=>a.u-b.u);let used=0,heUsed=0;for(const d of devs){used=Math.max(used,d.u+d.he-1);heUsed+=d.he}const n=r.minHe?Math.max(r.minHe,used):Math.max(used+1,2),inner=TW[r.rsize];return {W:inner+2*RAIL,H:HEAD+n*U+FOOT,n,used,heUsed,devs,inner}}
function syncRacks(){for(const d of state.devices){if(!d.rack)continue;const r=rackOf(d.rack);if(!r||!rackable(d)||(d.size==='19'&&r.rsize==='10')){d.rack=null;continue}d.x=r.x+RAIL;d.y=r.y+HEAD+(d.u-1)*U}}
function packRack(r,fixed){
  const devs=state.devices.filter(x=>x.rack===r.id&&x!==fixed).sort((a,b)=>a.u-b.u),occ=fixed?[[fixed.u,fixed.u+fixed.he-1]]:[];
  for(const d of devs){let u=Math.max(1,d.u),moved=true;while(moved){moved=false;for(const [a,b] of occ)if(u<=b&&u+d.he-1>=a){u=b+1;moved=true}}d.u=u;occ.push([u,u+d.he-1])}
}
function pushBelow(r,oldH,delta){
  const G=rgeom(r),x1=r.x-40,x2=r.x+G.W+40,yb=r.y+oldH-10,cx=r.x+G.W/2,cy=r.y+oldH/2;
  for(const d of state.devices)if(!d.rack){const L=lay(d);if(d.y>=yb&&d.x<x2&&d.x+L.W>x1)d.y+=delta}
  for(const o of state.racks)if(o!==r&&o.y>=yb&&o.x<x2&&o.x+rgeom(o).W>x1)o.y+=delta;
  for(const m of state.rooms){if(cx>=m.x&&cx<=m.x+m.w&&cy>=m.y&&cy<=m.y+m.h)m.h+=delta;else if(m.y>=yb&&m.x<x2&&m.x+m.w>x1)m.y+=delta}
}
function grow(r,fn){const before=rgeom(r).H,res=fn(),after=rgeom(r).H;if(after>before)pushBelow(r,before,after-before);return res}
function rackInsert(d,r,u){
  if(!KIND[d.kind].rack){toast('Nur Rack-Geräte lassen sich in einen Schrank einbauen');return false}
  const sz=d.size==='frei'?r.rsize:d.size;
  if(sz==='19'&&r.rsize==='10'){toast('Ein 19″-Gerät passt nicht in einen 10″-Schrank');return false}
  return grow(r,()=>{d.size=sz;if(u==null){let used=0;for(const o of state.devices)if(o.rack===r.id&&o!==d)used=Math.max(used,o.u+o.he-1);u=used+1}
    d.rack=r.id;d.u=Math.max(1,u);packRack(r,d);lastRack=r.id;return true});
}
function roomAt(x,y){let f=null;for(const m of state.rooms)if(x>=m.x&&x<=m.x+m.w&&y>=m.y&&y<=m.y+m.h)f=m;return f}
function rackRoom(r){const G=rgeom(r);return roomAt(r.x+G.W/2,r.y+Math.min(G.H/2,HEAD+U))}
function devRoom(d){if(d.rack){const r=rackOf(d.rack);if(r)return rackRoom(r)}const L=lay(d);return roomAt(d.x+L.W/2,d.y+L.H/2)}
function roomContents(rm){return {racks:state.racks.filter(r=>rackRoom(r)===rm),devs:state.devices.filter(d=>devRoom(d)===rm)}}
function computeVis(){
  const keep=new Set();
  if(HL)for(const k of HL.ports)keep.add(k.split(':')[0]);
  if(sel&&sel.kind==='dev')keep.add(sel.id);if(sel&&sel.kind==='port')keep.add(sel.dev);
  HIDL=hidLeaves();
  FM=new Set(state.rooms.filter(m=>HIDL.has(m.id)&&!(sel&&sel.kind==='room'&&sel.id===m.id)).map(m=>m.id));
  FR=new Set();for(const r of state.racks){if(sel&&sel.kind==='rack'&&sel.id===r.id)continue;const rm=rackRoom(r);if(HIDL.has(r.id)||(rm&&FM.has(rm.id)))FR.add(r.id)}
  HID=new Set();FD=new Set();
  for(const d of state.devices){if(keep.has(d.id))continue;
    if(HIDL.has(d.id)&&!d.rack){HID.add(d.id);continue}
    if(HIDL.has(d.id)||(d.rack&&FR.has(d.rack))){FD.add(d.id);continue}
    if(!d.rack){const rm=devRoom(d);if(rm&&FM.has(rm.id))FD.add(d.id)}}
}
function rackAt(x,y){for(const r of [...state.racks].reverse()){const G=rgeom(r);if(x>=r.x&&x<=r.x+G.W&&y>=r.y+HEAD-U*.5&&y<=r.y+G.H+U*.5)return r}return null}

/* ================= layout ================= */
function lay(d){
  const key=JSON.stringify([d.kind,d.style,d.size,d.he,d.rows,d.pnum,d.pc,d.wan,d.bays,d.bayForm,d.bayDir,d.bayRows]),h=LC.get(d.id);
  if(h&&h.key===key)return h.L;
  const L=d.kind==='ap'?layAp(d):d.kind==='host'?layHost(d):d.kind==='ups'&&d.size==='frei'?layTower(d):layRack(d);
  L.by=Object.fromEntries(L.ports.map(p=>[p.id,p]));LC.set(d.id,{key,L});return L;
}
function autoRows(d){const n=t=>d.pc[t]||0,tot=total(d);
  if(d.kind==='switch'||d.kind==='net'||d.kind==='fw')return n('rj45')>10||tot>12?2:1;
  if(d.kind==='patch')return n('kj')>24?2:1;
  if(d.kind==='fiber')return tot>24?2:1;
  if(d.kind==='server')return tot-n('mgmt')>3?2:1;
  return 1}
function blocks(d,rows,c,st){
  const ports=[],groups=[];let x=0,num=1,prev=null;
  for(const t of KIND[d.kind].types){
    const n=d.pc[t]||0;if(!n)continue;
    const [w,h,pitch]=PT[t].g;
    if(prev)x+=(PT[prev].ff&&PT[t].ff)||(isPas(prev)&&isPas(t))?14:26;prev=t;
    const r=rows===2&&n>1?2:1,cols=Math.ceil(n/r),pn=d.pnum||'col',gc=t==='rj45'?(rows===2?st.gc2:st.gc1):(t==='kj'||t==='lc'||t==='sc')?6:99,GG=14;
    for(let i=0;i<n;i++){const col=r===1?i:pn==='row'||pn==='rowr'?i%cols:Math.floor(i/2),row=r===1?0:pn==='row'?(i<cols?0:1):pn==='rowr'?(i<cols?1:0):pn==='colr'?1-i%2:i%2,wan=(d.kind==='net'||d.kind==='fw')&&t==='rj45'&&i<(d.wan||0);ports.push({id:PT[t].pre+(i+1),type:t,num:t==='mgmt'||wan?0:num++,lbl:wan?'WAN'+(i+1):null,x:x+col*pitch+Math.floor(col/gc)*GG,y:c[row]-h/2,w,h,row,dir:rows===2&&row===1?1:-1,nb:row===0?c[0]-19:c[1]+26})}
    for(let g=0;g*gc<cols;g++){const c1=g*gc,c2=Math.min(cols,(g+1)*gc)-1;groups.push({t,x1:x+c1*pitch+g*GG,x2:x+c2*pitch+g*GG+w})}
    x+=(cols-1)*pitch+w+Math.floor((cols-1)/gc)*GG;
  }
  return {ports,groups,w:x};
}
function bayGeom(d,Hh){const n=d.kind==='server'?+d.bays||0:0;if(!n)return null;const f=d.bayForm==='3.5',top=14,avail=Hh-28;
  if(d.bayDir==='h'){const rows=Math.min(clamp(+d.bayRows||1,1,4),n),cols=Math.ceil(n/rows),gy=5,h=(avail-(rows-1)*gy)/rows,w=f?92:64;return {n,rows,cols,w,h,gx:6,gy,W:cols*(w+6)-6,top,dir:'h'}}
  const w=f?36:26;return {n,rows:1,cols:n,w,h:avail,gx:4,gy:0,W:n*(w+4)-4,top,dir:'v'}}
function layRack(d){
  const K=KIND[d.kind],st=STY[d.style]||STY[K.styles[0]],rack=d.size!=='frei',ear=rack?18:0;
  const rows=d.rows==='1'?1:d.rows==='2'?2:autoRows(d);
  const Hh=rack?U*d.he:(rows===2||d.kind==='server'?U:86);
  const c=rows===2?[Hh/2-18,Hh/2+18]:[Hh/2,Hh/2];
  const B=blocks(d,rows,c,st),BG=bayGeom(d,Hh),bays=d.kind==='server'?(BG?BG.W:0):d.kind==='ups'?140:d.kind==='pdu'?Math.max(60,(+d.o13||0)*30+(+d.o19||0)*38-6):0;
  const need=i=>ear+i+(bays?bays+24:0)+B.w+24+ear;
  let info=K.info,over=false,W;
  if(rack){W=TW[d.size];if(need(info)>W){info=K.infoMin;if(need(info)>W){over=true;W=need(info)}}}
  else W=Math.max(need(info),ear+info+150);
  const off=W-ear-24-B.w;
  for(const p of B.ports)p.x+=off;for(const g of B.groups){g.x1+=off;g.x2+=off}
  return {W,H:Hh,rows,ports:B.ports,groups:B.groups,c,ear,info,over,rack,bx:ear+info+6,BG};
}
function layAp(d){
  const c=[24,24],B=blocks(d,1,c,STY.lancom),sw=B.w+24,W=Math.max(200,sw+24),sx=(W-sw)/2;
  for(const p of B.ports)p.x+=sx+12;
  return {W,H:200,rows:1,ports:B.ports,groups:[],c,ear:0,noNum:true,sx,sw,cy:124};
}
function layHost(d){
  const c=[24,24],B=blocks(d,1,c,STY.host);
  for(const p of B.ports){p.x+=14;p.nb=49}
  return {W:Math.max(236,14+B.w+124),H:118,rows:1,ports:B.ports,groups:[],c,ear:0,noNum:B.ports.length<2,pw:B.w};
}
function layTower(d){
  const W=200,Hh=340,c=[Hh-40,Hh-40],B=blocks(d,1,c,STY[d.style]);
  for(const p of B.ports){p.x+=(W-B.w)/2;p.dir=1;p.nb=p.y+p.h+14}
  return {W,H:Hh,rows:1,ports:B.ports,groups:[],c,ear:0,tower:true};
}

/* ================= drawing ================= */
function defsSVG(){return Object.values(STY).map(s=>`<linearGradient id="g-${s.key}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.g[0]}"/><stop offset="1" stop-color="${s.g[1]}"/></linearGradient>`).join('')+'<linearGradient id="g-apw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e4e7eb"/></linearGradient>'}
const halo=(x,y,w,h,rx)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="#111" stroke-width="9"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="#ffe600" stroke-width="5.5"/>`;
function hole(p){const x=p.x+3.5,w=p.w-7,cx=p.x+p.w/2,n=4,nw=6,y=p.y+3.5,yb=p.y+p.h-3.5;
  return p.dir<0?`M${x} ${y+n}H${cx-nw}V${y}H${cx+nw}V${y+n}H${x+w}V${yb}H${x}Z`:`M${x} ${y}H${x+w}V${yb-n}H${cx+nw}V${yb}H${cx-nw}V${yb-n}H${x}Z`}
function bolt(x,y){return `<path d="M${x+3.4} ${y}L${x} ${y+5}h2.5L${x+1.6} ${y+9}L${x+5.2} ${y+3.6}h-2.5Z" fill="#f59e0b"/>`}
function iconSVG(sub,x,y){return `<g transform="translate(${x} ${y})" fill="none" stroke="#1d2126" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${HICON[sub]||HICON.other}</g>`}
function lcdSVG(d,st,x,y,w,h){const va=Number(d.va).toLocaleString('de-DE');return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${st.lcd}" stroke="#000" stroke-opacity=".5"/><text x="${x+12}" y="${y+h/2-2}" font-size="${h>50?18:15}" font-weight="700" fill="${st.lcdT}">${va} VA</text><text x="${x+12}" y="${y+h/2+15}" font-size="11" fill="${st.lcdT}" opacity=".8">${(P=>P&&P.load?`Last ${Math.round(P.pct)} %${P.min!=null?' · '+P.min+' min':''}`:TOPO[d.topo].s)(PW.get(d.id))}</text>`}
function infoSVG(d,st,L){
  const x=L.ear,Hh=L.H,cmp=L.info<140,big=Hh>=U,y0=big?34:28,sz=L.rack?`${d.size}″ · ${d.he} HE`:'',used=usedPorts(d),tot=total(d);
  if(d.kind==='pdu'){const P=PW.get(d.id),a=P?P.load/230:0;let s=`<rect x="${x+14}" y="${Hh/2-17}" width="58" height="34" rx="4" fill="#0b0f0a" stroke="#000"/><text x="${x+66}" y="${Hh/2+7}" text-anchor="end" font-size="17" font-weight="700" fill="#ff5a3c" font-family="monospace">${a.toFixed(1)}</text><text x="${x+80}" y="${Hh/2-4}" font-size="13" font-weight="700" fill="${st.text}">${esc(trunc(d.name,cmp?9:13))}</text><text x="${x+80}" y="${Hh/2+12}" font-size="10.5" fill="${st.sub}">${d.amp==='3x16'?'3 × 16':d.amp} A${P?' · '+Math.round(P.pct)+' %':''}</text>`;return s}
  if(d.kind==='ups'){const lh=Math.min(56,Hh-68);let s=lcdSVG(d,st,x+14,14,L.info-58,lh);s+=`<circle cx="${x+L.info-24}" cy="${14+lh/2}" r="10" fill="none" stroke="${st.text}" stroke-width="2" opacity=".85"/><path d="M${x+L.info-24} ${14+lh/2-6}v5" stroke="${st.acc}" stroke-width="2.4" stroke-linecap="round"/><text x="${x+14}" y="${14+lh+22}" font-size="14" font-weight="700" fill="${st.text}">${esc(trunc(d.name,cmp?16:22))}</text>`;const l2=[d.model,d.ip,sz].filter(Boolean)[0];if(l2&&Hh-(14+lh+22)>26)s+=`<text x="${x+14}" y="${14+lh+38}" font-size="11" fill="${st.sub}">${esc(trunc(l2,26))}</text>`;return s}
  let lines=d.kind==='switch'?[d.model,d.ip,sz]:d.kind==='fw'?[d.model||(d.wan?d.wan+' × WAN':''),d.ip,sz]:d.kind==='net'?[subLbl(d)+(d.model?' · '+d.model:''),d.ip,sz]:d.kind==='patch'?[CAT[d.cat].n+(d.shield?' · geschirmt':' · ungeschirmt'),d.model,sz]:d.kind==='fiber'?['LWL '+FG[d.fg].n+(FG[d.fg].m==='sm'?' · '+d.pol:''),d.model,sz]:[d.role||d.model,d.ip,sz];
  lines=lines.filter(Boolean);
  const nmax=cmp?12:18,smax=cmp?16:26;
  if((d.kind==='switch'||d.kind==='net')&&st.key==='unifi'){const l2=d.ip||d.model;return `<rect x="${x+12}" y="12" width="${L.info-24}" height="${Hh-24}" rx="6" fill="#121417" stroke="#000" stroke-opacity=".3"/><text x="${x+24}" y="${big?34:30}" font-size="13" font-weight="700" fill="#f4f6f8">${esc(trunc(d.name,cmp?11:17))}</text>${d.kind==='net'?`<text x="${x+24}" y="${big?51:46}" font-size="11" fill="#9aa3ad">${esc(subLbl(d))}</text>`:l2?`<text x="${x+24}" y="${big?51:46}" font-size="11" fill="${d.ip?'#8db4ff':'#9aa3ad'}">${esc(trunc(l2,smax))}</text>`:''}${sz&&big?`<text x="${x+24}" y="66" font-size="10.5" fill="#9aa3ad">${d.kind==='net'&&d.ip?esc(d.ip):sz}</text>`:''}<text x="${x+24}" y="${Hh-23}" font-size="10.5" fill="#9aa3ad">${used}/${tot} belegt</text>`}
  let s='';
  if(st.key==='hp')s+=`<rect x="${x}" y="1" width="${L.info-6}" height="${Hh-2}" fill="${st.panel}"/><rect x="${x+L.info-6}" y="1" width="1" height="${Hh-2}" fill="#000" opacity=".22"/>`;
  const DI=d.kind==='server'&&d.bays?diskInfo(d):null,tt=DI&&DI.total?fmtTB(DI.total):'';
  s+=`<text x="${x+14}" y="${y0}" font-size="${cmp?13:15}" font-weight="700" fill="${st.text}">${esc(trunc(d.name,tt?Math.max(5,nmax-tt.length-2):nmax))}${tt?`<tspan fill="${st.sub}" font-weight="600" font-size="${cmp?11.5:13}"> · ${tt}</tspan>`:''}${DI&&DI.pend.length?`<tspan fill="#ffe600" font-weight="800"> !</tspan>`:''}</text>`;
  lines.slice(0,big?3:2).forEach((t,i)=>{s+=`<text x="${x+14}" y="${y0+18+i*15}" font-size="11" fill="${st.sub}">${esc(trunc(t,smax))}</text>`});
  const ly=big?Hh-19:Hh-12;
  if(d.kind==='server')s+=`<circle cx="${x+22}" cy="${ly-2}" r="6.5" fill="none" stroke="${st.text}" stroke-width="1.6" opacity=".85"/><path d="M${x+22} ${ly-7}v4" stroke="${st.acc}" stroke-width="2" stroke-linecap="round"/><rect x="${x+36}" y="${ly-4}" width="9" height="5" rx="1" fill="${st.acc}"/><text x="${x+50}" y="${ly}" font-size="9.5" fill="${st.sub}">UID</text>`;
  else if(d.kind==='switch'||d.kind==='net'){
    if(st.key==='hp')s+=[['Pwr','#3ddc6a'],['Flt',''],[d.kind==='net'?'WAN':'PoE',d.kind==='net'?'#3ddc6a':d.poe?'#f59e0b':'']].map(([t,c],i)=>`<rect x="${x+14+i*44}" y="${ly-3}" width="9" height="5" rx="1" fill="${c||st.offC}"/><text x="${x+27+i*44}" y="${ly+2}" font-size="9.5" fill="${st.sub}">${t}</text>`).join('');
    else if(st.key==='fs'){if(big)s+=['CON','MGMT'].map((t,i)=>`<rect x="${x+14+i*34}" y="${ly-15}" width="24" height="17" rx="1.5" fill="${st.jack}" stroke="${st.jackEdge}" stroke-width=".8"/><rect x="${x+18+i*34}" y="${ly-11}" width="16" height="10" rx="1" fill="${st.hole}"/><text x="${x+26+i*34}" y="${ly+10}" text-anchor="middle" font-size="8.5" fill="${st.sub}">${t}</text>`).join('')+`<circle cx="${x+92}" cy="${ly-7}" r="2.8" fill="#3ddc6a"/><text x="${x+98}" y="${ly-4}" font-size="8.5" fill="${st.sub}">SYS</text>`;else s+=`<circle cx="${x+19}" cy="${ly}" r="3" fill="#3ddc6a"/><text x="${x+27}" y="${ly+3.4}" font-size="9.5" fill="${st.sub}">SYS</text>`}
    else s+=`<circle cx="${x+19}" cy="${ly}" r="3" fill="#4d9dff"/><text x="${x+27}" y="${ly+3.4}" font-size="9.5" fill="${st.sub}">Power</text><circle cx="${x+70}" cy="${ly}" r="3" fill="${used?'#2fd06b':st.offC}"/><text x="${x+78}" y="${ly+3.4}" font-size="9.5" fill="${st.sub}">${d.kind==='net'?'VPN':'Online'}</text>`;
  }
  else if(d.kind==='fw'){
    const ac=st.acc||'#4d9dff';
    s+=[['PWR','#3ddc6a'],['HA',''],['ALM','']].map(([t,c],i)=>`<rect x="${x+14+i*44}" y="${ly-3}" width="9" height="5" rx="1" fill="${c||st.offC}"/><text x="${x+27+i*44}" y="${ly+2}" font-size="9.5" fill="${st.sub}">${t}</text>`).join('');
    if(st.fa==='bar')s+=`<rect x="${x+4}" y="12" width="4" height="${Hh-24}" rx="2" fill="${ac}"/>`;
    if(st.fa==='dot')s+=`<rect x="${x+L.info-28}" y="12" width="14" height="14" rx="2" fill="${ac}"/>`;
  }
  if(st.key==='lancom'||st.key==='fs')s+=`<rect x="${x+L.info-8}" y="12" width="1" height="${Hh-24}" fill="#fff" opacity=".08"/>`;
  return s;
}
function baysSVG(d,st,L){
  const x0=L.bx,Hh=L.H;let s='';
  if(d.kind==='pdu'){const P=PW.get(d.id),used=P?P.plugs:0,cy=Hh/2;let x=x0,i=0;
    for(const [n,w,h] of [[+d.o13||0,24,20],[+d.o19||0,32,24]])for(let k=0;k<n;k++,i++){const on=i<used,y=cy-h/2;s+=`<g><path d="M${x+3} ${y}h${w-6}l3 4v${h-8}l-3 4h-${w-6}l-3-4v-${h-8}z" fill="#111" stroke="${st.sub}" stroke-opacity=".5"/>${on?`<rect x="${x+2}" y="${y+2}" width="${w-4}" height="${h-4}" rx="2" fill="#2b2f36" stroke="#000"/><rect x="${x+w/2-3}" y="${y+h-1}" width="6" height="${Hh-y-h-4}" fill="#1d1f22"/>`:`<rect x="${x+w*.3-1.5}" y="${y+h/2-3}" width="3" height="6" rx="1" fill="#444"/><rect x="${x+w*.7-1.5}" y="${y+h/2-3}" width="3" height="6" rx="1" fill="#444"/><rect x="${x+w/2-1.5}" y="${y+3}" width="3" height="4" rx="1" fill="#444"/>`}</g>`;x+=w+6}
    return s}
  if(d.kind==='ups'){const y1=Hh*.22,h=Hh*.56;for(let i=0;i<9;i++)s+=`<rect x="${x0+6+i*15}" y="${y1.toFixed(1)}" width="7" height="${h.toFixed(1)}" rx="3.5" fill="${st.grille}"/>`;return s}
  const G=L.BG;if(!G)return s;const used=clamp(+d.baysUsed||0,0,G.n),DI=diskInfo(d),ed=raidEdit&&raidEdit.dev===d.id,showR=ed||SDV===d.id;
  for(let i=0;i<G.n;i++){const row=Math.floor(i/G.cols),col=i%G.cols,x=x0+col*(G.w+G.gx),y=G.top+row*(G.h+G.gy),w=G.w,h=G.h,on=i<used,X=on?DI.list[i]:null,sz=X&&X.o.c?fmtCap(X.o)+' '+X.t:'',rg=on&&raidOf(d,i),warn=X&&X.out&&!X.ok;
    s+=`<g class="bay" data-bay="${i}">`;
    if(!on){s+=`<rect x="${x}" y="${y.toFixed(1)}" width="${w}" height="${h.toFixed(1)}" rx="2" fill="#000" fill-opacity=".38" stroke="${st.sub}" stroke-opacity=".35" stroke-dasharray="3 2.5"/>`;
      const n=G.dir==='v'?Math.max(2,Math.floor(h/14)):Math.max(1,Math.floor(h/9));for(let k=0;k<n;k++){if(G.dir==='v')s+=`<rect x="${x+w/2-4}" y="${(y+8+k*(h-16)/Math.max(1,n-1)-1).toFixed(1)}" width="8" height="2" rx="1" fill="${st.sub}" opacity=".25"/>`;else s+=`<rect x="${x+10}" y="${(y+h/2-(n-1)*4.5+k*9-1).toFixed(1)}" width="${w-20}" height="2" rx="1" fill="${st.sub}" opacity=".22"/>`}
      s+='</g>';continue}
    s+=`<rect x="${x}" y="${y.toFixed(1)}" width="${w}" height="${h.toFixed(1)}" rx="2" fill="${st.bay}" stroke="#000" stroke-opacity=".45"/>`;
    if(G.dir==='v'){s+=`<rect x="${x+5}" y="${y+5}" width="${w-10}" height="5" rx="1.5" fill="${st.sub}" opacity=".45"/><rect x="${x+w/2-3}" y="${(y+h-9).toFixed(1)}" width="6" height="3" rx="1" fill="${st.bayLed}"/>`;
      if(sz&&h>44)s+=`<text transform="translate(${x+w/2+3.4} ${(y+h/2+2).toFixed(1)}) rotate(-90)" text-anchor="middle" font-size="9.5" font-weight="600" fill="${st.text}" opacity=".9">${esc(trunc(sz,Math.floor((h-24)/5.4)))}</text>`}
    else{const ly=(y+h/2).toFixed(1);s+=`<circle cx="${x+w-9}" cy="${ly}" r="2.6" fill="${st.bayLed}"/>`;
      if(sz&&h>=11)s+=`<text x="${x+7}" y="${(y+h/2+3.4).toFixed(1)}" font-size="${h>=20?10:8.5}" font-weight="600" fill="${st.text}" opacity=".9">${esc(trunc(sz,Math.floor((w-22)/5.3)))}</text>`;
      else s+=`<rect x="${x+8}" y="${(y+h/2-2.5).toFixed(1)}" width="${Math.round(w*.55)}" height="5" rx="2" fill="${st.sub}" opacity=".45"/>`}
    if(rg&&showR)s+=`<rect x="${x+1.5}" y="${(y+1.5).toFixed(1)}" width="${w-3}" height="${(h-3).toFixed(1)}" rx="2" fill="none" stroke="${RAIDC[rg.col%RAIDC.length]}" stroke-width="3.2"/>`;
    if(warn)s+=`<rect x="${x-1}" y="${(y-1).toFixed(1)}" width="${w+2}" height="${(h+2).toFixed(1)}" rx="3" fill="#ffe600" fill-opacity=".28" stroke="#ffe600" stroke-width="3"/>`;
    if(ed)s+=`<g><rect x="${x+w/2-9}" y="${(y+h/2-8).toFixed(1)}" width="18" height="16" rx="4" fill="${rg?RAIDC[rg.col%RAIDC.length]:'#111'}" stroke="#fff" stroke-width="1"/><text x="${x+w/2}" y="${(y+h/2+4).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff">${i+1}</text></g>`;
    s+='</g>'}
  return s;
}
function rackSVG(d,st,L){
  const W=L.W,Hh=L.H,E=L.ear;let s='';
  if(E)for(const ex of [0,W-E]){s+=`<rect x="${ex}" y="0" width="${E}" height="${Hh}" rx="3" fill="${st.ear}" stroke="${st.stroke}"/>`;for(let i=0;i<(L.rack?d.he:1);i++)s+=`<rect x="${ex+E/2-3.5}" y="${i*U+13}" width="7" height="13" rx="3.5" fill="${st.earHole}"/><rect x="${ex+E/2-3.5}" y="${i*U+U-26}" width="7" height="13" rx="3.5" fill="${st.earHole}"/>`}
  s+=`<rect x="${E-.5}" y="0" width="${W-2*E+1}" height="${Hh}" rx="${E?2:7}" fill="url(#g-${st.key})" stroke="${st.stroke}"/><rect x="${E+2}" y="1" width="${W-2*E-4}" height="1.4" fill="#fff" opacity="${st.hi}"/><rect x="${E+2}" y="${Hh-2.4}" width="${W-2*E-4}" height="1.4" fill="#000" opacity=".2"/>`;
  if(d.kind==='fw'&&st.fa==='stripe')s+=`<rect x="${E+2}" y="2.4" width="${W-2*E-4}" height="4" fill="${st.acc}"/>`;
  s+=infoSVG(d,st,L);
  if(d.kind==='server'||d.kind==='ups'||d.kind==='pdu')s+=baysSVG(d,st,L);
  if(d.kind==='server'&&L.ports.length){const x1=Math.min(...L.ports.map(p=>p.x))-10,x2=Math.max(...L.ports.map(p=>p.x+p.w))+10,y1=L.c[0]-34,y2=L.rows===2?L.c[1]+34:L.c[0]+24;s+=`<rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" rx="5" fill="#000" opacity=".24"/>`}
  const fy1=L.c[0]-33,fy2=L.rows===2?L.c[1]+32:L.c[0]+25;
  for(const g of L.groups){if(st.fm==='fill')s+=`<rect x="${g.x1-5}" y="${fy1}" width="${g.x2-g.x1+10}" height="${fy2-fy1}" rx="4" fill="${st.frame}"/>`;else if(st.fm==='line')s+=`<rect x="${g.x1-6}" y="${fy1}" width="${g.x2-g.x1+12}" height="${fy2-fy1}" rx="3" fill="none" stroke="${st.frame}" stroke-opacity=".6"/>`}
  return s;
}
function towerSVG(d,st,L){
  const W=L.W,Hh=L.H;let s=`<rect x="0" y="0" width="${W}" height="${Hh}" rx="14" fill="url(#g-${st.key})" stroke="${st.stroke}"/><rect x="8" y="2" width="${W-16}" height="1.4" fill="#fff" opacity="${st.hi}"/>`;
  s+=lcdSVG(d,st,18,20,W-36,64);
  s+=`<text x="${W/2}" y="112" text-anchor="middle" font-size="14" font-weight="700" fill="${st.text}">${esc(trunc(d.name,18))}</text>${d.model?`<text x="${W/2}" y="128" text-anchor="middle" font-size="11" fill="${st.sub}">${esc(trunc(d.model,24))}</text>`:''}`;
  s+=`<circle cx="${W/2}" cy="158" r="12" fill="none" stroke="${st.text}" stroke-width="2" opacity=".85"/><path d="M${W/2} 150v6" stroke="${st.acc}" stroke-width="2.4" stroke-linecap="round"/>`;
  for(let i=0;i<8;i++)s+=`<rect x="26" y="${186+i*12}" width="${W-52}" height="5" rx="2.5" fill="${st.grille}"/>`;
  if(L.ports.length)s+=`<rect x="${W/2-40}" y="${Hh-64}" width="80" height="54" rx="6" fill="#000" opacity=".25"/>`;
  return s;
}
function linked(d){return lay(d).ports.some(p=>{const c=cabOf(d.id,p.id,'f');if(!c)return false;const i=AN.get(c.id);return i&&!i.nolink&&i.speed})}
function apSVG(d,L){
  const cx=L.W/2,cy=L.cy,on=linked(d),sq=d.style!=='unifi',rx=d.style==='aruba'?30:16;
  let s=`<rect x="${cx-6}" y="40" width="12" height="${cy-66-36}" fill="#2b2f36"/><rect x="${L.sx}" y="4" width="${L.sw}" height="40" rx="8" fill="#2b2f36" stroke="#15181c"/>`;
  s+=sq?`<rect x="${cx-59}" y="${cy-56}" width="128" height="128" rx="${rx}" fill="#000" opacity=".14"/><rect x="${cx-64}" y="${cy-64}" width="128" height="128" rx="${rx}" fill="url(#g-apw)" stroke="#b9bfc6"/>`:`<circle cx="${cx+5}" cy="${cy+8}" r="66" fill="#000" opacity=".14"/><circle cx="${cx}" cy="${cy}" r="66" fill="url(#g-apw)" stroke="#b9bfc6"/>`;
  if(d.style==='unifi')s+=`<circle cx="${cx}" cy="${cy}" r="55" fill="none" stroke="${on?'#4aa8ff':'#d3d8de'}" stroke-width="3"/>`;
  else if(d.style==='lancom')s+=`<rect x="${cx-16}" y="${cy+46}" width="32" height="4" rx="2" fill="${on?'#4d9dff':'#d3d8de'}"/>`;
  else s+=`<circle cx="${cx+38}" cy="${cy-38}" r="4.5" fill="${on?'#3ddc6a':'#d3d8de'}"/>`;
  s+=`<text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="13" font-weight="700" fill="#1d2126">${esc(trunc(d.name,15))}</text><text x="${cx}" y="${cy+13}" text-anchor="middle" font-size="11" fill="#5b626b">${esc(d.wifi)} · PoE${d.poeStd==='af'?'':d.poeStd==='at'?'+':'++'}</text>${d.ip?`<text x="${cx}" y="${cy+28}" text-anchor="middle" font-size="10.5" fill="#6b7280">${esc(trunc(d.ip,18))}</text>`:''}`;
  return s;
}
function hostSVG(d,L){
  const W=L.W,Hh=L.H,hn=subLbl(d);
  const hv=HVL.get(d.id),vc=hv?vcol(hv):null;
  let s=`<rect x="0" y="0" width="${W}" height="${Hh}" rx="10" fill="#fbfbf9" stroke="${vc||'#a3a8ae'}" stroke-width="${vc?2.6:1}"/>${vc?`<path d="M10 0H0V${Hh}h10z" fill="none"/><rect x="0" y="0" width="9" height="${Hh}" rx="4" fill="${vc}"/>`:''}<rect x="${vc?12:6}" y="5" width="${vc?L.pw+14:L.pw+16}" height="38" rx="7" fill="#e3e6ea"/>`;
  if(vc){const vt=trunc(vshort(hv),18),vw=vt.length*6+14;s+=`<rect x="${W-12-vw}" y="7" width="${vw}" height="16" rx="8" fill="${vc}"/><text x="${W-12-vw/2}" y="18.6" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">${esc(vt)}</text><text x="${W-12}" y="38" text-anchor="end" font-size="10.5" font-weight="600" fill="#5b626b">${esc(hn)}</text>`;if(d.pd)s+=bolt(W-12-hn.length*5.9-11,29.5)}
  else{s+=`<text x="${W-12}" y="27" text-anchor="end" font-size="11" font-weight="600" fill="#5b626b">${esc(hn)}</text>`;if(d.pd)s+=bolt(W-12-hn.length*6.3-11,18.5)}
  s+=iconSVG(d.sub,14,58);
  s+=`<text x="72" y="76" font-size="14" font-weight="700" fill="#16191d">${esc(trunc(d.name,Math.floor((W-84)/8)))}</text>`;
  if(d.ip)s+=`<text x="72" y="93" font-size="12" fill="#3d4249">${esc(trunc(d.ip,24))}</text>`;
  const l3=d.user||d.mac;if(l3)s+=`<text x="72" y="${d.ip?108:93}" font-size="11" fill="#6b7280">${esc(trunc(l3,Math.floor((W-84)/6.4)))}</text>`;
  return s;
}
function wrap2(t,n){const w=String(t).trim().split(/\s+/);let a='',i=0;while(i<w.length&&(a?a.length+1+w[i].length:w[i].length)<=n){a=a?a+' '+w[i]:w[i];i++}if(!a){return [trunc(t,n)]}const b=w.slice(i).join(' ');return b?[a,trunc(b,n)]:[a]}
function portSVG(d,p,st,L,o){
  const t=p.type,pas=isPas(t),k=d.id+':'+p.id,cF=CM.get(k+':f'),cR=CM.get(k+':r'),c=cF||cR,cf=d.ports[p.id]||{};
  const off=!pas&&!!cf.off,inf=c?AN.get(c.id):null,on=!!(c&&!off&&inf&&!inf.nolink&&inf.speed),lc=on?SP[inf.speed].c:null,poe=ppoe(d,p.id),free=pas?(!cF||!cR):!c,cx=p.x+p.w/2;
  let s=`<g class="port ${free?'free':'used'}" data-port="${p.id}"><rect class="ph" x="${p.x-3}" y="${p.y-3}" width="${p.w+6}" height="${p.h+6}" rx="4" fill="transparent"/>`;
  const me=o.selPort===p.id,hl=o.hl&&o.hl.ports.has(k);
  if(me||hl)s+=`<rect x="${p.x-5.5}" y="${p.y-5.5}" width="${p.w+11}" height="${p.h+11}" rx="5" fill="#ffe600" stroke="#111" stroke-width="${me?3:1.6}"/>`;
  if(t==='rj45'||t==='mgmt'){
    s+=`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="2" fill="${st.jack}" stroke="${st.jackEdge}" stroke-width=".8"/><path d="${hole(p)}" fill="${st.hole}"/>`;
    if(st.led==='bar'){const by=p.dir<0?p.y-3.6:p.y+p.h+1.6;s+=`<rect x="${p.x+5}" y="${by}" width="${p.w-10}" height="2" rx="1" fill="${lc||st.offC}"/>`}
    else{const ly=p.dir<0?p.y+.9:p.y+p.h-3.9;s+=`<rect x="${p.x+4}" y="${ly}" width="6.5" height="3" rx=".8" fill="${lc||st.offJ}"/><rect x="${p.x+p.w-10.5}" y="${ly}" width="6.5" height="3" rx=".8" fill="${on&&poe?'#f59e0b':st.offJ}"/>`}
  }else if(t==='kj'){
    s+=`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="2" fill="${st.ks||'#1e2124'}" stroke="#000" stroke-width=".8"/><path d="${hole(p)}" fill="#050506"/><rect x="${p.x+3}" y="${p.dir<0?p.y+p.h-2.4:p.y+1}" width="${p.w-6}" height="1.4" fill="#fff" opacity=".12"/>`;
  }else if(PT[t].ff){
    const q=PT[t].ff==='q';
    s+=`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="1.5" fill="${st.cage}" stroke="${st.jackEdge}" stroke-width=".8"/><rect x="${p.x+(q?3:2.5)}" y="${p.y+(q?3:2.5)}" width="${p.w-(q?6:5)}" height="${p.h-(q?6:5)}" rx="1" fill="${st.hole}"/>`;
    if(st.led==='bar')s+=`<rect x="${p.x+5}" y="${p.dir<0?p.y+p.h+2:p.y-4}" width="${p.w-10}" height="2" rx="1" fill="${lc||st.offC}"/>`;
    else s+=`<rect x="${p.x+3}" y="${p.dir<0?p.y+p.h+2.5:p.y-5}" width="8" height="2.6" rx=".8" fill="${lc||st.offC}"/>`;
  }else{
    s+=`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="2" fill="${acol(d)}" stroke="#000" stroke-opacity=".45"/>`;
    if(t==='lc')s+=`<rect x="${p.x+4}" y="${p.y+6}" width="7" height="8" rx="1" fill="#111"/><rect x="${p.x+p.w-11}" y="${p.y+6}" width="7" height="8" rx="1" fill="#111"/>`;
    else if(t==='sc')s+=`<rect x="${p.x+6.5}" y="${p.y+7}" width="9" height="10" rx="1" fill="#111"/>`;
    else s+=`<rect x="${p.x+5}" y="${p.y+p.h/2-2.5}" width="${p.w-10}" height="5" rx="1" fill="#111"/>`;
  }
  if(SDV===d.id){const pv=pvlan(d,p.id);if(pv){if(pv.m==='access')s+=`<rect class="vmk" x="${p.x-2.5}" y="${p.y-2.5}" width="${p.w+5}" height="${p.h+5}" rx="3.5" fill="none" stroke="${vcol(pv.v)}" stroke-width="3.4"/>`;
    else{const T=[...(pv.nat?[pv.nat]:[]),...pv.tag.filter(v=>v!==pv.nat)],sw=(p.w+5)/Math.max(1,T.length),by=p.dir<0?p.y+p.h+3:p.y-7;s+=`<rect class="vmk" x="${p.x-2.5}" y="${p.y-2.5}" width="${p.w+5}" height="${p.h+5}" rx="3.5" fill="none" stroke="#111" stroke-width="1.6" stroke-dasharray="3 2"/>`+T.map((v,i)=>`<rect x="${(p.x-2.5+i*sw).toFixed(1)}" y="${by}" width="${sw.toFixed(1)}" height="4" fill="${vcol(v)}"/>`).join('')}}}
  if(cR&&(HID.has(cR.a.d)||HID.has(cR.b.d)))s+=`<circle cx="${p.x+p.w-1}" cy="${p.y+1}" r="5" fill="${ccolor(cR,AN.get(cR.id))}" stroke="#111" stroke-width="1.4"/>`;
  else if(!pas&&cF&&(HID.has(cF.a.d)||HID.has(cF.b.d)))s+=`<circle cx="${p.x+p.w-1}" cy="${p.y+1}" r="4" fill="#fff" stroke="#111" stroke-width="1.4"/>`;
  if(off)s+=`<path d="M${p.x+3} ${p.y+p.h-3}L${p.x+p.w-3} ${p.y+3}" stroke="#d0342c" stroke-width="2.2" stroke-linecap="round"/>`;
  return s+'</g>';
}
/* Nummern und Beschriftungsfelder liegen in einer eigenen Ebene über den Kabeln */
function portTop(d,p,st,L){
  const t=p.type,pas=isPas(t),cf=d.ports[p.id]||{},poe=ppoe(d,p.id),cx=p.x+p.w/2,nh=`stroke="${(st.g||['#fff','#fff'])[1]}" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke"`;let s='';
  if(pas&&cf.label&&!L.noNum){const fw=PT[t].g[2]-3,fx=cx-fw/2,two=L.two??(L.two=L.ports.some(q=>q.row===1)),ln=two?[trunc(cf.label,16)]:wrap2(cf.label,12),fh=ln.length*7.4+3,fy=p.dir<0?Math.max(1.5,p.nb-12-fh):p.nb+3;
    s+=`<g class="plab" data-port="${p.id}"><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="1.5" fill="#ffffff" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>${ln.map((l,i)=>{const tw=l.length*3.35,sq=tw>fw-3?` textLength="${fw-3}" lengthAdjust="spacingAndGlyphs"`:'';return `<text x="${cx}" y="${fy+7.6+i*7.4}" text-anchor="middle" font-size="6.6" font-weight="600" fill="#111"${sq}>${esc(l)}</text>`}).join('')}</g>`}
  if(!L.noNum){const nt=p.lbl||(t==='mgmt'?(STY[d.style].mg||'MGMT'):String(p.num)),ny=p.nb+(p.dir<0?-(st.nbo||0):(st.nbo||0));s+=`<text x="${cx}" y="${ny}" text-anchor="middle" font-size="${t==='mgmt'||p.lbl?9.5:10.5}" font-weight="${p.lbl?800:600}" fill="${p.lbl?'#f59e0b':st.num}" ${nh}>${nt}</text>`;if(poe)s+=bolt(cx-nt.length*3.1-8,ny-8.4)}
  return s;
}
function numSVG(d,o){
  if(HID.has(d.id))return '';const L=lay(d);if(L.noNum&&!L.ports.some(p=>isPas(p.type)&&pconf(d,p.id).label))return '';
  const st=d.kind==='ap'?STY.lancom:d.kind==='host'?STY.host:(STY[d.style]||STY[KIND[d.kind].styles[0]]);
  const inner=L.ports.map(p=>portTop(d,p,st,L,o)).join('');
  return inner?`<g class="dnum${FD.has(d.id)?' fade':''}" data-dev="${d.id}" transform="translate(${d.x} ${d.y})">${inner}</g>`:'';
}
function devSVG(d,o){
  const L=lay(d),W=L.W,Hh=L.H,st=STY[d.style]||STY[KIND[d.kind].styles[0]];
  if(HID.has(d.id))return '';
  let s=`<g class="dev${FD.has(d.id)?' fade':''}" data-dev="${d.id}" transform="translate(${d.x} ${d.y})">`;
  if(o.sel)s+=halo(-7,-7,W+14,Hh+14,12);
  if(d.kind!=='ap'&&!d.rack)s+=`<rect x="6" y="10" width="${W}" height="${Hh}" rx="${L.tower?14:7}" fill="#000" opacity=".16"/>`;
  s+=d.kind==='ap'?apSVG(d,L):d.kind==='host'?hostSVG(d,L):L.tower?towerSVG(d,st,L):rackSVG(d,st,L);
  s+=lcSVG(d,L);
  const pst=d.kind==='ap'?STY.lancom:d.kind==='host'?STY.host:st;
  for(const p of L.ports)s+=portSVG(d,p,pst,L,o);
  return s+'</g>';
}
function rackFrameSVG(r,o){
  const G=rgeom(r),p=RPAL[r.rcolor]||RPAL.schwarz,W=G.W,Hh=G.H;
  let s=`<g class="rack${FR.has(r.id)?' fade':''}" data-rack="${r.id}" transform="translate(${r.x} ${r.y})">`;
  if(o.sel)s+=halo(-8,-8,W+16,Hh+16,14);
  s+=`<rect x="8" y="12" width="${W}" height="${Hh}" rx="10" fill="#000" opacity=".18"/><rect x="0" y="0" width="${W}" height="${Hh}" rx="10" fill="${p.f}" stroke="#000" stroke-opacity=".55"/><rect x="6" y="6" width="${W-12}" height="${HEAD-12}" rx="6" fill="${p.f2}"/>`;
  s+=`<text x="26" y="44" font-size="30" font-weight="700" fill="${p.txt}">${esc(trunc(r.name,40))}</text><text x="${W-26}" y="42" text-anchor="end" font-size="17" fill="${p.sub}">${r.rsize}″ · ${G.n} HE${r.minHe?'':' · wächst mit'} · ${G.heUsed} HE belegt</text>`;
  s+=`<rect x="${RAIL}" y="${HEAD}" width="${G.inner}" height="${G.n*U}" fill="${p.inn}"/>`;
  for(const rx of [8,W-RAIL+4])s+=`<rect x="${rx}" y="${HEAD}" width="${RAIL-12}" height="${G.n*U}" fill="${p.rail}"/>`;
  for(let i=0;i<G.n;i++){const y=HEAD+i*U;s+=`<text x="${RAIL/2-2}" y="${y+U/2+5}" text-anchor="middle" font-size="15" font-weight="700" fill="${p.sub}">${i+1}</text>`;for(const hx of [RAIL-13,W-RAIL+10])for(const f of [.18,.5,.82])s+=`<rect x="${hx}" y="${(y+U*f-3.5).toFixed(1)}" width="7" height="7" fill="${p.hole}"/>`;if(i)s+=`<rect x="${RAIL}" y="${y}" width="${G.inner}" height="1" fill="#fff" opacity=".07"/>`}
  const occ=new Set();for(const d of G.devs)for(let u=d.u;u<d.u+d.he;u++)occ.add(u);
  for(let u=1;u<=G.n;u++)if(!occ.has(u)){const y=HEAD+(u-1)*U,last=u===G.n&&!r.minHe;s+=`<g class="slot" data-slot="${r.id}:${u}"><rect x="${RAIL+8}" y="${y+8}" width="${G.inner-16}" height="${U-16}" rx="6" fill="#fff" fill-opacity=".025" stroke="${p.sub}" stroke-opacity=".4" stroke-dasharray="10 9"/><text x="${RAIL+G.inner/2}" y="${y+U/2+7}" text-anchor="middle" font-size="19" font-weight="600" fill="${p.sub}" opacity=".85">${last?'+ Gerät hier einbauen':'HE '+u+' frei – klicken zum Einbauen'}</text></g>`}
  s+=`<rect x="6" y="${Hh-FOOT+4}" width="${W-12}" height="${FOOT-10}" rx="4" fill="${p.f2}"/>`;
  return s+'</g>';
}
function roomSVG(rm,o){
  const c=(RCOL[rm.roomc]||RCOL.blau).c,X=rm.x,Y=rm.y,W=rm.w,Hh=rm.h;
  let s=`<g class="room${FM.has(rm.id)?' fade':''}" data-room="${rm.id}">`;
  if(o.sel)s+=halo(X-6,Y-6,W+12,Hh+12,18);
  s+=`<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="14" fill="${c}" fill-opacity=".07" stroke="${c}" stroke-opacity=".6" stroke-width="4" pointer-events="none"/><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="14" fill="none" stroke="transparent" stroke-width="22" pointer-events="stroke"/><rect x="${X+2}" y="${Y+2}" width="${W-4}" height="80" rx="12" fill="${c}" fill-opacity=".12"/>`;
  s+=`<text x="${X+30}" y="${Y+56}" font-size="40" font-weight="700" fill="${c}" pointer-events="none">${esc(trunc(rm.name,40))}</text>`;
  s+=`<g data-rh="${rm.id}" class="rh"><rect x="${X+W-38}" y="${Y+Hh-38}" width="32" height="32" rx="7" fill="${c}" fill-opacity=".28"/><path d="M${X+W-13} ${Y+Hh-29}L${X+W-29} ${Y+Hh-13}M${X+W-13} ${Y+Hh-20}L${X+W-20} ${Y+Hh-13}" stroke="${c}" stroke-width="3" stroke-linecap="round"/></g>`;
  return s+'</g>';
}
function endPos(e){const d=dev(e.d),p=lay(d).by[e.p];return {x:d.x+p.x+p.w/2,y:d.y+p.y+p.h/2,dir:p.dir,d,p}}
function cpath(A,B){const dy=B.y-A.y,far=Math.abs(dy)>60,da=far?Math.sign(dy):A.dir,db=B.dir===0?0:(far?-Math.sign(dy):B.dir),k=clamp(Math.hypot(B.x-A.x,dy)*.42,34,210);return [A.x,A.y,A.x,A.y+da*k,B.x,B.y+db*k,B.x,B.y]}
const pathD=q=>`M${q[0].toFixed(1)} ${q[1].toFixed(1)}C${q[2].toFixed(1)} ${q[3].toFixed(1)} ${q[4].toFixed(1)} ${q[5].toFixed(1)} ${q[6].toFixed(1)} ${q[7].toFixed(1)}`;
const bz=(q,t)=>{const u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,e=t*t*t;return {x:a*q[0]+b*q[2]+c*q[4]+e*q[6],y:a*q[1]+b*q[3]+c*q[5]+e*q[7]}};
const ov=(a,b)=>a.x1<b.x2&&b.x1<a.x2&&a.y1<b.y2&&b.y1<a.y2;
function ccolor(c,inf){
  if(inf.nolink)return '#8a8f96';
  if(state.view.colorBy==='cable'){if(c.color!=='auto')return COL[c.color].hex;if(c.med==='fi')return FG[c.fg].col;if(c.med==='dac')return '#2a2c2f';if(c.med==='aoc')return '#19b5c9'}
  return inf.speed?SP[inf.speed].c:'#8a8f96';
}
function topSev(iss){let b=null;for(const [s] of iss)if(s!=='info'&&(!b||SEV[s].r<SEV[b].r))b=s;return b}
function plugSVG(E,col,cid,c,side,dim,fd){
  if(side==='r')return '';
  const X=E.d.x+E.p.x,Y=E.d.y+E.p.y,p=E.p,t=p.type,cl=`pl-${cid}${dim?' dim':fd?' fade':''}`;
  if(isCuP(t)){const y=p.dir<0?Y+8:Y+4.5;return `<g class="${cl}"><rect x="${X+4.5}" y="${y}" width="${p.w-9}" height="${p.h-12.5}" rx="2.5" fill="${col}" stroke="#000" stroke-opacity=".5"/><rect x="${X+9}" y="${p.dir<0?y+2:y+p.h-17.5}" width="${p.w-18}" height="2.6" rx="1.3" fill="#fff" opacity=".45"/></g>`}
  if(PT[t].ff)return `<g class="${cl}"><rect x="${X+1.5}" y="${Y+1.5}" width="${p.w-3}" height="${p.h-3}" rx="1.5" fill="${c.med==='dac'||c.med==='aoc'?'#bfc4ca':'#dfe2e6'}" stroke="#7d828a"/><rect x="${X+6}" y="${Y+p.h/2-2.5}" width="${p.w-12}" height="5" rx="2.5" fill="${col}" stroke="#000" stroke-opacity=".35"/></g>`;
  return `<g class="${cl}"><rect x="${X+3}" y="${Y+3}" width="${p.w-6}" height="${p.h-6}" rx="2" fill="${col}" stroke="#000" stroke-opacity=".5"/><rect x="${X+p.w/2-1.5}" y="${Y+4.5}" width="3" height="${p.h-9}" rx="1" fill="#fff" opacity=".45"/></g>`;
}
/* cables crossing a third device run around it in a side lane, like cable management */
function devRects(){return state.devices.filter(d=>!HID.has(d.id)).map(d=>{const L=lay(d);return {id:d.id,x1:d.x,y1:d.y,x2:d.x+L.W,y2:d.y+L.H}})}
function bzRoute(q){return {d:pathD(q),at:t=>bz(q,t),pts:null}}
function polyRoute(pts){
  const P=pts.filter((p,i)=>i===0||p[0]!==pts[i-1][0]||p[1]!==pts[i-1][1]),seg=[];let tot=0;
  for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(l);tot+=l}
  let d=`M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for(let i=1;i<P.length-1;i++){const [x0,y0]=P[i-1],[x1,y1]=P[i],[x2,y2]=P[i+1],l1=seg[i-1],l2=seg[i],r=Math.min(14,l1/2,l2/2);d+=`L${(x1-(x1-x0)/l1*r).toFixed(1)} ${(y1-(y1-y0)/l1*r).toFixed(1)}Q${x1.toFixed(1)} ${y1.toFixed(1)} ${(x1+(x2-x1)/l2*r).toFixed(1)} ${(y1+(y2-y1)/l2*r).toFixed(1)}`}
  d+=`L${P[P.length-1][0].toFixed(1)} ${P[P.length-1][1].toFixed(1)}`;
  const at=t=>{let s=clamp(t,0,1)*tot;for(let i=0;i<seg.length;i++){if(s<=seg[i]||i===seg.length-1){const f=seg[i]?Math.min(1,s/seg[i]):0;return {x:P[i][0]+(P[i+1][0]-P[i][0])*f,y:P[i][1]+(P[i+1][1]-P[i][1])*f}}s-=seg[i]}return {x:P[0][0],y:P[0][1]}};
  return {d,at,pts:P};
}
function routes(){
  const rects=devRects(),m=new Map();let lr=0,ll=0;
  for(const c of state.cables){
    const A=endPos(c.a),B=endPos(c.b),q=cpath(A,B),obs=rects.filter(r=>r.id!==A.d.id&&r.id!==B.d.id);
    let hit=false;
    for(let t=.05;t<.96&&!hit&&obs.length;t+=.05){const p=bz(q,t);hit=obs.some(r=>p.x>r.x1-6&&p.x<r.x2+6&&p.y>r.y1-6&&p.y<r.y2+6)}
    if(!hit){m.set(c.id,bzRoute(q));continue}
    const LA=lay(A.d),LB=lay(B.d),yA=o=>A.dir<0?A.d.y-o:A.d.y+LA.H+o,yB=o=>B.dir<0?B.d.y-o:B.d.y+LB.H+o;
    const span=(ya,yb)=>{const y1=Math.min(ya,yb),y2=Math.max(ya,yb),rel=rects.filter(r=>r.y2>y1&&r.y1<y2);return {xr:Math.max(A.x,B.x,...rel.map(r=>r.x2)),xl:Math.min(A.x,B.x,...rel.map(r=>r.x1))}};
    let s=span(yA(10),yB(10));const right=s.xr-Math.max(A.x,B.x)<=Math.min(A.x,B.x)-s.xl;
    const ln=right?lr++:ll++,off=10+ln*6,ya=yA(off),yb=yB(off);s=span(ya,yb);
    const sx=right?s.xr+28+ln*12:s.xl-28-ln*12;
    m.set(c.id,polyRoute([[A.x,A.y],[A.x,ya],[sx,ya],[sx,yb],[B.x,yb],[B.x,B.y]]));
  }
  return m;
}
function cablesSVG(o){
  let hit='',vis='',plug='',lab='';const placed=[],RT=routes(),rects=devRects(),lm=state.view.labelMode,hl=o.hl;
  for(const c of state.cables){
    const A=endPos(c.a),B=endPos(c.b),rt=RT.get(c.id),D=rt.d,inf=AN.get(c.id),col=ccolor(c,inf),isSel=hl?hl.cab.has(c.id):o.sel===c.id,dim=!!hl&&!isSel,inst=c.a.s==='r'||c.b.s==='r';
    if(HID.has(c.a.d)||HID.has(c.b.d)){for(const [E,e] of [[A,c.a],[B,c.b]])if(!HID.has(e.d))plug+=plugSVG(E,col,c.id,c,e.s,dim,FD.has(e.d));continue}
    const fade=!isSel&&(FD.has(c.a.d)||FD.has(c.b.d));
    const dash=inst?' stroke-dasharray="0.1 7"':inf.nolink?' stroke-dasharray="8 6"':'';
    hit+=`<path data-cable="${c.id}" d="${D}" fill="none" stroke="transparent" stroke-width="16" pointer-events="stroke"/>`;
    vis+=`<g class="cab${dim?' dim':fade?' fade':''}" id="cab-${c.id}">${isSel?`<path d="${D}" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/><path d="${D}" fill="none" stroke="#ffe600" stroke-width="10" stroke-linecap="round"/>`:''}<path class="ce" d="${D}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="${inst?7:5.8}" stroke-linecap="round"${dash}/><path class="cc" d="${D}" fill="none" stroke="${col}" stroke-width="${inst?4.6:3.6}" stroke-linecap="round"${dash}/></g>`;
    plug+=plugSVG(A,col,c.id,c,c.a.s,dim,!isSel&&FD.has(c.a.d))+plugSVG(B,col,c.id,c,c.b.s,dim,!isSel&&FD.has(c.b.d));
    const sev=topSev(inf.iss),text=lm==='off'?'':lm==='spec'?[c.label,cspec(c)].filter(Boolean).join(' · '):c.label;
    if(!text&&!sev)continue;
    const w=text?Math.round(text.length*6.6+20+(sev?16:0)):20;
    let pt=null;
    for(const t of [.5,.42,.58,.34,.66,.26,.74,.18,.82]){const p=rt.at(t),r={x1:p.x-w/2-3,y1:p.y-13,x2:p.x+w/2+3,y2:p.y+13};if(!placed.some(z=>ov(z,r))&&!rects.some(z=>ov(z,r))){pt=p;placed.push(r);break}}
    if(!pt){pt=rt.at(.5);placed.push({x1:pt.x-w/2,y1:pt.y-12,x2:pt.x+w/2,y2:pt.y+12})}
    const bx=text?-w/2+11:0,tx=sev?8:0;
    lab+=`<g class="lab${dim?' dim':fade?' fade':''}" data-cable="${c.id}" transform="translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})"><rect x="${-w/2}" y="-10.5" width="${w}" height="21" rx="10.5" fill="${isSel?'#ffe600':o.exp?'#ffffff':'var(--lbg)'}" stroke="${isSel?'#111':col}" stroke-width="2"/>${sev?`<circle cx="${bx}" cy="0" r="6.5" fill="${SEV[sev].c}"/><text x="${bx}" y="3.8" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff">${SEV[sev].g}</text>`:''}${text?`<text x="${tx}" y="4" text-anchor="middle" font-size="11.5" font-weight="700" fill="${isSel?'#111111':o.exp?'#111111':'var(--ink)'}">${esc(text)}</text>`:''}</g>`;
  }
  return {hit,vis,plug,lab};
}

/* ================= checks: per cable and end to end ================= */
function walk(c,k){
  const steps=[],seen=new Set([c.id]);let e=c[k],g=0;
  while(g++<80){
    if(!isPas(ptype(e.p)))return {steps,end:e};
    const os=e.s==='r'?'f':'r',nx=CM.get(e.d+':'+e.p+':'+os);
    if(!nx||seen.has(nx.id))return {steps,end:null};
    seen.add(nx.id);
    const nk=(nx.a.d===e.d&&nx.a.p===e.p&&(nx.a.s==='r'?'r':'f')===os)?'a':'b',ok=nk==='a'?'b':'a';
    steps.push({c:nx,from:nx[nk],to:nx[ok]});e=nx[ok];
  }
  return {steps,end:null};
}
const trOf=(c,e)=>(c.med==='cu'||c.med==='fi')?TR[c.a===e?c.ta:c.tb]:null;
function mediaIss(c){
  const iss=[];let nl=false;const add=(s,m,n)=>{if(!iss.some(i=>i[1]===m))iss.push([s,m]);if(n)nl=true};
  const med=c.med,len=c.len===''?0:+c.len;
  for(const k of ['a','b']){
    const e=c[k],d=dev(e.d),t=ptype(e.p),tr=TR[c['t'+k]],nm=pfull(e),conn=c['c'+k];
    if(!isPas(t)&&pconf(d,e.p).off)add('warn',`${nm} ist deaktiviert – kein Link`,1);
    if(med==='cu'){
      if(PT[t].con)add('err',`Kupferkabel passt nicht in die ${PT[t].n}-Kupplung (${nm})`,1);
      else if(PT[t].ff){if(!tr){const a=autoTr(t,'cu');add(a?'info':'err',a?`RJ45-Transceiver an ${nm} angeben (z. B. ${a})`:`Für ${PT[t].n} gibt es praktisch keine RJ45-Module – Glasfaser oder DAC nehmen (${nm})`,!a)}else if(tr.m!=='cu')add('err',`${tr.n} ist ein optisches Modul – am Kupferkabel ein RJ45-Modul nehmen (${nm})`,1)}
    }else if(med==='fi'){
      if(isCuP(t))add('err',`Glasfaser passt nicht in einen RJ45-Port (${nm})`,1);
      else if(PT[t].ff){
        if(!tr)add('info',`Transceiver an ${nm} angeben`);
        else if(tr.m==='cu')add('err',`${tr.n} ist ein RJ45-Modul – für Glasfaser ein optisches Modul wählen (${nm})`,1);
        else{if(tr.m!==FG[c.fg].m)add('err',`${tr.n} ist ${tr.m==='mm'?'Multimode':'Singlemode'}, das Kabel ${FG[c.fg].n} ist ${FG[c.fg].m==='mm'?'Multimode':'Singlemode'}`,1);if(tr.con!==conn)add('warn',`${tr.n} hat ${tr.con==='MPO'?'MPO':'LC'}-Anschluss, Kabelende ${k.toUpperCase()} ist ${conn}`)}
      }else{
        if(PT[t].con!==conn)add('warn',`Stecker ${conn} passt nicht in die ${PT[t].n}-Kupplung (${nm})`);
        if(FG[d.fg].m!==FG[c.fg].m)add('err',`${d.name} ist ${FG[d.fg].n}, das Kabel ${FG[c.fg].n} – Singlemode und Multimode nicht mischen`,1);
        else if(FG[c.fg].m==='sm'&&d.pol!==c.pol)add('err',`${d.name} hat ${d.pol}-Schliff, das Kabel ${c.pol} – APC und UPC nicht mischen`,1);
      }
    }else if(!PT[t].ff)add('err',`${MED[med].n}-Kabel brauchen SFP- oder QSFP-Ports (${nm})`,1);
  }
  if(med==='dac'||med==='aoc'){const fa=PT[ptype(c.a.p)].ff,fb=PT[ptype(c.b.p)].ff;if(fa&&fb&&fa!==fb)add('err','SFP auf QSFP braucht ein Breakout-Kabel (1 × QSFP auf 4 × SFP)',1)}
  if(med==='cu'){if(len>100)add('err',`Kupfer ist nur bis 100 m spezifiziert (${de(len)} m)`);else if(CAT[c.cat].len&&len>CAT[c.cat].len)add('warn',`${CAT[c.cat].n} ist nur bis ${CAT[c.cat].len} m spezifiziert`)}
  if(med==='dac'){const hi=[c.a,c.b].some(e=>['sfp28','qsfp28'].includes(ptype(e.p))),lim=c.dac==='aktiv'?15:hi?5:7;if(len>lim)add('warn',`${c.dac==='aktiv'?'Aktive':'Passive'} DAC-Kabel reichen hier nur etwa ${lim} m – AOC oder Glasfaser nehmen`)}
  if(med==='aoc'&&len>100)add('warn','AOC-Kabel gibt es meist nur bis 100 m');
  if(c.a.d===c.b.d&&dev(c.a.d).kind==='switch')add('warn','Kabel steckt zweimal im selben Switch – das erzeugt eine Schleife');
  return {iss,nl};
}
function analyze(){
  syncRacks();CM=cableMap();
  const res=new Map(),list=[],chans=[],pairs=new Map(),MI=new Map(),done=new Set();
  for(const d of state.devices){const L=lay(d);if(L.over)list.push({s:'warn',m:`„${d.name}“ passt mit ${total(d)} Ports nicht in ${d.size}″ – größere Bauform oder weniger Ports wählen`,dv:d.id})}
  for(const d of state.devices){if(d.kind!=='server'||!d.bays)continue;const DI=diskInfo(d);for(const x of DI.pend)list.push({s:'warn',m:`„${d.name}“, Slot ${x.i+1}: ${fmtCap(x.o)} weicht um ${fmtTB(Math.abs(x.dev))} vom Median der übrigen Platten ab – prüfen und quittieren`,dv:d.id});for(const r of d.raids||[]){const I=raidInfo(d,r,DI);for(const w of I.w)list.push({s:'warn',m:`„${d.name}“, ${r.name} (${I.L.n}): ${w}`,dv:d.id})}}
  devW=powerCalc();
  for(const [id,P] of PW){const d=dev(id),nm=d.kind==='ups'?'USV':'PDU';if(P.pct>100)list.push({s:'err',m:`${nm} „${d.name}“ ist überlastet: ${Math.round(P.load)} W bei ${P.cap} W`,dv:id});else if(P.pct>=80)list.push({s:'warn',m:`${nm} „${d.name}“ ist zu ${Math.round(P.pct)} % ausgelastet`,dv:id});if(d.kind==='pdu'&&P.plugs>(+d.o13||0)+(+d.o19||0))list.push({s:'warn',m:`PDU „${d.name}“: ${P.plugs} Stecker, aber nur ${(+d.o13||0)+(+d.o19||0)} Steckdosen`,dv:id})}
  for(const d of state.devices){if(!pwrDev(d)||d.kind==='pdu'||d.psu!=='2')continue;const f=feedsOf(d);if(f.length===2&&f[0]===f[1])list.push({s:'info',m:`„${d.name}“: beide Netzteile hängen an „${dev(f[0]).name}“ – keine A/B-Redundanz`,dv:d.id});else if(f.length===1)list.push({s:'info',m:`„${d.name}“: nur ein Netzteil ist an USV/PDU angeschlossen`,dv:d.id})}
  for(const d of state.devices){const z=lcs(d);if(z&&z.s!=='ok')list.push({s:z.s==='eol'?'err':'warn',m:z.s==='eol'?`„${d.name}“ hat das Lebensende erreicht (EOL) – gekauft ${d.year}, ${z.age} Jahre alt`:`„${d.name}“ ist veraltet – gekauft ${d.year}, ${z.age} Jahre alt, EOL ab ${z.ey}`,dv:d.id})}
  for(const r of state.racks){const G=rgeom(r);if(r.minHe&&G.used>r.minHe)list.push({s:'warn',m:`Schrank „${r.name}“ ist voll: Geräte reichen bis HE ${G.used}, der Schrank hat ${r.minHe} HE`,rk:r.id})}
  for(const c of state.cables)MI.set(c.id,mediaIss(c));
  for(const c of state.cables){
    if(done.has(c.id))continue;
    const Lw=walk(c,'a'),Rw=walk(c,'b');
    const steps=[...Lw.steps.reverse().map(s=>({c:s.c,from:s.to,to:s.from})),{c,from:c.a,to:c.b},...Rw.steps];
    const ch={steps,A:Lw.end,B:Rw.end,iss:[],nl:false,speed:null};
    const add=(s,m,n)=>{if(!ch.iss.some(i=>i[1]===m))ch.iss.push([s,m]);if(n)ch.nl=true};
    for(const s of steps){done.add(s.c.id);if(MI.get(s.c.id).nl)ch.nl=true}
    const ends=[];if(ch.A)ends.push({e:ch.A,c:steps[0].c});if(ch.B)ends.push({e:ch.B,c:steps[steps.length-1].c});
    for(const x of ends){x.d=dev(x.e.d);x.t=ptype(x.e.p);x.sp=pspeed(x.d,x.e.p);x.tr=trOf(x.c,x.e);x.opt=!!PT[x.t].ff&&x.c.med!=='cu';x.eff=x.tr&&SP[x.tr.v].v<SP[x.sp].v?x.tr.v:x.sp;
      if(x.tr&&x.tr.v!==x.sp)add('warn',`${pfull(x.e)} steht auf ${SP[x.sp].n}, das Modul ${x.tr.n} arbeitet mit ${SP[x.tr.v].n}`)}
    if(ends.length)ch.speed=ends.reduce((m,x)=>SP[x.eff].v<SP[m].v?x.eff:m,ends[0].eff);
    if(ends.length===2){
      const [X,Y]=ends;
      if(X.eff!==Y.eff){if(X.opt&&Y.opt)add('err',`Kein Link: ${SP[X.eff].n} ↔ ${SP[Y.eff].n} – beide Seiten gleich einstellen`,1);else add('warn',`Unterschiedliche Geschwindigkeit (${SP[X.eff].n} ↔ ${SP[Y.eff].n}) – Link läuft höchstens mit ${SP[ch.speed].n}`)}
      if(X.tr&&Y.tr&&X.opt&&Y.opt&&X.tr.n!==Y.tr.n)add('err',`Transceiver passen nicht zusammen: ${X.tr.n} ↔ ${Y.tr.n}`,1);
      for(const [P,Q] of [[X,Y],[Y,X]])if(needsPoe(P.d)&&P.t==='rj45'&&!ppoe(Q.d,Q.e.p))add('warn',`${P.d.name} braucht PoE${P.d.kind==='ap'?' (802.3'+P.d.poeStd+')':''} – ${pfull(Q.e)} liefert keins. PoE-Port oder Injektor nötig`);
      {const A=pvlan(X.d,X.e.p),B=pvlan(Y.d,Y.e.p);
        if(A&&B){const has=(T,v)=>T.m==='access'?T.v===v:(T.nat===v||T.tag.includes(v));
          if(A.m==='access'&&B.m==='access'&&A.v!==B.v)add('warn',`VLAN passt nicht: ${vshort(A.v)} ↔ ${vshort(B.v)}`);
          else if(A.m!==B.m){const [Ac,Tr]=A.m==='access'?[A,B]:[B,A];if(!has(Tr,Ac.v))add('warn',`${vshort(Ac.v)} fehlt auf dem Trunk der Gegenseite`);else if(Tr.nat!==Ac.v)add('info',`Access-Port (${vshort(Ac.v)}) an Trunk: Pakete kommen getaggt an – Native VLAN prüfen`)}
          else if(A.m==='trunk'&&B.m==='trunk'){if((A.nat||0)!==(B.nat||0))add('warn',`Native VLAN unterschiedlich: ${A.nat||'keins'} ↔ ${B.nat||'keins'}`);const only=[...A.tag.filter(v=>!B.tag.includes(v)),...B.tag.filter(v=>!A.tag.includes(v))];if(only.length)add('info',`Nur auf einer Seite getaggt: VLAN ${[...new Set(only)].sort((a,b)=>a-b).join(', ')}`)}}}
      if(X.d.id!==Y.d.id&&X.t!=='mgmt'&&Y.t!=='mgmt'){const k=[X.d.id,Y.d.id].sort().join('|');pairs.set(k,(pairs.get(k)||[]).concat([ch]))}
    }
    const cu=steps.filter(s=>s.c.med==='cu');
    if(cu.length&&ch.speed){
      const len=cu.reduce((a,s)=>a+(+s.c.len||0),0),weak=cu.reduce((m,s)=>CAT[s.c.cat].r<CAT[m].r?s.c.cat:m,cu[0].c.cat),v=SP[ch.speed].v;
      if(cu.length>1&&len>100)add('err',`Kupferstrecke ist ${de(len)} m lang – erlaubt sind 100 m`);
      if(v>CAT[weak].max)add('err',`${CAT[weak].n} reicht nicht für ${SP[ch.speed].n} – mindestens Cat6A verwenden`);
      else if(weak==='cat6'&&v>=1e4&&len>55)add('warn',`Cat6 schafft 10GBASE-T nur bis etwa 55 m (Strecke ${de(len)} m)`);
      for(const x of ends)if(x.tr&&x.tr.m==='cu'&&x.tr.r.cu<100&&len>x.tr.r.cu)add('warn',`${x.tr.n}-Module schaffen meist nur etwa ${x.tr.r.cu} m`);
    }
    const fi=steps.filter(s=>s.c.med==='fi');
    if(fi.length){
      if(new Set(fi.map(s=>FG[s.c.fg].m)).size>1)add('err','Singlemode und Multimode in einer Strecke gemischt',1);
      const len=fi.reduce((a,s)=>a+(+s.c.len||0),0),weak=fi.reduce((m,s)=>FG[s.c.fg].r<FG[m].r?s.c.fg:m,fi[0].c.fg);
      for(const x of ends)if(x.tr&&x.tr.m===FG[weak].m){const r=x.tr.r[weak];if(r==null)add('err',`${x.tr.n} ist für ${FG[weak].n} nicht spezifiziert`,1);else if(len>r)add('warn',`${x.tr.n} schafft auf ${FG[weak].n} nur ${r>=1000?de(r/1000)+' km':r+' m'} – Strecke ${de(len)} m`)}
    }
    chans.push(ch);
  }
  const par={},find=x=>{while(par[x]&&par[x]!==x)x=par[x];return x};
  for(const [k,arr] of pairs){
    const [a,b]=k.split('|').map(dev),sw=a.kind==='switch'&&b.kind==='switch';
    if(arr.length>1)for(const ch of arr)ch.iss.push(['info',sw?`${arr.length} Verbindungen zwischen „${a.name}“ und „${b.name}“ – als LAG (LACP) bündeln, sonst blockiert STP`:`${arr.length} Verbindungen zwischen „${a.name}“ und „${b.name}“ – als Bond/Team (LACP) einrichten`]);
    if(sw){const ra=find(a.id),rb=find(b.id);if(ra===rb)arr[0].iss.push(['info','Diese Verbindung schließt einen Ring – STP/RSTP muss aktiv sein']);else par[ra]=rb}
  }
  for(const ch of chans)for(const s of ch.steps){const mi=MI.get(s.c.id),iss=[...mi.iss];for(const i of ch.iss)if(!iss.some(j=>j[1]===i[1]))iss.push(i);res.set(s.c.id,{speed:ch.nl?null:ch.speed,nolink:ch.nl,iss,ch})}
  for(const c of state.cables)for(const [s,m] of res.get(c.id).iss)list.push({s,m,c:c.id});
  const uniq=[],keys=new Set();
  for(const i of list.sort((a,b)=>SEV[a.s].r-SEV[b.s].r)){const k=i.s+i.m;if(!keys.has(k)){keys.add(k);uniq.push(i)}}
  AN=res;CH=chans;
  HVL=new Map();for(const d of state.devices){if(d.kind!=='host'&&d.kind!=='ap')continue;for(const p of lay(d).ports){const c=cabOf(d.id,p.id,'f');if(!c)continue;const ch=res.get(c.id).ch,me=e=>e&&e.d===d.id&&e.p===p.id,far=me(ch.A)?ch.B:me(ch.B)?ch.A:null;const pv=far&&pvlan(dev(far.d),far.p);const v=pv?(pv.m==='access'?pv.v:pv.nat):null;if(v){HVL.set(d.id,v);break}}}
  const ips=new Map(),more=[];IPI=new Map();
  for(const d of state.devices){if(!d.ip)continue;const n=ip2n(d.ip);if(n==null){more.push({s:'warn',m:`„${d.name}“: „${d.ip}“ ist keine gültige IPv4-Adresse`,dv:d.id});IPI.set(d.id,{bad:1});continue}
    if(!ips.has(n))ips.set(n,[]);ips.get(n).push(d);const hv=HVL.get(d.id),V=hv?vlanOf(hv):ipVlan(n),S=vnet(V),inf={n,v:V?V.id:null};
    if(hv&&S&&!inNet(n,S)){inf.wrong=1;more.push({s:'warn',m:`„${d.name}“ hängt in ${vshort(hv)}, die IP ${d.ip} liegt aber nicht in ${S.txt}`,dv:d.id})}
    else if(S&&(n===S.net||n===S.bc)&&S.b<31){inf.wrong=1;more.push({s:'warn',m:`„${d.name}“: ${d.ip} ist die ${n===S.net?'Netz':'Broadcast'}-Adresse von ${S.txt}`,dv:d.id})}
    IPI.set(d.id,inf)}
  for(const [n,ds] of ips)if(ds.length>1){for(const d of ds)IPI.get(d.id).dup=1;more.push({s:'err',m:`IP ${n2ip(n)} ist doppelt vergeben: ${ds.map(d=>d.name).join(', ')}`,dv:ds[0].id})}
  for(const i of more)if(!uniq.some(j=>j.m===i.m))uniq.push(i);uniq.sort((a,b)=>SEV[a.s].r-SEV[b.s].r);
  ISS=uniq;
}
/* the whole end-to-end path of the selected port or cable */
function hlSet(){
  if(!sel)return null;let cs=[];
  if(sel.kind==='port'){for(const s of ['f','r']){const c=cabOf(sel.dev,sel.port,s);if(c)cs.push(...AN.get(c.id).ch.steps.map(x=>x.c))}}
  else if(sel.kind==='cable'){const i=AN.get(sel.id);if(i)cs=i.ch.steps.map(x=>x.c)}
  else if(sel.kind==='dev'){const d=dev(sel.id);if(d)for(const p of lay(d).ports)for(const s of ['f','r']){const c=cabOf(d.id,p.id,s);if(c)cs.push(...AN.get(c.id).ch.steps.map(x=>x.c))}}
  if(!cs.length)return null;
  const ports=new Set();for(const c of cs){ports.add(c.a.d+':'+c.a.p);ports.add(c.b.d+':'+c.b.p)}
  return {cab:new Set(cs.map(c=>c.id)),ports};
}

/* ================= render ================= */
function renderAll(keepInsp){analyze();renderCanvas();renderRail();if(!keepInsp)renderInsp();renderTop();if(mode==='list')renderTable();else if(mode==='topo')renderTopo()}
function renderCanvas(){
  HL=hlSet();computeVis();SDV=sel&&(sel.kind==='dev'?sel.id:sel.kind==='port'?sel.dev:null);
  const sd=sel&&sel.kind==='dev'?sel.id:null,sp=sel&&sel.kind==='port'?sel:null;
  $('#l-room').innerHTML=state.rooms.map(rm=>roomSVG(rm,{sel:sel&&sel.kind==='room'&&sel.id===rm.id})).join('');
  $('#l-rack').innerHTML=state.racks.map(r=>rackFrameSVG(r,{sel:sel&&sel.kind==='rack'&&sel.id===r.id})).join('');
  $('#l-dev').innerHTML=state.devices.map(d=>devSVG(d,{sel:d.id===sd||MS.has(d.id),selPort:sp&&sp.dev===d.id?sp.port:null,hl:HL})).join('');
  $('#l-num').innerHTML=state.devices.map(d=>numSVG(d,{})).join('');
  $('#l-pow').innerHTML=powSVG();
  drawCables();
  $('#empty').hidden=state.devices.length+state.racks.length+state.rooms.length>0;
  $('#hint').textContent=state.demo?'Beispielprojekt zum Ausprobieren – unter „Datei“ startest du ein leeres Projekt.':'Port anklicken zeigt die ganze Strecke · Port auf Port ziehen steckt ein Kabel · Geräte in Schränke ziehen';
}
function powSVG(){if(!SDV)return '';const d=dev(SDV);if(!d||HID.has(d.id))return '';const pairs=[];
  for(const id of feedsOf(d))pairs.push([d,dev(id),d.pa===id?'A':'B']);
  if(isSrc(d)){const P=PW.get(d.id);if(P)for(const x of P.list)pairs.push([x.d,d,x.ab])}
  const box=x=>{const L=lay(x);return {x:x.x,y:x.y,w:L.W,h:L.H}};let s='';
  for(const [a,b,t] of pairs){if(HID.has(a.id)||HID.has(b.id))continue;const A=box(a),B=box(b),ar=A.x+A.w/2<B.x+B.w/2,x1=ar?A.x+A.w:A.x,x2=ar?B.x:B.x+B.w,y1=A.y+A.h/2,y2=B.y+B.h/2,k=Math.max(60,Math.abs(x2-x1)*.4)*(ar?1:-1),same=Math.abs((A.x+A.w/2)-(B.x+B.w/2))<60;
    const sx=same?A.x+A.w+(a.rack?RAIL:0):x1,ex=same?B.x+B.w+(b.rack?RAIL:0):x2,dd=same?`M${sx} ${y1}C${sx+90+Math.abs(y2-y1)*.25} ${y1} ${ex+90+Math.abs(y2-y1)*.25} ${y2} ${ex} ${y2}`:`M${x1} ${y1}C${x1+k} ${y1} ${x2-k} ${y2} ${x2} ${y2}`;
    s+=`<path d="${dd}" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" opacity=".35"/><path d="${dd}" fill="none" stroke="#f43f5e" stroke-width="3.6" stroke-dasharray="10 7" stroke-linecap="round"/><g><circle cx="${same?sx:x1}" cy="${y1}" r="11" fill="#f43f5e" stroke="#111" stroke-width="1.5"/><text x="${same?sx:x1}" y="${y1+4.5}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">${t==='A+B'?'2':t}</text></g>`}
  return s}
function drawCables(){const r=cablesSVG({sel:sel&&sel.kind==='cable'?sel.id:null,hl:HL});$('#l-hit').innerHTML=r.hit;$('#l-cab').innerHTML=r.vis;$('#l-plug').innerHTML=r.plug;$('#l-lab').innerHTML=r.lab;hov=null}
function chip(d){const st=STY[d.style]||STY.host,rack=KIND[d.kind].rack,bg=rack?`linear-gradient(${st.g[0]},${st.g[1]})`:'#f4f5f7',fg=rack?(st.text||'#1d2126'):'#1d2126';return `<i class="cs" style="background:${bg};color:${fg}"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${KICON[d.kind]}</svg></i>`}
function objChip(k,bg,fg){return `<i class="cs" style="background:${bg};color:${fg}"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${KICON[k]}</svg></i>`}
const norm=t=>String(t||'').toLocaleLowerCase('de-DE').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss');
function hay(d){const r=d.rack&&rackOf(d.rack),rm=devRoom(d),c=catOf(d)[1];
  return norm([d.name,KIND[d.kind].n,c,(d.kind==='host'||d.kind==='net')?subLbl(d):'',d.user,d.location,d.ip,d.mac,d.notes,r?r.name:'',rm?rm.name:'',(STY[d.style]||{}).n,d.year,(z=>z&&z.s==='eol'?'eol end of life':z&&z.s==='old'?'veraltet':'')(lcs(d))].join(' '))}
const qtok=q=>norm(q).split(/\s+/).filter(Boolean);
const hit=(h,T)=>T.every(t=>h.includes(t));
function mk(text,T){text=String(text||'');if(!T||!T.length)return esc(text);
  const re=new RegExp('('+T.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','gi');
  return text.split(re).map((x,i)=>i%2?`<mark>${esc(x)}</mark>`:esc(x)).join('')}
function subline(d){const r=d.rack&&rackOf(d.rack),rm=devRoom(d),w=[r?r.name+' · '+heTxt(d):'',rm&&!r?rm.name:''].filter(Boolean).join(' · ');
  if(d.kind==='host')return [d.user,d.ip,w].filter(Boolean).join(' · ')||subLbl(d);
  return [w,r?summary(d).replace(/\s·\s\d+″\s\d+\sHE$/,''):summary(d)].filter(Boolean).join(' · ')}
function portHits(d,T){const own=norm(d.name+' '+KIND[d.kind].n),out=[];
  for(const p of lay(d).ports){const cf=pconf(d,p.id);if(!cf.label&&!cf.notes)continue;const ph=norm([pname(d,p.id),cf.label,cf.notes].join(' '));
    if(T.some(t=>ph.includes(t))&&hit(ph+' '+own,T))out.push({p,cf})}
  return out}
function renderRail(){
  const q=$('#rq').value.trim(),T=qtok(q),S=T.length>0;
  const on=d=>sel&&((sel.kind==='dev'&&sel.id===d.id)||(sel.kind==='port'&&sel.dev===d.id));
  const item=(d,ph,dm)=>{const hid=HIDL.has(d.id);return `<li><button type="button" data-dev="${d.id}" class="${on(d)?'on':''}${hid?' hid':''}${dm?' dm':''}"${hid?' title="Ausgeblendet – Klick zeigt das Gerät"':''}>${chip(d)}<span><b>${mk(d.name,T)}</b><small>${mk(subline(d),T)}${hid?' · ausgeblendet':''}</small></span><span class="u">${lcPill(d)}${usedPorts(d)}/${total(d)}</span></button>${ph&&ph.length?`<ul class="pms">${ph.slice(0,8).map(({p,cf})=>`<li><button type="button" data-dev="${d.id}" data-port="${p.id}" class="${sel&&sel.kind==='port'&&sel.dev===d.id&&sel.port===p.id?'on':''}"><span class="pn">${esc(pname(d,p.id))}</span><span>${cf.label?`<b>${mk(cf.label,T)}</b>`:''}${cf.notes?`<small>${mk(cf.notes,T)}</small>`:''}</span></button></li>`).join('')}${ph.length>8?`<li class="none">+ ${ph.length-8} weitere Ports</li>`:''}</ul>`:''}</li>`};
  // rooms
  const rooms=state.rooms.filter(rm=>!S||hit(norm(rm.name+' '+(rm.notes||'')+' raum'),T));
  $('#n-room').textContent=S?(rooms.length||''):(state.rooms.length||'');
  $('#roomlist').innerHTML=rooms.length?rooms.map(rm=>{const C=roomContents(rm),hs=C.devs.filter(d=>d.kind==='host').length,nd=C.devs.length-hs;
    const sub=[C.racks.length?pl(C.racks.length,'Schrank','Schränke'):'',nd?pl(nd,'Gerät','Geräte'):'',hs?pl(hs,'Host','Hosts'):''].filter(Boolean).join(' · ')||'leer';
    return `<li><button type="button" data-rm="${rm.id}" class="${sel&&sel.kind==='room'&&sel.id===rm.id?'on':''}${FM.has(rm.id)?' hid':''}">${objChip('room',(RCOL[rm.roomc]||RCOL.blau).c,'#fff')}<span><b>${mk(rm.name,T)}</b><small>${sub}${FM.has(rm.id)?' · ausgeblendet':''}</small>${lcCount(C.devs)?`<span class="lcs">${lcCount(C.devs)}</span>`:''}</span></button></li>`}).join(''):S?'':'<li class="none">Noch keine Räume – über „Hinzufügen“ anlegen.</li>';
  $('#sec-rooms').hidden=S&&!rooms.length;
  // racks
  const racks=state.racks.filter(r=>{if(!S)return true;const rm=rackRoom(r);return hit(norm([r.name,r.notes,'schrank rack',r.rsize+'"',rm?rm.name:''].join(' ')),T)});
  $('#n-rack').textContent=racks.length||'';
  $('#racklist').innerHTML=racks.length?racks.map(r=>{const G=rgeom(r),p=RPAL[r.rcolor]||RPAL.schwarz,rm=rackRoom(r);
    return `<li><button type="button" data-rk="${r.id}" class="${sel&&sel.kind==='rack'&&sel.id===r.id?'on':''}${FR.has(r.id)?' hid':''}">${objChip('rack',p.f,p.txt)}<span><b>${mk(r.name,T)}</b><small>${r.rsize}″ · ${G.heUsed}/${G.n} HE · ${pl(G.devs.length,'Gerät','Geräte')}${rm?' · '+mk(rm.name,T):''}${FR.has(r.id)?' · ausgeblendet':''}</small>${lcCount(G.devs)?`<span class="lcs">${lcCount(G.devs)}</span>`:''}</span></button></li>`}).join(''):S?'':'<li class="none">Noch keine Schränke</li>';
  $('#sec-racks').hidden=S?!racks.length:false;
  // devices by category
  const groups=new Map();let nHit=0;
  for(const d of state.devices){let ph=null,dh=false;if(S){dh=hit(hay(d),T);ph=portHits(d,T);if(!dh&&!ph.length)continue}
    const [k,n]=catOf(d);if(!groups.has(k))groups.set(k,{n,list:[]});groups.get(k).list.push({d,ph,dh});nHit++}
  const keys=[...catOrder.filter(k=>groups.has(k)),...[...groups.keys()].filter(k=>!catOrder.includes(k))];
  const cmp=(a,b)=>a.d.name.localeCompare(b.d.name,'de',{numeric:true});
  $('#catlist').innerHTML=keys.length?keys.map(k=>{const g=groups.get(k),open=S||!closedCats.has(k),nh=g.list.filter(x=>HIDL.has(x.d.id)).length;
    return `<div class="cat"><button type="button" class="cath" data-cat="${k}" aria-expanded="${open}"${S?' disabled':''}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg><span>${esc(g.n)}</span><span class="cnt">${g.list.length}${nh&&!S?` · ${nh} ausgebl.`:''}</span></button>${open?`<ul class="devlist">${g.list.sort(cmp).map(x=>item(x.d,x.ph,x.dh)).join('')}</ul>`:''}</div>`}).join(''):`<p class="none">${S?'Keine Geräte gefunden.':'Noch keine Geräte'}</p>`;
  $('#n-dev').textContent=S?(nHit?pl(nHit,'Treffer','Treffer'):''):(state.devices.length||'');
  // cables (search only)
  const cabs=S?state.cables.filter(c=>c.label&&hit(norm([c.label,c.notes,cspec(c),pfull(c.a),pfull(c.b)].join(' ')),T)):[];
  $('#sec-cab').hidden=!cabs.length;$('#n-cab').textContent=cabs.length||'';
  $('#cablist').innerHTML=cabs.slice(0,30).map(c=>`<li><button type="button" data-cab="${c.id}" class="${sel&&sel.kind==='cable'&&sel.id===c.id?'on':''}"><i class="sev info" style="background:${ccolor(c,AN.get(c.id))}"></i><span><b>${mk(c.label,T)}</b> ${esc(pfull(c.a))} ↔ ${esc(pfull(c.b))}</span></button></li>`).join('');
  const total_=rooms.length+racks.length+nHit+cabs.length;
  $('#rres').textContent=S?(total_?`${pl(total_,'Treffer','Treffer')} für „${q}“`:`Nichts gefunden für „${q}“`):'';$('#rres').hidden=!S;
  $('#sec-warn').hidden=S;$('#sec-leg').hidden=S;
  // warnings
  const nw=ISS.filter(i=>i.s!=='info').length,ni=ISS.length-nw;
  $('#n-warn').textContent=[nw?nw+' wichtig':'',ni?ni+' Info':''].filter(Boolean).join(' · ');
  $('#warnlist').innerHTML=ISS.length?ISS.map(i=>{const c=i.c&&state.cables.find(x=>x.id===i.c);return `<li><button type="button" ${i.dv?`data-dv="${i.dv}"`:i.rk?`data-rkw="${i.rk}"`:`data-cab="${i.c}"`}><i class="sev ${i.s}">${SEV[i.s].g}</i><span>${c?`<b>${esc(c.label||'Kabel')}</b> `:''}${esc(i.m)}</span></button></li>`}).join(''):'<li class="none">Keine Hinweise – alles stimmig.</li>';
}
function renderLegend(){
  $('#legend').innerHTML=Object.values(SP).map(s=>`<li><i style="--c:${s.c}"></i>${s.n}</li>`).join('')+`<li><svg width="26" height="8" aria-hidden="true"><path d="M3 4H25" stroke="#5b5b56" stroke-width="4.6" stroke-linecap="round" stroke-dasharray="0.1 7"/></svg>Verlegekabel (Panel-Rückseite)</li><li><i class="dash"></i>Kein Link</li><li><i style="--c:#ffe600;height:8px;outline:1.5px solid #111"></i>Gewählte Strecke</li><li><i class="sev err">!</i>Hinweis am Kabel</li><li><svg width="26" height="12" aria-hidden="true">${bolt(10,1.5)}</svg>PoE</li><li><svg width="26" height="12" aria-hidden="true"><circle cx="13" cy="6" r="5" fill="#2f7de1" stroke="#111" stroke-width="1.4"/></svg>Belegt – Gegenstelle ausgeblendet</li><li><svg width="26" height="12" aria-hidden="true"><rect x="1.5" y="1.5" width="23" height="9" rx="2" fill="none" stroke="#f08c00" stroke-width="3"/></svg>Veraltet (Kaufjahr)</li><li><svg width="26" height="12" aria-hidden="true"><rect x="1.5" y="1.5" width="23" height="9" rx="2" fill="none" stroke="#d6312b" stroke-width="3"/></svg>EOL – Lebensende</li><li><svg width="26" height="12" aria-hidden="true"><rect x="1" y="1" width="24" height="10" rx="1.5" fill="#fff" stroke="#000" stroke-opacity=".35"/></svg>Port-Beschriftung (Patchpanel)</li>`;
}
function renderTop(){const nh=HIDL.size,bv=$('#b-vis');bv.classList.toggle('act',nh>0);$('#vis-l').textContent=nh?nh+' ausgeblendet':'Ansicht';bv.title=nh?nh+' Objekte ausgeblendet – hier wieder einblenden':'Räume, Schränke, Geräte und Hosts ein- und ausblenden';renderVis();$('#b-undo').disabled=!H.u.length;$('#b-redo').disabled=!H.r.length;if(document.activeElement!==$('#proj'))$('#proj').value=state.name}

/* ================= inspector ================= */
const fld=(id,label,inner)=>`<label class="fld" for="${id}"><span>${label}</span>${inner}</label>`;
const inp=(id,f,val,a='')=>`<input id="${id}" data-f="${f}" value="${esc(val)}" ${a}>`;
const selx=(id,f,arr,val)=>`<select id="${id}" data-f="${f}">${opts(arr,val)}</select>`;
const txa=(id,f,val)=>`<textarea id="${id}" data-f="${f}" rows="2" maxlength="300">${esc(val)}</textarea>`;
const fo=(f,d)=>typeof f.o==='function'?f.o(d):f.o;
function fieldsHTML(d,m,part,scope,rowsO){
  scope=scope||'dev';
  const A=k=>m==='a'?`data-k="${k}"`:`data-f="${scope}.${k}"`,ID=k=>(m==='a'?'a-':'f-')+k;
  const one=k=>{const f=F[k];if(!f||(f.show&&!f.show(d)))return '';const id=ID(k);
    if(f.t==='text')return fld(id,f.l,`<input id="${id}" ${A(k)} value="${esc(d[k]??'')}" maxlength="${f.max}"${f.ph?` placeholder="${esc(typeof f.ph==='function'?f.ph(d):f.ph)}"`:''}>`);
    if(f.t==='num')return fld(id,f.l,`<input id="${id}" ${A(k)} type="number" min="${f.min}" max="${f.max}" step="${f.step||1}" inputmode="numeric" value="${esc(d[k]??'')}"${f.ph?` placeholder="${esc(typeof f.ph==='function'?f.ph(d):f.ph)}"`:''}>`);
    if(f.t==='sel')return fld(id,f.l,`<select id="${id}" ${A(k)}>${opts(fo(f,d),d[k]??'')}</select>`);
    if(f.t==='chk')return `<label class="chk"><input type="checkbox" id="${id}" ${A(k)}${d[k]?' checked':''}> ${f.l}</label>`;
    if(f.t==='seg'){const o=fo(f,d);return `<fieldset class="seg" style="grid-template-columns:repeat(${o.length>3?(o.length%3===0?3:2):o.length},minmax(0,1fr))"><legend>${f.l}</legend>${o.map(([v,t])=>`<label><input type="radio" name="${m}-${k}" ${A(k)} value="${esc(v)}"${String(d[k])===String(v)?' checked':''}><span>${esc(t)}</span></label>`).join('')}</fieldset>`}
    if(f.t==='pc')return `<fieldset class="pcs-f"><legend>Ports</legend><div class="pcs">${KIND[d.kind].types.map(t=>{const lab=t==='mgmt'?(STY[d.style].mg||'Mgmt')+'-Port':t==='kj'?'Buchsen':PT[t].n,mx=maxc(d,t),v=d.pc[t]||0,iid=id+'-'+t,at=m==='a'?`data-k="pc.${t}"`:`data-f="${scope}.pc.${t}"`;
      return m==='a'?`<label class="fld" for="${iid}"><span>${lab}</span><div class="stepper"><button type="button" data-step="${t}" data-d="-1" aria-label="${lab} weniger">−</button><input id="${iid}" ${at} type="number" min="0" max="${mx}" inputmode="numeric" value="${v}"><button type="button" data-step="${t}" data-d="1" aria-label="${lab} mehr">+</button></div></label>`:fld(iid,lab,`<input id="${iid}" ${at} type="number" min="0" max="${mx}" inputmode="numeric" value="${v}">`)}).join('')}</div></fieldset>`;
    return '';
  };
  const rows=rowsO||FORM[scope==='rack'||scope==='room'?scope:d.kind];let pi=rows.indexOf('pc');if(pi<0)pi=Math.ceil(rows.length/2);
  const use=part==='L'?rows.slice(0,pi):part==='R'?rows.slice(pi):rows;
  return use.map(r=>Array.isArray(r)?`<div class="grid2">${r.map(one).join('')}</div>`:one(r)).join('');
}
function renderInsp(){
  let h='';
  if(sel&&sel.kind==='dev'&&dev(sel.id))h=inspDev(dev(sel.id));
  else if(sel&&sel.kind==='port'&&dev(sel.dev)&&pexists(dev(sel.dev),sel.port))h=inspPort(dev(sel.dev),sel.port);
  else if(sel&&sel.kind==='cable'&&state.cables.some(c=>c.id===sel.id))h=inspCab(state.cables.find(c=>c.id===sel.id));
  else if(sel&&sel.kind==='rack'&&rackOf(sel.id))h=inspRack(rackOf(sel.id));
  else if(sel&&sel.kind==='room'&&roomOf(sel.id))h=inspRoom(roomOf(sel.id));
  else if(sel&&sel.kind==='multi'&&MS.size>1)h=inspMulti();
  else{sel=null;h=inspNone()}
  $('#ic').innerHTML=h;
}
function msToggle(id){if(!MS.size&&sel&&sel.kind==='dev'&&sel.id!==id)MS.add(sel.id);MS.has(id)?MS.delete(id):MS.add(id);msApply()}
function msApply(){if(!MS.size)select(null);else if(MS.size===1){const o=[...MS][0];select({kind:'dev',id:o})}else select({kind:'multi'})}
function inspMulti(){const L=[...MS].map(dev).filter(Boolean),free=L.filter(d=>!d.rack);
  return `<div class="ih"><span class="kind">Mehrfachauswahl</span><h2 id="ih-t">${pl(L.length,'Gerät','Geräte')} ausgewählt</h2><p class="sub">${free.length<L.length?`${pl(L.length-free.length,'Gerät steckt','Geräte stecken')} im Schrank und ${L.length-free.length===1?'bleibt':'bleiben'} beim Verschieben und Ausrichten an ${L.length-free.length===1?'seinem':'ihrem'} Platz.`:'Umschalt + Klick fügt hinzu oder entfernt, Umschalt + Ziehen auf freier Fläche zieht einen Rahmen.'}</p></div>
  <div class="mchips">${L.map(d=>`<button type="button" class="chip" data-act="mrem" data-id="${d.id}" title="Aus der Auswahl entfernen">${esc(trunc(d.name,24))} <span aria-hidden="true">×</span></button>`).join('')}</div>
  ${free.length>1?`<h3>Ausrichten</h3><div class="row"><button type="button" class="btn" data-act="malign" data-m="top">Oben bündig</button><button type="button" class="btn" data-act="malign" data-m="left">Links bündig</button></div><div class="row"><button type="button" class="btn" data-act="malign" data-m="dh">Waagerecht verteilen</button><button type="button" class="btn" data-act="malign" data-m="dv">Senkrecht verteilen</button></div>`:''}
  <h3>Für alle setzen</h3>
  <div class="mset">${fld('f-my','Kaufjahr',`<input id="f-my" type="number" min="1980" max="2100" inputmode="numeric" placeholder="z. B. 2021">`)}<button type="button" class="btn" data-act="mset" data-k="year">Übernehmen</button></div>
  ${state.devices.some(isSrc)?`<div class="mset">${fld('f-mpa','Netzteil A an',`<select id="f-mpa">${opts(srcOpts({id:'',kind:''}),'')}</select>`)}<button type="button" class="btn" data-act="mset" data-k="pa">Übernehmen</button></div>`:''}
  <div class="row"><button type="button" class="btn" data-act="mdup">Duplizieren</button><button type="button" class="btn" data-act="mhide">Ausblenden</button><button type="button" class="btn danger" data-act="mdel">Löschen</button></div>`}
async function msDelete(){const ids=new Set(MS);if(!ids.size)return;if(!(await ask(pl(ids.size,'Gerät','Geräte')+' löschen?','Die Geräte und alle ihre Kabel werden entfernt. Strg+Z holt sie zurück.','Löschen',true)))return;
  ck();state.cables=state.cables.filter(c=>!ids.has(c.a.d)&&!ids.has(c.b.d));state.devices=state.devices.filter(d=>!ids.has(d.id));MS.clear();sel=null;touched();renderAll();toast(pl(ids.size,'Gerät','Geräte')+' gelöscht')}
function msMove(dx,dy){const L=[...MS].map(dev).filter(d=>d&&!d.rack);if(!L.length)return;ck('msmove');for(const d of L){d.x+=dx;d.y+=dy}touched();renderAll()}
const TPLX=['id','x','y','rack','u','name','ip','mac','user','location','notes','year','pa','pb','_u'];
function tplCfg(d){const c=JSON.parse(JSON.stringify(d));for(const k of TPLX)delete c[k];c.ports={};for(const [k,v] of Object.entries(d.ports||{})){const o={...v};delete o.label;delete o.notes;if(Object.keys(o).length)c.ports[k]=o}if(c.disks)for(const v of Object.values(c.disks))delete v.ok;return c}
function saveTemplate(d){
  modal(`<form class="mbox" id="tplf" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="mh"><h2 id="m-t">Als Vorlage speichern</h2>${closeBtn}</div><p>Die Vorlage übernimmt Bauform, Ports, Port-Einstellungen, Optik und Festplatten – aber keine Namen, IPs oder Beschriftungen. Du findest sie unter „Hinzufügen“ bei ${esc(KIND[d.kind].n==='Host'?'Host':KIND[d.kind].n)}.</p>${fld('m-tn','Name der Vorlage',`<input id="m-tn" maxlength="40" value="${esc(d.model||d.name)}">`)}<div class="mf"><button type="button" class="btn" data-close>Abbrechen</button><button type="submit" class="btn pri">Speichern</button></div></form>`);
  $('#m-tn').select();
  $('#tplf').onsubmit=e=>{e.preventDefault();const n=$('#m-tn').value.trim().slice(0,40)||KIND[d.kind].n;ck();state.templates=state.templates||[];const ex=state.templates.find(t=>t.kind===d.kind&&t.name===n);if(ex)ex.cfg=tplCfg(d);else state.templates.push({id:'t'+rid(),name:n,kind:d.kind,cfg:tplCfg(d)});touched();closeModal();toast(`Vorlage „${n}“ ${ex?'aktualisiert':'gespeichert'}`)}}
function inspNone(){
  const tot=state.devices.reduce((a,d)=>a+total(d),0),used=state.devices.reduce((a,d)=>a+usedPorts(d),0);
  return `<div class="ih"><span class="kind">Projekt</span><h2>${esc(state.name)}</h2><p class="sub">${pl(state.racks.length,'Schrank','Schränke')} · ${pl(state.rooms.length,'Raum','Räume')}. Klicke auf ein Gerät, einen Port, ein Kabel, einen Schrank oder einen Raum.</p></div>
  <div class="stats"><div><b>${state.devices.length}</b><span>Geräte</span></div><div><b>${state.cables.length}</b><span>Kabel</span></div><div><b>${used}/${tot}</b><span>Ports belegt</span></div></div>
  ${fld('f-proj','Projektname',inp('f-proj','proj.name',state.name,'maxlength="80"'))}
  <h3>Darstellung</h3>
  ${fld('f-vl','Kabelbeschriftung im Plan',selx('f-vl','view.labelMode',[['num','Kabelnummer'],['spec','Nummer + Kabeltyp'],['off','Aus']],state.view.labelMode))}
  ${fld('f-vc','Kabel einfärben',selx('f-vc','view.colorBy',[['speed','nach Link-Geschwindigkeit'],['cable','nach echter Kabelfarbe']],state.view.colorBy))}
  <h3>Lebenszyklus</h3>
  <div class="grid2">${fld('f-lo','Veraltet nach (Jahren)',`<input id="f-lo" data-f="life.old" type="number" min="1" max="50" inputmode="numeric" value="${state.life.old}">`)}${fld('f-le','EOL nach (Jahren)',`<input id="f-le" data-f="life.eol" type="number" min="1" max="60" inputmode="numeric" value="${state.life.eol}">`)}</div>
  ${(()=>{let o=0,e=0,n=0;for(const d of state.devices){const z=lcs(d);if(!z)continue;n++;if(z.s==='eol')e++;else if(z.s==='old')o++}return `<p class="note">Gilt für alle Geräte mit Kaufjahr – einzelne Geräte können eigene Werte haben. ${n?`${e?`<button type="button" class="link" data-act="q" data-q="EOL">${pl(e,'Gerät','Geräte')} EOL</button>`:'Kein Gerät EOL'} · ${o?`<button type="button" class="link" data-act="q" data-q="veraltet">${o} veraltet</button>`:'keins veraltet'} · ${n} mit Kaufjahr`:'Noch kein Gerät hat ein Kaufjahr.'}</p>`})()}
  <h3>So geht’s</h3>
  <ol class="help"><li>„Hinzufügen“ oben legt Geräte, Schränke und Räume an.</li><li>Ein Klick auf einen Port markiert die ganze Strecke gelb – Kabel, Patchpanel und Gegenport.</li><li>Von einem Port auf einen freien Port ziehen steckt ein Kabel.</li><li>Rack-Geräte in einen Schrank ziehen: Sie rasten in der HE ein, der Schrank wächst mit. Freie HE anklicken baut dort ein neues Gerät ein.</li><li>Räume an der Titelleiste verschieben – ihr Inhalt wandert mit. Die Größe stellst du an der Ecke unten rechts ein.</li><li>Patchpanel-Ports haben Vorder- und Rückseite: Hosts und Access Points landen hinten (Verlegekabel, gepunktet).</li><li>Die Suche links findet Geräte, Personen, IPs und Port-Beschriftungen – z. B. „PC Max Mustermann“. Ein Klick auf ein Gerät markiert alle seine Verbindungen.</li><li>„Ansicht“ oben blendet ganze Kategorien oder einzelne Räume, Schränke, Geräte und Hosts aus – Hosts verschwinden samt Kabel, belegte Ports zeigen dann einen Punkt.</li><li>Mit Kaufjahr markiert der Plan veraltete Geräte orange und Geräte am Lebensende (EOL) rot.</li><li>Umschalt + Klick, Umschalt + Ziehen oder der Auswahlknopf unten rechts wählt mehrere Geräte gleichzeitig.</li><li>„Topologie“ zeigt das logische Netz automatisch, „Listen“ enthält Kabel, Strecken, Geräte, VLANs & IPs, Strom und Material – jeweils als CSV.</li><li>Unter „Datei“: PDF-Dokumentation, Etiketten mit QR-Code und der Versionsverlauf.</li><li>Entf löscht die Auswahl, Strg+Z macht rückgängig.</li></ol>`;
}
function peerText(d,p){
  const c=cabOf(d.id,p.id,'f')||cabOf(d.id,p.id,'r');if(!c)return '–';
  const ch=AN.get(c.id).ch,me=(e)=>e&&e.d===d.id&&e.p===p.id,far=me(ch.A)?ch.B:me(ch.B)?ch.A:null;
  if(far&&ch.steps.length>1){const via=ch.steps.slice(0,-1).map(s=>dev(s.to.d).name).filter((v,i,a)=>a.indexOf(v)===i);return `${esc(trunc(dev(far.d).name,18))} · ${esc(pname(dev(far.d),far.p))}<small>über ${esc(via.join(', '))}</small>`}
  const o=(c.a.d===d.id&&c.a.p===p.id)?c.b:c.a;return `${esc(trunc(dev(o.d).name,18))} · ${esc(pname(dev(o.d),o.p))}`;
}
function netHTML(d,L){let h='';const hv=HVL.get(d.id),inf=IPI&&IPI.get(d.id);
  const sub=state.vlans.filter(v=>vnet(v));
  if(hv){const V=vlanOf(hv),S=vnet(V);h+=`<div class="vbox" style="--vc:${vcol(hv)}"><b>${esc(vshort(hv))}</b><span>${S?S.txt+(V.gw?' · Gateway '+esc(V.gw):''):'Über den Switch-Port zugeordnet'}</span>${S&&(!d.ip||inf&&inf.wrong)?`<button type="button" class="btn sm" data-act="freeip" data-v="${hv}">Nächste freie IP${freeIp(V)?' ('+freeIp(V)+')':''}</button>`:''}</div>`}
  else if(sub.length&&!d.ip)h+=`<p class="note">Freie IP vergeben aus: ${sub.map(v=>`<button type="button" class="link" data-act="freeip" data-v="${v.id}">${esc(vshort(v.id))}</button>`).join(' · ')}</p>`;
  if(inf&&(inf.dup||inf.wrong||inf.bad))h+=`<p class="note"><span class="wtag">${inf.dup?'IP doppelt vergeben':inf.bad?'Keine gültige IP':'IP passt nicht zum Subnetz'}</span></p>`;
  const vp=L.ports.filter(p=>vlanPort(d,p.id)&&p.num);
  if(vp.length>1&&state.vlans.length){const nums=vp.map(p=>p.num);h+=`<details class="vbulk"><summary>VLAN für mehrere Ports setzen</summary><div class="grid3">${fld('f-vb1','Von Port',`<input id="f-vb1" type="number" min="${Math.min(...nums)}" max="${Math.max(...nums)}" value="${Math.min(...nums)}">`)}${fld('f-vb2','Bis Port',`<input id="f-vb2" type="number" min="${Math.min(...nums)}" max="${Math.max(...nums)}" value="${Math.max(...nums)}">`)}${fld('f-vb3','VLAN',`<select id="f-vb3">${opts([['','– entfernen –'],...state.vlans.map(v=>[String(v.id),vshort(v.id)]),['trunk','Trunk (alle VLANs)']],String(state.vlans[0].id))}</select>`)}</div><button type="button" class="btn wide" data-act="vbulk">Übernehmen</button></details>`}
  return h}
const hideBtn=id=>`<button type="button" class="btn" data-act="hide" data-id="${id}">${HIDL.has(id)?'Einblenden':'Ausblenden'}</button>`;
function lcBox(d){const z=lcs(d);if(!z)return '<p class="note lcn">Trage ein Kaufjahr ein, dann markiert der Plan das Gerät, sobald es veraltet ist oder sein Lebensende (EOL) erreicht.</p>';
  if(z.s==='ok')return `<div class="lcbox ok"><b>Im Lebenszyklus</b><span>Kauf ${d.year} · ${pl(Math.max(0,z.age),'Jahr','Jahre')} alt · veraltet ab ${z.oy}, EOL ab ${z.ey}</span></div>`;
  return `<div class="lcbox ${z.s}"><b>${z.s==='eol'?'EOL – Lebensende erreicht':'Veraltet'}</b><span>Kauf ${d.year} · ${z.age} Jahre alt · ${z.s==='eol'?`EOL seit ${z.ey}`:`EOL ab ${z.ey}`}</span></div>`}
const RAIDC=['#2563eb','#16a34a','#9333ea','#db2777','#0891b2','#ea580c','#4f46e5','#0d9488'];
const RAIDL={'0':{n:'RAID 0',min:1,cap:(n,m)=>n*m},'1':{n:'RAID 1',min:2,cap:(n,m)=>m},'5':{n:'RAID 5',min:3,cap:(n,m)=>(n-1)*m},'6':{n:'RAID 6',min:4,cap:(n,m)=>(n-2)*m},'10':{n:'RAID 10',min:4,even:1,cap:(n,m)=>Math.floor(n/2)*m},'50':{n:'RAID 50',min:6,cap:(n,m)=>(n-2)*m},'60':{n:'RAID 60',min:8,cap:(n,m)=>(n-4)*m},'z1':{n:'RAID-Z1',min:3,cap:(n,m)=>(n-1)*m},'z2':{n:'RAID-Z2',min:3,cap:(n,m)=>(n-2)*m},'z3':{n:'RAID-Z3',min:4,cap:(n,m)=>(n-3)*m},'jbod':{n:'JBOD',min:1,sum:1}};
/* ---------- Stromversorgung ---------- */
const AMPW={'10':2300,'16':3680,'32':7360,'3x16':11040};
let PW=new Map();
const isSrc=d=>d&&(d.kind==='ups'||d.kind==='pdu');
const pwrDev=d=>['switch','fw','net','server','host','pdu'].includes(d.kind)&&!(d.kind==='host'&&d.pd);
function upsCap(d){return Math.round(+d.va*({vfi:.9,vi:.7,vfd:.6}[d.topo]||.7))}
const srcCap=d=>d.kind==='ups'?(+d.uw||upsCap(d)):AMPW[d.amp]||3680;
function feedsOf(d){if(!pwrDev(d))return [];const f=[d.pa];if(d.psu==='2'&&d.kind!=='pdu')f.push(d.pb);return f.filter(id=>id&&isSrc(dev(id))&&id!==d.id)}
function srcOpts(d){const bad=new Set([d.id]);if(d.kind==='pdu'){let ch=true;while(ch){ch=false;for(const x of state.devices)if(x.kind==='pdu'&&!bad.has(x.id)&&bad.has(x.pa)){bad.add(x.id);ch=true}}}
  return [['','Steckdose / nicht erfasst'],...state.devices.filter(x=>isSrc(x)&&!bad.has(x.id)).map(x=>[x.id,`${x.name} (${x.kind==='ups'?'USV':'PDU'})`])]}
function poeLoad(d){if(d.kind!=='switch')return 0;let w=0;for(const p of lay(d).ports){if(p.type!=='rj45'||!ppoe(d,p.id))continue;const c=cabOf(d.id,p.id,'f');if(!c)continue;const ch=AN.get(c.id)&&AN.get(c.id).ch;if(!ch)continue;const me=e=>e&&e.d===d.id&&e.p===p.id,far=me(ch.A)?ch.B:me(ch.B)?ch.A:null,x=far&&dev(far.d);if(x&&needsPoe(x))w+=x.kind==='ap'?{af:13,at:25,bt:45}[x.poeStd]||25:x.sub==='camera'?8:x.sub==='phone'?6:10}return w}
function estW(d){const n=t=>d.pc[t]||0;
  if(d.kind==='switch')return Math.round(25+.8*n('rj45')+1.5*(n('sfp')+n('sfpp')+n('sfp28'))+6*(n('qsfpp')+n('qsfp28'))+poeLoad(d));
  if(d.kind==='fw')return Math.round(30+.8*n('rj45')+1.5*(n('sfp')+n('sfpp')+n('sfp28'))+6*n('qsfp28'));
  if(d.kind==='net')return 15;
  if(d.kind==='server'){const DI=d.bays?diskInfo(d):null;return (d.he>=4?700:d.he>=2?400:250)+(DI?DI.list.reduce((a,x)=>a+(x.t==='SSD'?3:8),0):0)}
  if(d.kind==='host')return {pc:90,laptop:40,printer:50,phone:6,camera:8,nas:45,tv:70,iot:5,other:25}[d.sub]||25;
  if(d.kind==='ap')return {af:13,at:25,bt:45}[d.poeStd]||25;
  return 0}
function powerCalc(){PW=new Map();const memo=new Map(),busy=new Set();
  const W=d=>{if(d.kind==='pdu')return L(d).load;return +d.watt||estW(d)};
  const L=src=>{if(memo.has(src.id))return memo.get(src.id);if(busy.has(src.id))return {load:0,list:[]};busy.add(src.id);let load=0;const list=[];
    for(const x of state.devices){const f=feedsOf(x);const k=f.filter(id=>id===src.id).length;if(!k)continue;const w=W(x)*k/f.length;load+=w;list.push({d:x,w,ab:x.pa===src.id&&x.pb===src.id&&x.psu==='2'?'A+B':x.pa===src.id?'A':'B'})}
    busy.delete(src.id);const cap=srcCap(src),r={load,list,cap,pct:cap?load/cap*100:0,plugs:list.length};if(src.kind==='ups'&&+src.bat&&load>0)r.min=Math.min(999,Math.round(+src.bat*.9/load*60));memo.set(src.id,r);return r};
  for(const d of state.devices)if(isSrc(d))PW.set(d.id,L(d));return W}
let devW=d=>+d.watt||estW(d);
function powerHTML(d){if(!(pwrDev(d)||isSrc(d)))return d.kind==='ap'?'<h3>Stromversorgung</h3><p class="note">Wird per PoE vom Switch versorgt.</p>':'';
  const rows=d.kind==='ups'?['uw','bat']:d.kind==='pdu'?['pa']:d.kind==='host'?['watt','pa']:['watt','psu',['pa','pb']];
  let h='<h3>Stromversorgung</h3>'+fieldsHTML(d,'i',null,'dev',rows);
  if(pwrDev(d)&&d.kind!=='pdu'){const f=feedsOf(d);h+=`<p class="note">${+d.watt?d.watt+' W':'Etwa '+estW(d)+' W (geschätzt'+(d.kind==='switch'&&poeLoad(d)?', davon '+poeLoad(d)+' W PoE':'')+')'}${f.length?' · versorgt über '+f.map(id=>esc(dev(id).name)).join(' + '):' · keine USV/PDU zugeordnet'}</p>`}
  const P=PW.get(d.id);if(P){const col=P.pct>100?'#d0342c':P.pct>=80?'#f08c00':'#16a34a';
    h+=`<div class="pload"><div class="pbar"><i style="width:${Math.min(100,P.pct).toFixed(1)}%;background:${col}"></i></div><b>${Math.round(P.load)} W von ${P.cap} W · ${Math.round(P.pct)} %</b><span>${d.kind==='pdu'?`${P.plugs} von ${(+d.o13||0)+(+d.o19||0)} Steckdosen belegt · ${de(String(+(P.load/230).toFixed(1)))} A`:P.min!=null?`Laufzeit ca. ${P.min} min`:'Akku (Wh) eintragen, um die Laufzeit zu schätzen'}</span></div>`;
    if(P.list.length)h+=`<ul class="rcont">${P.list.map(x=>`<li><button type="button" class="link" data-act="seldev" data-id="${x.d.id}">${esc(x.d.name)}</button> <small>${Math.round(x.w)} W · ${x.d.kind==='pdu'?'Eingang':'Netzteil '+x.ab}</small></li>`).join('')}</ul>`;
    else h+='<p class="note">Noch keine Geräte angeschlossen – am Gerät unter „Stromversorgung“ auswählen.</p>'}
  return h}
const fmtTB=v=>v>=1?de(String(+v.toFixed(v>=10?1:2)))+' TB':Math.round(v*1000)+' GB';
const fmtCap=o=>o&&+o.c>0?`${de(String(+o.c))} ${o.u||'TB'}`:'';
let raidEdit=null;
/* Platten eines Servers: Größe in TB, Ausreißer (> 5 TB vom mittleren Wert – Median – der übrigen Platten, damit ein Tippfehler nicht alle markiert), Summe ohne unquittierte Ausreißer */
function diskInfo(d){const used=clamp(+d.baysUsed||0,0,+d.bays||0),dk=d.disks||{},def=d.bayForm==='3.5'?'HDD':'SSD',list=[];
  for(let i=0;i<used;i++){const o=dk[i]||{},tb=+o.c>0?+o.c*(o.u==='GB'?.001:1):null;list.push({i,o,tb,t:o.t||def,ok:!!o.ok,out:false,dev:0})}
  const known=list.filter(x=>x.tb!=null);
  for(const x of known){const rest=known.filter(y=>y!==x).map(y=>y.tb).sort((a,b)=>a-b);if(!rest.length)continue;const m=rest.length>>1,mid=rest.length%2?rest[m]:(rest[m-1]+rest[m])/2;x.dev=x.tb-mid;x.out=Math.abs(x.dev)>5}
  const pend=known.filter(x=>x.out&&!x.ok),total=known.filter(x=>!(x.out&&!x.ok)).reduce((a,x)=>a+x.tb,0);
  return {used,list,known,pend,total}}
const raidOf=(d,i)=>(d.raids||[]).find(r=>r.disks.includes(i));
function raidInfo(d,r,DI){const L=RAIDL[r.lvl]||RAIDL['5'],mem=r.disks.filter(i=>i<DI.used).map(i=>DI.list[i]),n=mem.length,w=[];
  if(n<L.min)w.push(`${L.n} braucht mindestens ${L.min} Platten`);if(L.even&&n%2)w.push(`${L.n} braucht eine gerade Anzahl Platten`);
  const types=new Set(mem.map(x=>x.t));if(types.size>1)w.push('HDD und SSD gemischt');
  const sz=mem.filter(x=>x.tb!=null&&!(x.out&&!x.ok)).map(x=>x.tb);let net=null;
  if(n&&sz.length===n){if(L.sum)net=sz.reduce((a,b)=>a+b,0);else if(n>=L.min&&!(L.even&&n%2)){net=L.cap(n,Math.min(...sz));if(new Set(sz.map(v=>v.toFixed(3))).size>1)w.push('Unterschiedliche Größen – die kleinste Platte zählt')}}
  if(mem.some(x=>x.out&&!x.ok))w.push('Enthält eine nicht quittierte Platte');
  return {n,net,w,L}}
function diskHTML(d){const DI=diskInfo(d),ed=raidEdit&&raidEdit.dev===d.id?raidEdit.id:null;
  let h=`<div id="disksec"><h3>Laufwerke</h3><p class="note">${DI.used} von ${d.bays} Slots belegt · ${d.bayForm.replace('.',',')}″${DI.total?` · <b>${fmtTB(DI.total)}</b> brutto`:''}${DI.pend.length?` · <span class="wtag">${pl(DI.pend.length,'Platte','Platten')} prüfen</span>`:''}. Größe und Typ sind freiwillig – ein Klick auf eine Platte im Plan springt hierher.</p>`;
  if(DI.used){h+='<div class="dlist">'+DI.list.map(x=>{const r=raidOf(d,x.i),warn=x.out&&!x.ok;
    return `<div class="drow${warn?' warn':''}${x.out&&x.ok?' okd':''}"${r?` style="--rc:${RAIDC[r.col%RAIDC.length]}"`:''}><label for="f-disk-${x.i}" class="dn">${x.i+1}${r?`<i title="${esc(r.name)}"></i>`:''}</label><input id="f-disk-${x.i}" data-f="disk.${x.i}.c" value="${x.o.c!=null?esc(de(String(x.o.c))):''}" inputmode="decimal" placeholder="Größe" autocomplete="off" aria-label="Slot ${x.i+1} Größe"><select id="f-du-${x.i}" data-f="disk.${x.i}.u" aria-label="Slot ${x.i+1} Einheit">${opts([['TB','TB'],['GB','GB']],x.o.u||'TB')}</select><select id="f-dt-${x.i}" data-f="disk.${x.i}.t" aria-label="Slot ${x.i+1} Typ">${opts([['HDD','HDD'],['SSD','SSD']],x.t)}</select>${warn?`<p class="dw">Weicht um ${fmtTB(Math.abs(x.dev))} vom mittleren Wert (Median) der übrigen Platten ab und zählt erst nach dem Quittieren mit. <button type="button" class="btn sm" data-act="diskok" data-i="${x.i}">Stimmt so – quittieren</button></p>`:''}</div>`}).join('')+'</div>'}
  h+=`<h3>RAID</h3>`;
  for(const r of d.raids||[]){const I=raidInfo(d,r,DI),c=RAIDC[r.col%RAIDC.length],on=ed===r.id;
    h+=`<div class="raid${on?' ed':''}" style="--rc:${c}"><div class="rhd"><i class="sw"></i><input id="f-rn-${r.id}" data-f="raid.${r.id}.name" value="${esc(r.name)}" maxlength="30" aria-label="Name des Verbunds"><select id="f-rl-${r.id}" data-f="raid.${r.id}.lvl" aria-label="RAID-Level">${opts(Object.entries(RAIDL).map(([k,v])=>[k,v.n]),r.lvl)}</select></div>
      <div class="rchips" role="group" aria-label="Platten im Verbund">${DI.list.map(x=>{const o=raidOf(d,x.i),mine=o&&o.id===r.id;return `<button type="button" class="dchip${mine?' on':''}" data-act="raidtog" data-r="${r.id}" data-i="${x.i}" aria-pressed="${!!mine}"${o&&!mine?` disabled title="gehört zu ${esc(o.name)}"`:''}>${x.i+1}</button>`}).join('')||'<span class="note">Keine befüllten Slots</span>'}</div>
      <p class="rinfo">${pl(I.n,'Platte','Platten')}${I.net!=null?` · <b>${fmtTB(I.net)} nutzbar</b>`:''}${I.w.map(t=>`<br><span class="wtag">${esc(t)}</span>`).join('')}</p>
      <div class="row"><button type="button" class="btn${on?' pri':''}" data-act="raidedit" data-r="${r.id}">${on?'Fertig':'Im Plan auswählen'}</button><button type="button" class="btn danger" data-act="raiddel" data-r="${r.id}">Entfernen</button></div></div>`}
  h+=`<button type="button" class="btn wide" data-act="raidadd"${DI.used?'':' disabled'}>RAID hinzufügen</button>${ed?'<p class="note">Platten im Plan anklicken oder oben die Nummern antippen, um sie dem Verbund zuzuordnen.</p>':''}</div>`;
  return h}
function refreshDisks(){setTimeout(()=>{const sec=$('#disksec'),d=sel&&sel.kind==='dev'&&dev(sel.id);if(!sec||!d)return;const a=document.activeElement,id=a&&a.id,pos=a&&a.tagName==='INPUT'?a.selectionStart:null;sec.outerHTML=diskHTML(d);if(id){const e=document.getElementById(id);if(e){e.focus();if(pos!=null)try{e.setSelectionRange(pos,pos)}catch(_){}}}},0)}
function raidToggle(d,rid_,i){const r=(d.raids||[]).find(x=>x.id===rid_);if(!r||i>=(+d.baysUsed||0))return;const o=raidOf(d,i);if(o&&o.id!==r.id){toast(`Slot ${i+1} gehört schon zu „${o.name}“`);return}
  ck('raid'+r.id);if(o)r.disks=r.disks.filter(x=>x!==i);else r.disks=[...r.disks,i].sort((a,b)=>a-b);touched();renderAll()}
function inspDev(d){
  const L=lay(d),pas=KIND[d.kind].types.every(isPas),w=whereAll(d);
  const rows=L.ports.map(p=>{const cf=pconf(d,p.id);
    if(pas){const side=s=>{const c=cabOf(d.id,p.id,s);if(!c)return '–';const o=(c.a.d===d.id&&c.a.p===p.id&&(c.a.s==='r'?'r':'f')===s)?c.b:c.a;return `${esc(trunc(dev(o.d).name,16))} · ${esc(pname(dev(o.d),o.p))}`};return `<tr tabindex="0" data-sp="${p.id}"><td class="num">${p.num}</td><td>${esc(cf.label||'')}</td><td>${side('f')}</td><td>${side('r')}</td></tr>`}
    const sp=pspeed(d,p.id);return `<tr tabindex="0" data-sp="${p.id}"><td class="num">${p.lbl?esc(p.lbl):p.type==='mgmt'?esc(STY[d.style].mg):p.num}</td><td class="nw">${PT[p.type].n}</td><td class="nw"><i class="dot" style="--c:${cf.off?'#8a8f96':SP[sp].c}"></i>${de(sp)}</td><td>${esc(cf.label||'')}${cf.off?' <em>(aus)</em>':''}</td><td>${peerText(d,p)}</td></tr>`}).join('');
  return `<div class="ih"><span class="kind">${KIND[d.kind].n}${d.kind==='host'||d.kind==='net'?' · '+subLbl(d):''}</span><h2 id="ih-t">${esc(d.name)}</h2><p class="sub">${w?esc(w)+' · ':''}${esc(summary(d))} · ${usedPorts(d)}/${total(d)} belegt</p></div>
  ${lcBox(d)}
  ${fieldsHTML(d,'i')}
  ${fld('f-notes','Notizen',`<textarea id="f-notes" data-f="dev.notes" rows="2" maxlength="500">${esc(d.notes)}</textarea>`)}
  <div class="row"><button type="button" class="btn" data-act="dup">Duplizieren</button><button type="button" class="btn" data-act="tplsave">Als Vorlage</button>${store.kind==='server'?`<button type="button" class="btn" data-act="qr" data-k="dev" data-id="${d.id}">QR-Code</button>`:''}${hideBtn(d.id)}<button type="button" class="btn danger" data-act="deldev">Löschen</button></div>
  ${netHTML(d,L)}
  ${powerHTML(d)}
  ${d.kind==='server'&&d.bays?diskHTML(d):''}
  ${L.ports.length?`<h3>Ports</h3><div class="scroll"><table class="ptab"><thead><tr>${pas?'<th>Nr.</th><th>Beschriftung</th><th>Vorderseite</th><th>Rückseite</th>':'<th>Nr.</th><th>Typ</th><th>Tempo</th><th>Beschriftung</th><th>Verbunden mit</th>'}</tr></thead><tbody>${rows}</tbody></table></div>`:'<p class="note">Dieses Gerät hat keine Netzwerkports.</p>'}`;
}
function inspRack(r){
  const G=rgeom(r),occ=new Map();for(const d of G.devs)occ.set(d.u,d);
  let rows='',u=1;
  while(u<=G.n){const d=occ.get(u);if(d){rows+=`<tr tabindex="0" data-dv="${d.id}"><td class="num">${heTxt(d).replace('HE ','')}</td><td><b>${esc(d.name)}</b></td><td>${esc(KIND[d.kind].n)}</td></tr>`;u+=d.he}else{let e=u;while(e+1<=G.n&&!occ.get(e+1)&&!G.devs.some(x=>x.u<=e+1&&x.u+x.he-1>=e+1))e++;rows+=`<tr tabindex="0" data-slotrow="${u}"><td class="num">${u===e?u:u+'–'+e}</td><td colspan="2" class="mute">frei – klicken zum Einbauen</td></tr>`;u=e+1}}
  const rr=rackRoom(r);
  return `<div class="ih"><span class="kind">Schrank${rr?' · '+esc(rr.name):''}</span><h2 id="ih-t">${esc(r.name)}</h2><p class="sub">${r.rsize}″ · ${G.n} HE${r.minHe?'':' · wächst beim Einbauen mit'} · ${G.heUsed} HE belegt</p></div>
  ${fieldsHTML(r,'i',null,'rack')}
  ${fld('f-notes','Notizen',`<textarea id="f-notes" data-f="rack.notes" rows="2" maxlength="500">${esc(r.notes)}</textarea>`)}
  <div class="row"><button type="button" class="btn pri" data-act="addin" data-id="${r.id}">Gerät einbauen</button>${hideBtn(r.id)}<button type="button" class="btn danger" data-act="delrack">Löschen</button></div>
  <h3>Belegung</h3><div class="scroll"><table class="ptab"><thead><tr><th>HE</th><th>Gerät</th><th>Typ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function roomItems(rm){const inn=(x,y)=>x>=rm.x&&x<=rm.x+rm.w&&y>=rm.y&&y<=rm.y+rm.h;const its=[];for(const r of state.racks){const G=rgeom(r);if(inn(r.x+G.W/2,r.y+Math.min(G.H/2,HEAD+U)))its.push({t:'rack',o:r})}for(const d of state.devices){if(d.rack)continue;const L=lay(d);if(inn(d.x+L.W/2,d.y+L.H/2))its.push({t:'dev',o:d})}return its}
function inspRoom(rm){
  const its=roomItems(rm),C=roomContents(rm),hs=C.devs.filter(d=>d.kind==='host'),nd=C.devs.length-hs.length;
  const loose=C.devs.filter(d=>!d.rack||!C.racks.some(r=>r.id===d.rack));
  const lnk=d=>`<button type="button" class="link" data-act="seldev" data-id="${d.id}">${esc(d.name)}</button>`;
  const groups=new Map();for(const d of loose){const [k,n]=catOf(d);if(!groups.has(k))groups.set(k,{n,l:[]});groups.get(k).l.push(d)}
  const gk=[...catOrder.filter(k=>groups.has(k)),...[...groups.keys()].filter(k=>!catOrder.includes(k))];
  return `<div class="ih"><span class="kind">Raum</span><h2 id="ih-t">${esc(rm.name)}</h2><p class="sub">Größe an der Ecke unten rechts ziehen · Verschieben an der Titelleiste</p></div>
  <div class="stats"><div><b>${C.racks.length}</b><span>${C.racks.length===1?'Schrank':'Schränke'}</span></div><div><b>${nd}</b><span>Geräte</span></div><div><b>${hs.length}</b><span>Hosts</span></div></div>
  ${fieldsHTML(rm,'i',null,'room')}
  ${fld('f-notes','Notizen',`<textarea id="f-notes" data-f="room.notes" rows="2" maxlength="500">${esc(rm.notes)}</textarea>`)}
  <div class="row"><button type="button" class="btn" data-act="fitroom"${its.length?'':' disabled'}>An Inhalt anpassen</button>${hideBtn(rm.id)}<button type="button" class="btn danger" data-act="delroom">Löschen</button></div>
  ${C.racks.length?`<h3>Schränke im Raum</h3><ul class="rcont">${C.racks.map(r=>{const G=rgeom(r);return `<li><button type="button" class="link" data-act="selrack" data-id="${r.id}">${esc(r.name)}</button> <small>${r.rsize}″ · ${G.heUsed}/${G.n} HE</small>${G.devs.length?`<ul>${G.devs.map(d=>`<li>${lnk(d)} <small>${esc(heTxt(d))}</small></li>`).join('')}</ul>`:''}</li>`}).join('')}</ul>`:''}
  ${gk.length?`<h3>${C.racks.length?'Außerhalb der Schränke':'Im Raum'}</h3><ul class="rcont">${gk.map(k=>{const g=groups.get(k);return `<li><small>${esc(g.n)} · ${g.l.length}</small><ul>${g.l.map(d=>`<li>${lnk(d)}${d.user?` <small>${esc(d.user)}</small>`:''}${HID.has(d.id)?' <small>· ausgeblendet</small>':''}</li>`).join('')}</ul></li>`}).join('')}</ul>`:''}
  ${!C.racks.length&&!loose.length?'<p class="note">Der Raum ist noch leer. Ziehe Schränke oder Geräte hinein – sie wandern dann beim Verschieben mit.</p>':''}`;
}
function connBlock(d,pid,side){
  const s=side||'f',c=cabOf(d.id,pid,s);
  if(c){const me=(c.a.d===d.id&&c.a.p===pid&&(c.a.s==='r'?'r':'f')===s)?'a':'b',o=c[me==='a'?'b':'a'],inf=AN.get(c.id);
    return `<div class="conn"><span class="cl" style="--c:${ccolor(c,inf)}"></span><div><b>${esc(pfull(o))}</b><small>${esc(c.label||'Kabel')} · ${esc(cspec(c))} · ${inf.nolink?'kein Link':inf.speed?SP[inf.speed].n:'passiv'}</small></div></div><div class="row"><button type="button" class="btn" data-act="selcab" data-id="${c.id}">Kabel bearbeiten</button><button type="button" class="btn" data-act="goport" data-d="${o.d}" data-p="${o.p}">Zum Gegenport</button></div><button type="button" class="btn danger wide" data-act="delcab" data-id="${c.id}">Kabel abziehen</button>`}
  const list=state.devices.map(od=>{const fr=lay(od).ports.filter(p=>!(od.id===d.id&&p.id===pid)&&(isPas(p.type)?(!cabOf(od.id,p.id,'f')||!cabOf(od.id,p.id,'r')):!cabOf(od.id,p.id,'f')));return fr.length?`<optgroup label="${esc(od.name)}">${fr.map(p=>{const l=pconf(od,p.id).label;return `<option value="${od.id}:${p.id}">${esc(pname(od,p.id))} · ${PT[p.type].n}${l?' – '+esc(trunc(l,24)):''}</option>`}).join('')}</optgroup>`:''}).join('');
  const id='f-pconn'+(side||'');
  return fld(id,'Verbinden mit',`<select id="${id}" data-conn="1" data-side="${side||''}"><option value="">Port wählen …</option>${list}</select>`)+(side==='r'?'':'<p class="note">Oder im Plan von diesem Port auf einen freien Port ziehen.</p>');
}
function pathHTML(ch){
  const S=ch.steps;if(!S.length)return '';
  const nd=(e,note)=>`<li class="nd"><button type="button" class="link" data-act="goport" data-d="${e.d}" data-p="${e.p}">${esc(dev(e.d).name)} · ${esc(pname(dev(e.d),e.p))}</button>${note?` <small>${note}</small>`:''}</li>`;
  const cb=c=>`<li class="cb"><button type="button" class="link" data-act="selcab" data-id="${c.id}">${esc(c.label||'Kabel')}</button> <small>${esc(cspec(c))}</small></li>`;
  let h=nd(S[0].from,isPas(ptype(S[0].from.p))?'Strecke endet hier':'');
  S.forEach((s,i)=>{h+=cb(s.c);h+=nd(s.to,isPas(ptype(s.to.p))?(i===S.length-1?'Strecke endet hier':'Vorderseite ⇄ Rückseite'):'')});
  return `<ol class="path">${h}</ol>`;
}
function farSummary(d,pid){
  const c=cabOf(d.id,pid,'f')||cabOf(d.id,pid,'r');if(!c)return '';
  const ch=AN.get(c.id).ch,me=e=>e&&e.d===d.id&&e.p===pid,far=me(ch.A)?ch.B:me(ch.B)?ch.A:null;if(!far)return '';
  const fd=dev(far.d);return `<div class="far"><span>Gegenstelle</span><b>${esc(fd.name)} · ${esc(pname(fd,far.p))}</b>${where(fd)?`<small>${esc(where(fd))}</small>`:''}<button type="button" class="btn" data-act="goport" data-d="${far.d}" data-p="${far.p}">Hinspringen</button></div>`;
}
function vlanUI(d,pid,cf){const tr=cf.vm==='trunk',vo=[['','– kein VLAN –'],...state.vlans.map(v=>[String(v.id),vshort(v.id)])];
  let h=`<fieldset class="seg" style="grid-template-columns:repeat(2,minmax(0,1fr))"><legend>VLAN-Modus</legend><label><input type="radio" name="pvm" data-f="port.vm" value="access"${tr?'':' checked'}><span>Access (untagged)</span></label><label><input type="radio" name="pvm" data-f="port.vm" value="trunk"${tr?' checked':''}><span>Trunk (tagged)</span></label></fieldset>`;
  h+=fld('f-pvl',tr?'Native VLAN (untagged)':'VLAN',`<select id="f-pvl" data-f="port.vlan">${opts(vo,cf.vlan?String(cf.vlan):'')}</select>`);
  if(tr)h+=`<div class="fld"><span>Getaggte VLANs</span><div class="vchips">${state.vlans.map(v=>{const on=(cf.tv||[]).includes(v.id);return `<button type="button" class="vchip${on?' on':''}" style="--vc:${v.color}" data-act="vtag" data-v="${v.id}" aria-pressed="${on}">${esc(vshort(v.id))}</button>`}).join('')||'<span class="note">Noch keine VLANs angelegt.</span>'}${state.vlans.length?'<button type="button" class="link" data-act="vtagall">alle</button>':''}</div></div>`;
  return h+`<p class="note"><button type="button" class="link" data-act="vlanlist">VLANs verwalten</button></p>`}
function inspPort(d,pid){
  const t=ptype(pid),cf=pconf(d,pid),pas=isPas(t),nm=pname(d,pid);
  let h=`<div class="ih"><span class="kind">${esc(nm)} · ${PT[t].n}</span><h2 id="ih-t">${esc(cf.label||nm)}</h2><p class="sub"><button type="button" class="link" data-act="seldev" data-id="${d.id}">${esc(d.name)}</button>${whereAll(d)?' · '+esc(whereAll(d)):''}</p></div>`;
  h+=farSummary(d,pid);
  h+=fld('f-plabel','Beschriftung',inp('f-plabel','port.label',cf.label||'',`maxlength="60" placeholder="${pas?'z. B. 11.6 oder Raum 1.12':'z. B. Uplink Core'}"`));
  if(pas&&(d.kind==='patch'||d.kind==='fiber'))h+=`<p class="note">Steht so in der Patchlegung. Ohne Beschriftung: automatisch ${esc(autoDesig(d,pid))}</p>`;
  if(!pas){
    h+=fld('f-pspeed','Geschwindigkeit',selx('f-pspeed','port.speed',PT[t].sp.map(s=>[s,SP[s].n]),pspeed(d,pid)));
    if(vlanPort(d,pid))h+=vlanUI(d,pid,cf);
    if(d.kind==='switch'&&t==='rj45')h+=`<label class="chk"><input type="checkbox" id="f-ppoe" data-f="port.poe"${ppoe(d,pid)?' checked':''}> PoE aktiv</label>`;
    h+=`<label class="chk"><input type="checkbox" id="f-poff" data-f="port.off"${cf.off?' checked':''}> Port deaktiviert</label>`;
  }
  h+=fld('f-pnotes','Notiz',txa('f-pnotes','port.notes',cf.notes||''));
  if(pas)h+='<h3>Vorderseite · Patchkabel</h3>'+connBlock(d,pid,'f')+'<h3>Rückseite · Verlegekabel</h3>'+connBlock(d,pid,'r');
  else h+='<h3>Verbindung</h3>'+connBlock(d,pid,null);
  const c=cabOf(d.id,pid,'f')||cabOf(d.id,pid,'r');
  if(c){const ch=AN.get(c.id).ch;if(ch.steps.length>1||pas)h+='<h3>Strecke von Ende zu Ende</h3>'+pathHTML(ch)}
  return h;
}
const reachTxt=tr=>tr.m==='cu'?`bis ${tr.r.cu} m`:Object.entries(tr.r).map(([k,v])=>`${FG[k].n} ${v>=1000?de(v/1000)+' km':v+' m'}`).join(' · ');
function inspCab(c){
  const inf=AN.get(c.id),col=ccolor(c,inf);
  const end=k=>{const e=c[k],d=dev(e.d),t=ptype(e.p),l=pconf(d,e.p).label;return `<button type="button" data-act="goport" data-d="${e.d}" data-p="${e.p}"><i>${k.toUpperCase()}</i><span><b>${esc(d.name)} · ${esc(pname(d,e.p))}${e.s==='r'?' (Rückseite)':''}</b><small>${PT[t].n}${isPas(t)?'':' · '+SP[pspeed(d,e.p)].n}${l?' · '+esc(l):''}${where(d)?' · '+esc(where(d)):''}</small></span></button>`};
  const side=k=>{const e=c[k];if(!isPas(ptype(e.p)))return '';return `<fieldset class="seg" style="grid-template-columns:repeat(2,minmax(0,1fr))"><legend>Ende ${k.toUpperCase()} am Panel</legend><label><input type="radio" name="side${k}" data-f="cab.s${k}" value="f"${e.s!=='r'?' checked':''}><span>Vorderseite</span></label><label><input type="radio" name="side${k}" data-f="cab.s${k}" value="r"${e.s==='r'?' checked':''}><span>Rückseite</span></label></fieldset>`};
  let h=`<div class="ih"><span class="kind">Kabel</span><h2 id="ih-t">${esc(c.label||'Kabel')}</h2><p class="sub"><i class="dot" style="--c:${col}"></i>${inf.nolink?'Kein Link':inf.speed?'Link mit '+SP[inf.speed].n:'Passive Verbindung'} · ${esc(cspec(c))}</p></div>`;
  h+=`<div class="ends">${end('a')}${end('b')}</div>${side('a')}${side('b')}`;
  h+=fld('f-clabel','Beschriftung',inp('f-clabel','cab.label',c.label,'maxlength="40" placeholder="z. B. K-012"'));
  h+=`<fieldset class="seg" style="grid-template-columns:repeat(4,minmax(0,1fr))"><legend>Medium</legend>${Object.entries(MED).map(([k,v])=>`<label><input type="radio" name="cmed" data-f="cab.med" value="${k}"${c.med===k?' checked':''}><span>${v.n}</span></label>`).join('')}</fieldset>`;
  if(c.med==='cu')h+=`<div class="grid2">${fld('f-ccat','Kategorie',selx('f-ccat','cab.cat',Object.entries(CAT).map(([k,v])=>[k,v.n]),c.cat))}${fld('f-csh','Schirmung',selx('f-csh','cab.shield',SHIELD.map(s=>[s,s]),c.shield))}</div>`;
  if(c.med==='fi')h+=`<div class="grid2">${fld('f-cfg','Fasertyp',selx('f-cfg','cab.fg',Object.entries(FG).map(([k,v])=>[k,v.n+(v.m==='sm'?' (SM)':' (MM)')]),c.fg))}${fld('f-cpol','Schliff',selx('f-cpol','cab.pol',[['UPC','UPC'],['APC','APC (8°)']],c.pol))}</div><div class="grid2">${fld('f-cca','Stecker A',selx('f-cca','cab.ca',CONS.map(x=>[x,x==='MPO'?'MPO-12':x]),c.ca))}${fld('f-ccb','Stecker B',selx('f-ccb','cab.cb',CONS.map(x=>[x,x==='MPO'?'MPO-12':x]),c.cb))}</div>`;
  if(c.med==='dac')h+=fld('f-cdac','Ausführung',selx('f-cdac','cab.dac',[['passiv','Passiv (Twinax, kurz)'],['aktiv','Aktiv (bis ca. 15 m)']],c.dac));
  if(c.med==='dac'||c.med==='aoc')h+=`<p class="note">${c.med==='dac'?'DAC':'AOC'}-Kabel haben die Module fest angebaut – ein Transceiver wird nicht extra gesteckt.</p>`;
  if(c.med==='cu'||c.med==='fi'){const ks=['a','b'].filter(k=>PT[ptype(c[k].p)].ff);
    if(ks.length){h+='<h3>Transceiver</h3>';for(const k of ks){const e=c[k],t=ptype(e.p),list=Object.values(TR).filter(x=>x.ff.includes(t)),cur=TR[c['t'+k]];
      h+=fld('f-ct'+k,`Ende ${k.toUpperCase()} · ${PT[t].n} an ${esc(dev(e.d).name)}`,`<select id="f-ct${k}" data-f="cab.t${k}"><option value="">nicht angegeben</option>${[['cu','Kupfer (RJ45)'],['mm','Multimode'],['sm','Singlemode']].map(([m,lab])=>{const g=list.filter(x=>x.m===m);return g.length?`<optgroup label="${lab}">${g.map(x=>`<option value="${x.n}"${cur&&cur.n===x.n?' selected':''}>${x.n}</option>`).join('')}</optgroup>`:''}).join('')}</select>`);
      if(cur)h+=`<p class="note">${esc(cur.d)} · Reichweite ${esc(reachTxt(cur))}</p>`;
      h+=fld('f-ci'+k,'Hersteller / Artikel-Nr.',inp('f-ci'+k,'cab.i'+k,c['i'+k]||'','maxlength="60" placeholder="z. B. Hersteller · Artikelnummer"'));
    }}}
  h+=`<div class="grid2">${fld('f-clen','Länge in m',`<input id="f-clen" data-f="cab.len" type="number" min="0" max="100000" step="0.5" inputmode="decimal" value="${esc(c.len)}">`)}</div>`;
  h+=`<fieldset class="sw"><legend>Kabelfarbe</legend>${Object.entries(COL).map(([k,v])=>`<label title="${v.n}"><input type="radio" name="ccol" data-f="cab.color" value="${k}" aria-label="${v.n}"${c.color===k?' checked':''}><span class="${k==='auto'?'auto':''}" style="--c:${v.hex||'#888'}"></span></label>`).join('')}</fieldset>`;
  if(state.view.colorBy==='speed')h+='<p class="note">Im Plan sind die Kabel gerade nach Geschwindigkeit eingefärbt. Wählst du eine Farbe, schaltet die Ansicht auf echte Kabelfarben um.</p>';
  h+=fld('f-cnotes','Notiz',txa('f-cnotes','cab.notes',c.notes));
  if(inf.ch.steps.length>1)h+='<h3>Strecke von Ende zu Ende</h3>'+pathHTML(inf.ch);
  h+=`<h3>Prüfung</h3>${inf.iss.length?`<ul class="iss">${inf.iss.map(([s,m])=>`<li><i class="sev ${s}">${SEV[s].g}</i><span>${esc(m)}</span></li>`).join('')}</ul>`:'<p class="ok">Keine Auffälligkeiten.</p>'}`;
  return h+`<button type="button" class="btn danger wide" data-act="delcab" data-id="${c.id}">Kabel entfernen</button>`;
}

/* ================= edits ================= */
function ck(key){const now=Date.now();if(key&&key===H.key&&now-H.t<1500){H.t=now;return}H.u.push(JSON.stringify(state));if(H.u.length>150)H.u.shift();H.r=[];H.key=key||null;H.t=now}
function touched(){state.updated=Date.now();state.demo=false;store.dirty=true;clearTimeout(store.tl);store.tl=setTimeout(saveLocal,300);if(store.ref){clearTimeout(store.tc);setSave('saving');store.tc=setTimeout(saveCloud,1200)}else setSave('local')}
function fixSel(){for(const id of [...MS])if(!dev(id))MS.delete(id);if(sel&&sel.kind==='multi'&&MS.size<2){const o=[...MS][0];MS.clear();sel=o?{kind:'dev',id:o}:null}if(!sel)return;if(sel.kind==='dev'&&!dev(sel.id))sel=null;else if(sel.kind==='port'&&!(dev(sel.dev)&&pexists(dev(sel.dev),sel.port)))sel=null;else if(sel.kind==='cable'&&!state.cables.some(c=>c.id===sel.id))sel=null;else if(sel.kind==='rack'&&!rackOf(sel.id))sel=null;else if(sel.kind==='room'&&!roomOf(sel.id))sel=null}
function undo(){if(!H.u.length)return;H.r.push(JSON.stringify(state));state=JSON.parse(H.u.pop());H.key=null;fixSel();touched();renderAll()}
function redo(){if(!H.r.length)return;H.u.push(JSON.stringify(state));state=JSON.parse(H.r.pop());H.key=null;fixSel();touched();renderAll()}
function select(s){if(!s||s.kind!=='multi')MS.clear();sel=s;if(raidEdit&&!(s&&s.kind==='dev'&&s.id===raidEdit.dev))raidEdit=null;if(innerWidth<=1100)$('#rail').classList.remove('open');$('#insp').classList.toggle('min',!s&&innerWidth<=760);$('#itog').setAttribute('aria-expanded',String(!!s||innerWidth>760));renderAll()}
function nextLabel(){let m=0;for(const c of state.cables){const r=/^K-(\d+)$/.exec(c.label);if(r)m=Math.max(m,+r[1])}return 'K-'+String(m+1).padStart(3,'0')}
function pickSide(d,pid,other){const pf=other&&(other.kind==='host'||other.kind==='ap')?'r':'f',alt=pf==='f'?'r':'f';if(!cabOf(d.id,pid,pf))return pf;if(!cabOf(d.id,pid,alt))return alt;return null}
function applyTr(c){
  for(const k of ['a','b']){const e=c[k],t=ptype(e.p),ff=PT[t].ff;
    if(ff&&(c.med==='cu'||c.med==='fi')){const m=c.med==='cu'?'cu':FG[c.fg].m,cur=TR[c['t'+k]];if(!cur||cur.m!==m||!cur.ff.includes(t))c['t'+k]=autoTr(t,m,pspeed(dev(e.d),e.p))}
    else c['t'+k]='';
    if(c.med==='fi'){if(PT[t].con)c['c'+k]=PT[t].con;else if(ff){const tr=TR[c['t'+k]];if(tr&&tr.con==='MPO')c['c'+k]='MPO';else if(c['c'+k]==='MPO')c['c'+k]='LC'}}
  }
}
function applyMed(c){
  const ds=[c.a,c.b].map(e=>dev(e.d));
  if(c.med==='fi'){const fp=ds.find(d=>d.kind==='fiber');if(fp){c.fg=fp.fg;c.pol=FG[fp.fg].m==='sm'?fp.pol:'UPC'}}
  if(c.med==='cu'){const pp=ds.find(d=>d.kind==='patch');if(pp){c.cat=pp.cat;c.shield=pp.shield?'S/FTP':'U/UTP'}}
  applyTr(c);
}
function defCable(A,B){
  const ta=ptype(A.p),tb=ptype(B.p);
  const c={id:'c'+rid(),a:A,b:B,label:nextLabel(),med:'cu',cat:'cat6a',shield:'U/UTP',fg:'om4',ca:'LC',cb:'LC',pol:'UPC',dac:'passiv',ta:'',tb:'',ia:'',ib:'',color:'auto',len:'',notes:''};
  if([ta,tb].some(t=>PT[t].con))c.med='fi';
  else if(PT[ta].ff&&PT[tb].ff){const pa=endPos(A),pb=endPos(B);c.med=Math.hypot(pa.x-pb.x,pa.y-pb.y)<450&&PT[ta].ff===PT[tb].ff?'dac':'fi'}
  applyMed(c);return c;
}
function resolveEnd(e,other){
  const t=ptype(e.p);if(!isPas(t))return cabOf(e.d,e.p,'f')?null:{d:e.d,p:e.p};
  let s=e.s;if(s!=='f'&&s!=='r')s=pickSide(dev(e.d),e.p,dev(other.d));
  if(!s||cabOf(e.d,e.p,s))return null;return s==='r'?{d:e.d,p:e.p,s:'r'}:{d:e.d,p:e.p};
}
function connect(a,b){
  if(a.d===b.d&&a.p===b.p){toast('Ein Port lässt sich nicht mit sich selbst verbinden');return}
  const A=resolveEnd(a,b),B=resolveEnd(b,a);
  if(!A||!B){toast('An diesem Port ist kein Anschluss mehr frei');return}
  ck();const c=defCable(A,B);state.cables.push(c);touched();sel={kind:'cable',id:c.id};renderAll();
}
function delCable(id){ck();state.cables=state.cables.filter(c=>c.id!==id);touched();if(sel&&sel.kind==='cable')sel=null;renderAll();toast('Kabel entfernt – Strg+Z holt es zurück')}
async function delDev(d){
  const n=state.cables.filter(c=>c.a.d===d.id||c.b.d===d.id).length;
  if(n&&!(await ask(`${KIND[d.kind].n} löschen?`,`„${d.name}“ und ${n===1?'das angeschlossene Kabel':'die '+n+' angeschlossenen Kabel'} werden entfernt.`,'Löschen',true)))return;
  ck();state.devices=state.devices.filter(x=>x!==d);state.cables=state.cables.filter(c=>c.a.d!==d.id&&c.b.d!==d.id);sel=null;touched();renderAll();toast('Gelöscht – Strg+Z holt es zurück');
}
async function delRack(r){
  const n=state.devices.filter(d=>d.rack===r.id).length;
  if(n&&!(await ask('Schrank löschen?',`„${r.name}“ wird entfernt. Die ${n} eingebauten Geräte bleiben im Plan an ihrer Stelle.`,'Schrank löschen',true)))return;
  ck();for(const d of state.devices)if(d.rack===r.id)d.rack=null;state.racks=state.racks.filter(x=>x!==r);sel=null;touched();renderAll();toast('Schrank gelöscht – Strg+Z holt ihn zurück');
}
function delRoom(rm){ck();state.rooms=state.rooms.filter(x=>x!==rm);sel=null;touched();renderAll();toast('Raum gelöscht – der Inhalt bleibt')}
function contentBox(skipHid){let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9,any=false;const add=(a,b,c,d)=>{any=true;x1=Math.min(x1,a);y1=Math.min(y1,b);x2=Math.max(x2,c);y2=Math.max(y2,d)};
  for(const d of state.devices){if(skipHid&&HID.has(d.id))continue;const L=lay(d);add(d.x,d.y,d.x+L.W,d.y+L.H)}for(const r of state.racks){const G=rgeom(r);add(r.x,r.y,r.x+G.W,r.y+G.H)}for(const m of state.rooms)add(m.x,m.y,m.x+m.w,m.y+m.h);
  return any?{x1,y1,x2,y2}:null}
function overlaps(d){const L=lay(d),a={x1:d.x-20,y1:d.y-20,x2:d.x+L.W+20,y2:d.y+L.H+20};return state.devices.some(o=>o!==d&&!o.rack&&(()=>{const l=lay(o);return ov(a,{x1:o.x,y1:o.y,x2:o.x+l.W,y2:o.y+l.H})})())||state.racks.some(r=>{const G=rgeom(r);return ov(a,{x1:r.x,y1:r.y,x2:r.x+G.W,y2:r.y+G.H})})}
function place(d){
  const L=lay(d),B=contentBox();
  if(!B){d.x=40;d.y=40;return}
  if(rackable(d)){
    const loose=state.devices.filter(x=>!x.rack&&rackable(x));
    if(loose.length){let R=-1e9,Bt=-1e9;for(const o of loose){const l=lay(o);R=Math.max(R,o.x+l.W);Bt=Math.max(Bt,o.y+l.H)}d.x=sn(R-L.W);d.y=sn(Bt+80)}
    else{d.x=sn(B.x2+160);d.y=sn(B.y1)}
  }else{
    const free=state.devices.filter(x=>!x.rack&&!rackable(x));
    if(free.length){const last=free.reduce((a,b)=>(b.y>a.y||(b.y===a.y&&b.x>a.x))?b:a),lw=lay(last).W;d.x=sn(last.x+lw+40);d.y=last.y;if(d.x+L.W>Math.max(B.x2,last.x+1200)){d.x=sn(B.x1);d.y=sn(B.y2+120)}}
    else{d.x=sn(B.x1);d.y=sn(B.y2+120)}
  }
  let g=0;while(overlaps(d)&&g++<300)d.y+=40;
}
function arrange(){
  const inR=(x,y,w,h)=>state.rooms.some(m=>x+w/2>=m.x&&x+w/2<=m.x+m.w&&y+h/2>=m.y&&y+h/2<=m.y+m.h);
  const racks=state.racks.filter(r=>{const G=rgeom(r);return !inR(r.x,r.y,G.W,G.H)});
  const loose=state.devices.filter(d=>!d.rack&&rackable(d)&&!inR(d.x,d.y,lay(d).W,lay(d).H));
  const free=state.devices.filter(d=>!d.rack&&!rackable(d)&&!inR(d.x,d.y,lay(d).W,lay(d).H));
  if(!racks.length&&!loose.length&&!free.length){toast('Alles liegt in Räumen – nichts zu ordnen');return}
  ck();
  let x0=40,y0=40;if(state.rooms.length){x0=Math.max(...state.rooms.map(m=>m.x+m.w))+160;y0=Math.min(...state.rooms.map(m=>m.y))}
  let x=x0,maxB=y0;
  for(const r of racks.sort((a,b)=>a.x-b.x)){const G=rgeom(r);r.x=sn(x);r.y=sn(y0);x+=G.W+160;maxB=Math.max(maxB,y0+G.H)}
  if(loose.length){const W=Math.max(...loose.map(d=>lay(d).W)),R=x+W;let y=y0;for(const d of loose.sort((a,b)=>a.y-b.y||a.x-b.x)){const L=lay(d);d.x=sn(R-L.W);d.y=sn(y);y+=L.H+80}maxB=Math.max(maxB,y);x=R+160}
  let fx=x0,fy=maxB+120,rowH=0;const maxW=Math.max(x-x0-160,1100);
  for(const d of free.sort((a,b)=>a.y-b.y||a.x-b.x)){const L=lay(d);if(fx>x0&&fx-x0+L.W>maxW){fx=x0;fy+=rowH+60;rowH=0}d.x=sn(fx);d.y=sn(fy);fx+=L.W+40;rowH=Math.max(rowH,L.H)}
  touched();renderAll();fit();toast(state.rooms.length?'Aufgeräumt – was in Räumen liegt, bleibt, wo es ist':'Aufgeräumt: Schränke nebeneinander, lose Geräte daneben, Endgeräte darunter');
}
function fitRoom(rm){
  const its=roomItems(rm);if(!its.length){toast('Im Raum liegt noch nichts');return}
  let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;for(const i of its){let x,y,w,h;if(i.t==='rack'){const G=rgeom(i.o);x=i.o.x;y=i.o.y;w=G.W;h=G.H}else{const L=lay(i.o);x=i.o.x;y=i.o.y;w=L.W;h=L.H}x1=Math.min(x1,x);y1=Math.min(y1,y);x2=Math.max(x2,x+w);y2=Math.max(y2,y+h)}
  ck();rm.x=sn(x1-80);rm.y=sn(y1-140);rm.w=sn(x2-x1+160);rm.h=sn(y2-y1+220);touched();renderAll();
}
function dupDev(d){const n=JSON.parse(JSON.stringify(d));n.id='d'+rid();n.name=trunc(d.name+' (Kopie)',40);ck();if(d.rack){n.rack=null;state.devices.push(n);rackInsert(n,rackOf(d.rack),null)}else{n.rack=null;place(n);state.devices.push(n)}touched();sel={kind:'dev',id:n.id};renderAll();centerOn(n)}
function setCount(d,t,n){
  const old=d.pc[t]||0;if(n===old)return;
  const tryd={...d,pc:{...d.pc,[t]:n}};if(total(tryd)<minPorts(d)){toast('Dieses Gerät braucht mindestens einen Port');renderInsp();return}
  ck();d.pc[t]=n;let gone=0;
  if(n<old){for(let i=n+1;i<=old;i++)delete d.ports[PT[t].pre+i];const keep=state.cables.filter(c=>!((c.a.d===d.id&&!pexists(d,c.a.p))||(c.b.d===d.id&&!pexists(d,c.b.p))));gone=state.cables.length-keep.length;state.cables=keep}
  touched();renderAll();if(gone)toast(`${gone} Kabel an entfernten Ports gelöscht – Strg+Z macht rückgängig`);
}
function pset(d,pid,k,v){const o=d.ports[pid]||(d.ports[pid]={});if(v===''||v===false||v==null)delete o[k];else o[k]=v;if(!Object.keys(o).length)delete d.ports[pid]}
function applyField(el,live){
  const f=el.dataset.f;if(!f)return;
  const isTxt=el.tagName==='TEXTAREA'||(el.tagName==='INPUT'&&!['checkbox','radio','number'].includes(el.type));
  if(live&&!isTxt)return;
  if(el.type==='radio'&&!el.checked)return;
  if(f.startsWith('disk.')||f.startsWith('raid.')){const d=sel&&sel.kind==='dev'&&dev(sel.id);if(!d)return;const P=f.split('.');
    if(P[0]==='disk'){const i=P[1],g=P[2];if(!/^\d{1,2}$/.test(i)||!['c','u','t'].includes(g))return;let v=el.value;
      if(g==='c'){v=String(v).replace(',','.').trim();v=v===''?null:Number.isFinite(parseFloat(v))?Math.min(1e6,Math.max(0,parseFloat(v))):null}else if(g==='u'&&!['TB','GB'].includes(v))return;else if(g==='t'&&!['HDD','SSD'].includes(v))return;
      d.disks=d.disks||{};const o=d.disks[i]||{},su=g==='c'?(/\d\s*(gi?b?)\s*$/i.test(el.value)?'GB':/\d\s*(ti?b?)\s*$/i.test(el.value)?'TB':null):null;if((o[g]??null)!==v||(su&&su!==(o.u||'TB'))){ck('disk'+i+g+d.id);const n={...o};if(v==null)delete n[g];else n[g]=v;if(su)n.u=su;if(g!=='t')delete n.ok;if(Object.keys(n).length)d.disks[i]=n;else delete d.disks[i];touched();renderAll(true)}
      if(!live||el.tagName==='SELECT')refreshDisks();return}
    const r=(d.raids||[]).find(x=>x.id===P[1]);if(!r)return;
    if(P[2]==='name'){const v=String(el.value).slice(0,30);if(r.name===v)return;ck('rname'+r.id);r.name=v;touched();renderAll(true);return}
    if(P[2]==='lvl'){if(!RAIDL[el.value]||r.lvl===el.value)return;ck();r.lvl=el.value;touched();renderAll();return}
    return}
  const val=el.type==='checkbox'?el.checked:el.value,parts=f.split('.'),sc=parts[0],k=parts.slice(1).join('.');
  let keep=isTxt,title=null;
  if(sc==='proj'){if(state.name===val)return;ck('proj');state.name=String(val).slice(0,80);title=state.name}
  else if(sc==='view'){if(state.view[k]===val)return;ck('view');state.view[k]=val;keep=false}
  else if(sc==='life'){if(k!=='old'&&k!=='eol')return;const n=clamp(parseInt(val,10)||1,1,60);el.value=n;if(state.life[k]===n)return;ck('life'+k);state.life[k]=n;keep=false}
  else if(sc==='dev'){const d=dev(sel.id);if(!d)return;
    if(k.startsWith('pc.')){const t=k.slice(3);if(!KIND[d.kind].types.includes(t))return;const n=clamp(parseInt(val,10)||0,0,maxc(d,t));el.value=n;setCount(d,t,n);return}
    if(k==='rack'){if(val===(d.rack||''))return;ck();if(!val){const r=rackOf(d.rack);d.rack=null;if(r){const G=rgeom(r);d.x=sn(r.x+G.W+80)}}else{const r=rackOf(val);if(!r||!rackInsert(d,r,null)){H.u.pop();renderInsp();return}}touched();renderAll();return}
    if(k==='u'){const n=clamp(parseInt(val,10)||1,1,99),r=d.rack&&rackOf(d.rack);if(!r||n===d.u)return;ck();grow(r,()=>{d.u=n;packRack(r,d)});touched();renderAll();return}
    const fd=F[k];if(!fd)return;let v=fd.t==='chk'?!!val:val;
    if(fd.opt){v=String(v).trim()===''?'':clamp(parseInt(v,10)||fd.min,fd.min,fd.max);el.value=v}
    else if(fd.t==='num'){v=clamp(parseInt(v,10)||0,fd.min,k==='baysUsed'?(+d.bays||0):fd.max);el.value=v}
    if(k==='he'||k==='wan')v=parseInt(v,10)||0;
    if(k==='he')v=clamp(v,1,KIND[d.kind].maxHe);
    if(fd.t==='text')v=String(v).slice(0,fd.max);
    if((fd.t==='sel'||fd.t==='seg')&&!fo(fd,d).some(([x])=>String(x)===String(v)))return;
    if(d[k]===v)return;ck('dev'+k+d.id);const gr=d.rack&&rackOf(d.rack),gh=gr?rgeom(gr).H:0;const ov=d[k];d[k]=v;
    if(k==='poe')for(const pc of Object.values(d.ports))delete pc.poe;
    if(k==='bays'&&(d.baysUsed>v||d.baysUsed===ov))d.baysUsed=v;
    if(k==='sub'&&(v==='phone'||v==='camera'))d.pd=true;
    if(k==='size'&&d.rack){const r=rackOf(d.rack);if(v==='frei'||(v==='19'&&r.rsize==='10')){d.rack=null;d.x=sn(r.x+rgeom(r).W+80);toast('Aus dem Schrank ausgebaut – die Bauform passt nicht mehr')}}
    if(k==='he'&&d.rack){packRack(gr,d);const nh=rgeom(gr).H;if(nh>gh)pushBelow(gr,gh,nh-gh)}
    if(k==='name')title=v;
  }
  else if(sc==='rack'){const r=rackOf(sel.id);if(!r)return;let v=val;
    if(k==='name'||k==='location'||k==='notes'){v=String(val).slice(0,k==='notes'?500:60);if(k==='name')title=v||'Schrank'}
    else if(k==='rsize'){if(!['19','10'].includes(v))return;if(v==='10'&&state.devices.some(d=>d.rack===r.id&&d.size==='19')){toast('Im Schrank stecken 19″-Geräte – erst ausbauen');renderInsp();return}}
    else if(k==='minHe')v=clamp(parseInt(v,10)||0,0,60);
    else if(k==='rcolor'){if(!RPAL[v])return}
    else return;
    if(r[k]===v)return;ck('rack'+k+r.id);const gh=rgeom(r).H;r[k]=v;const nh=rgeom(r).H;if(nh>gh)pushBelow(r,gh,nh-gh);
  }
  else if(sc==='room'){const rm=roomOf(sel.id);if(!rm)return;let v=val;
    if(k==='name'||k==='notes'){v=String(val).slice(0,k==='notes'?500:60);if(k==='name')title=v||'Raum'}
    else if(k==='roomc'){if(!RCOL[v])return}
    else if(k==='w'||k==='h'){v=clamp(sn(parseInt(v,10)||0),k==='w'?300:200,30000)}
    else return;
    if(rm[k]===v)return;ck('room'+k+rm.id);rm[k]=v;
  }
  else if(sc==='port'&&(k==='vm'||k==='vlan')){const d=dev(sel.dev);if(!d)return;const o=d.ports[sel.port]||{};
    if(k==='vm'){const tr=val==='trunk';if((o.vm==='trunk')===tr)return;ck();pset(d,sel.port,'vm',tr?'trunk':'');if(!tr)pset(d,sel.port,'tv','');else if(!o.tv)pset(d,sel.port,'tv',[])}
    else{const v=val===''?null:+val;if((o.vlan||null)===v)return;ck();pset(d,sel.port,'vlan',v)}
    keep=false}
  else if(sc==='port'){const d=dev(sel.dev);if(!d)return;const cur=pconf(d,sel.port)[k];
    if(k==='poe'){ck();const o=d.ports[sel.port]||(d.ports[sel.port]={});if(!!val===!!d.poe)delete o.poe;else o.poe=!!val;if(!Object.keys(o).length)delete d.ports[sel.port]}
    else{if((cur||'')===val||(k==='off'&&!!cur===val))return;ck('port'+k+sel.dev+sel.port);pset(d,sel.port,k,k==='off'?!!val:String(val).slice(0,k==='notes'?300:60))}
    if(k==='label')title=val||pname(d,sel.port);
    if(k==='speed'||k==='off'||k==='poe')keep=false;
  }
  else if(sc==='cab'){const c=state.cables.find(x=>x.id===sel.id);if(!c)return;
    if(k==='sa'||k==='sb'){const e=c[k[1]],ns=val==='r'?'r':'f';if((e.s==='r'?'r':'f')===ns)return;if(cabOf(e.d,e.p,ns)){toast('Diese Seite des Ports ist schon belegt');renderInsp();return}ck();if(ns==='r')e.s='r';else delete e.s;touched();renderAll();return}
    let v=val;if(k==='len')v=val===''?'':clamp(+val||0,0,100000);
    if(c[k]===v)return;ck('cab'+k+c.id);
    c[k]=typeof v==='string'?v.slice(0,k==='notes'?300:60):v;
    if(k==='med')applyMed(c);
    if(k==='fg')applyTr(c);
    if((k==='ta'||k==='tb')&&c.med==='fi'){const e=k[1],tr=TR[c[k]];if(!PT[ptype(c[e].p)].con&&tr){if(tr.con==='MPO')c['c'+e]='MPO';else if(c['c'+e]==='MPO')c['c'+e]='LC'}}
    if(k==='label')title=v||'Kabel';
    if(k==='color'&&v!=='auto'&&state.view.colorBy==='speed'){state.view.colorBy='cable';toast('Ansicht zeigt jetzt echte Kabelfarben')}
    keep=['label','notes','ia','ib'].includes(k);
  }
  touched();
  if(keep){renderAll(true);if(title!==null&&$('#ih-t'))$('#ih-t').textContent=title}else renderAll();
}

/* ================= view ================= */
const stage=$('#stage'),cv=$('#cv'),world=$('#world');
function applyView(){world.setAttribute('transform',`translate(${view.x.toFixed(1)} ${view.y.toFixed(1)}) scale(${view.z.toFixed(4)})`);stage.style.backgroundSize=`${20*view.z}px ${20*view.z}px`;stage.style.backgroundPosition=`${view.x}px ${view.y}px`;$('#z-lbl').textContent=Math.round(view.z*100)+' %'}
function bbox(){const B=contentBox(true)||{x1:0,y1:0,x2:400,y2:300};let {x1,y1,x2,y2}=B;
  for(const rt of routes().values()){const ps=rt.pts?rt.pts.map(([x,y])=>({x,y})):[];for(let t=0;t<=1.001;t+=.05)ps.push(rt.at(t));for(const p of ps){x1=Math.min(x1,p.x);y1=Math.min(y1,p.y);x2=Math.max(x2,p.x);y2=Math.max(y2,p.y)}}
  return {x1,y1,x2,y2}}
function fit(){const r=stage.getBoundingClientRect();if(!r.width)return;if(!contentBox(true)){view={x:40,y:40,z:1};applyView();return}
  const b=bbox(),pad=30,bw=b.x2-b.x1,bh=b.y2-b.y1,z=clamp(Math.min((r.width-pad*2)/bw,(r.height-pad*2-50)/bh),.08,1.25);
  view.z=z;view.x=(r.width-bw*z)/2-b.x1*z;view.y=(r.height-50-bh*z)/2-b.y1*z;applyView()}
function zoomAt(mx,my,f){const z=clamp(view.z*f,.08,3),k=z/view.z;view.x=mx-(mx-view.x)*k;view.y=my-(my-view.y)*k;view.z=z;applyView()}
function zoomBy(f){const r=stage.getBoundingClientRect();zoomAt(r.width/2,r.height/2,f)}
function centerRect(x,y,w,h){const r=stage.getBoundingClientRect();view.z=clamp(Math.min(Math.max(view.z,.4),(r.width-80)/w,(r.height-120)/h),.08,1.25);view.x=r.width/2-(x+w/2)*view.z;view.y=(r.height-50)/2-(y+h/2)*view.z;applyView()}
function centerOn(d){const r=stage.getBoundingClientRect(),L=lay(d);if(view.z<.45)view.z=.6;view.x=r.width/2-(d.x+L.W/2)*view.z;view.y=r.height/2-(d.y+L.H/2)*view.z;applyView()}
function centerCable(id){const r=stage.getBoundingClientRect(),rt=routes().get(id);if(!rt)return;const p=rt.at(.5);view.x=r.width/2-p.x*view.z;view.y=r.height/2-p.y*view.z;applyView()}
function toWorld(e){const r=cv.getBoundingClientRect();return {x:(e.clientX-r.left-view.x)/view.z,y:(e.clientY-r.top-view.y)/view.z}}
const later=fn=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(fn)};

/* ================= pointer: wiring, moving, panning ================= */
const portEl=(d,p)=>document.querySelector(`#l-dev [data-dev="${d}"] [data-port="${p}"]`);
function setHov(id){
  if(hov===id)return;
  if(hov){const g=document.getElementById('cab-'+hov);g&&g.classList.remove('hov');document.querySelectorAll('.port.peer').forEach(e=>e.classList.remove('peer'))}
  hov=id;
  if(id){const g=document.getElementById('cab-'+id);g&&g.classList.add('hov');const c=state.cables.find(x=>x.id===id);if(c)for(const e of [c.a,c.b]){const pe=portEl(e.d,e.p);pe&&pe.classList.add('peer')}}
}
function showTip(e,did,pid){
  const tip=$('#tip'),k=did+':'+pid;
  if(tipKey!==k){tipKey=k;const d=dev(did);if(!d)return;const t=ptype(pid),cf=pconf(d,pid),pas=isPas(t);
    const usr=id=>{const x=dev(id);return x&&x.user?' – '+x.user:''};
    const far=s=>{const c=cabOf(did,pid,s);if(!c)return null;const o=(c.a.d===did&&c.a.p===pid&&(c.a.s==='r'?'r':'f')===s)?c.b:c.a;return `${pfull(o)}${usr(o.d)}${c.label?' ('+c.label+')':''}${HID.has(o.d)?' · ausgeblendet':''}`};
    let body;
    if(pas){const f=far('f'),r=far('r');body=`<span class="m">Vorderseite:</span> ${esc(f||'frei')}<br><span class="m">Rückseite:</span> ${esc(r||'frei')}`}
    else{const bits=[SP[pspeed(d,pid)].n];{const pv=pvlan(d,pid);if(pv)bits.push(vlanTxt(pv))}if(ppoe(d,pid))bits.push('PoE');if(cf.off)bits.push('deaktiviert');const c=cabOf(did,pid,'f');let to='frei – zum Verbinden ziehen';
      if(c){const ch=AN.get(c.id).ch,me=x=>x&&x.d===did&&x.p===pid,fe=me(ch.A)?ch.B:me(ch.B)?ch.A:null;to='→ '+(fe&&ch.steps.length>1?pfull(fe)+usr(fe.d)+' (über Patchpanel)'+(HID.has(fe.d)?' · ausgeblendet':''):far('f'))}
      body=`<span class="m">${esc(bits.join(' · '))}</span><br>${esc(to)}`}
    tip.innerHTML=`<b>${esc(pname(d,pid))} · ${PT[t].n}</b> <span class="m">${esc(d.name)}</span>${cf.label?`<br><b>${esc(cf.label)}</b>`:''}${cf.notes?`<br><span class="m">Notiz:</span> ${esc(cf.notes)}`:''}<br>${body}`}
  tip.hidden=false;const w=tip.offsetWidth,h=tip.offsetHeight;tip.style.left=Math.min(innerWidth-w-8,e.clientX+16)+'px';tip.style.top=Math.min(innerHeight-h-8,e.clientY+16)+'px';
}
function showBayTip(e,did,i){const tip=$('#tip'),k='bay:'+did+':'+i+(raidEdit?'e':''),d=dev(did);if(!d)return;
  if(tipKey!==k){tipKey=k;const DI=diskInfo(d),X=DI.list[i],r=X&&raidOf(d,i),ed=raidEdit&&raidEdit.dev===d.id;
    tip.innerHTML=`<b>Slot ${i+1} · ${d.bayForm.replace('.',',')}″</b> <span class="m">${esc(d.name)}</span><br>${X?`${X.o.c?esc(fmtCap(X.o)):'<span class="m">Größe nicht angegeben</span>'} · ${X.t}${r?`<br><span class="m">Verbund:</span> ${esc(r.name)} (${RAIDL[r.lvl].n})`:''}${X.out&&!X.ok?'<br><span class="m">Weicht stark ab – bitte prüfen und quittieren</span>':''}<br><span class="m">${ed?'Klicken: zum Verbund hinzufügen oder entfernen':'Klicken, um Größe und Typ einzutragen'}</span>`:'<span class="m">Leer</span>'}`}
  tip.hidden=false;const w=tip.offsetWidth,h=tip.offsetHeight;tip.style.left=Math.min(innerWidth-w-8,e.clientX+16)+'px';tip.style.top=Math.min(innerHeight-h-8,e.clientY+16)+'px'}
function hideTip(){$('#tip').hidden=true;tipKey=''}
cv.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  $('#rail').classList.remove('open');
  const t=e.target,pe=t.closest('[data-port]'),ce=t.closest('[data-cable]'),dg=t.closest('[data-dev]'),rk=t.closest('[data-rack]'),sl=t.closest('[data-slot]'),rh=t.closest('[data-rh]'),rm=t.closest('[data-room]');
  const base={sx:e.clientX,sy:e.clientY,moved:false,pid:e.pointerId},w=toWorld(e),mod=e.shiftKey||e.ctrlKey||e.metaKey||selMode;
  if(mod&&!(rh&&!dg)){if(dg){const d=dev(dg.dataset.dev);drag={...base,kind:'dev',id:d.id,ox:w.x-d.x,oy:w.y-d.y,orig:{x:d.x,y:d.y,rack:d.rack,u:d.u},tog:true}}else drag={...base,kind:'band',wx:w.x,wy:w.y,add:e.ctrlKey||e.metaKey||selMode}
    try{cv.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();return}
  if(pe&&dg)drag={...base,kind:'port',dev:dg.dataset.dev,port:pe.dataset.port};
  else if(ce)drag={...base,kind:'cable',id:ce.dataset.cable};
  else if(dg){const d=dev(dg.dataset.dev),be=t.closest('[data-bay]');drag={...base,kind:'dev',id:d.id,ox:w.x-d.x,oy:w.y-d.y,orig:{x:d.x,y:d.y,rack:d.rack,u:d.u},bay:be?+be.dataset.bay:null}}
  else if(rk){const r=rackOf(rk.dataset.rack);drag={...base,kind:'rack',id:r.id,ox:w.x-r.x,oy:w.y-r.y,orig:{x:r.x,y:r.y},slot:sl?sl.dataset.slot:null}}
  else if(rh){const r=roomOf(rh.dataset.rh);drag={...base,kind:'resize',id:r.id,orig:{w:r.w,h:r.h}}}
  else if(rm){const r=roomOf(rm.dataset.room);drag={...base,kind:'room',id:r.id,wx:w.x,wy:w.y,orig:{x:r.x,y:r.y},mem:roomItems(r).map(i=>({o:i.o,x:i.o.x,y:i.o.y}))}}
  else drag={...base,kind:'pan',vx:view.x,vy:view.y};
  try{cv.setPointerCapture(e.pointerId)}catch(_){}
  e.preventDefault();
});
cv.addEventListener('pointermove',e=>{
  if(drag){onDrag(e);return}
  if(e.pointerType!=='mouse')return;
  const pe=e.target.closest&&e.target.closest('[data-port]');
  if(pe){const did=pe.closest('[data-dev]').dataset.dev,pid=pe.dataset.port;showTip(e,did,pid);const c=cabOf(did,pid,'f')||cabOf(did,pid,'r');setHov(c?c.id:null);return}
  const be=e.target.closest&&e.target.closest('[data-bay]');if(be){showBayTip(e,be.closest('[data-dev]').dataset.dev,+be.dataset.bay);setHov(null);return}
  hideTip();const ce=e.target.closest&&e.target.closest('[data-cable]');setHov(ce?ce.dataset.cable:null);
});
cv.addEventListener('pointerleave',()=>{if(!drag){hideTip();setHov(null)}});
function snapShow(r,u,d){const sn_=$('#snap');if(!r){sn_.style.display='none';return}const w=Math.min(TW[d.size==='frei'?r.rsize:d.size]||TW[r.rsize],TW[r.rsize]);sn_.setAttribute('x',r.x+RAIL);sn_.setAttribute('y',r.y+HEAD+(u-1)*U);sn_.setAttribute('width',w);sn_.setAttribute('height',d.he*U);sn_.style.display=''}
function onDrag(e){
  const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
  if(!drag.moved){if(Math.hypot(dx,dy)<5)return;drag.moved=true;startDrag()}
  if(drag.kind==='pan'){view.x=drag.vx+dx;view.y=drag.vy+dy;applyView();return}
  const w=toWorld(e);
  if(drag.kind==='band'){const x=Math.min(w.x,drag.wx),y=Math.min(w.y,drag.wy),b=$('#band');b.style.display='';b.setAttribute('x',x);b.setAttribute('y',y);b.setAttribute('width',Math.abs(w.x-drag.wx));b.setAttribute('height',Math.abs(w.y-drag.wy));drag.bx=[x,y,x+Math.abs(w.x-drag.wx),y+Math.abs(w.y-drag.wy)];return}
  if(drag.kind==='dev'&&drag.grp){const d=dev(drag.id),ddx=sn(w.x-drag.ox)-drag.orig.x,ddy=sn(w.y-drag.oy)-drag.orig.y;for(const m of drag.grp){m.d.x=m.x+ddx;m.d.y=m.y+ddy;document.querySelectorAll(`#l-dev [data-dev="${m.d.id}"], #l-num [data-dev="${m.d.id}"]`).forEach(g=>g.setAttribute('transform',`translate(${m.d.x} ${m.d.y})`))}drawCables();return}
  if(drag.kind==='dev'){const d=dev(drag.id);d.x=sn(w.x-drag.ox);d.y=sn(w.y-drag.oy);document.querySelectorAll(`#l-dev [data-dev="${d.id}"], #l-num [data-dev="${d.id}"]`).forEach(g=>g.setAttribute('transform',`translate(${d.x} ${d.y})`));
    const r=KIND[d.kind].rack?rackAt(w.x,w.y):null;drag.tr=r;if(r){drag.tu=clamp(Math.round((d.y-(r.y+HEAD))/U)+1,1,200);snapShow(r,drag.tu,d)}else snapShow(null);
    drawCables();return}
  if(drag.kind==='rack'){const r=rackOf(drag.id);r.x=sn(w.x-drag.ox);r.y=sn(w.y-drag.oy);later(()=>{syncRacks();renderCanvas()});return}
  if(drag.kind==='room'){const r=roomOf(drag.id),mx=sn(w.x-drag.wx),my=sn(w.y-drag.wy);r.x=drag.orig.x+mx;r.y=drag.orig.y+my;for(const m of drag.mem){m.o.x=m.x+mx;m.o.y=m.y+my}later(()=>{syncRacks();renderCanvas()});return}
  if(drag.kind==='resize'){const r=roomOf(drag.id);r.w=Math.max(300,sn(w.x-r.x));r.h=Math.max(200,sn(w.y-r.y));later(renderCanvas);return}
  if(drag.kind==='port')updateWire(e,w);
}
function startDrag(){
  hideTip();setHov(null);
  if(drag.kind==='pan')cv.classList.add('panning');
  if(drag.kind==='dev'||drag.kind==='rack'||drag.kind==='room'||drag.kind==='resize')ck();
  if(drag.kind==='dev'&&MS.has(drag.id)&&MS.size>1&&!dev(drag.id).rack)drag.grp=[...MS].map(dev).filter(x=>x&&!x.rack).map(x=>({d:x,x:x.x,y:x.y}));
  if(drag.kind==='port'){
    const t=ptype(drag.port);let c=null;
    if(isPas(t)){const cf=cabOf(drag.dev,drag.port,'f'),cr=cabOf(drag.dev,drag.port,'r');if(cf&&cr)c=cf;else drag.fixed={d:drag.dev,p:drag.port,s:!cf&&!cr?null:cf?'r':'f'}}
    else{c=cabOf(drag.dev,drag.port,'f');if(!c)drag.fixed={d:drag.dev,p:drag.port}}
    if(c){drag.cable=c.id;drag.mk=(c.a.d===drag.dev&&c.a.p===drag.port&&c.a.s!=='r')?'a':'b';drag.fixed=c[drag.mk==='a'?'b':'a'];document.getElementById('cab-'+c.id)?.classList.add('dimmed');document.querySelectorAll('.pl-'+c.id).forEach(x=>x.classList.add('dimmed'))}
    cv.classList.add('wiring');$('#tmpw').style.display='';
  }
}
function updateWire(e,w){
  const el=document.elementFromPoint(e.clientX,e.clientY),pe=el&&el.closest?el.closest('#l-dev [data-port], #l-num [data-port]'):null;
  let t=null,ok=false;
  if(pe){const d=pe.closest('[data-dev]').dataset.dev,p=pe.dataset.port,fx=drag.fixed;t={d,p};
    if(!(fx.d===d&&fx.p===p)){
      if(isPas(ptype(p))){let s=pickSide(dev(d),p,dev(fx.d));if(drag.cable){const me=state.cables.find(x=>x.id===drag.cable)[drag.mk];if(me.d===d&&me.p===p)s=me.s==='r'?'r':'f'}t.s=s;ok=!!s}
      else{const oc=cabOf(d,p,'f');ok=!oc||(drag.cable&&oc.id===drag.cable)}
    }}
  if(drag.tEl&&drag.tEl!==pe)drag.tEl.classList.remove('tgt-ok','tgt-bad');
  if(pe){pe.classList.toggle('tgt-ok',ok);pe.classList.toggle('tgt-bad',!ok)}
  drag.tEl=pe;drag.target=t;drag.ok=ok;
  const A=endPos(drag.fixed),B=pe&&ok?endPos(t):{x:w.x,y:w.y,dir:0},D=pathD(cpath(A,B));
  $('#tmp').setAttribute('d',D);$('#tmpE').setAttribute('d',D);
}
function endDrag(e,cancel){
  if(!drag)return;const g=drag;drag=null;cancelAnimationFrame(raf);
  cv.classList.remove('wiring','panning');try{cv.releasePointerCapture(g.pid)}catch(_){}
  $('#tmpw').style.display='none';snapShow(null);if(g.tEl)g.tEl.classList.remove('tgt-ok','tgt-bad');
  $('#band').style.display='none';
  if(cancel){
    if(g.moved&&g.kind==='dev'&&g.grp){for(const m of g.grp){m.d.x=m.x;m.d.y=m.y}H.u.pop()}
    else if(g.moved&&g.kind==='dev'){const d=dev(g.id);Object.assign(d,g.orig);H.u.pop()}
    if(g.moved&&g.kind==='rack'){Object.assign(rackOf(g.id),g.orig);H.u.pop()}
    if(g.moved&&g.kind==='room'){Object.assign(roomOf(g.id),g.orig);for(const m of g.mem){m.o.x=m.x;m.o.y=m.y}H.u.pop()}
    if(g.moved&&g.kind==='resize'){Object.assign(roomOf(g.id),g.orig);H.u.pop()}
    renderAll();return}
  if(g.kind==='band'){if(g.moved&&g.bx){const [x1,y1,x2,y2]=g.bx,hit=state.devices.filter(d=>{if(HID.has(d.id))return false;const L=lay(d);return d.x<x2&&d.x+L.W>x1&&d.y<y2&&d.y+L.H>y1}).map(d=>d.id);if(!g.add)MS.clear();else if(!MS.size&&sel&&sel.kind==='dev')MS.add(sel.id);hit.forEach(id=>MS.add(id));msApply()}else if(!g.add&&sel)select(null);return}
  if(!g.moved){
    if(g.tog){msToggle(g.id);return}
    if(g.kind==='port')select({kind:'port',dev:g.dev,port:g.port});
    else if(g.kind==='cable')select({kind:'cable',id:g.id});
    else if(g.kind==='dev'&&g.bay!=null&&raidEdit&&raidEdit.dev===g.id){raidToggle(dev(g.id),raidEdit.id,g.bay)}
    else if(g.kind==='dev'){select({kind:'dev',id:g.id});if(g.bay!=null){const f=$('#f-disk-'+g.bay);if(f){f.scrollIntoView({block:'center'});f.focus()}}}
    else if(g.kind==='rack'){if(g.slot){const [r,u]=g.slot.split(':');openAdd(null,{rack:r,u:+u})}else select({kind:'rack',id:g.id})}
    else if(g.kind==='room'||g.kind==='resize')select({kind:'room',id:g.id});
    else if(sel)select(null);
    return;
  }
  if(g.kind==='dev'&&g.grp){touched();sel={kind:'multi'};renderAll();return}
  if(g.kind==='dev'){const d=dev(g.id);
    if(g.tr){if(!rackInsert(d,g.tr,g.tu)){Object.assign(d,g.orig)}else if(g.orig.rack!==d.rack)toast(`In „${g.tr.name}“ eingebaut – ${heTxt(d)}`)}
    else if(d.rack){d.rack=null;toast('Aus dem Schrank ausgebaut')}
    touched();sel={kind:'dev',id:g.id};renderAll();return}
  if(g.kind==='rack'){touched();sel={kind:'rack',id:g.id};renderAll();return}
  if(g.kind==='room'||g.kind==='resize'){touched();sel={kind:'room',id:g.id};renderAll();return}
  if(g.kind!=='port')return;
  if(g.target&&g.ok){
    if(g.cable){const c=state.cables.find(x=>x.id===g.cable),me=c[g.mk],ne={d:g.target.d,p:g.target.p};if(g.target.s==='r')ne.s='r';
      if(me.d!==ne.d||me.p!==ne.p||(me.s==='r')!==(ne.s==='r')){ck();c[g.mk]=ne;applyMed(c);touched();toast('Kabel umgesteckt')}
      sel={kind:'cable',id:c.id};renderAll()}
    else connect(g.fixed,g.target);
  }else{
    if(g.target)toast('An diesem Port ist kein Anschluss mehr frei');
    else if(g.cable)toast('Zum Trennen das Kabel anklicken und „Kabel entfernen“ wählen');
    renderCanvas();
  }
}
cv.addEventListener('pointerup',e=>endDrag(e,false));
cv.addEventListener('pointercancel',e=>endDrag(e,true));
cv.addEventListener('dblclick',e=>{const dg=e.target.closest('[data-dev]');if(dg&&!e.target.closest('[data-port]')){select({kind:'dev',id:dg.dataset.dev});const f=$('#f-name');f&&(f.focus(),f.select())}});
stage.addEventListener('wheel',e=>{if(mode!=='plan')return;e.preventDefault();const r=cv.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,Math.exp(-e.deltaY*(e.deltaMode===1?.05:.0016)))},{passive:false});

/* ================= UI events ================= */
const ic=$('#ic');
ic.addEventListener('input',e=>applyField(e.target,true));
ic.addEventListener('change',e=>{const el=e.target;if(el.dataset.conn){if(!el.value)return;const [d,p]=el.value.split(':'),sd=el.dataset.side;connect(sd?{d:sel.dev,p:sel.port,s:sd}:{d:sel.dev,p:sel.port},{d,p});return}applyField(el,false)});
ic.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');
  if(b){const a=b.dataset.act;
    if(a==='dup')dupDev(dev(sel.id));else if(a==='deldev')delDev(dev(sel.id));
    else if(a==='selcab')select({kind:'cable',id:b.dataset.id});else if(a==='delcab')delCable(b.dataset.id);
    else if(a==='seldev'){select({kind:'dev',id:b.dataset.id});centerOn(dev(b.dataset.id))}
    else if(a==='selrack'){select({kind:'rack',id:b.dataset.id})}
    else if(a==='goport'){select({kind:'port',dev:b.dataset.d,port:b.dataset.p});centerOn(dev(b.dataset.d))}
    else if(a==='addin')openAdd(null,{rack:b.dataset.id});
    else if(a==='delrack')delRack(rackOf(sel.id));
    else if(a==='delroom')delRoom(roomOf(sel.id));
    else if(a==='fitroom')fitRoom(roomOf(sel.id));
    else if(a==='diskok'){const d=dev(sel.id),i=b.dataset.i;if(d&&d.disks&&d.disks[i]){ck();d.disks[i].ok=true;touched();renderAll()}}
    else if(a==='raidadd'){const d=dev(sel.id);if(!d)return;ck();d.raids=d.raids||[];const used=new Set(d.raids.map(r=>r.col));let col=0;while(used.has(col)&&col<RAIDC.length)col++;const r={id:'r'+rid(),name:'Verbund '+(d.raids.length+1),lvl:'5',col:col%RAIDC.length,disks:[]};d.raids.push(r);raidEdit={dev:d.id,id:r.id};touched();renderAll();toast('Platten im Plan oder über die Nummern auswählen')}
    else if(a==='raidtog'){const d=dev(sel.id);d&&raidToggle(d,b.dataset.r,+b.dataset.i)}
    else if(a==='raidedit'){const d=dev(sel.id);raidEdit=raidEdit&&raidEdit.id===b.dataset.r?null:{dev:d.id,id:b.dataset.r};renderAll()}
    else if(a==='raiddel'){const d=dev(sel.id);if(!d)return;ck();d.raids=(d.raids||[]).filter(r=>r.id!==b.dataset.r);if(raidEdit&&raidEdit.id===b.dataset.r)raidEdit=null;touched();renderAll()}
    else if(a==='vtag'||a==='vtagall'){const d=dev(sel.dev);if(!d)return;ck();const o=d.ports[sel.port]||(d.ports[sel.port]={});const T=new Set(o.tv||[]);if(a==='vtagall')state.vlans.forEach(v=>T.add(v.id));else{const v=+b.dataset.v;T.has(v)?T.delete(v):T.add(v)}o.tv=[...T].sort((x,y)=>x-y);o.vm='trunk';touched();renderAll()}
    else if(a==='vlanlist'){setMode('list');setTab('netze')}
    else if(a==='vbulk'){const d=dev(sel.id);if(!d)return;const f=+$('#f-vb1').value,t=+$('#f-vb2').value,v=$('#f-vb3').value;const ps=lay(d).ports.filter(p=>vlanPort(d,p.id)&&p.num>=Math.min(f,t)&&p.num<=Math.max(f,t));if(!ps.length){toast('Keine passenden Ports');return}ck();
      for(const p of ps){const o=d.ports[p.id]||(d.ports[p.id]={});if(v==='trunk'){o.vm='trunk';o.tv=state.vlans.map(x=>x.id)}else if(v===''){delete o.vm;delete o.tv;delete o.vlan}else{delete o.vm;delete o.tv;o.vlan=+v}if(!Object.keys(o).length)delete d.ports[p.id]}
      touched();renderAll();toast(`${pl(ps.length,'Port','Ports')} geändert`)}
    else if(a==='freeip'){const d=dev(sel.id),v=vlanOf(b.dataset.v),ip=v&&freeIp(v);if(!d||!ip){toast('Kein freies Subnetz gefunden');return}ck();d.ip=ip;touched();renderAll();toast('IP '+ip+' vergeben')}
    else if(a==='qr'){showQR(b.dataset.k,b.dataset.id)}
    else if(a==='tplsave'){const d=dev(sel.id);d&&saveTemplate(d)}
    else if(a==='mrem'){MS.delete(b.dataset.id);msApply()}
    else if(a==='malign'){const L=[...MS].map(dev).filter(d=>d&&!d.rack),m=b.dataset.m;if(L.length<2)return;ck();
      if(m==='top'){const y=Math.min(...L.map(d=>d.y));L.forEach(d=>d.y=y)}else if(m==='left'){const x=Math.min(...L.map(d=>d.x));L.forEach(d=>d.x=x)}
      else{const h=m==='dh',k=h?'x':'y',sz=d=>h?lay(d).W:lay(d).H;L.sort((a,b)=>a[k]-b[k]);const span=L[L.length-1][k]+sz(L[L.length-1])-L[0][k],sum=L.reduce((a,d)=>a+sz(d),0),gap=Math.max(20,(span-sum)/(L.length-1));let p=L[0][k];for(const d of L){d[k]=sn(p);p+=sz(d)+gap}}
      touched();renderAll()}
    else if(a==='mset'){const k=b.dataset.k,L=[...MS].map(dev).filter(Boolean);if(k==='year'){const v=parseInt($('#f-my').value,10);if(!(v>=1980&&v<=2100)){toast('Bitte ein Jahr eingeben');return}ck();L.forEach(d=>d.year=v);toast('Kaufjahr '+v+' gesetzt')}
      else if(k==='pa'){const v=$('#f-mpa').value;ck();let n=0;for(const d of L)if(pwrDev(d)&&d.id!==v&&srcOpts(d).some(o=>o[0]===v)){d.pa=v;n++}toast(pl(n,'Gerät','Geräten')+' zugeordnet')}touched();renderAll()}
    else if(a==='mdup'){const L=[...MS].map(dev).filter(Boolean);ck();const nw=[];for(const d of L){const n=JSON.parse(JSON.stringify(d));n.id='d'+rid();n.name=trunc(d.name+' (Kopie)',40);if(n.rack){const r=rackOf(n.rack);n.rack=null;if(r){n.x=sn(r.x+rgeom(r).W+80);n.y=d.y}}else{n.x+=60;n.y+=60}state.devices.push(n);nw.push(n.id)}MS=new Set(nw);touched();select({kind:'multi'});toast(pl(nw.length,'Kopie','Kopien')+' angelegt')}
    else if(a==='mhide'){const ids=[...MS];setHid(ids,true);MS.clear();sel=null;renderAll();toast('Ausgeblendet – über „Ansicht“ wieder einblenden')}
    else if(a==='mdel')msDelete();
    else if(a==='hide'){const id=b.dataset.id,h=HIDL.has(id);setHid([id],!h);if(!h){sel=null;toast('Ausgeblendet – über „Ansicht“ oben wieder einblenden')}renderAll()}
    else if(a==='q'){setMode('plan');const r=$('#rail');if(getComputedStyle(r).position==='absolute')r.classList.add('open');$('#rq').value=b.dataset.q;renderRail();$('#rq').focus()}
    return}
  const tr=e.target.closest('tr[data-sp]');if(tr&&sel&&sel.kind==='dev'){select({kind:'port',dev:sel.id,port:tr.dataset.sp});return}
  const td=e.target.closest('tr[data-dv]');if(td){select({kind:'dev',id:td.dataset.dv});centerOn(dev(td.dataset.dv));return}
  const ts=e.target.closest('tr[data-slotrow]');if(ts&&sel&&sel.kind==='rack')openAdd(null,{rack:sel.id,u:+ts.dataset.slotrow});
});
ic.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const tr=e.target.closest&&e.target.closest('tr[data-sp],tr[data-dv],tr[data-slotrow]');if(tr){e.preventDefault();tr.click()}});
$('#rail').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.cat){const k=b.dataset.cat;closedCats.has(k)?closedCats.delete(k):closedCats.add(k);renderRail();return}
  if(b.dataset.port){setMode('plan');select({kind:'port',dev:b.dataset.dev,port:b.dataset.port});centerOn(dev(b.dataset.dev));return}
  if(b.dataset.dev){setMode('plan');select({kind:'dev',id:b.dataset.dev});centerOn(dev(b.dataset.dev))}
  else if(b.dataset.rk||b.dataset.rkw){const r=rackOf(b.dataset.rk||b.dataset.rkw);setMode('plan');select({kind:'rack',id:r.id});const G=rgeom(r);centerRect(r.x,r.y,G.W,G.H)}
  else if(b.dataset.rm){const r=roomOf(b.dataset.rm);setMode('plan');select({kind:'room',id:r.id});centerRect(r.x,r.y,r.w,r.h)}
  else if(b.dataset.dv){setMode('plan');select({kind:'dev',id:b.dataset.dv});centerOn(dev(b.dataset.dv))}
  else if(b.dataset.cab){setMode('plan');select({kind:'cable',id:b.dataset.cab});centerCable(b.dataset.cab)}
});
$('#proj').addEventListener('input',e=>{ck('proj');state.name=e.target.value.slice(0,80);touched();if(!sel)renderInsp()});
$('#b-undo').onclick=undo;$('#b-redo').onclick=redo;
function renderVis(){const P=$('#vpop');if(P.hidden)return;
  const T=visTree(),H=HIDL,q=norm($('#vq').value.trim());
  const chev='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const node=(n,dep)=>{
    if(!n.kids){if(q&&!norm(n.n+' '+(n.o.user||'')+' '+(n.o.ip||'')).includes(q))return '';const on=!H.has(n.id);
      return `<li class="vl"><label class="vrow"><input type="checkbox" data-vid="${n.id}"${on?' checked':''}><span class="vn">${esc(n.n)}${n.o.user?` <small>${esc(n.o.user)}</small>`:''}</span>${n.o.kind?lcPill(n.o):''}</label></li>`}
    const L=leavesOf(n),nh=L.filter(id=>H.has(id)).length,inner=n.kids.map(k=>node(k,dep+1)).join('');
    if(q&&!inner)return '';const open=!!q||openV.has(n.key),st=!L.length?'none':nh===0?'on':nh===L.length?'off':'mix';
    return `<li class="vc d${dep}"><div class="vrow"><button type="button" class="vexp" data-vexp="${n.key}" aria-expanded="${open}" aria-label="${esc(n.n)} auf- oder zuklappen"${L.length?'':' disabled'}>${chev}</button><label><input type="checkbox" data-vk="${n.key}"${st==='on'?' checked':''}${st==='none'?' disabled':''} data-mix="${st==='mix'?1:0}"><span class="vn">${esc(n.n)}${n.how?`<small>${n.how}</small>`:''}</span></label><span class="cnt">${!L.length?'–':nh?nh+'/'+L.length+' aus':L.length}</span></div>${open&&inner?`<ul>${inner}</ul>`:''}</li>`};
  const html=T.map(n=>node(n,0)).join('');
  $('#vtree').innerHTML=html||'<li class="none">Nichts gefunden.</li>';
  $('#vtree').querySelectorAll('[data-mix="1"]').forEach(el=>el.indeterminate=true);
  $('#vall').disabled=!H.size;
}
function toggleVis(open){const P=$('#vpop');P.style.top=open&&innerWidth<=600?($('#b-vis').getBoundingClientRect().bottom+6)+'px':'';P.hidden=!open;$('#b-vis').setAttribute('aria-expanded',String(open));if(open){renderVis();$('#vq').focus()}}
$('#b-vis').onclick=e=>{e.stopPropagation();toggleVis($('#vpop').hidden)};
document.addEventListener('click',e=>{if(!$('#vpop').hidden&&!e.composedPath().some(n=>n.classList&&n.classList.contains('visw')))toggleVis(false)});
$('#vq').addEventListener('input',renderVis);
$('#vpop').addEventListener('click',e=>{const x=e.target.closest('[data-vexp]');if(x){const k=x.dataset.vexp;openV.has(k)?openV.delete(k):openV.add(k);renderVis();return}
  if(e.target.closest('#vall')){ck('hide');state.view.hide={cats:[],ids:[]};touched();renderAll();toast('Alles wieder eingeblendet')}});
$('#vpop').addEventListener('change',e=>{const el=e.target;
  if(el.dataset.vid){setHid([el.dataset.vid],!el.checked);renderAll();return}
  if(el.dataset.vk){const n=findNode(visTree(),el.dataset.vk);if(!n)return;setHid(leavesOf(n),!el.checked);renderAll()}});
$('#rq').addEventListener('input',()=>renderRail());
$('#rq').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const b=$('#catlist button.dm')||$('#catlist .devlist button')||$('#racklist button')||$('#roomlist button')||$('#cablist button');b&&b.click()}else if(e.key==='Escape'&&e.target.value){e.stopPropagation();e.target.value='';renderRail()}});
$('#b-add').onclick=()=>openAdd();$('#b-add2').onclick=()=>openAdd();
$('#b-rail').onclick=()=>$('#rail').classList.toggle('open');
$('#itog').onclick=()=>{const m=$('#insp').classList.toggle('min');$('#itog').setAttribute('aria-expanded',String(!m))};
$('#z-in').onclick=()=>zoomBy(1.25);$('#z-out').onclick=()=>zoomBy(.8);$('#z-fit').onclick=fit;$('#z-arr').onclick=arrange;
$('#z-lbl').onclick=()=>{const r=stage.getBoundingClientRect();zoomAt(r.width/2,r.height/2,1/view.z)};
function setMode(m){mode=m;for(const [id,k] of [['#t-plan','plan'],['#t-topo','topo'],['#t-list','list']])$(id).setAttribute('aria-selected',String(m===k));$('#main').classList.toggle('tbl',m!=='plan');$('#tview').hidden=m!=='list';$('#topo').hidden=m!=='topo';if(m==='list')renderTable();else if(m==='topo')renderTopo(true);else requestAnimationFrame(applyView)}
$('#t-plan').onclick=()=>setMode('plan');$('#t-list').onclick=()=>setMode('list');$('#t-topo').onclick=()=>setMode('topo');
function setTab(t){tmode=t;document.querySelectorAll('.vt button').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.tm===t)));renderTable()}
$('.vt').addEventListener('click',e=>{const b=e.target.closest('[data-tm]');if(b)setTab(b.dataset.tm)});
$('#q').addEventListener('input',renderTable);
$('#t-opts').addEventListener('change',e=>{if(e.target.id==='t-psep'){ck('view');state.view.psep=e.target.value;touched();renderAll()}if(e.target.id==='t-pfree'){ck('view');state.view.pfree=e.target.checked;touched();renderAll()}});
$('#b-csv').onclick=exportTab;
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(!$('#vpop').hidden){toggleVis(false);$('#b-vis').focus();return}
    if(!$('#modal').hidden){closeModal();return}
    if(!$('#menu').hidden){toggleMenu(false);return}
    if(drag){endDrag(e,true);return}
    if(sel)select(null);return}
  const t=e.target;if(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||!$('#modal').hidden)return;
  const mod=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();
  if(e.key==='/'&&!mod){e.preventDefault();const r=$('#rail');if(getComputedStyle(r).position==='absolute'&&!r.classList.contains('open'))$('#b-rail').click();$('#rq').focus();return}
  if(mod&&k==='z'){e.preventDefault();e.shiftKey?redo():undo();return}
  if(mod&&k==='y'){e.preventDefault();redo();return}
  if(mode!=='plan')return;
  if(mod&&k==='d'&&sel&&sel.kind==='dev'){e.preventDefault();dupDev(dev(sel.id));return}
  if(mod&&k==='a'){e.preventDefault();MS=new Set(state.devices.filter(d=>!HID.has(d.id)).map(d=>d.id));msApply();return}
  if(sel&&sel.kind==='multi'){if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();msDelete();return}if(e.key.startsWith('Arrow')){e.preventDefault();const st=e.shiftKey?50:10;msMove(e.key==='ArrowLeft'?-st:e.key==='ArrowRight'?st:0,e.key==='ArrowUp'?-st:e.key==='ArrowDown'?st:0);return}}
  if((e.key==='Delete'||e.key==='Backspace')&&sel){e.preventDefault();
    if(sel.kind==='cable')delCable(sel.id);else if(sel.kind==='dev')delDev(dev(sel.id));else if(sel.kind==='rack')delRack(rackOf(sel.id));else if(sel.kind==='room')delRoom(roomOf(sel.id));else if(sel.kind==='port'){const c=cabOf(sel.dev,sel.port,'f')||cabOf(sel.dev,sel.port,'r');c&&delCable(c.id)}return}
  if(sel&&(sel.kind==='dev'||sel.kind==='rack'||sel.kind==='room')&&e.key.startsWith('Arrow')){
    const o=sel.kind==='dev'?dev(sel.id):sel.kind==='rack'?rackOf(sel.id):roomOf(sel.id);if(sel.kind==='dev'&&o.rack)return;
    e.preventDefault();const s=e.shiftKey?50:10;ck('arrow'+o.id);const mx=e.key==='ArrowLeft'?-s:e.key==='ArrowRight'?s:0,my=e.key==='ArrowUp'?-s:e.key==='ArrowDown'?s:0;
    if(sel.kind==='room')for(const i of roomItems(o)){i.o.x+=mx;i.o.y+=my}
    o.x+=mx;o.y+=my;touched();renderAll(true);return}
  if(!mod&&(e.key==='+'||e.key==='='))zoomBy(1.25);
  if(!mod&&e.key==='-')zoomBy(.8);
  if(!mod&&e.key==='0')fit();
});

/* ================= menu, export, import ================= */
function buildMenu(){
  const can=!!DL;
  const items=[['json',can?'Projekt speichern (.json)':'Projekt als JSON kopieren'],['open','Projekt laden …'],['-'],['csv',can?'Patchliste als CSV':'Patchliste kopieren (CSV)'],['csv2',can?'Patchlegung als CSV':'Patchlegung kopieren (CSV)'],['svg',can?'Plan als SVG-Bild':'Plan als SVG kopieren']];
  if(can)items.push(['png','Plan als PNG-Bild']);
  items.push(['-'],['pdf','PDF-Dokumentation'],['labels','Etiketten drucken …'],['-'],['versions','Versionsverlauf …'],['-'],['example','Beispielprojekt laden'],['new','Neues leeres Projekt']);
  $('#menu').innerHTML=items.map(([k,t])=>k==='-'?'<hr>':`<button type="button" role="menuitem" data-m="${k}">${t}</button>`).join('');
  $('#b-csv').textContent=can?'CSV herunterladen':'CSV kopieren';
}
function toggleMenu(open){const m=$('#menu');m.hidden=!open;$('#b-file').setAttribute('aria-expanded',String(open));if(open)m.querySelector('button')?.focus()}
$('#b-file').onclick=e=>{e.stopPropagation();toggleMenu($('#menu').hidden)};
document.addEventListener('click',e=>{if(!$('#menu').hidden&&!e.target.closest('.menuw'))toggleMenu(false)});
$('#menu').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;toggleMenu(false);menuAct(b.dataset.m)});
const emptyState=()=>({v:3,name:'Neues Netzwerk',devices:[],cables:[],racks:[],rooms:[],view:{labelMode:'num',colorBy:'speed',hide:{cats:[],ids:[]}},life:{old:5,eol:10},vlans:[],templates:[],updated:0,demo:false});
async function menuAct(m){
  if(['json','csv','csv2','svg','png'].includes(m))return exp(m);
  if(m==='open')return openImport();
  if(m==='versions')return openVersions();
  if(m==='pdf')return makeDoc();
  if(m==='labels')return openLabels();
  if(m==='example'){if(state.devices.length&&!state.demo&&!(await ask('Beispiel laden?','Das aktuelle Projekt wird ersetzt. Mit Strg+Z holst du es zurück.','Beispiel laden')))return;ck();state=demo();sel=null;LC.clear();touched();state.demo=true;renderAll();fit();return}
  if(m==='new'){if((state.devices.length||state.racks.length||state.rooms.length)&&!(await ask('Neues Projekt?','Das aktuelle Projekt wird geleert. Mit Strg+Z holst du es zurück.','Leeren',true)))return;ck();state=emptyState();sel=null;touched();renderAll();fit()}
}
const slug=()=>(state.name||'netzwerk').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'netzwerk';
const portCell=e=>{const d=dev(e.d),l=pconf(d,e.p).label;return `${pname(d,e.p)}${e.s==='r'?' (Rück)':''}${l?' – '+l:''}`};
const devCell=d=>d.name+(d.rack?` (${where(d)})`:'');
function trTxt(c){if(c.med!=='cu'&&c.med!=='fi')return '';return ['a','b'].filter(k=>c['t'+k]).map(k=>`${k.toUpperCase()}: ${c['t'+k]}${c['i'+k]?' ('+c['i'+k]+')':''}`).join(' · ')}
function cableRows(){
  return [...state.cables].sort((a,b)=>String(a.label).localeCompare(String(b.label),'de',{numeric:true})).map(c=>{const inf=AN.get(c.id);
    return {c,cells:[c.label||'–',devCell(dev(c.a.d)),portCell(c.a),devCell(dev(c.b.d)),portCell(c.b),cspec(c).replace(/ · [\d,]+ m$/,''),trTxt(c),fmtLen(c.len),inf.nolink?'kein Link':inf.speed?SP[inf.speed].n:'passiv',inf.iss.filter(i=>i[0]!=='info').map(i=>i[1]).join(' / ')]}});
}
/* ---------- Patchlegung: je Raum und Switch, Port → Patchpanel → Endgerät ---------- */
function panelTag(d){if(d.ptag)return d.ptag;const L=state.devices.filter(x=>(x.kind==='patch'||x.kind==='fiber')&&(x.rack||'')===(d.rack||'')&&x.id!==d.id);
  const before=L.filter(x=>d.rack?(x.u<d.u):(x.y<d.y||(x.y===d.y&&x.x<d.x))).length;return String(before+1)}
/* eigene Portbeschriftung (weißes Feld) hat Vorrang, sonst Kürzel + Portnummer */
function autoDesig(d,pid){const p=lay(d).ports.find(q=>q.id===pid);return panelTag(d)+(state.view.psep||'.')+(p&&p.num?p.num:pname(d,pid))}
function patchDesig(d,pid){const cf=d.ports[pid];return cf&&cf.label?cf.label:autoDesig(d,pid)}
const devClass=x=>x.kind==='host'||x.kind==='net'?subLbl(x):x.kind==='ap'?'Access Point':KIND[x.kind].n;
const vlanName=id=>{const v=vlanOf(id);return v&&v.name?v.name:'VLAN '+id};
function patchRows(){
  const free=!!state.view.pfree,csvRows=[],tree=[];let nP=0,nS=0;
  const sws=state.devices.filter(d=>d.kind==='switch');
  const byRoom=new Map();for(const d of sws){const rm=devRoom(d),k=rm?rm.id:'';if(!byRoom.has(k))byRoom.set(k,[]);byRoom.get(k).push(d)}
  const roomKeys=[...state.rooms.filter(r=>byRoom.has(r.id)).map(r=>r.id),...(byRoom.has('')?['']:[])];
  const nat=(a,b)=>String(a).localeCompare(String(b),'de',{numeric:true});
  for(const rk of roomKeys){const rm=roomOf(rk),R={name:rm?rm.name:'Ohne Raum',racks:[]};tree.push(R);
    const byRack=new Map();for(const d of byRoom.get(rk)){const k=d.rack||'';if(!byRack.has(k))byRack.set(k,[]);byRack.get(k).push(d)}
    const rackKeys=[...byRack.keys()].sort((a,b)=>a===''?1:b===''?-1:nat(rackOf(a).name,rackOf(b).name));
    for(const kk of rackKeys){const r=kk&&rackOf(kk),K={name:r?r.name:'Ohne Schrank',meta:r?`${r.rsize}″ · ${rgeom(r).n} HE`:'frei stehend',sws:[]};R.racks.push(K);
      for(const sw of byRack.get(kk).sort((a,b)=>(a.u||0)-(b.u||0)||nat(a.name,b.name))){nS++;const S={sw,meta:[r?heTxt(sw):'',sw.model,`${usedPorts(sw)}/${total(sw)} Ports belegt`].filter(Boolean).join(' · '),rows:[]};K.sws.push(S);
        for(const p of lay(sw).ports){const c=cabOf(sw.id,p.id,'f');if(!c&&!free)continue;
          let patch='',cls='',user='';
          if(c){const ch=AN.get(c.id)&&AN.get(c.id).ch,St=ch?ch.steps:[];
            if(St.length){const fwd=St[0].from.d===sw.id&&St[0].from.p===p.id,hops=fwd?St.slice(0,-1).map(x=>x.to):St.slice(1).map(x=>x.from).reverse(),far=fwd?St[St.length-1].to:St[0].from;
              patch=[...hops,far].filter(e=>{const x=dev(e.d);return x&&(x.kind==='patch'||x.kind==='fiber')}).map(e=>patchDesig(dev(e.d),e.p)).join(' › ');
              const x=dev(far.d);if(x&&x.id!==sw.id&&!isPas(ptype(far.p))){cls=devClass(x);user=x.user||(x.kind==='host'?'':x.name)}}nP++}
          const pv=pvlan(sw,p.id),vl=!pv?'':pv.m==='access'?vlanName(pv.v):'Trunk'+(pv.tag.length?' ('+pv.tag.join(', ')+')':''),port=p.num?String(p.num).padStart(2,'0'):pname(sw,p.id);
          S.rows.push({dv:sw.id,port:p.id,free:!c,vc:pv&&pv.m==='access'?vcol(pv.v):null,cells:[port,patch,vl,cls,user]});
          csvRows.push([R.name,K.name,sw.name,port,patch,vl,cls,user])}}}}
  const flat=tree.flatMap(R=>R.racks.flatMap(K=>K.sws.flatMap(S=>S.rows)));
  return {heads:['Port','Patch','VLAN','Gerät','Nutzer'],tree,rows:flat,csv:{heads:['Raum','Schrank','Switch','Port','Patch','VLAN','Gerät','Nutzer'],rows:csvRows},sub:`${pl(nS,'Switch','Switches')} · ${pl(nP,'Port','Ports')} gepatcht`}}
function renderPatch(T,q){const box=$('#tcustom'),H=T.heads,m=t=>String(t).toLowerCase().includes(q);let h='',hits=0;
  for(const R of T.tree){let rh='';
    for(const K of R.racks){let kh='';
      for(const S of K.sws){const rows=q&&!m(S.sw.name)&&!m(K.name)&&!m(R.name)?S.rows.filter(r=>m(r.cells.join(' '))):S.rows;if(q&&!rows.length)continue;hits+=rows.length;
        kh+=`<section class="plsw"><h5>${esc(S.sw.name)} <small>${esc(S.meta)}</small></h5>${rows.length?`<div class="scroll"><table class="patch pl"><thead><tr>${H.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr data-dv="${r.dv}" data-port="${r.port}" tabindex="0"${r.free?' class="free"':''}>${r.cells.map((v,i)=>`<td data-l="${H[i]}"><span>${i===2&&r.vc&&v?`<i class="dot" style="--c:${r.vc}"></i>`:''}${esc(v)}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p class="note">Noch keine Ports gepatcht. Mit „Freie Ports“ siehst du alle Ports.</p>'}</section>`}
      if(kh)rh+=`<section class="plrack"><h4>${esc(K.name)} <small>${esc(K.meta)}</small></h4>${kh}</section>`}
    if(rh)h+=`<section class="plroom"><h3>${esc(R.name)}</h3>${rh}</section>`}
  box.innerHTML=h||`<p class="note">${q?'Keine Treffer.':'Noch keine Switches im Plan. Lege einen Switch an und verbinde seine Ports – die Patchlegung entsteht automatisch.'}</p>`;return hits}
$('#tcustom').addEventListener('click',e=>{const tr=e.target.closest('tr[data-dv]');tr&&openRow(tr)});
$('#tcustom').addEventListener('keydown',e=>{const tr=e.target.closest('tr[data-dv]');if(tr&&e.key==='Enter')openRow(tr)});
function csv(kind){
  const q=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return /[";\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
  let rows;
  if(kind==='csv2'){const P=patchRows();rows=[P.csv.heads,...P.csv.rows]}
  else rows=[['Kabel','Von Gerät','Von Port','Nach Gerät','Nach Port','Medium','Transceiver','Länge','Link','Hinweis','Farbe','Notiz'],...cableRows().map(r=>[...r.cells,COL[r.c.color].n,r.c.notes])];
  return '﻿'+rows.map(r=>r.map(q).join(';')).join('\r\n');
}
function buildSVG(crop){const keep=[HID,FD,FR,FM,HL,SDV];HID=new Set();FD=new Set();FR=new Set();FM=new Set();HL=null;SDV=null;try{return buildSVG_(crop)}finally{[HID,FD,FR,FM,HL,SDV]=keep}}
function buildSVG_(crop){
  const b=crop||bbox(),pad=crop?0:36,x=b.x1-pad,y=b.y1-pad-(crop?0:44),w=Math.ceil(b.x2-b.x1+pad*2),h=Math.ceil(b.y2-b.y1+pad*2+(crop?0:44)),cs=cablesSVG({exp:true});
  const rooms=state.rooms.map(rm=>roomSVG(rm,{})).join(''),racks=state.racks.map(r=>rackFrameSVG(r,{})).join(''),devs=state.devices.map(d=>devSVG(d,{})).join(''),nums=state.devices.map(d=>numSVG(d,{})).join('');
  return {w,h,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${w} ${h}" font-family="Hanken Grotesk, Arial, Helvetica, sans-serif"><defs>${defsSVG()}</defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e4e4e0"/><text x="${b.x1}" y="${b.y1-pad-10}" font-size="22" font-weight="700" fill="#111">${esc(state.name)}</text><text x="${b.x2}" y="${b.y1-pad-10}" text-anchor="end" font-size="13" fill="#5b5b56">${state.devices.length} Geräte · ${state.racks.length} Schränke · ${state.cables.length} Kabel · Stand ${new Date().toLocaleDateString('de-DE')}</text>${rooms}${racks}${devs}${cs.vis}${cs.plug}${cs.lab}${nums}</svg>`};
}
async function exp(kind){
  if(kind==='csv'&&tmode==='strecken'&&mode==='list')kind='csv2';
  if(!contentBox()&&kind!=='json'){toast('Noch nichts zum Exportieren');return}
  const name=slug();
  if(kind==='png'){
    const {svg,w,h}=buildSVG(),s=Math.min(2,8000/Math.max(w,h)),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    try{const img=new Image();await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});const c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);const g=c.getContext('2d');g.scale(s,s);g.drawImage(img,0,0,w,h);const blob=await new Promise(r=>c.toBlob(r,'image/png'));await save(name+'.png',blob)}
    catch(_){toast('Bild konnte nicht erzeugt werden')}finally{URL.revokeObjectURL(url)}
    return}
  const text=kind==='json'?JSON.stringify(state,null,2):kind==='csv'||kind==='csv2'?csv(kind):buildSVG().svg;
  const label={json:'Projekt',csv:'Patchliste',csv2:'Patchlegung',svg:'SVG'}[kind];
  if(DL)await save(name+({json:'.json',csv:'-patchliste.csv',csv2:'-patchlegung.csv',svg:'.svg'}[kind]),text);
  else copyText(text,label);
}
async function save(filename,data){
  if(!DL&&!window.claude)DL=fileSaver();
  if(!DL){toast('Download ist in dieser Ansicht nicht verfügbar');return}
  try{await DL.save({filename,data});toast('Datei übergeben: '+filename)}
  catch(e){const c=e&&e.code;if(c==='declined')return;toast(c==='rate_limited'?'Bitte kurz warten und noch einmal versuchen':c==='host_unavailable'?'Diese App kann keine Dateien speichern – im Browser öffnen':'Download nicht möglich')}
}
async function copyText(text,label){
  try{await navigator.clipboard.writeText(text);toast(label+' in die Zwischenablage kopiert')}
  catch(_){modal(`<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="m-t"><h2 id="m-t">${esc(label)} kopieren</h2><p>Text markieren und kopieren:</p><textarea id="m-copy" rows="10" readonly></textarea><div class="mf"><button type="button" class="btn pri" data-close>Fertig</button></div></div>`);const t=$('#m-copy');t.value=text;t.focus();t.select()}
}
const closeBtn='<button type="button" class="ib" data-close aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
function openImport(){
  modal(`<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="mh"><h2 id="m-t">Projekt laden</h2>${closeBtn}</div>
  <p>Wähle eine gespeicherte .json-Datei oder füge ihren Inhalt ein. Das aktuelle Projekt wird ersetzt – Strg+Z holt es zurück.</p>
  <button type="button" class="btn wide" id="m-file">Datei wählen …</button>
  <label class="fld" for="m-json" style="margin-top:12px"><span>Oder JSON einfügen</span><textarea id="m-json" rows="6" spellcheck="false"></textarea></label>
  <p class="merr" id="m-err" role="alert"></p>
  <div class="mf"><button type="button" class="btn" data-close>Abbrechen</button><button type="button" class="btn pri" id="m-imp">Laden</button></div></div>`);
  $('#m-file').onclick=()=>$('#file').click();
  $('#m-imp').onclick=()=>importText($('#m-json').value);
}
$('#file').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{importText(await f.text())}catch(_){const m=$('#m-err');m&&(m.textContent='Datei konnte nicht gelesen werden.')}});
function importText(t){
  let s;try{s=sanitize(JSON.parse(t))}catch(_){const m=$('#m-err');if(m)m.textContent='Das ist keine gültige Projektdatei dieser App.';else toast('Keine gültige Projektdatei');return}
  ck();state=s;state.demo=false;sel=null;LC.clear();touched();closeModal();setMode('plan');renderAll();fit();toast(`Geladen: ${s.devices.length} Geräte, ${s.racks.length} Schränke, ${s.cables.length} Kabel`);
}
function sanitize(o){
  if(!o||typeof o!=='object'||!Array.isArray(o.devices))throw new Error('bad');
  const S=(v,n)=>typeof v==='string'?v.slice(0,n):typeof v==='number'?String(v).slice(0,n):'';
  const N=(v,a,b,df)=>{v=Number(v);return Number.isFinite(v)?clamp(Math.round(v),a,b):df};
  const okId=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,40}$/.test(v);
  const pick=(v,list,df)=>list.includes(v)?v:df;
  const ov_=o.view||{};
  const out={v:3,name:S(o.name,80)||'Netzwerk',devices:[],cables:[],racks:[],rooms:[],view:{labelMode:pick(ov_.labelMode,['num','spec','off'],ov_.labels===false?'off':'num'),colorBy:ov_.colorBy==='cable'?'cable':'speed',psep:pick(ov_.psep,['.','/','-'],'.'),pfree:!!ov_.pfree,hide:{cats:[],ids:[]},topoHosts:pick(ov_.topoHosts,['single','group','off'],''),topoColor:pick(ov_.topoColor,['speed','vlan'],'speed')},life:{old:N(o.life&&o.life.old,1,50,5),eol:N(o.life&&o.life.eol,1,60,10)},updated:Number(o.updated)||0,demo:!!o.demo};
  const oids=new Set();
  for(const r of (Array.isArray(o.racks)?o.racks:[]).slice(0,60)){if(!r||typeof r!=='object')continue;const id=okId(r.id)&&!oids.has(r.id)?r.id:'k'+rid();oids.add(id);out.racks.push({id,name:S(r.name,60)||'Schrank',rsize:pick(r.rsize,['19','10'],'19'),minHe:N(r.minHe,0,60,0),rcolor:pick(r.rcolor,['schwarz','grau'],'schwarz'),location:S(r.location,60),notes:S(r.notes,500),x:N(r.x,-50000,50000,40),y:N(r.y,-50000,50000,40)})}
  for(const m of (Array.isArray(o.rooms)?o.rooms:[]).slice(0,60)){if(!m||typeof m!=='object')continue;const id=okId(m.id)&&!oids.has(m.id)?m.id:'m'+rid();oids.add(id);out.rooms.push({id,name:S(m.name,60)||'Raum',roomc:pick(m.roomc,Object.keys(RCOL),'blau'),x:N(m.x,-50000,50000,0),y:N(m.y,-50000,50000,0),w:N(m.w,300,30000,1600),h:N(m.h,200,30000,1100),notes:S(m.notes,500)})}
  const ids=new Set(),rIds=new Set(out.racks.map(r=>r.id));
  for(const d of o.devices.slice(0,150)){
    if(!d||typeof d!=='object')continue;
    const fwOld=(d.kind==='host'&&d.sub==='fw')||(d.kind==='net'&&d.sub==='firewall');
    const kind=fwOld?'fw':KIND[d.kind]?d.kind:'switch',K=KIND[kind],id=okId(d.id)&&!ids.has(d.id)?d.id:'d'+rid();ids.add(id);
    const x=mkDev(kind,{id});
    x.name=S(d.name,40)||K.n;for(const k of ['model','role','location','ip','user','mac'])x[k]=S(d[k],F[k].max);x.notes=S(d.notes,500);
    x.style=K.styles.includes(d.style)?d.style:K.styles[0];
    x.x=N(d.x,-50000,50000,40);x.y=N(d.y,-50000,50000,40);
    x.size=K.rack?pick(d.size,kind==='ups'?['frei','19']:['frei','10','19'],d.pc?x.size:'frei'):'frei';x.he=N(d.he,1,K.maxHe||1,x.he);x.rows=pick(d.rows,['auto','1','2'],'auto');x.pnum=pick(d.pnum,['col','colr','row','rowr'],'col');x.ptag=S(d.ptag,12);
    if(kind==='server'){const big=x.size!=='frei'&&x.he>1&&d.bays==null;x.bays=N(d.bays,0,48,big?12:8);x.baysUsed=N(d.baysUsed,0,x.bays,x.bays);x.bayForm=pick(d.bayForm,['2.5','3.5'],big?'3.5':'2.5');x.bayDir=pick(d.bayDir,['v','h'],big?'h':'v');x.bayRows=pick(String(d.bayRows),['1','2','3','4'],big?'3':'1');
      x.disks={};if(d.disks&&typeof d.disks==='object')for(const [k,v] of Object.entries(d.disks)){if(!/^\d{1,2}$/.test(k)||+k>=x.bays)continue;let o=null;
        if(typeof v==='string'){const m=/^\s*(\d+(?:[.,]\d+)?)\s*(tib|tb|t|gib|gb|g)?/i.exec(v);if(m){const n=parseFloat(m[1].replace(',','.'));o={c:n,u:/^g/i.test(m[2]||'')||(!m[2]&&n>=100)?'GB':'TB'}}}
        else if(v&&typeof v==='object'){o={};const c=Number(v.c);if(Number.isFinite(c)&&c>0)o.c=Math.min(c,1e6);if(v.u==='GB'||v.u==='TB')o.u=v.u;if(v.t==='HDD'||v.t==='SSD')o.t=v.t;if(v.ok===true)o.ok=true}
        if(o&&Object.keys(o).length)x.disks[k]=o}
      x.raids=[];if(Array.isArray(d.raids))for(const r of d.raids.slice(0,24)){if(!r||typeof r!=='object')continue;const ds=[...new Set((Array.isArray(r.disks)?r.disks:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<x.bays&&!x.raids.some(q=>q.disks.includes(i))))].sort((a,b)=>a-b);
        x.raids.push({id:okId(r.id)&&!x.raids.some(q=>q.id===r.id)?r.id:'r'+rid(),name:S(r.name,30)||'Verbund',lvl:RAIDL[r.lvl]?r.lvl:'5',col:N(r.col,0,RAIDC.length-1,x.raids.length%RAIDC.length),disks:ds})}}
    x.rj45Speed=pick(d.rj45Speed,PT.rj45.sp,'1G');x.poe=!!d.poe;x.cat=CAT[d.cat]?d.cat:'cat6a';x.shield=d.shield!==false;x.fg=FG[d.fg]?d.fg:'os2';x.pol=pick(d.pol,['UPC','APC'],'UPC');
    x.wifi=pick(d.wifi,F.wifi.o.map(v=>v[0]),'Wi-Fi 6');x.poeStd=pick(d.poeStd,['af','at','bt'],'at');x.sub=pick(d.sub,(kind==='net'?NETS:HOSTS).map(h=>h[0]),x.sub);x.pd=!!d.pd;
    x.wan=N(d.wan,0,4,kind==='fw'&&!fwOld?1:0);const NE=(v,a,b)=>v===''||v==null||!Number.isFinite(Number(v))?'':clamp(Math.round(Number(v)),a,b);x.year=NE(d.year,1980,2100);x.watt=NE(d.watt,0,20000);x.psu=d.psu==='2'||d.psu===2?'2':'1';x.pa=okId(d.pa)?d.pa:'';x.pb=okId(d.pb)?d.pb:'';x.o13=N(d.o13,0,48,x.o13);x.o19=N(d.o19,0,24,x.o19);x.amp=AMPW[d.amp]?String(d.amp):'16';x.uw=NE(d.uw,100,200000);x.bat=NE(d.bat,10,500000);x.lifeOld=NE(d.lifeOld,1,50);x.lifeEol=NE(d.lifeEol,1,60);x.va=pick(String(d.va),VAS,x.va);x.topo=TOPO[d.topo]?d.topo:x.topo;
    const src=d.pc&&typeof d.pc==='object'?d.pc:{rj45:d.rj45,sfp:d.sfp,sfpp:d.sfpp};
    x.pc={};for(const t of K.types){const n=N(src[t],0,maxc(x,t),0);if(n)x.pc[t]=n}
    if(total(x)<minPorts(x))x.pc[K.types.includes('rj45')?'rj45':K.types[0]]=K.types.includes('rj45')?8:24;
    if(d.ports&&typeof d.ports==='object')for(const [k,v] of Object.entries(d.ports)){if(!pexists(x,k)||!v||typeof v!=='object')continue;const t=ptype(k),pc={};if(v.label)pc.label=S(v.label,60);if(!isPas(t)&&PT[t].sp.includes(v.speed))pc.speed=v.speed;if(!isPas(t)&&['switch','fw','net','server'].includes(kind)){const ok=n=>Number.isInteger(n)&&n>=1&&n<=4094;
      if(v.vm==='trunk'||Array.isArray(v.tv)){const nv=Number(v.vlan);if(ok(nv))pc.vlan=nv;if(v.vm==='trunk'){pc.vm='trunk';pc.tv=[...new Set((Array.isArray(v.tv)?v.tv:[]).map(Number).filter(ok))].sort((a,b)=>a-b)}}
      else if(v.vlan!=null&&v.vlan!==''){const ns=[...new Set(String(v.vlan).split(/[^0-9]+/).map(Number).filter(ok))];if(ns.length===1)pc.vlan=ns[0];else if(ns.length>1){pc.vm='trunk';pc.tv=ns.sort((a,b)=>a-b)}}}if(typeof v.poe==='boolean'&&t==='rj45')pc.poe=v.poe;if(v.off&&!isPas(t))pc.off=true;if(v.notes)pc.notes=S(v.notes,300);if(Object.keys(pc).length)x.ports[k]=pc}
    if(d.rack&&rIds.has(d.rack)&&rackable(x)){const r=out.racks.find(q=>q.id===d.rack);if(!(x.size==='19'&&r.rsize==='10')){x.rack=d.rack;x.u=N(d.u,1,200,1)}}
    out.devices.push(x);
  }
  {const h=ov_.hide&&typeof ov_.hide==='object'?ov_.hide:{},okK=v=>typeof v==='string'&&/^[a-z]+(:[a-z]+)?$/.test(v),all=new Set([...out.devices,...out.racks,...out.rooms].map(x=>x.id));
   const cats=new Set((Array.isArray(h.cats)?h.cats:[]).filter(okK).slice(0,100));if(ov_.hideHosts)cats.add('hosts');if(ov_.fadeRacks)cats.add('racks');if(ov_.fadeRooms)cats.add('rooms');
   out.view.hide={cats:[...cats],ids:(Array.isArray(h.ids)?h.ids:[]).filter(i=>all.has(i)).slice(0,5000)}}
  {const ids=new Set(out.devices.filter(isSrc).map(d=>d.id));for(const d of out.devices){if(!ids.has(d.pa)||d.pa===d.id)d.pa='';if(!ids.has(d.pb)||d.pb===d.id)d.pb=''}}
  out.templates=[];if(!o._tpl&&Array.isArray(o.templates))for(const t of o.templates.slice(0,100)){if(!t||!KIND[t.kind]||!t.cfg||typeof t.cfg!=='object')continue;try{const x=sanitize({_tpl:1,devices:[{...t.cfg,kind:t.kind,id:'tplx'}]}).devices[0];if(!x||x.kind!==t.kind)continue;out.templates.push({id:okId(t.id)?t.id:'t'+rid(),name:S(t.name,40)||KIND[t.kind].n,kind:t.kind,cfg:tplCfg(x)})}catch(_){}}
  {out.vlans=[];const seen=new Set();for(const v of (Array.isArray(o.vlans)?o.vlans:[]).slice(0,400)){const id=Number(v&&v.id);if(!Number.isInteger(id)||id<1||id>4094||seen.has(id))continue;seen.add(id);out.vlans.push({id,name:S(v.name,40),color:/^#[0-9a-f]{6}$/i.test(v.color)?v.color:VLC[out.vlans.length%VLC.length],subnet:S(v.subnet,43),gw:S(v.gw,40)})}
   for(const d of out.devices)for(const pc of Object.values(d.ports))for(const id of [pc.vlan,...(pc.tv||[])])if(id&&!seen.has(id)){seen.add(id);out.vlans.push({id,name:'',color:VLC[out.vlans.length%VLC.length],subnet:'',gw:''})}
   out.vlans.sort((a,b)=>a.id-b.id)}
  const used=new Set(),cids=new Set(),byId=Object.fromEntries(out.devices.map(d=>[d.id,d]));
  for(const c of (Array.isArray(o.cables)?o.cables:[]).slice(0,5000)){
    if(!c||!c.a||!c.b)continue;
    const mk=e=>{const r={d:String(e.d),p:String(e.p)};if(e.s==='r'&&byId[r.d]&&pexists(byId[r.d],r.p)&&isPas(ptype(r.p)))r.s='r';return r};
    const a=mk(c.a),b=mk(c.b);
    if(!byId[a.d]||!byId[b.d]||!pexists(byId[a.d],a.p)||!pexists(byId[b.d],b.p))continue;
    const ka=ek(a),kb=ek(b);if(ka===kb||used.has(ka)||used.has(kb))continue;used.add(ka);used.add(kb);
    const id=okId(c.id)&&!cids.has(c.id)?c.id:'c'+rid();cids.add(id);
    let med=MED[c.med]?c.med:null,cat=CAT[c.cat]?c.cat:'cat6a',fg=FG[c.fg]?c.fg:'om4';
    if(!med&&typeof c.type==='string'){if(c.type.startsWith('cat')){med='cu';cat=c.type==='cat8'?'cat8_1':CAT[c.type]?c.type:'cat6a'}else if(c.type==='dac')med='dac';else if(FG[c.type]){med='fi';fg=c.type}}
    const len=c.len===''||c.len==null||!Number.isFinite(+c.len)?'':clamp(+c.len,0,100000);
    out.cables.push({id,a,b,label:S(c.label,40),med:med||'cu',cat,shield:pick(c.shield,SHIELD,'U/UTP'),fg,ca:pick(c.ca,CONS,'LC'),cb:pick(c.cb,CONS,'LC'),pol:pick(c.pol,['UPC','APC'],'UPC'),dac:pick(c.dac,['passiv','aktiv'],'passiv'),ta:TR[c.ta]?c.ta:'',tb:TR[c.tb]?c.tb:'',ia:S(c.ia,60),ib:S(c.ib,60),color:COL[c.color]?c.color:'auto',len,notes:S(c.notes,300)});
  }
  const prev=state;state=out;for(const r of out.racks)packRack(r,null);state=prev;
  return out;
}

/* ================= dialogs ================= */
function modal(html){const m=$('#modal');m.innerHTML=html;m.hidden=false;const f=m.querySelector('input:not([type=hidden]):not([type=radio]),select,textarea,.btn.pri');f&&f.focus()}
function closeModal(){const m=$('#modal');m.hidden=true;m.innerHTML='';if(askRes){const r=askRes;askRes=null;r(false)}}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'||e.target.closest('[data-close]'))closeModal()});
function ask(title,text,ok,danger,cancel){
  return new Promise(res=>{
    modal(`<div class="mbox" role="alertdialog" aria-modal="true" aria-labelledby="m-t"><h2 id="m-t">${esc(title)}</h2><p>${esc(text)}</p><div class="mf"><button type="button" class="btn" data-close>${esc(cancel||'Abbrechen')}</button><button type="button" class="btn ${danger?'danger':'pri'}" id="m-yes">${esc(ok)}</button></div></div>`);
    askRes=res;$('#m-yes').focus();$('#m-yes').onclick=()=>{askRes=null;closeModal();res(true)};
  });
}
let addKind='switch';
const ADDK=[...Object.keys(KIND),'rack','room'];
const addName=k=>k==='rack'||k==='room'?OBJ[k].n:KIND[k].n;
function defaultRack(){if(sel&&sel.kind==='rack')return sel.id;if(sel&&sel.kind==='dev'){const d=dev(sel.id);if(d&&d.rack)return d.rack}if(lastRack&&rackOf(lastRack))return lastRack;return state.racks.length===1?state.racks[0].id:''}
function draft(k,target){
  if(k==='rack')return {id:'preview',kind:'rack',name:'Rack '+String.fromCharCode(65+state.racks.length%26)+'1',rsize:'19',minHe:0,rcolor:'schwarz',location:'',notes:'',x:0,y:0};
  if(k==='room')return {id:'preview',kind:'room',name:'Raum '+(state.rooms.length+1),roomc:'blau',w:1600,h:1100,place:contentBox()?'around':'right',notes:'',x:0,y:0};
  const n=state.devices.filter(d=>d.kind===k).length+1,d=mkDev(k,{id:'preview',x:0,y:0});
  d.name=k==='host'?subLbl(d)+' '+n:(k==='ap'?'AP':k==='net'?subLbl(d):KIND[k].n)+' '+n;
  if(KIND[k].rack){const tr=(target&&target.rack)||defaultRack();d.rack=tr||'';if(tr){const r=rackOf(tr);if(d.size==='frei'||(d.size==='19'&&r.rsize==='10'))d.size=r.rsize}}
  d._u=target&&target.u;return d;
}
function openAdd(kind,target){
  if(kind)addKind=kind;else if(target&&target.rack&&!KIND[addKind].rack)addKind='switch';
  let D=draft(addKind,target),auto=true;
  modal(`<form class="mbox wide" id="addf" role="dialog" aria-modal="true" aria-labelledby="m-t" novalidate>
  <div class="mh"><h2 id="m-t">${target&&target.rack?'In „'+esc(rackOf(target.rack).name)+'“ einbauen'+(target.u?' – ab HE '+target.u:''):'Hinzufügen'}</h2>${closeBtn}</div>
  <div class="ktabs" role="tablist" aria-label="Was hinzufügen">${ADDK.map(k=>`<button type="button" role="tab" data-kind="${k}" aria-selected="${k===addKind}"${target&&target.rack&&!(KIND[k]&&KIND[k].rack)?' disabled':''}><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${KICON[k]}</svg>${addName(k)}</button>`).join('')}</div>
  <div class="prev" id="prev" aria-label="Vorschau"></div>
  <div class="presets" id="presets" role="group" aria-label="Vorlagen"></div>
  <div id="aform"></div>
  <p class="merr" id="m-err" role="alert"></p>
  <div class="mf"><button type="button" class="btn" data-close>Abbrechen</button><button type="submit" class="btn pri">Einfügen</button></div></form>`);
  const form=$('#addf');
  const prev=()=>{const P=$('#prev');
    if(D.kind==='rack'){const G=rgeom(D);P.innerHTML=`<svg viewBox="-10 -10 ${G.W+28} ${G.H+30}" font-family="Hanken Grotesk, Arial, sans-serif" role="img" aria-label="Vorschau">${rackFrameSVG(D,{})}</svg>`;return}
    if(D.kind==='room'){const s=D.place==='around'&&contentBox()?'um den ganzen Plan':`${D.w} × ${D.h}`;P.innerHTML=`<svg viewBox="-20 -20 ${+D.w+40} ${+D.h+40}" role="img" aria-label="Vorschau">${roomSVG({...D,x:0,y:0},{})}<text x="${D.w/2}" y="${D.h/2+30}" text-anchor="middle" font-size="${Math.max(40,D.w/24)}" fill="#6b7280" font-family="Hanken Grotesk, Arial, sans-serif">${esc(s)}</text></svg>`;return}
    if(total(D)<minPorts(D)){P.innerHTML='<p class="note">Mindestens ein Port nötig.</p>';return}const L=lay(D);P.innerHTML=`<svg viewBox="-8 -8 ${L.W+22} ${L.H+24}" font-family="Hanken Grotesk, Arial, sans-serif" role="img" aria-label="Vorschau">${devSVG(D,{})}${numSVG(D,{})}</svg>`};
  const draw=()=>{
    form.querySelectorAll('[data-kind]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.kind===addKind)));
    $('#presets').innerHTML=(PRESETS[addKind]||[]).map((p,i)=>`<button type="button" class="chip" data-pre="${i}">${esc(p[0])}</button>`).join('')+(state.templates||[]).filter(t=>t.kind===addKind).map(t=>`<span class="tchip"><button type="button" class="chip tpl" data-tpl="${t.id}" title="Eigene Vorlage">★ ${esc(t.name)}</button><button type="button" class="tdel" data-tdel="${t.id}" aria-label="Vorlage ${esc(t.name)} löschen">×</button></span>`).join('');
    const fid=document.activeElement&&form.contains(document.activeElement)?document.activeElement.id:null;
    $('#aform').innerHTML=`<div class="mgrid"><div>${fieldsHTML(D,'a','L')}</div><div>${fieldsHTML(D,'a','R')}</div></div>`;
    if(fid&&document.getElementById(fid))document.getElementById(fid).focus();
    prev();
  };
  const autoName=()=>{if(!auto)return;const n=state.devices.filter(x=>x.kind===D.kind).length+1;if(D.kind==='host'||D.kind==='net')D.name=subLbl(D)+' '+n};
  const read=el=>{const k=el.dataset.k;if(!k)return;
    if(k.startsWith('pc.')){const t=k.slice(3);D.pc[t]=clamp(parseInt(el.value,10)||0,0,maxc(D,t));return}
    const f=F[k];if(f.t==='seg'&&!el.checked)return;
    let v=f.t==='chk'?el.checked:el.value;
    if(k==='he')v=clamp(parseInt(v,10)||1,1,KIND[D.kind].maxHe);if(k==='wan'||k==='minHe')v=parseInt(v,10)||0;if(f.t==='num')v=f.opt&&String(v).trim()===''?'':clamp(parseInt(v,10)||0,f.min,f.max);if(f.t==='text')v=String(v).slice(0,f.max);
    if(k==='name')auto=false;
    if(k==='bays'&&(D.baysUsed>v||D.baysUsed===D.bays))D.baysUsed=v;if(k==='baysUsed')v=Math.min(v,+D.bays||0);
    D[k]=v;
    if(k==='sub'){autoName();if(v==='phone'||v==='camera')D.pd=true}
    if(k==='size'&&v==='frei')D.rack='';
    if(k==='rack'&&v){const r=rackOf(v);if(D.size==='frei'||(D.size==='19'&&r.rsize==='10'))D.size=r.rsize}
  };
  form.addEventListener('input',e=>{if(!e.target.dataset.k)return;read(e.target);prev()});
  form.addEventListener('change',e=>{const el=e.target;if(!el.dataset.k)return;read(el);if(el.type==='text')prev();else draw()});
  form.addEventListener('click',e=>{
    const kb=e.target.closest('[data-kind]');if(kb&&!kb.disabled){addKind=kb.dataset.kind;D=draft(addKind,target);auto=true;draw();return}
    const st=e.target.closest('[data-step]');if(st){const t=st.dataset.step;D.pc[t]=clamp((D.pc[t]||0)+ +st.dataset.d,0,maxc(D,t));draw();return}
    const tp=e.target.closest('[data-tpl]');if(tp){const t=(state.templates||[]).find(x=>x.id===tp.dataset.tpl);if(t){const o=JSON.parse(JSON.stringify(t.cfg));D.pc={};Object.assign(D,o);if(D.rack&&D.size==='frei')D.rack='';draw()}return}
    const td=e.target.closest('[data-tdel]');if(td){const t=(state.templates||[]).find(x=>x.id===td.dataset.tdel);if(t){ck();state.templates=state.templates.filter(x=>x!==t);touched();toast('Vorlage „'+t.name+'“ gelöscht');draw()}return}
    const pr=e.target.closest('[data-pre]');if(pr){const o=JSON.parse(JSON.stringify(PRESETS[addKind][+pr.dataset.pre][1]));if(o.pc)D.pc={};Object.assign(D,o);if(o.sub)autoName();if(o.name)auto=false;if(D.rack&&D.size==='frei')D.rack='';draw()}
  });
  form.addEventListener('submit',e=>{e.preventDefault();
    const B=contentBox();
    if(D.kind==='rack'){const r={id:'k'+rid(),name:D.name||'Schrank',rsize:D.rsize,minHe:+D.minHe||0,rcolor:D.rcolor,location:D.location||'',notes:'',x:40,y:40};if(B){r.x=sn(B.x2+160);r.y=sn(B.y1)}ck();state.racks.push(r);if(hidLeaves().has(r.id))setHid([r.id],false,true);lastRack=r.id;touched();sel={kind:'rack',id:r.id};closeModal();setMode('plan');renderAll();const G=rgeom(r);centerRect(r.x,r.y,G.W,G.H);toast('Schrank angelegt – Geräte hineinziehen oder freie HE anklicken');return}
    if(D.kind==='room'){const rm={id:'m'+rid(),name:D.name||'Raum',roomc:D.roomc,w:+D.w||1600,h:+D.h||1100,notes:'',x:40,y:40};if(B&&D.place==='around'){rm.x=sn(B.x1-80);rm.y=sn(B.y1-140);rm.w=sn(B.x2-B.x1+160);rm.h=sn(B.y2-B.y1+220)}else if(B){rm.x=sn(B.x2+160);rm.y=sn(B.y1)}ck();state.rooms.push(rm);if(hidLeaves().has(rm.id))setHid([rm.id],false,true);touched();sel={kind:'room',id:rm.id};closeModal();setMode('plan');renderAll();centerRect(rm.x,rm.y,rm.w,rm.h);return}
    if(total(D)<minPorts(D)){$('#m-err').textContent='Lege mindestens einen Port fest.';return}
    const d=JSON.parse(JSON.stringify(D)),tu=d._u;delete d._u;d.id='d'+rid();ck();
    const r=d.rack&&rackOf(d.rack);d.rack=null;state.devices.push(d);
    if(!(r&&rackInsert(d,r,tu||null))){d.rack=null;state.devices.pop();place(d);state.devices.push(d)}if(hidLeaves().has(d.id))setHid([d.id],false,true);touched();sel={kind:'dev',id:d.id};closeModal();setMode('plan');renderAll();if(state.devices.length===1&&!state.racks.length)fit();else centerOn(d);
    toast(d.rack?`In „${r.name}“ eingebaut – ${heTxt(d)}`:`${KIND[d.kind].n} eingefügt – Ports per Ziehen verbinden`)});
  draw();const n=$('#a-name');n&&n.select();
}
function toast(t){const box=$('#toasts'),el=document.createElement('div');el.className='toast';el.textContent=t;box.append(el);setTimeout(()=>el.remove(),3000);while(box.children.length>3)box.firstChild.remove()}

/* ================= patch list ================= */
/* ================= logische Topologie ================= */
const TV={x:0,y:0,z:1};let TB=null,tdrag=null;
const ACT=d=>['fw','net','switch','server','ap','host','ups'].includes(d.kind);
function topoModel(){
  const hm=state.view.topoHosts||(state.devices.filter(d=>d.kind==='host').length>24?'group':'single');
  const nodes=new Map(),E=new Map();
  for(const ch of CH){if(!ch.A||!ch.B)continue;const a=dev(ch.A.d),b=dev(ch.B.d);if(!a||!b||a.id===b.id||!ACT(a)||!ACT(b))continue;
    const k=[a.id,b.id].sort().join('|');let e=E.get(k);if(!e){e={a:a.id,b:b.id,n:0,chs:[]};E.set(k,e)}e.n++;e.chs.push(ch)}
  const deg=new Map();for(const e of E.values())for(const x of [e.a,e.b])deg.set(x,(deg.get(x)||0)+1);
  for(const d of state.devices)if(ACT(d)&&(deg.get(d.id)||d.kind==='fw'||d.kind==='switch'||d.kind==='net')&&!(d.kind==='host'&&hm==='off'))nodes.set(d.id,{id:d.id,d,kids:[],eps:[]});
  const infra=d=>d.kind==='fw'||d.kind==='net'||d.kind==='switch';
  const adj=new Map();for(const e of E.values()){if(!nodes.has(e.a)||!nodes.has(e.b))continue;for(const [x,y] of [[e.a,e.b],[e.b,e.a]]){if(!adj.has(x))adj.set(x,[]);adj.get(x).push(y)}}
  const N=[...nodes.values()],rank=d=>d.kind==='fw'?0:d.kind==='net'&&['router','modem','gateway'].includes(d.sub)?0:d.kind==='net'?1:2;
  let roots=N.filter(n=>infra(n.d)&&rank(n.d)===0);if(!roots.length){const sw=N.filter(n=>infra(n.d)).sort((a,b)=>(adj.get(b.id)||[]).length-(adj.get(a.id)||[]).length);if(sw.length)roots=[sw[0]]}
  const depth=new Map(),par=new Map(),q=[];for(const r of roots){depth.set(r.id,0);q.push(r.id)}
  while(q.length){const x=q.shift();for(const y of adj.get(x)||[]){const ny=nodes.get(y);if(!infra(ny.d)||depth.has(y))continue;depth.set(y,depth.get(x)+1);par.set(y,x);q.push(y)}}
  for(const n of N)if(infra(n.d)&&!depth.has(n.id)){depth.set(n.id,0);roots.push(n);const q2=[n.id];while(q2.length){const x=q2.shift();for(const y of adj.get(x)||[]){const ny=nodes.get(y);if(!infra(ny.d)||depth.has(y))continue;depth.set(y,depth.get(x)+1);par.set(y,x);q2.push(y)}}}
  const loose=[];
  for(const n of N){if(infra(n.d))continue;const ps=(adj.get(n.id)||[]).filter(y=>depth.has(y)).sort((a,b)=>depth.get(a)-depth.get(b));if(ps.length){par.set(n.id,ps[0]);nodes.get(ps[0]).eps.push(n)}else loose.push(n)}
  for(const [c,p] of par){const n=nodes.get(c);if(infra(n.d))nodes.get(p).kids.push(n)}
  if(hm==='group')for(const n of nodes.values()){const hs=n.eps.filter(x=>x.d.kind==='host');if(hs.length>1){n.eps=n.eps.filter(x=>x.d.kind!=='host');n.eps.push({id:'grp-'+n.id,grp:hs,kids:[],eps:[]})}}
  return {nodes,E,roots,loose,par,hm}}
function topoLayout(M){const NW=176,NH=58,GX=26,GY=104,COLS=4,pos=new Map();
  const blockW=n=>{const k=n.eps.length;return k?Math.min(k,COLS)*(NW+GX)-GX:0};
  const W=n=>{if(n._w!=null)return n._w;const parts=[...n.kids.map(W)];const bw=blockW(n);if(bw)parts.push(bw);const sum=parts.reduce((a,b)=>a+b,0)+Math.max(0,parts.length-1)*GX*2;return n._w=Math.max(NW,sum)};
  const place=(n,x,y)=>{const w=W(n);pos.set(n.id,{x:x+w/2-NW/2,y,n});let cx=x+(w-([...n.kids.map(W),blockW(n)].filter(Boolean).reduce((a,b)=>a+b,0)+Math.max(0,n.kids.length+(n.eps.length?1:0)-1)*GX*2))/2;
    for(const k of n.kids){place(k,cx,y+NH+GY);cx+=W(k)+GX*2}
    n.eps.forEach((e,i)=>pos.set(e.id,{x:cx+(i%COLS)*(NW+GX),y:y+NH+GY+Math.floor(i/COLS)*(NH+34),n:e}))};
  let x=0,maxY=0;for(const r of M.roots){place(r,x,0);x+=W(r)+GX*4}
  for(const p of pos.values())maxY=Math.max(maxY,p.y);
  M.loose.forEach((n,i)=>pos.set(n.id,{x:(i%8)*(NW+GX),y:maxY+NH+GY+Math.floor(i/8)*(NH+34),n,loose:1}));
  return {pos,NW,NH}}
function topoSVG(forExport){
  const M=topoModel(),Lo=topoLayout(M),{pos,NW,NH}=Lo,cv=state.view.topoColor||'speed';if(!pos.size)return null;
  let x1=Infinity,y1=Infinity,x2=-Infinity,y2=-Infinity;for(const p of pos.values()){x1=Math.min(x1,p.x);y1=Math.min(y1,p.y);x2=Math.max(x2,p.x+NW);y2=Math.max(y2,p.y+NH)}
  const P=id=>pos.get(id)||(()=>{for(const n of M.nodes.values())if(n.eps.some(e=>e.grp&&e.grp.some(h=>h.d.id===id)))return pos.get('grp-'+n.id)})();
  let ed='',lab='';const seen=new Set();
  for(const e of M.E.values()){const A=P(e.a),B=P(e.b);if(!A||!B||A===B)continue;const key=[A.n.id,B.n.id].sort().join('|');if(seen.has(key)&&(A.n.grp||B.n.grp))continue;seen.add(key);
    const [U,D]=A.y<=B.y?[A,B]:[B,A],ux=U.x+NW/2,uy=U.y+NH,dx=D.x+NW/2,dy=D.y,ch=e.chs[0],sp=ch.speed,nl=e.chs.every(c=>c.nl);
    let col=sp&&!nl?SP[sp].c:'#8a8f96';if(cv==='vlan'){const pa=pvlan(dev(ch.A.d),ch.A.p),pb=pvlan(dev(ch.B.d),ch.B.p),pv=pa||pb;col=pv?(pv.m==='trunk'?'#111':vcol(pv.v)):'#b5b5b0'}
    const w=!sp?2:SP[sp].v>=25e3?5:SP[sp].v>=1e4?4:SP[sp].v>=2500?3:2.2,sameRow=Math.abs(uy-NH-dy)<1;
    const d=sameRow?`M${U.x+NW/2} ${U.y}C${U.x+NW/2} ${U.y-50} ${dx} ${dy-50} ${dx} ${dy}`:`M${ux} ${uy}C${ux} ${uy+48} ${dx} ${dy-48} ${dx} ${dy}`;
    ed+=`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}"${nl?' stroke-dasharray="6 5"':cv==='vlan'&&col==='#111'?' stroke-dasharray="10 4"':''} stroke-linecap="round"/>`;
    const infra=n=>n.d&&['fw','net','switch'].includes(n.d.kind);
    if(infra(U.n)&&infra(D.n)||e.n>1){const mx=(ux+dx)/2,my=sameRow?U.y-38:(uy+dy)/2,t=(e.n>1?e.n+'× ':'')+(sp&&!nl?SP[sp].n.replace(' Gbit/s','G').replace(' Mbit/s','M').replace(',','.'):'kein Link');lab+=`<g><rect x="${mx-t.length*3.3-7}" y="${my-9}" width="${t.length*6.6+14}" height="18" rx="9" fill="#fff" stroke="${col}" stroke-width="1.4"/><text x="${mx}" y="${my+4}" text-anchor="middle" font-size="11" font-weight="700" fill="#111">${esc(t)}</text></g>`}}
  let nd='';
  for(const p of pos.values()){const n=p.n,x=p.x,y=p.y;
    if(n.grp){const by=new Map();for(const h of n.grp){const v=HVL.get(h.d.id)||0;by.set(v,(by.get(v)||0)+1)}
      nd+=`<g class="tn" data-tgrp="${n.id}"><rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="10" fill="#fbfbf9" stroke="#a3a8ae"/><text x="${x+14}" y="${y+24}" font-size="14" font-weight="700" fill="#16191d">${n.grp.length} Hosts</text>${[...by].map(([v,c],i)=>`<g><circle cx="${x+20+i*44}" cy="${y+41}" r="6" fill="${v?vcol(v):'#c4c9cf'}"/><text x="${x+30+i*44}" y="${y+45}" font-size="11" fill="#3d4249">${c}</text></g>`).slice(0,3).join('')}</g>`;continue}
    const d=n.d,st=STY[d.style]||STY[KIND[d.kind].styles[0]],dark=KIND[d.kind].rack&&st.g&&!['unifi','smc','aruba','host'].includes(st.key),bg=d.kind==='host'||d.kind==='ap'?'#fbfbf9':st.g[0],fg=dark?'#fff':'#16191d',sub=d.ip||d.model||(d.kind==='host'?subLbl(d):KIND[d.kind].n),hv=HVL.get(d.id),z=lcs(d);
    nd+=`<g class="tn" data-tdev="${d.id}"><rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="10" fill="${bg}" stroke="${hv?vcol(hv):dark?'#000':'#a3a8ae'}" stroke-width="${hv?2.4:1.2}"/>${hv?`<rect x="${x}" y="${y}" width="8" height="${NH}" rx="4" fill="${vcol(hv)}"/>`:''}${p.loose?`<rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="10" fill="none" stroke="#d0342c" stroke-dasharray="4 3"/>`:''}
      <g transform="translate(${x+14} ${y+11}) scale(1.15)" fill="none" stroke="${fg}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${KICON[d.kind]}</g>
      <text x="${x+44}" y="${y+25}" font-size="13.5" font-weight="700" fill="${fg}">${esc(trunc(d.name,17))}</text><text x="${x+44}" y="${y+42}" font-size="11" fill="${dark?'#c3c9d0':'#5b626b'}">${esc(trunc(sub,22))}</text>
      ${z&&z.s!=='ok'?`<rect x="${x+NW-40}" y="${y-9}" width="36" height="16" rx="8" fill="${LCC[z.s].c}"/><text x="${x+NW-22}" y="${y+3}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${LCC[z.s].t}">${z.s==='eol'?'EOL':'alt'}</text>`:''}</g>`}
  const pad=40;TB={x:x1-pad,y:y1-pad-50,w:x2-x1+pad*2,h:y2-y1+pad*2+50};
  return {svg:`${ed}${nd}${lab}`,box:TB,M}}
function renderTopo(fit){
  for(const b of document.querySelectorAll('[data-th]'))b.setAttribute('aria-pressed',String(b.dataset.th===(state.view.topoHosts||(state.devices.filter(d=>d.kind==='host').length>24?'group':'single'))));
  for(const b of document.querySelectorAll('[data-tc]'))b.setAttribute('aria-pressed',String(b.dataset.tc===(state.view.topoColor||'speed')));
  const R=topoSVG();$('#tp-empty').hidden=!!R;$('#tworld').innerHTML=R?R.svg:'';
  $('#tp-sub').textContent=R?`${pl([...R.M.nodes.values()].length,'Gerät','Geräte')} · ${pl(R.M.E.size,'Verbindung','Verbindungen')} · ohne Patchpanels`:'';
  if(R&&(fit||!TV.ok))topoFit();else topoApply()}
function topoApply(){$('#tworld').setAttribute('transform',`translate(${TV.x.toFixed(1)} ${TV.y.toFixed(1)}) scale(${TV.z.toFixed(4)})`)}
function topoFit(){const r=$('#tstage').getBoundingClientRect();if(!TB||!r.width)return;TV.z=clamp(Math.min(r.width/TB.w,r.height/TB.h),.15,1.4);TV.x=(r.width-TB.w*TV.z)/2-TB.x*TV.z;TV.y=(r.height-TB.h*TV.z)/2-TB.y*TV.z;TV.ok=1;topoApply()}
$('#tp-fit').onclick=topoFit;
$('#z-sel').onclick=()=>{selMode=!selMode;$('#z-sel').setAttribute('aria-pressed',String(selMode));cv.classList.toggle('selmode',selMode);toast(selMode?'Auswahlmodus: Geräte antippen oder einen Rahmen ziehen':'Auswahlmodus aus')};
$('#topo').addEventListener('click',e=>{const h=e.target.closest('[data-th]'),c=e.target.closest('[data-tc]');if(h){ck('view');state.view.topoHosts=h.dataset.th;touched();renderTopo(true)}if(c){ck('view');state.view.topoColor=c.dataset.tc;touched();renderTopo()}});
$('#tsvg').addEventListener('wheel',e=>{e.preventDefault();const r=$('#tstage').getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,f=Math.exp(-e.deltaY*.0015),z=clamp(TV.z*f,.1,3);TV.x=mx-(mx-TV.x)*z/TV.z;TV.y=my-(my-TV.y)*z/TV.z;TV.z=z;topoApply()},{passive:false});
$('#tsvg').addEventListener('pointerdown',e=>{tdrag={x:e.clientX,y:e.clientY,vx:TV.x,vy:TV.y,m:false,t:e.target};try{$('#tsvg').setPointerCapture(e.pointerId)}catch(_){}});
$('#tsvg').addEventListener('pointermove',e=>{if(!tdrag)return;const dx=e.clientX-tdrag.x,dy=e.clientY-tdrag.y;if(!tdrag.m&&Math.hypot(dx,dy)<5)return;tdrag.m=true;TV.x=tdrag.vx+dx;TV.y=tdrag.vy+dy;topoApply()});
$('#tsvg').addEventListener('pointerup',e=>{const g=tdrag;tdrag=null;if(!g||g.m)return;const n=g.t.closest&&g.t.closest('[data-tdev]');if(n){setMode('plan');select({kind:'dev',id:n.dataset.tdev});centerOn(dev(n.dataset.tdev))}const gr=g.t.closest&&g.t.closest('[data-tgrp]');if(gr){ck('view');state.view.topoHosts='single';touched();renderTopo(true)}});
$('#tp-svg').onclick=()=>{const R=topoSVG();if(!R){toast('Noch keine Topologie');return}const b=R.box,svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(b.w)}" height="${Math.ceil(b.h)}" viewBox="${b.x} ${b.y} ${b.w} ${b.h}" font-family="Hanken Grotesk, Arial, sans-serif"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#f4f4f1"/><text x="${b.x+40}" y="${b.y+34}" font-size="20" font-weight="700">${esc(state.name)} – logische Topologie</text>${R.svg}</svg>`;if(DL)save(slug()+'-topologie.svg',svg);else copyText(svg,'SVG')};
function powerRows(){const rows=[...PW].map(([id,P])=>{const d=dev(id);return {dv:id,cells:[d.name,d.kind==='ups'?'USV':'PDU',d.kind==='ups'?`${Number(d.va).toLocaleString('de-DE')} VA · ${P.cap} W`:`${d.amp==='3x16'?'3 × 16':d.amp} A · ${P.cap} W`,Math.round(P.load)+' W',Math.round(P.pct)+' %',P.min!=null?P.min+' min':'',d.kind==='pdu'?`${P.plugs}/${(+d.o13||0)+(+d.o19||0)}`:String(P.plugs),P.list.map(x=>x.d.name+(x.d.kind==='pdu'?'':' ('+x.ab+')')).join(', ')],cls:P.pct>100?'over':P.pct>=80?'high':''}});
  const loose=state.devices.filter(d=>pwrDev(d)&&d.kind!=='pdu'&&!feedsOf(d).length),tot=state.devices.filter(d=>pwrDev(d)&&d.kind!=='pdu').reduce((a,d)=>a+devW(d),0);
  return {heads:['Quelle','Art','Kapazität','Last','Auslastung','Laufzeit','Stecker','Versorgt'],rows,num:[3,4,5,6],sub:`Gesamtverbrauch ca. ${Math.round(tot)} W · ${pl(loose.length,'Gerät','Geräte')} ohne USV/PDU`}}
function matRows(){const M=new Map(),add=(g,art,det,n,u)=>{const k=g+'|'+art+'|'+det+'|'+u;const o=M.get(k)||{g,art,det,n:0,u};o.n+=n;M.set(k,o)};
  for(const c of state.cables){const inst=c.a.s==='r'||c.b.s==='r',len=c.len===''?null:+c.len,col=c.color!=='auto'?COL[c.color].n:'';
    if(c.med==='cu'){const sp=`${CAT[c.cat].n} ${c.shield}`;if(inst){add('Verlegekabel','Installationskabel '+sp,'',len||0,'m');if(len==null)add('Verlegekabel','Installationskabel '+sp,'ohne Längenangabe',1,'Strecken')}else add('Patchkabel','Patchkabel '+sp,[len!=null?de(String(len))+' m':'Länge offen',col].filter(Boolean).join(' · '),1,'Stück')}
    else if(c.med==='fi'){const sp=`LWL ${FG[c.fg].n} ${c.ca}/${c.cb}${FG[c.fg].m==='sm'&&c.pol==='APC'?' APC':''}`;add(inst?'Verlegekabel':'Patchkabel',(inst?'LWL-Verlegekabel ':'LWL-Patchkabel ')+sp.replace('LWL ',''),[len!=null?de(String(len))+' m':'Länge offen',col].filter(Boolean).join(' · '),1,'Stück')}
    else add('Direktkabel',`${MED[c.med].n}${c.med==='dac'?' '+c.dac:''}`,[ptype(c.a.p)?PT[ptype(c.a.p)].n:'',len!=null?de(String(len))+' m':'Länge offen'].filter(Boolean).join(' · '),1,'Stück');
    if(c.med==='cu'||c.med==='fi')for(const k of ['ta','tb'])if(c[k])add('Transceiver',c[k],TR[c[k]]?TR[c[k]].ff.map(t=>PT[t].n).join('/'):'',1,'Stück')}
  for(const d of state.devices){const vend=(STY[d.style]||{}).n||'';add('Geräte',d.kind==='host'||d.kind==='net'?subLbl(d):KIND[d.kind].n,[d.model,d.kind==='host'?'':vend.replace('-Stil','')].filter(Boolean).join(' · '),1,'Stück');
    if(d.kind==='patch'&&d.pc.kj)add('Module',`Keystone-Modul ${CAT[d.cat].n}${d.shield?' geschirmt':''}`,'',d.pc.kj,'Stück');
    if(d.kind==='fiber')for(const t of ['lc','sc','mpo'])if(d.pc[t])add('Module',`LWL-Kupplung ${PT[t].n} ${FG[d.fg].n}`,'',d.pc[t],'Stück');
    if(d.kind==='server'&&d.bays){const DI=diskInfo(d);for(const x of DI.list)add('Festplatten',`${x.t} ${d.bayForm.replace('.',',')}″`,x.o.c?fmtCap(x.o):'Größe offen',1,'Stück')}}
  for(const r of state.racks){const G=rgeom(r);add('Schränke',`Netzwerkschrank ${r.rsize}″`,r.minHe?r.minHe+' HE':`mind. ${G.n} HE`,1,'Stück')}
  const ord=['Geräte','Schränke','Patchkabel','Verlegekabel','Direktkabel','Transceiver','Module','Festplatten'];
  const rows=[...M.values()].sort((a,b)=>ord.indexOf(a.g)-ord.indexOf(b.g)||a.art.localeCompare(b.art,'de')||a.det.localeCompare(b.det,'de',{numeric:true})).map(o=>({cells:[o.g,o.u==='m'?de(String(+o.n.toFixed(1))):String(o.n),o.u,o.art,o.det]}));
  return {heads:['Gruppe','Menge','Einheit','Artikel','Details'],rows,num:[1],sub:`${rows.length} Positionen · Kabel ${state.cables.length} · Geräte ${state.devices.length}`}}
const TTL={kabel:'Patchliste',strecken:'Patchlegung',geraete:'Geräte',netze:'VLANs & IP-Adressen',strom:'Stromversorgung',material:'Materialliste'};
function devRows(){const byName=(a,b)=>String(a.name).localeCompare(String(b.name),'de',{numeric:true});
  return [...state.devices].sort((a,b)=>catOrder.indexOf(catOf(a)[0])-catOrder.indexOf(catOf(b)[0])||byName(a,b)).map(d=>{const z=lcs(d),hv=HVL.get(d.id),rm=devRoom(d);
    return {dv:d.id,cells:[d.name,d.kind==='host'||d.kind==='net'?subLbl(d):KIND[d.kind].n,[d.rack?where(d):'',rm?rm.name:''].filter(Boolean).join(' · '),d.model||d.role||'',d.ip||'',hv?vshort(hv):'',`${usedPorts(d)}/${total(d)}`,d.year?`${d.year}${z&&z.s!=='ok'?' · '+LCC[z.s].n:''}`:'',d.user||d.location||'']}})}
function ipRows(){return state.devices.filter(d=>d.ip).map(d=>{const I=IPI&&IPI.get(d.id)||{},V=I.v?vlanOf(I.v):null,S=vnet(V);return {dv:d.id,n:I.n??Infinity,cells:[d.ip,d.name,d.kind==='host'?subLbl(d):KIND[d.kind].n,V?vshort(V.id):'',S?S.txt:'',I.bad?'ungültig':I.dup?'doppelt':I.wrong?'falsches Subnetz':'ok']}}).sort((a,b)=>a.n-b.n)}
function tableData(m){
  if(m==='kabel')return {heads:['Kabel','Von','Port','Nach','Port','Medium','Transceiver','Länge','Link','Hinweis'],rows:cableRows(),link:8,num:[7],sub:`${state.cables.length} Kabel · ${state.devices.length} Geräte`};
  if(m==='strecken')return patchRows();
  if(m==='geraete')return {heads:['Name','Art','Ort','Modell','IP','VLAN','Ports','Kaufjahr','Benutzer / Standort'],rows:devRows(),num:[6],sub:`${state.devices.length} Geräte in ${pl(state.racks.length,'Schrank','Schränken')}`};
  if(m==='netze')return {heads:['IP-Adresse','Gerät','Art','VLAN','Subnetz','Status'],rows:ipRows(),sub:''};
  if(m==='strom')return typeof powerRows==='function'?powerRows():{heads:[],rows:[]};
  if(m==='material')return typeof matRows==='function'?matRows():{heads:[],rows:[]};
  return {heads:[],rows:[]}}
function renderTable(){
  const q=$('#q').value.trim().toLowerCase(),T=tableData(tmode),pl_=tmode==='strecken',custom=tmode==='netze'||pl_;
  $('#t-h').textContent=TTL[tmode];
  $('#tcustom').hidden=!custom;$('#tscroll').hidden=pl_;
  $('#t-opts').hidden=!pl_;
  if(pl_){$('#t-opts').innerHTML=`<label title="Gilt für Patchpanel-Ports ohne eigene Beschriftung">Schreibweise Patch <select id="t-psep" aria-label="Trennzeichen zwischen Patchpanel und Port">${opts([['.','11.6'],['/','11/6'],['-','11-6']],state.view.psep||'.')}</select></label><label class="chk"><input type="checkbox" id="t-pfree"${state.view.pfree?' checked':''}> Freie Ports</label>`;
    const n=renderPatch(T,q);$('#t-sub').textContent=(T.sub||'')+(q?' · '+n+' Treffer':'');return}
  if(custom)renderNetze();
  const rows=T.rows.filter(r=>!q||r.cells.join(' ').toLowerCase().includes(q));
  $('#t-sub').textContent=(T.sub||'')+(q?(T.sub?' · ':'')+rows.length+' Treffer':'');
  $('#tscroll').classList.toggle('below',custom);
  $('#pth').innerHTML=`<tr>${T.heads.map(h=>`<th>${h}</th>`).join('')}</tr>`;
  const cab=tmode==='kabel',num=T.num||[],nw=T.nw||[];
  $('#ptb').innerHTML=rows.length?rows.map(r=>`<tr ${r.c?`data-cab="${r.c.id}"`:r.dv?`data-dv="${r.dv}"${r.port?` data-port="${r.port}"`:''}`:''}${r.c||r.dv?' tabindex="0"':''}${r.cls?` class="${r.cls}"`:''}>${r.cells.map((v,i)=>`<td data-l="${T.heads[i]}" class="${cab&&i===0?'lb':num.includes(i)?'n':i===T.link||nw.includes(i)?'nw':''}"><span>${i===T.link?`<i class="dot" style="--c:${cab?ccolor(r.c,AN.get(r.c.id)):(v==='kein Link'||v==='passiv'?'#8a8f96':SP[Object.keys(SP).find(k=>SP[k].n===v)]?.c||'#8a8f96')}"></i>`:''}${tmode==='netze'&&i===5&&v!=='ok'?`<span class="wtag">${esc(v)}</span>`:tmode==='netze'&&i===3&&r.dv&&IPI.get(r.dv)&&IPI.get(r.dv).v?`<i class="dot" style="--c:${vcol(IPI.get(r.dv).v)}"></i>${esc(v)}`:esc(v)}</span></td>`).join('')}</tr>`).join(''):`<tr><td class="tempty" colspan="${T.heads.length||1}">${q?'Keine Treffer.':'Noch nichts vorhanden.'}</td></tr>`;
}
function renderNetze(){
  const box=$('#tcustom'),fid=document.activeElement&&box.contains(document.activeElement)?document.activeElement.id:null;
  const cnt=new Map();for(const d of state.devices)for(const p of lay(d).ports){const pv=pvlan(d,p.id);if(!pv)continue;for(const v of pv.m==='access'?[pv.v]:[pv.nat,...pv.tag].filter(Boolean))cnt.set(v,(cnt.get(v)||0)+1)}
  const hosts=new Map();for(const v of HVL.values())hosts.set(v,(hosts.get(v)||0)+1);
  const used=v=>{const S=vnet(v);if(!S)return null;return state.devices.filter(d=>inNet(ip2n(d.ip),S)).length};
  box.innerHTML=`<div class="lsh"><h3>VLANs</h3><button type="button" class="btn pri" data-vact="add">VLAN hinzufügen</button></div>
  ${state.vlans.length?`<div class="scroll"><table class="etab"><thead><tr><th>Farbe</th><th>ID</th><th>Name</th><th>Subnetz</th><th>Gateway</th><th class="n">Ports</th><th class="n">Hosts</th><th>IP-Belegung</th><th></th></tr></thead><tbody>${state.vlans.map(v=>{const S=vnet(v),u=used(v),bad=v.subnet&&!S;
    return `<tr data-vid="${v.id}"><td><input type="color" id="vc-${v.id}" data-vf="color" value="${v.color}" aria-label="Farbe VLAN ${v.id}"></td><td><input id="vi-${v.id}" data-vf="id" type="number" min="1" max="4094" value="${v.id}" class="vid" aria-label="VLAN-ID"></td><td><input id="vn-${v.id}" data-vf="name" value="${esc(v.name)}" maxlength="40" placeholder="z. B. Clients" aria-label="Name"></td><td><input id="vs-${v.id}" data-vf="subnet" value="${esc(v.subnet)}" maxlength="43" placeholder="10.0.${v.id%256}.0/24" aria-label="Subnetz"${bad?' class="bad"':''}></td><td><input id="vg-${v.id}" data-vf="gw" value="${esc(v.gw)}" maxlength="40" placeholder="${S?n2ip(S.first):''}" aria-label="Gateway"></td><td class="n">${cnt.get(v.id)||0}</td><td class="n">${hosts.get(v.id)||0}</td><td>${S?`<div class="ipbar"><i style="width:${Math.min(100,u/S.hosts*100).toFixed(1)}%;background:${v.color}"></i></div><small>${u} von ${S.hosts} belegt${freeIp(v)?' · frei z. B. '+freeIp(v):''}</small>`:bad?'<span class="wtag">Subnetz ungültig</span>':'<small>kein Subnetz</small>'}</td><td><button type="button" class="ib sm" data-vact="del" aria-label="VLAN ${v.id} löschen">×</button></td></tr>`}).join('')}</tbody></table></div>`:'<p class="note">Noch keine VLANs. Lege VLANs an und weise sie dann am Port zu – Access für Endgeräte, Trunk für Verbindungen zwischen Switches.</p>'}
  <div class="lsh"><h3>IP-Adressen</h3></div>`;
  if(fid){const e=document.getElementById(fid);e&&e.focus()}
}
$('#tcustom').addEventListener('change',e=>{const el=e.target,tr=el.closest('[data-vid]');if(!tr||!el.dataset.vf)return;const v=vlanOf(tr.dataset.vid);if(!v)return;const f=el.dataset.vf;
  if(f==='id'){const n=parseInt(el.value,10);if(!(n>=1&&n<=4094)){el.value=v.id;return}if(n===v.id)return;if(vlanOf(n)){toast('VLAN '+n+' gibt es schon');el.value=v.id;return}ck();const o=v.id;v.id=n;for(const d of state.devices)for(const pc of Object.values(d.ports)){if(pc.vlan===o)pc.vlan=n;if(pc.tv)pc.tv=pc.tv.map(x=>x===o?n:x).sort((a,b)=>a-b)}state.vlans.sort((a,b)=>a.id-b.id)}
  else{const val=String(el.value).trim().slice(0,f==='subnet'?43:40);if(v[f]===val)return;ck('v'+f+v.id);v[f]=f==='color'&&!/^#[0-9a-f]{6}$/i.test(val)?v.color:val}
  touched();renderAll()});
$('#tcustom').addEventListener('click',e=>{const b=e.target.closest('[data-vact]');if(!b)return;
  if(b.dataset.vact==='add'){let id=10;while(vlanOf(id))id+=10;if(id>4094){id=2;while(vlanOf(id))id++}ck();state.vlans.push({id,name:'',color:VLC[state.vlans.length%VLC.length],subnet:'',gw:''});state.vlans.sort((a,b)=>a.id-b.id);touched();renderAll();const n=document.getElementById('vn-'+id);n&&n.focus()}
  if(b.dataset.vact==='del'){const id=+b.closest('[data-vid]').dataset.vid;ck();state.vlans=state.vlans.filter(v=>v.id!==id);for(const d of state.devices)for(const [k,pc] of Object.entries(d.ports)){if(pc.vlan===id)delete pc.vlan;if(pc.tv)pc.tv=pc.tv.filter(x=>x!==id);if(!pc.tv||!pc.tv.length){if(pc.vm!=='trunk')delete pc.tv}if(!Object.keys(pc).length)delete d.ports[k]}touched();renderAll();toast('VLAN '+id+' gelöscht')}});
function exportTab(){const T0=tableData(tmode),T=T0.csv?{heads:T0.csv.heads,rows:T0.csv.rows.map(c=>({cells:c}))}:T0;if(!T.rows.length){toast('Die Liste ist leer');return}const q=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return /[";\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
  const text='﻿'+[T.heads,...T.rows.map(r=>r.cells)].map(r=>r.map(q).join(';')).join('\r\n');if(DL)save(slug()+'-'+tmode+'.csv',text);else copyText(text,TTL[tmode])}
const openRow=tr=>{setMode('plan');if(tr.dataset.dv&&tr.dataset.port){select({kind:'port',dev:tr.dataset.dv,port:tr.dataset.port});centerOn(dev(tr.dataset.dv))}else if(tr.dataset.dv){select({kind:'dev',id:tr.dataset.dv});centerOn(dev(tr.dataset.dv))}else{select({kind:'cable',id:tr.dataset.cab});centerCable(tr.dataset.cab)}};
$('#ptb').addEventListener('click',e=>{const tr=e.target.closest('tr[data-cab],tr[data-dv]');tr&&openRow(tr)});
$('#ptb').addEventListener('keydown',e=>{const tr=e.target.closest('tr[data-cab],tr[data-dv]');if(tr&&e.key==='Enter')openRow(tr)});

/* ================= PDF-Dokumentation & Etiketten ================= */
const VEND={};
function loadScript(src){return VEND[src]||(VEND[src]=new Promise((ok,no)=>{const el=document.createElement('script');el.src=src;el.onload=()=>ok();el.onerror=()=>{delete VEND[src];no(new Error(src))};document.head.append(el)}))}
async function needPDF(){await loadScript('vendor/jspdf.umd.min.js');await loadScript('vendor/jspdf.plugin.autotable.min.js');if(!window.jspdf||!window.jspdf.jsPDF)throw new Error('jspdf');return window.jspdf.jsPDF}
async function needQR(){await loadScript('vendor/qrcode.js');if(!window.qrcode)throw new Error('qr');return window.qrcode}
const PDFMAP={'″':'"','′':"'",'↔':'<->','→':'->','←':'<-','−':'-','≈':'~','≥':'>=','≤':'<=','★':'*','✓':'ok',' ':' ',' ':' ','​':'','–':'-','—':'-'};
const pT=t=>String(t??'').replace(/[″′↔→←−≈≥≤★✓  ​–—]/g,c=>PDFMAP[c]).replace(/[^\x00-\xff€„“”‘’•…™‰]/g,'?');
function svgToJpeg(svg,w,h,maxPx){return new Promise((ok,no)=>{const sc=Math.min(2,maxPx/Math.max(w,h)),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),img=new Image();
  img.onload=()=>{try{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*sc));c.height=Math.max(1,Math.round(h*sc));const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);ok({data:c.toDataURL('image/jpeg',.9),w:c.width,h:c.height})}catch(e){no(e)}finally{URL.revokeObjectURL(url)}};
  img.onerror=e=>{URL.revokeObjectURL(url);no(e)};img.src=url})}
function drawQR(doc,QR,text,x,y,size){const q=QR(0,'M');q.addData(text,'Byte');q.make();const n=q.getModuleCount(),c=size/n;doc.setFillColor(0,0,0);
  for(let r=0;r<n;r++){let s=-1;for(let k=0;k<=n;k++){const on=k<n&&q.isDark(r,k);if(on&&s<0)s=k;else if(!on&&s>=0){doc.rect(x+s*c,y+r*c,(k-s)*c+.02,c+.02,'F');s=-1}}}}
async function makeDoc(){
  if(!DL&&!window.claude)DL=fileSaver();if(!DL){toast('Speichern ist in dieser Ansicht nicht möglich');return}
  toast('PDF wird erstellt …');let JS;try{JS=await needPDF()}catch(_){toast('PDF-Bibliothek konnte nicht geladen werden');return}
  analyze();
  const doc=new JS({orientation:'landscape',unit:'mm',format:'a4',compress:true}),PW_=297,PH_=210,M=12,date=new Date().toLocaleDateString('de-DE');
  const AT=(o)=>{const f=window.autoTable||(doc.autoTable&&((d,op)=>d.autoTable(op)));f(doc,{theme:'striped',styles:{font:'helvetica',fontSize:7.6,cellPadding:1.4,overflow:'linebreak'},headStyles:{fillColor:[17,17,17],textColor:255,fontStyle:'bold'},alternateRowStyles:{fillColor:[243,243,240]},margin:{top:22,left:M,right:M,bottom:14},...o,head:o.head.map(r=>r.map(c=>c&&typeof c==='object'?{...c,content:pT(c.content)}:pT(c))),body:o.body.map(r=>r.map(c=>c&&typeof c==='object'?{...c,content:pT(c.content)}:pT(c)))})};
  const H=(t,sub)=>{doc.setFont('helvetica','bold');doc.setFontSize(16);doc.setTextColor(17);doc.text(pT(t),M,17);if(sub){doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(100);doc.text(pT(sub),PW_-M,17,{align:'right'})}};
  const toc=[];const page=(t,sub)=>{doc.addPage();toc.push([t,doc.getNumberOfPages()]);H(t,sub)};
  // Deckblatt
  doc.setFillColor(17,17,17);doc.rect(0,0,PW_,62,'F');doc.setFillColor(255,230,0);doc.rect(0,62,PW_,3,'F');
  doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(30);doc.text(pT(state.name),M+4,32);doc.setFont('helvetica','normal');doc.setFontSize(13);doc.text('Netzwerkdokumentation · Stand '+date,M+4,46);
  const used=state.devices.reduce((a,d)=>a+usedPorts(d),0),tot=state.devices.reduce((a,d)=>a+total(d),0),nE=state.devices.filter(d=>(lcs(d)||{}).s==='eol').length,nO=state.devices.filter(d=>(lcs(d)||{}).s==='old').length;
  const K=[['Geräte',state.devices.length],['Kabel',state.cables.length],['Strecken',CH.length],['Ports belegt',used+'/'+tot],['Schränke',state.racks.length],['Räume',state.rooms.length],['VLANs',state.vlans.length],['Hinweise',ISS.filter(i=>i.s!=='info').length],['EOL / veraltet',nE+' / '+nO]];
  K.forEach(([k,v],i)=>{const x=M+4+(i%5)*54,y=82+Math.floor(i/5)*30;doc.setDrawColor(210);doc.setFillColor(246,246,243);doc.roundedRect(x,y,50,24,2,2,'F');doc.setTextColor(17);doc.setFont('helvetica','bold');doc.setFontSize(17);doc.text(pT(String(v)),x+4,y+12);doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(100);doc.text(pT(k),x+4,y+19)});
  // Gesamtplan
  try{const P=buildSVG();page('Gesamtplan',`${state.devices.length} Geräte · ${state.cables.length} Kabel`);const I=await svgToJpeg(P.svg,P.w,P.h,7000);const s=Math.min((PW_-2*M)/P.w,(PH_-32)/P.h);doc.addImage(I.data,'JPEG',M+((PW_-2*M)-P.w*s)/2,24,P.w*s,P.h*s)}catch(_){}
  // Schränke
  for(const r of state.racks){const G=rgeom(r),crop={x1:r.x-12,y1:r.y-12,x2:r.x+G.W+12,y2:r.y+G.H+12};try{const P=buildSVG(crop);page('Schrank '+r.name,`${r.rsize}″ · ${G.n} HE · ${G.heUsed} HE belegt${rackRoom(r)?' · '+rackRoom(r).name:''}`);const I=await svgToJpeg(P.svg,P.w,P.h,3600);const iw=150,s=Math.min(iw/P.w,(PH_-32)/P.h);doc.addImage(I.data,'JPEG',M,24,P.w*s,P.h*s);
      const occ=G.devs.map(d=>[heTxt(d).replace('HE ',''),d.name,d.kind==='net'?subLbl(d):KIND[d.kind].n,d.model||d.role||'',d.ip||'',d.year?String(d.year):'']);AT({startY:24,margin:{top:22,left:M+P.w*s+8,right:M,bottom:14},head:[['HE','Gerät','Art','Modell','IP','Kauf']],body:occ.length?occ:[['–','leer','','','','']]})}catch(_){}}
  // Topologie
  {const R=topoSVG();if(R){const b=R.box,svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(b.w)}" height="${Math.ceil(b.h)}" viewBox="${b.x} ${b.y} ${b.w} ${b.h}" font-family="Arial, sans-serif"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#fff"/>${R.svg}</svg>`;try{page('Logische Topologie',`${R.M.nodes.size} Geräte · ${R.M.E.size} Verbindungen`);const I=await svgToJpeg(svg,b.w,b.h,5000);const s=Math.min((PW_-2*M)/b.w,(PH_-32)/b.h);doc.addImage(I.data,'JPEG',M+((PW_-2*M)-b.w*s)/2,24,b.w*s,b.h*s)}catch(_){}}}
  // Tabellen
  const tbl=(t,T)=>{if(!T.rows.length)return;page(t,T.sub||'');AT({startY:24,head:[T.heads],body:T.rows.map(r=>r.cells.map(String))})};
  tbl('Geräte',tableData('geraete'));tbl('Patchliste',tableData('kabel'));
  {const P=patchRows();if(P.tree.length){page('Patchlegung',P.sub);let y=26;const room=()=>{if(y>PH_-45){doc.addPage();y=26}};
    for(const Rr of P.tree){room();doc.setFont('helvetica','bold');doc.setFontSize(13);doc.setTextColor(17);doc.text(pT(Rr.name),M,y+3);y+=8;
      for(const K of Rr.racks){room();doc.setFont('helvetica','bold');doc.setFontSize(10.5);doc.setTextColor(40);doc.text(pT(K.name),M,y+2);doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(110);doc.text(pT(K.meta),M+doc.getTextWidth(pT(K.name))*10.5/8.5+4,y+2);y+=5;
        for(const S of K.sws){room();AT({startY:y,head:[[{content:S.sw.name+'   '+S.meta,colSpan:5,styles:{fillColor:[228,228,222],textColor:17,fontStyle:'bold'}}],P.heads],body:S.rows.length?S.rows.map(r=>r.cells.map(String)):[[{content:'Noch keine Ports gepatcht',colSpan:5}]],columnStyles:{0:{cellWidth:16,fontStyle:'bold'},1:{cellWidth:30},2:{cellWidth:46},3:{cellWidth:34}},margin:{top:24,left:M,right:M,bottom:14}});y=doc.lastAutoTable.finalY+7}}}}}
  if(state.vlans.length){page('VLANs',`${state.vlans.length} VLANs`);AT({startY:24,head:[['ID','Name','Subnetz','Gateway','Farbe']],body:state.vlans.map(v=>[String(v.id),v.name,v.subnet,v.gw,v.color])});}
  tbl('IP-Adressen',tableData('netze'));
  if(PW.size)tbl('Stromversorgung',powerRows());
  {const srv=state.devices.filter(d=>d.kind==='server'&&d.bays);if(srv.length){page('Laufwerke & RAID',pl(srv.length,'Server','Server'));const body=[];for(const d of srv){const DI=diskInfo(d);for(const x of DI.list){const r=raidOf(d,x.i);body.push([d.name,'Slot '+(x.i+1),d.bayForm.replace('.',',')+'″',x.t,x.o.c?fmtCap(x.o):'',r?r.name+' ('+RAIDL[r.lvl].n+')':'',x.out&&!x.ok?'prüfen':''])}}AT({startY:24,head:[['Server','Slot','Form','Typ','Größe','RAID','Hinweis']],body})}}
  tbl('Materialliste',matRows());
  if(ISS.length){page('Hinweise',`${ISS.length} Einträge`);AT({startY:24,head:[['Art','Hinweis']],body:ISS.map(i=>[i.s==='err'?'Fehler':i.s==='warn'?'Warnung':'Info',(i.c?(state.cables.find(c=>c.id===i.c)||{}).label+': ':'')+i.m]),columnStyles:{0:{cellWidth:22}}})}
  // Inhaltsverzeichnis auf dem Deckblatt, Kopf/Fuß auf allen Seiten
  doc.setPage(1);doc.setTextColor(17);doc.setFont('helvetica','bold');doc.setFontSize(12);doc.text('Inhalt',M+4,152);doc.setFont('helvetica','normal');doc.setFontSize(9.5);
  toc.forEach(([t,p],i)=>{const col=Math.floor(i/9),y=160+(i%9)*5.2,x=M+4+col*90;doc.text(pT(t),x,y);doc.text(String(p),x+78,y,{align:'right'})});
  const n=doc.getNumberOfPages();for(let i=2;i<=n;i++){doc.setPage(i);doc.setDrawColor(17);doc.setLineWidth(.4);doc.line(M,20,PW_-M,20);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(120);doc.text(pT(state.name)+' · Netzwerkdokumentation · '+date,M,PH_-7);doc.text(`Seite ${i} von ${n}`,PW_-M,PH_-7,{align:'right'})}
  await save(slug()+'-dokumentation.pdf',doc.output('blob'))}
/* Etiketten */
const LFMT={'a4-44':{n:'A4-Bogen 48,5 × 25,4 mm (44 Stück)',page:[210,297],w:48.5,h:25.4,cols:4,rows:11,gx:0,gy:0},'a4-65':{n:'A4-Bogen 38,1 × 21,2 mm (65 Stück)',page:[210,297],w:38.1,h:21.2,cols:5,rows:13,gx:2.5,gy:0},'roll62':{n:'Etikettendrucker 62 × 29 mm',page:[62,29],w:62,h:29,cols:1,rows:1,gx:0,gy:0},'tape12':{n:'Kabelfahne 12-mm-Band (70 mm)',page:[70,12],w:70,h:12,cols:1,rows:1,gx:0,gy:0,flag:1}};
const LS2='switch-verkabelung-labels';
function labelItems(o){const out=[],base=o.base.replace(/#.*$/,''),lk=(k,id)=>base+'#'+k+'-'+id;
  const short=e=>{const d=dev(e.d);return `${d.name} · ${pname(d,e.p)}${e.s==='r'?' (hinten)':''}`};
  if(o.what==='cab'){for(const c of [...state.cables].sort((a,b)=>String(a.label).localeCompare(String(b.label),'de',{numeric:true}))){if(o.only&&!c.label)continue;const t=c.label||'Kabel',A='A: '+short(c.a),B='B: '+short(c.b),txt=`${t}\n${A}\n${B}\n${cspec(c)}`;
      const it={t,l:[A,B,cspec(c)],q:o.qr==='link'?lk('cab',c.id):txt};out.push(it);if(o.both)out.push({...it,l:[...it.l]})}}
  else if(o.what==='port'){for(const d of state.devices){if(o.dev&&d.id!==o.dev)continue;for(const p of lay(d).ports){const cf=pconf(d,p.id);if(o.only&&!cf.label)continue;if(!o.only&&!cabOf(d.id,p.id,'f')&&!cabOf(d.id,p.id,'r')&&!cf.label)continue;
      const c=cabOf(d.id,p.id,'f')||cabOf(d.id,p.id,'r');let far='';if(c){const ch=AN.get(c.id).ch,me=e=>e&&e.d===d.id&&e.p===p.id,fe=me(ch.A)?ch.B:me(ch.B)?ch.A:null;if(fe){const x=dev(fe.d);far='-> '+x.name+(x.user?' ('+x.user+')':'')}}
      out.push({t:cf.label||pname(d,p.id),l:[`${d.name} · ${pname(d,p.id)}`,far].filter(Boolean),q:o.qr==='link'?lk('port',d.id+'-'+p.id):`${cf.label||pname(d,p.id)}\n${d.name} · ${pname(d,p.id)}\n${far}`})}}}
  else{const L=o.sel&&MS.size?[...MS].map(dev):sel&&sel.kind==='dev'&&o.sel?[dev(sel.id)]:state.devices;for(const d of L.filter(Boolean)){if(o.cat&&catOf(d)[0]!==o.cat)continue;const loc=[d.rack?where(d):'',(devRoom(d)||{}).name].filter(Boolean).join(' · ');
      out.push({t:d.name,l:[[d.kind==='host'||d.kind==='net'?subLbl(d):KIND[d.kind].n,d.model].filter(Boolean).join(' · '),d.ip,loc||d.location,d.user].filter(Boolean),q:o.qr==='link'?lk('dev',d.id):`${d.name}\n${[d.model,d.ip,loc,d.user].filter(Boolean).join('\n')}`})}}
  return out}
function fitText(doc,t,maxW,size,min,bold){doc.setFont('helvetica',bold?'bold':'normal');let s=size;doc.setFontSize(s);while(s>min&&doc.getTextWidth(t)>maxW){s-=.5;doc.setFontSize(s)}if(doc.getTextWidth(t)>maxW){while(t.length>1&&doc.getTextWidth(t+'…')>maxW)t=t.slice(0,-1);t+='…'}return t}
function drawLabel(doc,QR,it,x,y,F,qr){const pad=F.h<15?1:1.6;let tx=x+pad,tw=F.w-2*pad;
  const one=(x0,w0)=>{let qx=x0,ty=y+pad;if(qr){const qs=Math.min(F.h-2*pad,w0*.42);drawQR(doc,QR,it.q,x0,y+(F.h-qs)/2,qs);qx=x0+qs+1.6;w0-=qs+1.6}
    const lines=F.h<15?[]:it.l.slice(0,F.h<23?2:3),ts=F.h<15?8.5:F.h<23?9.5:11;doc.setTextColor(0);const tt=fitText(doc,pT(it.t),w0,ts,5.5,true);const th=doc.getFontSize()*.3528;
    const lh=Math.min(3.2,(F.h-2*pad-th-.6)/Math.max(1,lines.length)),ls=Math.max(5,Math.min(7.2,lh/.3528/1.15));let yy=F.h<15?y+F.h/2+th*.35:ty+th;doc.text(tt,qx,yy);
    for(const l of lines){yy+=lh;doc.setTextColor(40);doc.text(fitText(doc,pT(l),w0,ls,Math.min(ls,5.6),false),qx,yy)}};
  if(F.flag){const half=F.w*.36;one(x+pad,half);one(x+F.w-pad-half,half);doc.setDrawColor(180);doc.setLineDashPattern([.8,.8],0);doc.line(x+F.w/2,y+.5,x+F.w/2,y+F.h-.5);doc.setLineDashPattern([],0)}
  else one(tx,tw)}
async function makeLabels(o){
  if(!DL&&!window.claude)DL=fileSaver();if(!DL){toast('Speichern ist in dieser Ansicht nicht möglich');return}
  const items=labelItems(o);if(!items.length){toast('Keine passenden Etiketten');return}
  let JS,QR=null;try{JS=await needPDF();if(o.qr!=='none')QR=await needQR()}catch(_){toast('Bibliothek konnte nicht geladen werden');return}
  const F=LFMT[o.fmt],sheet=F.cols*F.rows>1,doc=new JS({orientation:F.page[0]>F.page[1]?'landscape':'portrait',unit:'mm',format:F.page,compress:true});
  const left=(F.page[0]-(F.cols*F.w+(F.cols-1)*F.gx))/2,top=(F.page[1]-(F.rows*F.h+(F.rows-1)*F.gy))/2;let slot=sheet?clamp((+o.start||1)-1,0,F.cols*F.rows-1):0,first=true;
  for(const it of items){if(!first&&(!sheet||slot>=F.cols*F.rows)){doc.addPage(F.page,F.page[0]>F.page[1]?'landscape':'portrait');slot=0}first=false;
    const x=left+(slot%F.cols)*(F.w+F.gx),y=top+Math.floor(slot/F.cols)*(F.h+F.gy);if(o.frame){doc.setDrawColor(200);doc.setLineWidth(.15);doc.rect(x,y,F.w,F.h)}drawLabel(doc,QR,it,x,y,F,!!QR);slot++}
  await save(slug()+'-etiketten.pdf',doc.output('blob'))}
function openLabels(){
  let o={what:'cab',fmt:'a4-44',qr:store.kind==='server'?'link':'text',both:true,only:false,frame:true,start:1,dev:'',cat:'',sel:false,base:store.kind==='server'?location.origin+location.pathname:''};
  try{Object.assign(o,JSON.parse(localStorage.getItem(LS2)||'{}'),{dev:'',sel:false})}catch(_){}
  if(store.kind==='server'&&!o.base)o.base=location.origin+location.pathname;
  const pdev=state.devices.filter(d=>lay(d).ports.length);
  const draw=()=>{const n=labelItems(o).length,F=LFMT[o.fmt],per=F.cols*F.rows,pages=per>1?Math.ceil((n+(+o.start||1)-1)/per):n;
    $('#lbody').innerHTML=`<fieldset class="seg" style="grid-template-columns:repeat(3,minmax(0,1fr))"><legend>Was</legend>${[['cab','Kabel'],['port','Ports'],['dev','Geräte']].map(([k,t])=>`<label><input type="radio" name="lw" data-lo="what" value="${k}"${o.what===k?' checked':''}><span>${t}</span></label>`).join('')}</fieldset>
    ${o.what==='cab'?`<label class="chk"><input type="checkbox" data-lo="both"${o.both?' checked':''}> Zwei Etiketten je Kabel (beide Enden)</label><label class="chk"><input type="checkbox" data-lo="only"${o.only?' checked':''}> Nur Kabel mit Nummer</label>`:''}
    ${o.what==='port'?fld('lb-dev','Gerät',`<select id="lb-dev" data-lo="dev">${opts([['','Alle Geräte'],...pdev.map(d=>[d.id,d.name])],o.dev)}</select>`)+`<label class="chk"><input type="checkbox" data-lo="only"${o.only?' checked':''}> Nur beschriftete Ports (sonst alle belegten)</label>`:''}
    ${o.what==='dev'?fld('lb-cat','Kategorie',`<select id="lb-cat" data-lo="cat">${opts([['','Alle Kategorien'],...catOrder.filter(k=>state.devices.some(d=>catOf(d)[0]===k)).map(k=>[k,(state.devices.find(d=>catOf(d)[0]===k)&&catOf(state.devices.find(d=>catOf(d)[0]===k))[1])||k])],o.cat)}</select>`)+((MS.size||sel&&sel.kind==='dev')?`<label class="chk"><input type="checkbox" data-lo="sel"${o.sel?' checked':''}> Nur ausgewählte Geräte</label>`:''):''}
    ${fld('lb-fmt','Format',`<select id="lb-fmt" data-lo="fmt">${opts(Object.entries(LFMT).map(([k,v])=>[k,v.n]),o.fmt)}</select>`)}
    ${per>1?`<div class="grid2">${fld('lb-start','Erstes freies Etikett auf dem Bogen',`<input id="lb-start" data-lo="start" type="number" min="1" max="${per}" value="${o.start}">`)}<label class="chk" style="align-self:end"><input type="checkbox" data-lo="frame"${o.frame?' checked':''}> Schnittlinien</label></div>`:''}
    <fieldset class="seg" style="grid-template-columns:repeat(3,minmax(0,1fr))"><legend>QR-Code</legend>${[['none','Ohne'],['text','Mit Angaben'],['link','Mit Link']].map(([k,t])=>`<label><input type="radio" name="lq" data-lo="qr" value="${k}"${o.qr===k?' checked':''}><span>${t}</span></label>`).join('')}</fieldset>
    ${o.qr==='link'?fld('lb-base','Adresse deiner Server-Installation',`<input id="lb-base" data-lo="base" value="${esc(o.base)}" placeholder="https://netz.example.de/">`)+'<p class="note">Der QR-Code öffnet dann direkt das Kabel, den Port oder das Gerät in der App.</p>':o.qr==='text'?'<p class="note">Der QR-Code enthält Nummer und beide Enden als Text – lesbar mit jeder Kamera-App, auch ohne Netz.</p>':''}
    <p class="lcount"><b>${pl(n,'Etikett','Etiketten')}</b>${per>1?` auf ${pl(pages,'Bogen','Bögen')}`:''}</p>`};
  modal(`<form class="mbox" id="lform" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="mh"><h2 id="m-t">Etiketten drucken</h2>${closeBtn}</div><div id="lbody"></div><div class="mf"><button type="button" class="btn" data-close>Abbrechen</button><button type="submit" class="btn pri">PDF erstellen</button></div></form>`);
  const rd=el=>{const k=el.dataset.lo;if(!k)return;if(el.type==='radio'&&!el.checked)return;o[k]=el.type==='checkbox'?el.checked:el.value;if(k==='what'){o.only=false}};
  $('#lform').addEventListener('change',e=>{rd(e.target);draw()});$('#lform').addEventListener('input',e=>{if(e.target.dataset.lo==='base'||e.target.dataset.lo==='start')rd(e.target)});
  $('#lform').onsubmit=async e=>{e.preventDefault();if(o.qr==='link'&&!/^https?:\/\//.test(o.base)){toast('Bitte die Adresse der Installation eintragen');return}try{localStorage.setItem(LS2,JSON.stringify({...o,dev:'',sel:false}))}catch(_){}closeModal();toast('Etiketten werden erstellt …');await makeLabels(o)};
  draw()}
/* Direktlinks #dev-…, #cab-…, #port-…-… (für QR-Codes) */
function openHash(){const h=decodeURIComponent(location.hash.slice(1));let m;
  if((m=/^dev-([A-Za-z0-9_-]+)$/.exec(h))&&dev(m[1])){setMode('plan');select({kind:'dev',id:m[1]});centerOn(dev(m[1]))}
  else if((m=/^cab-([A-Za-z0-9_-]+)$/.exec(h))&&state.cables.some(c=>c.id===m[1])){setMode('plan');select({kind:'cable',id:m[1]});centerCable(m[1])}
  else if((m=/^port-([A-Za-z0-9_]+)-([a-z]\d{1,3})$/.exec(h))&&dev(m[1])&&pexists(dev(m[1]),m[2])){setMode('plan');select({kind:'port',dev:m[1],port:m[2]});centerOn(dev(m[1]))}}
window.addEventListener('hashchange',openHash);
async function showQR(kind,id){let QR;try{QR=await needQR()}catch(_){toast('QR-Bibliothek konnte nicht geladen werden');return}const url=location.origin+location.pathname+'#'+kind+'-'+id,q=QR(0,'M');q.addData(url,'Byte');q.make();
  modal(`<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="mh"><h2 id="m-t">QR-Code</h2>${closeBtn}</div><div class="qrbox">${q.createSvgTag({cellSize:6,margin:2,scalable:true})}</div><p class="note">Öffnet ${kind==='dev'?'das Gerät':kind==='cab'?'das Kabel':'den Port'} direkt in der App:</p><p><code>${esc(url)}</code></p><div class="mf"><button type="button" class="btn" id="m-cp">Link kopieren</button><button type="button" class="btn pri" data-close>Fertig</button></div></div>`);
  $('#m-cp').onclick=()=>copyText(url,'Link')}

/* ================= saving ================= */
function setSave(s){const m={local:['Im Browser gespeichert','#8a8a85'],cloud:[store.kind==='server'?'Auf dem Server gespeichert':'Gespeichert','#3ddc6a'],conflict:['Nicht gespeichert – Konflikt','#ff6b5f'],offline:['Server nicht erreichbar','#ff6b5f'],saving:['Speichert …','#ffe600'],err:['Speichern fehlgeschlagen','#ff6b5f'],demo:['Beispiel','#8a8a85'],boot:['Lädt …','#8a8a85']}[s]||['',''];const el=$('#save');el.textContent=m[0];el.title=m[0];el.style.setProperty('--sc',m[1])}
function saveLocal(){try{localStorage.setItem(LS,JSON.stringify(state))}catch(_){}if(store.kind!=='server'&&!state.demo)autoVersion()}
function loadLocal(){try{const t=localStorage.getItem(LS);return t?sanitize(JSON.parse(t)):null}catch(_){return null}}
/* ---------- Versionsverlauf ---------- */
const LSV='switch-verkabelung-versions';
const lvRead=()=>{try{return JSON.parse(localStorage.getItem(LSV)||'[]')}catch(_){return []}};
function lvWrite(a){for(let i=0;i<5;i++){try{localStorage.setItem(LSV,JSON.stringify(a));return true}catch(_){const k=a.map((v,j)=>[v,j]).filter(([v])=>!v.name).pop();if(!k)return false;a.splice(k[1],1)}}return false}
function lvAdd(name){const a=lvRead();a.unshift({id:'v'+Date.now(),updated:Date.now(),name:name||'',devices:state.devices.length,cables:state.cables.length,json:JSON.stringify(state)});
  const auto=a.filter(v=>!v.name);while(a.length>30&&auto.length){const v=auto.pop();a.splice(a.indexOf(v),1)}return lvWrite(a)}
function autoVersion(){const a=lvRead(),last=a.find(v=>!v.name);if(last&&Date.now()-last.updated<15*60e3)return;if(last&&last.json===JSON.stringify(state))return;lvAdd('')}
const VER={
  list:async()=>store.kind==='server'?(await fetch('api/versions',{cache:'no-store'}).then(r=>r.ok?r.json():[])):lvRead().map(({json,...v})=>({...v,named:!!v.name})),
  get:async id=>{if(store.kind==='server'){const r=await fetch('api/versions/'+encodeURIComponent(id),{cache:'no-store'});if(!r.ok)throw new Error();return r.json()}const v=lvRead().find(x=>x.id===id);if(!v)throw new Error();return v},
  add:async name=>{if(store.kind==='server'){if(store.dirty)await saveCloud();const r=await fetch('api/versions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});return r.ok}return lvAdd(name||'Gespeicherter Stand')},
  del:async id=>{if(store.kind==='server')return (await fetch('api/versions/'+encodeURIComponent(id),{method:'DELETE'})).ok;const a=lvRead().filter(v=>v.id!==id);return lvWrite(a)}};
function diffPlans(A,B){const out=[],m=(a,b,key,name,lbl)=>{const am=new Map(a.map(x=>[x[key],x])),bm=new Map(b.map(x=>[x[key],x]));const add=b.filter(x=>!am.has(x[key])),del=a.filter(x=>!bm.has(x[key]));let ch=[],mv=0;
    for(const x of b){const o=am.get(x[key]);if(!o)continue;const s1=JSON.stringify({...o,x:0,y:0}),s2=JSON.stringify({...x,x:0,y:0});if(s1!==s2)ch.push(x);else if(o.x!==x.x||o.y!==x.y)mv++}
    const nm=l=>l.slice(0,6).map(x=>name(x)).join(', ')+(l.length>6?' …':'');
    const P=n=>n+' '+(n===1?lbl[0]:lbl[1]);if(add.length)out.push(`<li class="da">+ ${P(add.length)} neu: ${esc(nm(add))}</li>`);if(del.length)out.push(`<li class="dd">− ${P(del.length)} entfernt: ${esc(nm(del))}</li>`);if(ch.length)out.push(`<li>~ ${P(ch.length)} geändert: ${esc(nm(ch))}</li>`);if(mv)out.push(`<li>${P(mv)} verschoben</li>`)};
  m(A.devices,B.devices,'id',x=>x.name,['Gerät','Geräte']);m(A.cables,B.cables,'id',x=>x.label||'Kabel',['Kabel','Kabel']);m(A.racks,B.racks,'id',x=>x.name,['Schrank','Schränke']);m(A.rooms,B.rooms,'id',x=>x.name,['Raum','Räume']);m(A.vlans||[],B.vlans||[],'id',x=>'VLAN '+x.id,['VLAN','VLANs']);
  if(A.name!==B.name)out.push(`<li>Projektname: „${esc(A.name)}“ → „${esc(B.name)}“</li>`);
  return out.length?`<ul class="diff">${out.join('')}</ul>`:'<p class="note">Keine Unterschiede zum aktuellen Stand.</p>'}
async function openVersions(){
  const srv=store.kind==='server';
  modal(`<div class="mbox wide" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="mh"><h2 id="m-t">Versionsverlauf</h2>${closeBtn}</div>
  <p>${srv?'Der Server sichert den Plan automatisch, höchstens alle 10 Minuten. Benannte Stände bleiben dauerhaft erhalten.':'Gespeichert in diesem Browser: automatisch höchstens alle 15 Minuten beim Bearbeiten, dazu deine benannten Stände.'}</p>
  <form class="vadd" id="vaddf"><input id="m-vn" maxlength="60" placeholder="Name, z. B. Vor Umbau Serverraum" aria-label="Name der Version"><button type="submit" class="btn pri">Aktuellen Stand speichern</button></form>
  <div id="vlist"><p class="note">Lädt …</p></div></div>`);
  $('#vaddf').onsubmit=async e=>{e.preventDefault();const ok=await VER.add($('#m-vn').value.trim());toast(ok?'Stand gespeichert':'Konnte nicht gespeichert werden');$('#m-vn').value='';showVersions()};
  showVersions()}
async function showVersions(){const box=$('#vlist');if(!box)return;let L=[];try{L=await VER.list()}catch(_){}
  box.innerHTML=L.length?`<ul class="vers">${L.map(v=>`<li data-ver="${esc(v.id)}"><div class="vrow2"><span><b>${esc(v.name||'Automatische Sicherung')}</b><small>${new Date(v.updated).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'})} · ${pl(v.devices,'Gerät','Geräte')} · ${v.cables} Kabel</small></span><span class="vbtns"><button type="button" class="btn sm" data-vop="cmp">Vergleichen</button><button type="button" class="btn sm" data-vop="dl">JSON</button><button type="button" class="btn sm pri" data-vop="restore">Wiederherstellen</button>${v.named?`<button type="button" class="ib sm" data-vop="del" aria-label="Version löschen">×</button>`:''}</span></div><div class="vdiff"></div></li>`).join('')}</ul>`:'<p class="note">Noch keine Versionen vorhanden.</p>';
  box.onclick=async e=>{const b=e.target.closest('[data-vop]');if(!b)return;const li=b.closest('[data-ver]'),id=li.dataset.ver;let v;try{v=await VER.get(id)}catch(_){toast('Version nicht lesbar');return}
    let plan;try{plan=sanitize(JSON.parse(v.json))}catch(_){toast('Version ist beschädigt');return}
    if(b.dataset.vop==='cmp'){const t=li.querySelector('.vdiff');t.innerHTML=t.innerHTML?'':'<p class="note">Seit dieser Version:</p>'+diffPlans(plan,state);return}
    if(b.dataset.vop==='dl'){const txt=JSON.stringify(plan,null,2),fn=slug()+'-'+new Date(v.updated).toISOString().slice(0,16).replace(/[:T]/g,'-')+'.json';if(DL)save(fn,txt);else copyText(txt,'Version');return}
    if(b.dataset.vop==='del'){if(await VER.del(id))showVersions();return}
    if(b.dataset.vop==='restore'){closeModal();if(!(await ask('Version wiederherstellen?',`Der Plan wird durch „${v.name||'Automatische Sicherung'}“ vom ${new Date(v.updated).toLocaleString('de-DE')} ersetzt. Der aktuelle Stand wird vorher als Version gesichert.`,'Wiederherstellen')))return;
      await VER.add('Vor Wiederherstellung');ck();const keepT=state.templates;state=plan;if(!state.templates||!state.templates.length)state.templates=keepT||[];state.demo=false;sel=null;MS.clear();LC.clear();touched();renderAll();fit();toast('Version wiederhergestellt – Strg+Z macht es rückgängig')}};
}
async function saveCloud(){
  if(!store.ref)return;if(store.busy){store.pending=true;return}
  store.busy=true;const body={json:JSON.stringify(state),updated:state.updated||Date.now(),v:3};if(store.force){body.force=true;store.force=false}
  try{if(body.json.length>(store.max||240000))throw {code:'too_big'};const res=await store.ref.set(body);if(res&&res.updated&&state.updated===body.updated){state.updated=res.updated;saveLocal()}if(!store.pending)store.dirty=false;setSave('cloud')}
  catch(e){const c=e&&e.code;
    if(c==='unavailable'){await new Promise(r=>setTimeout(r,700+Math.random()*900));try{await store.ref.set(body);setSave('cloud')}catch(_){setSave('err')}}
    else if(c==='too_big'){setSave('err');toast('Projekt ist zu groß für den Online-Speicher – bitte als JSON sichern')}
    else if(c==='quota_exceeded'){setSave('err');toast('Online-Speicher ist voll – Projekt als JSON sichern')}
    else if(c==='conflict'){store.busy=false;store.pending=false;conflict(e.cur);return}
    else if(c==='offline'){setSave('offline')}
    else if(store.kind==='server'){setSave('err');if(c==='auth')toast('Anmeldung am Server abgelaufen – Seite neu laden')}
    else{store.ref=null;setSave('local')}}
  store.busy=false;if(store.pending){store.pending=false;saveCloud()}
}
/* eigener Server (Docker): Speicherung über /api/plan */
function fileSaver(){return {save:async({filename,data})=>{const type=/\.json$/.test(filename)?'application/json':/\.csv$/.test(filename)?'text/csv;charset=utf-8':/\.svg$/.test(filename)?'image/svg+xml':'application/octet-stream';
  const blob=data instanceof Blob?data:new Blob([data],{type}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}}}
async function api(method,body){let r;try{r=await fetch('api/plan',{method,cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined})}catch(_){throw {code:'offline'}}
  if(r.status===204)return null;if(r.status===409)throw {code:'conflict',cur:await r.json().catch(()=>null)};if(r.status===413)throw {code:'too_big'};if(r.status===401)throw {code:'auth'};if(r.status>=500)throw {code:'unavailable'};if(!r.ok)throw {code:'http'};return r.json()}
function applyRemote(b,msg){let remote;try{remote=sanitize(JSON.parse(b.json))}catch(_){return false}remote.updated=+b.updated||0;store.base=remote.updated;store.dirty=false;
  if(!state.demo&&state.devices.length)ck();state=remote;state.demo=false;sel=null;LC.clear();saveLocal();renderAll();fit();setSave('cloud');if(msg)toast(msg);return true}
function conflict(cur){setSave('conflict');if(!cur){toast('Speichern abgelehnt – Seite neu laden');return}
  modal(`<div class="mbox" role="alertdialog" aria-modal="true" aria-labelledby="m-t"><h2 id="m-t">Plan wurde auf dem Server geändert</h2><p>Seit du den Plan geladen hast, wurde er in einem anderen Browser gespeichert. Welche Version soll gelten? Deine Änderungen bleiben bis zur Entscheidung nur hier im Browser.</p><div class="mf"><button type="button" class="btn" id="m-srv">Server-Version laden</button><button type="button" class="btn pri" id="m-mine">Meine Version speichern</button></div></div>`);
  $('#m-srv').onclick=()=>{closeModal();applyRemote(cur,'Server-Version geladen – Strg+Z holt deine Version zurück')};
  $('#m-mine').onclick=()=>{closeModal();store.force=true;setSave('saving');saveCloud()};
}
async function pullServer(){if(store.kind!=='server'||store.busy||store.dirty||document.hidden||!$('#modal').hidden)return;
  try{const b=await api('GET');if(b&&+b.updated>(store.base||0)&&!store.dirty)applyRemote(b,'Neuere Version vom Server geladen')}catch(_){}}
async function initServer(){
  DL=fileSaver();buildMenu();store.kind='server';store.max=20e6;
  store.ref={set:async body=>{const r=await api('PUT',{...body,base:store.base??null});store.base=r.updated;return r}};
  try{const b=await api('GET');
    if(b){store.base=+b.updated||0;const lu=state.demo?-1:(state.updated||0);
      if(lu<=store.base)applyRemote(b);else{setSave('saving');saveCloud()}}
    if(location.hash.length>1)openHash();
    else if(!state.demo){setSave('saving');saveCloud()}else setSave('demo');
  }catch(e){setSave(e&&e.code==='auth'?'err':'offline')}
  document.addEventListener('visibilitychange',pullServer);setInterval(pullServer,30000);
}
async function initCloud(tries){
  if(window.SV_SERVER)return initServer();
  const C=window.claude;
  if(!C||typeof C.use!=='function'){if((tries||0)<6)return setTimeout(()=>initCloud((tries||0)+1),500);DL=fileSaver();buildMenu();setSave(state.demo?'demo':'local');return}
  const use=n=>Promise.resolve().then(()=>C.use(n)).catch(()=>null);
  const [db,user,dl]=await Promise.all([use('db'),use('user'),use('downloads')]);
  DL=dl||null;buildMenu();
  if(!db||!user){setSave(state.demo?'demo':'local');return}
  let id=null;try{id=await user.id()}catch(_){}
  if(!id){setSave(state.demo?'demo':'local');return}
  let ref;try{ref=db.doc('data/users/'+id+'/plan')}catch(_){setSave('local');return}
  try{
    const snap=await Promise.race([ref.get(),new Promise((_,no)=>setTimeout(()=>no({code:'timeout'}),10000))]);
    store.ref=ref;
    if(snap.exists){
      let remote=null;try{const b=snap.data();remote=sanitize(JSON.parse(b.json));remote.updated=+b.updated||remote.updated||0}catch(_){}
      if(remote&&(state.demo||remote.updated>=(state.updated||0))){state=remote;state.demo=false;sel=null;H.u=[];H.r=[];LC.clear();renderAll();fit();setSave('cloud')}
      else{setSave('saving');saveCloud()}
    }else if(!state.demo){setSave('saving');saveCloud()}
    else setSave('demo');
  }catch(e){setSave(state.demo?'demo':'local')}
}

/* ================= example ================= */
function demo(){
  const D=(k,o)=>mkDev(k,o);
  const devs=[
    D('fiber',{id:'lwl1',name:'LWL-Panel Serverraum',style:'fs',pc:{lc:24},fg:'os2',pol:'UPC',rack:'rA',u:1,ports:{l1:{label:'Backbone EG'},l2:{label:'Backbone OG'}}}),
    D('switch',{id:'core',name:'Core-SW',year:2022,psu:'2',pa:'pdu1',pb:'usv1',model:'8G + 16 SFP28 + 2 QSFP28',style:'fs',pc:{rj45:8,sfp28:16,qsfp28:2},rack:'rA',u:2,ip:'10.0.0.1',ports:{r1:{label:'Firewall LAN',vm:'trunk',vlan:99,tv:[10,20,30]},r7:{label:'USV-NMC',vlan:99},r8:{label:'Mgmt-Netz',vlan:99},t1:{speed:'10G',label:'Backbone EG',vm:'trunk',vlan:99,tv:[10,20,30]}}}),
    D('fw',{id:'fw1',name:'Firewall',pa:'pdu1',model:'XGS · 2 WAN · 6 LAN',style:'sophos',year:2019,pc:{rj45:8,sfpp:2},wan:2,rack:'rA',u:3,ip:'10.0.0.254',ports:{r1:{label:'Glasfaser-ONT'},r2:{label:'LTE-Backup'},r3:{label:'LAN Core',vm:'trunk',vlan:99,tv:[10,20,30]}}}),
    D('server',{id:'srv1',name:'ESX-01',year:2015,psu:'2',pa:'pdu1',pb:'usv1',role:'Hypervisor',model:'1 HE · 2 × QSFP28',style:'hpe',he:1,pc:{mgmt:1,rj45:2,qsfp28:2},rack:'rA',u:4,ip:'10.0.10.11'}),
    D('pdu',{id:'pdu1',name:'PDU A',model:'Metered',style:'apc',o13:8,o19:0,amp:'16',pc:{mgmt:1},pa:'usv1',rack:'rA',u:7}),
    D('ups',{id:'usv1',name:'USV Serverraum',year:2018,bat:864,model:'Online, 2 HE',style:'apc',he:2,va:'3000',topo:'vfi',pc:{mgmt:1},rack:'rA',u:5,ip:'10.0.0.5'}),
    D('switch',{id:'acc',name:'Access-SW EG',year:2023,model:'24 PoE+ · 2 SFP+',style:'unifi',pc:{rj45:24,sfpp:2},poe:true,rack:'rB',u:1,ip:'10.0.0.11',ports:{r1:{label:'AP Flur',vlan:20},r2:{label:'PC Empfang',vlan:10},r3:{label:'Telefon Empfang',vlan:30},r4:{label:'PC Buchhaltung',vlan:10},p1:{label:'Uplink Core',vm:'trunk',vlan:99,tv:[10,20,30]}}}),
    D('patch',{id:'pp1',name:'Patchpanel EG',style:'unifi',pc:{kj:24},cat:'cat6a',shield:true,rack:'rB',u:2,ports:{k1:{label:'AP Flur',notes:'Flur EG · Deckendose'},k2:{label:'PC Mustermann',notes:'PC Max Mustermann · Empfang, Dose 1'},k3:{label:'Tel. Mustermann',notes:'Telefon Max Mustermann · Empfang, Dose 2'},k4:{label:'PC Musterfrau',notes:'PC Erika Musterfrau · Buchhaltung, Dose 1'}}}),
    D('ap',{id:'ap1',name:'AP Flur EG',style:'unifi',wifi:'Wi-Fi 6E',rj45Speed:'2.5G',poeStd:'at',ip:'10.0.20.21',x:120,y:2020}),
    D('host',{id:'pc1',name:'PC Empfang',year:2020,sub:'pc',ip:'10.0.10.51',user:'Max Mustermann',mac:'3c:52:82:1a:7f:10',x:380,y:2020}),
    D('host',{id:'tel1',name:'Telefon Empfang',sub:'phone',pc:{rj45:2},pd:true,ip:'10.0.30.12',user:'Max Mustermann',x:676,y:2020}),
    D('host',{id:'pc2',name:'PC Buchhaltung',year:2024,sub:'pc',ip:'10.0.10.52',user:'Erika Musterfrau',mac:'3c:52:82:1a:80:22',x:972,y:2020})
  ];
  const C=(id,a,b,o)=>Object.assign({id,a,b,label:'',med:'cu',cat:'cat6a',shield:'U/UTP',fg:'om4',ca:'LC',cb:'LC',pol:'UPC',dac:'passiv',ta:'',tb:'',ia:'',ib:'',color:'auto',len:'',notes:''},o);
  return {v:3,name:'Beispiel Bürogebäude',devices:devs,
    racks:[{id:'rA',name:'Rack A1',rsize:'19',minHe:0,rcolor:'schwarz',location:'Serverraum UG',notes:'',x:120,y:160},{id:'rB',name:'Verteiler EG',rsize:'19',minHe:0,rcolor:'grau',location:'Technikraum EG',notes:'',x:120,y:1450}],
    rooms:[{id:'mA',name:'Serverraum UG',roomc:'blau',x:40,y:40,w:1520,h:1180,notes:''},{id:'mB',name:'EG · Technik & Empfang',roomc:'gruen',x:40,y:1330,w:1520,h:1000,notes:''}],
    cables:[
    C('c1',{d:'core',p:'t1'},{d:'lwl1',p:'l1'},{label:'K-001',med:'fi',fg:'os2',ta:'10GBASE-LR',ia:'Singlemode-Modul',len:2,color:'gelb'}),
    C('c2',{d:'lwl1',p:'l1',s:'r'},{d:'acc',p:'p1'},{label:'K-002',med:'fi',fg:'os2',tb:'10GBASE-LR',len:80,color:'gelb',notes:'Backbone Serverraum → Verteiler EG'}),
    C('c3',{d:'core',p:'u1'},{d:'srv1',p:'u1'},{label:'K-003',med:'fi',fg:'om4',ca:'MPO',cb:'MPO',ta:'100GBASE-SR4',tb:'100GBASE-SR4',len:3,color:'violett'}),
    C('c4',{d:'core',p:'u2'},{d:'srv1',p:'u2'},{label:'K-004',med:'fi',fg:'om4',ca:'MPO',cb:'MPO',ta:'100GBASE-SR4',tb:'100GBASE-SR4',len:3,color:'violett'}),
    C('c5',{d:'core',p:'r8'},{d:'srv1',p:'g1'},{label:'K-005',len:2,color:'rot'}),
    C('c6',{d:'fw1',p:'r3'},{d:'core',p:'r1'},{label:'K-006',len:1,color:'orange'}),
    C('c7',{d:'usv1',p:'g1'},{d:'core',p:'r7'},{label:'K-007',len:2,color:'grau'}),
    C('c8',{d:'acc',p:'r1'},{d:'pp1',p:'k1'},{label:'K-008',shield:'S/FTP',len:0.5,color:'blau'}),
    C('c9',{d:'pp1',p:'k1',s:'r'},{d:'ap1',p:'r1'},{label:'K-009',cat:'cat7',shield:'S/FTP',len:25,color:'weiss'}),
    C('c10',{d:'acc',p:'r2'},{d:'pp1',p:'k2'},{label:'K-010',shield:'S/FTP',len:0.5,color:'blau'}),
    C('c11',{d:'pp1',p:'k2',s:'r'},{d:'pc1',p:'r1'},{label:'K-011',cat:'cat7',shield:'S/FTP',len:18,color:'weiss'}),
    C('c12',{d:'acc',p:'r3'},{d:'pp1',p:'k3'},{label:'K-012',shield:'S/FTP',len:0.5,color:'gruen'}),
    C('c13',{d:'pp1',p:'k3',s:'r'},{d:'tel1',p:'r1'},{label:'K-013',cat:'cat7',shield:'S/FTP',len:18,color:'weiss'}),
    C('c14',{d:'acc',p:'r4'},{d:'pp1',p:'k4'},{label:'K-014',shield:'S/FTP',len:0.5,color:'blau'}),
    C('c15',{d:'pp1',p:'k4',s:'r'},{d:'pc2',p:'r1'},{label:'K-015',cat:'cat7',shield:'S/FTP',len:24,color:'weiss'})
  ],vlans:[{id:10,name:'Clients',color:'#2563eb',subnet:'10.0.10.0/24',gw:'10.0.10.1'},{id:20,name:'WLAN',color:'#16a34a',subnet:'10.0.20.0/24',gw:'10.0.20.1'},{id:30,name:'Telefonie',color:'#9333ea',subnet:'10.0.30.0/24',gw:'10.0.30.1'},{id:99,name:'Management',color:'#475569',subnet:'10.0.0.0/24',gw:'10.0.0.254'}],view:{labelMode:'num',colorBy:'speed',hide:{cats:[],ids:[]}},life:{old:5,eol:10},updated:0,demo:true};
}

/* ================= start ================= */
function start(hot){
  let s=null;
  if(hot&&hot.state){try{s=sanitize(hot.state)}catch(_){}}
  if(!s)s=loadLocal();
  if(!s)s=sanitize(demo());
  state=s;
  $('#defs').innerHTML=defsSVG();renderLegend();buildMenu();setSave('boot');
  if(innerWidth<=760){$('#insp').classList.add('min');$('#itog').setAttribute('aria-expanded','false')}
  renderAll();
  if(hot&&hot.view&&Number.isFinite(hot.view.z)){view=hot.view;applyView()}else requestAnimationFrame(fit);
  if(location.hash.length>1&&!window.SV_SERVER)requestAnimationFrame(()=>requestAnimationFrame(openHash));
  try{window.claude&&window.claude.hot&&window.claude.hot.snapshot&&window.claude.hot.snapshot(()=>({state,view}))}catch(_){}
  initCloud(0);
  let rt=0;new ResizeObserver(()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!drag)applyView()},60)}).observe(stage);
}
const hot=window.claude&&window.claude.hot;
if(hot&&hot.ready)hot.ready(start);else start((hot&&hot.data)||{});
}
