// A dictionary with all the weather states and their corresponding icons
const weatherIcons = {
      '01d': 'cloudy-windy.svg',
      '02d': 'cloudy-night.svg',
      '03d': 'cloudy-sunny.svg',
      'Clouds': 'cloudy.svg',
      'Rain': 'raining.svg',
      '10d': 'snowing.svg',
      'day': 'img/weather_icons/sunny.svg',
      'clear': 'img/weather_icons/sunny.svg',
      'night': 'night.svg',
      '50d': 'thunderstorm.svg'
}

// Only these 3 countries OFFICIALLY use the imperial system
const countriesUsingImperial = ['United States', 'Liberia', 'Myanmar'];


/* ================= TIME UTILITIES ================= */

// Converts a Unix timestamp to a local date
const timestampToDate = (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
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



/* ============== WEATHER UTILITIES ============== */

// Returns the weather icon for a given weather condition
const getWeatherIcon = (weatherAPIResp) => {
      // Get the promise result
      weatherAPIResp = weatherAPIResp.then(data => data);

      const weatherState = weatherAPIResp["weather"];
      const dateTime = weatherAPIResp["dt"];
      const sunset = weatherAPIResp["sys"];

      if (weatherState in weatherIcons)
            return weatherIcons[weatherState];

      if (dateTime > sunset)
            return weatherIcons["night"];

      return weatherIcons["day"];
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


export { timestampToDate, convertFarToCel, convertCelToFar, convertKelvinToCel, convertKelvinToFar, getWeatherIcon, getUserLongLat, getUserCountry, getUserMetric };