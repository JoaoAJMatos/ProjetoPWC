import AppState from './state.js';
import WeatherInterface from './weather_interface.js';
import { getMonthName, getMonth, getDayOfMonth, convertKelvinToPreferredUnit } from './util.js';


const swapForecastRange = () => {
      const forecastRange5days  = document.getElementById('forecast-range-5-days');
      const forecastRange3hours = document.getElementById('forecast-range-3-hours');

      // Swap the active class
      if (forecastRange5days.classList.contains('active')) {
            forecastRange5days.classList.remove('active');
            forecastRange3hours.classList.add('active');

            // Hide the unnecessary cards
            document.getElementById('card3').style.display = 'none';
            document.getElementById('card4').style.display = 'none';
      }
      else {
            forecastRange3hours.classList.remove('active');
            forecastRange5days.classList.add('active');

            // Show the hidden cards
            document.getElementById('card3').style.display = 'block';
            document.getElementById('card4').style.display = 'block';
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
                  info.innerHTML = `${convertKelvinToPreferredUnit(temp, appState)} °C`;
            });
      });
}

document.addEventListener('DOMContentLoaded', () => {
      const appState = new AppState();
      const cityName = appState.state.currentSearch;

      const weatherInterface = new WeatherInterface();
      const data = weatherInterface.getWeatherForecast(cityName);

      const forecastRange5days  = document.getElementById('forecast-range-5-days');
      const forecastRange3hours = document.getElementById('forecast-range-3-hours');

      forecastRange5days.addEventListener('click', () => {
            swapForecastRange();
      });

      forecastRange3hours.addEventListener('click', () => {
            swapForecastRange()
      });

      populateForecastPage(cityName, data, appState);
});