/* DARKSLAYERS - stable inventory character artwork */
(function(){'use strict';
if(window.__dsInventoryCharacterImageStability)return;window.__dsInventoryCharacterImageStability=true;
function css(){if(document.getElementById('ds-inventory-image-stability-css'))return;var s=document.createElement('style');s.id='ds-inventory-image-stability-css';s.textContent=`
#dsGameView .ds-char-figure{background-image:var(--ds-char-art)!important;background-repeat:no-repeat!important;background-position:center 8px!important;background-size:min(250px,100%) 300px!important;contain:layout paint!important;transform:translateZ(0);backface-visibility:hidden}
#dsGameView .ds-char-figure>img{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
@media(max-width:800px){#dsGameView .ds-char-figure{background-position:center top!important;background-size:min(250px,100%) 250px!important}}
`;document.head.appendChild(s)}
function art(){var c=window.currentCharacterGame;if(!c)return'';return 'images/rpg/'+String(c.class||'warrior').toLowerCase().replace(/ /g,'-')+'.svg'}
function apply(){css();var v=document.getElementById('dsGameView'),src=art();if(!v||!src)return;v.style.setProperty('--ds-char-art','url("'+src.replace(/"/g,'\\"')+'")');var preload=window.__dsCharArtPreload;if(!preload||preload.src.indexOf(src)===-1){preload=new Image();preload.decoding='sync';preload.src=src;window.__dsCharArtPreload=preload}}
var mo=new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){if(ms[i].target&&((ms[i].target.id==='dsGameView')||(ms[i].target.closest&&ms[i].target.closest('#dsGameView')))){apply();break}}});
function start(){apply();var v=document.getElementById('dsGameView');if(v)mo.observe(v,{childList:true,subtree:true});else setTimeout(start,200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('darkslayers:character-changed',apply);
})();