/* DARKSLAYERS - stable main loader + safe role UI fixes */
document.write('<script src="script-base.js?v=20261101-rolefix1"><\/script>');

(function () {
    function removeSkybornFromGame() {
        var game = document.getElementById('characterGame');
        if (!game) return;
        Array.from(game.options).forEach(function (option) {
            if (String(option.value || option.textContent).trim().toLowerCase() === 'skyborn') {
                option.remove();
            }
        });
        if (!game.value && game.options.length) game.selectedIndex = 0;
    }

    function roleKind(className, spec, role) {
        role = String(role || '').toUpperCase();
        className = String(className || '');
        spec = String(spec || '');
        if (role === 'TANK') return 'tank';
        if (role === 'HEALER') return 'healer';
        var ranged =
            ['Hunter', 'Mage', 'Warlock'].includes(className) ||
            (className === 'Priest' && spec === 'Shadow') ||
            (className === 'Druid' && spec === 'Balance') ||
            (className === 'Shaman' && spec === 'Elemental');
        return ranged ? 'ranged' : 'melee';
    }

    function roleBadge(kind) {
        if (kind === 'tank') return '<span class="ds-role-icon ds-role-tank" title="Tank">🛡</span>';
        if (kind === 'healer') return '<span class="ds-role-icon ds-role-healer" title="Healer">✚</span>';
        if (kind === 'ranged') return '<span class="ds-role-icon ds-role-ranged" title="Ranged DPS">🏹</span>';
        return '<span class="ds-role-icon ds-role-melee" title="Melee DPS">⚔</span>';
    }

    function decorateCharacterRoleEditor() {
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
        preview.className = 'ds-role-preview ds-role-' + kind;
        preview.innerHTML = roleBadge(kind) + '<strong>' +
            (kind === 'tank' ? 'TANK' : kind === 'healer' ? 'HEALER' : kind === 'ranged' ? 'RANGED DPS' : 'MELEE DPS') +
            '</strong>';
        role.insertAdjacentElement('afterend', preview);
    }

    function installRoleStyles() {
        if (document.getElementById('dsRoleStyles')) return;
        var style = document.createElement('style');
        style.id = 'dsRoleStyles';
        style.textContent = `
            .ds-role-preview{display:flex;align-items:center;gap:10px;margin-top:8px;padding:10px 12px;border:1px solid;border-radius:10px;background:#0b0d12;font-weight:800;letter-spacing:.5px}
            .ds-role-icon{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9px;font-size:21px;line-height:1;border:1px solid currentColor;box-shadow:0 0 14px currentColor}
            .ds-role-tank{color:#2693ff}.ds-role-healer{color:#26d96b}.ds-role-melee{color:#ff3d3d}.ds-role-ranged{color:#ff9f2f}
            .ds-role-preview.ds-role-tank{color:#2693ff;border-color:#175c9e}.ds-role-preview.ds-role-healer{color:#26d96b;border-color:#16743d}.ds-role-preview.ds-role-melee{color:#ff3d3d;border-color:#8e2525}.ds-role-preview.ds-role-ranged{color:#ff9f2f;border-color:#925b20}
        `;
        document.head.appendChild(style);
    }

    function refresh() {
        installRoleStyles();
        removeSkybornFromGame();
        decorateCharacterRoleEditor();
    }

    document.addEventListener('DOMContentLoaded', function () {
        refresh();
        var modal = document.getElementById('siteModal');
        if (modal) {
            new MutationObserver(function () { setTimeout(refresh, 0); })
                .observe(modal, { childList: true, subtree: true });
        }
        document.addEventListener('change', function (event) {
            if (event.target && ['characterClass', 'characterSpec'].includes(event.target.id)) {
                setTimeout(refresh, 0);
            }
        });
    });
})();
