import WeatherInterface  from './weather_interface.js';
import AppState from './state.js';
import { placeWeatherIcon, convertKelvinToCel } from './util.js';


// A list of some cities which can be randomly selected to appear on the main page
const cityList = ['London', 'New York', 'Paris',
                  'Tokyo', 'Sydney', 'Moscow',
                  'Berlin', 'Rome', 'Madrid',
                  'Dubai', 'Hong Kong', 'Singapore',
                  'Bangkok', 'Beijing', 'Shanghai',
                  'Seoul', 'Mexico City', 'Toronto',
                  'Los Angeles', 'Chicago', 'Miami',
                  'San Francisco', 'Las Vegas', 'Barcelona',
                  'Amsterdam', 'Vienna', 'Prague', 'Budapest', 
                  'Lisbon', 'Athens', 'Dublin', 'Cape Town',
                  'Buenos Aires', 'Rio de Janeiro', 'Sao Paulo',
                  'Cairo', 'Istanbul', 'Rome', 'Milan', 'Bucharest',
                  'Bogota', 'Lima', 'Brisbane', 'Melbourne', 'Perth'
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
      if (appState.getUnits() === 'metric') {
            element.innerHTML = `${convertKelvinToCel(temperature)} °C`;
            return;
      }
      
      element.innerHTML = `${temperature} °F`;
}


const setMinMaxTemperature = (element, appState, maxMin) => {
      if (appState.getUnits() === 'metric') {
            element.innerHTML = `${convertKelvinToCel(maxMin[0])} °C / ${convertKelvinToCel(maxMin[1])} °C`;
            return;
      }

      element.innerHTML = `${maxMin[0]} °F / ${maxMin[1]} °F`;
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
            placeWeatherIcon(weatherData, cityCardIcon);
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

            // Add an event listener to each details button
            document.getElementById(randomCities[i]).addEventListener('click', () => {
                  // Store the city name in the app state
                  appState.setSearch(randomCities[i]);
                  appState.saveState();

                  // Redirect to the details page
                  window.location.href = 'views/details.html';
            });

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
      }
});