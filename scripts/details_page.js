import AppState from './common/state.js';
import WeatherInterface from './common/weatherInterface.js';

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

      // Set the change Units button text
      const btnChangeMetric = document.getElementById('btn-change-metric');
      if (appState.getUnits() === 'metric') {
            btnChangeMetric.innerHTML = '°F';
      } else {
            btnChangeMetric.innerHTML = '°C';
      }

      // Add an event listener to the change units button
      btnChangeMetric.addEventListener('click', () => {
            // Change the units
            appState.swapUnits();
            appState.saveState();

            // Reload the page
            window.location.reload();
      });
});