/* DARKSLAYERS role icons wrapper */
document.write('<script src="script-base.js?v=20261101-roleicons1"><\/script>');

(function () {
    const roleInfo = {
        TANK: { label: 'Tank', cls: 'tank', icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5 53 13v15c0 14-8.7 25.4-21 31C19.7 53.4 11 42 11 28V13L32 5Z"/><path class="inner" d="M32 13 45 18v10c0 9-5 16.8-13 21-8-4.2-13-12-13-21V18l13-5Z"/></svg>' },
        HEALER: { label: 'Healer', cls: 'healer', icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M25 7h14v18h18v14H39v18H25V39H7V25h18V7Z"/></svg>' },
        RANGED: { label: 'Ranged DPS', cls: 'ranged', icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 51c17-2 31-16 33-33l6-6M15 14c11 10 24 23 35 35M12 12l3 14 11-11-14-3Zm40 40-14-3 11-11 3 14Z"/></svg>' },
        MELEE: { label: 'Melee DPS', cls: 'melee', icon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m47 7 10 10-27 27-8 2 2-8L47 7Z"/><path d="m19 39 6 6-9 12-9-9 12-9Z"/></svg>' }
    };

    function combatType(role, className, spec) {
        const r = String(role || '').toUpperCase();
        if (r.includes('TANK')) return 'TANK';
        if (r.includes('HEAL')) return 'HEALER';
        if (r.includes('RANGED')) return 'RANGED';
        if (r.includes('MELEE')) return 'MELEE';
        const c = String(className || '');
        const s = String(spec || '');
        if (['Hunter','Mage','Warlock'].includes(c)) return 'RANGED';
        if (c === 'Priest' && s === 'Shadow') return 'RANGED';
        if (c === 'Shaman' && s === 'Elemental') return 'RANGED';
        if (c === 'Druid' && s === 'Balance') return 'RANGED';
        return 'MELEE';
    }

    window.darkslayersCombatRoleIcon = function (role) {
        const className = document.getElementById('characterClass')?.value || '';
        const spec = document.getElementById('characterSpec')?.value || '';
        const type = combatType(role, className, spec);
        return type === 'TANK' ? '🛡' : type === 'HEALER' ? '✚' : type === 'RANGED' ? '🏹' : '🗡';
    };

    function removeSkybornFromGameSelector() {
        const gameSelect = document.getElementById('characterGame');
        if (!gameSelect) return;
        Array.from(gameSelect.options).forEach(function (option) {
            if (String(option.value || option.textContent).trim().toLowerCase() === 'skyborn') {
                option.remove();
            }
        });
    }

    function renderRoleCard() {
        removeSkybornFromGameSelector();
        const input = document.getElementById('characterCombatRole');
        if (!input) return;
        const className = document.getElementById('characterClass')?.value || '';
        const spec = document.getElementById('characterSpec')?.value || '';
        const type = combatType(input.value, className, spec);
        const info = roleInfo[type];
        let card = document.getElementById('dsCombatRoleVisual');
        if (!card) {
            card = document.createElement('div');
            card.id = 'dsCombatRoleVisual';
            input.insertAdjacentElement('afterend', card);
        }
        card.className = 'ds-combat-role-card ' + info.cls;
        card.innerHTML = '<span class="ds-role-svg">' + info.icon + '</span><strong>' + info.label + '</strong>';
        input.classList.add('ds-role-value-hidden');
    }

    const originalUpdateCharacterRole = window.updateCharacterRole;
    window.updateCharacterRole = function () {
        if (typeof originalUpdateCharacterRole === 'function') originalUpdateCharacterRole.apply(this, arguments);
        setTimeout(renderRoleCard, 0);
    };

    const originalUpdateCharacterSpecs = window.updateCharacterSpecs;
    window.updateCharacterSpecs = function () {
        if (typeof originalUpdateCharacterSpecs === 'function') originalUpdateCharacterSpecs.apply(this, arguments);
        setTimeout(renderRoleCard, 0);
    };

    const observer = new MutationObserver(function () { renderRoleCard(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', renderRoleCard);
})();