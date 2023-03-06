// Live time and date

let now = new Date();

console.log(now.getDate());

let liveTime = document.querySelector(".liveTime");

let date = now.getDate();
let hours = now.getHours();

if (hours < 10) {
  hours = `0${hours}`;
}

let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];

liveTime.innerHTML = `${month} ${date}, ${hours}:${minutes}`;

// format day

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// Forecast

function displayForecast(response) {
  console.log(response);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div> 
      <img alt="" src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png"/>
      <div class="weather-forecast-temperatures"> <span class="weather-forecast-temperature-maximum"> ${Math.round(
        forecastDay.temp.max
      )}°</span> <span class="weather-forecast-temperature-minimum"> ${Math.round(
          forecastDay.temp.min
        )}°</span> </div>
    </div>

  </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Forecast coordinates

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "5201594abea9f3e38b70e65b11a80c24";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// current weather search

function currentWeather(response) {
  console.log(response);
  let city = document.querySelector("#cityName");
  let temperature = document.querySelector("#temp");

  celsiusTemperature = response.data.main.temp;

  city.innerHTML = response.data.name;
  temperature.innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  // weather icon

  let iconElement = document.querySelector("#main-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  // api forecast

  getForecast(response.data.coord);
}

// city

function search(city) {
  let apiKey = "5201594abea9f3e38b70e65b11a80c24";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(currentWeather);
}

function submit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  search(city);
}

function searchLocation(position) {
  let apiKey = "5201594abea9f3e38b70e65b11a80c24";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(currentWeather);
}

function CurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

//Celsius and Farenheit conversion

function temperatureCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", temperatureCelsius);

function temperatureFarenheit(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temp");

  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");

  let temperature = temperatureElement.innerHTML;
  temperature = Number(temperature);
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", temperatureFarenheit);

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", submit);

let current = document.querySelector("#exactLocation");
current.addEventListener("click", CurrentLocation);

// search city

search("Athens");

// display forecast