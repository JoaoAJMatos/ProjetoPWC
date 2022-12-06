// Wrapper class for interacting with the OpenWeather API
class WeatherInterface {
      constructor(APIID) {
            this.apiKey = APIID || "7b6279bb505f54fde5ebc965e13c43de";
      }

      // Converts a given temperature from Farhenheit to Celsius
      static convertFarToCel(temp) {
            return Math.round((temp - 32) * (5 / 9));
      }

      // Get the current weather for a given city
      getWeatherNow(city) {
            return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`)
                  .then(response => response.json())
                  .then(data => data)
      }

      // Get the weather forecast for a given city
      getWeatherForecast(city) {
            return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}`)
                  .then(response => response.json())
                  .then(data => data)
      }

      // Returns the max and min temperatures for a given city
      getMaxMinTempToday(city) {
            return this.getWeatherNow(city)
                  .then(data => {
                        return {
                              max: data.main.temp_max,
                              min: data.main.temp_min
                        }
                  }
            );
      }
}



// Fetches the weather forecast for a given city
const getWeatherForecastForCity = (cityName) => {
      const url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=7b6279bb505f54fde5ebc965e13c43de`;
      return fetch(url)
      .then(response => response.json())
      .then(data => data.list);
};

// Gets the humidity values for a given forecast
const getHumidity = (forecast) => {
      return forecast.map(item => item.main.humidity);
};


// Get the max and minimum temperatures for a given forecast
const getMaxTemperature = (forecast) => {
      return forecast.map(item => item.main.temp_max);
}

const getMinTemperature = (forecast) => {
      return forecast.map(item => item.main.temp_min);
}

let res = getWeatherForecastForCity('London')
console.log(res)
console.log(process.env.APIID)