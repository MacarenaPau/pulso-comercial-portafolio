const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({assert});
for(const nombre of ['datos','voz'])vm.runInContext(fs.readFileSync(__dirname+'/'+nombre+'.js','utf8'),ctx);
vm.runInContext(`
assert.equal(cierres.length,60);
const pregunta=interpretarCierre('Pulso, ¿cuánto vendió Aurora el 12 de noviembre de 2026?');
assert.equal(respuesta(...pregunta),respuesta('Casa Nube','2026-11-12','Aurora'));
assert.equal(sumar(registros(...pregunta)),189100);
assert.equal(registros('Luz Austral','2026-11','Aurora').length,0);
assert.equal(respuesta('Casa Nube','2026-11-13','Aurora'),'Sin cierre registrado para ese período.');
`,ctx);
