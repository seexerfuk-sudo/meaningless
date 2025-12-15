
// ==========================================================
// 1️⃣ Fluid Particles (Background)
// ==========================================================
(function(){
  const canvas = document.getElementById("canvas");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

 const bg = new Image();
const isMobile = window.innerWidth <= 768;

bg.src = isMobile ? 'asset/mobile.png' : 'asset/deskop.png';

bg.onload = () => {
  const canvas = document.getElementById('orbitCanvas');
  const ctx = canvas.getContext('2d');

  // sesuaikan ukuran canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // gambar background
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
};


  bg.onload = () => {
    const num = 3500;
    const dots = [];
    const mouse = { x: w/2, y: h/2 };
    let targetX = mouse.x;
    let targetY = mouse.y;
    const voidRadius = 50;

    for(let i=0; i<num; i++){
      const phase = Math.random()*Math.PI*2;
      const size = Math.random()*1.4+0.6;
      const angle = Math.random()*Math.PI*2;
      const r = Math.pow(Math.random(),1.6)*Math.max(w,h)/2;
      const homeX = w/2 + Math.cos(angle)*r;
      const homeY = h/2 + Math.sin(angle)*r;
      dots.push({x:homeX,y:homeY,homeX,homeY,vx:0,vy:0,size,phase});
    }

    function handleMove(x,y){ targetX = x; targetY = y; }
    window.addEventListener("mousemove", e=>handleMove(e.clientX,e.clientY));
    window.addEventListener("touchmove", e=>{if(e.touches.length) handleMove(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});

    function updateCursor(){
      mouse.x += (targetX - mouse.x)*0.12;
      mouse.y += (targetY - mouse.y)*0.12;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    function animate(){
      ctx.drawImage(bg, 0, 0, w, h);

      for(let d of dots){
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.hypot(dx,dy);

        if(dist < 400){d.vx+=dx*0.001; d.vy+=dy*0.001;}
        if(dist < voidRadius){ d.vx -= dx*0.18; d.vy -= dy*0.18; }

        d.vx += (d.homeX-d.x)*0.0006;
        d.vy += (d.homeY-d.y)*0.0006;
        d.vx += Math.cos(d.phase)*0.05;
        d.vy += Math.sin(d.phase)*0.05;
        d.phase += 0.04;
        d.vx *= 0.9; d.vy *= 0.9;
        d.x += d.vx; d.y += d.vy;

        ctx.beginPath();
        ctx.fillStyle = "rgba(248,248,248,0.95)";
        ctx.arc(d.x,d.y,d.size,0,Math.PI*2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", ()=>{
      w=canvas.width=window.innerWidth;
      h=canvas.height=window.innerHeight;
      mouse.x=w/2; mouse.y=h/2;
    });
  };
})();


// ==========================================================
// 2️⃣ Orbit Dots + Trail
// ==========================================================
(function(){
  const canvas = document.getElementById('orbitCanvas'); 
  const you = document.getElementById("you");
  if(!canvas || !you) return;

  const ctx = canvas.getContext('2d'); 
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  let mouseX = w/2;
  let mouseY = h/2;
  const dotsCount = 6;
  const radius = 35;
  let angleOffset = 0;
  const followSpeed = 0.1;
  const trails = Array(dotsCount).fill().map(() => []);

  window.addEventListener("mousemove", e=>{mouseX=e.clientX; mouseY=e.clientY;});
  window.addEventListener("touchmove", e=>{if(e.touches.length){mouseX=e.touches[0].clientX; mouseY=e.touches[0].clientY;}},{passive:true});

  function drawOrbit(){
    ctx.clearRect(0,0,w,h);

    let centerX = parseFloat(you.style.left)||w/2;
    let centerY = parseFloat(you.style.top)||h/2;
    centerX += (mouseX - centerX)*followSpeed;
    centerY += (mouseY - centerY)*followSpeed;
    you.style.left = centerX+"px";
    you.style.top = centerY+"px";

    angleOffset += 0.06;

    for(let i=0;i<dotsCount;i++){
      const angle = angleOffset + (i*(Math.PI*2))/dotsCount;
      const x = centerX + Math.cos(angle)*radius;
      const y = centerY + Math.sin(angle)*radius;

      trails[i].push({x, y});
      if(trails[i].length > 9) trails[i].shift();

      trails[i].forEach((pos, idx) => {
        const alpha = (idx+1)/trails[i].length * 0.6; 
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(pos.x, pos.y, 2, 0, Math.PI*2);
        ctx.fill();
      });

      ctx.beginPath();
      ctx.fillStyle="#ffffff";
      ctx.shadowColor="#ffffff";
      ctx.shadowBlur=15;
      ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fill();
      ctx.shadowBlur=0;
    }

    requestAnimationFrame(drawOrbit);
  }

  drawOrbit();
})();


// ==========================================================
// 3️⃣ Nihil Words "YOU"
// ==========================================================
(function(){
  const nihilWords = ["VOID","NONE","NULL","FATE","DUMB","LOSS","MOOD"];
  const youEl = document.getElementById("you");
  let currentIndex = 0;

  function fadeChange() {
    youEl.style.transition = "opacity 0.2s ease";
    youEl.style.opacity = 0;
    setTimeout(() => {
      currentIndex = Math.floor(Math.random() * nihilWords.length);
      youEl.textContent = nihilWords[currentIndex];
      youEl.style.opacity = 1;
    }, 500);
  }

  setInterval(fadeChange, 2000);
})();


// ==========================================================
// 4️⃣ Crosshair + YOU Follow
// ==========================================================
(function(){
  const crossCanvas = document.createElement('canvas');
  crossCanvas.id = 'crossCanvas';
  crossCanvas.style.position = 'fixed';
  crossCanvas.style.top = '0';
  crossCanvas.style.left = '0';
  crossCanvas.style.pointerEvents = 'none';
  crossCanvas.style.zIndex = '9999';
  document.body.appendChild(crossCanvas);

  const ctx = crossCanvas.getContext('2d');
  let w = crossCanvas.width = window.innerWidth;
  let h = crossCanvas.height = window.innerHeight;

const youEl = document.querySelector(".you");
document.body.style.cursor = 'none';
 // sembunyikan cursor asli

  let mouseX = w/2;
  let mouseY = h/2;

  window.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener("touchmove", e => { if(e.touches.length){ mouseX=e.touches[0].clientX; mouseY=e.touches[0].clientY; } }, {passive:true});

  function drawCross(){
    ctx.clearRect(0,0,w,h);

    // Garis horizontal & vertikal
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 0.5;

    ctx.beginPath(); ctx.moveTo(0, mouseY); ctx.lineTo(w, mouseY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mouseX, 0); ctx.lineTo(mouseX, h); ctx.stroke();

    requestAnimationFrame(drawCross);
  }
  drawCross();

  window.addEventListener("resize", () => {
    w = crossCanvas.width = window.innerWidth;
    h = crossCanvas.height = window.innerHeight;
  });

  // Sinkronisasi YOU dengan crosshair
  function followYou(){
    youEl.style.left = mouseX + 'px';
    youEl.style.top = mouseY + 'px';
    requestAnimationFrame(followYou);
  }
  followYou();
})();
