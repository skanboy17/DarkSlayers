/* DARKSLAYERS - ROSTER CONNECTED ACCOUNT FIX */
(function () {
  'use strict';

  function esc(v) {
    if (typeof escapeHtml === 'function') return escapeHtml(String(v ?? ''));
    return String(v ?? '').replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];
    });
  }

  function getClient() {
    try {
      if (typeof darkslayersSupabase !== 'undefined' && darkslayersSupabase && typeof darkslayersSupabase.from === 'function') {
        return darkslayersSupabase;
      }
    } catch (_) {}
    return null;
  }

  function roleKind(className, spec, role) {
    var r = String(role || '').toUpperCase();
    var c = String(className || '');
    var s = String(spec || '');

    if (r === 'TANK') return 'tank';
    if (r === 'HEALER') return 'healer';

    var ranged =
      ['Hunter','Mage','Warlock'].includes(c) ||
      (c === 'Priest' && s === 'Shadow') ||
      (c === 'Druid' && s === 'Balance') ||
      (c === 'Shaman' && s === 'Elemental');

    return ranged ? 'ranged' : 'melee';
  }

  function roleLabel(kind) {
    return {
      tank:'TANK',
      healer:'HEALER',
      melee:'MELEE DPS',
      ranged:'RANGED DPS'
    }[kind] || 'DPS';
  }

  function roleIcon(kind) {
    if (kind === 'tank') {
      return '<span class="ds-r-icon ds-tank"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 20 5v6c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5l8-3Zm0 3.1L7 7v4c0 3.5 2 6.4 5 7.9 3-1.5 5-4.4 5-7.9V7l-5-1.9Z"/></svg></span>';
    }
    if (kind === 'healer') return '<span class="ds-r-icon ds-healer">✚</span>';
    if (kind === 'ranged') return '<span class="ds-r-icon ds-ranged">🏹</span>';
    return '<span class="ds-r-icon ds-melee">⚔</span>';
  }

  function rankInfo(rank) {
    if (typeof rosterRankInfo === 'function') return rosterRankInfo(rank);

    var key = String(rank || 'member').toLowerCase();
    var map = {
      gm:{key:'gm',label:'GUILD MASTER'},
      admin:{key:'gm',label:'GUILD MASTER'},
      officer:{key:'officer',label:'OFFICER'},
      veteran:{key:'veteran',label:'VETERAN'},
      core:{key:'core',label:'CORE RAIDER'},
      'core raider':{key:'core',label:'CORE RAIDER'},
      member:{key:'member',label:'MEMBER'}
    };
    return map[key] || map.member;
  }

  async function enrich(members) {
    var rows = (Array.isArray(members) ? members : []).map(function(m){
      return Object.assign({}, m);
    });

    var client = getClient();
    if (!client) return rows;

    var ids = [...new Set(rows.map(function(m){ return m.user_id; }).filter(Boolean))];
    if (!ids.length) return rows;

    try {
      var results = await Promise.all([
        client.from('profiles').select('id,display_name,role').in('id', ids),
        client.from('characters')
          .select('user_id,character_name,class,spec,combat_role,game,level,is_main')
          .in('user_id', ids)
      ]);

      var profiles = results[0].data || [];
      var chars = results[1].data || [];

      if (results[0].error) console.warn('Roster profiles:', results[0].error);
      if (results[1].error) console.warn('Roster characters:', results[1].error);

      var profilesById = {};
      profiles.forEach(function(p){ profilesById[p.id] = p; });

      var mainByUser = {};
      chars.forEach(function(c){
        if (c.is_main === true) mainByUser[c.user_id] = c;
      });

      rows.forEach(function(m){
        if (!m.user_id) return;

        var profile = profilesById[m.user_id];
        var main = mainByUser[m.user_id];

        if (main) {
          m.name = main.character_name || (profile && profile.display_name) || m.name;
          m.class = main.class || m.class;
          m.spec = main.spec || '';
          m.role = main.combat_role || m.role;
          m.game = main.game || m.game;
          m.level = main.level || m.level;
        } else if (profile && profile.display_name) {
          m.name = profile.display_name;
        }
      });
    } catch (err) {
      console.warn('DARKSLAYERS roster fix:', err);
    }

    return rows;
  }

  function render(rows) {
    var list = document.querySelector('.roster-list');
    if (!list) return;

    if (!rows.length) {
      list.innerHTML = '<div class="roster-empty">Rosterul este gol momentan.</div>';
      return;
    }

    list.innerHTML = rows.map(function(m){
      var rank = rankInfo(m.rank);
      var kind = roleKind(m.class, m.spec, m.role);
      var details = [m.class || 'Clasa', m.spec || '', m.game || ''].filter(Boolean).join(' • ');
      if (m.level) details += (details ? ' • ' : '') + 'Lv. ' + Number(m.level);

      return '<div class="roster-member '+(m.user_id?'roster-linked':'')+'" data-rank="'+esc(rank.key)+'" data-member-id="'+esc(m.id || '')+'">' +
        '<div class="roster-avatar ds-roster-role ds-'+kind+'" title="'+roleLabel(kind)+'">'+roleIcon(kind)+'</div>' +
        '<div class="roster-player"><h3>'+esc(m.name || 'Member')+(m.user_id?' <small class="roster-linked-badge">CONT</small>':'')+'</h3>' +
        '<span>'+esc(details)+' • <b class="ds-role-text ds-'+kind+'">'+roleLabel(kind)+'</b></span></div>' +
        '<div class="roster-rank rank-'+esc(rank.key)+'">'+esc(rank.label)+'</div>' +
        '<div class="roster-status online">● ACTIVE</div>' +
      '</div>';
    }).join('');
  }

  async function fixedRender(members) {
    var rows = await enrich(members);
    render(rows);
  }

  function css() {
    if (document.getElementById('ds-roster-fix-css')) return;
    var s = document.createElement('style');
    s.id = 'ds-roster-fix-css';
    s.textContent =
      '.roster-avatar.ds-roster-role{display:flex;align-items:center;justify-content:center;background:#080a0e}' +
      '.ds-r-icon{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;font-size:24px}' +
      '.ds-r-icon svg{width:29px;height:29px;fill:currentColor}' +
      '.ds-tank{color:#248cff!important}.ds-healer{color:#25d968!important}' +
      '.ds-melee{color:#ff3c3c!important}.ds-ranged{color:#ff9d2d!important}' +
      '.ds-role-text{font-size:11px;font-weight:900;margin-left:5px;letter-spacing:.4px}' +
      '.roster-linked-badge{font-size:8px;color:#45e66f;border:1px solid #247b3d;padding:2px 4px;border-radius:4px;margin-left:5px}';
    document.head.appendChild(s);
  }

  function install() {
    css();

    window.renderDarkSlayersRoster = function(members) {
      window.DARKSLAYERS_MEMBERS = Array.isArray(members) ? members : [];
      fixedRender(window.DARKSLAYERS_MEMBERS);
    };

    document.addEventListener('darkslayers:members-loaded', function(e) {
      fixedRender(e.detail || []);
    });

    if (Array.isArray(window.DARKSLAYERS_MEMBERS)) {
      fixedRender(window.DARKSLAYERS_MEMBERS);
    }
  }

  install();
})();
