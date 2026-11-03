export const DEFAULTS={name:'Bengaluru · evening peak',demand:2200,lanes:2,speed:45,cycle:60,split:50,flyover:false,incident:false,seed:42,duration:600};
export function validate(input={}){
 if(input===null||typeof input!=='object'||Array.isArray(input))throw new Error('Scenario must be a JSON object');
 const c={...DEFAULTS,...input};
 for(const [k,min,max] of [['demand',0,6000],['lanes',1,3],['speed',15,60],['cycle',20,120],['split',20,80],['seed',1,999999],['duration',60,900]]) if(typeof c[k]!=='number'||!Number.isFinite(c[k])||c[k]<min||c[k]>max||!Number.isInteger(c[k])) throw new Error(`${k} must be an integer from ${min} to ${max}`);
 for(const k of ['flyover','incident'])if(typeof c[k]!=='boolean')throw new Error(`${k} must be boolean`);
 if(typeof c.name!=='string'||c.name.length>80)throw new Error('name must be at most 80 characters');
 return Object.fromEntries(Object.keys(DEFAULTS).map(k=>[k,c[k]]));
}
export function network(c){
 const nodes=[];for(let y=0;y<5;y++)for(let x=0;x<5;x++)if((x>0&&x<4&&y>0&&y<4)||((x===0||x===4)&&y>0&&y<4)||((y===0||y===4)&&x>0&&x<4))nodes.push({id:`${x},${y}`,x,y,boundary:x===0||x===4||y===0||y===4});
 const edges=[];
 for(const a of nodes)for(const b of nodes)if(Math.abs(a.x-b.x)+Math.abs(a.y-b.y)===1&&!(a.boundary&&b.boundary)){
 const horizontal=a.y===b.y,main=horizontal?a.y===2:a.x===2;
 edges.push({id:edges.length,from:a.id,to:b.id,ax:a.x,ay:a.y,bx:b.x,by:b.y,horizontal,main,length:32,lanes:main?c.lanes:1,maxSpeed:Math.max(1,Math.min(3,Math.round((main?c.speed:30)/27))),closed:c.incident&&a.id==='2,2'&&b.id==='3,2'});
 }return {nodes,edges};
}
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function route(net,start,end){const dist={[start]:0},prev={},todo=new Set(net.nodes.map(n=>n.id));while(todo.size){let u=[...todo].sort((a,b)=>(dist[a]??Infinity)-(dist[b]??Infinity))[0];if(!Number.isFinite(dist[u]))break;todo.delete(u);if(u===end)break;for(const e of net.edges.filter(e=>e.from===u&&!e.closed)){const d=dist[u]+e.length/(e.maxSpeed*e.lanes);if(d<(dist[e.to]??Infinity)){dist[e.to]=d;prev[e.to]=e;}}}let path=[],v=end;while(v!==start){const e=prev[v];if(!e)return null;path.unshift(e.id);v=e.from;}return path;}
export function green(edge,t,c){if(edge.to==='2,2'&&edge.horizontal&&c.flyover)return true;const [x,y]=edge.to.split(',').map(Number);const phase=(t+(x+y)*7)%c.cycle,cut=c.cycle*c.split/100;return edge.horizontal?phase<cut-2:phase>=cut&&phase<c.cycle-2;}
export function simulate(input){
 const c=validate(input),net=network(c),random=rng(c.seed),motionRandom=rng(c.seed+987654),bounds=net.nodes.filter(n=>n.boundary),routes={};
 for(const a of bounds)for(const b of bounds)if(a.id!==b.id)routes[a.id+'>'+b.id]=route(net,a.id,b.id);
 const vehicles=[],pending=[],frames=[],series=[],trips=[],occupancy=new Map();let generated=0,completed=0,waitTotal=0,maxQueue=0,distance=0,speedSamples=0,speedTotal=0;
 const key=(e,l,p)=>`${e}:${l}:${p}`;
 const freeLane=(e)=>{if(e.closed)return -1;for(let l=0;l<e.lanes;l++)if(!occupancy.has(key(e.id,l,0))&&!occupancy.has(key(e.id,l,1)))return l;return -1;};
 for(let t=0;t<c.duration;t++){
  let arrivals=c.demand/3600;let count=Math.floor(arrivals)+(random()<arrivals%1?1:0);
  for(let i=0;i<count;i++){const a=bounds[Math.floor(random()*bounds.length)];let b=bounds[Math.floor(random()*bounds.length)];while(b.id===a.id)b=bounds[Math.floor(random()*bounds.length)];pending.push({id:generated++,route:routes[a.id+'>'+b.id],leg:0,p:0,lane:0,v:0,born:t,wait:0,color:Math.floor(random()*5)});}
  for(let i=pending.length-1;i>=0;i--){const v=pending[i],e=net.edges[v.route[0]],l=freeLane(e);if(l>=0){v.lane=l;occupancy.set(key(e.id,l,0),v.id);vehicles.push(v);pending.splice(i,1);}}
  for(const v of pending)v.wait++;
  const reserved=new Set();vehicles.sort((a,b)=>b.p-a.p||a.id-b.id);
  const finished=new Set();
  for(const v of vehicles){const e=net.edges[v.route[v.leg]];occupancy.delete(key(e.id,v.lane,v.p));let gap=0;for(let p=v.p+1;p<e.length;p++){if(occupancy.has(key(e.id,v.lane,p)))break;gap++;}
   let step=Math.min(v.v+1,e.maxSpeed,gap);if(step>0&&motionRandom()<0.12)step--;
   const boundary=net.nodes.find(n=>n.id===e.to).boundary;
   if(v.p===e.length-1){const next=net.edges[v.route[v.leg+1]],slot=c.flyover&&e.horizontal&&e.to==='2,2'?'flyover':e.to;
    const canCross=boundary||green(e,t,c);const l=next?freeLane(next):-1;
    if(canCross&&!reserved.has(slot)&&(!next||l>=0)){reserved.add(slot);if(!next){completed++;trips.push(t-v.born+1);waitTotal+=v.wait;finished.add(v.id);continue;}v.leg++;v.p=0;v.lane=l;v.v=1;distance+=7.5;}
    else{v.v=0;v.wait++;}
   }else{v.p+=step;v.v=step;distance+=step*7.5;if(step===0)v.wait++;}
   const ne=net.edges[v.route[v.leg]];occupancy.set(key(ne.id,v.lane,v.p),v.id);speedTotal+=v.v*27;speedSamples++;
  }
  for(let i=vehicles.length-1;i>=0;i--)if(finished.has(vehicles[i].id))vehicles.splice(i,1);
  const stopped=vehicles.filter(v=>v.v===0).length,queue=stopped+pending.length;maxQueue=Math.max(maxQueue,queue);
  if(t%2===0||t===c.duration-1)frames.push({t:t+1,cars:vehicles.map(v=>[v.id,v.route[v.leg],v.p,v.lane,v.v,v.color]),waiting:pending.length,completed,queue});
  if(t%10===9)series.push({t:t+1,queue,active:vehicles.length,completed,speed:vehicles.length?vehicles.reduce((a,v)=>a+v.v*27,0)/vehicles.length:0});
 }
 const sorted=[...trips].sort((a,b)=>a-b),perEdge=net.edges.map(e=>({id:e.id,vehicles:vehicles.filter(v=>v.route[v.leg]===e.id).length,stopped:vehicles.filter(v=>v.route[v.leg]===e.id&&v.v===0).length}));
 return {version:'1.0.0',config:c,network:net,frames,series,metrics:{generated,completed,active:vehicles.length,pending:pending.length,throughput:completed*3600/c.duration,meanTravel:trips.length?trips.reduce((a,b)=>a+b,0)/trips.length:null,p95Travel:trips.length?sorted[Math.ceil(sorted.length*.95)-1]:null,meanWait:completed?waitTotal/completed:null,meanSpeed:speedSamples?speedTotal/speedSamples:0,maxQueue,distanceKm:distance/1000},perEdge};
}
