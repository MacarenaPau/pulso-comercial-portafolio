// Datos sintéticos y reproducibles. Cada fila representa un cierre de tienda.
const locales=[
 ['Casa Nube','Aurora'],['Casa Nube','Mirador'],['Casa Nube','Brisa'],
 ['Luz Austral','Prisma'],['Luz Austral','Horizonte']
];
const state={dir:Object.fromEntries(locales.map(([co,nombre])=>[nombre,{co}]))};
const cierres=locales.flatMap(([empresa,tienda],i)=>Array.from({length:12},(_,j)=>({
 empresa,tienda,fecha:'2026-11-'+String(j+1).padStart(2,'0'),
 venta:100*(1250+225*i+((j*391+i*173)%1220))
})));
const pesos=n=>new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(n);
function registros(empresa,fecha,tienda){
 return cierres.filter(r=>r.empresa===empresa&&r.fecha.startsWith(fecha)&&(!tienda||r.tienda===tienda));
}
const sumar=filas=>filas.reduce((acum,r)=>acum+r.venta,0);
function respuesta(empresa,fecha,tienda){
 const filas=registros(empresa,fecha,tienda);
 if(!filas.length)return 'Sin cierre registrado para ese período.';
 return (tienda||empresa)+' · '+fecha.split('-').reverse().join('/')+' · '+pesos(sumar(filas))+' en ventas registradas.';
}
