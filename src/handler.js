import {simulate,DEFAULTS} from './engine.js';
import {PAGE} from './page.js';
export async function handle(request){
 const url=new URL(request.url),json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
 if(url.pathname==='/api/health')return json({ok:true,model:'junction-cell-v1'});
 if(url.pathname==='/api/defaults')return json(DEFAULTS);
 if(url.pathname==='/api/simulate'){
  if(request.method!=='POST')return json({error:'Use POST'},405);
  if(Number(request.headers.get('content-length'))>8192)return json({error:'Scenario too large'},413);
  try{const text=await request.text();if(text.length>8192)return json({error:'Scenario too large'},413);return json(simulate(JSON.parse(text)));}catch(e){return json({error:e.message},400);}
 }
 if(url.pathname!=='/')return new Response('Not found',{status:404});
 return new Response(PAGE,{headers:{'content-type':'text/html; charset=utf-8','x-content-type-options':'nosniff','referrer-policy':'no-referrer','content-security-policy':"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'"}});
}
