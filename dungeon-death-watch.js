(function(){'use strict';
let busy=false,timer=null,lastDeathRun=null;
async function checkDeath(){
  if(busy||typeof darkslayersSupabase==='undefined')return;
  if(!document.querySelector('#dsGameView .ds-dungeon-scene')&&!document.querySelector('#dsGameView .ds-defeat'))return;
  busy=true;
  try{
    let a=await darkslayersSupabase.auth.getUser(),u=a.data&&a.data.user;
    if(!u)return;
    let q=await darkslayersSupabase.from('game_dungeon_runs').select('id,status,hp,lives,updated_at').eq('user_id',u.id).in('status',['active','defeated']).order('updated_at',{ascending:false}).limit(1).maybeSingle();
    let r=q.data;
    if(!r||r.status!=='active'||Number(r.hp)>1)return;
    if(lastDeathRun===r.id)return;
    lastDeathRun=r.id;
    let d=await darkslayersSupabase.rpc('ds_dungeon_register_death');
    if(d.error){lastDeathRun=null;console.error('Dungeon death watch:',d.error);return}
    let result=d.data&&d.data[0];
    if(result&&result.status==='defeated'){
      setTimeout(()=>document.dispatchEvent(new CustomEvent('ds-dungeon-defeated')),0);
      return;
    }
    lastDeathRun=null;
    if(typeof window.openCharacterDungeon==='function'&&window.currentCharacterGame)await window.openCharacterDungeon(window.currentCharacterGame);
  }finally{busy=false}
}
function schedule(ms=250){clearTimeout(timer);timer=setTimeout(checkDeath,ms)}
document.addEventListener('click',function(e){let b=e.target.closest('#dsGameView [data-act]');if(!b)return;let a=b.dataset.act;if(a==='resolve'||a==='boss'||a==='advance')schedule()},false);
setInterval(checkDeath,1000);
setTimeout(checkDeath,400);
})();