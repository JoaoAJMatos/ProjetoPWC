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


/* ================= TIME UTILITIES ================= */

// Converts a Unix timestamp to a local date
const timestampToDate = (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
}



/* ============== TEMPERATURE UTILITIES ============== */ 

// Converts a given temperature from Farhenheit to Celsius
const convertFarToCel = (temp) => {
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
      console.log(weatherAPIResp);

      const weatherState = weatherAPIResp["weather"];
      const dateTime = weatherAPIResp["dt"];
      const sunset = weatherAPIResp["sys"];

      if (weatherState in weatherIcons)
            return weatherIcons[weatherState];

      if (dateTime > sunset)
            return weatherIcons["night"];

      return weatherIcons["day"];
}

export { timestampToDate, convertFarToCel, convertCelToFar, getWeatherIcon };