import {simulate} from '../src/engine.js';
import {mkdirSync,writeFileSync} from 'node:fs';
const rows=[];
for(const seed of [11,22,33,44,55])for(const [scenario,change]of [['baseline',{}],['flyover',{flyover:true}],['one-lane',{lanes:1}],['closure',{incident:true}]]){const {metrics}=simulate({seed,...change});rows.push({seed,scenario,...metrics});}
mkdirSync('research',{recursive:true});
writeFileSync('research/paired-experiments.json',JSON.stringify({model:'junction-cell-v1',version:'1.1.0',duration:600,demand:2200,notes:'Synthetic experiments; no empirical calibration. Travel time uses completed trips only.',runs:rows},null,2));
const cols=Object.keys(rows[0]);writeFileSync('research/paired-experiments.csv',cols.join(',')+'\n'+rows.map(r=>cols.map(k=>r[k]??'').join(',')).join('\n')+'\n');
for(const scenario of ['baseline','flyover','one-lane','closure']){const r=rows.filter(r=>r.scenario===scenario),mean=k=>r.reduce((s,v)=>s+v[k],0)/r.length;console.log(JSON.stringify({scenario,completed:mean('completed'),meanTravel:mean('meanTravel'),peakQueue:mean('maxQueue')}));}
