"use strict";

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentLocation = document.getElementById("location");
const todayWeatherEl = document.getElementById("current-weather");
const currentTempEl = document.getElementById("current-temp");
const otherCurrentsEl = document.getElementById("other-currents");
const weatherForecastEl = document.getElementById("weather-forecast");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "35e42fd6d2cc72503848c57f19a86792";

// Time and Date
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  let hour = time.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert 0 to 12
  const minutes = time.getMinutes();

  timeEl.innerHTML = hour + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm;

  dateEl.innerHTML = days[day] + ", " + months[month] + " " + date;
}, 1000);

// Coordinates/Location
getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  currentLocation.innerHTML = " Current Location";

  let weatherForecast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      todayWeatherEl.innerHTML = `
        <div class="today">
          <div class="day">Today</div>
          <img
          src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png"
          alt="weather icon"
          class="w-icon">
          <div class="temp">High: ${Math.round(day.temp.max)}°F</div>
          <div class="temp">Low: ${Math.round(day.temp.min)}°F</div>
          <div class="other-currents">
            <div>Humidity: ${humidity}%</div>
          </div>
          <div class="other-currents">
            <div>Pressure: ${pressure}</div>
          </div>
          <div class="other-currents">
            <div>Wind Speed: ${Math.round(wind_speed)} mph</div>
          </div>
          <div class="other-currents" id="sunrise-sunset">
            <div class="other-currents">
              <div>Sunrise: ${moment.unix(sunrise).format("h:mm A")}</div>
            </div>
            <div class="other-currents">
              <div>Sunset: ${moment.unix(sunset).format("h:mm A")}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      weatherForecast += `
        <div class="weather-forecast-item">
          <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <img
          src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png"
          alt="weather icon"
          class="w-icon">
          <div class="temp">High: ${Math.round(day.temp.max)}°F</div>
          <div class="temp">Low: ${Math.round(day.temp.min)}°F</div>
        </div>
      `;
    }
  });

  weatherForecastEl.innerHTML = weatherForecast;
}
