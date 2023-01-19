// This file contains the drivers for managing the search form and the change units button.

import AppState from './state.js';

document.addEventListener('DOMContentLoaded', () => {
      const searchForm = document.getElementById('search-form');
      const searchInput = document.getElementById('search-box');

      const appState = new AppState();

      // Add an event listener to the search form
      searchForm.addEventListener('submit', (event) => {
            if (searchInput.value === '') {
                  alert('Por favor insira o nome da localidade.');
                  return;
            }

            event.preventDefault();
            appState.setSearch(searchInput.value);
            appState.saveState();
      
            // Redirect to the search results page
            window.location.href = '/views/search-res.html';
      });
      
      
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