let viewer;
let currentSiteKey = "";

// HISTORY MATRIX - COORDINATES SWAPPED TO (LON, LAT)
const historyData = {
    "Giza": { name: "Pyramid of Giza", lon: 31.1342, lat: 29.9792, baseFact: "The Great Pyramid of Khufu.", img: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg", branches: [{label: "Construction", text: "Built from 2.3 million blocks."}, {label: "Age", text: "Completed ~2560 BC."}] },
    "Luxor": { name: "Luxor Temple", lon: 32.6391, lat: 25.6995, baseFact: "East bank Nile temple.", img: "", branches: [{label: "Pharaohs", text: "Amenhotep III & Ramesses II."}] },
    "AbuSimbel": { name: "Abu Simbel", lon: 31.6255, lat: 22.3372, baseFact: "Rock-cut temples of Ramesses II.", img: "", branches: [{label: "Rescue", text: "Moved in 1968 to save from floods."}] },
    "Karnak": { name: "Karnak Complex", lon: 32.6573, lat: 25.7188, baseFact: "World's largest religious site.", img: "", branches: [{label: "Columns", text: "134 massive pillars in the hall."}] },
    "ValleyKings": { name: "Valley of the Kings", lon: 32.6014, lat: 25.7402, baseFact: "Royal necropolis of the New Kingdom.", img: "", branches: [{label: "Tutankhamun", text: "Discovered by Howard Carter."}] },

    "Colosseum": { name: "The Colosseum", lon: 12.4922, lat: 41.8902, baseFact: "Flavian Amphitheatre of Rome.", img: "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg", branches: [{label: "Gladiators", text: "Combatants in the arena."}, {label: "Engineering", text: "Used a complex system of vaults."}] },
    "Pantheon": { name: "The Pantheon", lon: 12.4769, lat: 41.8986, baseFact: "The best-preserved Roman temple.", img: "", branches: [{label: "The Dome", text: "Unreinforced concrete dome."}] },
    "Pompeii": { name: "Pompeii", lon: 14.4848, lat: 40.7489, baseFact: "City frozen by Vesuvius in 79 AD.", img: "", branches: [{label: "Eruption", text: "Ash preserved life in situ."}] },
    "Forum": { name: "Roman Forum", lon: 12.4853, lat: 41.8925, baseFact: "Social and political heart of Rome.", img: "", branches: [{label: "Politics", text: "Site of Senate meetings."}] },
    "Hadrian": { name: "Hadrian's Villa", lon: 12.7739, lat: 41.9427, baseFact: "Imperial retreat at Tivoli.", img: "", branches: [{label: "Design", text: "Private island theater."}] },

    "Parthenon": { name: "The Parthenon", lon: 23.7285, lat: 37.9715, baseFact: "Temple on the Athenian Acropolis.", img: "https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg", branches: [{label: "Democracy", text: "Symbol of Classical Greece."}] },
    "Delphi": { name: "Delphi", lon: 22.5011, lat: 38.4824, baseFact: "The center of the Greek world.", img: "", branches: [{label: "Oracle", text: "Home of the Pythia."}] },
    "Knossos": { name: "Knossos", lon: 25.1622, lat: 35.2979, baseFact: "Minoan palace on Crete.", img: "", branches: [{label: "Myth", text: "Legend of the Minotaur."}] },
    "Olympia": { name: "Olympia", lon: 21.6273, lat: 37.6384, baseFact: "Birthplace of the Olympic Games.", img: "", branches: [{label: "Athletics", text: "First games in 776 BC."}] },
    "Epidaurus": { name: "Epidaurus", lon: 23.0753, lat: 37.5961, baseFact: "Perfectly acoustic ancient theater.", img: "", branches: [{label: "Healing", text: "Sanctuary of Asclepius."}] }
};

function init() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxODFlMDBiNi03YjczLTQ0NTktYTc2NC0zOWZmNmNkMGI1Y2IiLCJpZCI6NDE4Nzk3LCJpYXQiOjE3NzYyOTg3NzB9.NmepN73zX_Q92R-xQGLg7thmoCOcaNT1Szmplv_W7Hc';
    const status = document.getElementById('status-text');
    
    // Safety check for Cesium library
    if (typeof Cesium === 'undefined') {
        status.innerText = "RETRIEVING ENGINE...";
        setTimeout(init, 1000);
        return;
    }

    try {
        viewer = new Cesium.Viewer('map-container', {
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                subdomains: ['a', 'b', 'c']
            }),
            baseLayerPicker: false, geocoder: false, timeline: false, animation: false,
            requestRenderMode: true
        });

        viewer.scene.primitives.add(Cesium.createOsmBuildings());

        // Spawn Entities
        Object.keys(historyData).forEach(key => {
            const site = historyData[key];
            viewer.entities.add({
                id: key,
                position: Cesium.Cartesian3.fromDegrees(site.lon, site.lat, 0),
                point: { color: Cesium.Color.GOLD, pixelSize: 10, outlineWidth: 2 },
                label: { 
                    text: site.name, font: '10pt serif', fillColor: Cesium.Color.GOLD, 
                    pixelOffset: new Cesium.Cartesian2(0, -30), showBackground: true, 
                    backgroundColor: new Cesium.Color(0,0,0,0.7)
                }
            });
        });

        // Click Handler
        viewer.screenSpaceEventHandler.setInputAction((movement) => {
            const picked = viewer.scene.pick(movement.position);
            if (picked && picked.id && historyData[picked.id.id]) {
                currentSiteKey = picked.id.id;
                const site = historyData[currentSiteKey];
                openSidebar(site);
                viewer.camera.flyTo({ 
                    destination: Cesium.Cartesian3.fromDegrees(site.lon, site.lat, 1200), 
                    orientation: { pitch: Cesium.Math.toRadians(-35.0) } 
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        status.innerText = "ONLINE";

    } catch (e) {
        status.innerText = "ENGINE ERROR";
        console.error(e);
    }
}

function flyToRegion(region) {
    const targets = {
        'Egypt': { lon: 31.13, lat: 29.97, alt: 500000 },
        'Italy': { lon: 12.49, lat: 41.89, alt: 500000 },
        'Greece': { lon: 23.72, lat: 37.97, alt: 500000 },
        'Global': { lon: 0, lat: 0, alt: 20000000 }
    };
    const t = targets[region];
    viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(t.lon, t.lat, t.alt) });
}

function openSidebar(site) {
    const messages = document.getElementById('chat-messages');
    document.getElementById('location-name').innerText = site.name;
    messages.innerHTML = `<img src="${site.img}" class="site-image" onerror="this.src='https://via.placeholder.com/300x150/111/gold?text=ARCHIVE+IMAGE'"><p>${site.baseFact}</p><div id="branch-container"></div>`;
    
    site.branches.forEach(branch => {
        const btn = document.createElement('button');
        btn.className = 'branch-btn';
        btn.innerText = branch.label;
        btn.onclick = () => {
            messages.innerHTML += `<p style="color:white; margin-top:10px; border-top: 1px solid #333; padding-top:10px;"><strong>Query:</strong> ${branch.label}</p><p><strong>Guide:</strong> ${branch.text}</p>`;
            messages.scrollTop = messages.scrollHeight;
        };
        document.getElementById('branch-container').appendChild(btn);
    });
    document.getElementById('chat-sidebar').style.right = "0px";
}

function closeSidebar() { document.getElementById('chat-sidebar').style.right = "-400px"; }

function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = document.getElementById('chat-messages');
    if (input.value.trim() !== "") {
        msg.innerHTML += `<p style="color:white; margin-top:10px;"><strong>You:</strong> ${input.value}</p>`;
        msg.scrollTop = msg.scrollHeight;
        input.value = "";
    }
}

window.onload = init;
