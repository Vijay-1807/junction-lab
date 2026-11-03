import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import simulation from '../api/simulate.js';
import health from '../api/health.js';
import defaults from '../api/defaults.js';
import {simulate,DEFAULTS} from '../src/engine.js';
test('Vercel function exports share the same backend and deterministic metrics',async()=>{
 const config={duration:300,demand:1200,flyover:true,seed:42};
 const response=await simulation.fetch(new Request('https://example.vercel.app/api/simulate',{method:'POST',body:JSON.stringify(config)}));
 assert.equal(response.status,200);const r=await response.json();assert.ok(r.metrics.completed>0);assert.deepEqual(r.metrics,simulate(config).metrics);
 assert.equal((await health.fetch(new Request('https://example.vercel.app/api/health'))).status,200);
 assert.deepEqual(await (await defaults.fetch(new Request('https://example.vercel.app/api/defaults'))).json(),DEFAULTS);
 assert.equal((await simulation.fetch(new Request('https://example.vercel.app/api/simulate',{method:'POST',body:'null'}))).status,400);
});
test('Vercel static build points to server API and has no external API dependency',()=>{
 const config=JSON.parse(readFileSync('vercel.json','utf8'));
 assert.equal(config.outputDirectory,'public');
 const page=readFileSync('public/index.html','utf8');
 assert.ok(page.includes("fetch('/api/simulate'"));
 assert.ok(page.includes('What happens if we change this road?'));
 assert.ok(!page.includes('simplescout.chatgpt.site'));
});
