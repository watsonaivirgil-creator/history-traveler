/* CHRONO-OS APP LOGIC v4.0 — AI ENHANCED */
/* Upgrade: sendMessage() now routes through Anthropic API */
/* All hardcoded branch responses replaced with live AI answers */
/* conversationHistory maintains context across turns per site */
/* Drop-in replacement for app.js — index.html unchanged */

let viewer;
let currentSiteKey = "";
let conversationHistory = [];
let isLoading = false;

const historyData = {
    /* ── EGYPT ──────────────────────────────────────────────── */
    "Giza": {
        name: "Pyramid of Giza",
        lon: 31.1342, lat: 29.9792,
        era: "c. 2560 BCE", culture: "Ancient Egyptian",
        baseFact: "The last surviving Wonder of the Ancient World. Built for Pharaoh Khufu over an estimated 20 years, using more than 2.3 million limestone blocks.",
        img: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
        branches: ["Who built it?", "How were the stones moved?", "What's inside?"]
    },
    "Luxor": {
        name: "Luxor Temple",
        lon: 32.6391, lat: 25.6995,
        era: "c. 1400 BCE", culture: "Ancient Egyptian",
        baseFact: "A grand temple complex on the east bank of the Nile, built primarily by Amenhotep III and expanded by Ramesses II. Dedicated to the rejuvenation of kingship.",
        img: "",
        branches: ["Who was Amenhotep III?", "What was the Opet Festival?", "Why two pharaohs?"]
    },
    "AbuSimbel": {
        name: "Abu Simbel",
        lon: 31.6255, lat: 22.3372,
        era: "c. 1264 BCE", culture: "Ancient Egyptian",
        baseFact: "Twin rock-cut temples carved into a mountainside by Ramesses II. In 1968, a global engineering effort relocated the entire structure to save it from rising floodwaters.",
        img: "",
        branches: ["Why was it relocated?", "Who is Ramesses II?", "What is the solar alignment?"]
    },
    "Karnak": {
        name: "Karnak Complex",
        lon: 32.6573, lat: 25.7188,
        era: "c. 2055–100 BCE", culture: "Ancient Egyptian",
        baseFact: "The world's largest religious site, built and expanded across 2,000 years. Its Hypostyle Hall contains 134 massive columns, some reaching 23 metres high.",
        img: "",
        branches: ["How long was it built?", "Who worshipped here?", "What is the Sacred Lake?"]
    },
    "ValleyKings": {
        name: "Valley of the Kings",
        lon: 32.6014, lat: 25.7402,
        era: "c. 1550–1070 BCE", culture: "Ancient Egyptian",
        baseFact: "The royal necropolis of Egypt's New Kingdom pharaohs, concealing over 60 tombs. Howard Carter's 1922 discovery of Tutankhamun's intact tomb transformed archaeology.",
        img: "",
        branches: ["Who was Tutankhamun?", "Why were tombs hidden here?", "Were they all robbed?"]
    },

    /* ── ITALY ───────────────────────────────────────────────── */
    "Colosseum": {
        name: "The Colosseum",
        lon: 12.4922, lat: 41.8902,
        era: "70–80 CE", culture: "Ancient Roman",
        baseFact: "The Flavian Amphitheatre — Rome's largest arena, seating up to 80,000 spectators for gladiatorial combat, animal hunts, and public spectacles lasting for centuries.",
        img: "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
        branches: ["What happened inside?", "Who were the gladiators?", "How was it built so fast?"]
    },
    "Pantheon": {
        name: "The Pantheon",
        lon: 12.4769, lat: 41.8986,
        era: "125 CE", culture: "Ancient Roman",
        baseFact: "The best-preserved building of ancient Rome. Its unreinforced concrete dome — 43.3 metres in diameter — remained the world's largest for 1,300 years and is still the largest unreinforced concrete dome.",
        img: "",
        branches: ["How does the dome work?", "What is the oculus?", "Why is it so well preserved?"]
    },
    "Pompeii": {
        name: "Pompeii",
        lon: 14.4848, lat: 40.7489,
        era: "79 CE", culture: "Ancient Roman",
        baseFact: "A thriving Roman city of 11,000 people, buried and perfectly preserved under 4–6 metres of volcanic ash following the catastrophic eruption of Mount Vesuvius.",
        img: "",
        branches: ["What was daily life like?", "How did people die?", "What was found there?"]
    },
    "Forum": {
        name: "Roman Forum",
        lon: 12.4853, lat: 41.8925,
        era: "7th century BCE – 4th century CE", culture: "Ancient Roman",
        baseFact: "The civic heart of ancient Rome for over a thousand years — a rectangle of public space surrounded by temples, courts, and government buildings where Senate and citizens met.",
        img: "",
        branches: ["What happened here?", "Who was Julius Caesar?", "Why is it in ruins?"]
    },
    "Hadrian": {
        name: "Hadrian's Villa",
        lon: 12.7739, lat: 41.9427,
        era: "118–138 CE", culture: "Ancient Roman",
        baseFact: "A vast imperial retreat at Tivoli built by Emperor Hadrian, featuring over 30 buildings including theatres, libraries, baths, and a private island — essentially a self-contained world.",
        img: "",
        branches: ["Who was Hadrian?", "What was the island theatre?", "Why build outside Rome?"]
    },

    /* ── GREECE ──────────────────────────────────────────────── */
    "Parthenon": {
        name: "The Parthenon",
        lon: 23.7285, lat: 37.9715,
        era: "447–432 BCE", culture: "Ancient Greek",
        baseFact: "A temple to Athena atop the Athenian Acropolis — the definitive symbol of Classical Greek civilisation. Its mathematical precision includes subtle curves to correct optical illusions.",
        img: "https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg",
        branches: ["Who was Athena?", "What are the Elgin Marbles?", "How was it damaged?"]
    },
    "Delphi": {
        name: "Delphi",
        lon: 22.5011, lat: 38.4824,
        era: "8th century BCE – 4th century CE", culture: "Ancient Greek",
        baseFact: "Considered the centre of the world by the ancient Greeks. Home of the Pythia — the Oracle of Apollo — whose cryptic prophecies influenced the decisions of kings, generals, and city-states for a thousand years.",
        img: "",
        branches: ["Who was the Oracle?", "How did the Pythia prophesy?", "Why was Delphi central?"]
    },
    "Knossos": {
        name: "Knossos",
        lon: 25.1622, lat: 35.2979,
        era: "c. 2000–1400 BCE", culture: "Minoan Civilisation",
        baseFact: "Europe's oldest city and the grand palace of the Minoan civilisation on Crete. Labyrinthine corridors inspired the Greek myth of the Minotaur and the hero Theseus.",
        img: "",
        branches: ["Who were the Minoans?", "What is the Minotaur myth?", "How was it discovered?"]
    },
    "Olympia": {
        name: "Olympia",
        lon: 21.6273, lat: 37.6384,
        era: "776 BCE – 393 CE", culture: "Ancient Greek",
        baseFact: "The birthplace of the Olympic Games, held every four years for over 1,100 years. The sanctuary also housed the Statue of Zeus — one of the Seven Wonders of the Ancient World.",
        img: "",
        branches: ["What were the original games?", "Who could compete?", "Why did they stop?"]
    },
    "Epidaurus": {
        name: "Epidaurus",
        lon: 23.0753, lat: 37.5961,
        era: "c. 4th century BCE", culture: "Ancient Greek",
        baseFact: "An ancient healing sanctuary and home to the most perfectly acoustically engineered theatre ever built. A coin dropped at centre stage can be heard clearly from the highest of its 14,000 seats.",
        img: "",
        branches: ["How does the acoustics work?", "Who was Asclepius?", "What treatments were used?"]
    }
};

/* ── AI RESPONSE ENGINE ─────────────────────────────────────── */

async function getAIResponse(userMessage, site) {
    const systemPrompt = `You are the Chrono-Guide, the AI historian embedded in History Traveler — an interactive 3D globe application. The user is currently linked to: ${site.name} (${site.era}, ${site.culture}).

Respond with authority and atmosphere. You are speaking from inside the historical record. Guidelines:
- Answer in 2-4 sentences. Be vivid, specific, and historically accurate.
- No markdown, no bullet points, no headers — flowing prose only.
- If the question is off-topic, briefly redirect to the current site with a natural transition.
- You may occasionally ask a follow-up question to deepen engagement.
- Treat every question as an opportunity to bring history to life.`;

    conversationHistory.push({ role: "user", content: userMessage });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: systemPrompt,
            messages: conversationHistory
        })
    });

    const data = await response.json();
    const reply = (data.content && data.content[0] && data.content[0].text)
        ? data.content[0].text
        : "The archive signal is weak. Please transmit again.";

    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
}

/* ── UI HELPERS ─────────────────────────────────────────────── */

function appendMessage(sender, text, color) {
    const msgArea = document.getElementById('chat-messages');
    const p = document.createElement('p');
    p.style.cssText = `margin-top:12px; padding-top:10px; border-top:1px solid #1a1a1a; color:${color}; line-height:1.7;`;
    p.innerHTML = `<strong style="font-size:10px; letter-spacing:1px; opacity:0.6; display:block; margin-bottom:4px;">${sender}</strong>${text}`;
    msgArea.appendChild(p);
    msgArea.scrollTop = msgArea.scrollHeight;
    return p;
}

function setLoading(state) {
    isLoading = state;
    const btn = document.getElementById('send-btn');
    const input = document.getElementById('user-input');
    btn.disabled = state;
    btn.textContent = state ? '...' : 'SEND';
    input.disabled = state;
}

/* ── CORE FUNCTIONS ─────────────────────────────────────────── */

async function init() {
    const status = document.getElementById('status-text');

    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NzJkN2MzNy02Mjk2LTQ4ODMtOWMxMC0zODdmM2UwYjI5N2UiLCJpZCI6NDE4Nzk3LCJpYXQiOjE3NzYyOTg1NjV9.8obaJxAuSLsIW4_7NlGMwQORhcYgynoHjeVJGknTuI4';

    try {
        const osmLayer = new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        });

        viewer = new Cesium.Viewer('map-container', {
            baseLayer: new Cesium.ImageryLayer(osmLayer),
            baseLayerPicker: false,
            geocoder: false,
            timeline: false,
            animation: false,
            requestRenderMode: true
        });

        try {
            const buildingTileset = await Cesium.createOsmBuildingsAsync();
            viewer.scene.primitives.add(buildingTileset);
        } catch (err) {
            console.warn("OSM Buildings unavailable:", err);
        }

        Object.keys(historyData).forEach(key => {
            const site = historyData[key];
            viewer.entities.add({
                id: key,
                position: Cesium.Cartesian3.fromDegrees(site.lon, site.lat, 0),
                point: { color: Cesium.Color.GOLD, pixelSize: 10, outlineWidth: 2 },
                label: {
                    text: site.name, font: '10pt serif', fillColor: Cesium.Color.GOLD,
                    pixelOffset: new Cesium.Cartesian2(0, -30), showBackground: true,
                    backgroundColor: new Cesium.Color(0, 0, 0, 0.8)
                }
            });
        });

        viewer.screenSpaceEventHandler.setInputAction((movement) => {
            const picked = viewer.scene.pick(movement.position);
            if (picked && picked.id && historyData[picked.id.id]) {
                currentSiteKey = picked.id.id;
                const site = historyData[currentSiteKey];
                openSidebar(site);
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(site.lon, site.lat, 1000),
                    orientation: { pitch: Cesium.Math.toRadians(-30.0) }
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        status.innerText = "ONLINE";

    } catch (e) {
        status.innerText = "SYSTEM ERROR";
        console.error(e);
    }
}

function openSidebar(site) {
    /* Reset conversation context for this site */
    conversationHistory = [];

    const msgArea = document.getElementById('chat-messages');
    document.getElementById('location-name').innerText = site.name;

    const imgTag = site.img
        ? `<img src="${site.img}" class="site-image" onerror="this.style.display='none'">`
        : '';

    /* Build branch buttons — now AI-powered */
    const branchHTML = (site.branches || []).map(q =>
        `<button class="branch-btn" onclick="askBranch(this, '${q.replace(/'/g, "\\'")}')">${q}</button>`
    ).join('');

    msgArea.innerHTML = `
        ${imgTag}
        <p style="line-height:1.7; color:#ccc;">${site.baseFact}</p>
        <div id="branch-container" style="margin-top:14px; display:flex; flex-wrap:wrap; gap:8px;">
            ${branchHTML}
        </div>
    `;

    document.getElementById('chat-sidebar').style.right = "0px";
}

/* Branch button click — fires the question through AI */
window.askBranch = async function(btn, question) {
    if (isLoading || !currentSiteKey) return;
    btn.disabled = true;
    btn.style.opacity = '0.4';

    const site = historyData[currentSiteKey];
    appendMessage('YOU', question, '#888');
    setLoading(true);

    const thinkingP = appendMessage('CHRONO-GUIDE', '<em style="color:#444">Retrieving from the archive...</em>', '#666');

    try {
        const reply = await getAIResponse(question, site);
        thinkingP.innerHTML = `<strong style="font-size:10px; letter-spacing:1px; opacity:0.6; display:block; margin-bottom:4px;">CHRONO-GUIDE</strong>${reply}`;
    } catch (e) {
        thinkingP.innerHTML = `<strong style="font-size:10px; letter-spacing:1px; opacity:0.6; display:block; margin-bottom:4px;">CHRONO-GUIDE</strong>Signal lost. Please try again.`;
    }

    document.getElementById('chat-messages').scrollTop = 99999;
    setLoading(false);
};

window.closeSidebar = function() {
    document.getElementById('chat-sidebar').style.right = "-400px";
    conversationHistory = [];
    currentSiteKey = "";
};

window.sendMessage = async function() {
    if (isLoading || !currentSiteKey) return;

    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    const site = historyData[currentSiteKey];

    appendMessage('YOU', text, '#888');
    setLoading(true);

    const thinkingP = appendMessage('CHRONO-GUIDE', '<em style="color:#444">Retrieving from the archive...</em>', '#666');

    try {
        const reply = await getAIResponse(text, site);
        thinkingP.innerHTML = `<strong style="font-size:10px; letter-spacing:1px; opacity:0.6; display:block; margin-bottom:4px;">CHRONO-GUIDE</strong>${reply}`;
    } catch (e) {
        thinkingP.innerHTML = `<strong style="font-size:10px; letter-spacing:1px; opacity:0.6; display:block; margin-bottom:4px;">CHRONO-GUIDE</strong>The archive signal is disrupted. Please try again.`;
        console.error("AI fetch error:", e);
    }

    document.getElementById('chat-messages').scrollTop = 99999;
    setLoading(false);
    input.focus();
};

window.flyToRegion = function(region) {
    const targets = {
        'Egypt':  { lon: 31.13,  lat: 26.50,  alt: 800000  },
        'Italy':  { lon: 12.49,  lat: 41.89,  alt: 500000  },
        'Greece': { lon: 23.72,  lat: 37.97,  alt: 500000  },
        'Global': { lon: 0,      lat: 20,     alt: 20000000 }
    };
    const t = targets[region];
    if (viewer && t) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(t.lon, t.lat, t.alt)
        });
    }
};

/* Enter key support */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') window.sendMessage();
        });
    }
});

window.onload = init;
