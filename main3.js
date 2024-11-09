// Initialize the map
const map = L.map('map').setView([18.5204, 73.8567], 9); // Centering on Pune

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Dictionary to store district coordinates and AQI data
const districts = {
    "Pune City": {coords: [18.5204, 73.8567], aqi: 70},
    "Baramati": {coords: [18.151, 74.5764], aqi: 65},
    "Junnar": {coords: [19.2094, 73.8751], aqi: 78},
    "Indapur": {coords: [18.1165, 75.0263], aqi: 80},
    "Daund": {coords: [18.4651, 74.5836], aqi: 55},
    "Ambegaon": {coords: [19.2067, 73.8484], aqi: 90},
    "Khed": {coords: [18.8369, 73.8925], aqi: 60},
    "Shirur": {coords: [18.8265, 74.3777], aqi: 85},
    "Velhe": {coords: [18.2421, 73.5601], aqi: 40},
    "Bhor": {coords: [18.1484, 73.8431], aqi: 75},
    "Mulshi": {coords: [18.5236, 73.4743], aqi: 67},
    "Maval": {coords: [18.6472, 73.6362], aqi: 58},
    "Purandar": {coords: [18.2789, 74.0373], aqi: 85}
};

// Add markers for each district
for (const district in districts) {
    const data = districts[district];
    const marker = L.marker(data.coords).addTo(map)
        .bindPopup(`<b>${district}</b><br>AQI Level: ${data.aqi}`);
}

// Function to handle district selection
function selectDistrict(district, aqi) {
    // Highlight selected district in the left sidebar
    const listItems = document.querySelectorAll("#left-sidebar li");
    listItems.forEach(item => item.classList.remove("selected"));
    event.target.classList.add("selected");

    // Update the AQI info on the right sidebar
    document.getElementById('aqi-info').innerHTML = `<h2>${district}</h2><p>AQI Level: ${aqi}</p>`;

    // Fly to the district location on the map
    const { coords } = districts[district];
    map.flyTo(coords, 12);
}
