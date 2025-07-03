const searchBtn = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const suggestionList = document.querySelector(".suggestions-list");
const dateText = document.querySelector(".date-text");
const countryText = document.querySelector(".country-text");
const temperature = document.querySelector(".temperature");
const condition = document.querySelector(".condition");
const weatherImg = document.querySelector(".weather-clouds");
const humidityValues = document.querySelectorAll(".humidity-value");
const humidityValue = humidityValues[0];
const windSpeed = humidityValues[1];
const placeDetail = document.querySelector(".place-detail");
const forecastContainer = document.querySelector(".forecast-container");
const popup = document.querySelector(".popup-container");
const closePopupBtn = document.querySelector(".close-btn");

const iconMap = {
  clouds: "clouds.svg",
  rain: "rain.svg",
  clear: "clear.svg",
  thunderstorm: "thunderstorm.svg",
  drizzle: "drizzle.svg",
  snow: "snow.svg",
  mist: "mist.svg",
  haze: "mist.svg",
  fog: "mist.svg",
  smoke: "mist.svg",
  dust: "mist.svg",
  sand: "mist.svg",
  ash: "mist.svg",
  squall: "thunderstorm.svg",
  tornado: "thunderstorm.svg",
};

const apiKey = "d1688022cc8864d10bd3fca0ad3c3d83";

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    showPopup("Enter a city Name");
    return;
  }
  selectedCity = city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      const formattedCity =
        city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      countryText.textContent = `${formattedCity}, ${data.sys.country}`;

      const today = new Date();
      dateText.textContent = today.toDateString();

      temperature.textContent = `${Math.round(data.main.temp)} °C`;
      condition.textContent = data.weather[0].main;

      humidityValue.textContent = `${data.main.humidity}%`;
      windSpeed.textContent = `${data.wind.speed} M/s`;

      // const weatherMain = data.weather[0].main.toLowerCase();
      // const icon = iconMap[weatherMain] || "clouds.svg";
      // weatherImg.src = `assets/weather/${icon}`;
      const iconCode = data.weather[0].icon;
      weatherImg.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
      placeDetail.style.display = "flex";
    })
    .catch((err) => {
      showPopup("City not found!");
    });

  fetch(forecastUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Forecast fetch failed");
      return res.json();
    })
    .then((forecastData) => {
      forecastContainer.innerHTML = "";

      const uniqueDates = [];

      forecastData.list.forEach((item) => {
        const date = new Date(item.dt_txt).toDateString();

        if (!uniqueDates.includes(date) && uniqueDates.length < 7) {
          uniqueDates.push(date);

          const weatherMain = item.weather[0].main.toLowerCase();
          const icon = iconMap[weatherMain] || "clouds.svg";
          const temp = Math.round(item.main.temp);

          const forecastItem = document.createElement("div");
          forecastItem.classList.add("forecast-item");

          forecastItem.innerHTML = `
            <h5 class="date-text-1">${date.slice(4, 10)}</h5>
            <img src="assets/weather/${icon}" class="forecast-item-img" />
            <h5 class="forecast-item-temp">${temp} °C</h5>
          `;

          forecastContainer.appendChild(forecastItem);
        }
      });
    })
    .catch((err) => {
      console.log("Forecast error:", err.message);
    });
});
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    selectedCity = cityInput.value.trim();
    searchBtn.click();
    suggestionList.innerHTML = "";
  }
});

cityInput.addEventListener("input", () => {
  const suggest = cityInput.value.trim();
  if (suggest.length >= 2) {
    fetchSuggestions(suggest);
  } else {
    suggestionList.innerHTML = "";
  }
});

function fetchSuggestions(suggest) {
  if (suggest.toLowerCase() === selectedCity.toLowerCase()) {
    suggestionList.innerHTML = "";
    return;
  }

  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${suggest}&limit=5&appid=d1688022cc8864d10bd3fca0ad3c3d83`;

  fetch(geoURL)
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter((city) =>
        city.name.toLowerCase().includes(suggest.toLowerCase())
      );
      showSuggestions(filtered);
    })
    .catch((err) => {
      console.error("Error fetching suggestions", err);
    });
}
let selectedCity = "";

function showSuggestions(cities) {
  suggestionList.innerHTML = "";

  cities.forEach((city) => {
    const listItem = document.createElement("div");
    listItem.textContent = `${city.name}, ${city.country}`;
    listItem.classList.add("suggestion-item");

    listItem.addEventListener("click", () => {
      selectedCity = city.name;
      cityInput.value = city.name;
      suggestionList.innerHTML = "";
      searchBtn.click();
    });
    suggestionList.appendChild(listItem);
  });
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-container")) {
    suggestionList.innerHTML = "";

    if (selectedCity) {
      cityInput.value = selectedCity;
    }
  }
});

function showPopup(message) {
  const popupMessage = document.querySelector(".popup-message");
  popupMessage.textContent = message;
  popup.classList.add("show");
  suggestionList.innerHTML = "";
  cityInput.blur();
}

function closePopup() {
  popup.classList.remove("show");
}
closePopupBtn.addEventListener("click", closePopup);
popup.addEventListener("click", (e) => {
  if (e.target === popup) closePopup();
});
