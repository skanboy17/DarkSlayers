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
        .select("id, created_at, name, game, class, role, rank, level, user_id")
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
    return ["admin", "officer"].includes(profile?.role);
}

async function loadDarkSlayersRaidProgress() {
    if (!darkslayersSupabase) return;

    const [{ data: rows, error }, canManageRaids] = await Promise.all([
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

        if (canManageRaids) {
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
            if (!canManageRaids) return;
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
        .select("id, display_name, role, avatar_url, avatar_frame, profile_title, avatar_status, avatar_pending_url")
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
                <button id="officerPanelButton" class="auth-submit admin-panel-button" style="display:none" onclick="openOfficerPanel()">⚔ OFFICER PANEL</button>
                <button class="auth-submit profile-panel-button" onclick="openMyProfile()">👤 PROFILUL MEU</button>
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
    const { data, error } = await darkslayersSupabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: name },
            emailRedirectTo: "https://darkslayers.ro/"
        }
    });
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
    button.textContent=(profile?.role === "admin" ? "♛ " : profile?.role === "officer" ? "⚔ " : "") + displayName.toUpperCase();
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
    const officerButton=document.getElementById("officerPanelButton");
    if (officerButton) officerButton.style.display=role === "OFFICER" ? "block" : "none";
}

async function openAdminPanel() {
    const user=await getDarkSlayersUser(), profile=await getDarkSlayersProfile(user);
    if (!user || profile?.role !== "admin") return;
    openSiteModal({icon:"♛",label:"DARKSLAYERS",title:"ADMIN PANEL",content:`
        <div class="modal-highlight">Conectat ca <strong>${escapeHtml(profile.display_name || "Admin")}</strong> • ADMIN</div>
        <div class="staff-avatar-panel">
            <div>
                <strong>🖼 AVATARE DE APROBAT</strong>
                <span>Verifica pozele trimise de membri inainte sa devina publice.</span>
            </div>
            <button type="button" class="auth-submit avatar-moderation-button" onclick="openAvatarModeration()">DESCHIDE MODERAREA</button>
        </div>
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


async function openOfficerPanel() {
    const user=await getDarkSlayersUser(), profile=await getDarkSlayersProfile(user);
    if (!user || profile?.role !== "officer") return;

    openSiteModal({icon:"⚔",label:"DARKSLAYERS",title:"OFFICER PANEL",content:`
        <div class="modal-highlight">Conectat ca <strong>${escapeHtml(profile.display_name || "Officer")}</strong> • OFFICER</div>
        <div class="staff-avatar-panel">
            <div>
                <strong>🖼 AVATARE DE APROBAT</strong>
                <span>Verifica pozele trimise de membri inainte sa devina publice.</span>
            </div>
            <button type="button" class="auth-submit avatar-moderation-button" onclick="openAvatarModeration()">DESCHIDE MODERAREA</button>
        </div>
        <div class="modal-highlight">Poti adauga si edita membri. Stergerea membrilor ramane disponibila doar pentru Admin.</div>
        <h3 id="adminFormTitle">ADAUGA MEMBRU</h3>
        <form class="admin-member-form" onsubmit="adminSaveMember(event)">
            <input id="adminMemberId" type="hidden">
            <input id="adminMemberName" required maxlength="30" placeholder="Nume">
            <input id="adminMemberGame" maxlength="30" placeholder="Joc (Forever / WotLK)">
            <input id="adminMemberClass" maxlength="30" placeholder="Clasa">
            <select id="adminMemberRank">
                <option value="member">Member</option>
                <option value="core">Core Raider</option>
                <option value="veteran">Veteran</option>
                <option value="officer">Officer</option>
            </select>
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
    const isAdmin = DARKSLAYERS_CURRENT_PROFILE?.role === "admin";
    box.innerHTML=data.map(m=>`<div class="admin-member-row"><div><strong>${escapeHtml(m.name)}</strong><span>${escapeHtml(m.game || "WoW")} • ${escapeHtml(m.class || "Clasa")} • ${escapeHtml(m.rank || "member")} ${m.level ? "• Lv. "+m.level : ""}</span></div><div class="admin-row-actions"><button class="admin-edit-button" onclick="adminEditMember(${Number(m.id)})">EDITEAZA</button>${isAdmin ? `<button class="admin-delete-button" onclick="adminDeleteMember(${Number(m.id)})">STERGE</button>` : ""}</div></div>`).join("");
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
            <div class="roster-member ${m.user_id ? "roster-linked" : ""}" data-rank="${rank.key}" data-member-id="${Number(m.id)}">
                <div class="roster-avatar">${rank.icon}</div>
                <div class="roster-player">
                    <h3>${escapeHtml(m.name || "Member")} ${m.user_id ? '<small class="roster-linked-badge">CONT</small>' : ''}</h3>
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


/* =========================================
   DARKSLAYERS - PROFILE + WOW CHARACTERS
========================================= */

const DARKSLAYERS_WOW_CLASSES = {
    "Warrior": {
        "Arms": "DPS",
        "Fury": "DPS",
        "Protection": "TANK"
    },
    "Paladin": {
        "Holy": "HEALER",
        "Protection": "TANK",
        "Retribution": "DPS"
    },
    "Hunter": {
        "Beast Mastery": "DPS",
        "Marksmanship": "DPS",
        "Survival": "DPS"
    },
    "Rogue": {
        "Assassination": "DPS",
        "Combat": "DPS",
        "Subtlety": "DPS"
    },
    "Priest": {
        "Discipline": "HEALER",
        "Holy": "HEALER",
        "Shadow": "DPS"
    },
    "Death Knight": {
        "Blood": "TANK",
        "Frost": "DPS",
        "Unholy": "DPS"
    },
    "Shaman": {
        "Elemental": "DPS",
        "Enhancement": "DPS",
        "Restoration": "HEALER"
    },
    "Mage": {
        "Arcane": "DPS",
        "Fire": "DPS",
        "Frost": "DPS"
    },
    "Warlock": {
        "Affliction": "DPS",
        "Demonology": "DPS",
        "Destruction": "DPS"
    },
    "Druid": {
        "Balance": "DPS",
        "Feral - Tank": "TANK",
        "Feral - DPS": "DPS",
        "Restoration": "HEALER"
    },
    "Skyborn": {
        "Tank": "TANK",
        "Healer": "HEALER",
        "DPS": "DPS"
    }
};

const DARKSLAYERS_CLASS_ICONS = {
    "Warrior": "images/classes/warrior.webp",
    "Paladin": "images/classes/paladin.webp",
    "Death Knight": "images/classes/death-knight.webp",
    "Druid": "images/classes/druid.webp",
    "Hunter": "images/classes/hunter.webp",
    "Rogue": "images/classes/rogue.webp",
    "Priest": "images/classes/priest.webp",
    "Shaman": "images/classes/shaman.webp",
    "Mage": "images/classes/mage.webp",
    "Warlock": "images/classes/warlock.webp",
    "Skyborn": "images/classes/skyborn.webp"
};

function darkslayersClassIcon(className){
    return DARKSLAYERS_CLASS_ICONS[className] || DARKSLAYERS_CLASS_ICONS.Rogue;
}

function renderCharacterClassPicker(selected){
    return `<div class="ds-class-picker">${Object.keys(DARKSLAYERS_WOW_CLASSES).map(c => `
        <button type="button" class="ds-class-choice ${c===selected ? "selected" : ""}" data-class="${escapeHtml(c)}" onclick="selectCharacterClass('${c.replace(/'/g,"\\'")}')">
            <img src="${darkslayersClassIcon(c)}" alt="${escapeHtml(c)}">
            <span>${escapeHtml(c)}</span>
        </button>`).join("")}</div>`;
}

function selectCharacterClass(className){
    const classEl=document.getElementById("characterClass");
    if(!classEl) return;
    classEl.value=className;
    document.querySelectorAll(".ds-class-choice").forEach(btn => btn.classList.toggle("selected", btn.dataset.class===className));
    updateCharacterSpecs();
}

const DARKSLAYERS_PROFILE_FRAMES = {
    "blood": "BLOOD",
    "horde": "HORDE",
    "shadow": "SHADOW",
    "gold": "GOLD"
};

function darkslayersRoleIcon(role){
    const r = String(role || "member").toLowerCase();
    if(r === "admin") return "♛";
    if(r === "officer") return "🛡";
    return "⚔";
}

function darkslayersCombatRoleIcon(role){
    const r = String(role || "DPS").toUpperCase();
    if(r === "TANK") return "🛡";
    if(r === "HEALER") return "✚";
    return "⚔";
}

function darkslayersAvatarHtml(profile, sizeClass = ""){
    const frame = escapeHtml(profile?.avatar_frame || "blood");
    const url = profile?.avatar_url ? escapeHtml(profile.avatar_url) : "";
    const initial = escapeHtml((profile?.display_name || "D").charAt(0).toUpperCase());
    return `<div class="ds-avatar ds-frame-${frame} ${sizeClass}">
        ${url ? `<img src="${url}" alt="Avatar">` : `<span>${initial}</span>`}
        <i class="ds-rank-corner">${darkslayersRoleIcon(profile?.role)}</i>
    </div>`;
}

async function loadMyCharacters(userId){
    if(!darkslayersSupabase || !userId) return [];
    const {data,error} = await darkslayersSupabase
        .from("characters")
        .select("id,created_at,user_id,character_name,game,faction,class,spec,combat_role,level,is_main,character_image_url,gear_score,profession1,profession2")
        .eq("user_id", userId)
        .order("is_main", {ascending:false})
        .order("character_name", {ascending:true});
    if(error){
        console.error("DARKSLAYERS characters:", error);
        return [];
    }
    return data || [];
}

function darkslayersCharacterPortrait(c, className = ""){
    const url = c?.character_image_url ? escapeHtml(c.character_image_url) : "";
    const faction = String(c?.faction || "Horde").toLowerCase();
    const initial = escapeHtml((c?.character_name || "D").charAt(0).toUpperCase());
    const classIcon = darkslayersClassIcon(c?.class || "Rogue");
    return `<div class="ds-character-portrait ${faction} ${className}">
        ${url ? `<img src="${url}" alt="${escapeHtml(c.character_name || "Character")}">` : `<img class="ds-class-portrait-icon" src="${classIcon}" alt="${escapeHtml(c?.class || "Class")}">`}
        <b>${escapeHtml(c?.faction || "Horde")}</b>
    </div>`;
}

function darkslayersMainCharacterCard(c){
    if(!c) return '';
    return `<div class="ds-main-character-card">
        ${darkslayersCharacterPortrait(c, "ds-character-portrait-large")}
        <div class="ds-main-character-data">
            <div class="ds-main-character-top"><span>⭐ MAIN CHARACTER</span><em>${darkslayersCombatRoleIcon(c.combat_role)} ${escapeHtml(c.combat_role || "DPS")}</em></div>
            <h2>${escapeHtml(c.character_name)}</h2>
            <div class="ds-main-character-tags">
                <span>${escapeHtml(c.game)}</span><span>${escapeHtml(c.faction)}</span><span>${escapeHtml(c.class)}</span><span>${escapeHtml(c.spec || "Fara spec")}</span>${c.level ? `<span>LEVEL ${Number(c.level)}</span>` : ''}${c.gear_score ? `<span>GS ${Number(c.gear_score)}</span>` : ''}
            </div>
            ${(c.profession1 || c.profession2) ? `<p>Profesii: ${escapeHtml(c.profession1 || "-")}${c.profession2 ? ` • ${escapeHtml(c.profession2)}` : ''}</p>` : ''}
        </div>
    </div>`;
}

async function openMyProfile(){
    const user = await getDarkSlayersUser();
    if(!user){
        openAccountModal("login");
        return;
    }

    const profile = await getDarkSlayersProfile(user);
    const chars = await loadMyCharacters(user.id);
    const main = chars.find(c => c.is_main) || chars[0] || null;

    const charsHtml = chars.length ? chars.map(c => `
        <div class="ds-character-card ${c.is_main ? "is-main" : ""}">
            ${darkslayersCharacterPortrait(c, "ds-character-portrait-small")}
            <div class="ds-character-info">
                <strong>${escapeHtml(c.character_name)}</strong>
                <span>${escapeHtml(c.class)} • ${escapeHtml(c.spec || "Fara spec")} • ${escapeHtml(c.combat_role || "DPS")}</span>
                <small>${escapeHtml(c.game)} • ${escapeHtml(c.faction)}${c.level ? " • Lv. " + Number(c.level) : ""}${c.is_main ? " • ⭐ MAIN" : ""}</small>
            </div>
            <div class="ds-character-actions">
                ${!c.is_main ? `<button type="button" onclick="setMainCharacter(${Number(c.id)})">⭐ MAIN</button>` : ""}
                <button type="button" onclick="editMyCharacter(${Number(c.id)})">EDITEAZA</button>
                <button type="button" class="danger" onclick="deleteMyCharacter(${Number(c.id)})">STERGE</button>
            </div>
        </div>
    `).join("") : '<div class="forum-empty">Nu ai adaugat niciun caracter.</div>';

    openSiteModal({
        icon:"👤",
        label:"DARKSLAYERS",
        title:"PROFILUL MEU",
        content:`
            <div class="ds-profile-hero">
                ${darkslayersAvatarHtml(profile, "ds-avatar-large")}
                <div class="ds-profile-summary">
                    <span class="role-badge role-${escapeHtml(profile?.role || "member")}">${escapeHtml((profile?.role || "member").toUpperCase())}</span>
                    <h3>${escapeHtml(profile?.display_name || user.user_metadata?.display_name || "Membru")}</h3>
                    <p>${escapeHtml(profile?.profile_title || "Membru DARKSLAYERS")}</p>
                    ${main ? `<small>⭐ MAIN: ${escapeHtml(main.character_name)} • ${escapeHtml(main.class)} • ${escapeHtml(main.spec || "")} • ${escapeHtml(main.combat_role || "DPS")}</small>` : ""}
                </div>
            </div>

            ${darkslayersMainCharacterCard(main)}

            <div class="ds-profile-buttons">
                <button class="auth-submit" type="button" onclick="openProfileSettings()">🖼 AVATAR & PROFIL</button>
                <button class="auth-submit" type="button" onclick="openCharacterEditor()">+ ADAUGA CARACTER</button>
            </div>

            <h3 class="ds-section-title">CARACTERELE MELE</h3>
            <div class="ds-character-list">${charsHtml}</div>
        `
    });
}

async function openProfileSettings(){
    const user = await getDarkSlayersUser();
    if(!user) return;
    const profile = await getDarkSlayersProfile(user);

    openSiteModal({
        icon:"🖼",
        label:"PROFIL",
        title:"AVATAR & STIL",
        content:`
            <div class="ds-profile-settings-preview">
                ${darkslayersAvatarHtml(profile, "ds-avatar-large")}
            </div>
            <form class="forum-form" onsubmit="saveProfileSettings(event)">
                <label>NUME AFISAT</label>
                <input id="profileDisplayName" maxlength="30" required value="${escapeHtml(profile?.display_name || "")}">

                <label>TITLU</label>
                <select id="profileTitle">
                    ${["Membru DARKSLAYERS"].map(x => `<option ${profile?.profile_title===x ? "selected" : ""}>${x}</option>`).join("")}
                </select>

                <label>RAMA AVATAR</label>
                <select id="profileFrame">
                    ${Object.entries(DARKSLAYERS_PROFILE_FRAMES).map(([key,label]) => `<option value="${key}" ${profile?.avatar_frame===key ? "selected" : ""}>${label}</option>`).join("")}
                </select>

                <label>INCARCA AVATAR</label>
                <input id="profileAvatarFile" type="file" accept="image/png,image/jpeg,image/webp">
                <small class="ds-form-note">PNG, JPG sau WEBP. Maxim 2 MB.</small>

                <button class="auth-submit" type="submit">SALVEAZA PROFILUL</button>
            </form>
        `
    });
}

async function saveProfileSettings(event){
    event.preventDefault();
    const user = await getDarkSlayersUser();
    if(!user) return;

    const displayName = document.getElementById("profileDisplayName").value.trim();
    const profileTitle = document.getElementById("profileTitle").value;
    const avatarFrame = document.getElementById("profileFrame").value;
    const file = document.getElementById("profileAvatarFile")?.files?.[0];

    if(!displayName) return;

    let avatarUrl = undefined;

    if(file){
        if(file.size > 2 * 1024 * 1024){
            alert("Avatarul trebuie sa aiba maxim 2 MB.");
            return;
        }

        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;

        const upload = await darkslayersSupabase.storage
            .from("avatars")
            .upload(path, file, {upsert:true, cacheControl:"3600"});

        if(upload.error){
            console.error(upload.error);
            alert("Nu am putut incarca avatarul.");
            return;
        }

        const publicData = darkslayersSupabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = publicData.data.publicUrl;
    }

    const changes = {
        display_name: displayName,
        profile_title: profileTitle,
        avatar_frame: avatarFrame
    };
    if(avatarUrl) changes.avatar_url = avatarUrl;

    const {error} = await darkslayersSupabase
        .from("profiles")
        .update(changes)
        .eq("id", user.id);

    if(error){
        console.error(error);
        alert("Nu am putut salva profilul.");
        return;
    }

    await updateAccountButton();
    await openMyProfile();
}

function characterSpecOptions(className, selected = ""){
    const specs = DARKSLAYERS_WOW_CLASSES[className] || {};
    return Object.keys(specs).map(spec => `<option value="${escapeHtml(spec)}" ${spec===selected ? "selected" : ""}>${escapeHtml(spec)}</option>`).join("");
}

function updateCharacterSpecs(){
    const classEl = document.getElementById("characterClass");
    const specEl = document.getElementById("characterSpec");
    const roleEl = document.getElementById("characterCombatRole");
    if(!classEl || !specEl || !roleEl) return;
    specEl.innerHTML = characterSpecOptions(classEl.value);
    updateCharacterRole();
}

function updateCharacterRole(){
    const classEl = document.getElementById("characterClass");
    const specEl = document.getElementById("characterSpec");
    const roleEl = document.getElementById("characterCombatRole");
    if(!classEl || !specEl || !roleEl) return;
    roleEl.value = DARKSLAYERS_WOW_CLASSES[classEl.value]?.[specEl.value] || "DPS";
}


async function syncMyMainCharacterToRoster(){
    if(!darkslayersSupabase) return false;

    const { error } = await darkslayersSupabase.rpc("sync_my_main_character_to_roster");
    if(error){
        console.error("DARKSLAYERS roster sync:", error);
        alert("Caracterul a fost salvat, dar nu am putut actualiza rosterul.");
        return false;
    }

    await refreshDarkSlayersRoster();
    return true;
}

async function openCharacterEditor(characterId = null){
    const user = await getDarkSlayersUser();
    if(!user) return;

    let character = null;
    if(characterId){
        const {data,error} = await darkslayersSupabase
            .from("characters")
            .select("id,user_id,character_name,game,faction,class,spec,combat_role,level,is_main,character_image_url,gear_score,profession1,profession2")
            .eq("id", characterId)
            .eq("user_id", user.id)
            .maybeSingle();
        if(error){ console.error(error); return; }
        character = data;
    }

    const className = character?.class || "Rogue";
    const spec = character?.spec || Object.keys(DARKSLAYERS_WOW_CLASSES[className] || {})[0] || "";

    openSiteModal({
        icon:"⚔",
        label:"WOW CHARACTER",
        title:character ? "EDITEAZA CARACTER" : "ADAUGA CARACTER",
        content:`
            <form class="forum-form" onsubmit="saveMyCharacter(event, ${character ? Number(character.id) : "null"})">
                <label>NUME CARACTER</label>
                <input id="characterName" maxlength="30" required value="${escapeHtml(character?.character_name || "")}" placeholder="Ex: Skanners">

                <label>JOC</label>
                <select id="characterGame">
                    <option ${character?.game==="Forever" ? "selected" : ""}>Forever</option>
                    <option ${character?.game==="WotLK" ? "selected" : ""}>WotLK</option>
                    <option ${character?.game==="Skyborn" ? "selected" : ""}>Skyborn</option>
                </select>

                <label>FACTIUNE</label>
                <select id="characterFaction">
                    <option ${character?.faction!=="Alliance" ? "selected" : ""}>Horde</option>
                    <option ${character?.faction==="Alliance" ? "selected" : ""}>Alliance</option>
                </select>

                <label>CLASA</label>
                ${renderCharacterClassPicker(className)}
                <select id="characterClass" class="ds-hidden-class-select" onchange="updateCharacterSpecs()">
                    ${Object.keys(DARKSLAYERS_WOW_CLASSES).map(c => `<option ${c===className ? "selected" : ""}>${c}</option>`).join("")}
                </select>

                <label>SPEC</label>
                <select id="characterSpec" onchange="updateCharacterRole()">
                    ${characterSpecOptions(className, spec)}
                </select>

                <label>ROL</label>
                <input id="characterCombatRole" readonly value="${escapeHtml(character?.combat_role || DARKSLAYERS_WOW_CLASSES[className]?.[spec] || "DPS")}">

                <label>LEVEL</label>
                <input id="characterLevel" type="number" min="1" max="100" value="${character?.level ? Number(character.level) : ""}" placeholder="80">

                <label>POZA CARACTERULUI</label>
                <input id="characterImageFile" type="file" accept="image/png,image/jpeg,image/webp">
                <small class="ds-form-note">Pune un screenshot/portret cu personajul. PNG, JPG sau WEBP, maxim 2 MB.</small>
                ${character?.character_image_url ? `<div class="ds-character-edit-preview">${darkslayersCharacterPortrait(character, "ds-character-portrait-large")}</div>` : ""}

                <label>GEAR SCORE <small>(optional)</small></label>
                <input id="characterGearScore" type="number" min="0" max="99999" value="${character?.gear_score ? Number(character.gear_score) : ""}" placeholder="Ex: 5200">

                <label>PROFESIA 1 <small>(optional)</small></label>
                <input id="characterProfession1" maxlength="30" value="${escapeHtml(character?.profession1 || "")}" placeholder="Ex: Engineering">

                <label>PROFESIA 2 <small>(optional)</small></label>
                <input id="characterProfession2" maxlength="30" value="${escapeHtml(character?.profession2 || "")}" placeholder="Ex: Mining">

                <label class="ds-check-row">
                    <input id="characterMain" type="checkbox" ${character?.is_main ? "checked" : ""}>
                    ⭐ SETEAZA CA MAIN CHARACTER
                </label>

                <button class="auth-submit" type="submit">SALVEAZA CARACTERUL</button>
            </form>
        `
    });
}

function editMyCharacter(id){
    openCharacterEditor(id);
}

async function saveMyCharacter(event, characterId){
    event.preventDefault();
    const user = await getDarkSlayersUser();
    if(!user) return;

    const imageFile = document.getElementById("characterImageFile")?.files?.[0];
    let characterImageUrl = undefined;
    if(imageFile){
        if(imageFile.size > 2 * 1024 * 1024){
            alert("Poza caracterului trebuie sa aiba maxim 2 MB.");
            return;
        }
        const ext = (imageFile.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
        const path = `${user.id}/characters/character-${Date.now()}.${ext}`;
        const upload = await darkslayersSupabase.storage.from("avatars").upload(path, imageFile, {upsert:true, cacheControl:"3600"});
        if(upload.error){
            console.error(upload.error);
            alert("Nu am putut incarca poza caracterului.");
            return;
        }
        characterImageUrl = darkslayersSupabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }

    const row = {
        user_id:user.id,
        character_name:document.getElementById("characterName").value.trim(),
        game:document.getElementById("characterGame").value,
        faction:document.getElementById("characterFaction").value,
        class:document.getElementById("characterClass").value,
        spec:document.getElementById("characterSpec").value,
        combat_role:document.getElementById("characterCombatRole").value,
        level:Number(document.getElementById("characterLevel").value) || null,
        gear_score:Number(document.getElementById("characterGearScore").value) || null,
        profession1:document.getElementById("characterProfession1").value.trim() || null,
        profession2:document.getElementById("characterProfession2").value.trim() || null,
        is_main:document.getElementById("characterMain").checked
    };
    if(characterImageUrl) row.character_image_url = characterImageUrl;

    if(!row.character_name) return;

    const wantsMain = row.is_main;
    row.is_main = characterId ? undefined : false;
    if(characterId) delete row.is_main;

    let result;
    let savedCharacterId = characterId ? Number(characterId) : null;

    if(characterId){
        result = await darkslayersSupabase
            .from("characters")
            .update(row)
            .eq("id", Number(characterId))
            .eq("user_id", user.id)
            .select("id")
            .maybeSingle();
        savedCharacterId = Number(characterId);
    } else {
        result = await darkslayersSupabase
            .from("characters")
            .insert(row)
            .select("id")
            .single();
        savedCharacterId = Number(result.data?.id);
    }

    if(result.error){
        console.error(result.error);
        alert("Nu am putut salva caracterul.");
        return;
    }

    if(wantsMain && savedCharacterId){
        const { error: mainError } = await darkslayersSupabase.rpc("set_my_main_character", {
            target_character_id: savedCharacterId
        });
        if(mainError){
            console.error("DARKSLAYERS MAIN character:", mainError);
            alert("Caracterul a fost salvat, dar nu am putut seta MAIN: " + mainError.message);
            return;
        }
    } else {
        await syncMyMainCharacterToRoster();
    }

    await openMyProfile();
}

async function setMainCharacter(id){
    const user = await getDarkSlayersUser();
    if(!user) return;

    const { error } = await darkslayersSupabase.rpc("set_my_main_character", {
        target_character_id: Number(id)
    });

    if(error){
        console.error("DARKSLAYERS MAIN character:", error);
        alert("Nu am putut schimba MAIN-ul: " + error.message);
        return;
    }

    await refreshDarkSlayersRoster();
    await openMyProfile();
}

async function deleteMyCharacter(id){
    if(!confirm("Stergi acest caracter?")) return;
    const user = await getDarkSlayersUser();
    if(!user) return;

    const {error} = await darkslayersSupabase
        .from("characters")
        .delete()
        .eq("id", Number(id))
        .eq("user_id", user.id);

    if(error){
        console.error(error);
        alert("Nu am putut sterge caracterul.");
        return;
    }

    await syncMyMainCharacterToRoster();
    await openMyProfile();
}

async function loadForumPublicProfiles(userIds){
    if(!userIds?.length) return new Map();

    const [{data:profiles}, {data:characters}] = await Promise.all([
        darkslayersSupabase
            .from("profiles")
            .select("id,display_name,role,avatar_url,avatar_frame,profile_title")
            .in("id", userIds),
        darkslayersSupabase
            .from("characters")
            .select("user_id,character_name,class,spec,combat_role,level,faction,game,is_main")
            .in("user_id", userIds)
            .eq("is_main", true)
    ]);

    const cmap = new Map((characters || []).map(c => [c.user_id, c]));
    return new Map((profiles || []).map(p => [p.id, {...p, main_character:cmap.get(p.id) || null}]));
}

function forumAuthorHtml(profile){
    const p = profile || {};
    const c = p.main_character;
    const details = c
        ? `${escapeHtml(c.class)} • ${escapeHtml(c.spec || "")} • ${darkslayersCombatRoleIcon(c.combat_role)} ${escapeHtml(c.combat_role || "DPS")}${c.level ? " • Lv. " + Number(c.level) : ""}`
        : escapeHtml(p.profile_title || "Membru DARKSLAYERS");

    return `<div class="ds-forum-author">
        ${darkslayersAvatarHtml(p, "ds-avatar-small")}
        <div>
            <strong>${escapeHtml(p.display_name || "Membru")}</strong>
            <span>${escapeHtml((p.role || "member").toUpperCase())}</span>
            <small>${details}</small>
        </div>
    </div>`;
}


// DARKSLAYERS FORUM

const DARKSLAYERS_FORUM_CATEGORIES = [
    "General",
    "Raiduri & Dungeon-uri",
    "WoW Forever",
    "WotLK",
    "Ghiduri & Build-uri",
    "Sugestii"
];

const DARKSLAYERS_FORUM_PAGE_SIZE = 10;
let DARKSLAYERS_FORUM_PAGE = 1;

function forumDate(value){
    try {
        return new Date(value).toLocaleString("ro-RO", {dateStyle:"medium", timeStyle:"short"});
    } catch {
        return "";
    }
}

async function forumContext(){
    const user = await getDarkSlayersUser();
    const profile = user ? await getDarkSlayersProfile(user) : null;
    return {user, profile};
}

async function loadForumTopics(page = DARKSLAYERS_FORUM_PAGE){
    const box = document.getElementById("forumTopics");
    if(!box || !darkslayersSupabase) return;

    DARKSLAYERS_FORUM_PAGE = Math.max(1, Number(page) || 1);
    box.innerHTML = '<div class="forum-empty">Se incarca forumul...</div>';

    const filter = document.getElementById("forumCategoryFilter")?.value || "all";
    const from = (DARKSLAYERS_FORUM_PAGE - 1) * DARKSLAYERS_FORUM_PAGE_SIZE;
    const to = from + DARKSLAYERS_FORUM_PAGE_SIZE - 1;

    let q = darkslayersSupabase
        .from("forum_topics")
        .select("id,created_at,author_id,category,title,content,pinned", {count:"exact"})
        .order("pinned", {ascending:false})
        .order("created_at", {ascending:false})
        .range(from, to);

    if(filter !== "all") q = q.eq("category", filter);

    const {data,error,count} = await q;
    if(error){
        console.error(error);
        box.innerHTML = '<div class="forum-empty">Nu am putut incarca forumul.</div>';
        return;
    }

    const topics = data || [];
    const totalPages = Math.max(1, Math.ceil((count || 0) / DARKSLAYERS_FORUM_PAGE_SIZE));

    if(DARKSLAYERS_FORUM_PAGE > totalPages){
        DARKSLAYERS_FORUM_PAGE = totalPages;
        return loadForumTopics(totalPages);
    }

    const ids = [...new Set(topics.map(x => x.author_id))];
    const pmap = await loadForumPublicProfiles(ids);

    if(!topics.length){
        box.innerHTML = '<div class="forum-empty">Nu exista subiecte inca. Fii primul care scrie!</div>';
        return;
    }

    let html = topics.map(t => {
        const p = pmap.get(t.author_id) || {};
        return `<button class="forum-topic" onclick="openForumTopic(${Number(t.id)})">
            <span class="forum-topic-category">${t.pinned ? "📌 " : ""}${escapeHtml(t.category)}</span>
            <span class="forum-topic-main">
                <strong>${t.pinned ? "📌 " : ""}${escapeHtml(t.title)}</strong>
                <small>de ${escapeHtml(p.display_name||"Membru")} • ${(p.role||"member").toUpperCase()}${p.main_character ? " • " + escapeHtml(p.main_character.class) + " • " + escapeHtml(p.main_character.spec || "") : ""} • ${forumDate(t.created_at)}</small>
            </span>
            <span class="forum-topic-arrow">→</span>
        </button>`;
    }).join("");

    if(totalPages > 1){
        let pages = "";
        for(let i=1; i<=totalPages; i++){
            pages += `<button type="button" onclick="changeForumPage(${i})" ${i===DARKSLAYERS_FORUM_PAGE ? "disabled" : ""}>${i}</button>`;
        }
        html += `<div class="forum-pagination" style="display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap;margin-top:18px;">
            <button type="button" onclick="changeForumPage(${DARKSLAYERS_FORUM_PAGE-1})" ${DARKSLAYERS_FORUM_PAGE<=1 ? "disabled" : ""}>← INAPOI</button>
            ${pages}
            <button type="button" onclick="changeForumPage(${DARKSLAYERS_FORUM_PAGE+1})" ${DARKSLAYERS_FORUM_PAGE>=totalPages ? "disabled" : ""}>URMATOAREA →</button>
        </div>`;
    }

    box.innerHTML = html;
}

function changeForumPage(page){
    DARKSLAYERS_FORUM_PAGE = Math.max(1, Number(page) || 1);
    loadForumTopics(DARKSLAYERS_FORUM_PAGE);
}

async function openNewForumTopic(){
    const {user}=await forumContext();
    if(!user){
        alert("Trebuie sa fii conectat pentru a crea un subiect.");
        openAccountModal("login");
        return;
    }
    openSiteModal({icon:"💬",label:"DARKSLAYERS FORUM",title:"SUBIECT NOU",content:`<form class="forum-form" onsubmit="createForumTopic(event)"><label>CATEGORIE</label><select id="newForumCategory" required>${DARKSLAYERS_FORUM_CATEGORIES.map(x=>`<option>${escapeHtml(x)}</option>`).join("")}</select><label>TITLU</label><input id="newForumTitle" maxlength="120" required placeholder="Titlul discutiei"><label>MESAJ</label><textarea id="newForumContent" maxlength="5000" required placeholder="Scrie mesajul tau..."></textarea><button class="auth-submit" type="submit">PUBLICA SUBIECTUL</button></form>`});
}

async function createForumTopic(e){
    e.preventDefault();
    const {user}=await forumContext();
    if(!user)return;
    const category=document.getElementById("newForumCategory").value;
    const title=document.getElementById("newForumTitle").value.trim();
    const content=document.getElementById("newForumContent").value.trim();
    if(!title||!content)return;
    const {error}=await darkslayersSupabase.from("forum_topics").insert({author_id:user.id,category,title,content});
    if(error){alert("Nu am putut publica subiectul.");console.error(error);return;}
    closeSiteModal();
    DARKSLAYERS_FORUM_PAGE=1;
    await loadForumTopics(1);
}

async function openForumTopic(id){
    const {user,profile}=await forumContext();
    const tr=await darkslayersSupabase.from("forum_topics").select("id,created_at,author_id,category,title,content,pinned").eq("id",id).single();
    if(tr.error){console.error(tr.error);return;}
    const t=tr.data;

    const rr=await darkslayersSupabase.from("forum_replies").select("id,created_at,author_id,content").eq("topic_id",id).order("created_at",{ascending:true});
    const replies=rr.data||[];

    const ids=[...new Set([t.author_id,...replies.map(r=>r.author_id)])];
    const pm = await loadForumPublicProfiles(ids);

    const isStaff = user && ["admin","officer"].includes(profile?.role);
    const canDelete=x=>user&&(x===user.id||isStaff);
    const tp=pm.get(t.author_id)||{};

    const repliesHtml=replies.length
        ? replies.map(r=>{
            const p=pm.get(r.author_id)||{};
            return `<div class="forum-reply"><div class="forum-post-meta">${forumAuthorHtml(p)}<span>${forumDate(r.created_at)}</span></div><p>${escapeHtml(r.content).replace(/\n/g,"<br>")}</p>${canDelete(r.author_id)?`<button class="forum-delete" onclick="deleteForumReply(${Number(r.id)},${Number(id)})">STERGE</button>`:""}</div>`;
        }).join("")
        : '<div class="forum-empty">Niciun raspuns inca.</div>';

    const staffPinButton = isStaff
        ? `<button class="forum-delete" onclick="toggleForumPin(${Number(id)}, ${t.pinned ? "false" : "true"})">${t.pinned ? "📌 DEZLIPeste" : "📌 FIXEAZA SUS"}</button>`
        : "";

    const replyForm=user
        ? `<form class="forum-form forum-reply-form" onsubmit="createForumReply(event,${Number(id)})"><label>RASPUNDE</label><textarea id="forumReplyContent" maxlength="3000" required placeholder="Scrie un raspuns..."></textarea><button class="auth-submit" type="submit">TRIMITE RASPUNSUL</button></form>`
        : '<div class="modal-highlight">Conecteaza-te pentru a raspunde.</div>';

    openSiteModal({
        icon:"💬",
        label:escapeHtml(t.category),
        title:(t.pinned ? "📌 " : "") + escapeHtml(t.title),
        content:`<div class="forum-original"><div class="forum-post-meta">${forumAuthorHtml(tp)}<span>${forumDate(t.created_at)}</span></div><p>${escapeHtml(t.content).replace(/\n/g,"<br>")}</p>${staffPinButton}${canDelete(t.author_id)?`<button class="forum-delete" onclick="deleteForumTopic(${Number(id)})">STERGE SUBIECTUL</button>`:""}</div><h3 class="forum-replies-title">RASPUNSURI</h3><div class="forum-replies">${repliesHtml}</div>${replyForm}`
    });
}

async function toggleForumPin(id, pinned){
    const {user,profile}=await forumContext();
    if(!user || !["admin","officer"].includes(profile?.role)) return;

    const {error}=await darkslayersSupabase
        .from("forum_topics")
        .update({pinned:Boolean(pinned)})
        .eq("id",id);

    if(error){
        console.error(error);
        alert("Nu am putut modifica subiectul fixat.");
        return;
    }

    await loadForumTopics(DARKSLAYERS_FORUM_PAGE);
    await openForumTopic(id);
}

async function createForumReply(e,topicId){
    e.preventDefault();
    const {user}=await forumContext();
    if(!user)return;
    const content=document.getElementById("forumReplyContent").value.trim();
    if(!content)return;
    const {error}=await darkslayersSupabase.from("forum_replies").insert({topic_id:topicId,author_id:user.id,content});
    if(error){alert("Nu am putut trimite raspunsul.");console.error(error);return;}
    await openForumTopic(topicId);
}

async function deleteForumTopic(id){
    if(!confirm("Stergi acest subiect si toate raspunsurile?"))return;
    const {error}=await darkslayersSupabase.from("forum_topics").delete().eq("id",id);
    if(error){alert("Nu ai permisiunea sa stergi acest subiect.");return;}
    closeSiteModal();
    loadForumTopics(DARKSLAYERS_FORUM_PAGE);
}

async function deleteForumReply(id,topicId){
    if(!confirm("Stergi acest raspuns?"))return;
    const {error}=await darkslayersSupabase.from("forum_replies").delete().eq("id",id);
    if(error){alert("Nu ai permisiunea sa stergi acest raspuns.");return;}
    openForumTopic(topicId);
}

document.addEventListener("DOMContentLoaded",loadForumTopics);


/* =========================================
   AVATAR MODERATION - DARKSLAYERS
========================================= */
async function getAvatarModerationStatus(){
    const user = await getDarkSlayersUser();
    if(!user) return { canModerate:false, user:null, profile:null };

    const profile = await getDarkSlayersProfile(user);

    return {
        canModerate: ["admin","officer"].includes(
            String(profile?.role || "").toLowerCase()
        ),
        user,
        profile
    };
}

async function loadPendingAvatars(){
    if(!darkslayersSupabase) return [];
    const status = await getAvatarModerationStatus();
    if(!status.canModerate) return [];

    const { data, error } = await darkslayersSupabase
        .from("profiles")
        .select("id, display_name, avatar_pending_url, avatar_status")
        .eq("avatar_status", "pending")
        .not("avatar_pending_url", "is", null)
        .order("display_name", { ascending:true });

    if(error){
        console.error("DARKSLAYERS pending avatars:", error);
        return [];
    }
    return data || [];
}

async function openAvatarModeration(){
    const status = await getAvatarModerationStatus();
    if(!status.canModerate){
        alert("Doar Admin/Officer poate modera avatare.");
        return;
    }

    const rows = await loadPendingAvatars();
    const cards = rows.length ? rows.map(p => `
        <div class="avatar-review-card">
            <img src="${escapeHtml(p.avatar_pending_url || "")}" alt="Avatar in asteptare">
            <div>
                <strong>${escapeHtml(p.display_name || "Member")}</strong>
                <span>Avatar in asteptare</span>
                <div class="modal-actions">
                    <button type="button" class="modal-link" onclick="approveAvatar('${p.id}')">APROBA</button>
                    <button type="button" class="modal-link danger" onclick="rejectAvatar('${p.id}')">RESPINGE</button>
                </div>
            </div>
        </div>
    `).join("") : `<div class="hall-empty">Nu exista avatare in asteptare.</div>`;

    openSiteModal({
        icon:"🛡",
        label:"DARKSLAYERS STAFF",
        title:"MODERARE AVATARE",
        content: cards
    });
}

async function approveAvatar(profileId){
    const status = await getAvatarModerationStatus();
    if(!status.canModerate) return;

    const { data: p, error: readError } = await darkslayersSupabase
        .from("profiles")
        .select("avatar_pending_url")
        .eq("id", profileId)
        .maybeSingle();

    if(readError || !p?.avatar_pending_url){
        alert("Avatarul nu mai este disponibil.");
        return;
    }

    const { error } = await darkslayersSupabase
        .from("profiles")
        .update({
            avatar_url: p.avatar_pending_url,
            avatar_pending_url: null,
            avatar_status: "approved"
        })
        .eq("id", profileId);

    if(error){
        console.error(error);
        alert("Nu am putut aproba avatarul.");
        return;
    }
    await openAvatarModeration();
}

async function rejectAvatar(profileId){
    const status = await getAvatarModerationStatus();
    if(!status.canModerate) return;

    const { error } = await darkslayersSupabase
        .from("profiles")
        .update({
            avatar_pending_url: null,
            avatar_status: "rejected"
        })
        .eq("id", profileId);

    if(error){
        console.error(error);
        alert("Nu am putut respinge avatarul.");
        return;
    }
    await openAvatarModeration();
}

