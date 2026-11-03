(function(){
  var $=function(id){return document.getElementById(id);};
  var yr=$('yr'); if(yr) yr.textContent=new Date().getFullYear();

  // reveal
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
    [].forEach.call(document.querySelectorAll('.rv'),function(el){if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el);}});
  }

  // links
  function link(id,url,fallback){var a=$(id); if(!a)return; if(url){a.href=url;a.target='_blank';a.rel='noopener';}else{a.href=fallback||'contact.html';a.removeAttribute('target');a.classList.add('dim');a.title='Coming soon';}}
  link('l-spotify',SITE.spotify); link('l-apple',SITE.appleMusic); link('l-youtube',SITE.youtube); if(SITE.podcast){link('l-podcast',SITE.podcast);var lp=$('l-podcast');if(lp)lp.textContent='Listen on Spotify';}else{var lp2=$('l-podcast');if(lp2)lp2.href='contact.html?about=Something%20else';}

  // spotify embeds
  function spot(boxId,url,h){var box=$(boxId); if(!box)return false;
    var m=(url||'').match(/open\.spotify\.com\/(artist|album|track|playlist|show|episode)\/([A-Za-z0-9]+)/);
    if(!m)return false; box.hidden=false;
    box.innerHTML='<iframe title="Spotify player" src="https://open.spotify.com/embed/'+m[1]+'/'+m[2]+'?theme=0" height="'+h+'" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    return true;}
  spot('spotify-embed',SITE.spotify,452);
  spot('spotify-mini',SITE.spotify,352);
  if(spot('podcast-embed',SITE.podcast,352)){var pe=$('podcast-empty'); if(pe) pe.hidden=true;}
  var pn=$('podcast-name'); if(pn&&SITE.podcastName) pn.textContent=SITE.podcastName;

  // youtube
  var yt=$('yt-box');
  if(yt&&SITE.latestVideoId){yt.innerHTML='<iframe title="Latest video" src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(SITE.latestVideoId)+'" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>';}

  // video gallery
  var vg=$('vids');
  if(vg&&SITE.videos){
    var idOf=function(u){var m=(u||'').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/); return m?m[1]:'';};
    var play=function(id,btn){if(!yt)return; yt.innerHTML='<iframe title="Video" src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1" allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      [].forEach.call(vg.children,function(c){c.classList.toggle('on',c===btn);}); yt.scrollIntoView({behavior:'smooth',block:'center'});};
    SITE.videos.forEach(function(v){var id=idOf(v.link); if(!id)return;
      var b=document.createElement('button'); b.type='button'; b.className='vid'+(id===SITE.latestVideoId?' on':'');
      b.innerHTML='<span class="th"></span><span class="vt"></span>';
      b.querySelector('.th').style.backgroundImage='url(https://i.ytimg.com/vi/'+id+'/hqdefault.jpg)';
      b.querySelector('.vt').textContent=v.title||'Watch'; b.setAttribute('aria-label','Play '+(v.title||'video'));
      b.addEventListener('click',function(){play(id,b);}); vg.appendChild(b);});
  }

  // unreleased player
  var list=$('vlist'), au=$('vaudio');
  if(list&&au){
    var cur=-1, rows=[];
    var fmt=function(t){if(!isFinite(t))return '--:--'; var m=Math.floor(t/60), s=Math.floor(t%60); return m+':'+(s<10?'0':'')+s;};
    SITE.unreleased.forEach(function(t,i){
      var li=document.createElement('li');
      li.innerHTML='<button type="button" class="vrow"><span class="vbtn" aria-hidden="true">▶</span><span><span class="vt"></span><span class="vn"></span></span><span class="vtime">--:--</span></button><div class="vbar"><i></i></div>';
      li.querySelector('.vt').textContent=t.title; li.querySelector('.vn').textContent=t.note||'';
      var btn=li.querySelector('.vrow'); btn.setAttribute('aria-label','Play '+t.title);
      list.appendChild(li); rows.push(li);
      var probe=new Audio(); probe.preload='metadata'; probe.src=t.file;
      probe.addEventListener('loadedmetadata',function(){li.querySelector('.vtime').textContent=fmt(probe.duration);});
      probe.addEventListener('error',function(){btn.classList.add('off'); btn.disabled=true; li.querySelector('.vtime').textContent='Dropping soon';});
      btn.addEventListener('click',function(){ if(cur===i){au.paused?au.play():au.pause();return;} cur=i; au.src=t.file; au.play(); });
    });
    var paint=function(){rows.forEach(function(li,i){var on=i===cur&&!au.paused; li.querySelector('.vrow').classList.toggle('on',i===cur); li.querySelector('.vbtn').textContent=on?'❚❚':'▶';});};
    au.addEventListener('play',paint); au.addEventListener('pause',paint);
    au.addEventListener('ended',function(){var n=cur+1; while(n<rows.length&&rows[n].querySelector('.vrow').disabled)n++; if(n<rows.length){cur=n; au.src=SITE.unreleased[n].file; au.play();} else paint();});
    au.addEventListener('timeupdate',function(){if(cur<0)return; var p=au.duration?au.currentTime/au.duration*100:0; rows[cur].querySelector('.vbar i').style.width=p+'%'; rows[cur].querySelector('.vtime').textContent=fmt(au.currentTime)+' / '+fmt(au.duration);});
  }

  // shop
  var grid=$('shop-grid');
  if(grid){
    SITE.merch.forEach(function(it,i){
      var id='tc'+i, d=document.createElement('div'); d.className='item';
      d.innerHTML='<div class="tee"><svg viewBox="0 0 300 300" role="img"><defs><clipPath id="'+id+'"><rect x="105" y="95" width="90" height="110" rx="2"/></clipPath></defs>'+
        '<path d="M100 40 L60 55 L20 100 L55 130 L75 112 L75 270 L225 270 L225 112 L245 130 L280 100 L240 55 L200 40 Q150 75 100 40 Z" fill="#0a0a0a"/>'+
        '<path d="M100 40 Q150 75 200 40" fill="none" stroke="#2a2a28" stroke-width="6"/>'+
        '<rect x="105" y="95" width="90" height="110" fill="#1d1d1b"/>'+
        '<text x="150" y="155" text-anchor="middle" fill="#6d6c68" font-family="monospace" font-size="10">ART</text></svg></div>'+
        '<div class="info"><b></b><span class="price"></span></div>';
      d.querySelector('svg').setAttribute('aria-label',it.name+' t-shirt');
      d.querySelector('.info b').textContent=it.name; d.querySelector('.price').textContent=it.price||'';
      var a=document.createElement('a'); a.className='pill'+(it.link?' solid':' dim');
      if(it.link){a.href=it.link;a.target='_blank';a.rel='noopener';a.textContent='Buy';} else {a.href='contact.html?about=Merch';a.textContent='Coming soon';}
      d.appendChild(a); grid.appendChild(d);
      var img=new Image(); img.onload=function(){var NS='http://www.w3.org/2000/svg', im=document.createElementNS(NS,'image');
        im.setAttribute('href',it.art); im.setAttribute('x','105'); im.setAttribute('y','95'); im.setAttribute('width','90'); im.setAttribute('height','110');
        im.setAttribute('preserveAspectRatio','xMidYMid slice'); im.setAttribute('clip-path','url(#'+id+')'); d.querySelector('svg').appendChild(im);}; img.src=it.art;
    });
  }

  // art filters
  var fb=[].slice.call(document.querySelectorAll('.filters button')), pcs=[].slice.call(document.querySelectorAll('.piece'));
  fb.forEach(function(btn){btn.addEventListener('click',function(){
    var k=btn.getAttribute('data-f');
    fb.forEach(function(x){x.setAttribute('aria-pressed',x===btn?'true':'false');});
    pcs.forEach(function(pc){pc.hidden=!(k==='all'||pc.getAttribute('data-kind')===k);});
  });});

  // contact
  var f=$('contact-form');
  if(f){
    var q=new URLSearchParams(location.search).get('about'), sel=$('c-type');
    if(q&&sel){[].forEach.call(sel.options,function(o){if(o.value===q)sel.value=q;});}
    var b=$('c-send'), st=$('c-status');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var bad=f.querySelector(':invalid'); if(bad){st.textContent='Fill in your name, email and message.'; bad.focus(); return;}
      b.disabled=true; b.textContent='Sending...'; st.textContent='';
      fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}})
        .then(function(r){if(!r.ok)throw 0; f.reset(); b.textContent='Sent'; st.textContent="Got it. I'll get back to you.";})
        .catch(function(){b.disabled=false; b.textContent='Send it'; st.textContent="That didn't send. Hit me on Instagram @jonswaii instead.";});
    });
  }
})();

/* ink canvas on the home hero */
(function(){
  var cv=document.getElementById('ink'); if(!cv) return;
  var stage=document.getElementById('stage'), hint=document.getElementById('hint'), ctx=cv.getContext('2d');
  var dpr=Math.min(window.devicePixelRatio||1,2), W=0, H=0, strokes=[], cur=null, raf=0, LIFE=4200;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){var r=stage.getBoundingClientRect(); W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);}
  size(); addEventListener('resize',size);
  function pt(e){var r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()};}
  function start(e){cur={pts:[pt(e)],red:Math.random()<.25,w:1.4+Math.random()*1.2}; strokes.push(cur); if(hint)hint.classList.add('gone'); loop();}
  cv.addEventListener('pointerdown',function(e){start(e);});
  cv.addEventListener('pointermove',function(e){
    if(e.pointerType==='mouse'&&!cur){ start(e); }
    if(!cur) return; var p=pt(e), l=cur.pts[cur.pts.length-1];
    if(Math.abs(p.x-l.x)+Math.abs(p.y-l.y)>2){cur.pts.push(p); loop();}
  });
  ['pointerup','pointercancel','pointerleave'].forEach(function(n){cv.addEventListener(n,function(){cur=null;});});
  function draw(){
    var now=performance.now(); ctx.clearRect(0,0,W,H);
    strokes=strokes.filter(function(s){return s.pts.length&&now-s.pts[s.pts.length-1].t<LIFE;});
    strokes.forEach(function(s){
      var p=s.pts; if(p.length<2) return;
      for(var i=1;i<p.length;i++){
        var age=(now-p[i].t)/LIFE, a=Math.max(0,1-age);
        ctx.strokeStyle=s.red?'rgba(208,2,27,'+a+')':'rgba(10,10,10,'+(a*.85)+')';
        ctx.lineWidth=s.w*(0.7+0.6*Math.sin(i*.7)); ctx.lineCap='round';
        ctx.beginPath(); var m0=i>1?{x:(p[i-2].x+p[i-1].x)/2,y:(p[i-2].y+p[i-1].y)/2}:p[0];
        var m1={x:(p[i-1].x+p[i].x)/2,y:(p[i-1].y+p[i].y)/2};
        ctx.moveTo(m0.x,m0.y); ctx.quadraticCurveTo(p[i-1].x,p[i-1].y,m1.x,m1.y); ctx.stroke();
      }
    });
    return strokes.length>0;
  }
  function loop(){ if(raf) return; raf=requestAnimationFrame(function step(){ raf=0; if(draw()&&!reduce) raf=requestAnimationFrame(step); }); }
  // one auto-scribble so the page feels alive
  if(!reduce){
    var t0=performance.now(), auto={pts:[],red:true,w:2.2}; strokes.push(auto);
    (function sc(){
      var k=(performance.now()-t0)/1400; if(k>1){loop();return;}
      var x=W*(.08+.84*k), y=H*.62+Math.sin(k*18)*H*.05+Math.sin(k*5)*H*.04;
      auto.pts.push({x:x,y:y,t:performance.now()}); draw(); requestAnimationFrame(sc);
    })();
  }
})();
