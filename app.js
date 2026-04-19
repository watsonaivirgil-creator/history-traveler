/* CHRONO-OS APP LOGIC v3.2 — GEMINI AI INTEGRATED */
/* Based on your existing v3.1 — all original code preserved */
/* Added: Gemini free tier AI for sendMessage + branch buttons */
/* Only edit needed: replace YOUR_API_KEY_HERE with your key   */

let viewer;
let currentSiteKey = "";
let conversationHistory = [];
let isLoading = false;

/* ── ⚠️  PASTE YOUR GOOGLE AI STUDIO KEY BELOW ─────────────── */
const GEMINI_API_KEY = "AIzaSyDCJjLUJPZHhLDGjiYauFpPzx8fgKBY-_w";
/* ─────────────────────────────────────────────────────────────── */

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const historyData = {
    "Giza":        { name: "Pyramid of Giza",        lon: 31.1342, lat: 29.9792, era: "c. 2560 BCE",               culture: "Ancient Egyptian", baseFact: "The Great Pyramid of Khufu.", img: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",                                                                                          branches: [{label: "Construction", text: "Who built it and how?"}, {label: "Age",          text: "How old is the pyramid?"},       {label: "Inside",       text: "What is inside the pyramid?"}] },
    "Luxor":       { name: "Luxor Temple",            lon: 32.6391, lat: 25.6995, era: "c. 1400 BCE",               culture: "Ancient Egyptian", baseFact: "East bank Nile temple.",     img: "",                                                                                                                                                                   branches: [{label: "Pharaohs",    text: "Who were the pharaohs here?"},   {label: "Opet Festival", text: "What was the Opet Festival?"},  {label: "Two Builders", text: "Why did two pharaohs build it?"}] },
    "AbuSimbel":   { name: "Abu Simbel",              lon: 31.6255, lat: 22.3372, era: "c. 1264 BCE",               culture: "Ancient Egyptian", baseFact: "Rock-cut temples of Ramesses II.", img: "",                                                                                                                                                               branches: [{label: "Rescue",      text: "Why was it relocated?"},         {label: "Ramesses II",   text: "Who was Ramesses II?"},          {label: "Solar Event",  text: "What is the solar alignment?"}] },
    "Karnak":      { name: "Karnak Complex",          lon: 32.6573, lat: 25.7188, era: "c. 2055–100 BCE",           culture: "Ancient Egyptian", baseFact: "World's largest religious site.", img: "",                                                                                                                                                                branches: [{label: "Columns",     text: "Tell me about the columns."},    {label: "Timeline",      text: "How long was it built?"},        {label: "Sacred Lake",  text: "What is the Sacred Lake?"}] },
    "ValleyKings": { name: "Valley of the Kings",     lon: 32.6014, lat: 25.7402, era: "c. 1550–1070 BCE",          culture: "Ancient Egyptian", baseFact: "Royal necropolis of the New Kingdom.", img: "",                                                                                                                                                          branches: [{label: "Tutankhamun", text: "Who was Tutankhamun?"},         {label: "Hidden Tombs",  text: "Why were tombs hidden here?"},   {label: "Robbed?",      text: "Were the tombs all robbed?"}] },
    "Colosseum":   { name: "The Colosseum",           lon: 12.4922, lat: 41.8902, era: "70–80 CE",                  culture: "Ancient Roman",    baseFact: "Flavian Amphitheatre of Rome.", img: "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",                                                               branches: [{label: "Gladiators",  text: "Who were the gladiators?"},     {label: "Engineering",   text: "How was it built so fast?"},     {label: "Events",       text: "What happened inside?"}] },
    "Pantheon":    { name: "The Pantheon",            lon: 12.4769, lat: 41.8986, era: "125 CE",                    culture: "Ancient Roman",    baseFact: "The best-preserved Roman temple.", img: "",                                                                                                                                                               branches: [{label: "The Dome",    text: "How does the dome work?"},      {label: "The Oculus",    text: "What is the oculus?"},           {label: "Preserved",    text: "Why is it so well preserved?"}] },
    "Pompeii":     { name: "Pompeii",                 lon: 14.4848, lat: 40.7489, era: "79 CE",                     culture: "Ancient Roman",    baseFact: "City frozen by Vesuvius in 79 AD.", img: "",                                                                                                                                                              branches: [{label: "Daily Life",  text: "What was daily life like?"},    {label: "The Eruption",  text: "How did people die?"},           {label: "Discoveries",  text: "What was found there?"}] },
    "Forum":       { name: "Roman Forum",             lon: 12.4853, lat: 41.8925, era: "7th c. BCE – 4th c. CE",   culture: "Ancient Roman",    baseFact: "Social and political heart of Rome.", img: "",                                                                                                                                                            branches: [{label: "Politics",    text: "What happened here?"},          {label: "Julius Caesar", text: "Who was Julius Caesar?"},        {label: "Ruins",        text: "Why is it in ruins?"}] },
    "Hadrian":     { name: "Hadrian's Villa",         lon: 12.7739, lat: 41.9427, era: "118–138 CE",                culture: "Ancient Roman",    baseFact: "Imperial retreat at Tivoli.", img: "",                                                                                                                                                                   branches: [{label: "Design",      text: "What was the island theatre?"}, {label: "Hadrian",       text: "Who was Hadrian?"},              {label: "Location",     text: "Why build outside Rome?"}] },
    "Parthenon":   { name: "The Parthenon",           lon: 23.7285, lat: 37.9715, era: "447–432 BCE",               culture: "Ancient Greek",    baseFact: "Temple on the Athenian Acropolis.", img: "https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg",                                                                             branches: [{label: "Athena",      text: "Who was Athena?"},              {label: "Elgin Marbles", text: "What are the Elgin Marbles?"},   {label: "Damage",       text: "How was it damaged?"}] },
    "Delphi":      { name: "Delphi",                  lon: 22.5011, lat: 38.4824, era: "8th c. BCE – 4th c. CE",   culture: "Ancient Greek",    baseFact: "The center of the Greek world.", img: "",                                                                                                                                                                 branches: [{label: "Oracle",      text: "Who was the Oracle?"},          {label: "Prophecy",      text: "How did the Pythia prophesy?"},   {label: "Power",        text: "Why was Delphi so powerful?"}] },
    "Knossos":     { name: "Knossos",                 lon: 25.1622, lat: 35.2979, era: "c. 2000–1400 BCE",          culture: "Minoan Civilisation", baseFact: "Minoan palace on Crete.", img: "",                                                                                                                                                                   branches: [{label: "Minoans",     text: "Who were the Minoans?"},        {label: "Minotaur",      text: "What is the Minotaur myth?"},     {label: "Discovery",    text: "How was it discovered?"}] },
    "Olympia":     { name: "Olympia",                 lon: 21.6273, lat: 37.6384, era: "776 BCE – 393 CE",          culture: "Ancient Greek",    baseFact: "Birthplace of the Olympic Games.", img: "",                                                                                                                                                               branches: [{label: "The Games",   text: "What were the original games?"},{label: "Athletes",      text: "Who could compete?"},             {label: "End",          text: "Why did the games stop?"}] },
    "Epidaurus":   { name: "Epidaurus",               lon: 23.0753, lat: 37.5961, era: "c. 4th century BCE",        culture: "Ancient Greek",    baseFact: "Perfectly acoustic ancient theater.", img: "",                                                                                                                                                           branches: [{label: "Acoustics",   text: "How does the acoustics work?"}, {label: "Asclepius",     text: "Who was Asclepius?"},             {label: "Healing",      text: "What treatments were used?"}] }
};

/* ── GEMINI AI ENGINE ───────────────────────────────────────── */

async function getAIResponse(userMessage, site) {
    const systemInstruction = `You are the Chrono-Guide, an AI historian embedded in History Traveler — an interactive 3D globe app. The user is currently viewing: ${site.name} (${site.era}, ${site.culture}).
Answer in 2-4 vivid, historically accurate sentences. No markdown, no bullet points — flowing prose only. If the question is off-topic, briefly redirect to the current site. Occasionally ask a follow-up question to deepen engagement.`;

    const contents = conversationHistory.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));
    contents.push({ role: "user", parts: [{ text: userMessage }] });

    const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: contents,
            generationConfig: { maxOutputTokens: 300, temperature: 0.8 }
        })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || "The archive signal is weak. Please transmit again.";

    conversationHistory.push({ role: "user", content: userMessage });
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
}

function setLoading(state) {
    isLoading = state;
    const btn = document.getElementById('send-btn');
    btn.disabled = state;
    btn.textContent = state ? '...' : 'SEND';
    document.getElementById('user-input').disabled = state;
}

/* ── CESIUM INIT ────────────────────────────────────────────── */

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
            console.error("Buildings failed to load. Check Ion Token.");
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

/* ── GLOBAL FUNCTIONS (called from index.html) ──────────────── */

window.flyToRegion = function(region) {
    const targets = {
        'Egypt':  { lon: 31.13, lat: 26.50, alt: 800000  },
        'Italy':  { lon: 12.49, lat: 41.89, alt: 500000  },
        'Greece': { lon: 23.72, lat: 37.97, alt: 500000  },
        'Global': { lon: 0,     lat: 20,    alt: 20000000 }
    };
    const t = targets[region];
    if (viewer && t) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(t.lon, t.lat, t.alt)
        });
    }
};

function openSidebar(site) {
    conversationHistory = []; // reset context on each new site

    const msgArea = document.getElementById('chat-messages');
    document.getElementById('location-name').innerText = site.name;

    const imgTag = site.img
        ? `<img src="${site.img}" class="site-image" onerror="this.src='https://via.placeholder.com/300x150/111/gold?text=ARCHIVE+IMAGE'">`
        : '';

    const branchHTML = (site.branches || []).map(b =>
        `<button class="branch-btn" onclick="askBranch(this,'${b.text.replace(/'/g, "\\'")}')">${b.label}</button>`
    ).join('');

    msgArea.innerHTML = `
        ${imgTag}
        <p>${site.baseFact}</p>
        <div id="branch-container">${branchHTML}</div>
    `;

    document.getElementById('chat-sidebar').style.right = "0px";
}

window.askBranch = async function(btn, question) {
    if (isLoading || !currentSiteKey) return;
    btn.disabled = true;
    btn.style.opacity = '0.4';

    const site = historyData[currentSiteKey];
    const msgArea = document.getElementById('chat-messages');

    msgArea.innerHTML += `<p style="color:white; margin-top:10px;"><strong>You:</strong> ${question}</p>`;
    setLoading(true);

    const thinking = document.createElement('p');
    thinking.innerHTML = '<em style="color:#444">Retrieving from the archive...</em>';
    msgArea.appendChild(thinking);
    msgArea.scrollTop = msgArea.scrollHeight;

    try {
        const reply = await getAIResponse(question, site);
        thinking.innerHTML = `<strong>Guide:</strong> ${reply}`;
    } catch (e) {
        thinking.innerHTML = `<strong>Guide:</strong> Signal lost. Please try again.`;
        console.error("Gemini error:", e);
    }

    msgArea.scrollTop = msgArea.scrollHeight;
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
    const msgArea = document.getElementById('chat-messages');

    msgArea.innerHTML += `<p style="color:white; margin-top:10px;"><strong>You:</strong> ${text}</p>`;
    setLoading(true);

    const thinking = document.createElement('p');
    thinking.innerHTML = '<em style="color:#444">Retrieving from the archive...</em>';
    msgArea.appendChild(thinking);
    msgArea.scrollTop = msgArea.scrollHeight;

    try {
        const reply = await getAIResponse(text, site);
        thinking.innerHTML = `<strong>Guide:</strong> ${reply}`;
    } catch (e) {
        thinking.innerHTML = `<strong>Guide:</strong> Archive signal disrupted. Please try again.`;
        console.error("Gemini error:", e);
    }

    msgArea.scrollTop = msgArea.scrollHeight;
    setLoading(false);
    input.focus();
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
