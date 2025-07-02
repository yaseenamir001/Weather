const searchBtn = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
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

const iconMap = {
  clouds: "clouds.svg",
  rain: "rain.svg",
  clear: "clear.svg",
  thunderstorm: "thunderstorm.svg",
  drizzle: "drizzle.svg",
  snow: "snow.svg",
  mist: "mist.svg",
};

const apiKey = "d1688022cc8864d10bd3fca0ad3c3d83";

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Enter a city Name");
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => {
      const placeDetail = document.querySelector(".place-detail");

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

      const weatherMain = data.weather[0].main.toLowerCase();
      const icon = iconMap[weatherMain] || "clouds.svg";
      weatherImg.src = `assets/weather/${icon}`;
      placeDetail.style.display = "flex";
    })
    .catch((err) => {
      alert("City not found!");
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
