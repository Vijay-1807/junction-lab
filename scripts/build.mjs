import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist/server',{recursive:true});mkdirSync('dist/.openai',{recursive:true});
const engine=readFileSync('src/engine.js','utf8').replaceAll('export ','');
const page=readFileSync('src/page.js','utf8').replace('export ','');
const handler=readFileSync('src/handler.js','utf8').replace(/^import .*;\r?\n/gm,'').replace('export async function','async function');
writeFileSync('dist/server/index.js',engine+'\n'+page+'\n'+handler+'\nexport default {fetch:handle};\n');
copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');console.log('Built dependency-free Worker');
