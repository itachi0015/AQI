script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
<script>
    const apiKey = '--------------------'; // Add your OpenWeatherMap API key here

    // Initialize the map
    const map = L.map('map').setView([18.6400, 74.1000], 9); // Centering on Pune

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);



    //Add WMS layer from GeoServer
    const wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/Geo27/wms', {
        layers: 'Geo27:Pune', // Specify your layer here
        format: 'image/png',
        transparent: true,  
        attribution: "GeoServer"
    }).addTo(map);

     //administrative boundary
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
        const vegetationLayer = L.tileLayer.wms('http://localhost:8080/geoserver/Geo27/wms', {
            layers: 'Geo27:veg', // Change this to your actual Plant Vegetation layer name
            format: 'image/png',
            transparent: true,
            attribution: "Plant Vegetation Layer"
        });



        // Layer control to toggle layers on/off
        const overlayMaps = {
            "Talukas": wmsLayer,
            "Administrative Boundary":adminLayer,
            "Industry": industryLayer,
            "Plant Vegetation": vegetationLayer
        };

        // Add layer control to toggle layers
        L.control.layers(null, overlayMaps).addTo(map);

        // Optionally, add any layer to the map by default
        // industryLayer.addTo(map); // Uncomment this if you want to show the industry layer by default
        // vegetationLayer.addTo(map); // Uncomment this if you want to show the vegetation layer by default


            // Create a home button and add it to the map controls
var homeButton = L.control({position: 'topright'});

homeButton.onAdd = function(map) {
    var button = L.DomUtil.create('a', 'leaflet-bar home-icon');
    button.href = '#';
    button.title = 'Home';
    
    // Set the red home icon for the button
    button.style.backgroundImage = "url('https://img.icons8.com/?size=100&id=80319&format=png&color=000000')"; // Red home icon
    button.style.backgroundSize = '50px 50px'; // Size of the icon
    button.style.width = '50px';  // Button width
    button.style.height = '50px'; // Button height
    button.style.border = 'none'; // Remove border
    
    // When clicked, it resets the map view to the home coordinates
    button.onclick = function() {
        map.setView([18.6400, 74.1000], 9); // Reset to home location (Pune)
        return false; // Prevent page refresh
    };

    return button;
};

homeButton.addTo(map);


    // Dictionary to store district coordinates and AQI data
    const districts = {
        "Pune City": {coords: [18.5204, 73.8567], aqi: 70},
        "Baramati": {coords: [18.151, 74.5764], aqi: 65},
        "Junnar": {coords: [19.2, 73.8753], aqi: 78},
        "Indapur": {coords: [18.113, 75.027], aqi: 80},
        "Daund": {coords: [18.4655, 74.583], aqi: 55},
        "Ambegaon": {coords: [19.03, 73.61], aqi: 90},
        "Khed": {coords: [19.209, 73.854], aqi: 60},
        "Shirur": {coords: [18.8265, 74.38], aqi: 85},
        "Velhe": {coords: [18.2619, 73.6373], aqi: 40},
        "Bhor": {coords: [18.1386, 73.8459], aqi: 75},
        "Mulshi": {coords: [18.5183, 73.4562], aqi: 67},
        "Maval": {coords: [18.7447, 73.6737], aqi: 58},
        "Purandar": {coords: [18.2798, 74.1245], aqi: 85}
    };

    let currentMarker = null;

    // Function to select and display district details
    function selectDistrict(district, aqi) {
        const { coords } = districts[district];
        map.setView(coords, 11);

        addMarker(coords, district, aqi);
        updateAQIInfo(district, aqi);
        highlightSelectedDistrict(district);
        fetchWeather(coords[0], coords[1]); // Fetch weather data for the selected district
    }

   // Function to add a marker with colored circle
function addMarker(coords, district, aqi) {
    if (currentMarker) {
        map.removeLayer(currentMarker); // Remove the previous marker
    }

    // Define the color based on the AQI value
    let markerColor = 'green'; // Default color for good AQI

    if (aqi > 50) {
        markerColor = 'yellow'; // Moderate AQI
    }
    if (aqi > 100) {
        markerColor = 'orange'; // Unhealthy AQI
    }
    if (aqi > 150) {
        markerColor = 'red'; // Very Unhealthy AQI
    }

    // Create a custom div icon with the determined color
    const markerIcon = L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${markerColor}; width: 25px; height: 25px; border-radius: 50%;"></div>`,
        iconSize: [25, 25]  // Size of the circle
    });

    // Add the marker with the custom icon
    currentMarker = L.marker(coords, { icon: markerIcon }).addTo(map);
    currentMarker.bindPopup(`<strong>${district}</strong><br>AQI: ${aqi}`).openPopup();
}

    // Update AQI info in the sidebar
    function updateAQIInfo(district, aqi) {
        const aqiInfo = document.getElementById('aqi-info');
        aqiInfo.innerHTML = `<strong>${district}</strong><br>AQI: ${aqi}`;
    }

    // Update AQI info in the sidebar
function updateAQIInfo(district, aqi) {
    const aqiInfo = document.getElementById('aqi-info');
    aqiInfo.innerHTML = `<strong>${district}</strong><br>AQI Level: ${aqi}<br>Air Quality: ${getAQICategory(aqi)}`;
}

// Function to determine AQI category based on AQI level
function getAQICategory(aqi) {
    if (aqi <= 50) return "Good";
    else if (aqi <= 100) return "Moderate";
    else if (aqi <= 150) return "Unhealthy for Sensitive";
    else if (aqi <= 200) return "Unhealthy";
    else if (aqi <= 300) return "Very Unhealthy";
    else return "Hazardous";
}

    // Highlight selected district in the sidebar
    function highlightSelectedDistrict(district) {
        const listItems = document.querySelectorAll('#left-sidebar li');
        listItems.forEach(item => {
            item.classList.remove('selected');
            if (item.textContent.includes(district)) {
                item.classList.add('selected');
            }
        });
    }

    // Fetch and display weather data for the selected district
    async function fetchWeather(lat, lon) {
        const weatherInfo = document.getElementById('weather-info');
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            const { temp, humidity } = data.main;
            const { speed } = data.wind;
            weatherInfo.innerHTML = `
                <p><span class="bold-large">Temperature:</span> <span class="value-large">${temp}°C</span></p>
                <p><span class="bold-large">Humidity:</span> <span class="value-large">${humidity}%</span></p>
                <p><span class="bold-large">Wind Speed:</span> <span class="value-large">${speed} m/s</span></p>
                 `;
        } catch (error) {
            weatherInfo.innerHTML = '<p>Weather data unavailable</p>';
            console.error("Weather fetch error:", error);
        }
    }

    // Reset map to default view
    function resetMap() {
        map.setView([18.6400, 74.1000], 9);
        if (currentMarker) {
            map.removeLayer(currentMarker); // Remove marker
        }
        document.getElementById('aqi-info').innerHTML = '<p>Select a district from the left sidebar to view AQI details here.</p>';
        document.getElementById('weather-info').innerHTML = '<p>Select a district to view weather details here.</p>';
    }
</script>
