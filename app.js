/* CHRONO-OS v2.6.2 - Production Build
   Systems Admin Note: Ensure Ion Token is valid for 3D Tileset loading.
*/

let viewer;
let currentSiteKey = "";

// HISTORY MATRIX - Coordinates verified as [Longitude, Latitude]
const historyData = {
    // --- EGYPT ---
    "Giza": { name: "Pyramid of Giza", lon: 31.1342, lat: 29.9792, baseFact: "The Great Pyramid of Khufu.", img: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg", branches: [{label: "Construction", text: "Built from 2.3 million blocks."}, {label: "Age", text: "Completed ~2560 BC."}] },
    "Luxor": { name: "Luxor Temple", lon: 32.6391, lat: 25.6995, baseFact: "Massive East bank Nile temple.", img: "", branches: [{label: "Pharaohs", text: "Built by Amenhotep III and Ramesses II."}] },
    "AbuSimbel": { name: "Abu Simbel", lon: 31.6255, lat: 22.3372, baseFact: "Rock-cut temples of Ramesses II.", img: "", branches: [{label: "Rescue", text: "Relocated in 1968 to avoid the Aswan Dam floods."}] },
    "Karnak": { name: "Karnak Complex", lon: 32.6573, lat: 25.7188, baseFact: "The largest religious complex ever built.", img: "", branches: [{label: "Columns", text: "The Hypostyle Hall contains 134 massive pillars."}] },
    "ValleyKings": { name: "Valley of the Kings", lon: 32.6014, lat: 25.7402, baseFact: "New Kingdom royal burial ground.", img: "", branches: [{label: "Discovery", text: "Site of Tutankhamun's famous tomb (KV62)."}] },

    // --- ITALY ---
    "Colosseum": { name: "The Colosseum", lon: 12.4922, lat: 41.8902, baseFact: "The ultimate Roman arena.", img: "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg", branches: [{label: "Gladiators", text: "Professional fighters for public entertainment."}, {label: "Capacity", text: "Held 50,000 to 80,000 spectators."}] },
    "Pantheon": { name: "The Pantheon", lon: 12.4769, lat: 41.8986, baseFact: "Temple to all the gods.", img: "", branches: [{label: "The Dome", text: "World's largest unreinforced concrete dome."}] },
    "Pompeii": { name: "Pompeii", lon: 14.4848, lat: 40.7489, baseFact: "A city frozen by ash in 79 AD.", img: "", branches: [{label: "Eruption", text: "Vesuvius buried the city in minutes."}] },
    "Forum": { name: "Roman Forum", lon: 12.4853, lat: 41.8925, baseFact: "The social heart of Ancient Rome.", img: "", branches: [{label: "Senate", text: "Center for laws and public trials."}] },
    "Hadrian": { name: "Hadrian's Villa", lon: 12.7739, lat: 41.9427, baseFact: "Imperial retreat at Tivoli.", img: "", branches: [{label: "Design", text: "Modeled after the best architecture in the Empire."}] },

    // --- GREECE ---
    "Parthenon": { name: "The Parthenon", lon: 23.7285, lat: 37.9715, baseFact: "Athenian temple to Athena.", img: "https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg", branches: [{label: "Democracy", text: "Symbol of the birthplace of democracy."}] },
    "Delphi": { name: "Delphi", lon: 22.5011, lat: 38.4824, baseFact: "Home of the famous Oracle.", img: "", branches: [{label: "Center", text: "Considered the navel of the world by Greeks."}] },
    "Knossos": { name: "Knossos", lon: 25.1622, lat: 35.2979, baseFact: "Center of Minoan Crete.", img: "", branches: [{label: "Minotaur", text: "Legendary site of King Minos's Labyrinth."}] },
    "Olympia": { name: "Olympia", lon: 21.6273, lat: 37.6384, baseFact: "Birthplace of the Olympic Games.", img: "", branches: [{label: "Legacy", text: "First recorded games were in 776 BC."}] },
    "Epidaurus": { name: "Epidaurus", lon: 23.0753, lat: 37.5961, baseFact: "Renowned ancient Greek theater.", img: "", branches: [{label: "Acoustics", text: "Famous for perfect sound engineering."}] }
};

/**
 * Initializes the 3D Engine
 */
async function init() {
    const status = document.getElementById('status-text');

    // --- CRITICAL: YOUR TOKEN GOES HERE ---
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxODFlMDBiNi03YjczLTQ0NTktYTc2NC0zOWZmNmNkMGI1Y2IiLCJpZCI6NDE4Nzk3LCJpYXQiOjE3NzYyOTg3NzB9.NmepN73zX_Q92R-xQGLg7thmoCOcaNT1Szmplv_W7Hc';

    try {
        // MODERN IMAGERY SETUP
        const osmProvider = new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        });

        viewer = new Cesium.Viewer('map-container', {
            baseLayer: new Cesium.ImageryLayer(osmProvider),
            baseLayerPicker: false, 
            geocoder: false, 
            timeline: false, 
            animation: false,
            requestRenderMode: true,
            msaaSamples: 1 // Lowering samples for Chromebook GPU performance
        });

        // ASYNC 3D BUILDINGS (Clear deprecation warnings)
        try {
            const buildingTileset = await Cesium.createOsmBuildingsAsync();
            viewer.scene.primitives.add(buildingTileset);
        } catch (tilesetErr) {
            console.log("3D Buildings failed. Check your Token.");
        }

        // DEPLOY CHRONO-POINTS
        Object.keys(historyData).forEach(key => {
            const site = historyData[key];
            viewer.entities.add({
                id: key,
                position: Cesium.Cartesian3.fromDegrees(site.lon, site.lat, 0),
                point: { color: Cesium.Color.GOLD, pixelSize: 10, outlineWidth: 2 },
                label: { 
                    text: site.name, font: '10pt serif', fillColor: Cesium.Color.GOLD, 
                    pixelOffset: new Cesium.Cartesian2(0, -30), showBackground: true, 
                    backgroundColor: new Cesium.Color(0,0,0,0.8)
                }
            });
        });

        // SELECTION HANDLER
        viewer.screenSpaceEventHandler.setInputAction((movement) => {
            const picked = viewer.scene.pick(movement.position);
            if (picked && picked.id && historyData[picked.id.id]) {
                currentSiteKey = picked.id.id;
                const site = historyData[currentSiteKey];
                openSidebar(site);
                
                viewer.camera.flyTo({ 
                    destination: Cesium.Cart
