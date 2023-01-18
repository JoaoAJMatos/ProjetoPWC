import AppState from "./common/state.js";
import WeatherInterface from "./common/weather_interface.js";


const populatePage = (appState, weatherInterface) => {

};


document.addEventListener('DOMContentLoaded', () => {
      const appState = new AppState();
      const weatherInterface = new WeatherInterface();
      const favourites = appState.getFavorites();

      const clearFavBtn = document.getElementById("clear-fav-btn");

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

      // If there are no favourites, display the No Favourites template
      if (favourites.length === 0) {
            const favList  = document.getElementById("favourites-list");
            const template = document.getElementById("no-fav-template");

            const clone    = template.content.cloneNode(true);
            favList.appendChild(clone);
            return;
      }

      // If there are, populate the favourites list
      populatePage(appState, weatherInterface);
});
