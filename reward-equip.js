/* DARKSLAYERS - REWARD EQUIP STANDALONE V1
   Replace the old reward-equip.js with this file.
*/
(function () {
  'use strict';

  const state = {
    sb: null,
    user: null,
    owned: [],
    equipped: {},
    busy: new Set()
  };

  function getClient() {
    try {
      return (typeof darkslayersSupabase !== 'undefined' && darkslayersSupabase)
        ? darkslayersSupabase
        : null;
    } catch (_) {
      return null;
    }
  }

  function normalize(v) {
    return String(v || '').trim().toLowerCase();
  }

  function slotFor(category) {
    return String(category || '').toLowerCase() + '_item_id';
  }

  function isEquipped(item) {
    return String(state.equipped[slotFor(item.category)] || '') === String(item.id);
  }

  function colorFor(slug) {
    slug = normalize(slug);
    if (slug.includes('shadow') || slug.includes('dark')) return '#a83cff';
    if (slug.includes('frost')) return '#59d8ff';
    if (slug.includes('venom')) return '#79e71c';
    if (slug.includes('champion') || slug.includes('legendary')) return '#ffc83d';
    if (slug.includes('void')) return '#dc36ff';
    if (slug.includes('flame') || slug.includes('dragon')) return '#ff3a20';
    return '#d52a34';
  }

  function addCss() {
    if (document.getElementById('ds-reward-equip-standalone-css')) return;

    const style = document.createElement('style');
    style.id = 'ds-reward-equip-standalone-css';
    style.textContent = `
      .ds-equip-actions{grid-column:1/-1;display:flex;width:100%;margin-top:8px}
      .ds-equip-btn{display:block!important;width:100%;min-height:36px;border:1px solid #c92c35;background:linear-gradient(#841019,#4d090d);color:#fff;padding:9px 7px;font:900 10px Arial,sans-serif;cursor:pointer}
      .ds-equip-btn.equipped{border-color:#e5b93d;background:linear-gradient(#72520b,#332204);color:#ffe074}
      .ds-equip-btn:disabled{opacity:.6;cursor:wait}

      .ds-wow-avatar,.ds-profile-avatar{position:relative!important;overflow:visible!important;z-index:2}
      .ds-wow-avatar.ds-rw-frame:after,.ds-wow-avatar.ds-rw-frame:before,
      .ds-profile-avatar.ds-rw-frame:after,.ds-profile-avatar.ds-rw-frame:before{
        content:"";position:absolute;inset:-8px;border-radius:8px;border:4px solid var(--rw,#e22);
        box-shadow:0 0 14px var(--rw),inset 0 0 8px var(--rw);pointer-events:none;z-index:4
      }
      .ds-wow-avatar.ds-rw-frame:before,.ds-profile-avatar.ds-rw-frame:before{
        inset:-13px;border-width:2px;border-style:dashed;opacity:.7;animation:dsRwSpin 7s linear infinite
      }
      .ds-wow-avatar.ds-rw-effect,.ds-profile-avatar.ds-rw-effect{
        box-shadow:0 0 22px var(--fx,#a43aff),0 0 48px var(--fx)!important;
        animation:dsRwPulse 1.5s ease-in-out infinite alternate
      }
      .ds-wow-reward-title,.ds-profile-reward-title{margin-top:7px;color:#ffd86a;font:900 14px Georgia,serif}
      .ds-wow-reward-badge,.ds-profile-reward-badge{
        display:inline-block;margin-top:7px;padding:4px 8px;border:1px solid #8b2a31;
        background:#16090a;color:#f2d37b;font:800 10px Arial,sans-serif
      }
      @keyframes dsRwSpin{to{transform:rotate(360deg)}}
      @keyframes dsRwPulse{to{filter:brightness(1.2)}}
    `;
    document.head.appendChild(style);
  }

  function itemMap() {
    const map = {};
    state.owned.forEach(x => { if (x) map[String(x.id)] = x; });
    return map;
  }

  function currentRewards() {
    const map = itemMap();
    return {
      frame: map[String(state.equipped.frame_item_id || '')],
      title: map[String(state.equipped.title_item_id || '')],
      badge: map[String(state.equipped.badge_item_id || '')],
      effect: map[String(state.equipped.effect_item_id || '')]
    };
  }

  function paint(root, avatarSelector, nameSelector, titleClass, badgeClass) {
    if (!root) return;

    const rewards = currentRewards();
    const avatar = root.querySelector(avatarSelector);
    const name = root.querySelector(nameSelector);

    if (avatar) {
      avatar.classList.remove('ds-rw-frame', 'ds-rw-effect');
      avatar.style.removeProperty('--rw');
      avatar.style.removeProperty('--fx');

      if (rewards.frame) {
        avatar.classList.add('ds-rw-frame');
        avatar.style.setProperty('--rw', colorFor(rewards.frame.slug));
      }
      if (rewards.effect) {
        avatar.classList.add('ds-rw-effect');
        avatar.style.setProperty('--fx', colorFor(rewards.effect.slug));
      }
    }

    root.querySelectorAll('.' + titleClass + ',.' + badgeClass).forEach(n => n.remove());

    const info = name && name.parentElement;
    if (!info) return;

    if (rewards.title) {
      const title = document.createElement('div');
      title.className = titleClass;
      title.textContent = '✦ ' + rewards.title.name;
      info.appendChild(title);
    }

    if (rewards.badge) {
      const badge = document.createElement('div');
      badge.className = badgeClass;
      badge.textContent = '◆ ' + rewards.badge.name;
      info.appendChild(badge);
    }
  }

  function paintProfiles() {
    paint(
      document.querySelector('#dsMemberProfileV2 .ds-wow'),
      '.ds-wow-avatar', '.ds-wow-name',
      'ds-wow-reward-title', 'ds-wow-reward-badge'
    );

    paint(
      document.querySelector('#dsMemberProfile .ds-profile-modal'),
      '.ds-profile-avatar', '.ds-profile-name',
      'ds-profile-reward-title', 'ds-profile-reward-badge'
    );
  }

  function findOwnedByName(name) {
    const n = normalize(name);
    return state.owned.find(x => normalize(x.name) === n);
  }

  function renderButtons() {
    const box = document.querySelector('[data-inventory]');
    if (!box) return;

    box.querySelectorAll('.ds-inv-item').forEach(row => {
      const title = row.querySelector('b');
      if (!title) return;

      const item = findOwnedByName(title.textContent);
      if (!item) return;

      let actions = row.querySelector('.ds-equip-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'ds-equip-actions';
        row.appendChild(actions);
      }

      let button = actions.querySelector('.ds-equip-btn');
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'ds-equip-btn';
        actions.appendChild(button);
      }

      const on = isEquipped(item);
      const waiting = state.busy.has(String(item.id));

      button.dataset.itemId = String(item.id);
      button.className = 'ds-equip-btn' + (on ? ' equipped' : '');
      button.textContent = waiting ? 'SE SALVEAZA...' : (on ? 'DEZECHIPEAZA' : 'ECHIPEAZA');
      button.disabled = waiting;
    });
  }

  async function loadState() {
    const sb = getClient();
    if (!sb) {
      console.error('[RewardEquip] Supabase client missing');
      return false;
    }
    state.sb = sb;

    const sessionResult = await sb.auth.getSession();
    if (sessionResult.error) {
      console.error('[RewardEquip] Session error:', sessionResult.error);
      return false;
    }

    state.user = sessionResult.data && sessionResult.data.session
      ? sessionResult.data.session.user
      : null;

    if (!state.user) {
      state.owned = [];
      state.equipped = {};
      renderButtons();
      paintProfiles();
      return false;
    }

    const uid = state.user.id;

    const [inventoryResult, shopResult, equippedResult] = await Promise.all([
      sb.from('user_reward_inventory')
        .select('item_id')
        .eq('user_id', uid),

      sb.from('reward_shop_items')
        .select('id,slug,name,category,rarity')
        .eq('active', true),

      sb.from('user_equipped_rewards')
        .select('frame_item_id,title_item_id,badge_item_id,effect_item_id')
        .eq('user_id', uid)
        .maybeSingle()
    ]);

    if (inventoryResult.error) {
      console.error('[RewardEquip] Inventory error:', inventoryResult.error);
      return false;
    }
    if (shopResult.error) {
      console.error('[RewardEquip] Shop items error:', shopResult.error);
      return false;
    }
    if (equippedResult.error) {
      console.error('[RewardEquip] Equipped error:', equippedResult.error);
      return false;
    }

    const ids = new Set((inventoryResult.data || []).map(r => String(r.item_id)));
    state.owned = (shopResult.data || []).filter(item => ids.has(String(item.id)));
    state.equipped = equippedResult.data || {};

    renderButtons();
    paintProfiles();
    return true;
  }

  async function toggle(item) {
    if (!state.sb || !item) return;

    const id = String(item.id);
    if (state.busy.has(id)) return;

    const key = slotFor(item.category);
    const wasEquipped = isEquipped(item);
    const previous = state.equipped[key] || null;

    state.busy.add(id);

    // Instant visual response.
    state.equipped[key] = wasEquipped ? null : item.id;
    renderButtons();
    paintProfiles();

    try {
      const result = wasEquipped
        ? await state.sb.rpc('unequip_reward_item', { p_category: item.category })
        : await state.sb.rpc('equip_reward_item', { p_item_id: Number(item.id) });

      if (result.error) throw result.error;
    } catch (err) {
      state.equipped[key] = previous;
      console.error('[RewardEquip] Equip/unequip failed:', err);
    } finally {
      state.busy.delete(id);
      renderButtons();
      paintProfiles();
    }
  }

  function onClick(event) {
    const equipButton = event.target.closest && event.target.closest('.ds-equip-btn');
    if (equipButton) {
      event.preventDefault();
      event.stopPropagation();

      const item = state.owned.find(x => String(x.id) === String(equipButton.dataset.itemId));
      if (item) toggle(item);
      return;
    }

    // Profile was opened: repaint after its HTML exists.
    if (event.target.closest &&
        event.target.closest('[data-member-name],.roster-member,.member-card')) {
      setTimeout(paintProfiles, 100);
      setTimeout(paintProfiles, 350);
    }

    // Bought a reward: reload owned items after shop completes.
    if (event.target.closest && event.target.closest('.ds-shop-buy')) {
      setTimeout(loadState, 500);
    }
  }

  function start() {
    addCss();
    document.addEventListener('click', onClick);

    // Inventory can be rendered after this script. A light timer only checks DOM;
    // it does NOT query Supabase and does NOT rewrite existing buttons unnecessarily.
    setInterval(function () {
      renderButtons();
      paintProfiles();
    }, 500);

    loadState();
    setTimeout(loadState, 700);
  }

  window.refreshRewardEquip = loadState;
  window.DarkSlayersRewardEquip = {
    refresh: loadState,
    render: renderButtons,
    paint: paintProfiles
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
