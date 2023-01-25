import WeatherInterface  from './common/weatherInterface.js';
import AppState from './common/state.js';
import { placeWeatherIcon, convertKelvinToPreferredUnit } from './common/util.js';


// A list of some cities which can be randomly selected to appear on the main page
const cityList = ['Dubai', 'Toronto', 'Madrid', 'Lisbon', 'Rio de Janeiro',
                  'Porto', 'Leeds', 'Manchester', 'Barcelona', 'Sao Paulo',
                  'Luanda', 'Cairo', 'Entroncamento', 'Leiria', 'Coimbra',
                  'Paris', 'Berlin',  'Munich'
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


// Places the weather card templates on the main page
const placeWeatherCards = (cities, weatherInterface, appState) => {
      const template = document.getElementById('template-weather-card');
      let   container = document.getElementById('weather-cards-first-half');

      let index = 0, weatherData;

      cities.forEach(city => {
            // Get the weather data for the current city
            weatherData = weatherInterface.getWeatherNow(city);

            // Create a new weather card
            const weatherCard = document.importNode(template.content, true);

            // Get the elements for the current city card
            const cityCard = weatherCard.getElementById(`city`);
            const cityCardTitle = cityCard.children[0];
            const cityCardIcon = cityCard.children[1];
            const cityCardTemperature = cityCard.children[2];
            const cityCardMaxMin = cityCard.children[4];

            // Set the city name and the id of the card
            cityCardTitle.innerHTML = city;
            cityCard.id = `${city}`;

            // Set the weather icon
            placeWeatherIcon(weatherData, cityCardIcon, true);
            cityCardIcon.width = 50;
            cityCardIcon.height = 50;

            // Set the temperature
            WeatherInterface.getTemperature(weatherData).then(temperature => {
                  cityCardTemperature.innerHTML = `${convertKelvinToPreferredUnit(temperature, appState)} ${appState.getPreferredUnitSymbol()}`;
            });

            // Set the max and min temperature
            WeatherInterface.getMaxMinTemp(weatherData).then(maxMin => {
                  cityCardMaxMin.innerHTML = `${convertKelvinToPreferredUnit(maxMin[0], appState)} ${appState.getPreferredUnitSymbol()} / ${convertKelvinToPreferredUnit(maxMin[1], appState)} ${appState.getPreferredUnitSymbol()}`;
            });

            // Append the weather card to the container
            // If the index is less than 3, append to the first container
            // Otherwise, append to the second container
            if (index < 3) {
                  container.appendChild(weatherCard);
            } else {
                  container = document.getElementById('weather-cards-second-half');
                  container.appendChild(weatherCard);
            }

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
      //populateWeatherCards(randomCities, weatherInterface, appState);
      placeWeatherCards(randomCities, weatherInterface, appState);

      // Set the IDs of the details buttons to the city names
      /*
      for (let i = 0; i < randomCities.length; i++) {
            document.getElementById(`detalhes${i}`).id = randomCities[i];
            document.getElementById(`fav${i}`).id = `fav_${randomCities[i]}`;
            document.getElementById(`forecast${i}`).id = `forecast_${randomCities[i]}`;

            // Add an event listener to each details button
            document.getElementById(randomCities[i]).addEventListener('click', () => {
                  // Store the city name in the app state
                  appState.setDetails(randomCities[i]);
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
                  appState.setDetails(randomCities[i]);
                  appState.saveState();

                  // Redirect to the forecast page
                  window.location.href = 'views/forecast.html';
            });
      }*/
});
