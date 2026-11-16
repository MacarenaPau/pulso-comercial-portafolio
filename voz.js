function interpretarCierre(frase, ahora = new Date()) {
 const texto = frase.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[¿?¡!.,]/g,' ').trim();
 const empresas = [['Casa Nube',/\bcasa nube\b/],['Luz Austral',/\bluz austral\b/]].filter(([,patron])=>patron.test(texto));
 if(empresas.length>1) throw Error('Indica una sola empresa por consulta.');
 const simplificar=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]/g,'').replace(/\bo higgins\b/g,'ohiggins');
 const nombres=Object.entries(state.dir).map(([nombre,entrada])=>[entrada.co,nombre]).filter(([,nombre])=>{
  const clave=simplificar(nombre);
  return (' '+simplificar(texto)+' ').includes(' '+clave+' ');
 });
 const empresa=empresas[0]?.[0];
 const candidatos=nombres.filter(([id])=>!empresa||id===empresa);
 if(nombres.length&&!candidatos.length)throw Error('La sucursal y la empresa no coinciden. Repite la consulta.');
 if(candidatos.length>1)throw Error('Indica la empresa y una sola tienda. Por ejemplo, Aurora de Casa Nube.');
 if(!empresa&&!candidatos.length)throw Error('Indica una tienda, por ejemplo Aurora, o el nombre de la empresa.');
 if(/\bhasta\b|\bhoras?\b|\ba las?\b|\d:\d/.test(texto)) throw Error('Las planillas contienen cierres diarios. Indica un día completo.');
 const meses='enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(' ');
 const dias='uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis diecisiete dieciocho diecinueve veinte veintiuno veintidos veintitres veinticuatro veinticinco veintiseis veintisiete veintiocho veintinueve treinta'.split(' ');
 const anioChile=new Intl.DateTimeFormat('es-CL',{timeZone:'America/Santiago',year:'numeric'}).format(ahora);
 const numeros=texto.replace(/\bdos mil (veintidos|veintitres|veinticuatro|veinticinco|veintiseis)\b/g,(_,n)=>String(2001+dias.indexOf(n))).replace(/treinta y uno/g,'31').replace(/\b[a-z]+\b/g,p=>dias.includes(p)?String(dias.indexOf(p)+1):p);
 const fechas=[...numeros.matchAll(/\b(hoy|ayer)\b|\b(\d{1,2}) de ([a-z]+)(?: (?:del? )?(\d{4}))?\b|\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/g)];
 const mesesDichos=[...numeros.matchAll(new RegExp('\\b('+meses.join('|')+')(?: (?:del? )?(\\d{4}))?\\b','g'))];
 const destino=empresa||candidatos[0][0];
 if(!fechas.length&&mesesDichos.length===1){
  const [,nombre,anio]=mesesDichos[0];
  return [destino,(anio||anioChile)+'-'+String(meses.indexOf(nombre)+1).padStart(2,'0'),candidatos[0]?.[1]];
 }
 if(fechas.length!==1||mesesDichos.length>1)throw Error('Indica una fecha o un mes, por ejemplo Aurora el 12 de noviembre de 2026.');
 const [,rel,d1,m1,y1,d2,m2,y2]=fechas[0];
 let fecha;
 if(rel){
  const partes=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santiago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(ahora);
  const valor=k=>partes.find(p=>p.type===k).value;
  fecha=new Date(Date.UTC(Number(valor('year')),Number(valor('month'))-1,Number(valor('day'))-(rel==='ayer'?1:0)));
 }else{
  const d=Number(d1||d2),m=m1?meses.indexOf(m1)+1:Number(m2),y=Number(y1||y2||anioChile);
  fecha=new Date(Date.UTC(y,m-1,d));
  if(!m||fecha.getUTCMonth()+1!==m||fecha.getUTCDate()!==d) throw Error('Revisa el día y el mes de la consulta.');
 }
 return [empresa||candidatos[0][0],fecha.toISOString().slice(0,10),candidatos[0]?.[1]];
}

function solicitaPanel(texto){
 const orden=texto.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[¿?¡!,.:;]/g,' ').replace(/\s+/g,' ').trim();
 return /^(?:pulso )?(?:por favor )?(?:quiero )?(?:abre|abrir|ingresa|ingresar|entra|entrar|ir|llevame)(?: al| el| a)? panel(?: de pulso comercial| comercial)?(?: por favor)?$/.test(orden);
}

function iniciarVoz(buscar){
 const boton=document.getElementById('jarvis-mic'),estado=document.getElementById('jarvis-estado'),frase=document.getElementById('jarvis-frase'),accion=document.getElementById('jarvis-accion');
 const Motor=window.SpeechRecognition||window.webkitSpeechRecognition;
 let activo=null;
 function terminar(){
  activo=null;accion.textContent='Toca para hablar';boton.setAttribute('aria-pressed','false');
 }
 function cancelar(){
  if(activo){const anterior=activo;terminar();anterior.abort();}
 }
 function ejecutar(texto){
  frase.textContent='Escuché «'+texto+'»';
  if(solicitaPanel(texto)){
   cancelar();estado.textContent='Abriendo el panel de Pulso Comercial.';
   document.getElementById('abrir-panel').click();return false;
  }
  try{estado.textContent=buscar(...interpretarCierre(texto));}
  catch(error){estado.textContent=error.message;}
  return true;
 }
 dibujarPulso(document.getElementById('jarvis-logo'),boton);
 boton.onclick=()=>{
  if(!Motor){estado.textContent='Este navegador no ofrece reconocimiento de voz.';return;}
  if(activo){cancelar();estado.textContent='Escucha cancelada.';return;}
  try{
   window.speechSynthesis?.cancel();
   const voz=new Motor();activo=voz;voz.lang='es-CL';voz.continuous=false;voz.interimResults=false;
   let huboRespuesta=false;
   voz.onresult=e=>{if(activo===voz)huboRespuesta=ejecutar(e.results[0][0].transcript);};
   voz.onstart=()=>{if(activo===voz)estado.textContent='Escuchando… Habla ahora.';};
   voz.onerror=e=>{
    if(activo!==voz)return;
    terminar();
    const mensajes={'not-allowed':window.location?.protocol==='content:'?'Chrome bloqueó el micrófono de esta copia local. Android debe permitir el acceso para poder escuchar.':'El micrófono está bloqueado. Permite el micrófono en los permisos de Chrome y de Pulso.', 'service-not-allowed':'El navegador bloqueó el servicio de reconocimiento de voz.', 'audio-capture':'No se pudo acceder al micrófono del dispositivo.',network:'No se pudo conectar al servicio de voz. Revisa la conexión.'};
    estado.textContent=mensajes[e.error]||'No se reconoció el comando. Toca el logo para volver a hablar.';
   };
   voz.onend=()=>{if(activo!==voz)return;terminar();if(huboRespuesta)hablarJarvis(estado.textContent);else estado.textContent='No se escuchó una consulta. Toca para hablar otra vez.';};
   voz.start();frase.textContent='';accion.textContent='Cancelar escucha';boton.setAttribute('aria-pressed','true');estado.textContent='Activando el micrófono…';
  }catch{terminar();estado.textContent='No se pudo iniciar el micrófono. Comprueba los permisos de Chrome.';}
 };
}
