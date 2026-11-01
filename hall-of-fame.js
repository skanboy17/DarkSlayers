/* DARKSLAYERS - HALL OF FAME */
(function () {
    var state = { entries: [], role: '', editingId: null };

    function esc(v) {
        return String(v == null ? '' : v).replace(/[&<>'"]/g, function (c) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];
        });
    }

    function client() {
        return (typeof darkslayersSupabase !== 'undefined') ? darkslayersSupabase : null;
    }

    function canEdit() { return ['admin','officer'].includes(state.role); }
    function canDelete() { return state.role === 'admin'; }

    async function getRole() {
        var sb = client();
        state.role = '';
        if (!sb) return '';
        try {
            var a = await sb.auth.getUser();
            var u = a && a.data && a.data.user;
            if (!u) return '';
            var p = await sb.from('profiles').select('role').eq('id', u.id).maybeSingle();
            state.role = String(p.data && p.data.role || '').trim().toLowerCase();
        } catch(e) { console.error('Hall role:', e); }
        return state.role;
    }

    async function loadEntries() {
        var sb = client();
        if (!sb) return [];
        var q = await sb.from('hall_of_fame').select('id,created_at,member_name,title,description,image_url,created_by').order('created_at',{ascending:false});
        if (q.error) { console.error('Hall load:', q.error); return []; }
        state.entries = q.data || [];
        return state.entries;
    }

    function css() {
        if (document.getElementById('dsHallCss')) return;
        var s=document.createElement('style'); s.id='dsHallCss';
        s.textContent='.ds-hall-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px}.ds-hall-modal{width:min(980px,96vw);max-height:90vh;overflow:auto;background:#090909;border:1px solid #5b171b;box-shadow:0 0 45px rgba(180,20,30,.25);padding:24px;color:#eee;font-family:Arial,sans-serif}.ds-hall-head{display:flex;align-items:center;justify-content:space-between;gap:15px;border-bottom:1px solid #311;padding-bottom:14px;margin-bottom:18px}.ds-hall-head h2{margin:0;color:#e22d36;letter-spacing:2px}.ds-hall-close,.ds-hall-btn{border:1px solid #7c1d23;background:#170708;color:#fff;padding:10px 14px;cursor:pointer;font-weight:800}.ds-hall-btn:hover,.ds-hall-close:hover{background:#a51e26}.ds-hall-add{margin-bottom:18px}.ds-hall-form{display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#0e0e0e;border:1px solid #292929;padding:15px;margin-bottom:18px}.ds-hall-form input,.ds-hall-form textarea{width:100%;box-sizing:border-box;background:#050505;border:1px solid #383838;color:#fff;padding:11px}.ds-hall-form input[type=file]{padding:8px;cursor:pointer}.ds-hall-form textarea{grid-column:1/-1;min-height:90px;resize:vertical}.ds-hall-upload{grid-column:1/-1;border:1px solid #2b2b2b;background:#080808;padding:12px}.ds-hall-upload label{display:block;color:#ddd;font-size:12px;font-weight:900;letter-spacing:1px;margin-bottom:8px}.ds-hall-upload small{display:block;color:#777;margin-top:7px}.ds-hall-preview{margin-top:10px;max-width:260px;max-height:150px;object-fit:cover;border:1px solid #333}.ds-hall-actions{grid-column:1/-1;display:flex;gap:8px}.ds-hall-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}.ds-hall-card{background:linear-gradient(180deg,#111,#080808);border:1px solid #382023;padding:16px;position:relative}.ds-hall-card img{width:100%;height:145px;object-fit:cover;border:1px solid #333;margin-bottom:12px}.ds-hall-card h3{margin:4px 0;color:#fff}.ds-hall-title{color:#e22d36;font-weight:900;text-transform:uppercase;font-size:12px;letter-spacing:1px}.ds-hall-desc{color:#bbb;line-height:1.5;white-space:pre-wrap}.ds-hall-date{color:#777;font-size:11px}.ds-hall-card-actions{display:flex;gap:7px;margin-top:12px}.ds-hall-empty{text-align:center;color:#888;padding:35px;border:1px dashed #333;grid-column:1/-1}@media(max-width:650px){.ds-hall-form{grid-template-columns:1fr}.ds-hall-form textarea,.ds-hall-actions,.ds-hall-upload{grid-column:1}.ds-hall-modal{padding:15px}}';
        document.head.appendChild(s);
    }

    function renderForm() {
        if (!canEdit()) return '';
        var e = state.entries.find(function(x){return Number(x.id)===Number(state.editingId);}) || {};
        return '<div class="ds-hall-add"><button class="ds-hall-btn" onclick="dsHallToggleForm()">'+(state.editingId?'INCHIDE EDITAREA':'+ ADAUGA IN HALL OF FAME')+'</button></div>'+
        '<form id="dsHallForm" class="ds-hall-form" style="display:'+(state.editingId?'grid':'none')+'" onsubmit="dsHallSave(event)">'+
        '<input id="dsHallName" required maxlength="80" placeholder="Numele membrului" value="'+esc(e.member_name||'')+'">'+
        '<input id="dsHallTitle" required maxlength="100" placeholder="Titlu: MVP Raid, Raiderul lunii..." value="'+esc(e.title||'')+'">'+
        '<div class="ds-hall-upload"><label>📷 INCARCA IMAGINE DIN PC</label><input id="dsHallImageFile" type="file" accept="image/png,image/jpeg,image/webp"><small>PNG, JPG sau WEBP. Maxim 5 MB. Daca nu alegi alta poza la editare, ramane cea existenta.</small>'+(e.image_url?'<img class="ds-hall-preview" src="'+esc(e.image_url)+'" alt="Imagine curenta">':'')+'</div>'+
        '<textarea id="dsHallDescription" maxlength="1000" placeholder="Descriere (optional)">'+esc(e.description||'')+'</textarea>'+
        '<div class="ds-hall-actions"><button id="dsHallSaveButton" class="ds-hall-btn" type="submit">SALVEAZA</button>'+(state.editingId?'<button class="ds-hall-btn" type="button" onclick="dsHallCancelEdit()">ANULEAZA</button>':'')+'</div></form>';
    }

    function render() {
        var box=document.getElementById('dsHallContent'); if(!box) return;
        var cards=state.entries.map(function(e){
            var img=e.image_url?'<img src="'+esc(e.image_url)+'" alt="'+esc(e.member_name)+'" onerror="this.style.display=\'none\'">':'';
            var actions=canEdit()?'<div class="ds-hall-card-actions"><button class="ds-hall-btn" onclick="dsHallEdit('+Number(e.id)+')">EDITEAZA</button>'+(canDelete()?'<button class="ds-hall-btn" onclick="dsHallDelete('+Number(e.id)+')">STERGE</button>':'')+'</div>':'';
            var date=''; try{date=new Date(e.created_at).toLocaleDateString('ro-RO');}catch(x){}
            return '<article class="ds-hall-card">'+img+'<div class="ds-hall-title">'+esc(e.title)+'</div><h3>🏆 '+esc(e.member_name)+'</h3>'+(e.description?'<div class="ds-hall-desc">'+esc(e.description)+'</div>':'')+'<p class="ds-hall-date">'+esc(date)+'</p>'+actions+'</article>';
        }).join('');
        box.innerHTML=renderForm()+'<div class="ds-hall-grid">'+(cards||'<div class="ds-hall-empty">Hall of Fame este gol momentan.</div>')+'</div>';
    }

    async function uploadImage(file, user) {
        if (!file) return null;
        if (file.size > 5 * 1024 * 1024) throw new Error('Imaginea trebuie sa aiba maxim 5 MB.');
        var allowed=['image/png','image/jpeg','image/webp'];
        if (!allowed.includes(file.type)) throw new Error('Foloseste o imagine PNG, JPG sau WEBP.');
        var ext=(file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
        if (!['png','jpg','jpeg','webp'].includes(ext)) ext='jpg';
        var path=(user ? user.id : 'staff') + '/hall-' + Date.now() + '-' + Math.random().toString(36).slice(2,8) + '.' + ext;
        var sb=client();
        var up=await sb.storage.from('hall-of-fame').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});
        if (up.error) throw up.error;
        var pub=sb.storage.from('hall-of-fame').getPublicUrl(path);
        return pub && pub.data ? pub.data.publicUrl : null;
    }

    async function refresh() { await Promise.all([getRole(),loadEntries()]); render(); }
    window.refreshHallOfFame=refresh;

    window.openHallOfFame=async function(){
        css();
        var old=document.getElementById('dsHallOverlay'); if(old) old.remove();
        var o=document.createElement('div'); o.id='dsHallOverlay'; o.className='ds-hall-overlay';
        o.innerHTML='<div class="ds-hall-modal"><div class="ds-hall-head"><h2>🏆 HALL OF FAME</h2><button class="ds-hall-close" onclick="dsHallClose()">✕</button></div><div id="dsHallContent"><div class="ds-hall-empty">Se incarca...</div></div></div>';
        o.addEventListener('click',function(e){if(e.target===o) window.dsHallClose();}); document.body.appendChild(o); await refresh();
    };
    window.dsHallClose=function(){var o=document.getElementById('dsHallOverlay');if(o)o.remove();};
    window.dsHallToggleForm=function(){var f=document.getElementById('dsHallForm');if(f)f.style.display=f.style.display==='none'?'grid':'none';};
    window.dsHallCancelEdit=function(){state.editingId=null;render();};
    window.dsHallEdit=function(id){state.editingId=Number(id);render();};
    window.dsHallSave=async function(ev){
        ev.preventDefault(); var sb=client(); if(!sb||!canEdit())return;
        var a=await sb.auth.getUser(); var user=a&&a.data&&a.data.user;
        if(!user){alert('Trebuie sa fii conectat.');return;}
        var existing=state.entries.find(function(x){return Number(x.id)===Number(state.editingId);}) || {};
        var file=document.getElementById('dsHallImageFile') && document.getElementById('dsHallImageFile').files ? document.getElementById('dsHallImageFile').files[0] : null;
        var saveBtn=document.getElementById('dsHallSaveButton');
        if(saveBtn){saveBtn.disabled=true;saveBtn.textContent=file?'SE INCARCA POZA...':'SE SALVEAZA...';}
        try {
            var imageUrl=existing.image_url || null;
            if(file) imageUrl=await uploadImage(file,user);
            var payload={member_name:document.getElementById('dsHallName').value.trim(),title:document.getElementById('dsHallTitle').value.trim(),description:document.getElementById('dsHallDescription').value.trim()||null,image_url:imageUrl};
            var r;
            if(state.editingId) r=await sb.from('hall_of_fame').update(payload).eq('id',state.editingId);
            else {payload.created_by=user.id;r=await sb.from('hall_of_fame').insert(payload);}
            if(r.error) throw r.error;
            state.editingId=null; await refresh();
        } catch(err) {
            console.error('Hall save/upload:',err);
            alert('Nu s-a putut salva: '+(err && err.message ? err.message : 'eroare necunoscuta'));
            if(saveBtn){saveBtn.disabled=false;saveBtn.textContent='SALVEAZA';}
        }
    };
    window.dsHallDelete=async function(id){
        if(!canDelete()||!confirm('Sigur vrei sa stergi aceasta intrare din Hall of Fame?'))return;
        var r=await client().from('hall_of_fame').delete().eq('id',Number(id)); if(r.error){alert('Nu s-a putut sterge: '+r.error.message);return;} await refresh();
    };
})();
