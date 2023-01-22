/**
 * @fileoverview This file contains a set of utility functions used by multiple files.
 */

// A dictionary with all the weather states and their corresponding icons
const weatherIcons = {
      'Clouds': 'img/weather_icons/cloudy-sunny.svg',
      'Fog': 'img/weather_icons/cloudy.svg',
      'Rain': 'img/weather_icons/raining.svg',
      'Snow': 'img/weather_icons/snowing.svg',
      'day': 'img/weather_icons/sunny.svg',
      'Clear': 'img/weather_icons/sunny.svg',
      'night': 'img/weather_icons/night.svg',
      'Thunderstorm': 'img/weather_icons/thunderstorm.svg'
};

// Only these 3 countries OFFICIALLY use the imperial system
const countriesUsingImperial = ['United States', 'Liberia', 'Myanmar'];


/* ================= TIME UTILITIES ================= */

// Converts a Unix timestamp to a local date
const timestampToDate = (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
}

// Get the current day of the month
const getDayOfMonth = () => {
      const date = new Date();
      return date.getDate();
}

// Get the current month
const getMonth = () => {
      const date = new Date();
      return date.getMonth();
}

// Get the corresponding name of a given month
const getMonthName = (month) => {
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

      return months[month];
}



/* ============== TEMPERATURE UTILITIES ============== */ 

// Converts a given temperature from Kelvin to Celsius
const convertKelvinToCel = (temp) => {
      return Math.round(temp - 273.15);
}

// Converts a given temperature from Celsius to Kelvin
const convertKelvinToFar = (temp) => {
      return Math.round((temp - 273.15) * (9 / 5) + 32);
}

// Converts a given temperature from Farhenheit to Celsius
const convertFarToCel = (temp) => {
      console.log(temp);
      return Math.round((temp - 32) * (5 / 9));
}

// Converts a given temperature from Celsius to Farhenheit
const convertCelToFar = (temp) => {
      return Math.round((temp * (9 / 5)) + 32);
}

// Converts a given temperature from Kelvin to the preferred unit
const convertKelvinToPreferredUnit = (temp, appState) => {
      const unit = appState.getUnits();

      if (unit === 'metric')
            return convertKelvinToCel(temp);

      return convertKelvinToFar(temp);
}



/* ============== WEATHER UTILITIES ============== */

// Returns the weather icon for a given weather condition
const placeWeatherIcon = (weatherAPIResp, element, isMainPage) => {
      let weatherState, datetime, sunset;

      weatherAPIResp = weatherAPIResp.then(data => {
            datetime = timestampToDate(data["dt"]);
            sunset = timestampToDate(data["sys"]["sunset"]);
            weatherState = data["weather"][0]["main"];

            if (datetime > sunset)
                  isMainPage ? element.src = weatherIcons['night'] : element.src = '../' +  weatherIcons['night'];
            
            if (weatherState !== undefined && weatherState in weatherIcons)
                  isMainPage ? element.src = weatherIcons[weatherState] : element.src = '../' + weatherIcons[weatherState];
            else
                  isMainPage ? element.src = weatherIcons['Clear'] : element.src = '../' + weatherIcons['Clear'];
      });
}


/* ============== GEOLOCATION UTILITIES ============== */

// Returns the user's longitude and latitude
const getUserLongLat = () => {
      return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                  resolve([position.coords.longitude, position.coords.latitude]);
            }, (error) => {
                  reject(error);
            });
      });
}

// Returns the user's country
const getUserCountry = (lat, long) => {
      return new Promise((resolve, reject) => {
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
                  .then(response => response.json())
                  .then(data => {
                        resolve(data.countryName);
                  })
                  .catch(error => reject(error));
      });
}

// Returns the user's preferred metric system based on their location
const getUserMetric = (lat, long) => {
      return new Promise((resolve, reject) => {
            getUserCountry(lat, long)
                  .then(country => {
                        if (countriesUsingImperial.includes(country))
                              resolve('imperial');
                        else
                              resolve('metric');
                  })
                  .catch(error => reject(error));
      });
}



export { 
      timestampToDate, 
      getDayOfMonth, 
      getMonth, 
      getMonthName, 
      convertKelvinToPreferredUnit, 
      convertFarToCel, 
      convertCelToFar, 
      convertKelvinToCel, 
      convertKelvinToFar, 
      placeWeatherIcon, 
      getUserLongLat, 
      getUserCountry, 
      getUserMetric 
};