import WeatherInterface  from './common/weatherInterface.js';
import { AppState } from './common/state.js';
import { placeWeatherIcon, convertKelvinToPreferredUnit, getFormattedDate } from './common/util.js';


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

// Sets the event listeners for a weather card for a given city
const setCardEventListeners = (appState, city, displayedCities) => {
      // Get the buttons for the current city card
      const btnDetails   = document.getElementById(`btn-details-${city}`);
      const btnFavourite = document.getElementById(`btn-fav-${city}`);
      const btnForecast  = document.getElementById(`btn-forecast-${city}`);

      // Add an event listener to the details button
      btnDetails.addEventListener('click', () => {
            appState.setSearch(city);
            appState.saveState();

            window.location.href = '/views/searchResult.html';
      });

      // Add an event listener to the forecast button
      btnForecast.addEventListener('click', () => {
            appState.setDetails(city);
            appState.saveState();

            window.location.href = '/views/forecast.html';
      });

      // Add an event listener to the favourite button
      btnFavourite.addEventListener('click', () => {
            const favs = appState.getFavorites();

            if (favs.includes(city)) {
                  // Remove the city from the favourites
                  btnFavourite.innerHTML = '🤍';
                  appState.removeFavorite(city);
            } else {
                  // Add the city to the favourites
                  appState.setFavorite(city);
                  btnFavourite.innerHTML = '❤️';
            }

            // Save the app state
            appState.saveState();
      });
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

            // TODO: This is a very hacky way of doing this. Should probably be changed later
            const datetime = cityCard.children[0];
            const cityCardTitle = cityCard.children[1];
            const cityCardIcon = cityCard.children[2];
            const cityCardTemperature = cityCard.children[3];
            const cityCardMaxMin = cityCard.children[4];

            // Set the date and time (just to use the date fromat in the project extras lol)
            weatherData.then(data => {
                  datetime.innerHTML = getFormattedDate(data.dt + data.timezone);
            });

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

            // Get the buttons for the current city card
            const btnDetails   = document.getElementById('btn-details');
            const btnFavourite = document.getElementById('btn-fav');
            const btnForecast  = document.getElementById('btn-forecast');
      
            // Change the buttons IDs
            btnDetails.id   = `btn-details-${city}`;
            btnFavourite.id = `btn-fav-${city}`;
            btnForecast.id  = `btn-forecast-${city}`;

            // Set the event listeners for the current weather card
            setCardEventListeners(appState, city, cities);

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
});
