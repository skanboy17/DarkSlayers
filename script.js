/* =========================================
   SUPABASE - DARKSLAYERS
   Public browser connection only.
   NEVER put the Supabase secret key in this file.
========================================= */
const DARKSLAYERS_SUPABASE_URL = "https://hivwzuduuvfvwdgrdcmw.supabase.co";
const DARKSLAYERS_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_61ygsmlpCWR4X41ArKEOyQ_SPsNe19L";

const darkslayersSupabase = window.supabase
    ? window.supabase.createClient(
        DARKSLAYERS_SUPABASE_URL,
        DARKSLAYERS_SUPABASE_PUBLISHABLE_KEY
      )
    : null;

async function loadDarkSlayersMembers() {
    if (!darkslayersSupabase) {
        console.error("Supabase client was not loaded.");
        return [];
    }

    const { data, error } = await darkslayersSupabase
        .from("members")
        .select("id, created_at, name, game, class, role, rank, level")
        .order("name", { ascending: true });

    if (error) {
        console.error("DARKSLAYERS members:", error);
        return [];
    }

    window.DARKSLAYERS_MEMBERS = data || [];
    document.dispatchEvent(new CustomEvent("darkslayers:members-loaded", {
        detail: window.DARKSLAYERS_MEMBERS
    }));

    return window.DARKSLAYERS_MEMBERS;
}

document.addEventListener("DOMContentLoaded", function () { refreshDarkSlayersRoster(); });

/* =========================================
   DARKSLAYERS - COMPLETE SCRIPT
========================================= */


/* =========================================
   FOREVER / WOTLK
========================================= */

function showForever() {

    const forever =
        document.getElementById("foreverRaids");

    const wotlk =
        document.getElementById("wotlkRaids");

    const foreverBtn =
        document.getElementById("foreverBtn");

    const wotlkBtn =
        document.getElementById("wotlkBtn");


    forever.style.display = "grid";
    wotlk.style.display = "none";

    foreverBtn.classList.add("selected");
    wotlkBtn.classList.remove("selected");
}


function showWotlk() {

    const forever =
        document.getElementById("foreverRaids");

    const wotlk =
        document.getElementById("wotlkRaids");

    const foreverBtn =
        document.getElementById("foreverBtn");

    const wotlkBtn =
        document.getElementById("wotlkBtn");


    forever.style.display = "none";
    wotlk.style.display = "grid";

    foreverBtn.classList.remove("selected");
    wotlkBtn.classList.add("selected");
}


/* =========================================
   ROSTER FILTER
========================================= */

function filterRoster(rank, button) {

    const members =
        document.querySelectorAll(".roster-member");

    const buttons =
        document.querySelectorAll(".roster-filter");


    buttons.forEach(function (btn) {

        btn.classList.remove("active");

    });


    button.classList.add("active");


    members.forEach(function (member) {

        if (
            rank === "all" ||
            member.dataset.rank === rank
        ) {

            member.style.display = "grid";

        } else {

            member.style.display = "none";

        }

    });

}


/* =========================================
   RAID PROGRESS - SUPABASE LIVE
========================================= */

const DARKSLAYERS_RAID_KEYS = {
    forever: {
        "barrow deeps": "barrow-deeps",
        "hyjal summit": "hyjal-summit",
        "onyxia's lair": "onyxia-forever"
    },
    wotlk: {
        "naxxramas": "naxxramas",
        "obsidian sanctum": "obsidian-sanctum",
        "eye of eternity": "eye-of-eternity",
        "ulduar": "ulduar",
        "trial of the crusader": "trial-of-the-crusader",
        "onyxia's lair": "onyxia-wotlk",
        "icecrown citadel": "icecrown-citadel",
        "ruby sanctum": "ruby-sanctum"
    }
};

async function getDarkSlayersRaidAdminStatus() {
    if (!darkslayersSupabase) return false;
    const { data: authData } = await darkslayersSupabase.auth.getUser();
    const user = authData?.user;
    if (!user) return false;

    const { data: profile, error } = await darkslayersSupabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error("DARKSLAYERS raid admin check:", error);
        return false;
    }
    return profile?.role === "admin";
}

async function loadDarkSlayersRaidProgress() {
    if (!darkslayersSupabase) return;

    const [{ data: rows, error }, isAdmin] = await Promise.all([
        darkslayersSupabase
            .from("raid_progress")
            .select("raid_key, current_bosses, total_bosses"),
        getDarkSlayersRaidAdminStatus()
    ]);

    if (error) {
        console.error("DARKSLAYERS raid progress:", error);
        return;
    }

    const progressByKey = new Map((rows || []).map(row => [row.raid_key, row]));

    document.querySelectorAll(".raid").forEach(function (raid) {
        const title = raid.querySelector("h3")?.textContent.trim();
        if (!title) return;

        const expansion = raid.closest("#foreverRaids") ? "forever" :
                          raid.closest("#wotlkRaids") ? "wotlk" : null;
        if (!expansion) return;

        const raidKey = DARKSLAYERS_RAID_KEYS[expansion]?.[title.toLowerCase()];
        if (!raidKey) return;

        const row = progressByKey.get(raidKey);
        if (!row) return;

        let currentBosses = Number(row.current_bosses) || 0;
        const maxBosses = Number(row.total_bosses) || 0;

        const oldText = raid.querySelector("p");
        const oldControls = raid.querySelector(".raid-progress");
        if (oldControls) oldControls.remove();

        const controls = document.createElement("div");
        controls.className = "raid-progress";

        const progressNumber = document.createElement("span");
        progressNumber.className = "progress-number";

        let minusButton = null;
        let plusButton = null;

        if (isAdmin) {
            minusButton = document.createElement("button");
            minusButton.className = "progress-button minus";
            minusButton.textContent = "−";
            minusButton.type = "button";

            plusButton = document.createElement("button");
            plusButton.className = "progress-button plus";
            plusButton.textContent = "+";
            plusButton.type = "button";

            controls.appendChild(minusButton);
        }

        controls.appendChild(progressNumber);
        if (plusButton) controls.appendChild(plusButton);

        if (oldText) oldText.replaceWith(controls);
        else raid.appendChild(controls);

        function renderProgress() {
            progressNumber.textContent = currentBosses + " / " + maxBosses;
            raid.classList.toggle("raid-completed", currentBosses === maxBosses && maxBosses > 0);
            if (minusButton) minusButton.disabled = currentBosses <= 0;
            if (plusButton) plusButton.disabled = currentBosses >= maxBosses;
        }

        async function saveProgress(nextValue) {
            if (!isAdmin) return;
            const previousValue = currentBosses;
            currentBosses = Math.max(0, Math.min(maxBosses, nextValue));
            renderProgress();

            const { error: updateError } = await darkslayersSupabase
                .from("raid_progress")
                .update({
                    current_bosses: currentBosses,
                    updated_at: new Date().toISOString()
                })
                .eq("raid_key", raidKey);

            if (updateError) {
                console.error("DARKSLAYERS raid update:", updateError);
                currentBosses = previousValue;
                renderProgress();
                alert("Nu am putut salva progresul raidului.");
            }
        }

        minusButton?.addEventListener("click", () => saveProgress(currentBosses - 1));
        plusButton?.addEventListener("click", () => saveProgress(currentBosses + 1));
        renderProgress();
    });
}

document.addEventListener("DOMContentLoaded", loadDarkSlayersRaidProgress);

/* =========================================
   MENIU ACTIV LA CLICK
========================================= */

const menuLinks =
    document.querySelectorAll(".menu a");


menuLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                menuLinks.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                link.classList.add(
                    "active"
                );

            }
        );

    }
);




/* =========================================
   HALL OF FAME
========================================= */

function openHallOfFame() {

    openSiteModal({
        icon: "🏆",
        label: "DARKSLAYERS",
        title: "HALL OF FAME",
        content: `
            <div class="modal-highlight">
                Aici pastram membrii si momentele care au lasat
                o urma importanta in istoria DARKSLAYERS.
            </div>

            <h3>♛ DARKSLAYER OF THE MONTH</h3>

            <div class="hall-entry">
                <div class="hall-entry-icon">⚔</div>

                <div>
                    <strong>Skanners</strong>
                    <span>GUILD MASTER</span>
                    <p>Membrul lunii • Activitate, raiduri si contributie in comunitate.</p>
                </div>
            </div>

            <h3>🏆 FIRST KILLS</h3>

            <div class="hall-empty">
                Primele victorii importante ale guildei vor aparea aici.
            </div>

            <div class="modal-highlight">
                Hall of Fame va pastra membrii lunii si momentele speciale
                care merita sa ramana in istoria guildei.
            </div>
        `
    });

}


/* =========================================
   RECRUTARE DETALIATA
========================================= */

function openRecruitment() {

    openSiteModal({
        icon: "⚔",
        label: "JOIN DARKSLAYERS",
        title: "RECRUTARE",
        content: `
            <div class="modal-highlight">
                DARKSLAYERS cauta oameni care vor sa faca parte dintr-o
                comunitate activa si sa progresam impreuna.
            </div>

            <h3>⚔ RAIDERS</h3>
            <p>
                Cautam jucatori interesati de dungeon-uri, raiduri
                si progres PvE alaturi de guilda.
            </p>

            <h3>🛡 SOCIAL</h3>
            <p>
                Nu trebuie sa fii hardcore. Sunt bineveniti si jucatorii
                care vor o comunitate, ajutor si oameni cu care sa joace.
            </p>

            <h3>⚔ PVP</h3>
            <p>
                Pentru jucatorii interesati de Battlegrounds, World PvP
                si activitati PvP impreuna cu guilda.
            </p>

            <h3>♛ OFFICERI</h3>
            <p>
                Cautam si oameni de incredere care pot ajuta la organizare,
                atunci cand au timp.
            </p>

            <h3>📜 CE ASTEPTAM DE LA MEMBRI</h3>
            <ul>
                <li>Respect fata de ceilalti membri.</li>
                <li>Comunicare si spirit de echipa.</li>
                <li>Daca te inscrii la un raid, incearca sa fii prezent.</li>
                <li>Daca nu mai poti veni, anunta din timp pe Discord.</li>
            </ul>

            <div class="modal-highlight">
                Nu trebuie sa fii cel mai bun jucator. Conteaza sa fii
                serios, sa comunici si sa vrei sa progresam impreuna.
            </div>

            <div class="modal-actions">
                <a class="modal-link"
                   href="${DARKSLAYERS_DISCORD}"
                   target="_blank"
                   rel="noopener noreferrer">
                    APLICA PE DISCORD →
                </a>
            </div>
        `
    });

}


/* =========================================
   GUILD HUB + GALERIE
========================================= */

const DARKSLAYERS_DISCORD =
    "https://discord.gg/UTScHbfbt";

const DARKSLAYERS_TWITCH =
    "https://www.twitch.tv/itsskanners";


const hubContent = {

    rules: {
        icon: "📜",
        label: "DARKSLAYERS",
        title: "REGULI",
        content: `
            <div class="modal-highlight">
                Respectul si comunicarea sunt baza comunitatii DARKSLAYERS.
            </div>

            <h3>1. RESPECT</h3>
            <p>
                Respecta membrii guildei. Fara scandaluri, jigniri
                sau comportament care strica atmosfera comunitatii.
            </p>

            <h3>2. RAIDURI</h3>
            <p>
                Daca te inscrii la un raid, incearca sa fii prezent.
                Daca nu mai poti veni, anunta din timp pe Discord.
            </p>

            <h3>3. DISCORD</h3>
            <p>
                Pentru raiduri si anunturi importante verificam Discord-ul.
                Comunicarea ne ajuta sa ne organizam mai bine.
            </p>

            <h3>4. AJUTOR SI ECHIPA</h3>
            <p>
                Ne ajutam intre noi cu dungeon-uri, quest-uri, informatii
                si progres. Guilda creste cand progresam impreuna.
            </p>

            <h3>5. GUILDA INAINTE DE DRAMA</h3>
            <p>
                Problemele se discuta calm cu Guild Master-ul sau cu un Officer.
            </p>
        `
    },

    guides: {
        icon: "📖",
        label: "GUILD HUB",
        title: "GHIDURI",
        content: `
            <div class="modal-highlight">
                Zona de ghiduri DARKSLAYERS va fi completata pe masura
                ce comunitatea progreseaza.
            </div>

            <h3>FOREVER</h3>
            <p>
                Leveling, dungeon-uri, raiduri, profesii si informatii
                utile pentru progresul guildei.
            </p>

            <h3>WOTLK</h3>
            <p>
                Ghiduri pentru raiduri, reputatii, echipament,
                profesii si progres PvE.
            </p>

            <h3>GHIDURI DE RAID</h3>
            <p>
                Vom putea adauga tactici pentru fiecare boss si informatii
                importante pentru membrii care participa la raid.
            </p>

            <div class="modal-actions">
                <a class="modal-link"
                   href="${DARKSLAYERS_DISCORD}"
                   target="_blank"
                   rel="noopener noreferrer">
                    DISCORD DARKSLAYERS →
                </a>
            </div>
        `
    },

    suggestions: {
        icon: "💡",
        label: "COMUNITATE",
        title: "SUGESTII",
        content: `
            <div class="modal-highlight">
                Ai o idee pentru DARKSLAYERS? Vrem sa auzim si parerea membrilor.
            </div>

            <p>
                Poti propune idei pentru raiduri, eventuri, Discord,
                site, recrutare sau organizarea guildei.
            </p>

            <p>
                Pentru moment, sugestiile se trimit pe Discord.
                Mai tarziu putem adauga pe site un sistem dedicat.
            </p>

            <div class="modal-actions">
                <a class="modal-link"
                   href="${DARKSLAYERS_DISCORD}"
                   target="_blank"
                   rel="noopener noreferrer">
                    TRIMITE SUGESTIA PE DISCORD →
                </a>
            </div>
        `
    },

    events: {
        icon: "🎉",
        label: "DARKSLAYERS",
        title: "EVENTURI",
        content: `
            <div class="modal-highlight">
                Eventurile comunitatii vor fi anuntate pe site si pe Discord.
            </div>

            <h3>RAID NIGHT</h3>
            <p>
                Seri dedicate raidurilor si progresului guildei.
            </p>

            <h3>GUILD EVENTS</h3>
            <p>
                Activitati pentru comunitate, dungeon-uri, achievement-uri
                si alte idei organizate impreuna.
            </p>

            <h3>ANUNTURI</h3>
            <p>
                Data si ora fiecarui event vor fi confirmate pe Discord.
            </p>

            <div class="modal-actions">
                <a class="modal-link"
                   href="${DARKSLAYERS_DISCORD}"
                   target="_blank"
                   rel="noopener noreferrer">
                    VEZI DISCORD →
                </a>
            </div>
        `
    }

};


const galleryContent = {

    raid: {
        icon: "📷",
        label: "GALERIE",
        title: "RAID SCREENSHOTS",
        content: `
            <div class="gallery-empty">
                <span>📷</span>
                <strong>GALERIA ESTE PREGATITA</strong>
                <p>
                    Aici vom pune screenshot-urile tale din raiduri.
                    Cand imi dai pozele, le adaugam fara sa schimbam restul site-ului.
                </p>
            </div>
        `
    },

    kills: {
        icon: "🏆",
        label: "GALERIE",
        title: "FIRST KILLS",
        content: `
            <div class="gallery-empty">
                <span>🏆</span>
                <strong>FIRST KILLS DARKSLAYERS</strong>
                <p>
                    Aici vom pastra screenshot-urile cu victoriile
                    importante si bossii doborati de guilda.
                </p>
            </div>
        `
    },

    moments: {
        icon: "👥",
        label: "GALERIE",
        title: "GUILD MOMENTS",
        content: `
            <div class="gallery-empty">
                <span>👥</span>
                <strong>MOMENTELE COMUNITATII</strong>
                <p>
                    Aici vom pune poze de grup, momente amuzante
                    si screenshot-uri memorabile DARKSLAYERS.
                </p>
            </div>
        `
    }

};


function openHub(section) {

    const data = hubContent[section];

    if (!data) {
        return;
    }

    openSiteModal(data);
}


function openGallery(section) {

    const data = galleryContent[section];

    if (!data) {
        return;
    }

    openSiteModal(data);
}


function openSiteModal(data) {

    const modal =
        document.getElementById("siteModal");

    const icon =
        document.getElementById("siteModalIcon");

    const label =
        document.getElementById("siteModalLabel");

    const title =
        document.getElementById("siteModalTitle");

    const content =
        document.getElementById("siteModalContent");


    if (
        !modal ||
        !icon ||
        !label ||
        !title ||
        !content
    ) {
        return;
    }


    icon.textContent = data.icon;
    label.textContent = data.label;
    title.textContent = data.title;
    content.innerHTML = data.content;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}


function closeSiteModal() {

    const modal =
        document.getElementById("siteModal");


    if (!modal) {
        return;
    }


    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeSiteModal();

        }

    }
);




/* =========================================
   DARKSLAYERS ACCOUNT - SUPABASE AUTH + ROLES
========================================= */
let DARKSLAYERS_CURRENT_PROFILE = null;

function authMessage(message, type = "info") {
    const box = document.getElementById("authMessage");
    if (!box) return;
    box.textContent = message;
    box.className = "auth-message " + type;
}

async function getDarkSlayersUser() {
    if (!darkslayersSupabase) return null;
    const { data } = await darkslayersSupabase.auth.getUser();
    return data?.user || null;
}

async function getDarkSlayersProfile(user) {
    if (!darkslayersSupabase || !user) return null;
    const { data, error } = await darkslayersSupabase
        .from("profiles")
        .select("id, display_name, role")
        .eq("id", user.id)
        .maybeSingle();
    if (error) {
        console.error("DARKSLAYERS profile:", error);
        return null;
    }
    return data || null;
}

function openAccountModal(mode = "login") {
    openSiteModal({
        icon: "♛", label: "DARKSLAYERS", title: "CONT",
        content: `
            <div class="auth-tabs">
                <button id="authLoginTab" class="auth-tab active" onclick="showAuthLogin()">LOGIN</button>
                <button id="authRegisterTab" class="auth-tab" onclick="showAuthRegister()">INREGISTRARE</button>
            </div>
            <div id="authMessage" class="auth-message"></div>
            <form id="loginForm" class="auth-form" onsubmit="loginDarkSlayers(event)">
                <label>Email</label><input id="loginEmail" type="email" autocomplete="email" required placeholder="email@exemplu.ro">
                <label>Parola</label><input id="loginPassword" type="password" autocomplete="current-password" required minlength="6" placeholder="Parola">
                <button type="submit" class="auth-submit">INTRA IN CONT</button>
            </form>
            <form id="registerForm" class="auth-form" style="display:none" onsubmit="registerDarkSlayers(event)">
                <label>Nume in joc</label><input id="registerName" type="text" required maxlength="30" placeholder="Ex: Skanners">
                <label>Email</label><input id="registerEmail" type="email" autocomplete="email" required placeholder="email@exemplu.ro">
                <label>Parola</label><input id="registerPassword" type="password" autocomplete="new-password" required minlength="6" placeholder="Minim 6 caractere">
                <button type="submit" class="auth-submit">CREEAZA CONT</button>
            </form>
            <div id="loggedInPanel" class="auth-logged" style="display:none">
                <div class="account-profile-card">
                    <span id="loggedInRole" class="role-badge">MEMBER</span>
                    <strong id="loggedInName">Membru DARKSLAYERS</strong>
                    <small id="loggedInEmail"></small>
                </div>
                <button id="adminPanelButton" class="auth-submit admin-panel-button" style="display:none" onclick="openAdminPanel()">♛ ADMIN PANEL</button>
                <button class="auth-submit auth-logout" onclick="logoutDarkSlayers()">LOGOUT</button>
            </div>`
    });
    refreshAuthModal();
    if (mode === "register") showAuthRegister();
}

function showAuthLogin() {
    const login=document.getElementById("loginForm"), register=document.getElementById("registerForm");
    if (!login || !register) return;
    login.style.display="grid"; register.style.display="none";
    document.getElementById("authLoginTab")?.classList.add("active");
    document.getElementById("authRegisterTab")?.classList.remove("active"); authMessage("");
}
function showAuthRegister() {
    const login=document.getElementById("loginForm"), register=document.getElementById("registerForm");
    if (!login || !register) return;
    login.style.display="none"; register.style.display="grid";
    document.getElementById("authLoginTab")?.classList.remove("active");
    document.getElementById("authRegisterTab")?.classList.add("active"); authMessage("");
}

async function registerDarkSlayers(event) {
    event.preventDefault();
    if (!darkslayersSupabase) return authMessage("Conexiunea Supabase nu este disponibila.", "error");
    const name=document.getElementById("registerName").value.trim();
    const email=document.getElementById("registerEmail").value.trim();
    const password=document.getElementById("registerPassword").value;
    authMessage("Se creeaza contul...", "info");
    const { data, error } = await darkslayersSupabase.auth.signUp({email,password,options:{data:{display_name:name}}});
    if (error) return authMessage(error.message, "error");
    if (data.session) { authMessage("Cont creat. Esti conectat!", "success"); await updateAccountButton(); setTimeout(refreshAuthModal,250); }
    else authMessage("Cont creat. Verifica emailul pentru confirmare, apoi fa login.", "success");
}

async function loginDarkSlayers(event) {
    event.preventDefault();
    if (!darkslayersSupabase) return authMessage("Conexiunea Supabase nu este disponibila.", "error");
    const email=document.getElementById("loginEmail").value.trim(), password=document.getElementById("loginPassword").value;
    authMessage("Se face conectarea...", "info");
    const { error } = await darkslayersSupabase.auth.signInWithPassword({email,password});
    if (error) return authMessage("Email sau parola incorecta.", "error");
    authMessage("Conectare reusita!", "success"); await updateAccountButton(); setTimeout(refreshAuthModal,250);
}

async function logoutDarkSlayers() {
    if (!darkslayersSupabase) return;
    await darkslayersSupabase.auth.signOut(); DARKSLAYERS_CURRENT_PROFILE=null; await updateAccountButton(); closeSiteModal();
}

async function updateAccountButton() {
    const button=document.getElementById("accountButton"); if (!button) return;
    const user=await getDarkSlayersUser();
    if (!user) { DARKSLAYERS_CURRENT_PROFILE=null; button.textContent="CONT"; button.classList.remove("logged-in","admin-account"); return; }
    const profile=await getDarkSlayersProfile(user); DARKSLAYERS_CURRENT_PROFILE=profile;
    const displayName=profile?.display_name || user.user_metadata?.display_name || "CONTUL MEU";
    button.textContent=(profile?.role === "admin" ? "♛ " : "") + displayName.toUpperCase();
    button.classList.add("logged-in"); button.classList.toggle("admin-account", profile?.role === "admin");
}

async function refreshAuthModal() {
    const login=document.getElementById("loginForm"), register=document.getElementById("registerForm"), logged=document.getElementById("loggedInPanel");
    if (!login || !register || !logged) return;
    const user=await getDarkSlayersUser();
    if (!user) { logged.style.display="none"; document.querySelector(".auth-tabs")?.style.setProperty("display","flex"); return; }
    const profile=await getDarkSlayersProfile(user); DARKSLAYERS_CURRENT_PROFILE=profile;
    login.style.display="none"; register.style.display="none"; document.querySelector(".auth-tabs")?.style.setProperty("display","none"); logged.style.display="grid";
    document.getElementById("loggedInEmail").textContent=user.email || "";
    document.getElementById("loggedInName").textContent=profile?.display_name || user.user_metadata?.display_name || "Membru DARKSLAYERS";
    const role=(profile?.role || "member").toUpperCase(); document.getElementById("loggedInRole").textContent=role;
    document.getElementById("loggedInRole").className="role-badge role-" + role.toLowerCase();
    document.getElementById("adminPanelButton").style.display=role === "ADMIN" ? "block" : "none";
}

async function openAdminPanel() {
    const user=await getDarkSlayersUser(), profile=await getDarkSlayersProfile(user);
    if (!user || profile?.role !== "admin") return;
    openSiteModal({icon:"♛",label:"DARKSLAYERS",title:"ADMIN PANEL",content:`
        <div class="modal-highlight">Conectat ca <strong>${escapeHtml(profile.display_name || "Admin")}</strong> • ADMIN</div>
        <h3 id="adminFormTitle">ADAUGA MEMBRU</h3>
        <form class="admin-member-form" onsubmit="adminSaveMember(event)">
            <input id="adminMemberId" type="hidden">
            <input id="adminMemberName" required maxlength="30" placeholder="Nume">
            <input id="adminMemberGame" maxlength="30" placeholder="Joc (Forever / WotLK)">
            <input id="adminMemberClass" maxlength="30" placeholder="Clasa">
            <select id="adminMemberRank"><option value="member">Member</option><option value="core">Core Raider</option><option value="veteran">Veteran</option><option value="officer">Officer</option><option value="gm">Guild Master</option></select>
            <input id="adminMemberLevel" type="number" min="1" max="100" placeholder="Level">
            <div class="admin-form-actions">
                <button id="adminSaveButton" class="auth-submit" type="submit">+ ADAUGA MEMBRU</button>
                <button id="adminCancelEdit" class="auth-submit admin-cancel-edit" type="button" style="display:none" onclick="adminCancelEdit()">ANULEAZA</button>
            </div>
        </form>
        <div id="adminMemberMessage" class="auth-message"></div>
        <div id="adminMembersList" class="admin-members-list">Se incarca...</div>`});
    await adminLoadMembers();
}

function escapeHtml(value) { const d=document.createElement("div"); d.textContent=value ?? ""; return d.innerHTML; }

async function adminLoadMembers() {
    const box=document.getElementById("adminMembersList"); if (!box) return;
    const {data,error}=await darkslayersSupabase.from("members").select("id,name,game,class,role,rank,level").order("name");
    if (error) { box.textContent="Nu am putut incarca rosterul."; return; }
    if (!data?.length) { box.innerHTML='<div class="admin-empty">Rosterul este gol.</div>'; return; }
    window.DARKSLAYERS_ADMIN_MEMBERS = data;
    box.innerHTML=data.map(m=>`<div class="admin-member-row"><div><strong>${escapeHtml(m.name)}</strong><span>${escapeHtml(m.game || "WoW")} • ${escapeHtml(m.class || "Clasa")} • ${escapeHtml(m.rank || "member")} ${m.level ? "• Lv. "+m.level : ""}</span></div><div class="admin-row-actions"><button class="admin-edit-button" onclick="adminEditMember(${Number(m.id)})">EDITEAZA</button><button class="admin-delete-button" onclick="adminDeleteMember(${Number(m.id)})">STERGE</button></div></div>`).join("");
}

async function adminSaveMember(event) {
    event.preventDefault();
    const msg=document.getElementById("adminMemberMessage");
    const id=document.getElementById("adminMemberId").value;
    const row={name:document.getElementById("adminMemberName").value.trim(),game:document.getElementById("adminMemberGame").value.trim() || null,class:document.getElementById("adminMemberClass").value.trim() || null,role:"member",rank:document.getElementById("adminMemberRank").value,level:Number(document.getElementById("adminMemberLevel").value) || null};
    let result;
    if (id) result=await darkslayersSupabase.from("members").update(row).eq("id",Number(id));
    else result=await darkslayersSupabase.from("members").insert(row);
    if (result.error) { msg.textContent="Eroare: "+result.error.message; msg.className="auth-message error"; return; }
    msg.textContent=id ? "Membru modificat." : "Membru adaugat.";
    msg.className="auth-message success";
    adminCancelEdit();
    await adminLoadMembers();
    await refreshDarkSlayersRoster();
}

function adminEditMember(id) {
    const m=(window.DARKSLAYERS_ADMIN_MEMBERS || []).find(x=>Number(x.id)===Number(id));
    if (!m) return;
    document.getElementById("adminMemberId").value=m.id;
    document.getElementById("adminMemberName").value=m.name || "";
    document.getElementById("adminMemberGame").value=m.game || "";
    document.getElementById("adminMemberClass").value=m.class || "";
    document.getElementById("adminMemberRank").value=m.rank || "member";
    document.getElementById("adminMemberLevel").value=m.level || "";
    document.getElementById("adminFormTitle").textContent="EDITEAZA MEMBRU";
    document.getElementById("adminSaveButton").textContent="SALVEAZA MODIFICARILE";
    document.getElementById("adminCancelEdit").style.display="block";
    document.getElementById("adminMemberName").focus();
}

function adminCancelEdit() {
    const form=document.querySelector(".admin-member-form");
    if (form) form.reset();
    const id=document.getElementById("adminMemberId"); if (id) id.value="";
    const title=document.getElementById("adminFormTitle"); if (title) title.textContent="ADAUGA MEMBRU";
    const save=document.getElementById("adminSaveButton"); if (save) save.textContent="+ ADAUGA MEMBRU";
    const cancel=document.getElementById("adminCancelEdit"); if (cancel) cancel.style.display="none";
}

async function adminDeleteMember(id) {
    if (!confirm("Stergi acest membru din roster?")) return;
    const {error}=await darkslayersSupabase.from("members").delete().eq("id",id);
    if (error) return alert("Nu s-a putut sterge membrul."); await adminLoadMembers(); await refreshDarkSlayersRoster();
}



/* =========================================
   LIVE ROSTER - SUPABASE
========================================= */
function rosterRankInfo(rank) {
    const key = String(rank || "member").toLowerCase();
    const map = {
        gm: { label: "GUILD MASTER", icon: "⚔" },
        officer: { label: "OFFICER", icon: "🛡" },
        veteran: { label: "VETERAN", icon: "★" },
        core: { label: "CORE RAIDER", icon: "⚔" },
        member: { label: "MEMBER", icon: "◆" }
    };
    return { key: map[key] ? key : "member", ...(map[key] || map.member) };
}

function renderDarkSlayersRoster(members) {
    const list = document.querySelector(".roster-list");
    if (!list) return;

    const rows = Array.isArray(members) ? members : [];
    if (!rows.length) {
        list.innerHTML = '<div class="roster-empty">Rosterul este gol momentan.</div>';
        return;
    }

    list.innerHTML = rows.map(function (m) {
        const rank = rosterRankInfo(m.rank);
        const details = [m.class || "Clasa", m.game || ""].filter(Boolean).join(" • ");
        const level = m.level ? " • Lv. " + Number(m.level) : "";
        return `
            <div class="roster-member" data-rank="${rank.key}" data-member-id="${Number(m.id)}">
                <div class="roster-avatar">${rank.icon}</div>
                <div class="roster-player">
                    <h3>${escapeHtml(m.name || "Member")}</h3>
                    <span>${escapeHtml(details)}${level}</span>
                </div>
                <div class="roster-rank rank-${rank.key}">${rank.label}</div>
                <div class="roster-status online">● ACTIVE</div>
            </div>`;
    }).join("");
}

async function refreshDarkSlayersRoster() {
    const members = await loadDarkSlayersMembers();
    renderDarkSlayersRoster(members);
}

document.addEventListener("darkslayers:members-loaded", function (event) {
    renderDarkSlayersRoster(event.detail || []);
});


document.addEventListener("DOMContentLoaded", function () {
    updateAccountButton();
    if (darkslayersSupabase) darkslayersSupabase.auth.onAuthStateChange(function(){ setTimeout(updateAccountButton,0); });
});
