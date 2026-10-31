/* DARKSLAYERS - UI fixes; script-base.js is loaded first by index.html */
(function () {
    function removeSkybornFromGame() {
        var game = document.getElementById('characterGame');
        if (!game) return;
        Array.from(game.options).forEach(function (option) {
            var text = String(option.value || option.textContent || '').trim().toLowerCase();
            if (text === 'skyborn') option.remove();
        });
        if (!game.value && game.options.length) game.selectedIndex = 0;
    }

    function displayGuildMasterRole() {
        var role = document.getElementById('loggedInRole');
        if (role && String(role.textContent || '').trim().toLowerCase() === 'admin') role.textContent = 'GUILD MASTER';
    }

    function roleKind(className, spec, role) {
        role = String(role || '').toUpperCase();
        className = String(className || '');
        spec = String(spec || '');
        if (role === 'TANK') return 'tank';
        if (role === 'HEALER') return 'healer';
        var ranged = ['Hunter','Mage','Warlock'].includes(className) ||
            (className === 'Priest' && spec === 'Shadow') ||
            (className === 'Druid' && spec === 'Balance') ||
            (className === 'Shaman' && spec === 'Elemental');
        return ranged ? 'ranged' : 'melee';
    }

    function icon(kind) {
        if (kind === 'tank') return '<span class="ds-role-symbol ds-tank">SHIELD</span>';
        if (kind === 'healer') return '<span class="ds-role-symbol ds-healer">+</span>';
        if (kind === 'ranged') return '<span class="ds-role-symbol ds-ranged">BOW</span>';
        return '<span class="ds-role-symbol ds-melee">DPS</span>';
    }

    function roleName(kind) {
        return {tank:'TANK', healer:'HEALER', melee:'MELEE DPS', ranged:'RANGED DPS'}[kind] || 'DPS';
    }

    async function enrichRosterMembers(members) {
        var rows = Array.isArray(members) ? members.map(function(m){ return Object.assign({}, m); }) : [];
        if (!window.darkslayersSupabase || !rows.length) return rows;
        var ids = rows.map(function(m){ return m.user_id; }).filter(Boolean);
        if (!ids.length) return rows;
        try {
            var profileResult = await darkslayersSupabase.from('profiles').select('id,display_name').in('id', ids);
            var charResult = await darkslayersSupabase.from('characters').select('user_id,character_name,class,spec,combat_role,game,level,is_main').in('user_id', ids).eq('is_main', true);
            var profiles = {};
            var chars = {};
            (profileResult.data || []).forEach(function(p){ profiles[p.id] = p; });
            (charResult.data || []).forEach(function(c){ chars[c.user_id] = c; });
            rows.forEach(function(m){
                if (!m.user_id) return;
                var p = profiles[m.user_id];
                var c = chars[m.user_id];
                if (c) {
                    m.name = c.character_name || (p && p.display_name) || m.name;
                    m.class = c.class || m.class;
                    m.spec = c.spec || m.spec;
                    m.role = c.combat_role || m.role;
                    m.game = c.game || m.game;
                    m.level = c.level || m.level;
                } else if (p && p.display_name) {
                    m.name = p.display_name;
                }
            });
        } catch (e) { console.error('Roster profile sync:', e); }
        return rows;
    }

    function renderRosterRows(rows) {
        var list = document.querySelector('.roster-list');
        if (!list) return;
        if (!rows.length) { list.innerHTML = '<div class="roster-empty">Rosterul este gol momentan.</div>'; return; }
        list.innerHTML = rows.map(function (m) {
            var rank = rosterRankInfo(m.rank);
            var kind = roleKind(m.class, m.spec, m.role);
            var details = [m.class || 'Clasa', m.spec || '', m.game || ''].filter(Boolean).join(' - ');
            var level = m.level ? ' - Lv. ' + Number(m.level) : '';
            return '<div class="roster-member ' + (m.user_id ? 'roster-linked' : '') + '" data-rank="' + rank.key + '" data-member-id="' + Number(m.id) + '">' +
                '<div class="roster-avatar ds-roster-role ds-' + kind + '" title="' + roleName(kind) + '">' + icon(kind) + '</div>' +
                '<div class="roster-player"><h3>' + escapeHtml(m.name || 'Member') + (m.user_id ? ' <small class="roster-linked-badge">CONT</small>' : '') + '</h3><span>' + escapeHtml(details) + level + ' - <b class="ds-roster-role-name ds-' + kind + '">' + roleName(kind) + '</b></span></div>' +
                '<div class="roster-rank rank-' + rank.key + '">' + rank.label + '</div>' +
                '<div class="roster-status online">ACTIVE</div></div>';
        }).join('');
    }

    function installRosterRoleIcons() {
        if (typeof window.renderDarkSlayersRoster !== 'function' || window.__dsRosterRoleIcons) return;
        window.__dsRosterRoleIcons = true;
        window.renderDarkSlayersRoster = async function (members) {
            renderRosterRows(await enrichRosterMembers(members));
        };
    }

    function decorate() {
        removeSkybornFromGame();
        var role = document.getElementById('characterCombatRole');
        var cls = document.getElementById('characterClass');
        var spec = document.getElementById('characterSpec');
        if (!role || !cls || !spec) return;
        var old = document.getElementById('dsCharacterRolePreview');
        if (old) old.remove();
        var kind = roleKind(cls.value, spec.value, role.value);
        var preview = document.createElement('div');
        preview.id = 'dsCharacterRolePreview';
        preview.className = 'ds-role-preview ds-' + kind;
        preview.innerHTML = icon(kind) + '<strong>' + roleName(kind) + '</strong>';
        role.insertAdjacentElement('afterend', preview);
    }

    function styles() {
        if (document.getElementById('dsRoleStyles')) return;
        var s = document.createElement('style');
        s.id = 'dsRoleStyles';
        s.textContent = '.ds-role-symbol{font-size:10px;font-weight:900}.ds-tank{color:#248cff}.ds-healer{color:#25d968}.ds-melee{color:#ff3c3c}.ds-ranged{color:#ff9d2d}.ds-roster-role-name{font-size:11px}.roster-avatar.ds-roster-role{display:flex;align-items:center;justify-content:center}';
        document.head.appendChild(s);
    }

    function install() {
        styles(); removeSkybornFromGame(); displayGuildMasterRole(); installRosterRoleIcons();
        document.addEventListener('darkslayers:members-loaded', function(e) {
            installRosterRoleIcons();
            if (typeof window.renderDarkSlayersRoster === 'function') window.renderDarkSlayersRoster(e.detail || []);
        });
        document.addEventListener('click', function(){ setTimeout(displayGuildMasterRole,0); });
        document.addEventListener('change', function(e){ if(e.target && (e.target.id==='characterClass'||e.target.id==='characterSpec')) setTimeout(decorate,0); });
    }
    install();
})();
