// Create the 'basemap' tile layer using OpenTopoMap
let basemap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", // Fixed the extra single quote
  {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }
);

// Initialize the map with center and zoom
let map = L.map("map", {
  center: [40.7, -94.5], // USA-centered view
  zoom: 5,
  layers: [basemap] // Set the initial base map layer
});

// Define empty layer groups for earthquakes and tectonic plates
let earthquakeLayer = new L.LayerGroup();
let plateLayer = new L.LayerGroup();

// Fetch and display earthquake data
// Store the previous earthquake data
let previousEarthquakeIDs = new Set();

async function getEarthquakeData() {
    let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    try {
        let response = await fetch(url);
        let data = await response.json();
        // console.log("Earthquake Data:", data);

        // Clear previous earthquake data before adding new data
        earthquakeLayer.clearLayers();

        let newEarthquakeCount = 0;
        let currentEarthquakeIDs = new Set();

        // Loop through the new data and check for new earthquakes
        L.geoJson(data, {
            pointToLayer: (feature, latlng) => L.circleMarker(latlng),
            style: styleInfo,
            onEachFeature: (feature, layer) => {
                layer.bindPopup(
                    `<strong>Location:</strong> ${feature.properties.place}<br>
                     <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                     <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
                );

                // Track the earthquake ID
                let earthquakeID = feature.id;
                currentEarthquakeIDs.add(earthquakeID);

                // If this earthquake wasn't in the previous dataset, it's new
                if (!previousEarthquakeIDs.has(earthquakeID)) {
                    newEarthquakeCount++;
                }
            }
        }).addTo(earthquakeLayer);

        earthquakeLayer.addTo(map);

        // Update previous earthquake dataset for next refresh
        previousEarthquakeIDs = currentEarthquakeIDs;

        // ✅ Log new earthquakes in the console
        if (newEarthquakeCount > 0) {
            console.log(`🔴 ${newEarthquakeCount} new earthquake(s) detected!`);
        }

        // ✅ Update the UI box with the new count & latest update time
        document.getElementById("update-time").innerHTML = new Date().toLocaleString();
        document.getElementById("new-earthquake-counter").innerHTML = newEarthquakeCount;

    } catch (error) {
        console.error("Error fetching earthquake data:", error);
    }
}

// Fetch and display tectonic plates
async function getTectonicPlates() {
  let plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  try {
      let response = await fetch(plateUrl);
      let plateData = await response.json();
      // console.log("Tectonic Plate Data:", plateData); // Debugging log

      // Add tectonic plate lines
      // Clear previous tectonic plates before adding new data
plateLayer.clearLayers();

L.geoJson(plateData, {
    color: "yellow",
    weight: 2
}).addTo(plateLayer); // ✅ Add data to the plateLayer group

plateLayer.addTo(map); // ✅ Ensure it's on the map
  } catch (error) {
      console.error("Error fetching tectonic plate data:", error);
  }
}

// Function to return marker style based on magnitude and depth
function styleInfo(feature) {
  return {
      opacity: 1,
      fillOpacity: 0.7,
      fillColor: getColor(feature.geometry.coordinates[2]), // Calls getColor(depth)
      color: "#000000", // Black border
      radius: getRadius(feature.properties.mag), // Calls getRadius(magnitude)
      stroke: true,
      weight: 0.5
  };
}

// Function to determine marker color based on depth
function getColor(depth) {
  return depth > 90 ? "#ff5f65" :
         depth > 70 ? "#fca35d" :
         depth > 50 ? "#fdb72a" :
         depth > 30 ? "#f7db11" :
         depth > 10 ? "#dcf400" :
                      "#a3f600"; // Shallow earthquakes are green
}

// Function to determine marker size based on magnitude
function getRadius(magnitude) {
  return magnitude === 0 ? 1 : magnitude * 4; // Minimum size of 1, scale up
}

// Call functions to fetch data initially
getEarthquakeData();
getTectonicPlates();

// Auto-refresh earthquake and tectonic plate data every 10 minute (600,000 ms)
setInterval(getEarthquakeData, 60000); // Refresh Earthquake Data
setInterval(getTectonicPlates, 60000); // Refresh Tectonic Plates
setInterval(updateLatestTime, 60000); // Update the time display

// Create a legend control object
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  let depthLevels = [-10, 10, 30, 50, 70, 90]; // Depth ranges
  let colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];

  // Add a title for the legend
  div.innerHTML = "<h4>Earthquake Depth (km)</h4>";

  // Loop through depth levels to generate the legend
  for (let i = 0; i < depthLevels.length; i++) {
      div.innerHTML +=
          `<div><i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> 
          ${depthLevels[i]}${depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] : "+"}</div>`;
  }

  return div;
};

// Create a new control for "Latest Update Time"
let updateTime = L.control({ position: "bottomleft" });

updateTime.onAdd = function () {
    let div = L.DomUtil.create("div", "info update-time");
    div.innerHTML = `
        <h5>Latest Update</h5>
        <span id="update-time">Loading...</span>
    `;
    return div;
};

// Add the update time display to the map
updateTime.addTo(map);

// Function to update the "Latest Update Time"
function updateLatestTime() {
    let now = new Date();
    let formattedTime = now.toLocaleString(); // Format as readable date & time
    document.getElementById("update-time").innerHTML = formattedTime;
}

// ✅ Auto-update the time every 10 minutes
setInterval(updateLatestTime, 60000);

// ✅ Store the previous earthquake data persistently

function getEarthquakeData() {
  let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  fetch(url)
      .then(response => response.json())
      .then(data => {
          console.log("🔄 Fetching latest earthquake data...");

          // ✅ Clear previous earthquake data before adding new data
          earthquakeLayer.clearLayers();

          // ✅ Loop through new earthquake data
          L.geoJson(data, {
              pointToLayer: (feature, latlng) => L.circleMarker(latlng),
              style: styleInfo,
              onEachFeature: (feature, layer) => {
                  layer.bindPopup(
                      `<strong>Location:</strong> ${feature.properties.place}<br>
                       <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                       <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
                  );
              }
          }).addTo(earthquakeLayer);

          earthquakeLayer.addTo(map);

          // ✅ Update the "Latest Update Time" only
          document.getElementById("update-time").innerHTML = new Date().toLocaleString();
      })
      .catch(error => {
          console.error("❌ Error fetching earthquake data:", error);
      });
}

// Also call updateLatestTime() every 10 minutes
setInterval(updateLatestTime, 600000);

// Add the legend to the map
legend.addTo(map);

// Add more base maps
let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
});

let satelliteMap = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap France'
});

// Update baseMaps object with correct maps
let baseMaps = {
  "Topographic Map": basemap,
  "Street Map": streetMap,
  "Satellite Map": satelliteMap
};

// Ensure Earthquakes & Tectonic Plates are toggled properly
let overlays = {
  "Earthquakes": earthquakeLayer,
  "Tectonic Plates": plateLayer
};

// Add layer control to the map
L.control.layers(baseMaps, overlays, {
  collapsed: false // Expand by default
}).addTo(map);