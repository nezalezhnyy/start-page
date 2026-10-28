async function getLinks() {
    const database = await fetch('src/profile.json');
    const data = await database.json();

    const categories = data.categories;

    for (let category in categories) {
        let categoryContainer = document.createElement("div");
        categoryContainer.className = "category_container";

        let categoryTitle = document.createElement("span");
        categoryTitle.innerText = `${category}`;

        let categoryGrid = document.createElement("div");
        categoryGrid.className = "category_grid";

        section_bottom_links.appendChild(categoryContainer);
        categoryContainer.append(categoryTitle, categoryGrid);

        for (let site in categories[category]) {
            let linkContainer = document.createElement("div");
            linkContainer.innerHTML =   `
                                        <a href="${categories[category][site].url}">
                                            ${categories[category][site].svg}
                                            <span>${site}</span>
                                        </a>
                                        `
            categoryGrid.appendChild(linkContainer);
            
        };
    };

    const linksAI = data.toolsAI;

    let toolsAI = document.querySelector(".section_right_bar");

    for (let link in linksAI) {
        let linkContainer = document.createElement("div");
        linkContainer.innerHTML =   `
                                    <a href="${linksAI[link].url}">
                                        ${linksAI[link].svg}
                                        <span>${link}</span>
                                    </a>
                                    `
        toolsAI.appendChild(linkContainer);
    }
}

function currentDate() {
    const current_date_element = document.getElementById('current_date');
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'short' });
    const day = now.getDate();

    current_date_element.textContent = `${month} ${day}`;
}

function loadCoords() {
  try { return JSON.parse(localStorage.getItem("coords")); }
  catch { return null; }
}

function saveCoords(c) {
  try { localStorage.setItem("coords", JSON.stringify(c)); }
  catch { console.warn("Не вдалося зберегти: сховище недоступне"); }
}

window.setCoords = (lat, lon) => {
    lat = parseFloat(lat);
    lon = parseFloat(lon);

    if (isNaN(lat) || isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
        console.error("Некоректні координати. Приклад: setCoords(50.45, 30.52)");
        return;
    }

    saveCoords({ lat, lon });
    console.log(`Збережено: ${lat}, ${lon}`);
    currentWeather({ lat, lon });
};

const coords = loadCoords();
if (coords) {
    currentWeather(coords);
} else {
    document.getElementById('current_weather').textContent = 'set coords';
    console.info("Координат немає. Введи в консолі: setCoords(широта, довгота)");
}

async function currentWeather({ lat, lon }) {
    const current_weather_element = document.getElementById('current_weather');

    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current_weather: 'true'
        });

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const temperature = Math.round(data.current_weather.temperature);

        current_weather_element.textContent = `${temperature} °C`;
    } catch (err) {
        console.error('Weather error:', err);
        current_weather_element.textContent = 'weather n/a';
    }
}

function currentTime() {
    const current_time_element = document.getElementById('current_time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    current_time_element.textContent = `${hours}:${minutes}`;
};



currentTime();
currentDate();
currentWeather();
getLinks();

setInterval(currentTime, 60000);
