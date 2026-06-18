// Carousel
function initCarousel(id){
    const el=document.getElementById(id);if(!el)return;
    const slides=el.querySelectorAll('.carousel-slide');
    const thumbsWrap=el.querySelector('[id$="-thumbs"]');
    if(!slides.length)return;
    el._idx=0;el._total=slides.length;
    thumbsWrap.innerHTML='';
    slides.forEach((s,i)=>{
        const img=s.querySelector('img');
        const t=document.createElement('div');t.className='carousel-thumb'+(i===0?' active':'');
        t.setAttribute('role','button');t.setAttribute('tabindex','0');t.setAttribute('aria-label',(i+1)+'번 슬라이드로 이동');t.setAttribute('aria-current',i===0?'true':'false');
        t.innerHTML='<img src="'+img.src+'" alt="">';
        const goTo=()=>{el._idx=i;updateCarousel(id)};
        t.onclick=goTo;
        t.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();goTo();}};
        thumbsWrap.appendChild(t);
    });
}
function updateCarousel(id){
    const el=document.getElementById(id);if(!el)return;
    el.querySelector('.carousel-track').style.transform='translateX(-'+el._idx*100+'%)';
    el.querySelectorAll('.carousel-thumb').forEach((t,i)=>{var on=i===el._idx;t.classList.toggle('active',on);t.setAttribute('aria-current',on?'true':'false');});
}
function slideCarousel(id,dir){
    const el=document.getElementById(id);if(!el)return;
    el._idx=(el._idx+dir+el._total)%el._total;updateCarousel(id);
}

// P1 UX: reduced-motion flag
const REDUCE_MOTION = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);

// P1 UX: Hero typing animation (starts once, only when landing is active)
let _typingStarted=false;
function typeRoles(){
    const el=document.getElementById('typed-role');
    if(!el||_typingStarted)return;
    const landing=document.getElementById('page-landing');
    if(!landing||!landing.classList.contains('active'))return;
    _typingStarted=true;
    const roles=['AI Automation Engineer','AX Engineer','AI Service Builder','Data Analyst'];
    el.textContent=roles[0];
    if(REDUCE_MOTION)return;
    let r=0,c=roles[0].length,deleting=true;
    function tick(){
        const word=roles[r];
        if(!deleting){
            el.textContent=word.slice(0,++c);
            if(c===word.length){deleting=true;return setTimeout(tick,1500);}
        }else{
            el.textContent=word.slice(0,--c);
            if(c===0){deleting=false;r=(r+1)%roles.length;}
        }
        setTimeout(tick,deleting?45:95);
    }
    setTimeout(tick,1500);
}

// P1.5 UX: per-page scroll reveal (landing keeps inline .reveal; detail blocks auto-tagged)
const REVEAL_BLOCKS='.ph,.story,.tb,.future,.ec,.skill-group';
function prepareReveal(pageEl){
    if(!pageEl)return;
    pageEl.querySelectorAll(REVEAL_BLOCKS).forEach(function(el){el.classList.add('reveal');});
}
function observeReveal(pageEl){
    if(!pageEl)return;
    const bidi=(pageEl.id==='page-landing'||pageEl.id==='page-about');
    const els=Array.prototype.slice.call(pageEl.querySelectorAll('.reveal'));
    if(!els.length)return;
    const groups=new Map();
    els.forEach(function(el){
        const p=el.parentElement;
        if(p&&(p.classList.contains('cg')||p.classList.contains('summary')||p.classList.contains('exp-col'))){
            const a=groups.get(p)||[];a.push(el);groups.set(p,a);
        }
    });
    groups.forEach(function(a){a.forEach(function(el,i){el.style.transitionDelay=(i*70)+'ms';});});
    if(REDUCE_MOTION||!('IntersectionObserver' in window)){
        els.forEach(function(el){el.classList.add('in');});return;
    }
    const io=new IntersectionObserver(function(ents){
        ents.forEach(function(en){
            if(en.isIntersecting){en.target.classList.add('in');if(!bidi)io.unobserve(en.target);}
            else if(bidi){en.target.classList.remove('in');}
        });
    },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el);});
}

// P1.5 UX: count-up for [data-count] within a page
function initCountUp(pageEl){
    if(!pageEl)return;
    const els=Array.prototype.slice.call(pageEl.querySelectorAll('[data-count]:not(.counted)'));
    if(!els.length)return;
    function fmt(el,n){
        const dec=parseInt(el.getAttribute('data-decimals')||'0',10);
        let v=dec>0?n.toFixed(dec):String(Math.round(n));
        const parts=v.split('.');parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
        return (el.getAttribute('data-prefix')||'')+parts.join('.')+(el.getAttribute('data-suffix')||'');
    }
    function run(el){
        el.classList.add('counted');
        const target=parseFloat(el.getAttribute('data-count'))||0;
        if(REDUCE_MOTION){el.textContent=fmt(el,target);return;}
        const dur=1100;let start=null;
        function step(ts){
            if(start===null)start=ts;
            const p=Math.min((ts-start)/dur,1);
            el.textContent=fmt(el,target*(1-Math.pow(1-p,3)));
            if(p<1)requestAnimationFrame(step);else el.textContent=fmt(el,target);
        }
        requestAnimationFrame(step);
    }
    if(REDUCE_MOTION||!('IntersectionObserver' in window)){els.forEach(run);return;}
    els.forEach(function(el){
        if(el.classList.contains('stat')){el.style.display='inline-block';el.style.textAlign='right';el.style.minWidth=el.getBoundingClientRect().width+'px';}
        var sr=document.createElement('span');sr.className='sr-only';sr.textContent=el.textContent;
        el.setAttribute('aria-hidden','true');el.parentNode.insertBefore(sr,el.nextSibling);
        el.textContent=fmt(el,0);
    });
    const io=new IntersectionObserver(function(ents){
        ents.forEach(function(en){if(en.isIntersecting){io.unobserve(en.target);run(en.target);}});
    },{threshold:0.5});
    els.forEach(function(el){io.observe(el);});
}

// P1.5 UX: reading progress bar (non-landing pages)
let _progressEl=null,_pTick=false;
function ensureProgressBar(){
    if(!_progressEl){
        _progressEl=document.createElement('div');
        _progressEl.id='progress-bar';
        _progressEl.setAttribute('aria-hidden','true');
        document.body.appendChild(_progressEl);
    }
    return _progressEl;
}
function updateProgress(){
    if(!_progressEl||!_progressEl.classList.contains('on'))return;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    _progressEl.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
}
function setProgressActive(on){
    const bar=ensureProgressBar();
    bar.classList.toggle('on',on);
    if(on)updateProgress();else bar.style.width='0';
}
window.addEventListener('scroll',function(){
    if(_pTick)return;_pTick=true;
    requestAnimationFrame(function(){updateProgress();_pTick=false;});
},{passive:true});

function go(id){
    if(location.hash.slice(1)===id) showPage(id);
    else location.hash = id;
}
function showPage(id){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const el = document.getElementById('page-'+id) || document.getElementById('page-landing');
    const firstShow = !el.dataset.fxInit;
    if(firstShow) prepareReveal(el);
    el.classList.add('active');
    window.scrollTo({top:0,behavior:REDUCE_MOTION?'auto':'smooth'});
    if(firstShow){ el.dataset.fxInit='1'; observeReveal(el); initCountUp(el); }
    typeRoles();
    setProgressActive(el.id!=='page-landing');
}
window.addEventListener('hashchange', ()=>{
    const id = location.hash.slice(1) || 'landing';
    showPage(id);
});
window.addEventListener('load', ()=>{
    const id = location.hash.slice(1) || 'landing';
    showPage(id);
    initCarousel('beauty-carousel');
    initCarousel('fintech-carousel');
    initCarousel('pet-carousel');
    initCarousel('jobmate-carousel');
    initLottie();
});

// Contact Modal
let _contactType = '일반 문의';
function openContact(){
    document.getElementById('contact-modal').style.display='flex';
    // 문의 유형 버튼 이벤트
    document.querySelectorAll('.c-type-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.c-type-btn').forEach(b => {
                b.style.background = 'var(--bg)'; b.style.color = 'var(--text)'; b.style.borderColor = 'var(--border)';
            });
            btn.style.background = 'var(--accent)'; btn.style.color = 'var(--bg)'; btn.style.borderColor = 'var(--accent)';
            _contactType = btn.dataset.type;
        };
    });
    // 기본 선택 표시
    const first = document.querySelector('.c-type-btn.active');
    if (first) { first.style.background = 'var(--accent)'; first.style.color = 'var(--bg)'; first.style.borderColor = 'var(--accent)'; }
    // 이메일 도메인 드롭다운 연동
    const sel = document.getElementById('c-email-domain');
    const custom = document.getElementById('c-email-custom');
    if (sel && custom) {
        sel.onchange = () => {
            if (sel.value === 'custom') {
                sel.style.display = 'none';
                custom.style.display = 'block';
                custom.value = '';
                custom.focus();
            }
        };
        custom.onblur = () => {
            if (!custom.value.trim()) {
                custom.style.display = 'none';
                sel.style.display = 'block';
                sel.value = '';
            }
        };
    }
}
function closeContact(){document.getElementById('contact-modal').style.display='none';document.getElementById('c-status').style.display='none';var w=document.getElementById('contact-success-wrap');if(w)w.style.display='none';}

const SHEET_URL = "https://script.google.com/macros/s/AKfycbyZDufcSXptCX11FbzDkmRa5xWeUxDl-ojPUl9SkyQyUrsXwO0Nb0spiixecCbS6hcRlg/exec";

async function submitContact(){
    const eid=document.getElementById('c-email-id').value.trim();
    const sel=document.getElementById('c-email-domain');
    const edom = sel.value === 'custom' ? document.getElementById('c-email-custom').value.trim() : sel.value;
    const email = eid && edom ? eid + '@' + edom : '';
    const content=document.getElementById('c-content').value.trim();
    const status=document.getElementById('c-status');
    const btn=document.getElementById('c-submit');
    const subject = _contactType;

    if(!content){
        status.textContent='문의 내용을 입력해주세요.';status.style.color='#FF6B6B';status.style.display='block';return;
    }

    var _hp=document.getElementById('c-website');
    if(_hp && _hp.value){ status.textContent='전송 완료!';status.style.color='var(--accent)';status.style.display='block';setTimeout(function(){closeContact();},1500);return; }
    try{ var _last=parseInt(localStorage.getItem('c-last')||'0',10); if(Date.now()-_last<30000){ status.textContent='잠시 후 다시 시도해 주세요.';status.style.color='#FF6B6B';status.style.display='block';return; } }catch(_e){}

    btn.disabled=true;btn.textContent='전송 중...';status.style.display='none';

    if(navigator.onLine===false){
        status.textContent='네트워크 연결을 확인해 주세요.';status.style.color='#FF6B6B';status.style.display='block';
        btn.disabled=false;btn.textContent='문의 보내기';return;
    }
    // 느린 Apps Script 응답을 기다리지 않고 백그라운드로 전송 → 전송완료 즉시 표시 (no-cors라 응답 내용은 어차피 못 읽음)
    fetch(SHEET_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({email: email || '(미입력)',subject,content})}).catch(function(){});
    try{ localStorage.setItem('c-last', String(Date.now())); }catch(_e){}

    status.textContent='전송 완료! 이메일을 남기셨다면 빠른 시일 내 회신드리겠습니다.';status.style.color='var(--accent)';status.style.display='block';
    playContactSuccess();
    document.getElementById('c-email-id').value='';document.getElementById('c-email-domain').value='';document.getElementById('c-email-domain').style.display='block';document.getElementById('c-email-custom').value='';document.getElementById('c-email-custom').style.display='none';document.getElementById('c-content').value='';
    btn.disabled=false;btn.textContent='문의 보내기';
    setTimeout(()=>closeContact(),3000);
}

// ═══ Lottie motion graphics (lottie-web / bodymovin) ═══
var _lotties={};
function buildLottie(container,file,opts){
    opts=opts||{};
    if(!window.lottie||!container)return null;
    var anim=lottie.loadAnimation({
        container:container,renderer:'svg',loop:opts.loop!==false,autoplay:false,
        path:'lottie/'+file+'.json',
        rendererSettings:opts.preserve?{preserveAspectRatio:opts.preserve}:undefined
    });
    anim.addEventListener('DOMLoaded',function(){
        if(REDUCE_MOTION){var f=opts.still!=null?Math.min(opts.still,anim.totalFrames-1):(anim.totalFrames-1);anim.goToAndStop(f,true);return;}
        if(opts.autoplay!==false&&!opts.playOnView)anim.play();
    });
    return anim;
}
function initLottie(){
    if(!window.lottie)return;
    var hero=document.getElementById('lottie-hero');
    if(hero&&!hero.dataset.init){hero.dataset.init='1';buildLottie(hero,'hero-flow',{loop:true,still:175});var poster=document.querySelector('.hero-poster');if(poster&&!REDUCE_MOTION)poster.style.display='none';}
    var cs=document.getElementById('lottie-contact');
    if(cs&&!cs.dataset.init){cs.dataset.init='1';_lotties.contact=buildLottie(cs,'contact-success',{loop:false,playOnView:true,still:9999});}
}
function playContactSuccess(){
    var wrap=document.getElementById('contact-success-wrap');if(wrap)wrap.style.display='flex';
    if(_lotties.contact&&!REDUCE_MOTION)_lotties.contact.goToAndPlay(0,true);
}

// 이미지 라이트박스 (Work 갤러리 이미지 클릭 확대)
document.addEventListener('click',function(e){var box=document.getElementById('img-lightbox');if(!box)return;var g=e.target.closest?e.target.closest('.gi img'):null;if(g){box.querySelector('img').src=g.currentSrc||g.src;box.classList.add('on');return;}if(box.classList.contains('on')&&box.contains(e.target)){box.classList.remove('on');}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var b=document.getElementById('img-lightbox');if(b)b.classList.remove('on');}});
