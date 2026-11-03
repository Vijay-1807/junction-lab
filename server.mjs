import http from 'node:http';
import {handle} from './src/handler.js';
const server=http.createServer(async(req,res)=>{try{let body='';for await(const chunk of req){body+=chunk;if(body.length>8192){res.writeHead(413);res.end('Too large');return;}}const r=await handle(new Request('http://localhost'+req.url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body})}));res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));}catch{res.writeHead(500);res.end('Server error');}});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
