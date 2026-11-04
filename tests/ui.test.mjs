import {PAGE} from '../src/page.js';
import {network,DEFAULTS} from '../src/engine.js';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {test} from 'node:test';
const script=PAGE.match(/<script>([\s\S]*?)<\/script>/)[1];
test('map click can inspect both directions and deselect empty space',()=>{
 const elements=new Map();const $=id=>{if(!elements.has(id))elements.set(id,{value:'',textContent:'',getBoundingClientRect:()=>({left:0,top:0,width:600,height:400})});return elements.get(id);};
 const context=vm.createContext({$,result:{network:network(DEFAULTS)},selectedEdge:null,draw(){}});
 vm.runInContext(script.match(/function geometry[^\n]+/)[0],context);
 vm.runInContext(script.split('\n').find(l=>l.startsWith("$('map').onclick=")),context);
 const e=context.result.network.edges[0];const g=context.geometry(600,400);const a=g.point(e.ax,e.ay),b=g.point(e.bx,e.by);const event={clientX:(a[0]+b[0])/2,clientY:(a[1]+b[1])/2};
 $('map').onclick(event);const first=context.result.network.edges[context.selectedEdge];$('map').onclick(event);const second=context.result.network.edges[context.selectedEdge];assert.equal(first.from,second.to);assert.equal(first.to,second.from);$('map').onclick({clientX:0,clientY:0});assert.equal(context.selectedEdge,null);
});
test('scrubbing pauses replay and updates accessible play label',()=>{const elements={scrub:{value:'7'},play:{setAttribute(k,v){this[k]=v;}}};const context=vm.createContext({$:id=>elements[id],frameIndex:0,clock:1,playing:true,draw(){}});vm.runInContext(script.match(/\$\('scrub'\)\.oninput=[^\n]+/)[0],context);elements.scrub.oninput();assert.equal(context.frameIndex,7);assert.equal(context.playing,false);assert.equal(context.clock,0);assert.equal(elements.play['aria-label'],'Play replay');});

test('CSV export contains computed time series and handles no results',()=>{const button={};let downloaded,notice;const context=vm.createContext({$:()=>button,result:null,toast:t=>notice=t,download:(...args)=>downloaded=args});vm.runInContext(script.split('\n').find(l=>l.startsWith("$('csvBtn').onclick=")),context);button.onclick();assert.match(notice,/Run a scenario/);context.result={config:{seed:42},series:[{t:61,queue:4,active:8,completed:7,speed:13.5}]};button.onclick();assert.equal(downloaded[0],'junction-lab-seed-42.csv');assert.ok(downloaded[1].endsWith('61,4,8,7,13.5'));assert.equal(downloaded[1].split('\r\n').length,2);});
