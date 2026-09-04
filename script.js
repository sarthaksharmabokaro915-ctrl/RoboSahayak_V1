(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Always enter every webpage at the very top.
  // Covers normal navigation, reloads, BFCache restores and browser history traversal.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const forceTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  forceTop();
  window.addEventListener('pageshow', forceTop);
  window.addEventListener('pagehide', () => window.scrollTo(0, 0), {passive:true});
  const fine = window.matchMedia('(pointer:fine)').matches;

  // ---------- Premium loading (original RoboSahayak loader) ----------
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = `<div class="loader-inner"><div class="loader-reactor"><i></i><b></b></div><img class="loader-mark" src="assets/RoboSahayak_final_logo.jpeg" alt="RoboSahayak"><div class="loader-name">ROBO<br>SAHAYAK</div><div class="loader-status"><span class="sound-dot"></span>TECHNO FUSION • SYSTEM INITIALIZING</div><div class="loader-bar"><i></i></div><div class="loader-percent">0%</div></div>`;
  document.body.prepend(loader);
  const percent = loader.querySelector('.loader-percent');
  const start = performance.now();
  const duration = reduce ? 260 : 1200;
  const loaderTick = now => {
    const p = Math.min(100, Math.round(((now - start) / duration) * 100));
    if (percent) percent.textContent = p + '%';
    if (p < 100) requestAnimationFrame(loaderTick);
  };
  requestAnimationFrame(loaderTick);
  const hideLoader = () => loader.classList.add('hide');
  window.addEventListener('load', () => setTimeout(hideLoader, reduce ? 60 : 700), {once:true});
  setTimeout(hideLoader, reduce ? 400 : 1700);

  // ---------- Neon atmosphere ----------
  const atmosphere = document.createElement('div');
  atmosphere.className = 'neon-atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  atmosphere.innerHTML = '<span class="energy e1"></span><span class="energy e2"></span><span class="energy e3"></span><span class="energy e4"></span><span class="energy e5"></span>';
  document.body.prepend(atmosphere);

  // ---------- Lightweight electrons/protons canvas ----------
  const canvas = document.createElement('canvas');
  canvas.className = 'ambient-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d', {alpha:true});
  let particles = [], w = 0, h = 0, dpr = 1;
  const colors = {electron:'#43f5ff', proton:'#ff49d8', gold:'#ffd76a'};
  function resizeParticles(){
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(reduce){particles=[];return;}
    const count = w < 500 ? 8 : w < 900 ? 12 : Math.min(22, Math.max(12, Math.floor(w*h/85000)));
    particles = Array.from({length:count},(_,i)=>({
      type:i%4===0?'proton':'electron', x:Math.random()*w, y:Math.random()*h,
      vx:(Math.random()-.5)*.13, vy:(Math.random()-.5)*.13,
      r:i%4===0?2.2+Math.random()*1.1:1.3+Math.random()*1.2,
      phase:Math.random()*Math.PI*2, speed:.006+Math.random()*.008, orbit:18+Math.random()*58
    }));
  }
  function drawParticles(){
    if(reduce) return;
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.phase += p.speed;
      p.x += p.vx + Math.cos(p.phase)*.025;
      p.y += p.vy + Math.sin(p.phase*1.13)*.025;
      if(p.x<-24)p.x=w+24;if(p.x>w+24)p.x=-24;if(p.y<-24)p.y=h+24;if(p.y>h+24)p.y=-24;
      const c=colors[p.type];
      ctx.globalAlpha=.11;ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,p.r*4.5,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=.78;ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=.12;ctx.strokeStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,p.orbit,p.phase,p.phase+Math.PI*.65);ctx.stroke();
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(drawParticles);
  }
  resizeParticles();
  window.addEventListener('resize', resizeParticles, {passive:true});
  if(!reduce) requestAnimationFrame(drawParticles);

  // ---------- Navigation ----------
  const menu=document.querySelector('.menu'), links=document.querySelector('.links');
  const closeMenu=()=>{links?.classList.remove('open');menu?.setAttribute('aria-expanded','false');};
  if(menu&&links) menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',closeMenu));
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.links a').forEach(a=>{if((a.getAttribute('href')||'').toLowerCase()===current)a.classList.add('active');});

  // ---------- Scroll reveal ----------
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target);}}),{threshold:.07,rootMargin:'0px 0px -24px'});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('show'));

  // ---------- Desktop cursor ----------
  if(fine&&!reduce){
    const cursor=document.querySelector('.cursor');
    if(cursor){let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
      addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;document.body.style.setProperty('--mx',tx+'px');document.body.style.setProperty('--my',ty+'px');},{passive:true});
      const tick=()=>{x+=(tx-x)*.18;y+=(ty-y)*.18;cursor.style.left=x+'px';cursor.style.top=y+'px';requestAnimationFrame(tick);};tick();
    }
  }

  // ---------- Scroll beam ----------
  const progress=document.createElement('div');progress.className='scroll-beam';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
  let scrollQueued=false;
  const updateProgress=()=>{scrollQueued=false;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%';};
  addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});updateProgress();

  // ---------- Background music ----------
  // Music is created early and its playback position is preserved across page loads,
  // so the track can continue underneath the loading screen instead of restarting.
  const music = document.createElement('audio');
  music.className = 'robo-music';
  music.loop = true;
  music.preload = 'auto';
  music.setAttribute('aria-hidden', 'true');
  music.src = 'assets/RoboSahayak_background_music.mp3';
  document.body.appendChild(music);

  let musicOn = localStorage.getItem('roboMusic') === 'on';
  const savedMusicTime = Number(localStorage.getItem('roboMusicTime') || 0);
  let musicBaseVolume = 0.72;
  let videoDucked = false;
  music.volume = musicBaseVolume;

  const musicBtn = document.createElement('button');
  musicBtn.className = 'music-toggle music-button';
  musicBtn.type = 'button';
  musicBtn.setAttribute('aria-label', 'Toggle RoboSahayak background music');
  const updateMusicButton = () => {
    musicBtn.textContent = musicOn ? '♫ MUSIC ON' : '♫ MUSIC OFF';
    musicBtn.classList.toggle('on', musicOn);
    musicBtn.setAttribute('aria-pressed', String(musicOn));
  };
  updateMusicButton();
  document.body.appendChild(musicBtn);

  const restoreMusicPosition = () => {
    if (!Number.isFinite(savedMusicTime) || savedMusicTime <= 0) return;
    const apply = () => {
      try {
        if (music.duration && Number.isFinite(music.duration)) {
          music.currentTime = Math.min(savedMusicTime, Math.max(0, music.duration - 0.05));
        }
      } catch (_) {}
    };
    if (music.readyState >= 1) apply();
    else music.addEventListener('loadedmetadata', apply, {once:true});
  };
  restoreMusicPosition();

  const startMusic = async () => {
    if (!musicOn) return;
    try {
      restoreMusicPosition();
      const activeVideo = Array.from(document.querySelectorAll('video')).some(v => !v.paused && !v.ended);
      music.volume = activeVideo ? 0.14 : musicBaseVolume;
      videoDucked = activeVideo;
      await music.play();
    } catch (_) {
      // Autoplay can still be blocked until the visitor interacts with the page.
    }
  };

  musicBtn.addEventListener('click', async () => {
    musicOn = !musicOn;
    localStorage.setItem('roboMusic', musicOn ? 'on' : 'off');
    updateMusicButton();
    if (musicOn) {
      await startMusic();
    } else {
      music.pause();
      music.currentTime = 0;
      localStorage.removeItem('roboMusicTime');
    }
  });

  // Attempt immediately so enabled music can run during the loading screen.
  if (musicOn) {
    startMusic();
    const resumeMusic = () => {
      startMusic();
      document.removeEventListener('pointerdown', resumeMusic);
      document.removeEventListener('keydown', resumeMusic);
    };
    document.addEventListener('pointerdown', resumeMusic, {once:true, passive:true});
    document.addEventListener('keydown', resumeMusic, {once:true});
  }

  // Preserve the exact playback position when navigating to another page.
  const saveMusicPosition = () => {
    if (musicOn && !music.paused && Number.isFinite(music.currentTime)) {
      localStorage.setItem('roboMusicTime', String(music.currentTime));
    }
  };
  setInterval(saveMusicPosition, 900);
  addEventListener('pagehide', saveMusicPosition, {passive:true});
  addEventListener('beforeunload', saveMusicPosition, {passive:true});

  // ---------- Video audio ducking ----------
  // When a RoboSahayak showcase video is playing, lower the background music.
  const duckMusic = () => {
    if (!musicOn || music.paused) return;
    videoDucked = true;
    music.volume = 0.14;
  };
  const restoreMusicVolume = () => {
    if (!videoDucked) return;
    videoDucked = false;
    music.volume = musicBaseVolume;
  };
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', duckMusic);
    video.addEventListener('pause', restoreMusicVolume);
    video.addEventListener('ended', restoreMusicVolume);
  });

  // Reserve space at the bottom so fixed controls never cover the final visual/footer effect.
  const scrollClearance = document.createElement('div');
  scrollClearance.className = 'scroll-control-clearance';
  scrollClearance.setAttribute('aria-hidden', 'true');
  document.body.appendChild(scrollClearance);

  // ---------- Auto-scroll ----------
  const autoBtn = document.createElement('button');
  autoBtn.className = 'auto-scroll-toggle';
  autoBtn.type = 'button';
  autoBtn.setAttribute('aria-label', 'Start automatic page scrolling');
  autoBtn.setAttribute('aria-pressed', 'false');
  let autoScroll = false;
  let autoFrame = 0;
  let lastAutoTime = 0;
  const AUTO_SPEED = 420; // pixels per second — TV end-credit style, frame-rate independent
  const updateAutoButton = () => {
    autoBtn.textContent = autoScroll ? '↕ AUTO SCROLL • ON' : '↕ AUTO SCROLL';
    autoBtn.classList.toggle('on', autoScroll);
    autoBtn.setAttribute('aria-pressed', String(autoScroll));
    autoBtn.setAttribute('aria-label', autoScroll ? 'Stop automatic page scrolling' : 'Start automatic page scrolling');
  };
  updateAutoButton();
  document.body.appendChild(autoBtn);

  const stopAutoScroll = () => {
    if (!autoScroll) return;
    autoScroll = false;
    cancelAnimationFrame(autoFrame);
    lastAutoTime = 0;
    updateAutoButton();
  };
  const autoStep = now => {
    if (!autoScroll) return;
    if (!lastAutoTime) lastAutoTime = now;
    const dt = Math.min(16.667, now - lastAutoTime);
    lastAutoTime = now;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const next = Math.min(max, window.scrollY + AUTO_SPEED * dt / 1000);
    window.scrollTo(0, next);
    if (next >= max - 1) { stopAutoScroll(); return; }
    autoFrame = requestAnimationFrame(autoStep);
  };
  autoBtn.addEventListener('click', () => {
    if (autoScroll) { stopAutoScroll(); return; }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 2) return;
    autoScroll = true;
    lastAutoTime = 0;
    updateAutoButton();
    autoFrame = requestAnimationFrame(autoStep);
  });
  // Manual user input takes control immediately.
  ['wheel','touchstart','pointerdown','keydown'].forEach(type => {
    document.addEventListener(type, e => {
      if (e.target === autoBtn || autoBtn.contains(e.target)) return;
      if (type === 'keydown' && ['Tab','Shift','Control','Alt','Meta'].includes(e.key)) return;
      stopAutoScroll();
    }, {passive:true});
  });

  // ---------- Page transitions ----------
  const transition=document.createElement('div');transition.className='page-transition';document.body.appendChild(transition);
  document.querySelectorAll('a[href]').forEach(a=>{const href=a.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto:')||href.startsWith('tel:'))return;a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();transition.classList.add('on');setTimeout(()=>location.href=href,220);});});

  // ---------- Radar + counters ----------
  document.querySelectorAll('[data-radar]').forEach(host=>host.innerHTML='<div class="radar" aria-label="Animated radar visualization"></div>');
  document.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count);let done=false;const ob=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!done){done=true;if(reduce){el.textContent=target;ob.disconnect();return;}let n=0;const timer=setInterval(()=>{n=Math.min(target,n+Math.max(1,Math.ceil(target/28)));el.textContent=n;if(n>=target)clearInterval(timer);},28);ob.disconnect();}});ob.observe(el);});

  // ---------- Real feedback delivery to Gmail via FormSubmit ----------
  document.querySelectorAll('form').forEach(form => form.addEventListener('submit', async e => {
    const live = form.querySelector('.form-status,[aria-live]');
    if (!form.matches('[data-feedback-form]')) {
      e.preventDefault();
      if (live) live.textContent = 'This form is ready for a backend connection.';
      return;
    }

    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    if (button) { button.disabled = true; button.setAttribute('aria-busy','true'); }
    if (live) live.textContent = 'Sending feedback…';

    const endpoint = 'https://formsubmit.co/ajax/sarthaksharmabokaro915@gmail.com';
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      // FormSubmit uses the visitor's email as Reply-To. Keeping it explicit
      // also makes the intended reply address clear in the received message.
      if (data.email) data._replyto = data.email;
      if (!data._url && location.href.startsWith('http')) data._url = location.href;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const text = await response.text();
      let result = {};
      try { result = JSON.parse(text); } catch (_) {}
      if (!response.ok || result.success === false) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      form.reset();
      if (live) live.textContent = '✓ Feedback sent successfully. Thank you for helping us improve RoboSahayak!';
    } catch (err) {
      console.error('RoboSahayak feedback submission failed:', err);
      if (live) live.textContent = 'We could not send the feedback. Please make sure the website is hosted online and the FormSubmit activation email has been confirmed.';
    } finally {
      if (button) { button.disabled = false; button.removeAttribute('aria-busy'); }
    }
  }));

})();

/* Premium interactive explorers */
(function(){
  const modeData={
    glove:['MODE 01','Glove Mode','Wearable locomotion and robotic-arm control using Arduino Nano, MPU6050, flex sensors and HC-05',['Arduino Nano','MPU6050','HC-05']],
    mobile:['MODE 02','Mobile Bluetooth Control Mode','App-based robot control through Bluetooth using the RoboSahayak app, HC-05 and Arduino UNO.',['RoboSahayak App','HC-05','Arduino UNO']],
    human:['MODE 03','Human Following Mode','Configured distance-based following behavior using the HC-SR04, Arduino UNO and motors.',['HC-SR04','Arduino UNO','Motors']],
    obstacle:['MODE 04','Obstacle Avoidance Mode','Ultrasonic obstacle detection and avoidance using HC-SR04, Arduino UNO and motor drivers.',['HC-SR04','L298N','Arduino UNO']],
    voice:['MODE 05','Voice Control Mode','Voice-based commands supported through the RoboSahayak mobile application.',['Mobile App','Voice Commands','Bluetooth']]
  };
  document.querySelectorAll('.mode-tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.mode-tab').forEach(x=>x.classList.remove('active')); btn.classList.add('active');
    const d=modeData[btn.dataset.mode];
    const n=document.querySelector('[data-mode-number]'),t=document.querySelector('[data-mode-title]'),c=document.querySelector('[data-mode-copy]');
    if(n)n.textContent=d[0]; if(t)t.textContent=d[1]; if(c)c.textContent=d[2];
    document.querySelectorAll('[data-mode-chip]').forEach((x,i)=>x.textContent=d[3][i]||'');
  }));
  const gloveData={locomotion:['Locomotion Control','MPU6050 tilt controls forward, backward, left and right robot movement.'],arm:['Robotic Arm Control','Index, middle, ring and little fingers control the configured arm movements and gripper.']};
  document.querySelectorAll('[data-glove]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-glove]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    const d=gloveData[btn.dataset.glove]; document.querySelector('[data-glove-title]').textContent=d[0];document.querySelector('[data-glove-copy]').textContent=d[1];
  }));
  const armData={base:['Base / Servo','One of the five SG90 servo actuators used by the robotic arm.'],joint:['Joints / SG90','The SG90 servos provide the configured articulated arm movements.'],stepper:['Stepper / 28BYJ-48','The 28BYJ-48 stepper motor is driven through the ULN2003 driver.'],driver:['PCA9685 + ULN2003','PCA9685 provides PWM servo control while ULN2003 drives the stepper motor.']};
  document.querySelectorAll('[data-arm-part]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-arm-part]').forEach(x=>x.classList.remove('active'));btn.classList.add('active'); const d=armData[btn.dataset.armPart];document.querySelector('[data-arm-title]').textContent=d[0];document.querySelector('[data-arm-copy]').textContent=d[1];
  }));
})();


// Team Contribution typing animation — text is rendered character-by-character when the Team page opens.
(function(){
  const typingItems = document.querySelectorAll('.typing-text[data-typing]');
  if (!typingItems.length) return;
  const typeOne = (el, text, speed, done) => {
    let i = 0;
    el.textContent = '';
    el.classList.add('typing-active');
    const tick = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        window.setTimeout(tick, speed);
      } else {
        el.classList.remove('typing-active');
        if (done) done();
      }
    };
    tick();
  };
  const startTyping = () => {
    let index = 0;
    const next = () => {
      if (index >= typingItems.length) return;
      const el = typingItems[index++];
      typeOne(el, el.dataset.typing || '', 10, () => window.setTimeout(next, 180));
    };
    next();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startTyping, {once:true});
  else startTyping();
})();
