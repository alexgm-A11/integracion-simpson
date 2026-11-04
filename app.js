'use strict';
const M_GUIA = 0.45;
function potencia(t) { return 10 + 5*t*Math.sin(Math.PI*t/6) + Math.exp(0.2*t); }
function validar(a,b,n) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b<=a) throw new Error('Ingrese límites finitos que cumplan a < b.');
  if (!Number.isSafeInteger(n) || n<=0 || n%2!==0) throw new Error('n debe ser un número entero positivo y par. El cálculo se ha detenido.');
  if (n>100000) throw new Error('Use como máximo 100 000 subintervalos para esta calculadora.');
}
function simpson(a,b,n) {
  validar(a,b,n);
  const h=(b-a)/n;
  const puntos=Float64Array.from({length:n+1},(_,i)=>a+i*h);
  // Operaciones por arreglos: vector de coeficientes 1,4,2,...,4,1.
  const coeficientes=Float64Array.from({length:n+1},(_,i)=>i===0||i===n?1:i%2===1?4:2);
  const valores=puntos.map(potencia);
  const ponderados=valores.map((p,i)=>p*coeficientes[i]);
  const integral=(h/3)*ponderados.reduce((s,v)=>s+v,0);
  if (!Number.isFinite(integral)) throw new Error('Los valores exceden el rango numérico. Reduzca los límites.');
  return {h,integral,puntos,valores,coeficientes};
}
function mSegura(a,b) {
  const k=Math.PI/6;
  return 5*Math.max(Math.abs(a),Math.abs(b))*k**4 + 20*k**3 + 0.0016*Math.exp(0.2*b);
}
function cota(a,b,n,m) { return (b-a)/180*((b-a)/n)**4*m; }
if (typeof module!=='undefined') module.exports={validar,simpson,cota,mSegura,potencia};
if (typeof document!=='undefined') {
 const $=id=>document.getElementById(id);
 const formato=x=>Math.abs(x)>1e12 || (x!==0&&Math.abs(x)<1e-9)?x.toExponential(8):x.toLocaleString('es-PE',{minimumFractionDigits:9,maximumFractionDigits:9});
 function fila(valores) { const tr=document.createElement('tr'); for(const valor of valores){const td=document.createElement('td');td.textContent=valor;tr.append(td);} return tr; }
 $('form').addEventListener('submit',event=>{
  event.preventDefault(); $('error').hidden=true; $('results').hidden=true;
  try {
   const campos=['a','b','n'].map(id=>$(id).value.trim());
   if(campos.some(v=>v==='')) throw new Error('Complete a, b y n antes de calcular.');
   const [a,b,n]=campos.map(Number); const r=simpson(a,b,n); const m=mSegura(a,b);
   if(!Number.isFinite(m)||!Number.isFinite(cota(a,b,2,m))) throw new Error('No se puede representar la cota para estos límites. Reduzca el intervalo.');
   $('energy').textContent=formato(r.integral); $('step').textContent=formato(r.h); $('bound').textContent=formato(cota(a,b,n,M_GUIA));
   const evaluacion=document.createDocumentFragment();
   for(let i=0;i<=Math.min(n,500);i++) evaluacion.append(fila([i,formato(r.puntos[i]),formato(r.valores[i]),r.coeficientes[i]]));
   if(n>500) evaluacion.append(fila([n,formato(r.puntos[n]),formato(r.valores[n]),r.coeficientes[n]]));
   $('evaluation').replaceChildren(evaluacion);
   $('table-note').textContent=n>500?'Se muestran los primeros 501 puntos y el último; el cálculo incluye todos los puntos.':'';
   const convergencia=document.createDocumentFragment();
   for(const cantidad of [2,4,6,12,24]) {
    const resultado=simpson(a,b,cantidad);
    convergencia.append(fila([cantidad,formato(resultado.h),formato(resultado.integral),formato(cota(a,b,cantidad,M_GUIA)),formato(cota(a,b,cantidad,m))]));
   }
   $('convergence').replaceChildren(convergencia);
   $('safe-note').textContent=`Para los límites ingresados se usa además la cota conservadora M = ${formato(m)} kW/h⁴, obtenida de 5·máx(|a|,|b|)·(π/6)⁴ + 20·(π/6)³ + 0,0016·exp(0,2b).`;
   $('results').hidden=false;
  } catch(error) { $('error').textContent=error.message; $('error').hidden=false; }
 });
 $('form').requestSubmit();
}
