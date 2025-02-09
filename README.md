# leaflet-challenge
 🌍 Earthquake & Tectonic Plate Visualization - README 📖

This project is a real-time interactive map built with Leaflet.js, displaying earthquakes from the past 7 days and tectonic plate boundaries. The data is fetched dynamically from the United States Geological Survey (USGS) API and the Tectonic Plate Boundaries dataset.
📌 Features

✔ Real-time Earthquake Updates – Fetches the latest earthquakes every 10 minutes.
✔ Tectonic Plate Boundaries – Displays global tectonic plate data.
✔ Multiple Base Maps – Choose between Topographic, Street, and Satellite maps.
✔ Dynamic Earthquake Markers – Size and color vary based on magnitude and depth.
✔ Legend & Last Update Time – Shows earthquake depth colors and latest update timestamp.
✔ Interactive Popups – Click on an earthquake marker to see location, magnitude, and depth.
✔ Layer Control – Toggle Earthquakes and Tectonic Plates on/off.
🛠️ Technologies Used

    •    📍 Leaflet.js – For interactive map rendering.
    •    📡 USGS Earthquake API – Provides real-time earthquake data.
    •    🌐 GeoJSON – For tectonic plate boundaries visualization.
    •    🖥️ JavaScript (ES6+), HTML, CSS – Frontend technologies.
🔗 Data Sources

    •    🌍 USGS Earthquake Data:
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
    •    🌎 Tectonic Plates Data:
https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json
📦 Project Directory
 ┣ 📜 index.html      # Main HTML file (Map Container)
 ┣ 📜 logic.js        # JavaScript logic (Data Fetching, Leaflet Map)
 ┣ 📜 style.css       # CSS Styles
 ┣ 📜 README.md       # Documentation (This File)
 
