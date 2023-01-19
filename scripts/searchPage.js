import AppState from "./common/state.js";
import WeatherInterface from "./common/weatherInterface.js";
import { convertKelvinToPreferredUnit } from './common/util.js';

document.addEventListener("DOMContentLoaded", () => {
      const appState = new AppState();
      const weatherInterface = new WeatherInterface();

      const cityToSearch = appState.state.currentSearch;
      const data = weatherInterface.getWeatherNow(cityToSearch);

      data.then((response) => {
            if (response.cod === 200) {
                  // Show the search-result-template-success template inside the search-content div
                  const searchContent = document.getElementById("search-content");
                  const searchResultTemplateSuccess = document.getElementById("search-result-template-success");
                  searchContent.innerHTML = searchResultTemplateSuccess.innerHTML;

                  // Set the city name
                  const cityName = document.getElementById("details-tittle");
                  cityName.innerHTML = response.name;

                  // Set the latitude
                  const lat = document.getElementById("lat");
                  lat.innerHTML = `Latitude: ${response.coord.lat}`;

                  // Set the longitude
                  const lon = document.getElementById("lon");
                  lon.innerHTML = `Longitude: ${response.coord.lon}`;

                  // Set the temperature
                  const temp = document.getElementById("temp");
                  temp.innerHTML = `Temperatura: ${convertKelvinToPreferredUnit(response.main.temp, appState)} ${appState.getPreferredUnitSymbol()}`;

                  // Set the minimum temperature
                  const tempMin = document.getElementById("temp-min");
                  tempMin.innerHTML = `Temperatura mínima: ${convertKelvinToPreferredUnit(response.main.temp_min, appState)} ${appState.getPreferredUnitSymbol()}`;

                  // Set the maximum temperature
                  const tempMax = document.getElementById("temp-max");
                  tempMax.innerHTML = `Temperatura máxima: ${convertKelvinToPreferredUnit(response.main.temp_max, appState)} ${appState.getPreferredUnitSymbol()}`;

                  // Set the weather icon
                  const weatherIcon = document.getElementById("weather-icon");
                  weatherIcon.src = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;

                  if (appState.getFavorites().includes(response.name)) {
                        document.getElementById("fav").innerHTML = "Remover dos favoritos";
                  }

                  // Append the search-result-template-success template to the search-content div
                  searchContent.appendChild(searchResultTemplateSuccess);

                  // Set the details button to redirect to the details page
                  document.getElementById("details").addEventListener("click", () => {
                        appState.setDetails(response.name);
                        appState.saveState();
                        window.location.href = "details.html";
                  });

                  // Set the forecast button to redirect to the forecast page
                  document.getElementById("forecast").addEventListener("click", () => {
                        appState.setDetails(response.name);
                        appState.saveState();
                        window.location.href = "forecast.html";
                  });
                  
                  // Set the favorite button to add the city to the favorites list
                  document.getElementById("fav").addEventListener("click", () => {
                        const favourites = appState.getFavorites();

                        // If the city is already in the favorites list, remove it
                        if (favourites.includes(response.name)) {
                              appState.removeFavorite(response.name);
                              appState.saveState();
                              document.getElementById("fav").innerHTML = "Adicionar aos favoritos";
                        } else {
                              appState.setFavorite(response.name);
                              appState.saveState();
                              document.getElementById("fav").innerHTML = "Remover dos favoritos";
                        }
                  });
            }
            else {
                  // Show the search-result-template-failure template inside the search-content div
                  const searchContent = document.getElementById("search-content");
                  const searchResultTemplateFailure = document.getElementById("search-result-template-failure");
                  searchContent.innerHTML = searchResultTemplateFailure.innerHTML;

                  // Set the city name
                  const cityNotFound = document.getElementById("message");
                  cityNotFound.innerHTML = `Não foi possivel encontrar a cidade requisitada "${cityToSearch}".`;

                  // Append the search-result-template-failure template to the search-content div
                  searchContent.appendChild(searchResultTemplateFailure);
            }
      });
});