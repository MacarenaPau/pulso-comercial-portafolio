const empresa=document.getElementById('empresa'),periodo=document.getElementById('periodo');
for(const nombre of new Set(locales.map(([co])=>co)))empresa.add(new Option(nombre,nombre));
for(const fecha of new Set(cierres.map(r=>r.fecha)))periodo.add(new Option(fecha.split('-').reverse().join('/'),fecha));
function actualizar(){
 const filas=registros(empresa.value,periodo.value);
 document.getElementById('total').textContent=pesos(sumar(filas));
 const tiendas=[...new Set(filas.map(r=>r.tienda))].map(t=>[t,sumar(filas.filter(r=>r.tienda===t))]).sort((a,b)=>b[1]-a[1]);
 const grafico=document.getElementById('grafico');grafico.replaceChildren();
 for(const [nombre,venta] of tiendas){
  const fila=document.createElement('div'),barra=document.createElement('i');
  fila.className='fila';fila.textContent=nombre+' · '+pesos(venta);
  barra.style.width=(venta/tiendas[0][1]*100)+'%';fila.append(barra);grafico.append(fila);
 }
}
empresa.onchange=periodo.onchange=actualizar;actualizar();iniciarVoz(respuesta);
