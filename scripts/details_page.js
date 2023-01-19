import AppState from './common/state.js';
import WeatherInterface from './common/weather_interface.js';

const populateDetailsPage = (cityName, data) => {
      const tittle = document.getElementById('details-tittle');
      const lat = document.getElementById('lat');
      const lon = document.getElementById('lon');
      const wind = document.getElementById('wind');
      const clouds = document.getElementById('clouds');
      const atmPressure = document.getElementById('atm-pressure');
      const humidity = document.getElementById('humidity');

      tittle.textContent = cityName;

      WeatherInterface.getCityCoords(data).then(coords => {
            lat.textContent = `Lat: ${coords[0]}`;
            lon.textContent = `Lon: ${coords[1]}`;
      });

      WeatherInterface.getWindInfo(data).then(windInfo => {
            wind.textContent = `Vento: ${windInfo[0]} m/s`;
      });

      WeatherInterface.getClouds(data).then(cloudsInfo => {
            clouds.textContent = `Nuvens: ${cloudsInfo}%`;
      });

      WeatherInterface.getAtmosphericPressure(data).then(atmPressureInfo => {
            atmPressure.textContent = `Pressão atmosférica: ${atmPressureInfo} hPa`;
      });

      WeatherInterface.getHumidity(data).then(humidityInfo => {
            humidity.textContent = `Humidade: ${humidityInfo}%`;
      });
};

document.addEventListener('DOMContentLoaded', () => {
      const appState = new AppState();
      const cityName = appState.state.currentSearch;

      const weatherInterface = new WeatherInterface();
      const data = weatherInterface.getWeatherNow(cityName);

      populateDetailsPage(cityName, data);
});