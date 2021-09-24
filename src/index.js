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
  let city = document.querySelector("#city-input").value;
  getLocationBySearch(city);
}

function getLocationBySearch(city) {
  let units = "metric";
  let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(refreshTempValues);
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", handleSearch);

function getCurrentLocation(currentLocation) {
  let units = "metric";
  let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(refreshTempValues);
}

function currentLocationClick(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", currentLocationClick);

function refreshTempValues(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-weather").innerHTML = response.data.weather[0].description;
  document.querySelector("#temp").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#min-temperature").innerHTML = "min " + Math.round(response.data.main.temp_min) + "°";
  document.querySelector("#max-temperature").innerHTML = "max " + Math.round(response.data.main.temp_max) + "°";
  document.querySelector("#feels-like").innerHTML = "Feels Like: " + Math.round(response.data.main.feels_like) + "°";
  document.querySelector("#humidity").innerHTML = response.data.main.humidity + " %";
  document.querySelector("#wind-speed").innerHTML = Math.round(response.data.wind.speed) + " m/s";
  document.querySelector("#current-day-hour").innerHTML = formatDate(response.data.dt * 1000);
}

function refreshTempValuesToFarenheit(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-weather").innerHTML = response.data.weather[0].description;
  document.querySelector("#temp").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#min-temperature").innerHTML = "min " + Math.round(response.data.main.temp_min) + "°";
  document.querySelector("#max-temperature").innerHTML = "max " + Math.round(response.data.main.temp_max) + "°";
  document.querySelector("#feels-like").innerHTML = "Feels Like: " + Math.round(response.data.main.feels_like) + "°";
  document.querySelector("#humidity").innerHTML = response.data.main.humidity + " %";
  document.querySelector("#wind-speed").innerHTML = Math.round(response.data.wind.speed) + " mph";
  document.querySelector("#current-day-hour").innerHTML = formatDate(response.data.dt * 1000);
}

function toCelsius(event) {
  event.preventDefault();
  let city = document.querySelector("#city").innerHTML;
  let units = "metric";
  let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(refreshTempValues);
}

let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", toCelsius);

function toFarenheit(event) {
  event.preventDefault();
  let city = document.querySelector("#city").innerHTML;
  let units = "imperial";
  let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(refreshTempValuesToFarenheit);
}

let farenheit = document.querySelector("#farenheit");
farenheit.addEventListener("click", toFarenheit);

getLocationBySearch("angra do heroismo");
