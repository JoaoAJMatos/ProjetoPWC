import AppState from "./common/state.js";
import WeatherInterface from "./common/weather_interface.js";
import { convertKelvinToPreferredUnit, placeWeatherIcon } from './common/util.js';

const populatePage = (appState, weatherInterface) => {
      const favList = document.getElementById("favourites-list");
      const favourites = appState.getFavorites();

      // If there are no favourites, display the No Favourites template
      if (favourites.length === 0) {
            const templateNoFav = document.getElementById("no-fav-template");
            const clone = templateNoFav.content.cloneNode(true);
            favList.appendChild(clone);
            return;
      }

      // If there are favourites:
      // Create a card for each city in the favourites list
      const templateFavCard = document.getElementById("fav-card-template");

      favourites.forEach((city) => {
            // Get the current weather for the city
            const weatherData = weatherInterface.getWeatherNow(city);

            // Clone the template
            const clone = templateFavCard.content.cloneNode(true);

            // Get the elements for the current city card
            const cityCard = clone.querySelector(".card");
            const cityCardTitle = clone.querySelector(".card-title");
            const cityCardIcon = clone.querySelector(".card-img");
            const cityCardTemperature = clone.querySelector(".card-text:nth-child(2)");
            const cityCardHumidity = clone.querySelector(".card-text:nth-child(3)");
            const cityCardWind = clone.querySelector(".card-text:nth-child(4)");

            // Set the city name
            cityCardTitle.textContent = city;

            // Set the weather icon
            placeWeatherIcon(weatherData, cityCardIcon, false);

            // Set the temperature
            WeatherInterface.getTemperature(weatherData).then(temp => {
                  cityCardTemperature.textContent = `Temperatura: ${convertKelvinToPreferredUnit(temp, appState)} ${appState.getPreferredUnitSymbol()}`;
            });

            // Set the humidity
            const humidity = WeatherInterface.getHumidity(weatherData).then(humidity => {
                  cityCardHumidity.textContent = `Humidade: ${humidity}%`;
            });

            // Set the wind speed
            const windSpeed = WeatherInterface.getWindInfo(weatherData).then(windInfo => {
                  cityCardWind.textContent = `Vento: ${windInfo[0]} m/s`;
            });

            // Add the card to the favourites list
            favList.appendChild(clone);

            // If the city has more than one word, replace the spaces with dashes
            // This is necessary because the ID of the button cannot have spaces
            console.log(city);
            let city_ = city;
            if (city.includes(" ")) {
                  city_ = city.replace(/ /g, "-");
                  console.log(city_);
            }

            // Set the ID of the remove button
            const removeBtn_ = document.querySelector(`#btn-rm-fav`);
            removeBtn_.id = `btn-rm-fav-${city_}`;

            // Add the event listener to the remove button
            const removeBtn = document.querySelector(`#btn-rm-fav-${city_}`);
            removeBtn.addEventListener('click', () => {
                  if (confirm(`Tem a certeza que quer apagar ${city} dos favoritos?`)) {
                        appState.removeFavorite(city);
                        appState.saveState();
                        window.location.reload();
                  }
            });
      });
};


document.addEventListener('DOMContentLoaded', () => {
      const appState = new AppState();
      const weatherInterface = new WeatherInterface();

      const clearFavBtn = document.getElementById("clear-fav-btn");
      const favourites = appState.getFavorites();

      // Button to clear all the favourites from the list
      clearFavBtn.addEventListener('click', () => {
            if (favourites.length === 0) {
                  alert("Não existem cidades favoritas");
                  return;
            }

            if (confirm("Tem a certeza que quer apagar todos os favoritos?")) {
                  appState.clearFavorites();
                  appState.saveState();
                  window.location.reload();
            }
      });

      populatePage(appState, weatherInterface);
});
