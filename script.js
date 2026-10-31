/* DARKSLAYERS - stable base + safe UI fixes */
document.write('<script src="script-base.js?v=20261101-adminrestore1"><\/script>');

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

    function decorate() {
        removeSkybornFromGame();
        var role = document.getElementById('characterCombatRole');
        var cls = document.getElementById('characterClass');
        var spec = document.getElementById('characterSpec');
        if (!role || !cls || !spec) return;
        var old = document.getElementById('dsCharacterRolePreview');
        if (old) old.remove();
        var kind = roleKind(cls.value, spec.value, role.value);
        var names = {tank:'TANK', healer:'HEALER', melee:'MELEE DPS', ranged:'RANGED DPS'};
        var preview = document.createElement('div');
        preview.id = 'dsCharacterRolePreview';
        preview.className = 'ds-role-preview ds-' + kind;
        preview.innerHTML = icon(kind) + '<strong>' + names[kind] + '</strong>';
        role.insertAdjacentElement('afterend', preview);
    }

    function styles() {
        if (document.getElementById('dsRoleStyles')) return;
        var s = document.createElement('style');
        s.id = 'dsRoleStyles';
        s.textContent = '.ds-role-preview{display:flex;align-items:center;gap:10px;margin-top:8px;padding:10px 12px;border:1px solid;border-radius:10px;background:#080a0e;font-weight:900;letter-spacing:.6px}.ds-role-symbol{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9px;border:1px solid currentColor;box-shadow:0 0 13px currentColor;font-size:21px}.ds-role-symbol svg{width:25px;height:25px;fill:currentColor}.ds-tank,.ds-role-preview.ds-tank{color:#248cff}.ds-healer,.ds-role-preview.ds-healer{color:#25d968}.ds-melee,.ds-role-preview.ds-melee{color:#ff3c3c}.ds-ranged,.ds-role-preview.ds-ranged{color:#ff9d2d}.ds-role-preview.ds-tank{border-color:#1761aa}.ds-role-preview.ds-healer{border-color:#16763d}.ds-role-preview.ds-melee{border-color:#912828}.ds-role-preview.ds-ranged{border-color:#925b20}';
        document.head.appendChild(s);
    }

    function install() {
        styles();
        removeSkybornFromGame();
        var modal = document.getElementById('siteModal');
        if (modal && !modal.__dsObserver) {
            modal.__dsObserver = true;
            new MutationObserver(function () { removeSkybornFromGame(); })
                .observe(modal, {childList:true, subtree:true});
        }
        document.addEventListener('change', function(e) {
            if (e.target && (e.target.id === 'characterClass' || e.target.id === 'characterSpec')) setTimeout(decorate, 0);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
    else install();
})();
