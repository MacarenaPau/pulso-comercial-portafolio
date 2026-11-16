// A luminous, folded ribbon and three tilted orbits, projected onto a canvas.
function dibujarPulso(canvas,boton){
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const tau=2*Math.PI;
 let frame;
 function paint(time){
  const t=reduced.matches?0:time/1800,active=boton.getAttribute('aria-pressed')==='true';
  ctx.clearRect(0,0,400,400);ctx.save();ctx.translate(200,195);
  const halo=ctx.createRadialGradient(0,0,3,0,0,170);
  halo.addColorStop(0,'rgba(80,255,193,.19)');halo.addColorStop(1,'rgba(0,80,75,0)');
  ctx.fillStyle=halo;ctx.fillRect(-200,-195,400,400);
  for(let j=0;j<56;j++){
   const v=j/55;
   ctx.beginPath();
   for(let i=0;i<=180;i++){
    const a=tau*i/180,r=(47+v*33)*(1+.22*Math.cos(4*a+t*.6));
    const x=r*Math.cos(a),y=r*Math.sin(a);
    const z=28*Math.sin(2*a+t+v*2.3);
    const px=x*.90+z*.39,py=y*.89+z*.48;
    if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
   }
   ctx.lineWidth=1;ctx.strokeStyle='hsla('+ (153+v*23)+',85%,'+(60+32*v)+'%,'+(.13+.45*Math.pow(Math.sin(Math.PI*v),2))+')';ctx.stroke();
  }
  for(let j=0;j<3;j++){
   ctx.save();ctx.rotate(j*Math.PI/3+.14*Math.sin(t*.4));ctx.strokeStyle='rgba(176,248,221,.65)';
   ctx.beginPath();ctx.ellipse(0,0,124,53+j*4,0,0,tau);ctx.stroke();
   const a=t*(active?1.8:.65)+j*2;ctx.shadowBlur=12;ctx.shadowColor='#97ffce';ctx.fillStyle='#d6ffe5';ctx.beginPath();ctx.arc(124*Math.cos(a),(53+j*4)*Math.sin(a),3,0,tau);ctx.fill();ctx.restore();
  }
  ctx.restore();if(!reduced.matches&&!document.hidden)frame=requestAnimationFrame(paint);
 }
 function refresh(){cancelAnimationFrame(frame);paint(performance.now());}
 document.addEventListener('visibilitychange',refresh);reduced.addEventListener('change',refresh);refresh();
}
