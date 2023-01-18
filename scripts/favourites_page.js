import AppState from "./state.js";
import WeatherInterface from "./weather_interface.js";

document.addEventListener('DOMContentLoaded', () => {
      const appState = new AppState();
      const weatherInterface = new WeatherInterface();

      const favourites = appState.getFavorites();

      const clearFavBtn = document.getElementById("clear-fav-btn");

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
});
