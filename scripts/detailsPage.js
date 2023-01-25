import { AppState } from './common/state.js';
import WeatherInterface from './common/weatherInterface.js';

const populateDetailsPage = (cityName, data) => {
      const tittle = document.getElementById('details-tittle');
      const lat = document.getElementById('lat');
      const lon = document.getElementById('lon');
      const wind = document.getElementById('wind');
      const clouds = document.getElementById('clouds');
      const atmPressure = document.getElementById('atm-pressure');
      const humidity = document.getElementById('humidity');

      // Set the city name
      tittle.textContent = cityName;

      // Set the latitude and longitude
      WeatherInterface.getCityCoords(data).then(coords => {
            lat.textContent = `Lat: ${coords[0]}`;
            lon.textContent = `Lon: ${coords[1]}`;
      });

      // Set the wind speed
      WeatherInterface.getWindInfo(data).then(windInfo => {
            wind.textContent = `Vento: ${windInfo[0]} m/s`;
      });

      // Set the clouds percentage
      WeatherInterface.getClouds(data).then(cloudsInfo => {
            clouds.textContent = `Nuvens: ${cloudsInfo}%`;
      });

      // Set the atmospheric pressure
      WeatherInterface.getAtmosphericPressure(data).then(atmPressureInfo => {
            atmPressure.textContent = `Pressão atmosférica: ${atmPressureInfo} hPa`;
      });

      // Set the humidity percentage
      WeatherInterface.getHumidity(data).then(humidityInfo => {
            humidity.textContent = `Humidade: ${humidityInfo}%`;
      });
};

document.addEventListener('DOMContentLoaded', () => {
      const appState = new AppState();
      const cityName = appState.state.currentDetails;

      const weatherInterface = new WeatherInterface();
      const data = weatherInterface.getWeatherNow(cityName);

      populateDetailsPage(cityName, data);
});