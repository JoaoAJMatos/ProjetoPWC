// This file is a mess, but JS is a mess by itself, so I'm not even going to bother

import AppState from './common/state.js';
import WeatherInterface from './common/weatherInterface.js';
import { getMonthName, getMonth, getDayOfMonth, convertKelvinToPreferredUnit } from './common/util.js';

// TODO: Make the 5 day forecast work
// TODO: Refactor all of this mess

const swapForecastRange = (cityName, weatherData, appState) => {
      const forecastRange5days  = document.getElementById('forecast-range-5-days');
      const forecastRange3hours = document.getElementById('forecast-range-3-hours');

      // Swap the active class
      if (forecastRange5days.classList.contains('active')) {
            forecastRange5days.classList.remove('active');
            forecastRange3hours.classList.add('active');

            // Hide the unnecessary cards
            document.getElementById('card3').style.display = 'none';
            document.getElementById('card4').style.display = 'none';

            // Populate the cards with data by hand
            const card0 = document.getElementById('card0');
            const card1 = document.getElementById('card1');
            const card2 = document.getElementById('card2');

            const card0Header = card0.children[0];
            const card1Header = card1.children[0];
            const card2Header = card2.children[0];

            const card0Info = card0.children[1];
            const card1Info = card1.children[1];
            const card2Info = card2.children[1];

            card0Header.innerHTML = 'Agora';
            card1Header.innerHTML = 'Em 3 horas';
            card2Header.innerHTML = 'Em 6 horas';

            weatherData.then(data => {
                  card0Info.innerHTML = `${convertKelvinToPreferredUnit(data.list[0].main.temp, appState)} ${appState.getPreferredUnitSymbol()}`;
                  card1Info.innerHTML = `${convertKelvinToPreferredUnit(data.list[1].main.temp, appState)} ${appState.getPreferredUnitSymbol()}`;
                  card2Info.innerHTML = `${convertKelvinToPreferredUnit(data.list[2].main.temp, appState)} ${appState.getPreferredUnitSymbol()}`;
            });
      }
      else {
            forecastRange3hours.classList.remove('active');
            forecastRange5days.classList.add('active');

            // Show the hidden cards
            document.getElementById('card3').style.display = 'block';
            document.getElementById('card4').style.display = 'block';

            // Populate the cards with data
            populateForecastPage(cityName, weatherData, appState);
      }
}

const populateForecastPage = (cityName, weatherData, appState) => {
      const cityTitle = document.getElementById('city-tittle');
      let   forecastCardHeaders = [];
      let   forecastCardInfo    = [];
      let   currentDay, currentMonth;

      // Get all the card headers and info elements
      for (let i = 0; i < 5; i++) {
            forecastCardHeaders.push(document.getElementById(`card-h${i}`));
            forecastCardInfo.push(document.getElementById(`card-i${i}`));
      }

      // Set the city name
      cityTitle.innerHTML = cityName;

      // Set the card headers
      forecastCardHeaders.forEach((header, index) => {
            currentDay   = getDayOfMonth();
            currentMonth = getMonth();

            header.innerHTML = `${currentDay + index} ${getMonthName(currentMonth)}`;
      });

      // Set the card info
      forecastCardInfo.forEach((info, index) => {
            const weather = weatherData.then(data => data.list[index]);
            const temperature = WeatherInterface.getTemperature(weather);

            temperature.then(temp => {
                  info.innerHTML = `${convertKelvinToPreferredUnit(temp, appState)} ${appState.getPreferredUnitSymbol()}`;
            });
      });
}

document.addEventListener('DOMContentLoaded', () => {
      const appState = new AppState();
      const cityName = appState.state.currentDetails;

      const weatherInterface = new WeatherInterface();
      const data = weatherInterface.getWeatherForecast(cityName);

      const forecastRange5days  = document.getElementById('forecast-range-5-days');
      const forecastRange3hours = document.getElementById('forecast-range-3-hours');

      forecastRange5days.addEventListener('click', () => {
            swapForecastRange(cityName, data, appState);
      });

      forecastRange3hours.addEventListener('click', () => {
            swapForecastRange(cityName, data, appState);
      });

      populateForecastPage(cityName, data, appState);

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