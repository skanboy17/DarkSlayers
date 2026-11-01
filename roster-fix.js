/* DARKSLAYERS - ROSTER FINAL FIX
   - connected accounts use MAIN character
   - admin = GUILD MASTER
   - officer = OFFICER
   - removes duplicate roster rows for the same character/account
   - proper Tank / Healer / Melee / Ranged icons
*/
(function () {
  'use strict';

  function client() {
    try {
      if (typeof darkslayersSupabase !== 'undefined' && darkslayersSupabase &&
          typeof darkslayersSupabase.from === 'function') return darkslayersSupabase;
    } catch (_) {}
    return null;
  }

  function esc(v) {
    if (typeof escapeHtml === 'function') return escapeHtml(String(v ?? ''));
    return String(v ?? '').replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
    })[c]);
  }

  function roleKind(cls, spec, role) {
    role = String(role || '').toUpperCase();
    cls = String(cls || '');
    spec = String(spec || '');

    if (role === 'TANK') return 'tank';
    if (role === 'HEALER') return 'healer';

    const ranged =
      ['Hunter','Mage','Warlock'].includes(cls) ||
      (cls === 'Priest' && spec === 'Shadow') ||
      (cls === 'Druid' && spec === 'Balance') ||
      (cls === 'Shaman' && spec === 'Elemental');

    return ranged ? 'ranged' : 'melee';
  }

  function roleLabel(k) {
    return {tank:'TANK', healer:'HEALER', melee:'MELEE DPS', ranged:'RANGED DPS'}[k] || 'DPS';
  }

  function icon(k) {
    if (k === 'tank') return '<span class="ds-final-icon tank" title="Tank"><svg viewBox="0 0 24 24"><path d="M12 2 20 5v6c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5l8-3Zm0 3.2L7 7v4c0 3.5 2 6.4 5 7.9 3-1.5 5-4.4 5-7.9V7l-5-1.8Z"/></svg></span>';
    if (k === 'healer') return '<span class="ds-final-icon healer" title="Healer">✚</span>';
    if (k === 'ranged') return '<span class="ds-final-icon ranged" title="Ranged DPS">🏹</span>';
    return '<span class="ds-final-icon melee" title="Melee DPS">⚔</span>';
  }

  function rank(rankValue, profileRole) {
    const pr = String(profileRole || '').toLowerCase();
    if (pr === 'admin') return {key:'gm', label:'GUILD MASTER'};
    if (pr === 'officer') return {key:'officer', label:'OFFICER'};

    const r = String(rankValue || 'member').toLowerCase();
    if (r === 'gm' || r === 'guild master') return {key:'gm', label:'GUILD MASTER'};
    if (r === 'officer') return {key:'officer', label:'OFFICER'};
    if (r === 'veteran') return {key:'veteran', label:'VETERAN'};
    if (r === 'core' || r === 'core raider') return {key:'core', label:'CORE RAIDER'};
    return {key:'member', label:'MEMBER'};
  }

  async function prepare(input) {
    let rows = (Array.isArray(input) ? input : []).map(x => Object.assign({}, x));
    const db = client();
    if (!db || !rows.length) return rows;

    const ids = [...new Set(rows.map(x => x.user_id).filter(Boolean))];

    let profiles = [], chars = [];
    if (ids.length) {
      try {
        const [p, c] = await Promise.all([
          db.from('profiles').select('id,display_name,role').in('id', ids),
          db.from('characters')
            .select('user_id,character_name,class,spec,combat_role,game,level,is_main')
            .in('user_id', ids)
        ]);
        profiles = p.data || [];
        chars = c.data || [];
      } catch (e) {
        console.warn('Roster final fix:', e);
      }
    }

    const pmap = {};
    profiles.forEach(p => pmap[p.id] = p);

    const mmap = {};
    chars.forEach(c => {
      if (c.is_main === true) mmap[c.user_id] = c;
    });

    rows.forEach(m => {
      if (!m.user_id) return;
      const p = pmap[m.user_id];
      const c = mmap[m.user_id];

      m._profileRole = p && p.role ? p.role : '';

      if (c) {
        m.name = c.character_name || (p && p.display_name) || m.name;
        m.class = c.class || m.class;
        m.spec = c.spec || '';
        m.role = c.combat_role || m.role;
        m.game = c.game || m.game;
        m.level = c.level || m.level;
      } else if (p && p.display_name) {
        m.name = p.display_name;
      }
    });

    /* Prefer the linked-account row when the same character exists twice. */
    const byName = new Map();
    rows.forEach(m => {
      const key = String(m.name || '').trim().toLowerCase();
      if (!key) return;
      const old = byName.get(key);
      if (!old || (!old.user_id && m.user_id)) byName.set(key, m);
      else if (old.user_id && m.user_id && Number(m.id || 0) > Number(old.id || 0)) {
        /* keep rank from the stronger/older row if needed */
        if ((!m.rank || String(m.rank).toLowerCase() === 'member') &&
            old.rank && String(old.rank).toLowerCase() !== 'member') {
          m.rank = old.rank;
        }
        byName.set(key, m);
      }
    });

    return [...byName.values()];
  }

  function render(rows) {
    const list = document.querySelector('.roster-list');
    if (!list) return;

    if (!rows.length) {
      list.innerHTML = '<div class="roster-empty">Rosterul este gol momentan.</div>';
      return;
    }

    list.innerHTML = rows.map(m => {
      const k = roleKind(m.class, m.spec, m.role);
      const rk = rank(m.rank, m._profileRole);
      const info = [m.class || 'Clasa', m.spec || '', m.game || ''].filter(Boolean);
      if (m.level) info.push('Lv. ' + Number(m.level));

      return '<div class="roster-member '+(m.user_id?'roster-linked':'')+'" data-rank="'+rk.key+'">' +
        '<div class="roster-avatar ds-final-role '+k+'">'+icon(k)+'</div>' +
        '<div class="roster-player"><h3>'+esc(m.name || 'Member')+
        (m.user_id?' <small class="roster-linked-badge">CONT</small>':'')+
        '</h3><span>'+esc(info.join(' - '))+' - <b class="ds-final-role-text '+k+'">'+roleLabel(k)+'</b></span></div>' +
        '<div class="roster-rank rank-'+rk.key+'">'+rk.label+'</div>' +
        '<div class="roster-status online">ACTIVE</div></div>';
    }).join('');
  }

  async function finalRender(rows) {
    render(await prepare(rows));
  }

  function addStyles() {
    if (document.getElementById('ds-final-roster-style')) return;
    const s = document.createElement('style');
    s.id = 'ds-final-roster-style';
    s.textContent = `
      .roster-avatar.ds-final-role{display:flex!important;align-items:center!important;justify-content:center!important;background:#080808!important}
      .ds-final-icon{display:flex;align-items:center;justify-content:center;width:44px;height:44px;font-size:27px;font-weight:900}
      .ds-final-icon svg{width:31px;height:31px;fill:currentColor;filter:drop-shadow(0 0 5px currentColor)}
      .ds-final-role.tank,.ds-final-role-text.tank,.ds-final-icon.tank{color:#248cff!important}
      .ds-final-role.healer,.ds-final-role-text.healer,.ds-final-icon.healer{color:#25d968!important}
      .ds-final-role.melee,.ds-final-role-text.melee,.ds-final-icon.melee{color:#ff3c3c!important}
      .ds-final-role.ranged,.ds-final-role-text.ranged,.ds-final-icon.ranged{color:#ff9d2d!important}
      .ds-final-role-text{font-size:11px;font-weight:900}
      .roster-linked-badge{font-size:8px;color:#45e66f;border:1px solid #247b3d;padding:2px 5px;border-radius:4px;margin-left:6px}
    `;
    document.head.appendChild(s);
  }

  function install() {
    addStyles();

    window.renderDarkSlayersRoster = function(rows) {
      window.DARKSLAYERS_MEMBERS = Array.isArray(rows) ? rows : [];
      finalRender(window.DARKSLAYERS_MEMBERS);
    };

    document.addEventListener('darkslayers:members-loaded', e => finalRender(e.detail || []));

    if (Array.isArray(window.DARKSLAYERS_MEMBERS)) {
      finalRender(window.DARKSLAYERS_MEMBERS);
    }
  }

  install();
})();
