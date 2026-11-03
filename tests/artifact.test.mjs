import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {PAGE} from '../src/page.js';
test('inline browser JavaScript parses',()=>{const js=PAGE.match(/<script>([\s\S]*?)<\/script>/)[1];assert.doesNotThrow(()=>new vm.Script(js));});
test('production Worker serves UI and computes scenarios',async()=>{const {default:worker}=await import('../dist/server/index.js?test');const page=await worker.fetch(new Request('https://test/'));assert.equal(page.status,200);assert.ok((await page.text()).includes('Make room for better movement.'));const response=await worker.fetch(new Request('https://test/api/simulate',{method:'POST',body:JSON.stringify({duration:60})}));assert.equal(response.status,200);const r=await response.json();assert.equal(r.config.duration,60);assert.equal(r.metrics.generated,r.metrics.completed+r.metrics.active+r.metrics.pending);});
