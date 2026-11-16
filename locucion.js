function vozDeJarvis(voces){
 const espanolas=voces.filter(v=>v.localService && /^es(?:$|[-_])/i.test(v.lang));
 const masculina=v=>/\b(jorge|diego|carlos|juan|pablo|andres|andrés|raul|raúl|rodrigo|alonso|tomas|tomás|felipe|gonzalo|paco|pedro|male|masculina)\b/i.test(v.name);
 const disponibles=espanolas.filter(masculina);
 return disponibles.find(v=>/^es[-_]CL(?:$|[-_])/i.test(v.lang))
  || disponibles.find(v=>/^es[-_](MX|419)(?:$|[-_])/i.test(v.lang))
  || disponibles[0] || espanolas.find(v=>/^es[-_]CL/i.test(v.lang)) || espanolas[0];
}

function hablarJarvis(texto){
 const motor=window.speechSynthesis;
 const nota=document.getElementById('voz-disponible');
 const voz=vozDeJarvis(motor?.getVoices()||[]);
 if(!motor||!window.SpeechSynthesisUtterance){
  nota.textContent='Este navegador no ofrece lectura en voz alta. Abre Pulso en Chrome o Safari.';
  return;
 }
 // Read amounts and calendar dates as they would be spoken in Chile.
 const oral=texto.replace(/(\d{2})\/(\d{2})\/(\d{4})/g,(_,d,m,y)=>
  new Intl.DateTimeFormat('es-CL',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'}).format(new Date(Date.UTC(+y,+m-1,+d))))
  .replace(/\$([\d.]+)(?: CLP)?/g,(_,n)=>n.replace(/\./g,'')+' pesos').replace(/ · /g,'. ');
 const mensaje=new window.SpeechSynthesisUtterance(oral);
 if(voz)mensaje.voice=voz;
 mensaje.lang=voz?.lang||'es-CL';mensaje.rate=.96;
 motor.cancel();
 nota.textContent=voz?'Voz de Pulso: '+voz.name+' ('+voz.lang+').':'Usando la voz del sistema con español de Chile solicitado.';
 mensaje.onerror=e=>{if(!['canceled','interrupted'].includes(e.error))nota.textContent='No se pudo reproducir el audio. Revisa el volumen y vuelve a intentarlo.';};
 motor.speak(mensaje);
}
window.speechSynthesis?.getVoices();
