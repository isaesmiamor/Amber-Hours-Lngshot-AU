const $=s=>document.querySelector(s), sleep=ms=>new Promise(r=>setTimeout(r,ms));
const col={Rina:'#ec4899',Dimas:'#3b82f6',Sera:'#a855f7',Jaya:'#f59e0b'};
const light=['lock','home','x'];

/* ---------- util ---------- */
function tick(){
  const t = "14:00"; // Dikunci di jam 9 pagi
  const dName = "Sunday"; // Kamu bisa ganti harinya manual kalau mau
  const dNum = "1";
  const dFull = "Sunday, November 1";

  // Update teks di status bar overlay dan lockscreen
  document.querySelectorAll('.clk').forEach(e => e.textContent = t);
  if($('#ltime')) $('#ltime').textContent = t;
  if($('#ldate')) $('#ldate').textContent = dFull;
  if($('#cday')) $('#cday').textContent = dName;
  if($('#cnum')) $('#cnum').textContent = dNum;
}
tick();

function show(id){
  document.querySelectorAll('.scr').forEach(e=>e.classList.add('hidden'));
  document.querySelectorAll('.ban').forEach(e=>e.remove());
  $('#'+id).classList.remove('hidden');
  $('#ov').className='absolute inset-0 z-40 pointer-events-none '+(light.includes(id)?'text-white':'text-black');
}
function banner(o){
  const b=document.createElement('div');
  b.className='ban absolute top-12 inset-x-3 z-[60] bg-white/90 backdrop-blur-xl rounded-3xl p-3 flex gap-3 items-center shadow-2xl cursor-pointer transition-transform duration-500 -translate-y-40 text-black';
  b.innerHTML=`<div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white shrink-0" style="background:${o.bg}">${o.icon}</div>
  <div class="min-w-0 flex-1"><div class="flex justify-between text-[11px] text-gray-500 uppercase"><span>${o.app}</span><span>now</span></div>
  <div class="text-sm font-semibold truncate">${o.title}</div><div class="text-sm text-gray-600 truncate">${o.text}</div></div>`;
  $('#phone').append(b);
  requestAnimationFrame(()=>requestAnimationFrame(()=>b.classList.remove('-translate-y-40')));
  b.onclick=()=>{b.remove();o.go()};
}
const imsg=(title,text,go)=>banner({icon:'💬',bg:'#34c759',app:'Messages',title,text,go});

/* ---------- 1. LOCK ---------- */
let y0=0;
$('#lock').onpointerdown=e=>y0=e.clientY;
$('#lock').onpointerup=e=>{if(y0-e.clientY>60)goHome()};
$('#hint').onclick=goHome;
$('#torch').onclick=e=>{
  const b=e.currentTarget;
  b.classList.toggle('bg-black/30');
  b.classList.toggle('bg-white');
  b.classList.toggle('text-black');
};

/* ---------- 2. HOME ---------- */
/* ▼▼▼ MULAI: IKON BARU ▼▼▼ */
const ICON_NOTES=`<div class="relative w-16 h-16 overflow-hidden rounded-[1.1rem]">
  <div class="h-5 bg-[#ff9f0a]"></div>
  <div class="absolute inset-x-0 top-5 bottom-0" style="background:repeating-linear-gradient(#fff 0 8px,#e5e5ea 8px 9px)"></div>
  <svg viewBox="0 0 24 24" class="absolute bottom-0.5 right-0.5 w-8 h-8"><g transform="rotate(45 12 12)"><rect x="10" y="2" width="4" height="14" fill="#ffd60a"/><rect x="10" y="2" width="4" height="3" fill="#ff6b81"/><path d="M10 16h4l-2 5z" fill="#f2d3a0"/><path d="M11.2 19h1.6l-.8 2z" fill="#333"/></g></svg></div>`;
const PET=['#ff453a','#ff9f0a','#ffd60a','#30d158','#64d2ff','#0a84ff','#bf5af2','#ff375f'];
const ICON_PHOTOS=`<svg viewBox="0 0 100 100" class="w-14 h-14">${PET.map((c,i)=>`<ellipse cx="50" cy="29" rx="13" ry="21" fill="${c}" transform="rotate(${i*45} 50 50)" style="mix-blend-mode:multiply" opacity=".9"/>`).join('')}</svg>`;
const ICON_CAMERA=`<svg viewBox="0 0 48 48" class="w-14 h-14"><path d="M16 12l2-3h12l2 3h6a4 4 0 014 4v18a4 4 0 01-4 4H10a4 4 0 01-4-4V16a4 4 0 014-4z" fill="#1c1c1e"/><circle cx="24" cy="25" r="9.5" fill="#3a3a3c"/><circle cx="24" cy="25" r="6.5" fill="#0a0a0c"/><circle cx="21.5" cy="22.5" r="1.8" fill="#6a6aa0"/><circle cx="38" cy="17" r="1.5" fill="#ff9f0a"/></svg>`;
/* ▲▲▲ SELESAI: IKON BARU ▲▲▲ */
const apps = [
  ['Notes', ICON_NOTES, '#ffffff'],
  ['Gallery', ICON_PHOTOS, '#ffffff'],
  ['Mail', '<i class="bi bi-envelope-fill text-white text-4xl"></i>', 'linear-gradient(180deg, #54a3ff 0%, #007aff 100%)'],
  ['Camera', ICON_CAMERA, 'linear-gradient(180deg, #e5e5ea 0%, #a2a2a9 100%)'],
  ['Instagram', '<i class="bi bi-instagram text-white text-4xl"></i>', 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aebe6 90%)'],
  ['X', '<i class="bi bi-twitter-x text-white text-4xl"></i>', '#000000']
];
const dockApps = [
  ['Phone', '<i class="bi bi-telephone-fill text-white text-2xl"></i>', 'linear-gradient(180deg, #63dd76 0%, #34c759 100%)'],
  ['Chrome', '<i class="bi bi-google text-blue-500 text-2xl"></i>', 'linear-gradient(180deg, #ffffff 0%, #e5e5ea 100%)'],
  ['SMS', '<i class="bi bi-chat-fill text-white text-4xl"></i>', 'linear-gradient(180deg, #4cd964 0%, #34c759 100%)'],
  ['Music', '<i class="bi bi-music-note text-white text-4xl"></i>', 'linear-gradient(180deg, #ff647c 0%, #ff2d55 100%)']
];
const ic=(a,l)=>`<div class="flex flex-col items-center gap-1"><div class="w-16 h-16 rounded-[1.1rem] flex items-center justify-center text-3xl text-white shadow-md" style="background:${a[2]}">${a[1]}</div>${l?`<span class="text-[11px]">${a[0]}</span>`:''}</div>`;
$('#grid').innerHTML=apps.map(a=>ic(a,1)).join('');
$('#dock').innerHTML=dockApps.map(a=>ic(a,0)).join('');
function goHome(){
  show('home');
  setTimeout(()=>imsg('jingga new member','Diaz: kak mila kak asya serius hari ini?',groupChat),700);
}

/* ---------- 3/6. CHAT ENGINE ---------- */
const kbRows=['qwertyuiop','asdfghjkl','zxcvbnm'];
const KC='relative h-11 bg-white rounded-md shadow-[0_1px_0_rgba(0,0,0,.3)] flex items-center justify-center text-[22px] ';
const keyHTML=k=>`<div data-k="${k}" class="${KC}flex-1"><span class="lbl">${k}</span><span class="pop hidden absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-14 bg-white rounded-xl shadow-xl text-3xl items-center justify-center z-10">${k}</span></div>`;
const SP='relative h-11 rounded-md bg-[#adb3bc] shadow-[0_1px_0_rgba(0,0,0,.3)] flex items-center justify-center shrink-0 ';
const shiftKey=`<div id="k-shift" class="${SP}w-11"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 4l8 9h-5v7H9v-7H4z"/></svg></div>`;
const delKey=`<div id="k-del" class="${SP}w-11"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M9 5h11a1 1 0 011 1v12a1 1 0 01-1 1H9l-6-7z"/><path d="M12 9.5l5 5m0-5l-5 5" stroke-linecap="round"/></svg></div>`;

async function chat(title,names,script,group,done){
  show('chat');
  const av=group?'👥':title[0];
  let caps=false;
  $('#chat').innerHTML=`<div class="flex flex-col h-full">
   <div class="pt-14 pb-2 bg-gray-100/95 border-b flex flex-col items-center relative">
     <span class="absolute left-3 top-16 text-[#0a84ff] text-3xl leading-none">‹</span>
          ${group?'<div class="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl">👥</div>':avaHTML(title,'w-12 h-12')}
     <div class="text-xs mt-1">${title} <span class="text-gray-400">›</span></div>
     ${group?`<div class="text-[10px] text-gray-400">${names.join(', ')}</div>`:''}</div>
   <div id="msgs" class="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5"><div class="text-center text-[11px] text-gray-400 mb-2">iMessage · Today</div></div>
   <div class="px-3 py-2 flex gap-2 items-end">
     <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl shrink-0">+</div>
     <div class="flex-1 min-h-[34px] border border-gray-300 rounded-[18px] pl-4 pr-[3px] py-[3px] flex items-center gap-2">
       <div id="inp" class="flex-1 text-[13px] overflow-hidden whitespace-nowrap"></div>
       <div id="snd" class="w-7 h-7 rounded-full bg-[#0a84ff] text-white flex items-center justify-center shrink-0 transition opacity-0 scale-75"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V5M5 12l7-7 7 7"/></svg></div>
     </div></div>
   <div id="sp" class="transition-all duration-500" style="height:0"></div></div>
   <div id="kb" class="absolute bottom-0 inset-x-0 h-[220px] bg-[#d1d3d9] px-1 pt-2.5 transition-transform duration-500 translate-y-full z-30">
     <div class="flex gap-1 mb-2.5">${[...kbRows[0]].map(keyHTML).join('')}</div>
     <div class="flex gap-1 mb-2.5 px-4">${[...kbRows[1]].map(keyHTML).join('')}</div>
     <div class="flex gap-1.5 mb-2.5">${shiftKey}<div class="flex flex-1 gap-1">${[...kbRows[2]].map(keyHTML).join('')}</div>${delKey}</div>
     <div class="flex gap-1.5"><div class="${SP}w-[88px] text-base">123</div><div data-k=" " class="${KC}flex-1 text-base">space</div><div class="${SP}w-[88px] text-base">return</div></div></div>`;

  const msgs=$('#msgs'),inp=$('#inp'),snd=$('#snd'),kb=$('#kb');
  const add=(w,t)=>{const me=w==='me',d=document.createElement('div');
    d.className='flex flex-col '+(me?'items-end':'items-start');
    d.innerHTML=(group&&!me?`<span class="text-[11px] text-gray-500 ml-3">${w}</span>`:'')+
      `<div class="max-w-[75%] px-3.5 py-2 text-[13px] leading-snug rounded-[20px] ${me?'bg-[#0a84ff] text-white':'bg-[#e9e9eb]'}">${t}</div>`;
    msgs.append(d);msgs.scrollTop=1e5;return d};

  const press=el=>{el.classList.add('brightness-90');setTimeout(()=>el.classList.remove('brightness-90'),120)};
  const showSnd=()=>{const on=!!inp.textContent;snd.classList.toggle('opacity-0',!on);snd.classList.toggle('scale-75',!on)};
  const setCaps=v=>{caps=v;
    kb.querySelectorAll('.lbl,.pop').forEach(e=>e.textContent=caps?e.textContent.toUpperCase():e.textContent.toLowerCase());
    const s=$('#k-shift');s.classList.toggle('bg-white',caps);s.classList.toggle('bg-[#adb3bc]',!caps);
    s.firstElementChild.firstElementChild.style.fill=caps?'currentColor':'none'};
  const tap=async ch=>{
    if(/[a-z]/i.test(ch)&&(ch===ch.toUpperCase())!==caps){press($('#k-shift'));setCaps(!caps);await sleep(170)}
    const k=/[a-z ]/i.test(ch)?kb.querySelector(`[data-k="${ch.toLowerCase()}"]`):null;
    if(k&&ch!==' '){const p=k.querySelector('.pop');p.classList.remove('hidden');p.classList.add('flex');setTimeout(()=>{p.classList.add('hidden');p.classList.remove('flex')},140)}
    else if(k)press(k);
    inp.textContent+=ch;showSnd();inp.scrollLeft=1e5;await sleep(75);
  };
  const del=async()=>{press($('#k-del'));inp.textContent=inp.textContent.slice(0,-1);showSnd();await sleep(130)};

  await sleep(500);
  kb.classList.remove('translate-y-full');$('#sp').style.height='220px';
  await sleep(900);
  for(const [w,t] of script){
    if(w==='me'){
      const cs=[...t];
      for(let i=0;i<cs.length;i++){
        if(i===6&&cs.length>14){await tap('x');await sleep(300);await del();await sleep(160)} // salah ketik lalu hapus
        await tap(cs[i]);
      }
      await sleep(350);
      snd.classList.add('brightness-90','scale-90');await sleep(160);
      snd.classList.remove('brightness-90','scale-90');
      inp.textContent='';showSnd();add('me',t);
    }else{
      const ty=document.createElement('div');
      ty.className='bg-[#e9e9eb] self-start rounded-[20px] px-4 py-3 flex gap-1';
      ty.innerHTML=[0,1,2].map(i=>`<i class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay:${i*.15}s"></i>`).join('');
      msgs.append(ty);msgs.scrollTop=1e5;
      await sleep(1100+t.length*18);ty.remove();add(w,t);
    }
    await sleep(700);
  }
  await sleep(900);done();
}

/* ---------- Cerita ---------- */
const GROUP_NAME='jingga new member';
const GROUP_MEMBERS=['Mirza','Rangga','Diaz','Leon','Mila','You'];
const GROUP_SCRIPT=[
    ['Diaz', "kak mila kak asya serius hari ini?"],
    ['Diaz', 'kak gabisa mingdep?'],
    ['me', 'hari ini yaa diaz. sesuai kesepakatan dan schedule, coastal clean up hari ini minggu jam 4 sore'],
    ['Mila', 'nah betul. tolong dateng on time ya guys soalnya pasti banyak yang bakal kita bersihin, since it`s public holiday dan kita gapunya banyak tenaga'],
    ['Rangga', "noted, btw dokumentasi aman kan kak?"],
    ['me', "aman kok, ntar dibantu sama gue"],
    ['me', "sekalian nanti gue upload ke gdrive buat tugas kalian itu yaa"],
    ['Leon', "makasih kak asya, you save my life🤧 tapi masih harus join some activities lagi sih..."],
    ['Diaz', 'iya lagi, minimal banget 5'],
    ['me', 'wkwk nah karena kalian baru join sekali, mesti betah2 yaa di jingga'],
    ['Mila', 'harus betah sih sya, ntar nilai mereka E🤣'],
    ['Diaz', "apes dah kak kalau e, kaga lagi kita copas makalah abis ini"],
    ['Leon', "itu kan ur idea😂"],
    ['Diaz', "wkwk iya sih abisnya gua banyak deadline. lu juga yon sama bang mirza ada praktikum, blm lagi bang rangga liputan ke luar"],
    ['Mirza', "okeoke udah cukup nyeselnya, sekarang jalanin aja ini hukuman pak galang. nanti jam 4 di tikum ya kak mila kak asya"],
    ['me', "sipp, jangan lupa pada bawa masker trs kalau ada handsanitizer juga bawa ajaa"]
];
function groupChat(){
  chat(GROUP_NAME, GROUP_MEMBERS, GROUP_SCRIPT, true, function(){
    banner({icon:'✉️', bg:'#0a84ff', app:'Mail', title:'noreply-RelawanJIngga', text:'Nov Coastal Clean Up', go:openMail});
  });
}

/* ▼▼▼ MULAI: KOMPONEN ATTACHMENT MP3 ▼▼▼ */
const mp3Card=a=>`<div class="my-3 p-3 bg-gray-100 border border-gray-200 rounded-2xl flex items-center gap-3">
  <!-- Ikon Google Drive -->
<div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
</div>
  <div class="flex-1 min-w-0">
    <div class="text-[13px] font-semibold text-gray-900 truncate">Dokumentasi Kel.4 (ISBD)</div>
    <div class="text-[11px] text-gray-500 flex items-center gap-1">
      <span>Google Drive</span>
      <span>•</span>
    </div>
  </div>`
  ;
let mp3t=null, mp3a=null;
function bindMp3(){
  const btn=$('#mp3btn'); if(!btn) return;
  clearInterval(mp3t); if(mp3a){mp3a.pause();mp3a=null}
  let p=0, play=false; const sec=+btn.dataset.sec||30;
  mp3a=btn.dataset.url?new Audio(btn.dataset.url):null;
  btn.onclick=()=>{
    play=!play; $('#mp3ico').textContent=play?'❚❚':'▶';
    if(mp3a) play?mp3a.play():mp3a.pause();
    clearInterval(mp3t);
    if(play) mp3t=setInterval(()=>{
      if(!$('#mp3bar')){clearInterval(mp3t);return}
      p+=0.25; $('#mp3bar').style.width=Math.min(100,p/sec*100)+'%';
      if(p>=sec){clearInterval(mp3t);play=false;p=0;$('#mp3ico').textContent='▶';$('#mp3bar').style.width='0'}
    },250);
  };
}
/* ▲▲▲ SELESAI: KOMPONEN ATTACHMENT MP3 ▲▲▲ */
const mails=[
 ['noreply-RelawanJingga','Nov Coastal Clean Up','Halo, Teman-Teman Relawan!','<p class="mb-3">Halo, Teman-Teman Relawan!</p><p class="mb-3">Terima kasih telah berpartisipasi dan meluangkan waktu dalam kegiatan Coastal Clean-Up hari ini. Apresiasi sebesar-besarnya atas semangat dan kontribusi teman-teman dalam menjaga kebersihan serta kelestarian lingkungan pesisir.</p><p>Sebagai kenang-kenangan, berikut kami lampirkan dokumentasi kegiatan hari ini:</p><p><span class="text-blue-500">[https://drive.google.com/folderview?id=1Td8n_WDya1M]</span></p><br><p class="mb-3">Sampai bertemu di kegiatan relawan berikutnya! Mari terus bergerak dan membawa perubahan positif bagi lingkungan.</p><br><p>Salam hangat,<br>Relawan Jingga</p>',1],
  ['Rangga','Folder dibagikan kepada Anda','Rangga membagikan folder','<p>halo kak asya, tolong acc ini ya buat upload dokumentasi tugas kita. kak asya ntar bisa langsung upload di sini. minta tolong ya kak, makasih :D</p>',0,{name:'just maybe.mp3',size:'6.4 MB',dur:'1:22',sec:22}],
 ['Medium','Confirm your email on Medium','To keep your account secure, we need to...','<p>To keep your account secure, we need to confirm your email. Please click the link request on your Medium.</p>',0]];
let xShown=false;
function openMail(){
  show('mail');xShown=false;$('#mlist').classList.remove('hidden');$('#mdetail').classList.add('hidden');
  $('#mitems').innerHTML=mails.map((m,i)=>`<div data-i="${i}" class="relative pl-6 pr-4 py-3 cursor-pointer active:bg-gray-100">
    ${m[4]?'<i class="absolute left-2.5 top-5 w-2.5 h-2.5 rounded-full bg-[#0a84ff]"></i>':''}
    <div class="font-semibold text-[15px]">${m[0]}</div><div class="text-[14px] truncate">${m[1]}</div><div class="text-[13px] text-gray-500 truncate">${m[2]}</div></div>`).join('');
  document.querySelectorAll('#mitems [data-i]').forEach(el=>el.onclick=()=>{
    const m=mails[el.dataset.i];
        $('#mbody').innerHTML=`<h2 class="text-xl font-bold mb-1">${m[1]}</h2><div class="text-sm text-gray-500 mb-4">From: ${m[0]}</div><div class="text-[13px]">${m[3]}</div>${m[5]?mp3Card(m[5]):''}`;
    bindMp3();
    $('#mlist').classList.add('hidden');$('#mdetail').classList.remove('hidden');
    if(!xShown){xShown=true;setTimeout(()=>banner({icon:'𝕏',bg:'#000',app:'X',title:'@asyaaaa',text:'rangga and 99 others liked your tweet',go:openX}),2500)}
  });
  $('#mback').onclick=()=>{$('#mdetail').classList.add('hidden');$('#mlist').classList.remove('hidden')};
}

function openX(){show('x');setTimeout(()=>imsg('Mirza','kak asya, thank you banget bantuannya',()=>dm(0)),5000)}

const dms=[
 ['Mirza',[['Mirza','kak asya, thank you banget bantuannya hari ini. agak chaos tadi soalnya baru pertama kali, maaf ya beresnya kemaleman gara2 lama ngajarin kita dulu'],['me','hii mirza! ngga perlu minta maaf, kita semua belajar bareng kok di sini. makasih juga yaa udah keren banget hari ini pertama join relawan, ditunggu next activity yaa'],['me','btw hasil foto gue oke ngga?']]],
 ['Rangga',[['Rangga','kak, keren semua deh hasil foto lu, emang bakat lu jadi pdd. makasih ya udah bantu dokumentasi buat kita, sama ngajarin kita tadi. seru banget, banyak insight baru tadi gue'],['me','wkwk seneng deh dengernya, makasih juga ya rangga buat hari ini. aktivitas pertama sekeren itu, ditunggu next projeknya yaa'],['Rangga','ayo aja gua mah']]],
 ['Diaz',[['Diaz','kak asyaa, duh kak gua keren banget anjir di jepretan lu wkwk makasih yak udh fotoin, makasih juga udh bantuin kita tadi meski banyak linglungnya'],['me','nahh mantep kan foto gue. makasih kembali yaa diaz udah nyoba jadi relawan, keren dah lu semua hari ini padahal pertama join'],['Diaz','keren adalah prinsip geng gua kak']]],
 ['Leon',[['Leon','hii kak asya, sorry if i bothering u at this hour but i wanna say thank u so much for helping us today. aku banyak belajar banget loh hari ini, foto2 kakak juga bagus aku udah liat semuanya'],['me','hii leon!! omg thank you so much for your kind words, it warms me! seneng deh kamu dapet pengalaman baru hari ini, jangan kapok yaa leon hihii abis ini kita projekan lagi'],['Leon','yessirrr let`s gooo']]]
];
function dm(i){
  const [n,s]=dms[i];
  chat(n,[n],s,false,()=>{
    if(i<3){const nx=dms[i+1];imsg(nx[0],nx[1][0][1],()=>dm(i+1))}
        else {
      imsg('Rangga','kak, udh sampe rumah kan?',()=>{});
      const rb=[...document.querySelectorAll('.ban')].pop();
      if(rb){rb.classList.add('pointer-events-none');rb.classList.remove('cursor-pointer')}
      setTimeout(()=>{
        $('#end').classList.remove('hidden');                // lalu modal End of Story
      },8000);
    }
  });
}
$('#back').onclick=()=>{$('#end').classList.add('hidden');show('home')};

show('lock');

/* =====================================================
   FREE ROAM MODE
   ===================================================== */
let isFinished=false, backHook=null;
const logs={};                         // riwayat chat untuk app Messages
const _show=show, _chat=chat, _om=openMail;

// --- timpa show(): reset back, tutup preview, atur tombol back ---
show=function(id){
  _show(id); backHook=null;
  $('#pv').classList.add('hidden');
  $('#bk').classList.toggle('hidden',!(isFinished&&id!=='lock'&&id!=='home'));
};
// --- timpa chat(): rekam isi chat ---
chat=function(t,n,s,g,d){ logs[t]={n,s,g}; return _chat(t,n,s,g,d); };
// --- Email: di mode free roam tidak memicu banner X, back pintar ---
openMail=function(){
  _om();
  if(isFinished){
    xShown=true;
    backHook=()=>{ if(!$('#mdetail').classList.contains('hidden')){$('#mdetail').classList.add('hidden');$('#mlist').classList.remove('hidden')} else goHome(); };
  }
};
// --- X: tanpa notifikasi DM di free roam, plus tombol ‹ ---
function openX(){
  show('x');
  if(isFinished){
    if(!$('#xb'))$('#x').insertAdjacentHTML('afterbegin','<span id="xb" class="absolute left-4 top-14 text-sky-400 text-[34px] leading-none z-10">‹</span>');
  }else setTimeout(()=>imsg('Mirza','kak asya, thank you banget bantuannya hari ini',()=>dm(0)),5000);
}
// --- Home: tampilkan Mode Selection sekali, lalu popup cerita hanya di mode storyline ---
let modeChosen=false;
function goHome(){
  show('home');
  if(!modeChosen){ $('#mode').classList.remove('hidden'); return; }
  if(!isFinished) setTimeout(()=>imsg('jingga new member','Diaz: kak mila kak asya serius hari ini?',groupChat),700);
}
$('#m1').onclick=()=>{                       // Follow the Storyline
  modeChosen=true; $('#mode').classList.add('hidden');
  setTimeout(()=>imsg('jingga new member','Diaz: kak mila kak asya serius hari ini?',groupChat),700);
};
$('#m2').onclick=()=>{                       // Explore Mobile Apps (Free Roam langsung)
  modeChosen=true; isFinished=true; $('#mode').classList.add('hidden');
};
// --- Tombol Back to Home di modal ending ---
$('#back').onclick=()=>{ isFinished=true; $('#end').classList.add('hidden'); goHome(); };
$('#bk').onclick=()=>backHook?backHook():goHome();
$('#pv').onclick=()=>$('#pv').classList.add('hidden');

/* ---------- helper ---------- */
const IMG=(s,w=600,h=600)=>`https://picsum.photos/seed/${s}/${w}/${h}`;
/* ---------- Foto Avatar Karakter (ganti URL dengan foto kamu sendiri) ---------- */
const AVA={
  Mirza :'https://i.imgur.com/RMNOCoX.jpeg',
  Rangga :'https://i.imgur.com/ZbipOlJ.jpeg',
  Diaz :'https://i.imgur.com/jrcydjg.jpeg',
  Leon :'https://i.imgur.com/m3CEd4t.jpeg'
};
const avaHTML=(name,cls)=>`<img src="${AVA[name]}" alt="${name}" class="${cls} rounded-full object-cover bg-gray-300">`;
const nav=(l,c='#0a84ff')=>`<div class="px-2 h-8 flex items-center text-[17px]" style="color:${c}"><span class="text-[34px] leading-none mr-1 pb-1">‹</span>${l}</div>`;
const tabbar=(items,act,c)=>`<div class="mt-auto sticky bottom-0 bg-white/95 backdrop-blur border-t pt-2 pb-7 flex justify-around text-[10px] text-gray-500">${items.map((t,i)=>`<div class="flex flex-col items-center gap-0.5 ${i===act?'font-semibold':''}" style="${i===act?'color:'+c:''}"><span class="text-xl">${t[0]}</span>${t[1]}</div>`).join('')}</div>`;
function page(bg,html){
  show('app'); const a=$('#app');
  a.className='scr absolute inset-0 pt-14 overflow-y-auto '+bg;
  a.innerHTML=`<div class="min-h-full flex flex-col">${html}</div>`; a.scrollTop=0;
  $('#ov').className='absolute inset-0 z-40 pointer-events-none '+(bg.includes('bg-black')?'text-white':'text-black');
}

/* ---------- a. NOTES ---------- */
const NOTES=[
 ['lagi','Sept 13',"Mawar di sudut ruangan mekar apik bak bunga di musim semi \nAlihkan aktivitas untuk sejenak mengagumi \nSurat manis pun masih di sana sebabkan sipu merah alami \nSapa yang dirindu untuk kembali \n\nArunika menyongsong ria awali celoteh sekawanan burung \nHari berganti sapu habis segala murung \nTerisi kembali afeksi nan sempat tak berkunjung \nUdarakan sukacita hingga bergaung \n\nGelak hadir usai dilabuhi sepi \nAntarkan mesra yang melingkupi \nHancurkan belenggu yang mencekik mati \nMenyatu padu kita kembali \n\nPangkuannya sama menenangkan dan hangat \nTiada sisakan pilu untuk melebat \nPastikan genggam jemari itu erat \nUntuk tetap tinggal hujani renjana dua hati nan terikat \n\nAsa dipijaki lagi bersama \nDengannya siap arungi kembali dunia"],
 ['mana dering itu?','July 18',"Bentang cakrawala tampak murung \nTak beri rembulan celah `tuk tunjukan eksistensinya nan agung \nCiptakan semilir angin dingin tanpa ujung \nMenyertai awan kelabu nan berkunjung \n\nMenit kedua puluh berdentang \nTungkai tak lelah menopang tubuh demi asa yang datang \nKembali bersandar pada tembok panjang \nNantikan telepon tersayang \n\nTak lagi dilihat rupa manis usai debat hebat \nBeku merambati telapak tangan nan semula hangat \nHampa memayungi diri dengan sunyi nan mengikat \nTolong satu panggilan saja untuk kembalikan senyum yang melekat \n\nSang masa seolah-olah menantang \nTertawakan harapan kosong nan membayang \nHiraukan perkara penghalang \nMasih di sini menunggu deringmu, Sayang"],
 ['summer i love more than you know','May 25',"Same footprints on white sand \nWaves kiss our feet again \nBack to the rock we lean on \nFirst summer we spent on \nIt feels different \nTryna work on it until the end \nKnow how I waited for long \nAnd universe led me where I belong \nClassic trope \nBut there`s a lot of hope \nThrough the wind and rain we carried on \nWaking up think about you each dawn \nAs I live in your blood, you stay in my heartbeat \nMake me complete \nKeep holding my hand \nCause leaving was never part of my plan \nStaying built love I wanted to \nHere for everything we`ll go through \nHope summer would always be this sweet \nWith you as everything I need"],
 ['susur','May 24',"Cuitan kawanan burung melagu merdu \nBerkeliaran di bawah naungan cakrawala nan abu \nMencari arah pada tempat yang hendak dituju \nPetang itu begitu riuh oleh gemuruh dan sepoi nan menusuk \n\nNamun ributnya sekitar tak kunjung pudarkan gelak yang mengudara \nSang nona dan tuan berbagi cerita mesra \nTentang apapun demi menghempas lara \nSembari saksikan awan hitam nan kian merajalela"]];
function notesApp(){
  page('bg-[#f2f2f7]',`${nav('Folders','#d99a00')}<h1 class="px-4 text-[34px] font-bold">Notes</h1>
  <div class="mx-4 mt-2 bg-[#e3e3e8] rounded-xl h-9 flex items-center px-3 text-gray-500 text-[17px]">🔍&nbsp;Search</div>
  <div class="mx-4 mt-4 bg-white rounded-xl divide-y overflow-hidden">${NOTES.map((n,i)=>`<div data-n="${i}" class="px-4 py-2.5 active:bg-gray-100 cursor-pointer"><div class="font-semibold text-[16px]">${n[0]}</div><div class="text-[15px] text-gray-500 truncate"><span class="text-black">${n[1]}</span>&nbsp; ${n[2].split('\n')[0]}</div></div>`).join('')}</div>
  <div class="text-center text-gray-500 text-[13px] mt-4">4 Notes</div>`);
  document.querySelectorAll('[data-n]').forEach(el=>el.onclick=()=>noteDetail(+el.dataset.n));
}
function noteDetail(i){
    page('bg-white',`${nav('Notes','#d99a00')}<div class="px-5 pt-2 pb-10"><div class="text-center text-[11px] text-gray-400">${NOTES[i][1]}</div><h2 class="text-[20px] font-bold mt-2">${NOTES[i][0]}</h2><p class="mt-2 text-[15px] leading-[1.5] whitespace-pre-line">${NOTES[i][2]}</p></div>`);
  backHook=notesApp;
}

/* ---------- b. GALLERY (17 foto, ganti URL sesukamu) ---------- */
const PHOTOS= ['https://i.imgur.com/xP0qTgg.jpeg','https://i.imgur.com/8NYLeYL.jpeg','https://i.imgur.com/vgedGAK.jpeg','https://i.imgur.com/N4ZNNmJ.jpeg','https://i.imgur.com/eU8lpJW.jpeg','https://i.imgur.com/aW2gU3g.jpeg','https://i.imgur.com/6m4GqfH.jpeg','https://i.imgur.com/6hsejZB.jpeg','https://i.imgur.com/1EWwy9P.jpeg','https://i.imgur.com/Z1NMiqS.jpeg','https://i.imgur.com/GQAvwSQ.jpeg','https://i.imgur.com/kh27NAl.jpeg','https://i.imgur.com/Jk9CXGw.jpeg','https://i.imgur.com/h7eqTlb.jpeg','https://i.imgur.com/hpu1iuL.jpeg','https://i.imgur.com/gYBHeL5.jpeg','https://i.imgur.com/ZxR0sJY.jpeg','https://i.imgur.com/R9OEoVE.jpeg'];
function galleryApp(){
  page('bg-white',`${nav('Albums')}<h1 class="px-4 text-[34px] font-bold mb-1">Today</h1>
  <div class="grid grid-cols-3 gap-[2px]">${PHOTOS.map((u,i)=>`<img data-p="${i}" src="${u}" loading="lazy" alt="" class="w-full aspect-square object-cover bg-gray-300 cursor-pointer">`).join('')}</div>
  <div class="text-center py-4 text-[15px]"><b>18 Photos</b></div>`);
  document.querySelectorAll('[data-p]').forEach(el=>el.onclick=()=>{$('#pvi').src=PHOTOS[el.dataset.p];$('#pv').classList.remove('hidden')});
}

/* ---------- c. CAMERA (POV) ---------- */
function cameraApp(){
  page('bg-black',`<div class="flex-1 flex flex-col text-white pb-9">
   <div class="px-3 h-8 flex items-center justify-between text-lg"><span class="text-[34px] leading-none pb-1">‹</span><span class="text-yellow-400">ϟ</span><span>⌃</span></div>
   <div class="relative flex-1 min-h-[300px] rounded-[22px] overflow-hidden mt-1">
     <img src="https://i.imgur.com/ePRtV7z.jpeg" alt="" class="absolute inset-0 w-full h-full object-cover bg-gray-800">
     <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-yellow-400"></div>
     <div class="absolute bottom-3 inset-x-0 flex justify-center"><div class="bg-black/40 backdrop-blur rounded-full px-3 py-1 text-[13px] font-semibold flex gap-3"><span>.5</span><span class="text-yellow-400">1×</span><span>2</span></div></div></div>
   <div class="flex justify-center gap-5 text-[13px] font-semibold tracking-wide mt-3"><span>CINEMATIC</span><span>VIDEO</span><span class="text-yellow-400">PHOTO</span><span>PORTRAIT</span></div>
   <div class="flex items-center justify-between px-8 mt-4">
     <img src="${PHOTOS[0]}" alt="" class="w-12 h-12 rounded-lg object-cover bg-gray-700">
     <div class="w-[74px] h-[74px] rounded-full border-4 border-white p-1"><div class="w-full h-full rounded-full bg-white"></div></div>
     <div class="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-xl">⟳</div></div></div>`);
}

/* ---------- d. INSTAGRAM ---------- */
function instaApp(){
  const I=d=>`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="${d}"/></svg>`;
  const heart='M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z', cmt='M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.2A8 8 0 1121 12z', snd='M22 3L2 10l8 3 3 8z', bm='M6 3h12v18l-6-4-6 4z';
  page('bg-white',`<div class="flex items-center justify-between px-3 h-11 border-b"><div class="flex items-center gap-2"><span class="text-[34px] leading-none pb-1">‹</span><span class="text-[28px]" style="font-family:'Snell Roundhand','Segoe Script','Brush Script MT',cursive;font-weight:600">Instagram</span></div><div class="flex gap-4">${I(heart)}${I(snd)}</div></div>
  <div class="flex items-center gap-2.5 px-3 py-2.5"><div class="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"><div class="p-[2px] bg-white rounded-full"><img src="https://i.imgur.com/RMNOCoX.jpeg" alt="" class="w-8 h-8 rounded-full object-cover"></div></div>
   <div class="flex-1 leading-tight"><div class="text-[14px] font-semibold">mirzaarchive</div><div class="text-[12px]">1 hour ago</div></div><span class="font-bold">•••</span></div>
  <img src="https://i.imgur.com/6hsejZB.jpeg" alt="" class="w-full aspect-square object-cover bg-gray-200">
  <div class="flex justify-between px-3 pt-3"><div class="flex gap-4">${I(heart)}${I(cmt)}${I(snd)}</div>${I(bm)}</div>
  <div class="px-3 pt-2 text-[14px] leading-snug"><b>Liked by asyaaaa and others</b><p class="mt-1"><b>mirzaarchive</b>🐚🌞🌴</p><p class="text-gray-500 mt-1">See all comment</p><p class="text-gray-400 text-[11px] mt-1 uppercase"</p></div>
  ${tabbar([['🏠',''],['🔍',''],['➕',''],['🎬',''],['👤','']],0,'#000')}`);
}

/* ---------- e. PHONE (Recents) ---------- */
const CALLS=[['Mirza','mobile','15:45','out'],['Rangga','mobile','10:47','in'],['Mila','mobile','06:30','miss'],['Mila','Mobile','Yesterday','in'],['Mirza','mobile','Yesterday','out'],['Mirza','mobile','Yesterday','out'],['Rangga','mobile','Sunday','miss'],['Mirza','mobile','Sunday','in']];
function phoneApp(){
  const tag={in:['↙ In','text-green-600'],out:['↗ out','text-green-600'],miss:['↙ miss','text-red-500']};
  page('bg-white',`<div class="flex justify-between items-center px-2 h-8 text-[#0a84ff] text-[17px]"><span class="flex items-center"><span class="text-[34px] leading-none mr-1 pb-1">‹</span>Home</span><span class="px-2">Edit</span></div>
  <div class="mx-auto my-2 bg-[#eeeef0] rounded-lg p-0.5 flex text-[13px] font-semibold w-48"><span class="flex-1 text-center bg-white rounded-md py-1 shadow-sm">All</span><span class="flex-1 text-center py-1">Missed</span></div>
  <h1 class="px-4 text-[34px] font-bold">Recents</h1>
  <div class="mt-1">${CALLS.map(c=>`<div class="flex items-center pl-4 pr-3"><div class="flex-1 py-2 border-b"><div class="text-[17px] ${c[3]==='miss'?'text-red-500':''}">${c[0]}</div><div class="text-[13px] ${tag[c[3]][1]}">${tag[c[3]][0]} · <span class="text-gray-500">${c[1]}</span></div></div><span class="text-gray-500 text-[15px] mx-3 border-b py-4">${c[2]}</span><span class="text-[#0a84ff] text-xl">ⓘ</span></div>`).join('')}</div>
  ${tabbar([['⭐','Favorites'],['🕘','Recents'],['👤','Contacts'],['⌗','Keypad'],['📼','Voicemail']],1,'#0a84ff')}`);
}

/* ---------- f. GOOGLE CHROME ---------- */
function chromeApp(){
  const R=[['J','RelawanJingga','www.relawanjingga.com › Volunteer','Bergerak Bersama, Menebar Kebaikan','Bergerak Bersama, Menebar Kebaikan.'],
           ['J','RelawanJingga','www.relawanjingga.com › tag › Volunteer','Satu Kepedulian, Sejuta Kebaikan','Satu Kepedulian, Sejuta Kebaikan'],
           ['J','RelawanJingga','www.relawanjingga.com › VolunteerJaksel','Menjadi Bagian dari Perubahan','Menjadi Bagian dari Perubahan']];
  page('bg-white',`<div class="flex items-center gap-1 px-1"><span class="text-[34px] leading-none pb-1 text-[#5f6368]">‹</span>
   <div class="flex-1 h-11 rounded-full bg-[#f1f3f4] flex items-center px-3 gap-2"><b class="text-[#4285f4] text-lg">G</b><span class="flex-1 text-[16px]">Relawan Jingga</span><span class="text-gray-500">✕</span><span>🎙️</span></div></div>
  <div class="flex gap-5 px-4 mt-2 border-b text-[14px] text-gray-600"><span class="text-[#1a73e8] border-b-[3px] border-[#1a73e8] pb-2 font-medium">All</span><span>Images</span><span>Videos</span><span>News</span><span>Shopping</span></div>
  <div class="mx-3 mt-3 rounded-2xl p-4 bg-gradient-to-br from-[#e8f0fe] to-[#f3e8fd]"><div class="text-[#1a73e8] font-medium text-[14px]">✦ AI Overview</div>
   <p class="text-[14px] leading-snug mt-1.5">Relawan Jingga merupakan komunitas kerelawanan yang berbasis di Jakarta Selatan, Indonesia. Melalui berbagai kegiatan sosial, aksi kemanusiaan, dan program pemberdayaan, Relawan Jingga berkomitmen untuk menumbuhkan solidaritas, menyebarkan kebaikan, serta menciptakan perubahan positif bagi lingkungan sekitar.</p></div>
  <div class="grid grid-cols-2 gap-2 mx-3 mt-3"><img src="https://i.imgur.com/PTIwsYl.jpeg" alt="relawanjingga" class="h-28 w-full object-cover rounded-xl bg-gray-200"><img src="https://i.imgur.com/BolMsIs.jpeg" alt="relawanjingga" class="h-28 w-full object-cover rounded-xl bg-gray-200"></div>
  <div class="px-4 mt-3 space-y-4 pb-4">${R.map(r=>`<div><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-[#f1f3f4] flex items-center justify-center text-xs font-bold text-green">${r[0]}</div><div class="leading-tight min-w-0"><div class="text-[13px]">${r[1]}</div><div class="text-[12px] text-gray-500 truncate">${r[2]}</div></div></div><div class="text-[19px] text-[#1a0dab] leading-snug mt-1">${r[3]}</div><div class="text-[14px] text-gray-600">${r[4]}</div></div>`).join('')}</div>
  <div class="mt-auto sticky bottom-0 bg-white/95 backdrop-blur border-t pt-2 pb-7 flex justify-around text-[#5f6368] text-xl"><span>‹</span><span>›</span><span>＋</span><span class="border-2 border-[#5f6368] rounded-md w-6 h-6 text-[13px] flex items-center justify-center font-semibold">1</span><span>⋯</span></div>`);
}

/* ---------- g. MESSAGES (riwayat chat, tanpa animasi) ---------- */
function bubbleHTML(w,m,g){const me=w==='me';
  return `<div class="flex flex-col ${me?'items-end':'items-start'}">${g&&!me?`<span class="text-[11px] text-gray-500 ml-3">${w}</span>`:''}<div class="max-w-[75%] px-3.5 py-2 text-[16px] leading-snug rounded-[20px] ${me?'bg-[#0a84ff] text-white':'bg-[#e9e9eb]'}">${m}</div></div>`;}
function msgApp(){
  const ks=Object.keys(logs);
  page('bg-white',`<div class="flex justify-between items-center px-2 h-8 text-[#0a84ff] text-[17px]"><span class="flex items-center"><span class="text-[34px] leading-none mr-1 pb-1">‹</span>Home</span><span class="px-2">Edit</span></div>
  <h1 class="px-4 text-[34px] font-bold">Messages</h1>
  <div class="mx-4 my-2 bg-[#eeeef0] rounded-xl h-9 flex items-center px-3 text-gray-500 text-[17px]">🔍&nbsp;Search</div>
    ${ks.length?'':'<div class="text-center text-gray-400 mt-24 text-[17px]">No Messages</div>'}<div>${ks.map((k,i)=>{const l=logs[k],last=l.s[l.s.length-1];
      return `<div data-c="${k}" class="flex gap-3 pl-4 cursor-pointer active:bg-gray-100">${l.g?'<div class="w-12 h-12 mt-2 rounded-full shrink-0 bg-gray-400 flex items-center justify-center text-white text-xl">👥</div>':avaHTML(k,'w-12 h-12 mt-2 shrink-0')}
   <div class="flex-1 min-w-0 py-2.5 border-b pr-4"><div class="flex justify-between"><b class="text-[16px]">${k}</b><span class="text-[14px] text-gray-400">19:0${i} ›</span></div><div class="text-[15px] text-gray-500 line-clamp-2">${last[0]==='me'?'':last[0]+': '}${last[1]}</div></div></div>`}).join('')}</div>`);
  document.querySelectorAll('[data-c]').forEach(el=>el.onclick=()=>replay(el.dataset.c));
}
function replay(t){
  const {n,s,g}=logs[t]; show('chat'); backHook=msgApp;
  $('#chat').innerHTML=`<div class="flex flex-col h-full">
   <div class="pt-14 pb-2 bg-gray-100/95 border-b flex flex-col items-center relative">
     <span class="absolute left-3 top-16 text-[#0a84ff] text-[34px] leading-none">‹</span>
          ${g?'<div class="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl">👥</div>':avaHTML(t,'w-12 h-12')}
     <div class="text-xs mt-1">${t} <span class="text-gray-400">›</span></div>${g?`<div class="text-[10px] text-gray-400">${n.join(', ')}</div>`:''}</div>
   <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5"><div class="text-center text-[11px] text-gray-400 mb-2">iMessage · Today</div>${s.map(([w,m])=>bubbleHTML(w,m,g)).join('')}</div>
   <div class="px-3 pt-2 pb-8 flex gap-2 items-center"><div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">+</div><div class="flex-1 min-h-[34px] border border-gray-300 rounded-full px-4 py-1.5 text-[15px] text-gray-400">iMessage</div></div></div>`;
  const m=$('#chat .overflow-y-auto'); m.scrollTop=1e5;
}

/* ---------- h. MUSIC (Personal Playlist) ---------- */
const PLAYLIST={
  title:'Recently Fav',
  by:'asyaaaa',
  updated:'Updated Today',
  cover:'https://i.imgur.com/xa68oC6.jpeg'   // ganti dengan foto cover kamu
};
// Format tiap lagu: [Judul Lagu, Artist/Penyanyi, Link Gambar Cover]
const TRACKS=[
  ['Take A Chance With Me','NIKI','https://i.imgur.com/t6iSzCz.jpeg'],
  ['Say','Keshi','https://i.imgur.com/4BBX5aI.jpeg'],
  ['Astronomy','Conan Gray','https://i.imgur.com/RZLsykD.jpeg'],
  ['August','Taylor Swift','https://i.imgur.com/wGvqki3.jpeg'],
  ['Never Let Go','LNGSHOT','https://i.imgur.com/c6XSPDu.jpeg'],
  ['Who Knows','Daniel Caesar','https://i.imgur.com/fTMdgr4.jpeg']
];
let curTrack=0, isPlaying=false;

function musicApp(){
  page('bg-white',`${nav('Library','#fa2d48')}
  <div class="flex gap-3 px-4 pt-2">
    <img src="${PLAYLIST.cover}" alt="" class="w-28 h-28 rounded-lg shadow-md object-cover bg-gray-300 shrink-0">
    <div class="flex-1 min-w-0 flex flex-col">
      <div class="text-[22px] font-bold leading-tight truncate">${PLAYLIST.title}</div>
      <div class="text-[17px] text-[#fa2d48] leading-snug truncate">${PLAYLIST.by}</div>
      <div class="text-[13px] text-gray-400">${PLAYLIST.updated}</div>
      <div class="text-[11px] text-gray-400 font-semibold tracking-wide mt-0.5">✔ DOWNLOADED</div>
      <div class="mt-auto flex justify-end">
        <div class="w-7 h-7 rounded-full bg-[#fa2d48] text-white flex items-center justify-center text-[13px] leading-none pb-1">•••</div>
      </div>
    </div>
  </div>

  <div class="flex gap-3 px-4 mt-4">
    <div id="pl-play" class="flex-1 bg-[#f2f2f7] text-[#fa2d48] font-semibold rounded-xl py-3 text-center cursor-pointer active:opacity-60">▶ Play</div>
    <div id="pl-shuf" class="flex-1 bg-[#f2f2f7] text-[#fa2d48] font-semibold rounded-xl py-3 text-center cursor-pointer active:opacity-60">⤮ Shuffle</div>
  </div>

  <div class="mt-3">${TRACKS.map((t,i)=>`
    <div data-t="${i}" class="flex items-center gap-3 pl-4 pr-4 cursor-pointer active:bg-gray-100">
      <img src="${t[2]}" alt="" class="w-12 h-12 rounded-md object-cover bg-gray-300 shrink-0 my-2">
      <div class="flex-1 min-w-0 py-2.5 border-b">
        <div class="text-[16px] font-semibold text-black truncate">${t[0]}</div>
        <div class="text-[14px] font-normal text-gray-500 truncate">${t[1]}</div>
      </div>
    </div>`).join('')}</div>
  <div class="text-[13px] text-gray-500 px-4 mt-3 mb-2">${TRACKS.length} songs</div>

  <div class="mt-auto sticky bottom-0 mx-2 mb-7 pt-3">
    <div class="bg-[#f2f2f7]/95 backdrop-blur rounded-xl p-2 flex items-center gap-3 shadow-lg">
      <img id="mimg" src="" alt="" class="w-10 h-10 rounded-md object-cover bg-gray-300">
      <span id="mtitle" class="flex-1 text-[15px] font-medium truncate"></span>
      <span id="mplay" class="text-xl w-8 text-center cursor-pointer select-none"></span>
      <span id="mnext" class="text-xl mr-1 cursor-pointer select-none">⏭</span>
    </div>
  </div>`);

  const upd=()=>{
    $('#mimg').src=TRACKS[curTrack][2];
    $('#mtitle').textContent=TRACKS[curTrack][0];
    $('#mplay').textContent=isPlaying?'❚❚':'▶';
  };
  upd();

  document.querySelectorAll('[data-t]').forEach(el=>el.onclick=()=>{curTrack=+el.dataset.t;isPlaying=true;upd()});
  $('#pl-play').onclick=()=>{curTrack=0;isPlaying=true;upd()};
  $('#pl-shuf').onclick=()=>{curTrack=Math.floor(Math.random()*TRACKS.length);isPlaying=true;upd()};
  $('#mplay').onclick=()=>{isPlaying=!isPlaying;upd()};
  $('#mnext').onclick=()=>{curTrack=(curTrack+1)%TRACKS.length;upd()};
}

/* ---------- Hubungkan ikon Homescreen ---------- */
dockApps[1]=['Chrome','🌐','#fff'];                 // Safari → Google Chrome
$('#dock').innerHTML=dockApps.map(a=>ic(a,0)).join('');
const gridFns=[notesApp,galleryApp,()=>openMail(),cameraApp,instaApp,()=>openX()];
const dockFns=[phoneApp,chromeApp,msgApp,musicApp];
[...document.querySelectorAll('#grid>div')].forEach((e,i)=>{e.classList.add('cursor-pointer','active:scale-90','transition');e.onclick=()=>isFinished&&gridFns[i]()});
[...document.querySelectorAll('#dock>div')].forEach((e,i)=>{e.classList.add('cursor-pointer','active:scale-90','transition');e.onclick=()=>isFinished&&dockFns[i]()});
  /* ▼▼▼ MULAI: SEED RIWAYAT CHAT (agar Messages terisi di mode Explore) ▼▼▼ */
logs[GROUP_NAME]={ n:GROUP_MEMBERS, s:GROUP_SCRIPT, g:true };
dms.forEach(([nama,isi])=>{ logs[nama]={ n:[nama], s:isi, g:false }; });
/* ▲▲▲ SELESAI: SEED RIWAYAT CHAT ▲▲▲ */