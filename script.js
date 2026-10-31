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

document.addEventListener("DOMContentLoaded", loadDarkSlayersMembers);

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
   RAID PROGRESS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const raids =
            document.querySelectorAll(".raid");


        raids.forEach(
            function (raid, index) {

                const progressText =
                    raid.querySelector("p");


                if (!progressText) {
                    return;
                }


                const parts =
                    progressText
                        .textContent
                        .trim()
                        .split("/");


                if (parts.length !== 2) {
                    return;
                }


                const originalCurrent =
                    parseInt(parts[0].trim());

                const maxBosses =
                    parseInt(parts[1].trim());


                if (
                    isNaN(originalCurrent) ||
                    isNaN(maxBosses)
                ) {
                    return;
                }


                /* NUMELE RAIDULUI */

                const raidNameElement =
                    raid.querySelector("h3");


                let raidName =
                    "raid-" + index;


                if (raidNameElement) {

                    raidName =
                        raidNameElement
                            .textContent
                            .trim()
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            );

                }


                /* EXPANSIUNEA */

                let expansion = "unknown";


                if (
                    raid.closest(
                        "#foreverRaids"
                    )
                ) {

                    expansion = "forever";

                }


                if (
                    raid.closest(
                        "#wotlkRaids"
                    )
                ) {

                    expansion = "wotlk";

                }


                const storageKey =
                    "darkslayers-progress-" +
                    expansion +
                    "-" +
                    raidName;


                /* CITIM SALVAREA */

                let currentBosses =
                    parseInt(
                        localStorage.getItem(
                            storageKey
                        )
                    );


                if (isNaN(currentBosses)) {

                    currentBosses =
                        originalCurrent;

                }


                if (currentBosses < 0) {
                    currentBosses = 0;
                }


                if (
                    currentBosses >
                    maxBosses
                ) {

                    currentBosses =
                        maxBosses;

                }


                /* CONTROALE */

                const controls =
                    document.createElement(
                        "div"
                    );

                controls.className =
                    "raid-progress";


                const minusButton =
                    document.createElement(
                        "button"
                    );

                minusButton.className =
                    "progress-button minus";

                minusButton.textContent =
                    "−";


                const progressNumber =
                    document.createElement(
                        "span"
                    );

                progressNumber.className =
                    "progress-number";


                const plusButton =
                    document.createElement(
                        "button"
                    );

                plusButton.className =
                    "progress-button plus";

                plusButton.textContent =
                    "+";


                controls.appendChild(
                    minusButton
                );

                controls.appendChild(
                    progressNumber
                );

                controls.appendChild(
                    plusButton
                );


                progressText.replaceWith(
                    controls
                );


                /* ACTUALIZARE */

                function updateProgress() {

                    progressNumber.textContent =
                        currentBosses +
                        " / " +
                        maxBosses;


                    localStorage.setItem(
                        storageKey,
                        currentBosses
                    );


                    if (
                        currentBosses ===
                        maxBosses
                    ) {

                        raid.classList.add(
                            "raid-completed"
                        );

                    } else {

                        raid.classList.remove(
                            "raid-completed"
                        );

                    }


                    minusButton.disabled =
                        currentBosses === 0;


                    plusButton.disabled =
                        currentBosses ===
                        maxBosses;

                }


                /* MINUS */

                minusButton.addEventListener(
                    "click",
                    function () {

                        if (
                            currentBosses > 0
                        ) {

                            currentBosses--;

                            updateProgress();

                        }

                    }
                );


                /* PLUS */

                plusButton.addEventListener(
                    "click",
                    function () {

                        if (
                            currentBosses <
                            maxBosses
                        ) {

                            currentBosses++;

                            updateProgress();

                        }

                    }
                );


                updateProgress();

            }
        );

    }
);


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
   DARKSLAYERS ACCOUNT - SUPABASE AUTH
========================================= */

function authMessage(message, type = "info") {
    const box = document.getElementById("authMessage");
    if (!box) return;
    box.textContent = message;
    box.className = "auth-message " + type;
}

function openAccountModal(mode = "login") {
    openSiteModal({
        icon: "♛",
        label: "DARKSLAYERS",
        title: "CONT",
        content: `
            <div class="auth-tabs">
                <button id="authLoginTab" class="auth-tab active" onclick="showAuthLogin()">LOGIN</button>
                <button id="authRegisterTab" class="auth-tab" onclick="showAuthRegister()">INREGISTRARE</button>
            </div>
            <div id="authMessage" class="auth-message"></div>
            <form id="loginForm" class="auth-form" onsubmit="loginDarkSlayers(event)">
                <label>Email</label>
                <input id="loginEmail" type="email" autocomplete="email" required placeholder="email@exemplu.ro">
                <label>Parola</label>
                <input id="loginPassword" type="password" autocomplete="current-password" required minlength="6" placeholder="Parola">
                <button type="submit" class="auth-submit">INTRA IN CONT</button>
            </form>
            <form id="registerForm" class="auth-form" style="display:none" onsubmit="registerDarkSlayers(event)">
                <label>Nume in joc</label>
                <input id="registerName" type="text" required maxlength="30" placeholder="Ex: Skanners">
                <label>Email</label>
                <input id="registerEmail" type="email" autocomplete="email" required placeholder="email@exemplu.ro">
                <label>Parola</label>
                <input id="registerPassword" type="password" autocomplete="new-password" required minlength="6" placeholder="Minim 6 caractere">
                <button type="submit" class="auth-submit">CREEAZA CONT</button>
            </form>
            <div id="loggedInPanel" class="auth-logged" style="display:none">
                <div class="modal-highlight">
                    Esti conectat ca <strong id="loggedInEmail"></strong>
                </div>
                <button class="auth-submit auth-logout" onclick="logoutDarkSlayers()">LOGOUT</button>
            </div>
        `
    });
    refreshAuthModal();
    if (mode === "register") showAuthRegister();
}

function showAuthLogin() {
    const login = document.getElementById("loginForm");
    const register = document.getElementById("registerForm");
    const loginTab = document.getElementById("authLoginTab");
    const registerTab = document.getElementById("authRegisterTab");
    if (!login || !register) return;
    login.style.display = "grid";
    register.style.display = "none";
    if (loginTab) loginTab.classList.add("active");
    if (registerTab) registerTab.classList.remove("active");
    authMessage("");
}

function showAuthRegister() {
    const login = document.getElementById("loginForm");
    const register = document.getElementById("registerForm");
    const loginTab = document.getElementById("authLoginTab");
    const registerTab = document.getElementById("authRegisterTab");
    if (!login || !register) return;
    login.style.display = "none";
    register.style.display = "grid";
    if (loginTab) loginTab.classList.remove("active");
    if (registerTab) registerTab.classList.add("active");
    authMessage("");
}

async function registerDarkSlayers(event) {
    event.preventDefault();
    if (!darkslayersSupabase) return authMessage("Conexiunea Supabase nu este disponibila.", "error");

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    authMessage("Se creeaza contul...", "info");
    const { data, error } = await darkslayersSupabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } }
    });

    if (error) return authMessage(error.message, "error");

    if (data.session) {
        authMessage("Cont creat. Esti conectat!", "success");
        await updateAccountButton();
        setTimeout(refreshAuthModal, 250);
    } else {
        authMessage("Cont creat. Verifica emailul pentru confirmare, apoi fa login.", "success");
    }
}

async function loginDarkSlayers(event) {
    event.preventDefault();
    if (!darkslayersSupabase) return authMessage("Conexiunea Supabase nu este disponibila.", "error");

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    authMessage("Se face conectarea...", "info");
    const { error } = await darkslayersSupabase.auth.signInWithPassword({ email, password });

    if (error) return authMessage("Email sau parola incorecta.", "error");

    authMessage("Conectare reusita!", "success");
    await updateAccountButton();
    setTimeout(refreshAuthModal, 250);
}

async function logoutDarkSlayers() {
    if (!darkslayersSupabase) return;
    await darkslayersSupabase.auth.signOut();
    await updateAccountButton();
    closeSiteModal();
}

async function getDarkSlayersUser() {
    if (!darkslayersSupabase) return null;
    const { data } = await darkslayersSupabase.auth.getUser();
    return data?.user || null;
}

async function updateAccountButton() {
    const button = document.getElementById("accountButton");
    if (!button) return;
    const user = await getDarkSlayersUser();

    if (user) {
        const displayName = user.user_metadata?.display_name || "CONTUL MEU";
        button.textContent = displayName.toUpperCase();
        button.classList.add("logged-in");
    } else {
        button.textContent = "CONT";
        button.classList.remove("logged-in");
    }
}

async function refreshAuthModal() {
    const login = document.getElementById("loginForm");
    const register = document.getElementById("registerForm");
    const logged = document.getElementById("loggedInPanel");
    const tabs = document.querySelector(".auth-tabs");
    const email = document.getElementById("loggedInEmail");
    if (!login || !register || !logged) return;

    const user = await getDarkSlayersUser();
    if (user) {
        login.style.display = "none";
        register.style.display = "none";
        if (tabs) tabs.style.display = "none";
        logged.style.display = "grid";
        if (email) email.textContent = user.email || "";
    } else {
        logged.style.display = "none";
        if (tabs) tabs.style.display = "flex";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateAccountButton();
    if (darkslayersSupabase) {
        darkslayersSupabase.auth.onAuthStateChange(function () {
            setTimeout(updateAccountButton, 0);
        });
    }
});
