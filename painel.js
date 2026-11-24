/* Painel da loja Bianca Abreu: pedidos, agenda, relatórios, clientes, estoque, cardápio, fotos e configurações */
(()=>{
const B=window.BA;if(!B)return;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const {esc,brl,toast}=B;
const root=document.getElementById('pnl');
const STS={novo:['Novo','var(--s-novo)'],preparo:['Em preparo','var(--s-preparo)'],pronto:['Pronto p/ retirada','var(--s-pronto)'],saiu:['Saiu p/ entrega','var(--s-saiu)'],concluido:['Concluído','var(--s-concluido)'],cancelado:['Cancelado','var(--s-cancelado)']};
const CANAIS={site:'Site',whatsapp:'WhatsApp',instagram:'Instagram',balcao:'Balcão',telefone:'Telefone',ifood:'Outro app'};
const st=s=>{const x=STS[s]||STS.novo;return`<span class="st" style="--c:${x[1]}">${x[0]}</span>`};
const next=o=>({novo:['preparo','Aceitar pedido'],preparo:o.tipo==='entrega'?['saiu','Saiu p/ entrega']:['pronto','Pronto p/ retirada'],pronto:['concluido','Concluir'],saiu:['concluido','Concluir']}[o.status]);
const DAY=864e5;
const d0=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d.getTime()};
const isoD=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const fromIso=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c||1).getTime()};
const hm=t=>new Date(t).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
const dmy=t=>new Date(t).toLocaleDateString('pt-BR');
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);return m<1?'agora':m<60?`há ${m} min`:m<1440?`há ${Math.round(m/60)} h`:`há ${Math.round(m/1440)} d`};
const digits=v=>String(v||'').replace(/\D/g,'');
const waLink=(tel,msg)=>{let d=digits(tel);if(d.length<10)return'';if(!d.startsWith('55'))d='55'+d;return`https://wa.me/${d}?text=${encodeURIComponent(msg)}`};
const valid=o=>o.status!=='cancelado';
const L=k=>B.ls.get(k,null),S=(k,v)=>B.ls.set(k,v);
const pct=(a,b)=>b?Math.round((a-b)/b*100):null;

/* ---------- ícones ---------- */
const IC={home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',bag:'<path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',cake:'<path d="M4 21h16v-8H4zM4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 3 1.5 4 0M12 13V9M12 6.5a1.5 1.5 0 1 0 0-.01"/>',img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',plus:'<path d="M12 5v14M5 12h14"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',out:'<path d="M15 4h4v16h-4M10 17l5-5-5-5M15 12H3"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',print:'<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',dl:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',wa:'<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"/>',check:'<path d="M5 12l5 5 9-10"/>',money:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',up:'<path d="M12 19V5M5 12l7-7 7 7"/>',down:'<path d="M12 5v14M19 12l-7 7-7-7"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>'};
const ic=(n,c='')=>`<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

/* ---------- estado do painel ---------- */
let authed=false,page='inicio',ofil='ativos',oq='',seenIds=new Set(),freshIds=new Set(),soundOn=false,actx=null;
let rep={mode:'mes',dia:isoD(Date.now()),mes:isoD(Date.now()).slice(0,7),de:isoD(Date.now()-29*DAY),ate:isoD(Date.now())};
let cq='',cfil='todos';
let stock=L('estoque')||[];let stockUnsub=null;
const PAGES=[['inicio','Visão geral','home'],['pedidos','Pedidos','bag'],['agenda','Agenda','cal'],['relatorios','Relatórios','chart'],['clientes','Clientes','users'],['estoque','Estoque','box'],['cardapio','Cardápio','cake'],['fotos','Fotos do site','img'],['config','Configurações','gear']];
const TPL={recebido:'Olá, {nome}! 💗 Recebemos seu pedido #{num} na Bianca Abreu Confeitaria. Total: {total}. Já já começamos a preparar!',
 preparo:'Oi, {nome}! Seu pedido #{num} já está sendo preparado com carinho. 🍰',
 saiu:'Oi, {nome}! Seu pedido #{num} saiu para entrega e logo chega aí. 🛵',
 pronto:'Oi, {nome}! Seu pedido #{num} está pronto para retirada na Av. Augusto Teixeira, 2556. Te esperamos! 💗',
 pix:'Oi, {nome}! Segue o Pix do pedido #{num} no valor de {total}:\n\n{pix}\n\nDepois é só mandar o comprovante por aqui. 💗',
 obrigado:'Obrigada pela preferência, {nome}! 💗 Se puder, conta pra gente o que achou no Google, ajuda muito: https://www.google.com/maps/place/Bianca+Abreu+Confeitaria/@-4.4588131,-43.8883388,17z',
 saudade:'Oi, {nome}! Que saudade de você por aqui. 💗 Nosso cardápio está cheio de novidades, vem conferir!'};
const tpl=(k,o)=>{const t=(B.cfg.tpl&&B.cfg.tpl[k])||TPL[k];return t.replace(/\{nome\}/g,(o.cliente?.nome||o.nome||'').split(' ')[0]).replace(/\{num\}/g,o.num||'').replace(/\{total\}/g,brl(o.total||0)).replace(/\{pix\}/g,B.pixPayload(o.total||0,'PED'+(o.num||''))||'(cadastre a chave Pix em Configurações)')};

/* ---------- dados ---------- */
const O=()=>B.orders;
async function patch(o,ch,stat){const c={...ch};if(stat){c.status=stat;c.hist=[...(o.hist||[{s:'novo',t:o.criado}]),{s:stat,t:Date.now()}]}await B.store.patch(o.id,c);
 if(stat==='preparo'&&B.cfg.estoqueOn&&!o.baixa){await baixaEstoque(o);await B.store.patch(o.id,{baixa:true})}
 if(stat==='preparo'&&B.cfg.auto)B.printOrder({...o,...c})}
const newNum=()=>Math.max(1000,...O().map(x=>+x.num||0))+1;

/* ---------- estoque ---------- */
function stockSub(){if(stockUnsub||!B.dbOk)return;try{stockUnsub=B.db.collection('estoque').limit(500).onSnapshot(s=>{stock=s.docs.map(d=>({...d.data(),id:d.id}));S('estoque',stock);if(page==='estoque'||page==='inicio')render()},()=>{})}catch(e){}}
async function saveItem(it){if(B.dbOk){try{await B.db.collection('estoque').doc(it.id).set(it)}catch(e){}}stock=[it,...stock.filter(x=>x.id!==it.id)];S('estoque',stock)}
async function delItem(it){if(B.dbOk){try{await B.db.collection('estoque').doc(it.id).delete()}catch(e){}}stock=stock.filter(x=>x.id!==it.id);S('estoque',stock)}
async function mov(it,q,tipo,obs){const n={...it,qtd:Math.round(((+it.qtd||0)+q)*1000)/1000,movs:[{t:Date.now(),q,tipo,obs:obs||''},...(it.movs||[])].slice(0,40)};await saveItem(n);
 if(n.k&&B.cfg.autoEsgot&&n.qtd<=0&&!B.cfg.esgot.includes(n.k)){B.cfg.esgot=[...B.cfg.esgot,n.k];await B.store.saveCfg();toast(`${n.nome} zerou e foi marcado como esgotado no site`)}
 return n}
async function baixaEstoque(o){for(const i of o.itens||[]){for(const it of stock.filter(s=>s.k===i.k)){await mov(it,-(+it.por||1)*i.q,'venda','Pedido #'+o.num)}}}
const low=()=>stock.filter(s=>(+s.min||0)>0&&(+s.qtd||0)<=(+s.min||0));

/* ---------- som ---------- */
function ding(){if(!soundOn||!actx)return;try{[0,.18,.36].forEach((t,i)=>{const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=[880,1175,1568][i];g.gain.setValueAtTime(.0001,actx.currentTime+t);g.gain.exponentialRampToValueAtTime(.28,actx.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+t+.4);o.connect(g).connect(actx.destination);o.start(actx.currentTime+t);o.stop(actx.currentTime+t+.45)})}catch(e){}}

/* ---------- shell ---------- */
function shell(){const nNovo=O().filter(o=>o.status==='novo').length;const pg=PAGES.find(p=>p[0]===page);
 const nav=PAGES.map(([k,l,i])=>`<button class="nv${page===k?' on':''}" data-go="${k}">${ic(i)}${l}${k==='pedidos'&&nNovo?`<em>${nNovo}</em>`:''}${k==='estoque'&&low().length?`<em>${low().length}</em>`:''}</button>`).join('');
 return`<div class="app"><aside class="side"><div class="brandp"><span class="logo media"><img src="${esc(B.src('logo'))}" alt="" onerror="this.remove()"></span><div><b>Bianca Abreu</b><small>Painel da loja</small></div></div>
 ${nav.replace(/(data-go="estoque")/,'$1')}<div class="foot"><div class="sep"></div><button class="nv" data-act="site">${ic('eye')}Ver o site</button><button class="nv" data-act="sair">${ic('out')}Sair</button></div></aside>
 <section class="pmain"><div class="ptopbar"><div><h1>${pg[1]}</h1><div class="sub">${new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})} · ${B.dbOk?'sincronizado ao vivo':'salvo neste aparelho'}</div></div>
 <div class="ptools"><span class="openpill">${B.cfg.aberto?'Recebendo pedidos':'Pedidos pausados'}<label class="sw"><input type="checkbox" data-act="aberto" ${B.cfg.aberto?'checked':''} aria-label="Recebendo pedidos"><i></i></label></span>
 <button class="ibtn${soundOn?' on':''}" data-act="som" title="${soundOn?'Som de novo pedido ligado':'Ligar som de novo pedido'}" aria-label="Som de novo pedido">${ic('bell')}</button>
 <button class="pbtn pri" data-act="novo">${ic('plus')}Novo pedido</button></div></div>
 <div id="pv"></div></section></div>
 <nav class="bnav">${[['inicio','Início','home'],['pedidos','Pedidos','bag'],['agenda','Agenda','cal'],['relatorios','Relatórios','chart']].map(([k,l,i])=>`<button class="${page===k?'on':''}" data-go="${k}">${ic(i)}${l}${k==='pedidos'&&nNovo?`<em>${nNovo}</em>`:''}</button>`).join('')}<button class="${['clientes','estoque','cardapio','fotos','config'].includes(page)?'on':''}" data-act="mais">${ic('menu')}Mais</button></nav>
 <div class="pscrim" id="pscrim"></div><aside class="pdraw" id="pdraw" aria-label="Detalhes"></aside>`}

/* ---------- login ---------- */
function login(){root.innerHTML=`<div class="pl-login"><form id="plf"><span class="logo media" style="display:block"><img src="${esc(B.src('logo'))}" alt="" onerror="this.remove()"></span><div class="eyb">Área da loja</div><h2 style="font-size:30px;margin-bottom:6px">Painel Bianca Abreu</h2><p class="mute" style="margin:0 0 18px">Digite o PIN para acessar pedidos, relatórios e estoque.</p><input class="in pin" id="plpin" inputmode="numeric" maxlength="6" autocomplete="off" aria-label="PIN"><p class="note" id="plerr" style="color:var(--berry);font-weight:700"></p><button class="btn" style="width:100%;margin-top:8px">Entrar</button><p class="note" style="margin-top:14px">PIN de demonstração: 1234 · troque em Configurações</p><a class="note" href="#inicio">Voltar ao site</a></form></div>`;
 $('#plpin').focus();$('#plf').onsubmit=e=>{e.preventDefault();if($('#plpin').value===String(B.cfg.pin||'1234')){authed=true;O().forEach(o=>seenIds.add(o.id));stockSub();render()}else{$('#plerr').textContent='PIN incorreto.';$('#plpin').select()}}}

/* ---------- render ---------- */
let lastPage=null,drawerOrder=null,bulk=false;
function render(reason){if(bulk||location.hash!=='#painel')return;if(!authed)return login();
 const formPage=['cardapio','config','fotos'].includes(page);
 if(reason==='cfg'&&formPage&&lastPage===page&&root.querySelector('.app'))return;
 const app=root.querySelector('.app');
 if(app&&lastPage===page&&$('#pdraw.on')){if(!(reason==='cfg'&&formPage))VIEWS[page]();if(drawerOrder&&!document.activeElement?.closest('#pdraw'))showOrder(drawerOrder);return}
 const sy=lastPage===page?scrollY:0;
 root.innerHTML=shell();lastPage=page;
 VIEWS[page]();
 window.scrollTo(0,sy)}

const VIEWS={get inicio(){return vInicio},get pedidos(){return vPedidos},get agenda(){return vAgenda},get relatorios(){return vRel},get clientes(){return vCli},get estoque(){return vEst},get cardapio(){return vCard},get fotos(){return vFotos},get config(){return vCfg}};
/* ---------- cartões de pedido ---------- */
function ocard(o){const nx=next(o);return`<div class="ocard${freshIds.has(o.id)?' fresh':''}" data-o="${esc(o.id)}">
 <div class="h"><b>#${esc(o.num)}</b><small>${hm(o.criado)} · ${ago(o.criado)}</small></div><div class="nm">${esc(o.cliente?.nome)}</div>
 <div class="chips2" style="gap:6px"><span class="tag2">${o.tipo==='entrega'?'Delivery':'Retirada'}</span>${o.quando==='agendado'?`<span class="tag2 warn">${esc(B.fmtD(o.data))} ${esc(o.hora)}</span>`:''}<span class="tag2 ${o.pago?'ok':'bad'}">${o.pago?'Pago':'A receber'} · ${esc(o.pag)}</span>${o.canal&&o.canal!=='site'?`<span class="tag2">${esc(CANAIS[o.canal]||o.canal)}</span>`:''}</div>
 <div class="its">${(o.itens||[]).map(i=>`${esc(i.q)}× ${esc(i.n)}`).join(' · ')}</div>
 <div class="ft2"><b>${brl(o.total)}</b>${nx?`<button class="go2" data-mv="${esc(o.id)}" data-to="${nx[0]}">${nx[1]}</button>`:st(o.status)}</div></div>`}

/* ---------- VISÃO GERAL ---------- */
function vInicio(){const t0=d0(Date.now()),os=O();const hoje=os.filter(o=>o.criado>=t0&&valid(o)),ontem=os.filter(o=>o.criado>=t0-DAY&&o.criado<t0&&valid(o));
 const fat=sum(hoje),fatO=sum(ontem);const areceber=os.filter(o=>valid(o)&&!o.pago&&o.status!=='novo');const aguard=os.filter(o=>o.status==='novo');
 const prox=os.filter(o=>valid(o)&&o.quando==='agendado'&&o.status!=='concluido'&&o.data&&fromIso(o.data)>=t0).sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora)).slice(0,6);
 const m0=new Date();m0.setDate(1);m0.setHours(0,0,0,0);const mes=os.filter(o=>o.criado>=m0.getTime()&&valid(o));
 const dd=delta(fat,fatO);
 $('#pv').innerHTML=`<div class="pgrid g4" style="margin-bottom:16px">
 <div class="kp hl"><small>Faturamento hoje</small><b>${brl(fat)}</b><div class="dl">${dd}</div></div>
 <div class="kp"><small>Pedidos hoje</small><b>${hoje.length}</b><div class="dl">${ontem.length} ontem</div></div>
 <div class="kp"><small>Ticket médio hoje</small><b>${brl(hoje.length?fat/hoje.length:0)}</b><div class="dl">no mês: ${brl(mes.length?sum(mes)/mes.length:0)}</div></div>
 <div class="kp"><small>A receber</small><b>${brl(sum(areceber))}</b><div class="dl">${areceber.length} pedido(s) sem pagamento</div></div></div>
 <div class="pgrid g21" style="margin-bottom:16px">
  <div class="pcard"><h3>Aguardando aceite <small>${aguard.length} pedido(s)</small></h3>${aguard.length?`<div class="pgrid g2">${aguard.sort((a,b)=>a.criado-b.criado).slice(0,4).map(ocard).join('')}</div>${aguard.length>4?`<button class="pbtn" data-go="pedidos">Ver todos os pedidos</button>`:''}`:`<div class="empty2"><b>Tudo em dia</b>Nenhum pedido esperando aceite.</div>`}</div>
  <div class="pcard"><h3>Próximas encomendas <small><a href="#painel" data-go="agenda">ver agenda</a></small></h3>${prox.length?`<ul class="tl">${prox.map(o=>`<li style="--c:var(--s-preparo);cursor:pointer" data-o="${esc(o.id)}"><i></i><span><b>${esc(B.fmtD(o.data))} ${esc(o.hora)}</b> · ${esc(o.cliente?.nome)}</span><small>${brl(o.total)}</small></li>`).join('')}</ul>`:`<p class="mute" style="margin:0">Nenhuma encomenda agendada.</p>`}
  ${low().length?`<div class="sec" style="margin-top:16px;border-color:#f0b8c4"><h4>ESTOQUE BAIXO</h4>${low().slice(0,5).map(s=>`<div class="line2"><span>${esc(s.nome)}</span><span>${fmtQ(s.qtd)} ${esc(s.un)}</span></div>`).join('')}<button class="pbtn" data-go="estoque" style="margin-top:8px">Abrir estoque</button></div>`:''}</div></div>
 <div class="pgrid g21"><div class="pcard"><h3>Vendas dos últimos 14 dias <small>faturamento por dia</small></h3><div class="chart" id="ch1"></div></div>
 <div class="pcard"><h3>Mais vendidos no mês <small>por quantidade</small></h3>${rank(topProd(mes),'q')}</div></div>`;
 const days=[...Array(14)].map((_,i)=>t0-(13-i)*DAY);barChart($('#ch1'),days.map(d=>({l:new Date(d).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),v:sum(os.filter(o=>valid(o)&&o.criado>=d&&o.criado<d+DAY)),n:os.filter(o=>valid(o)&&o.criado>=d&&o.criado<d+DAY).length})))}
const sum=l=>l.reduce((a,o)=>a+(+o.total||0),0);
const delta=(a,b)=>{const p=pct(a,b);return p==null?'sem vendas ontem para comparar':`<span class="${p>=0?'up':'down'}">${p>=0?'▲':'▼'} ${Math.abs(p)}%</span> vs. ontem`};
function topProd(list){const m={};list.forEach(o=>(o.itens||[]).forEach(i=>{const x=m[i.k||i.n]||(m[i.k||i.n]={n:i.n,k:i.k,q:0,v:0});x.q+=+i.q||0;x.v+=(+i.q||0)*(+i.p||0)}));return Object.values(m).sort((a,b)=>b.q-a.q||b.v-a.v)}
function rank(arr,by,max=6){if(!arr.length)return`<p class="mute" style="margin:0">Sem vendas no período.</p>`;const top=arr.slice(0,max),mx=Math.max(...top.map(x=>x[by]))||1;
 return`<div class="rank">${top.map(x=>`<div class="rk"><span>${esc(x.n)}</span><b>${by==='q'?x.q+' un · '+brl(x.v):brl(x.v)+' · '+x.q+' un'}</b><div class="bar"><i style="width:${Math.max(3,x[by]/mx*100)}%"></i></div></div>`).join('')}</div>`}
const fmtQ=q=>(+q||0).toLocaleString('pt-BR',{maximumFractionDigits:3});

/* ---------- gráfico de barras ---------- */
function barChart(box,data){if(!box)return;box.innerHTML='<svg></svg><div class="tip"></div>';const svg=box.querySelector('svg'),tip=box.querySelector('.tip');
 const draw=()=>{const W=box.clientWidth,H=box.clientHeight;if(!W)return;const pl=8,pr=8,pt=10,pb=26;const mx=Math.max(...data.map(d=>d.v),1);const nice=niceMax(mx);
  const bw=(W-pl-pr)/data.length,gap=Math.max(2,Math.min(10,bw*.28));const y=v=>pt+(H-pt-pb)*(1-v/nice);
  const ticks=[0,.5,1].map(f=>nice*f);const step=Math.ceil(data.length/(W<520?7:16));
  svg.innerHTML=ticks.map(t=>`<line x1="${pl}" x2="${W-pr}" y1="${y(t)}" y2="${y(t)}" stroke="var(--pline)" stroke-width="1"/><text x="${W-pr}" y="${y(t)-4}" text-anchor="end" font-size="11" fill="var(--mute)" font-family="Manrope">${t?brl(t).replace(',00',''):''}</text>`).join('')+
  data.map((d,i)=>{const x=pl+i*bw+gap/2,w=Math.max(2,bw-gap),h=Math.max(d.v?3:0,H-pb-y(d.v));return`<path d="M${x} ${H-pb}V${H-pb-h+Math.min(4,h)}q0-4 4-4h${Math.max(0,w-8)}q4 0 4 4V${H-pb}z" fill="${d.v?'var(--cocoa)':'var(--pline)'}" data-i="${i}"/><rect x="${pl+i*bw}" y="${pt}" width="${bw}" height="${H-pt}" fill="transparent" data-i="${i}"/>${i%step===0?`<text x="${x+w/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--mute)" font-family="Manrope">${esc(d.l)}</text>`:''}`}).join('');
  svg.onmousemove=e=>{const i=e.target.dataset?.i;if(i==null){tip.style.opacity=0;return}const d=data[i];tip.innerHTML=`${esc(d.l)}<br>${brl(d.v)} · ${d.n} pedido(s)`;tip.style.left=(pl+i*bw+bw/2)+'px';tip.style.top=y(d.v)+'px';tip.style.opacity=1};svg.onmouseleave=()=>tip.style.opacity=0};
 draw();const ro=new ResizeObserver(draw);ro.observe(box)}
const niceMax=m=>{const p=Math.pow(10,Math.floor(Math.log10(m)));const f=m/p;return(f<=1?1:f<=2?2:f<=5?5:10)*p};

/* ---------- PEDIDOS ---------- */
function vPedidos(){const os=O(),t0=d0(Date.now());const ql=oq.trim().toLowerCase();
 const match=o=>!ql||String(o.num).includes(ql)||(o.cliente?.nome||'').toLowerCase().includes(ql)||digits(o.cliente?.tel).includes(digits(ql)||'§');
 const F={ativos:o=>['novo','preparo','pronto','saiu'].includes(o.status),hoje:o=>o.criado>=t0,agendados:o=>o.quando==='agendado'&&valid(o)&&o.status!=='concluido',receber:o=>valid(o)&&!o.pago,todos:()=>true,cancelados:o=>o.status==='cancelado'};
 const cnt=k=>os.filter(F[k]).length;
 const chips=[['ativos','Em andamento'],['hoje','Hoje'],['agendados','Agendados'],['receber','A receber'],['todos','Todos'],['cancelados','Cancelados']].map(([k,l])=>`<button class="chip2${ofil===k?' on':''}" data-of="${k}">${l} <em>${cnt(k)}</em></button>`).join('');
 const list=os.filter(F[ofil]).filter(match);
 let body;
 if(ofil==='ativos'&&!ql){const cols=[['Novos',['novo'],'var(--s-novo)'],['Em preparo',['preparo'],'var(--s-preparo)'],['Prontos e em rota',['pronto','saiu'],'var(--s-pronto)'],['Concluídos hoje',['concluido'],'var(--s-concluido)']];
  body=`<div class="kanban">${cols.map(([n,ss,c])=>{const l=(ss[0]==='concluido'?os.filter(o=>o.status==='concluido'&&o.criado>=t0):os.filter(o=>ss.includes(o.status))).sort((a,b)=>a.criado-b.criado);return`<div class="kcol"><h4><i style="--c:${c};background:${c}"></i>${n}<em>${l.length}</em></h4>${l.map(ocard).join('')||'<p class="note2" style="padding:4px 6px">Nenhum pedido</p>'}</div>`}).join('')}</div>`}
 else body=list.length?`<div class="pcard" style="padding:6px 14px"><table class="tbl stack"><thead><tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Entrega</th><th>Pagamento</th><th>Status</th><th class="n">Total</th></tr></thead><tbody>${list.sort((a,b)=>b.criado-a.criado).slice(0,300).map(o=>`<tr class="click" data-o="${esc(o.id)}"><td data-l="Pedido"><b>#${esc(o.num)}</b></td><td data-l="Data">${dmy(o.criado)} ${hm(o.criado)}${o.quando==='agendado'?`<br><span class="tag2 warn">p/ ${esc(B.fmtD(o.data))} ${esc(o.hora)}</span>`:''}</td><td data-l="Cliente">${esc(o.cliente?.nome)}</td><td data-l="Entrega">${o.tipo==='entrega'?'Delivery':'Retirada'}</td><td data-l="Pagamento"><span class="tag2 ${o.pago?'ok':'bad'}">${o.pago?'Pago':'A receber'}</span> ${esc(o.pag)}</td><td data-l="Status">${st(o.status)}</td><td class="n" data-l="Total"><b>${brl(o.total)}</b></td></tr>`).join('')}</tbody></table></div>`:`<div class="pcard empty2"><b>Nenhum pedido aqui</b>Mude o filtro ou registre um pedido manual em “Novo pedido”.</div>`;
 $('#pv').innerHTML=`<div class="mrow"><div class="chips2">${chips}</div><label class="psearch">${ic('search')}<input id="oq" type="search" placeholder="Buscar nome, número ou telefone" value="${esc(oq)}" aria-label="Buscar pedidos"></label></div>${body}`;
 const q=$('#oq');q.oninput=()=>{oq=q.value;const p=q.selectionStart;vPedidos();const n=$('#oq');n.focus();n.setSelectionRange(p,p)};
 freshIds.clear()}

/* ---------- detalhe do pedido ---------- */
function openDraw(html,oid){drawerOrder=oid||null;$('#pdraw').innerHTML=html;$('#pdraw').classList.add('on');$('#pscrim').classList.add('on')}
function closeDraw(){drawerOrder=null;$('#pdraw')?.classList.remove('on');$('#pscrim')?.classList.remove('on')}
function showOrder(id){const o=O().find(x=>x.id===id);if(!o)return;const nx=next(o);const hist=o.hist||[{s:'novo',t:o.criado}];const tel=o.cliente?.tel;
 const sub=(o.itens||[]).reduce((a,i)=>a+i.p*i.q,0);
 const wa=k=>{const u=waLink(tel,tpl(k,o));return u?`<a class="wab" href="${esc(u)}" target="_blank" rel="noopener">${ic('wa')}${{recebido:'Pedido recebido',preparo:'Em preparo',saiu:'Saiu p/ entrega',pronto:'Pronto p/ retirada',pix:'Enviar Pix',obrigado:'Agradecer e pedir avaliação'}[k]}</a>`:''};
 const compU=waLink(tel,B.waText(o));
 openDraw(`<div class="pdh"><div><h2>Pedido #${esc(o.num)}</h2><div class="note2">${dmy(o.criado)} às ${hm(o.criado)} · ${esc(CANAIS[o.canal||'site'])}</div></div><button class="ibtn" data-act="fechar" aria-label="Fechar">${ic('x')}</button></div>
 <div class="pdb">
  <div class="sec" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">${st(o.status)}${nx?`<button class="pbtn pri" data-mv="${esc(o.id)}" data-to="${nx[0]}">${ic('check')}${nx[1]}</button>`:''}</div>
  <div class="sec"><h4>CLIENTE</h4><div style="font-weight:800;font-size:16px">${esc(o.cliente?.nome)}</div><div class="note2" style="font-size:14px">${esc(tel)}</div>
   <div style="margin-top:8px"><span class="tag2">${o.tipo==='entrega'?'Delivery':'Retirada na loja'}</span> ${o.quando==='agendado'?`<span class="tag2 warn">Para ${esc(B.fmtD(o.data))} às ${esc(o.hora)}</span>`:'<span class="tag2">O quanto antes</span>'}</div>
   ${o.tipo==='entrega'?`<p style="margin:10px 0 0">${esc(o.endereco)}${o.ref?`<br><span class="note2">Ref.: ${esc(o.ref)}</span>`:''}</p>`:''}${o.obs?`<p style="margin:10px 0 0"><b>Obs.:</b> ${esc(o.obs)}</p>`:''}</div>
  <div class="sec"><h4>ITENS</h4>${(o.itens||[]).map(i=>`<div class="line2"><span>${esc(i.q)}× ${esc(i.n)}${i.obs?`<br><small class="note2">${esc(i.obs)}</small>`:''}</span><span>${brl(i.p*i.q)}</span></div>`).join('')}
   <div style="border-top:1px dashed var(--pline);margin:8px 0"></div><div class="line2"><span>Subtotal</span><span>${brl(sub)}</span></div>
   <div class="row2" style="margin-top:6px"><div><label class="note2" for="dTaxa">Taxa de entrega (R$)</label><input class="in" id="dTaxa" type="number" step="0.5" min="0" value="${+o.taxa||0}"></div><div><label class="note2" for="dDesc">Desconto (R$)</label><input class="in" id="dDesc" type="number" step="0.5" min="0" value="${+o.desc||0}"></div></div>
   <div class="line2" style="font-size:18px;margin-top:8px"><span><b>Total</b></span><span id="dTot">${brl(o.total)}</span></div></div>
  <div class="sec"><h4>PAGAMENTO</h4><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span>${esc(o.pag)}${o.troco?` · troco p/ ${esc(o.troco)}`:''}</span><span class="openpill" style="border:0;padding:0">${o.pago?'Pago':'A receber'}<label class="sw"><input type="checkbox" data-act="pago" data-id="${esc(o.id)}" ${o.pago?'checked':''} aria-label="Pedido pago"><i></i></label></span></div></div>
  <div class="sec"><h4>MENSAGENS PRONTAS PARA O WHATSAPP DO CLIENTE</h4>${digits(tel).length>=10?`<div class="wabtns">${['recebido','preparo',o.tipo==='entrega'?'saiu':'pronto','pix','obrigado'].map(wa).join('')}${compU?`<a class="wab" href="${esc(compU)}" target="_blank" rel="noopener">${ic('wa')}Enviar comprovante</a>`:''}</div>`:'<p class="note2" style="margin:0">Telefone do cliente incompleto.</p>'}</div>
  <div class="sec"><h4>HISTÓRICO</h4><ul class="tl">${hist.map(h=>`<li style="--c:${(STS[h.s]||STS.novo)[1]}"><i></i>${(STS[h.s]||STS.novo)[0]}<small>${dmy(h.t)} ${hm(h.t)}</small></li>`).join('')}</ul></div>
  <div class="sec"><h4>COMPROVANTE (${B.cfg.largura||80} MM)</h4><div style="background:var(--psoft);padding:14px;border-radius:12px">${B.receipt(o,B.cfg.largura)}</div></div>
 </div>
 <div class="pdf"><button class="pbtn pri grow" data-act="print" data-id="${esc(o.id)}">${ic('print')}Imprimir</button><button class="pbtn grow" data-act="baixar" data-id="${esc(o.id)}">${ic('dl')}Baixar</button><button class="pbtn grow" data-act="copiar" data-id="${esc(o.id)}">${ic('copy')}Copiar</button>${valid(o)&&o.status!=='concluido'?`<button class="pbtn danger" data-act="cancelar" data-id="${esc(o.id)}">Cancelar</button>`:''}</div>`,o.id);
 const upd=async()=>{const taxa=Math.max(0,+$('#dTaxa').value||0),desc=Math.max(0,+$('#dDesc').value||0);const total=Math.max(0,sub+taxa-desc);$('#dTot').textContent=brl(total);await B.store.patch(o.id,{taxa,desc,total});toast('Total atualizado')};
 $('#dTaxa').onchange=upd;$('#dDesc').onchange=upd}

/* ---------- novo pedido manual ---------- */
function newOrder(){let its=[];const opts=B.P.map(p=>`<option value="${p.k}">${esc(p.n)} · ${brl(B.priceOf(p))}</option>`).join('');const iso=isoD(Date.now());
 openDraw(`<div class="pdh"><div><h2>Novo pedido</h2><div class="note2">Para pedidos que chegam por WhatsApp, Instagram, telefone ou no balcão</div></div><button class="ibtn" data-act="fechar" aria-label="Fechar">${ic('x')}</button></div>
 <form class="pdb frm" id="nof" novalidate>
  <div class="sec"><h4>CLIENTE</h4><label for="nNome">Nome</label><input class="in" id="nNome" required><label for="nTel">WhatsApp</label><input class="in" id="nTel" inputmode="tel" placeholder="(99) 9 0000-0000">
   <label for="nCanal">Pedido feito por</label><select class="in" id="nCanal">${Object.entries(CANAIS).filter(([k])=>k!=='site').map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
  <div class="sec"><h4>ITENS</h4><div style="display:flex;gap:8px"><select class="in" id="nProd">${opts}</select><button type="button" class="pbtn pri" id="nAdd">${ic('plus')}</button></div><div id="nIts"></div></div>
  <div class="sec"><h4>ENTREGA</h4><div class="seg"><label><input type="radio" name="ntipo" value="retirada" checked>Retirada</label><label><input type="radio" name="ntipo" value="entrega">Delivery</label></div>
   <div id="nAddr" class="hide"><label for="nBairro">Bairro</label><select class="in" id="nBairro">${B.BAIRROS.map(b=>`<option>${esc(b)}</option>`).join('')}<option>Outro</option></select><label for="nEnd">Endereço</label><input class="in" id="nEnd"><label for="nTaxa">Taxa de entrega (R$)</label><input class="in" id="nTaxa" type="number" step="0.5" min="0" value="0"></div>
   <label for="nData">Para quando</label><div class="row2"><input class="in" type="date" id="nData" value="${iso}"><input class="in" type="time" id="nHora"></div><p class="note2">Deixe o horário vazio para “o quanto antes”.</p></div>
  <div class="sec"><h4>PAGAMENTO</h4><select class="in" id="nPag"><option>Pix</option><option>Cartão</option><option>Dinheiro</option></select><label for="nDesc">Desconto (R$)</label><input class="in" id="nDesc" type="number" step="0.5" min="0" value="0">
   <label style="display:flex;align-items:center;justify-content:space-between;gap:10px">Já está pago<span class="sw"><input type="checkbox" id="nPago"><i></i></span></label><label for="nObs">Observações</label><textarea class="in" id="nObs"></textarea></div>
 </form>
 <div class="pdf"><div style="flex:1;font:600 20px Fraunces,serif;align-self:center" id="nTot">${brl(0)}</div><button class="pbtn pri" id="nSave">${ic('check')}Registrar pedido</button></div>`);
 const tot=()=>{const s=its.reduce((a,i)=>a+i.p*i.q,0),ent=$('#nof').ntipo.value==='entrega';return Math.max(0,s+(ent?+$('#nTaxa').value||0:0)-(+$('#nDesc').value||0))};
 const draw=()=>{$('#nIts').innerHTML=its.length?its.map((i,x)=>`<div class="itrow"><span><b>${esc(i.n)}</b><br><small class="note2">${brl(i.p)} cada</small></span><span class="qty2"><button type="button" data-nq="${x}" data-d="-1">−</button><span>${i.q}</span><button type="button" data-nq="${x}" data-d="1">+</button></span><b style="text-align:right;font-size:13px">${brl(i.p*i.q)}</b></div>`).join(''):'<p class="note2">Adicione os produtos do pedido.</p>';$('#nTot').textContent=brl(tot())};draw();
 $('#nAdd').onclick=()=>{const p=B.P.find(x=>x.k===$('#nProd').value);const e=its.find(i=>i.k===p.k);if(e)e.q++;else its.push({k:p.k,n:p.n,p:B.priceOf(p),q:1,obs:''});draw()};
 $('#nIts').onclick=e=>{const b=e.target.closest('[data-nq]');if(!b)return;its[+b.dataset.nq].q+=+b.dataset.d;its=its.filter(i=>i.q>0);draw()};
 $('#nof').onchange=()=>{$('#nAddr').classList.toggle('hide',$('#nof').ntipo.value!=='entrega');draw()};$('#nof').oninput=()=>$('#nTot').textContent=brl(tot());
 $('#nSave').onclick=async()=>{const nome=$('#nNome').value.trim();if(nome.length<2)return toast('Informe o nome do cliente');if(!its.length)return toast('Adicione pelo menos um produto');
  const ent=$('#nof').ntipo.value==='entrega',hora=$('#nHora').value,data=$('#nData').value,ag=!!hora&&(data!==iso||true);const sub=its.reduce((a,i)=>a+i.p*i.q,0);
  const o={id:'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),num:newNum(),criado:Date.now(),status:'preparo',canal:$('#nCanal').value,cliente:{nome,tel:$('#nTel').value.trim()},tipo:ent?'entrega':'retirada',endereco:ent?($('#nEnd').value.trim()+' – '+$('#nBairro').value):'',ref:'',quando:hora?'agendado':'agora',data:hora?data:'',hora,pag:$('#nPag').value,troco:'',obs:$('#nObs').value.trim(),itens:its,taxa:ent?+$('#nTaxa').value||0:0,desc:+$('#nDesc').value||0,total:tot(),pago:$('#nPago').checked,hist:[{s:'novo',t:Date.now()},{s:'preparo',t:Date.now()}]};
  await B.store.saveOrder(o);if(B.cfg.estoqueOn){await baixaEstoque(o);await B.store.patch(o.id,{baixa:true})}closeDraw();toast(`Pedido #${o.num} registrado`);page='pedidos';render()}}

/* ---------- AGENDA ---------- */
function vAgenda(){const t0=d0(Date.now());const ag=O().filter(o=>valid(o)&&o.quando==='agendado'&&o.data);const fut=ag.filter(o=>fromIso(o.data)>=t0&&o.status!=='concluido');const atras=ag.filter(o=>fromIso(o.data)<t0&&o.status!=='concluido');
 const by={};fut.forEach(o=>(by[o.data]=by[o.data]||[]).push(o));const keys=Object.keys(by).sort();
 const lbl=k=>{const t=fromIso(k);const diff=Math.round((t-t0)/DAY);return(diff===0?'Hoje':diff===1?'Amanhã':new Date(t).toLocaleDateString('pt-BR',{weekday:'long'}))+' · '+new Date(t).toLocaleDateString('pt-BR',{day:'2-digit',month:'long'})};
 $('#pv').innerHTML=`<div class="pgrid g3" style="margin-bottom:16px"><div class="kp"><small>Encomendas futuras</small><b>${fut.length}</b><div class="dl">${brl(sum(fut))} em pedidos</div></div><div class="kp"><small>Para hoje</small><b>${(by[isoD(t0)]||[]).length}</b></div><div class="kp"><small>Atrasadas (não concluídas)</small><b>${atras.length}</b></div></div>
 ${atras.length?`<div class="agday"><h4>Atrasadas <span class="tag2 bad">${atras.length}</span></h4><div class="pgrid g3">${atras.map(ocard).join('')}</div></div>`:''}
 ${keys.length?keys.map(k=>`<div class="agday"><h4>${lbl(k)} <span class="tag2">${by[k].length} pedido(s) · ${brl(sum(by[k]))}</span></h4><div class="pgrid g3">${by[k].sort((a,b)=>a.hora.localeCompare(b.hora)).map(ocard).join('')}</div></div>`).join(''):`<div class="pcard empty2"><b>Nenhuma encomenda agendada</b>Pedidos agendados pelo site ou registrados com horário aparecem aqui, separados por dia.</div>`}`}

/* ---------- RELATÓRIOS ---------- */
function range(){if(rep.mode==='dia'){const a=fromIso(rep.dia);return[a,a+DAY,'dia']}if(rep.mode==='mes'){const[y,m]=rep.mes.split('-').map(Number);return[new Date(y,m-1,1).getTime(),new Date(y,m,1).getTime(),'mes']}
 const a=fromIso(rep.de),b=fromIso(rep.ate)+DAY;return[Math.min(a,b-DAY),Math.max(b,a+DAY),'per']}
function prevRange([a,b,k]){if(k==='mes'){const d=new Date(a);return[new Date(d.getFullYear(),d.getMonth()-1,1).getTime(),a]}return[a-(b-a),a]}
function vRel(){const[a,b,k]=range();const all=O().filter(o=>o.criado>=a&&o.criado<b);const v=all.filter(valid),canc=all.filter(o=>!valid(o));
 const[pa,pb]=prevRange([a,b,k]);const pv=O().filter(o=>o.criado>=pa&&o.criado<pb&&valid(o));
 const fat=sum(v),pf=sum(pv);const itens=v.reduce((s,o)=>s+(o.itens||[]).reduce((x,i)=>x+(+i.q||0),0),0);
 const grp=f=>{const m={};v.forEach(o=>{const key=f(o);const x=m[key]||(m[key]={n:key,q:0,v:0});x.q++;x.v+=+o.total||0});return Object.values(m).sort((x,y)=>y.v-x.v)};
 const cat={};v.forEach(o=>(o.itens||[]).forEach(i=>{const p=B.P.find(x=>x.k===i.k);const c=p?B.CATS.find(c=>c[0]===p.c)[1]:'Outros';const x=cat[c]||(cat[c]={n:c,q:0,v:0});x.q+=+i.q||0;x.v+=(+i.q||0)*(+i.p||0)}));
 const label=k==='dia'?new Date(a).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):k==='mes'?new Date(a).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}):`${dmy(a)} a ${dmy(b-DAY)}`;
 const cmp=k==='mes'?'mês anterior':k==='dia'?'dia anterior':'período anterior';
 const dd=(x,y)=>{const p=pct(x,y);return p==null?`sem dados do ${cmp}`:`<span class="${p>=0?'up':'down'}">${p>=0?'▲':'▼'} ${Math.abs(p)}%</span> vs. ${cmp}`};
 $('#pv').innerHTML=`<div class="mrow"><div class="stab">${[['dia','Diário'],['mes','Mensal'],['per','Período']].map(([m,l])=>`<button class="${rep.mode===m||(m==='per'&&rep.mode==='per')?'on':''}" data-rm="${m}">${l}</button>`).join('')}</div>
  <div class="chips2">${rep.mode==='dia'?`<input class="in" type="date" id="rDia" value="${rep.dia}" style="width:auto">`:rep.mode==='mes'?`<input class="in" type="month" id="rMes" value="${rep.mes}" style="width:auto">`:`<input class="in" type="date" id="rDe" value="${rep.de}" style="width:auto"><input class="in" type="date" id="rAte" value="${rep.ate}" style="width:auto">`}
  <button class="pbtn" data-act="csv">${ic('dl')}Exportar planilha</button><button class="pbtn" data-act="resumo">${ic('copy')}Copiar resumo</button></div></div>
 <p class="note2 cap1" style="margin:-6px 0 14px">${esc(label)}</p>
 <div class="pgrid g4" style="margin-bottom:16px"><div class="kp hl"><small>Faturamento</small><b>${brl(fat)}</b><div class="dl">${dd(fat,pf)}</div></div><div class="kp"><small>Pedidos</small><b>${v.length}</b><div class="dl">${dd(v.length,pv.length)}</div></div><div class="kp"><small>Ticket médio</small><b>${brl(v.length?fat/v.length:0)}</b><div class="dl">${itens} itens vendidos</div></div><div class="kp"><small>Cancelados</small><b>${canc.length}</b><div class="dl">${brl(sum(canc))} não faturados</div></div></div>
 <div class="pcard" style="margin-bottom:16px"><h3>${k==='dia'?'Vendas por horário':'Vendas por dia'} <small>faturamento</small></h3><div class="chart" id="ch2"></div></div>
 <div class="pgrid g2" style="margin-bottom:16px"><div class="pcard"><h3>Produtos <small>por faturamento</small></h3>${rank(topProd(v).sort((x,y)=>y.v-x.v),'v',10)}</div><div class="pcard"><h3>Categorias <small>por faturamento</small></h3>${rank(Object.values(cat).sort((x,y)=>y.v-x.v),'v',8)}</div></div>
 <div class="pgrid g3">${[['Formas de pagamento',grp(o=>o.pag||'—')],['Retirada x delivery',grp(o=>o.tipo==='entrega'?'Delivery':'Retirada')],['Canais de venda',grp(o=>CANAIS[o.canal||'site'])]].map(([t,arr])=>`<div class="pcard"><h3>${t}</h3>${tbl(arr,fat)}</div>`).join('')}</div>
 <div class="pcard" style="margin-top:16px"><h3>Bairros com mais pedidos <small>delivery, por faturamento</small></h3>${rank(grp(o=>o.tipo==='entrega'?((o.endereco||'').split('–').pop().trim()||'Não informado'):'null').filter(x=>x.n!=='null'),'v',10)}</div>`;
 let series;if(k==='dia'){series=[...Array(24)].map((_,h)=>({l:h+'h',v:sum(v.filter(o=>new Date(o.criado).getHours()===h)),n:v.filter(o=>new Date(o.criado).getHours()===h).length})).slice(8,23)}
 else{const n=Math.round((b-a)/DAY);series=[...Array(n)].map((_,i)=>{const s=a+i*DAY,l=v.filter(o=>o.criado>=s&&o.criado<s+DAY);return{l:new Date(s).toLocaleDateString('pt-BR',{day:'2-digit',month:k==='mes'?undefined:'2-digit'}),v:sum(l),n:l.length}})}
 barChart($('#ch2'),series);
 const set=(id,key)=>{const e=$(id);if(e)e.onchange=()=>{rep[key]=e.value;vRel()}};set('#rDia','dia');set('#rMes','mes');set('#rDe','de');set('#rAte','ate')}
function tbl(arr,tot){if(!arr.length)return'<p class="mute" style="margin:0">Sem dados.</p>';return`<table class="tbl"><tbody>${arr.map(x=>`<tr><td><b>${esc(x.n)}</b><br><span class="note2">${x.q} pedido(s)</span></td><td class="n">${brl(x.v)}<br><span class="note2">${tot?Math.round(x.v/tot*100):0}%</span></td></tr>`).join('')}</tbody></table>`}
async function exportCsv(){const[a,b]=range();const v=O().filter(o=>o.criado>=a&&o.criado<b);const q=s=>`"${String(s??'').replace(/"/g,'""')}"`;
 const rows=[['Pedido','Data','Hora','Cliente','Telefone','Canal','Tipo','Bairro/Endereço','Itens','Pagamento','Pago','Status','Taxa','Desconto','Total'].map(q).join(';'),...v.map(o=>[o.num,dmy(o.criado),hm(o.criado),o.cliente?.nome,o.cliente?.tel,CANAIS[o.canal||'site'],o.tipo,o.endereco,(o.itens||[]).map(i=>i.q+'x '+i.n).join(' | '),o.pag,o.pago?'sim':'não',(STS[o.status]||[''])[0],String(o.taxa||0).replace('.',','),String(o.desc||0).replace('.',','),String((+o.total||0).toFixed(2)).replace('.',',')].map(q).join(';'))];
 const data='﻿'+rows.join('\n');const name=`vendas-bianca-abreu-${rep.mode==='dia'?rep.dia:rep.mode==='mes'?rep.mes:rep.de+'_'+rep.ate}.csv`;
 if(await B.saveFile(name,data,'text/csv;charset=utf-8')){toast('Planilha gerada');return}
 navigator.clipboard?.writeText(data).then(()=>toast('Planilha copiada. Cole no Excel ou Google Planilhas.'),()=>toast('Não foi possível exportar aqui'))}
function resumo(){const[a,b,k]=range();const v=O().filter(o=>o.criado>=a&&o.criado<b&&valid(o));const fat=sum(v);const tp=topProd(v).slice(0,5);
 const t=`*Resumo de vendas · Bianca Abreu Confeitaria*\n${k==='dia'?dmy(a):k==='mes'?new Date(a).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}):dmy(a)+' a '+dmy(b-DAY)}\n\nFaturamento: ${brl(fat)}\nPedidos: ${v.length}\nTicket médio: ${brl(v.length?fat/v.length:0)}\n\n*Mais vendidos*\n${tp.map((x,i)=>`${i+1}. ${x.n}: ${x.q} un (${brl(x.v)})`).join('\n')||'—'}`;
 navigator.clipboard?.writeText(t).then(()=>toast('Resumo copiado para colar no WhatsApp'),()=>toast('Não foi possível copiar'))}

/* ---------- CLIENTES ---------- */
function clientes(){const m={};O().filter(valid).forEach(o=>{const key=digits(o.cliente?.tel)||(o.cliente?.nome||'').toLowerCase();if(!key)return;const c=m[key]||(m[key]={nome:o.cliente?.nome,tel:o.cliente?.tel,n:0,v:0,ult:0,prim:Infinity,bairro:''});c.n++;c.v+=+o.total||0;if(o.criado>c.ult){c.ult=o.criado;c.nome=o.cliente?.nome||c.nome}c.prim=Math.min(c.prim,o.criado);if(o.tipo==='entrega')c.bairro=(o.endereco||'').split('–').pop().trim()});return Object.values(m)}
function vCli(){const all=clientes();const t0=Date.now();const ql=cq.toLowerCase();
 const F={todos:()=>true,fieis:c=>c.n>=3,sumidos:c=>t0-c.ult>30*DAY,novos:c=>t0-c.prim<30*DAY};
 const list=all.filter(F[cfil]).filter(c=>!ql||(c.nome||'').toLowerCase().includes(ql)||digits(c.tel).includes(digits(ql)||'§')).sort((a,b)=>b.v-a.v);
 $('#pv').innerHTML=`<div class="pgrid g4" style="margin-bottom:16px"><div class="kp"><small>Clientes</small><b>${all.length}</b></div><div class="kp"><small>Compraram 3+ vezes</small><b>${all.filter(F.fieis).length}</b></div><div class="kp"><small>Novos (30 dias)</small><b>${all.filter(F.novos).length}</b></div><div class="kp"><small>Sem comprar há 30+ dias</small><b>${all.filter(F.sumidos).length}</b><div class="dl">bom público para uma promoção</div></div></div>
 <div class="mrow"><div class="chips2">${[['todos','Todos'],['fieis','Fiéis'],['novos','Novos'],['sumidos','Sumidos']].map(([k,l])=>`<button class="chip2${cfil===k?' on':''}" data-cf="${k}">${l} <em>${all.filter(F[k]).length}</em></button>`).join('')}</div><label class="psearch">${ic('search')}<input id="cq" type="search" placeholder="Buscar cliente" value="${esc(cq)}" aria-label="Buscar cliente"></label></div>
 ${list.length?`<div class="pcard" style="padding:6px 14px"><table class="tbl stack"><thead><tr><th>Cliente</th><th>Pedidos</th><th class="n">Total gasto</th><th>Último pedido</th><th>Bairro</th><th></th></tr></thead><tbody>${list.slice(0,300).map(c=>{const u=waLink(c.tel,tpl(cfil==='sumidos'?'saudade':'obrigado',{nome:c.nome}));return`<tr><td data-l="Cliente"><b>${esc(c.nome)}</b><br><span class="note2">${esc(c.tel)}</span></td><td data-l="Pedidos">${c.n}</td><td class="n" data-l="Total gasto"><b>${brl(c.v)}</b></td><td data-l="Último pedido">${dmy(c.ult)}<br><span class="note2">${ago(c.ult)}</span></td><td data-l="Bairro">${esc(c.bairro||'Retirada')}</td><td>${u?`<a class="pbtn wa" style="min-height:38px" href="${esc(u)}" target="_blank" rel="noopener">${ic('wa')}${cfil==='sumidos'?'Chamar de volta':'WhatsApp'}</a>`:''}</td></tr>`}).join('')}</tbody></table></div>`:`<div class="pcard empty2"><b>Nenhum cliente aqui</b>Os clientes aparecem automaticamente a partir dos pedidos.</div>`}`;
 const q=$('#cq');q.oninput=()=>{cq=q.value;const p=q.selectionStart;vCli();const n=$('#cq');n.focus();n.setSelectionRange(p,p)}}

/* ---------- ESTOQUE ---------- */
function vEst(){if(!B.cfg.estoqueOn){$('#pv').innerHTML=`<div class="pcard" style="max-width:760px"><h3>Controle de estoque</h3><p>Use o estoque se quiser acompanhar o que tem pronto para vender e os ingredientes principais.</p><ul style="line-height:1.9;padding-left:20px;margin:0 0 16px"><li><b>Produtos prontos</b> (copos, fatias, bombons): ligue ao produto do cardápio e a quantidade baixa sozinha quando você aceita um pedido.</li><li><b>Ingredientes e embalagens</b> (leite Ninho, chocolate, potes): registre entradas e saídas e defina um mínimo.</li><li>Quando algo chega no mínimo, o painel avisa. Se um produto pronto zerar, ele pode ser marcado como esgotado no site automaticamente.</li></ul><button class="pbtn pri" data-act="estOn">${ic('box')}Ativar estoque</button></div>`;return}
 const val=stock.reduce((a,s)=>a+(+s.qtd||0)*(+s.custo||0),0);const lw=low();
 $('#pv').innerHTML=`<div class="pgrid g4" style="margin-bottom:16px"><div class="kp"><small>Itens cadastrados</small><b>${stock.length}</b></div><div class="kp"><small>Abaixo do mínimo</small><b>${lw.length}</b></div><div class="kp"><small>Valor em estoque</small><b>${brl(val)}</b><div class="dl">pelo custo informado</div></div><div class="kp"><small>Ligados ao cardápio</small><b>${stock.filter(s=>s.k).length}</b><div class="dl">baixa automática</div></div></div>
 <div class="mrow"><p class="note2" style="margin:0">A baixa automática acontece quando você aceita o pedido.</p><button class="pbtn pri" data-act="itemNovo">${ic('plus')}Novo item</button></div>
 ${stock.length?`<div class="pcard" style="padding:6px 14px"><table class="tbl stack"><thead><tr><th>Item</th><th>Tipo</th><th class="n">Quantidade</th><th class="n">Mínimo</th><th>Cardápio</th><th></th></tr></thead><tbody>${[...stock].sort((a,b)=>((+a.qtd<=+a.min)?0:1)-((+b.qtd<=+b.min)?0:1)||a.nome.localeCompare(b.nome)).map(s=>{const isLow=(+s.min||0)>0&&(+s.qtd||0)<=(+s.min||0);const p=B.P.find(x=>x.k===s.k);return`<tr class="${isLow?'stock-low':''}"><td data-l="Item"><b>${esc(s.nome)}</b>${isLow?' <span class="tag2 bad">Baixo</span>':''}</td><td data-l="Tipo">${s.tipo==='produto'?'Produto pronto':'Ingrediente/embalagem'}</td><td class="n" data-l="Quantidade"><b>${fmtQ(s.qtd)}</b> ${esc(s.un)}</td><td class="n" data-l="Mínimo">${fmtQ(s.min)} ${esc(s.un)}</td><td data-l="Cardápio">${p?esc(p.n):'—'}</td><td><div class="chips2" style="justify-content:flex-end"><button class="pbtn" style="min-height:38px" data-st="${esc(s.id)}" data-sm="entrada">${ic('up')}Entrada</button><button class="pbtn" style="min-height:38px" data-st="${esc(s.id)}" data-sm="saida">${ic('down')}Saída</button><button class="ibtn" style="width:38px;height:38px" data-st="${esc(s.id)}" data-sm="editar" aria-label="Editar">${ic('edit')}</button></div></td></tr>`}).join('')}</tbody></table></div>`:`<div class="pcard empty2"><b>Nenhum item ainda</b>Cadastre o primeiro item em “Novo item”.</div>`}`}
function itemForm(s){const it=s||{id:'e'+Date.now().toString(36),nome:'',tipo:'produto',un:'un',qtd:0,min:0,custo:0,k:'',por:1,movs:[]};
 openDraw(`<div class="pdh"><h2>${s?'Editar item':'Novo item'}</h2><button class="ibtn" data-act="fechar" aria-label="Fechar">${ic('x')}</button></div>
 <div class="pdb frm"><div class="sec"><label for="eNome">Nome</label><input class="in" id="eNome" value="${esc(it.nome)}" placeholder="Ex.: Copo Ninho Duplo pronto, Leite Ninho 750 g">
 <label for="eTipo">Tipo</label><select class="in" id="eTipo"><option value="produto" ${it.tipo==='produto'?'selected':''}>Produto pronto para venda</option><option value="insumo" ${it.tipo!=='produto'?'selected':''}>Ingrediente ou embalagem</option></select>
 <div class="row2"><div><label for="eUn">Unidade</label><select class="in" id="eUn">${['un','kg','g','L','ml','cx','pct','lata'].map(u=>`<option ${it.un===u?'selected':''}>${u}</option>`).join('')}</select></div><div><label for="eCusto">Custo por unidade (R$)</label><input class="in" id="eCusto" type="number" step="0.01" min="0" value="${+it.custo||0}"></div></div>
 <div class="row2"><div><label for="eQtd">Quantidade atual</label><input class="in" id="eQtd" type="number" step="0.001" value="${+it.qtd||0}"></div><div><label for="eMin">Avisar quando chegar em</label><input class="in" id="eMin" type="number" step="0.001" min="0" value="${+it.min||0}"></div></div></div>
 <div class="sec"><h4>BAIXA AUTOMÁTICA (OPCIONAL)</h4><label for="eK">Produto do cardápio que consome este item</label><select class="in" id="eK"><option value="">Nenhum</option>${B.P.map(p=>`<option value="${p.k}" ${it.k===p.k?'selected':''}>${esc(p.n)}</option>`).join('')}</select>
 <label for="ePor">Quantidade usada por unidade vendida</label><input class="in" id="ePor" type="number" step="0.001" min="0" value="${+it.por||1}"><p class="note2">Ex.: 1 un para produto pronto; 0,08 kg de Ninho por copo.</p></div>
 ${(it.movs||[]).length?`<div class="sec"><h4>ÚLTIMAS MOVIMENTAÇÕES</h4>${it.movs.slice(0,12).map(m=>`<div class="line2"><span>${dmy(m.t)} ${hm(m.t)} · ${esc(m.tipo)}${m.obs?` <span class="note2">${esc(m.obs)}</span>`:''}</span><span class="${m.q>=0?'up':'down'}">${m.q>=0?'+':''}${fmtQ(m.q)} ${esc(it.un)}</span></div>`).join('')}</div>`:''}</div>
 <div class="pdf">${s?`<button class="pbtn danger" data-act="itemDel" data-id="${esc(it.id)}">${ic('trash')}Excluir</button>`:''}<button class="pbtn pri grow" id="eSave">${ic('check')}Salvar item</button></div>`);
 $('#eSave').onclick=async()=>{const nome=$('#eNome').value.trim();if(!nome)return toast('Dê um nome ao item');const q=+$('#eQtd').value||0;const n={...it,nome,tipo:$('#eTipo').value,un:$('#eUn').value,custo:+$('#eCusto').value||0,min:+$('#eMin').value||0,k:$('#eK').value,por:+$('#ePor').value||1};
  if(q!==(+it.qtd||0)){n.movs=[{t:Date.now(),q:q-(+it.qtd||0),tipo:s?'ajuste':'saldo inicial',obs:''},...(it.movs||[])].slice(0,40)}n.qtd=q;await saveItem(n);closeDraw();toast('Item salvo');render()}}
function movForm(s,tipo){openDraw(`<div class="pdh"><h2>${tipo==='entrada'?'Entrada':'Saída'} · ${esc(s.nome)}</h2><button class="ibtn" data-act="fechar" aria-label="Fechar">${ic('x')}</button></div>
 <div class="pdb frm"><div class="sec"><p style="margin:0">Saldo atual: <b>${fmtQ(s.qtd)} ${esc(s.un)}</b></p><label for="mQ">Quantidade (${esc(s.un)})</label><input class="in" id="mQ" type="number" step="0.001" min="0" autofocus>
 <label for="mObs">Motivo</label><select class="in" id="mObs">${(tipo==='entrada'?['Compra','Produção','Devolução','Outro']:['Uso na produção','Perda / vencimento','Venda no balcão','Outro']).map(x=>`<option>${x}</option>`).join('')}</select></div></div>
 <div class="pdf"><button class="pbtn pri grow" id="mSave">${ic('check')}Registrar ${tipo}</button></div>`);
 $('#mSave').onclick=async()=>{const q=+$('#mQ').value;if(!(q>0))return toast('Informe a quantidade');await mov(s,tipo==='entrada'?q:-q,tipo,$('#mObs').value);closeDraw();toast('Movimentação registrada');render()}}

/* ---------- CARDÁPIO / FOTOS / CONFIG ---------- */
function vCard(){const P=B.P;$('#pv').innerHTML=`<p class="note2" style="margin:-8px 0 14px">Desligue o que acabou hoje, ajuste preços e escreva descrições. Tudo aparece na hora no site.</p>
 <div class="pcard" style="padding:6px 14px"><table class="tbl stack"><thead><tr><th>Produto</th><th>Descrição</th><th class="n">Preço (R$)</th><th>Disponível</th></tr></thead><tbody>${P.map(p=>`<tr><td data-l="Produto"><div style="display:flex;gap:10px;align-items:center"><span class="media" style="width:46px;height:46px;border-radius:10px;flex:none">${B.img(p.k,p.n)}</span><span><b>${esc(p.n)}</b><br><span class="note2">${esc(B.CATS.find(c=>c[0]===p.c)[1])}</span></span></div></td><td data-l="Descrição"><textarea class="in" rows="2" style="min-height:60px;font-size:14px" data-desc="${p.k}" placeholder="Escreva uma descrição apetitosa">${esc(B.descOf(p))}</textarea></td><td class="n" data-l="Preço"><input class="in pricein" type="number" step="0.5" min="0" data-price="${p.k}" value="${B.priceOf(p)}" aria-label="Preço de ${esc(p.n)}"></td><td data-l="Disponível"><label class="sw"><input type="checkbox" data-av="${p.k}" ${B.isOut(p)?'':'checked'} aria-label="${esc(p.n)} disponível"><i></i></label></td></tr>`).join('')}</tbody></table></div>`}
function vFotos(){$('#pv').innerHTML=`<div class="pcard" style="margin-bottom:16px"><p class="mute" style="margin:0 0 14px">Toque em “Trocar foto” para atualizar qualquer imagem do site. Para colocar várias de uma vez, importe um pacote de fotos (.json).</p><label class="pbtn" style="cursor:pointer">Importar pacote de fotos (.json)<input type="file" id="fPack" accept=".json,application/json" hidden></label><p class="note" id="fMsg"></p></div><div class="fgrid" id="fgrid"></div>`;B.renderFotos()}
function vCfg(){const c=B.cfg,px=c.px||{},pk=c.pix||{},tp=c.tpl||{};
 $('#pv').innerHTML=`<div class="pgrid g2">
 <div class="pcard frm"><h3>Loja e impressão</h3>
  <div class="line2" style="align-items:center"><span><b>Recebendo pedidos pelo site</b><br><span class="note2">Desligado: o site só aceita encomendas agendadas.</span></span><label class="sw"><input type="checkbox" data-act="aberto" ${c.aberto?'checked':''}><i></i></label></div>
  <label for="cW">Largura da impressora térmica</label><select class="in" id="cW"><option value="80" ${c.largura!=58?'selected':''}>80 mm</option><option value="58" ${c.largura==58?'selected':''}>58 mm</option></select>
  <div class="line2" style="align-items:center;margin-top:12px"><span><b>Imprimir ao aceitar pedido</b><br><span class="note2">Abre a impressão automaticamente.</span></span><label class="sw"><input type="checkbox" id="cAuto" ${c.auto?'checked':''}><i></i></label></div>
  <p class="note2" style="margin-top:12px">Funciona com impressoras térmicas instaladas no computador (Elgin, Bematech, Epson e similares). No Android, use o app RawBT com impressora Bluetooth.</p></div>
 <div class="pcard frm"><h3>Pix</h3><p class="note2" style="margin:0">Com a chave preenchida, o cliente que escolhe Pix recebe o código copia e cola com o valor exato. Você também pode enviar pelo detalhe do pedido.</p>
  <label for="cPix">Chave Pix</label><input class="in" id="cPix" value="${esc(pk.chave)}" placeholder="CNPJ, telefone, e-mail ou aleatória"><div class="row2"><div><label for="cPixN">Nome do recebedor</label><input class="in" id="cPixN" maxlength="25" value="${esc(pk.nome||'BIANCA ABREU')}"></div><div><label for="cPixC">Cidade</label><input class="in" id="cPixC" maxlength="15" value="${esc(pk.cidade||'CODO')}"></div></div></div>
 <div class="pcard frm"><h3>Estoque</h3><div class="line2" style="align-items:center"><span><b>Usar controle de estoque</b></span><label class="sw"><input type="checkbox" data-act="estoque" ${c.estoqueOn?'checked':''}><i></i></label></div>
  <div class="line2" style="align-items:center;margin-top:8px"><span><b>Marcar esgotado no site quando zerar</b><br><span class="note2">Só para itens ligados a um produto.</span></span><label class="sw"><input type="checkbox" id="cAutoEsg" ${c.autoEsgot?'checked':''}><i></i></label></div></div>
 <div class="pcard frm"><h3>Acesso</h3><label for="cPin">Novo PIN (4 a 6 números)</label><input class="in pin" id="cPin" inputmode="numeric" maxlength="6" autocomplete="off"><button class="pbtn pri" id="cPinSave" style="margin-top:12px">Salvar PIN</button></div>
 <div class="pcard frm" style="grid-column:1/-1"><h3>Mensagens de WhatsApp <small>use {nome}, {num}, {total} e {pix}</small></h3><div class="pgrid g2">${Object.entries({recebido:'Pedido recebido',preparo:'Em preparo',saiu:'Saiu para entrega',pronto:'Pronto para retirada',pix:'Envio do Pix',obrigado:'Agradecimento e avaliação',saudade:'Cliente sumido'}).map(([k,l])=>`<div><label for="t-${k}">${l}</label><textarea class="in" id="t-${k}" data-tpl="${k}" rows="3">${esc(tp[k]||TPL[k])}</textarea></div>`).join('')}</div></div>
 <div class="pcard frm"><h3>Anúncios e métricas</h3><p class="note2" style="margin:0">IDs das contas da loja. O site registra visitas, itens na sacola e pedidos concluídos.</p><div class="row2"><div><label for="pxM">Pixel da Meta</label><input class="in" id="pxM" data-px="meta" value="${esc(px.meta)}"></div><div><label for="pxG">Google Analytics 4</label><input class="in" id="pxG" data-px="ga4" value="${esc(px.ga4)}" placeholder="G-…"></div></div><div class="row2"><div><label for="pxA">Google Ads</label><input class="in" id="pxA" data-px="ads" value="${esc(px.ads)}" placeholder="AW-…"></div><div><label for="pxT">Pixel do TikTok</label><input class="in" id="pxT" data-px="tiktok" value="${esc(px.tiktok)}"></div></div></div>
 <div class="pcard"><h3>Dados de demonstração</h3><p class="note2" style="margin:0 0 12px">Gera pedidos fictícios dos últimos 45 dias para mostrar relatórios e clientes. Eles ficam marcados e podem ser apagados.</p><div class="chips2"><button class="pbtn" data-act="demo">Gerar pedidos de exemplo</button><button class="pbtn danger" data-act="demoDel">Apagar pedidos de exemplo</button></div><p class="note2" id="demoMsg"></p></div>
 </div>`}

/* ---------- demonstração ---------- */
async function demo(){const msg=$('#demoMsg');const nomes=['Ana Clara Sousa','Marcos Vinícius','Larissa Costa','João Pedro Lima','Fernanda Ribeiro','Camila Santos','Rafaela Moura','Pedro Henrique','Juliana Alves','Thiago Mendes','Bruna Oliveira','Lucas Martins','Gabriela Rocha','Mateus Silva','Isabela Araújo','Renata Barros'];
 const w={vulcaoPremium:3,vulcaoG:3,vulcaoM:5,copoNinho:7,copoBrigadeiro:6,copoOuroBranco:4,copudim:4,copoMaracuja:3,copoAbacaxi:2,fatiaRedVelvet:4,fatiaNinhoNutella:4,fatiaChocoblack:3,fatiaChocolatuda:3,fatiaPrestigio:2,bombomMorango:5,bombomUva:3,coxinhaNutella:4,trufa:3,pudim:2,sacola:2,cartinha:2,topo:1,sprite:1,guarana:2,coca:2};
 const bag=Object.entries(w).flatMap(([k,n])=>Array(n).fill(k));const r=n=>Math.floor(Math.random()*n);const pagos=['Pix','Pix','Pix','Cartão','Cartão','Dinheiro'];const canais=['site','site','site','whatsapp','whatsapp','instagram','balcao'];
 let num=newNum();const now=Date.now();const list=[];
 for(let d=44;d>=0;d--){const dt=new Date(now-d*DAY);if(dt.getDay()===1)continue;const n=2+r(d<7?6:5)+(dt.getDay()===6||dt.getDay()===0?2:0);
  for(let j=0;j<n;j++){const t=new Date(dt);t.setHours(13+r(6),r(60),0,0);if(t.getTime()>now)continue;const its=[];const ni=1+r(3);for(let x=0;x<ni;x++){const pk=bag[r(bag.length)];const p=B.P.find(x=>x.k===pk);const e=its.find(i=>i.k===p.k);if(e)e.q++;else its.push({k:p.k,n:p.n,p:B.priceOf(p),q:1+(Math.random()<.2?1:0),obs:''})}
   const nm=nomes[r(nomes.length)];const ent=Math.random()<.55;const sub=its.reduce((a,i)=>a+i.p*i.q,0);const taxa=ent&&sub<30?5:0;const recent=d===0&&j>=n-3;const status=recent?['novo','preparo','pronto'][j%3]:(Math.random()<.05?'cancelado':'concluido');
   list.push({id:'demo'+t.getTime().toString(36)+j,num:num++,criado:t.getTime(),status,demo:true,canal:canais[r(canais.length)],cliente:{nome:nm,tel:'(99) 98'+String(100+nomes.indexOf(nm)).padStart(3,'0')+'-'+String(1000+nomes.indexOf(nm)*37).slice(0,4)},tipo:ent?'entrega':'retirada',endereco:ent?'Rua Exemplo, '+(10+r(900))+' – '+B.BAIRROS[r(B.BAIRROS.length)]:'',ref:'',quando:Math.random()<.12?'agendado':'agora',data:'',hora:'',pag:pagos[r(pagos.length)],troco:'',obs:'',itens:its,taxa,desc:0,total:sub+taxa,pago:status==='concluido'||Math.random()<.4,hist:[{s:'novo',t:t.getTime()}]})}}
 const fut=[1,2,2,4,6];fut.forEach((dd,i)=>{const t=now-3600e3*(i+1);const p=B.P.find(x=>x.k===['vulcaoPremium','vulcaoG','vulcaoM','fatiaRedVelvet','copoNinho'][i]);const dataF=isoD(now+dd*DAY);
  list.push({id:'demoag'+i+now.toString(36),num:num++,criado:t,status:'preparo',demo:true,canal:'whatsapp',cliente:{nome:nomes[i+3],tel:'(99) 98'+String(103+i).padStart(3,'0')+'-'+String(1000+(i+3)*37).slice(0,4)},tipo:i%2?'entrega':'retirada',endereco:i%2?'Rua Exemplo, 45 – Centro':'',ref:'',quando:'agendado',data:dataF,hora:['14:00','15:30','16:00','17:00','18:00'][i],pag:'Pix',troco:'',obs:i===0?'Escrever “Feliz aniversário, Ana” no topo':'',itens:[{k:p.k,n:p.n,p:B.priceOf(p),q:1+(i%2),obs:''}],taxa:0,desc:0,total:B.priceOf(p)*(1+(i%2)),pago:i%2===0,hist:[{s:'novo',t},{s:'preparo',t:t+600e3}]})});
 let c=0;bulk=true;for(const o of list){await B.store.saveOrder(o);if(++c%10===0&&msg)msg.textContent=`Gerando ${c} de ${list.length}…`}bulk=false;if(msg)msg.textContent=`${list.length} pedidos de exemplo criados.`;toast('Dados de exemplo prontos')}
async function demoDel(){const l=O().filter(o=>o.demo);bulk=true;for(const o of l)await B.store.del(o.id);bulk=false;toast(`${l.length} pedidos de exemplo apagados`);render()}

/* ---------- eventos ---------- */
root.addEventListener('click',async e=>{const t=e.target.closest('[data-go],[data-act],[data-mv],[data-o],[data-of],[data-cf],[data-rm],[data-st]');if(!t||!authed)return;
 if(t.dataset.go){e.preventDefault();page=t.dataset.go;closeDraw();render();return}
 if(t.dataset.mv){e.stopPropagation();const o=O().find(x=>x.id===t.dataset.mv);if(o){await patch(o,{},t.dataset.to);toast(`#${o.num}: ${(STS[t.dataset.to]||[''])[0]}`);if($('#pdraw.on'))showOrder(o.id)}return}
 if(t.dataset.of){ofil=t.dataset.of;vPedidos();return}if(t.dataset.cf){cfil=t.dataset.cf;vCli();return}if(t.dataset.rm){rep.mode=t.dataset.rm;vRel();return}
 if(t.dataset.st){const s=stock.find(x=>x.id===t.dataset.st);if(!s)return;t.dataset.sm==='editar'?itemForm(s):movForm(s,t.dataset.sm);return}
 if(t.dataset.o&&!t.dataset.act){showOrder(t.dataset.o);return}
 const a=t.dataset.act,id=t.dataset.id,o=id&&O().find(x=>x.id===id);
 if(a==='fechar')closeDraw();
 if(a==='novo')newOrder();
 if(a==='site')location.hash='inicio';
 if(a==='sair'){authed=false;location.hash='inicio'}
 if(a==='som'){try{actx=actx||new AudioContext();soundOn=!soundOn;if(soundOn)ding();toast(soundOn?'Som de novo pedido ligado':'Som desligado')}catch(x){toast('Som indisponível neste navegador')}render()}
 if(a==='mais'){openDraw(`<div class="pdh"><h2>Menu</h2><button class="ibtn" data-act="fechar" aria-label="Fechar">${ic('x')}</button></div><div class="pdb">${PAGES.map(([k,l,i])=>`<button class="pbtn" style="justify-content:flex-start" data-go="${k}">${ic(i)}${l}</button>`).join('')}<button class="pbtn" style="justify-content:flex-start" data-act="site">${ic('eye')}Ver o site</button><button class="pbtn" style="justify-content:flex-start" data-act="sair">${ic('out')}Sair</button></div>`)}
 if(o&&a==='print')B.printOrder(o);if(o&&a==='baixar')B.downloadReceipt(o);
 if(o&&a==='copiar')navigator.clipboard?.writeText(B.waText(o)).then(()=>toast('Comprovante copiado'),()=>toast('Não foi possível copiar'));
 if(o&&a==='cancelar'){if(t.dataset.ok){await patch(o,{},'cancelado');closeDraw();toast(`Pedido #${o.num} cancelado`);render()}else{t.dataset.ok='1';t.textContent='Confirmar cancelamento';t.classList.add('pri');setTimeout(()=>{if(t.isConnected){delete t.dataset.ok;t.textContent='Cancelar';t.classList.remove('pri')}},4000)}}
 if(a==='csv')exportCsv();if(a==='resumo')resumo();
 if(a==='estOn'){B.cfg.estoqueOn=true;await B.store.saveCfg();stockSub();render()}
 if(a==='itemNovo')itemForm();
 if(a==='itemDel'){const s=stock.find(x=>x.id===id);if(s){if(t.dataset.ok){await delItem(s);closeDraw();toast('Item excluído');render()}else{t.dataset.ok='1';t.textContent='Confirmar exclusão'}}}
 if(a==='demo'){t.disabled=true;await demo();t.disabled=false;render()}if(a==='demoDel'){await demoDel()}
});
root.addEventListener('change',async e=>{const t=e.target;if(!authed)return;const c=B.cfg;
 if(t.dataset.act==='aberto'){c.aberto=t.checked;await B.store.saveCfg();toast(t.checked?'Recebendo pedidos':'Pedidos pausados');render();return}
 if(t.dataset.act==='pago'){const o=O().find(x=>x.id===t.dataset.id);if(o){await B.store.patch(o.id,{pago:t.checked});toast(t.checked?'Marcado como pago':'Marcado como a receber')}return}
 if(t.dataset.act==='estoque'){c.estoqueOn=t.checked;await B.store.saveCfg();if(t.checked)stockSub();return}
 if(t.dataset.av){c.esgot=(c.esgot||[]).filter(x=>x!==t.dataset.av);if(!t.checked)c.esgot.push(t.dataset.av);await B.store.saveCfg();toast(t.checked?'Disponível no site':'Marcado como esgotado');return}
 if(t.dataset.desc!=null&&t.dataset.desc){c.descs={...(c.descs||{}),[t.dataset.desc]:t.value.trim()};await B.store.saveCfg();toast('Descrição salva');return}
 if(t.dataset.price){const v=parseFloat(t.value);if(v>=0){c.precos={...c.precos,[t.dataset.price]:v};await B.store.saveCfg();toast('Preço atualizado')}return}
 if(t.dataset.px){c.px={...(c.px||{}),[t.dataset.px]:t.value.trim()};await B.store.saveCfg();toast('ID salvo');return}
 if(t.dataset.tpl){c.tpl={...(c.tpl||{}),[t.dataset.tpl]:t.value};await B.store.saveCfg();toast('Mensagem salva');return}
 if(['cPix','cPixN','cPixC'].includes(t.id)){c.pix={chave:$('#cPix').value.trim(),nome:$('#cPixN').value.trim()||'BIANCA ABREU',cidade:$('#cPixC').value.trim()||'CODO'};await B.store.saveCfg();toast('Pix salvo');return}
 if(t.id==='cW'){c.largura=+t.value;await B.store.saveCfg();toast('Impressora atualizada')}
 if(t.id==='cAuto'){c.auto=t.checked;await B.store.saveCfg()}
 if(t.id==='cAutoEsg'){c.autoEsgot=t.checked;await B.store.saveCfg()}});
document.addEventListener('click',e=>{if(e.target.id==='pscrim')closeDraw();if(e.target.closest('#cPinSave')){const v=$('#cPin').value.trim();if(!/^\d{4,6}$/.test(v))return toast('Use de 4 a 6 números');B.cfg.pin=v;B.store.saveCfg();$('#cPin').value='';toast('PIN atualizado')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDraw()});
setInterval(()=>{if(authed&&location.hash==='#painel'&&['inicio','pedidos','agenda'].includes(page)&&!$('#pdraw.on'))render()},60000);

window.BAPanel={render,ding,onNew(ids){ids.forEach(i=>freshIds.add(i));ding();const n=O().filter(o=>o.status==='novo').length;document.title=n?`(${n}) Novo pedido · Bianca Abreu`:'Bianca Abreu Confeitaria';if(authed&&location.hash==='#painel'&&!$('#pdraw.on'))render();else if(authed)toast('Novo pedido recebido')}};
if(location.hash==='#painel')render();
})();
