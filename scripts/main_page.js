import WeatherInterface  from './common/weatherInterface.js';
import AppState from './common/state.js';
import { placeWeatherIcon, convertKelvinToCel, convertKelvinToPreferredUnit } from './common/util.js';

// TODO: use HTML templates instead of creating elements manually

// A list of some cities which can be randomly selected to appear on the main page
const cityList = ['Leiria', 'Lisboa', 'Porto', 'Braga', 'Entroncamento',
                  'Coimbra', 'Faro', 'Viseu', 'Vila Real', 'Viana do Castelo',
                  'Aveiro', 'Setúbal', 'Beja', 'Castelo Branco', 'Guarda',
                  'Portalegre', 'Évora',  'Vila Nova de Famalicão'
];


// Selects a random city from the cityList
const getRandomCity = () => {
      const randIndex = Math.floor(Math.random() * cityList.length);
      return cityList[randIndex];
}


// Gets a list of x random cities
const getRandomCities = (cityCount) => {
      let cities = [];

      for (let i = 0; i < cityCount; i++) {
            let city = getRandomCity();

            // If the city is already in the list, get a new city
            while (cities.includes(city)) {
                  city = getRandomCity();
            }

            cities.push(city);
      }

      return cities;
}


const setTemperature = (element, appState, temperature) => {
      element.innerHTML = `${convertKelvinToPreferredUnit(temperature, appState)} ${appState.getPreferredUnitSymbol()}`;
}


const setMinMaxTemperature = (element, appState, maxMin) => {
      element.innerHTML = `${convertKelvinToPreferredUnit(maxMin[0], appState)} ${appState.getPreferredUnitSymbol()} / ${convertKelvinToPreferredUnit(maxMin[1], appState)} ${appState.getPreferredUnitSymbol()}`;
}


const populateWeatherCards = (cities, weatherInterface, appState) => {
      let index = 0, weatherData;

      cities.forEach(city => {
            // Get the weather data for the current city
            weatherData = weatherInterface.getWeatherNow(city);

            // Get the elements for the current city card
            const cityCard = document.getElementById(`city${index}`);
            const cityCardTitle = cityCard.children[0];
            const cityCardIcon = cityCard.children[1];
            const cityCardTemperature = cityCard.children[2];
            const cityCardMaxMin = cityCard.children[4];

            // Set the city name
            cityCardTitle.innerHTML = city;

            // Set the weather icon
            placeWeatherIcon(weatherData, cityCardIcon, true);
            cityCardIcon.width = 50;
            cityCardIcon.height = 50;

            // Set the temperature
            WeatherInterface.getTemperature(weatherData).then(temperature => {
                  setTemperature(cityCardTemperature, appState, temperature);
            });

            // Set the max and min temperature
            WeatherInterface.getMaxMinTemp(weatherData).then(maxMin => {
                  setMinMaxTemperature(cityCardMaxMin, appState, maxMin);
            });
            
            index++;
      });
}


// Populate the main page weather cards with data from random cities
document.addEventListener('DOMContentLoaded', () => {
      // Get 6 random cities
      const randomCities = getRandomCities(6);

      // Create a new weather interface
      const weatherInterface = new WeatherInterface();

      // Create a new app state which will load app's settings the from local storage
      const appState = new AppState();

      // Populate the weather cards with data from the random cities
      populateWeatherCards(randomCities, weatherInterface, appState);

      // Set the IDs of the details buttons to the city names
      for (let i = 0; i < randomCities.length; i++) {
            document.getElementById(`detalhes${i}`).id = randomCities[i];
            document.getElementById(`fav${i}`).id = `fav_${randomCities[i]}`;
            document.getElementById(`forecast${i}`).id = `forecast_${randomCities[i]}`;

            // Add an event listener to each details button
            document.getElementById(randomCities[i]).addEventListener('click', () => {
                  // Store the city name in the app state
                  appState.setSearch(randomCities[i]);
                  appState.saveState();

                  // Redirect to the details page
                  window.location.href = 'views/details.html';
            });

            // Add an event listener to each Favourite button
            document.getElementById(`fav_${randomCities[i]}`).addEventListener('click', () => {
                  // Add/Remove the city to the favorites list
                  const favs = appState.getFavorites();

                  if (favs.includes(randomCities[i])) {
                        appState.removeFavorite(randomCities[i]);
                        document.getElementById(`fav_${randomCities[i]}`).innerHTML = 'Favorito';
                  } else {
                        appState.setFavorite(randomCities[i]);
                        document.getElementById(`fav_${randomCities[i]}`).innerHTML = 'Anular favorito';
                  }

                  // Save the app state
                  appState.saveState();
            });

            // Add an event listener to each Forecast button
            document.getElementById(`forecast_${randomCities[i]}`).addEventListener('click', () => {
                  // Store the city name in the app state
                  appState.setSearch(randomCities[i]);
                  appState.saveState();

                  // Redirect to the forecast page
                  window.location.href = 'views/forecast.html';
            });
      }

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
