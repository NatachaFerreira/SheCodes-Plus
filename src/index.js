function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

  return `${day} ${hours}:${minutes}`;
}

function handleSearch(event) {
  event.preventDefault();
  getLocationBySearch(document.querySelector("#city-input").value);
}

function getLocationBySearch(city) {
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(refreshTempValues);
}

function getCurrentLocation(currentLocation) {
  let apiUrl = `${apiEndpoint}?lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(refreshTempValues);
}

function currentLocationClick(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

function refreshTempValues(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-date-hour").innerHTML = formatDate(response.data.dt * 1000);
  document.querySelector("#current-weather").innerHTML = response.data.weather[0].description;
  document.querySelector("#current-weather-icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#current-weather-icon").setAttribute("alt", `${response.data.weather[0].description}`);
  document.querySelector("#temp").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#min-temperature").innerHTML = "min " + Math.round(response.data.main.temp_min) + "°";
  document.querySelector("#max-temperature").innerHTML = "max " + Math.round(response.data.main.temp_max) + "°";
  document.querySelector("#feels-like").innerHTML = "Feels Like: " + Math.round(response.data.main.feels_like) + "°";
  document.querySelector("#humidity").innerHTML = response.data.main.humidity + " %";
  document.querySelector("#wind-speed").innerHTML = Math.round(response.data.wind.speed) + " m/s";
  
  
}

function refreshTempValuesToFarenheit(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-date-hour").innerHTML = formatDate(response.data.dt * 1000);
  document.querySelector("#current-weather").innerHTML = response.data.weather[0].description;
  document.querySelector("#current-weather-icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#current-weather-icon").setAttribute("alt", `${response.data.weather[0].description}`);
  document.querySelector("#temp").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#min-temperature").innerHTML = "min " + Math.round(response.data.main.temp_min) + "°";
  document.querySelector("#max-temperature").innerHTML = "max " + Math.round(response.data.main.temp_max) + "°";
  document.querySelector("#feels-like").innerHTML = "Feels Like: " + Math.round(response.data.main.feels_like) + "°";
  document.querySelector("#humidity").innerHTML = response.data.main.humidity + " %";
  document.querySelector("#wind-speed").innerHTML = Math.round(response.data.wind.speed) + " mph";
  
 
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let city = document.querySelector("#city").innerHTML;
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  celciusLink.classList.add("active");
  farenheitLink.classList.remove("active");

  axios.get(apiUrl).then(refreshTempValues);
}

function displayFarenheitTemperature(event) {
  event.preventDefault();
  let city = document.querySelector("#city").innerHTML;
  let units = "imperial";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  celciusLink.classList.remove("active");
  farenheitLink.classList.add("active");

  axios.get(apiUrl).then(refreshTempValuesToFarenheit);
}

function displayWeeklyForecast() {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  days.forEach(function(day) {
    forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
            <div class="weather-forecast-date">${day}</div>
            <img src="images/sunny.png" alt="sunny" width="70px"/>
            <div class="weather-forecast-temperatures">
              <span class="weather-forecast-max-temperature">25°</span>
              <span class="weather-forecast-min-temperature">21°</span>
            </div>
          </div>
      `;
  })
  
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;    
}

let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let units = "metric";

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", handleSearch);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", currentLocationClick);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelsiusTemperature);

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", displayFarenheitTemperature);

getLocationBySearch("angra do heroismo");
displayWeeklyForecast();