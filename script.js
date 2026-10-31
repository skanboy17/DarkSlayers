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
        if (kind === 'tank') return '<span class="ds-role-symbol ds-tank"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 20 5v6c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5l8-3Zm0 3.1L7 7v4c0 3.5 2 6.4 5 7.9 3-1.5 5-4.4 5-7.9V7l-5-1.9Z"/></svg></span>';
        if (kind === 'healer') return '<span class="ds-role-symbol ds-healer">✚</span>';
        if (kind === 'ranged') return '<span class="ds-role-symbol ds-ranged">🏹</span>';
        return '<span class="ds-role-symbol ds-melee">⚔</span>';
    }

    function roleName(kind) {
        return {tank:'TANK', healer:'HEALER', melee:'MELEE DPS', ranged:'RANGED DPS'}[kind] || 'DPS';
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

    /* Roster: replace the old rank icon with the character combat-role icon. */
    function installRosterRoleIcons() {
        if (typeof window.renderDarkSlayersRoster !== 'function' || window.__dsRosterRoleIcons) return;
        window.__dsRosterRoleIcons = true;
        window.renderDarkSlayersRoster = function (members) {
            var list = document.querySelector('.roster-list');
            if (!list) return;
            var rows = Array.isArray(members) ? members : [];
            if (!rows.length) {
                list.innerHTML = '<div class="roster-empty">Rosterul este gol momentan.</div>';
                return;
            }
            list.innerHTML = rows.map(function (m) {
                var rank = rosterRankInfo(m.rank);
                var kind = roleKind(m.class, '', m.role);
                var details = [m.class || 'Clasa', m.game || ''].filter(Boolean).join(' • ');
                var level = m.level ? ' • Lv. ' + Number(m.level) : '';
                return '<div class="roster-member ' + (m.user_id ? 'roster-linked' : '') + '" data-rank="' + rank.key + '" data-member-id="' + Number(m.id) + '">' +
                    '<div class="roster-avatar ds-roster-role ds-' + kind + '" title="' + roleName(kind) + '">' + icon(kind) + '</div>' +
                    '<div class="roster-player"><h3>' + escapeHtml(m.name || 'Member') + (m.user_id ? ' <small class="roster-linked-badge">CONT</small>' : '') + '</h3><span>' + escapeHtml(details) + level + ' • <b class="ds-roster-role-name ds-' + kind + '">' + roleName(kind) + '</b></span></div>' +
                    '<div class="roster-rank rank-' + rank.key + '">' + rank.label + '</div>' +
                    '<div class="roster-status online">● ACTIVE</div></div>';
            }).join('');
        };
        if (Array.isArray(window.DARKSLAYERS_MEMBERS)) window.renderDarkSlayersRoster(window.DARKSLAYERS_MEMBERS);
    }

    function styles() {
        if (document.getElementById('dsRoleStyles')) return;
        var s = document.createElement('style');
        s.id = 'dsRoleStyles';
        s.textContent = '.ds-role-preview{display:flex;align-items:center;gap:10px;margin-top:8px;padding:10px 12px;border:1px solid;border-radius:10px;background:#080a0e;font-weight:900;letter-spacing:.6px}.ds-role-symbol{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9px;border:1px solid currentColor;box-shadow:0 0 13px currentColor;font-size:21px}.ds-role-symbol svg{width:25px;height:25px;fill:currentColor}.ds-tank,.ds-role-preview.ds-tank{color:#248cff}.ds-healer,.ds-role-preview.ds-healer{color:#25d968}.ds-melee,.ds-role-preview.ds-melee{color:#ff3c3c}.ds-ranged,.ds-role-preview.ds-ranged{color:#ff9d2d}.ds-role-preview.ds-tank{border-color:#1761aa}.ds-role-preview.ds-healer{border-color:#16763d}.ds-role-preview.ds-melee{border-color:#912828}.ds-role-preview.ds-ranged{border-color:#925b20}.roster-avatar.ds-roster-role{display:flex;align-items:center;justify-content:center;background:#080a0e}.roster-avatar.ds-roster-role .ds-role-symbol{border:0;box-shadow:none;width:42px;height:42px}.ds-roster-role-name{font-size:11px;letter-spacing:.4px}.ds-roster-role-name.ds-tank{color:#248cff}.ds-roster-role-name.ds-healer{color:#25d968}.ds-roster-role-name.ds-melee{color:#ff3c3c}.ds-roster-role-name.ds-ranged{color:#ff9d2d}';
        document.head.appendChild(s);
    }

    function install() {
        styles();
        removeSkybornFromGame();
        displayGuildMasterRole();
        installRosterRoleIcons();
        var modal = document.getElementById('siteModal');
        if (modal && !modal.__dsObserver) {
            modal.__dsObserver = true;
            new MutationObserver(function () { removeSkybornFromGame(); displayGuildMasterRole(); }).observe(modal, {childList:true, subtree:true});
        }
        document.addEventListener('darkslayers:members-loaded', function(e) {
            installRosterRoleIcons();
            if (typeof window.renderDarkSlayersRoster === 'function') window.renderDarkSlayersRoster(e.detail || []);
        });
        document.addEventListener('click', function () { setTimeout(displayGuildMasterRole, 0); });
        document.addEventListener('change', function(e) {
            if (e.target && (e.target.id === 'characterClass' || e.target.id === 'characterSpec')) setTimeout(decorate, 0);
        });
    }
    install();
})();
