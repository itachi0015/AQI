const apiKey = '81416dd6c2425ae4865f21aa138b5f65'; // Add your OpenWeatherMap API key here

// Initialize the map
const map = L.map('map').setView([18.6400, 74.1000], 9); // Centering on Pune

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add WMS layer from GeoServer
const wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/Geo27/wms', {
    layers: 'Geo27:Pune', // Specify your layer here
    format: 'image/png',
    transparent: true,
    attribution: "GeoServer"
}).addTo(map);

// Administrative boundary
const adminLayer = L.tileLayer.wms('http://localhost:8080/geoserver/Geo27/wms',{
    layers: 'Geo27:Pune Dissolve',
    format: 'image/png',
    transparent: true,
    attribution: 'Administrative Boundary Layer',
    zIndex: 1 
});

// Additional WMS layer for Industry
const industryLayer = L.tileLayer.wms('http://localhost:8080/geoserver/Geo27/wms', {
    layers: 'Geo27:industry', // Change this to your actual Industry layer name
    format: 'image/png',
    transparent: true,
    attribution: "Industry Layer"
});

// Additional WMS layer for Plant Vegetation
const vegetationLayer = L.tileLayer.wms('http://localhost:8080/geoserver/...', {
    layers: 'Geo27:vegetation', // Update this to your vegetation layer
    format: 'image/png',
    transparent: true,
    attribution: "Vegetation Layer"
});

// Function to select district for AQI display
function selectDistrict(districtName, aqiValue) {
    document.getElementById('aqi-info').innerHTML = `<p><strong>${districtName}</strong>: AQI is ${aqiValue}</p>`;
    // Additional weather data can be fetched here
}

// Function to reset the map zoom level
function resetMap() {
    map.setView([18.6400, 74.1000], 9); // Reset the view to Pune center
}
