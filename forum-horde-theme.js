/* DARKSLAYERS - HORDE FORUM THEME */
(function(){
'use strict';
function install(){
 if(document.getElementById('ds-forum-horde-css'))return;
 const s=document.createElement('style');s.id='ds-forum-horde-css';s.textContent=`
#forum{position:relative;background:radial-gradient(circle at 50% 0,rgba(116,15,20,.16),transparent 34%),linear-gradient(180deg,#080505,#030303)!important;border-top:1px solid #4d171a;border-bottom:1px solid #4d171a;overflow:hidden}
#forum:before,#forum:after{content:'⚔';position:absolute;top:92px;width:72px;height:260px;display:flex;align-items:flex-start;justify-content:center;padding-top:26px;box-sizing:border-box;color:#d8a83b;font-size:30px;background:linear-gradient(180deg,#651017,#250608 75%,transparent);border:1px solid #7b2026;box-shadow:0 0 20px rgba(180,22,31,.25);opacity:.42;pointer-events:none}#forum:before{left:18px}#forum:after{right:18px}
#forum .section-title{color:#e2b94e!important;text-shadow:0 0 12px rgba(221,48,43,.35);letter-spacing:2px}
#forum .section-subtitle{color:#8f7e77!important}
#forum .forum-toolbar{border:1px solid #522025!important;background:linear-gradient(180deg,#130909,#080606)!important;box-shadow:0 0 0 1px #090303,0 8px 25px rgba(0,0,0,.42);padding:10px!important}
#forum .forum-toolbar select,#forum .forum-toolbar button{border-color:#79232a!important;background:linear-gradient(180deg,#281012,#100708)!important;color:#e9d7c0!important}
#forum .forum-toolbar button:hover{border-color:#d13940!important;box-shadow:0 0 12px rgba(211,36,45,.35)!important}
#forumTopics{border:2px solid #5f2025!important;background:#050404!important;box-shadow:0 0 0 1px #1d0809,0 0 28px rgba(153,18,27,.2),inset 0 0 30px rgba(0,0,0,.6)!important;padding:5px!important}
#forumTopics .forum-topic{position:relative!important;width:100%!important;margin:0 0 5px!important;border:1px solid #43171b!important;border-left:4px solid #8f252c!important;border-radius:0!important;background:linear-gradient(90deg,#16090b,#090606 52%,#120809)!important;color:#ddd!important;box-shadow:inset 0 1px rgba(255,255,255,.02)!important;transition:.18s ease!important}
#forumTopics .forum-topic:hover{transform:translateX(3px)!important;border-color:#9f2b32!important;border-left-color:#e0ad38!important;background:linear-gradient(90deg,#260d11,#0d0708 52%,#1a0a0d)!important;box-shadow:0 0 15px rgba(185,25,34,.24)!important}
#forumTopics .forum-topic-category{min-width:120px!important;text-align:center!important;padding:7px 8px!important;border:1px solid #682229!important;background:#220b0e!important;color:#d9ad45!important;font:900 9px Arial!important;letter-spacing:.5px!important;text-transform:uppercase!important}
#forumTopics .forum-topic-main strong{display:block!important;color:#eee0c7!important;font-family:Georgia,serif!important;font-size:15px!important;letter-spacing:.25px!important}.forum-topic-main small{color:#817471!important}.forum-topic-arrow{color:#c69631!important;font-size:20px!important}
.forum-pagination button{min-width:36px!important;padding:8px 10px!important;border:1px solid #6e2429!important;background:#18090b!important;color:#d8b24e!important;font-weight:900!important}.forum-pagination button:disabled{background:#632027!important;color:#fff!important;border-color:#b4373f!important;opacity:1!important}
.forum-empty{border:1px solid #4d1b1f!important;background:#0c0707!important;color:#9e8e88!important;padding:25px!important;text-align:center!important}
#siteModal.open .site-modal-card:has(.forum-original),#siteModal.open .site-modal-card:has(.forum-reply-form){border:2px solid #6d2328!important;background:radial-gradient(circle at 50% 0,#210a0d,#080606 45%,#040303)!important;box-shadow:0 0 0 1px #170506,0 0 35px rgba(178,24,32,.3)!important}
.forum-original,.forum-reply{border:1px solid #4f1b20!important;border-left:4px solid #922831!important;background:linear-gradient(100deg,#14090a,#080606)!important;box-shadow:inset 0 0 18px rgba(0,0,0,.35)!important}.forum-original{border-left-color:#d3a239!important}.forum-post-meta{border-bottom:1px solid #351316!important;padding-bottom:9px!important;margin-bottom:10px!important}.ds-forum-author strong{color:#e5bc55!important}.ds-forum-author span{color:#c9454c!important}.forum-replies-title{color:#d7aa43!important;border-bottom:1px solid #4b191d!important;padding-bottom:8px!important}.forum-form{border:1px solid #4d1b20!important;background:#0d0708!important;padding:14px!important}.forum-form label{color:#d4aa49!important}.forum-form textarea,.forum-form input,.forum-form select{border-color:#5c2025!important;background:#070505!important;color:#eee!important}.forum-delete{border:1px solid #77242a!important;background:#1b090b!important;color:#d66b70!important}.forum-delete:hover{border-color:#d23b43!important;color:#fff!important}
@media(max-width:900px){#forum:before,#forum:after{display:none}#forumTopics .forum-topic-category{min-width:auto!important}}
`;
 document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
