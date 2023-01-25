import { AppState, FORECAST_3_HOURS, FORECAST_5_DAYS } from './common/state.js';
import WeatherInterface from './common/weatherInterface.js';
import { convertKelvinToPreferredUnit, getMonthDayFromTimestamp } from './common/util.js';


// Returns the temperatures for the next 3 hours
const getNext3HourTemps = (data) => {
      let temps = [];

      // The API returns the weather forecast for the next 5 days in the form of 3 hour intervals
      // so to get the max and min temperatures for the next 3 hours, we only need to get the first 3 items
      for (let i = 0; i < 3; i++) temps.push(data.list[i].main.temp);
      return temps;
};


// Returns the index of the first item that is at 00:00:00, indicating the beginning of a new day
// in the API response list
const getIndexOfFirstNewDay = (data) => {
      let index = 0;

      // Get the index of the first item that is at 00:00:00, data is an object
      for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.includes("00:00:00")) {
                  index = i;
                  break;
            }
      }

      return index;
};


// Gets the min and max temperatures for the next 5 days
const getMaxMinTempsFor5Days = (data) => {
      // If the range is 5 days we display the max and min temperatures
      let maxMin     = [];
      let temp_array = [];
      let index      = getIndexOfFirstNewDay(data);

      // The imestamp of the beginning of each day
      let timestamp;    

      for (let i = 0; i < 5; i++) {
            // Get the temperatures for the day
            // There are 8 multiples of 3 in a 24 hour period
            for (let j = index; j < 8 + index - 1; j++) temp_array.push(data.list[j].main.temp);

            // Get the max and min temperatures for the day
            const maxTemp = Math.max(...temp_array);
            const minTemp = Math.min(...temp_array);

            // Add the max and min temperatures to the arrays
            maxMin.push({"max": maxTemp, "min": minTemp, "timestamp": data.list[index].dt});

            // Reset the temp array and increment the index
            temp_array = [];
            index += 8;
      };

      return maxMin;
};


const swapForecastRange = (appState) => {
      const forecastRangeBtn = document.getElementById('btn-forecast-range');

      // Change the button text to reflect the new forecast range
      appState.getPreferredForecastRange() === FORECAST_5_DAYS ? forecastRangeBtn.innerHTML = "3 em 3 horas" 
                                                               : forecastRangeBtn.innerHTML = "5 em 5 dias";

      // Swap the forecast range and refresh the page
      appState.swapForecastRange();
      appState.saveState();
      window.location.reload();
};


// Places 3 forecast template cards in the DOM with the temperatures for the next 3 hours 
const set3HourForecast = (temps, appState) => {
      const forecastContainer = document.getElementById('forecast-cards-container-row-1');
      const forecastCardTemplate = document.getElementById('forecast-card-template');

      for (let i = 0; i < 3; i++) {
            const forecastCard = forecastCardTemplate.content.cloneNode(true);

            // Get the elements from the card
            const cardTitle = forecastCard.querySelector('#card-datetime');
            const cardText  = forecastCard.querySelector('#card-data');

            // Set the card title
            cardTitle.innerHTML = "Em " + (i + 1) * 3 + " horas";

            // Set the card text
            cardText.innerHTML = `${convertKelvinToPreferredUnit(temps[i], appState)} ${appState.getPreferredUnitSymbol()}`;

            // Add the card to the DOM
            forecastContainer.appendChild(forecastCard);
      }
};

// Does the same as set3HourForecast but for the next 5 days
const set5DayForecast = (temps, appState) => {
      const forecastContainer = document.getElementById('forecast-cards-container-row-1');
      const forecastCardTemplate = document.getElementById('forecast-card-template');

      for (let i = 0; i < 5; i++) {
            const forecastCard = forecastCardTemplate.content.cloneNode(true);

            // Get the elements from the card
            const cardTitle = forecastCard.querySelector('#card-datetime');
            const cardText  = forecastCard.querySelector('#card-data');

            // Set the card title
            cardTitle.innerHTML = getMonthDayFromTimestamp(temps[i].timestamp);

            // Set the card text
            cardText.innerHTML = `${convertKelvinToPreferredUnit(temps[i].max, appState)} / ${convertKelvinToPreferredUnit(temps[i].min, appState)} ${appState.getPreferredUnitSymbol()}`;

            // Add the card to the DOM
            forecastContainer.appendChild(forecastCard);
      }
};


const populateForecastPage = (city, data, appState) => {
      const cityName = document.getElementById('city-tittle');
      const preferedForecastRange = appState.getPreferredForecastRange();
      let temps;

      // Set the city name
      cityName.innerHTML = city;

      data.then(data => {
            // If the range is 3 hours we only display the temperatures
            if (preferedForecastRange === FORECAST_3_HOURS) {
                  temps = getNext3HourTemps(data);
                  set3HourForecast(temps, appState);
                  return;
            } 
            
            // If the range is 5 days we display the max and min temperatures for each day
            temps = getMaxMinTempsFor5Days(data);
            set5DayForecast(temps, appState);
      });
};


document.addEventListener('DOMContentLoaded', () => {
      const appState = new AppState();
      const cityName = appState.state.currentDetails;

      const weatherInterface = new WeatherInterface();
      const data = weatherInterface.getWeatherForecast(cityName);

      const forecastRangeBtn = document.getElementById('btn-forecast-range');

      // Set the button text to reflect the current forecast range
      appState.getPreferredForecastRange() === FORECAST_5_DAYS ? forecastRangeBtn.innerHTML = "3 em 3 horas"
                                                               : forecastRangeBtn.innerHTML = "5 em 5 dias";

      // Add an event listener to the button that swaps the forecast range
      forecastRangeBtn.addEventListener('click', () => swapForecastRange(appState));
      
      // Populate the page
      populateForecastPage(cityName, data, appState);
});