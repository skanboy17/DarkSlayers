/* DARKSLAYERS - DIRECT FORUM CLASS ICON FIX */
(function () {
"use strict";

function installForumClassStyles() {
    if (document.getElementById("ds-forum-direct-class-css")) return;
    const style = document.createElement("style");
    style.id = "ds-forum-direct-class-css";
    style.textContent = `
    #forumTopics .forum-topic.ds-forum-topic-with-class{
        display:grid!important;
        grid-template-columns:120px 50px minmax(0,1fr) 40px!important;
        align-items:center!important;
        column-gap:6px!important;
        min-height:86px!important;
    }
    #forumTopics .forum-topic.ds-forum-topic-with-class .forum-topic-category{grid-column:1!important;}
    #forumTopics .ds-forum-topic-class{
        grid-column:2!important;
        width:48px!important;height:48px!important;
        display:flex!important;align-items:center!important;justify-content:center!important;
        overflow:hidden!important;border:1px solid #8d252b!important;border-radius:5px!important;
        background:#070707!important;box-shadow:0 0 10px rgba(210,25,35,.28)!important;
    }
    #forumTopics .ds-forum-topic-class img{
        display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;
    }
    #forumTopics .forum-topic.ds-forum-topic-with-class .forum-topic-main{
        grid-column:3!important;min-width:0!important;text-align:left!important;
    }
    #forumTopics .forum-topic.ds-forum-topic-with-class .forum-topic-arrow{grid-column:4!important;}
    @media(max-width:700px){
        #forumTopics .forum-topic.ds-forum-topic-with-class{
            grid-template-columns:88px 40px minmax(0,1fr) 24px!important;column-gap:5px!important;
        }
        #forumTopics .ds-forum-topic-class{width:38px!important;height:38px!important;}
    }`;
    document.head.appendChild(style);
}

async function directForumTopics(page) {
    const box = document.getElementById("forumTopics");
    if (!box || typeof darkslayersSupabase === "undefined" || !darkslayersSupabase) return;

    const current = (typeof DARKSLAYERS_FORUM_PAGE !== "undefined" ? DARKSLAYERS_FORUM_PAGE : 1);
    const size = (typeof DARKSLAYERS_FORUM_PAGE_SIZE !== "undefined" ? DARKSLAYERS_FORUM_PAGE_SIZE : 10);
    page = Math.max(1, Number(page || current) || 1);
    DARKSLAYERS_FORUM_PAGE = page;
    box.innerHTML = '<div class="forum-empty">Se incarca forumul...</div>';

    const filter = document.getElementById("forumCategoryFilter")?.value || "all";
    const from = (page - 1) * size;
    const to = from + size - 1;

    let q = darkslayersSupabase.from("forum_topics")
        .select("id,created_at,author_id,category,title,content,pinned", {count:"exact"})
        .order("pinned", {ascending:false})
        .order("created_at", {ascending:false})
        .range(from, to);

    if (filter !== "all") q = q.eq("category", filter);

    const {data,error,count} = await q;
    if (error) {
        console.error(error);
        box.innerHTML = '<div class="forum-empty">Nu am putut incarca forumul.</div>';
        return;
    }

    const topics = data || [];
    const totalPages = Math.max(1, Math.ceil((count || 0) / size));
    if (page > totalPages) return directForumTopics(totalPages);

    const ids = [...new Set(topics.map(x => x.author_id))];
    const pmap = await loadForumPublicProfiles(ids);

    if (!topics.length) {
        box.innerHTML = '<div class="forum-empty">Nu exista subiecte inca. Fii primul care scrie!</div>';
        return;
    }

    let html = topics.map(t => {
        const p = pmap.get(t.author_id) || {};
        const c = p.main_character || null;
        const className = c?.class || "";
        const classIcon = className && typeof darkslayersClassIcon === "function"
            ? darkslayersClassIcon(className) : "";

        return `<button class="forum-topic ds-forum-topic-with-class" onclick="openForumTopic(${Number(t.id)})">
            <span class="forum-topic-category">${t.pinned ? "📌 " : ""}${escapeHtml(t.category)}</span>
            <span class="ds-forum-topic-class" title="${escapeHtml(className || "Clasa")}">
                ${classIcon ? `<img src="${classIcon}?v=forum-direct-final" alt="${escapeHtml(className)}">` : ""}
            </span>
            <span class="forum-topic-main">
                <strong>${t.pinned ? "📌 " : ""}${escapeHtml(t.title)}</strong>
                <small>de ${escapeHtml(p.display_name||"Membru")} • ${(p.role||"member").toUpperCase()}${c ? " • " + escapeHtml(c.class) + " • " + escapeHtml(c.spec || "") : ""} • ${forumDate(t.created_at)}</small>
            </span>
            <span class="forum-topic-arrow">→</span>
        </button>`;
    }).join("");

    if (totalPages > 1) {
        let pages = "";
        for (let i=1; i<=totalPages; i++) {
            pages += `<button type="button" onclick="changeForumPage(${i})" ${i===page ? "disabled" : ""}>${i}</button>`;
        }
        html += `<div class="forum-pagination" style="display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap;margin-top:18px;">
            <button type="button" onclick="changeForumPage(${page-1})" ${page<=1 ? "disabled" : ""}>← INAPOI</button>
            ${pages}
            <button type="button" onclick="changeForumPage(${page+1})" ${page>=totalPages ? "disabled" : ""}>URMATOAREA →</button>
        </div>`;
    }
    box.innerHTML = html;
}

function install() {
    installForumClassStyles();
    window.loadForumTopics = directForumTopics;
    setTimeout(() => directForumTopics(1), 50);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
else install();
})();
