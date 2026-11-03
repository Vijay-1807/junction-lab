import {mkdirSync,writeFileSync} from 'node:fs';
import {PAGE} from '../src/page.js';
mkdirSync('public',{recursive:true});
writeFileSync('public/index.html',PAGE);
console.log('Built public/index.html. Backend routes are in api/*.js.');
