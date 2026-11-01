/* DARKSLAYERS - REWARD SHOP VISUAL POLISH V1 */
(function(){
'use strict';
if(document.getElementById('ds-reward-polish-css'))return;
var s=document.createElement('style');
s.id='ds-reward-polish-css';
s.textContent=`
/* stronger premium cards */
.ds-shop-card{position:relative;overflow:hidden;background:radial-gradient(circle at 50% 15%,rgba(105,10,16,.20),transparent 44%),linear-gradient(180deg,#0b0606,#050303)!important;box-shadow:inset 0 0 22px rgba(120,0,10,.10);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.ds-shop-card:hover{transform:translateY(-2px);border-color:#8d252c!important;box-shadow:0 0 18px rgba(160,15,25,.20),inset 0 0 24px rgba(120,0,10,.12)}

/* TITLES - WoW style plaques instead of plain red rectangles */
.ds-title-art{position:relative!important;width:205px!important;max-width:94%!important;height:58px!important;margin:5px auto 8px!important;background:linear-gradient(180deg,#491014 0%,#1b0809 48%,#080404 100%)!important;border:2px solid #7b282c!important;clip-path:polygon(8% 0,92% 0,100% 28%,96% 50%,100% 72%,92% 100%,8% 100%,0 72%,4% 50%,0 28%)!important;box-shadow:0 0 14px rgba(200,30,35,.30),inset 0 0 15px rgba(220,45,45,.18)!important;overflow:visible!important}
.ds-title-art:before,.ds-title-art:after{content:'◆';position:absolute;top:50%;transform:translateY(-50%);color:#c73a3f;font-size:15px;text-shadow:0 0 7px #ff2630}
.ds-title-art:before{left:8px}.ds-title-art:after{right:8px}
.ds-title-art span{position:relative;z-index:2;padding:0 26px;color:#fff0d4!important;font:900 15px Georgia,serif!important;text-shadow:0 2px 2px #000,0 0 8px rgba(255,210,150,.22)}
.title-guild-champion{background:linear-gradient(180deg,#7b4d08 0%,#2a1703 52%,#090603 100%)!important;border-color:#d39a20!important;box-shadow:0 0 18px rgba(255,184,25,.38),inset 0 0 18px rgba(255,190,30,.22)!important}
.title-guild-champion:before,.title-guild-champion:after{color:#ffd34d;text-shadow:0 0 9px #ffb000}
.title-the-unstoppable{background:linear-gradient(180deg,#24394d 0%,#101923 52%,#050709 100%)!important;border-color:#7ca8c9!important;box-shadow:0 0 17px rgba(100,190,255,.28),inset 0 0 18px rgba(80,170,255,.15)!important}
.title-darkslayer{background:linear-gradient(180deg,#731016 0%,#280609 52%,#080303 100%)!important;border-color:#d82b34!important;box-shadow:0 0 18px rgba(255,35,45,.35),inset 0 0 18px rgba(255,35,45,.18)!important}

/* BADGES - richer emblems */
.ds-badge-art{position:relative!important;width:78px!important;height:78px!important;margin:2px auto 8px!important;background:radial-gradient(circle at 50% 42%,#65151a 0 35%,#24090b 37% 58%,#080404 60%)!important;border:3px solid #9e8d82!important;box-shadow:0 0 0 2px #321013,0 0 14px rgba(200,35,40,.28),inset 0 0 13px rgba(255,255,255,.08)!important}
.ds-badge-art:before{content:'';position:absolute;inset:6px;border:1px dashed rgba(255,226,205,.48);border-radius:50%;animation:dsBadgeSpin 14s linear infinite}
.ds-badge-art:after{content:'';position:absolute;inset:-7px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 11%,rgba(180,35,40,.65) 12% 14%,transparent 15% 36%,rgba(180,35,40,.65) 37% 39%,transparent 40% 61%,rgba(180,35,40,.65) 62% 64%,transparent 65% 86%,rgba(180,35,40,.65) 87% 89%,transparent 90%);z-index:-1}
.ds-badge-art span{position:relative;z-index:2;font-size:33px!important;color:#fff1df!important;text-shadow:0 2px 2px #000,0 0 8px rgba(255,220,190,.35)}
.badge-champion-badge{background:radial-gradient(circle at 50% 42%,#8a5205 0 35%,#352003 37% 58%,#0a0702 60%)!important;border-color:#f0b72d!important;box-shadow:0 0 0 2px #4d2c04,0 0 18px rgba(255,183,25,.45),inset 0 0 14px rgba(255,218,90,.15)!important}
.badge-champion-badge:after{background:conic-gradient(from 0deg,transparent 0 11%,#d99a13 12% 14%,transparent 15% 36%,#d99a13 37% 39%,transparent 40% 61%,#d99a13 62% 64%,transparent 65% 86%,#d99a13 87% 89%,transparent 90%)}
.badge-veteran-badge{background:radial-gradient(circle at 50% 42%,#254b70 0 35%,#10263c 37% 58%,#05080b 60%)!important;border-color:#9ec9e8!important;box-shadow:0 0 0 2px #16324b,0 0 16px rgba(90,180,255,.35),inset 0 0 14px rgba(120,205,255,.12)!important}
.badge-guild-hunter{background:radial-gradient(circle at 50% 42%,#385c16 0 35%,#17270a 37% 58%,#050704 60%)!important;border-color:#9ec45b!important;box-shadow:0 0 0 2px #263b12,0 0 16px rgba(120,205,45,.30),inset 0 0 14px rgba(150,230,70,.12)!important}
@keyframes dsBadgeSpin{to{transform:rotate(360deg)}}

/* keep inventory previews compact */
.ds-title-art.small{width:58px!important;height:34px!important;margin:0!important;clip-path:polygon(8% 0,92% 0,100% 28%,96% 50%,100% 72%,92% 100%,8% 100%,0 72%,4% 50%,0 28%)!important}
.ds-title-art.small:before,.ds-title-art.small:after{display:none}.ds-title-art.small span{font-size:7px!important;padding:0 5px!important}
.ds-badge-art.small{width:48px!important;height:48px!important;margin:0!important;border-width:2px!important}.ds-badge-art.small:before{inset:4px}.ds-badge-art.small:after{inset:-4px}.ds-badge-art.small span{font-size:20px!important}
`;
document.head.appendChild(s);
})();