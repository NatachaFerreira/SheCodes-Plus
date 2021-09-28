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
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  
  let hours = date.getHours();
  let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

  return `${day}, ${date.getDate()} ${month} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  return days[day];
}

function formatHour(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function handleSearch(event) {
  event.preventDefault();
  getLocationBySearch(document.querySelector("#city-input").value);
}

function getForecast(lat, lon) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(hourlyForecast);

  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={minutely}&exclude={alerts}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(weeklyForecast);

}

function getLocationBySearch(city) {
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(refreshTempValues);
}

function getCurrentLocation(currentLocation) {
  let apiUrl = `${apiEndpoint}?lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(refreshTempValues);
  getForecast(currentLocation.coords.latitude, currentLocation.coords.longitude);
}

function currentLocationClick(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

function refreshTempValues(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-date-hour").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document.querySelector("#current-weather").innerHTML =
    response.data.weather[0].description;
  document
    .querySelector("#current-weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#current-weather-icon")
    .setAttribute("alt", `${response.data.weather[0].description}`);
  document.querySelector("#temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#min-temperature").innerHTML =
    "min " + Math.round(response.data.main.temp_min) + "°";
  document.querySelector("#max-temperature").innerHTML =
    "max " + Math.round(response.data.main.temp_max) + "°";
  document.querySelector("#feels-like").innerHTML =
    "Feels Like: " + Math.round(response.data.main.feels_like) + "°";
  document.querySelector("#humidity").innerHTML =
    "Humidity: " + response.data.main.humidity + " %";
  document.querySelector("#wind-speed").innerHTML =
    "Wind: " + Math.round(3.6 * response.data.wind.speed) + " km/h";

  getForecast(response.data.coord.lat, response.data.coord.lon);
}

function refreshTempValuesToFarenheit(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-date-hour").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document.querySelector("#current-weather").innerHTML =
    response.data.weather[0].description;
  document
    .querySelector("#current-weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#current-weather-icon")
    .setAttribute("alt", `${response.data.weather[0].description}`);
  document.querySelector("#temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#min-temperature").innerHTML =
    "min " + Math.round(response.data.main.temp_min) + "°";
  document.querySelector("#max-temperature").innerHTML =
    "max " + Math.round(response.data.main.temp_max) + "°";
  document.querySelector("#feels-like").innerHTML =
    "Feels Like: " + Math.round(response.data.main.feels_like) + "°";
  document.querySelector("#humidity").innerHTML =
    response.data.main.humidity + " %";
  document.querySelector("#wind-speed").innerHTML =
    Math.round(3.6 * response.data.wind.speed) + " mph";
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

  farenheitLink.classList.add("active");
  celciusLink.classList.remove("active");

  axios.get(apiUrl).then(refreshTempValuesToFarenheit);
}

function hourlyForecast(response) {
  console.log(response)
  let forecast = response.data.list;
  let forecastElement = document.querySelector("#forecast-hourly");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
            <div class="weather-forecast-date">${formatHour(forecastDay.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="${forecastDay.weather[0].description}" width="90px"/>
            <div class="weather-forecast-temperatures">
              <span class="weather-forecast-max-temperature">${Math.round(forecastDay.main.temp_max)}°</span>
              <span class="weather-forecast-min-temperature">${Math.round(forecastDay.main.temp_min)}°</span>
            </div>
          </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function weeklyForecast(response) {

  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast-weekly");
  
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if(index < 6) {
    forecastHTML =
      forecastHTML +
      `
          <div class="col-2">
            <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="${forecastDay.weather[0].description}" width="90px"/>
            <div class="weather-forecast-temperatures">
              <span class="weather-forecast-max-temperature">${Math.round(forecastDay.temp.max)}°</span>
              <span class="weather-forecast-min-temperature">${Math.round(forecastDay.temp.min)}°</span>
            </div>
          </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayHourlyForecast(event){
  event.preventDefault();
  let hourlyForecast = document.querySelector("#forecast-hourly");
  let weeklyForecast = document.querySelector("#forecast-weekly");

  hourlyForecast.classList.remove("hidden");
  weeklyForecast.classList.add("hidden");

}

function displayWeeklyForecast(event){
  event.preventDefault();
  let hourlyForecast = document.querySelector("#forecast-hourly");
  let weeklyForecast = document.querySelector("#forecast-weekly");

  weeklyForecast.classList.remove("hidden");
  hourlyForecast.classList.add("hidden");
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

let hourlyButton = document.querySelector("#hourly-button");
hourlyButton.addEventListener("click", displayHourlyForecast);

let weeklyButton = document.querySelector("#weekly-button");
weeklyButton.addEventListener("click", displayWeeklyForecast);

getLocationBySearch("angra do heroismo");

