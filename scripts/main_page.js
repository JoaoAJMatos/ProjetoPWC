import WeatherInterface  from './weather_interface.js';
import { getWeatherIcon } from './util.js';

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


const populateWeathercards = (cities, weatherInterface) => {
      let index = 0, weatherData;

      cities.forEach(city => {
            // Get the weather data for the current city
            weatherData = weatherInterface.getWeatherNow(city);

            // Populate the weather card fields
            const cityCard = document.getElementById(`city${index}`);

            // Set the city name
            const cityCardTitle = cityCard.children[0];
            cityCardTitle.innerHTML = city;

            // Set the weather icon
            const cityCardIcon = cityCard.children[1];
            cityCardIcon.src = getWeatherIcon(weatherData);
            cityCardIcon.width = 50;
            cityCardIcon.height = 50;

            // Set the temperature
            const cityCardTemperature = cityCard.children[2];
            WeatherInterface.getTemperature(weatherData).then(temperature => {
                  cityCardTemperature.innerHTML = temperature;
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

      // Populate the weather cards with data from the random cities
      populateWeathercards(randomCities, weatherInterface);
});