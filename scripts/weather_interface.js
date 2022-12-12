// Wrapper class for interacting with the OpenWeather API
class WeatherInterface {
      constructor(APIID) {
            this.apiKey = APIID || "7b6279bb505f54fde5ebc965e13c43de";
      }

      // Get the current weather for a given city
      getWeatherNow(city) {
            return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`)
                  .then(response => response.json())
                  .then(data => data);
      }

      // Get the weather forecast for a given city
      getWeatherForecast(city) {
            return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}`)
                  .then(response => response.json())
                  .then(data => data);
      }

      static getMaxMinTemp(data) {
            return data.then(data => {
                  const maxTemp = data["main"]["temp_max"];
                  const minTemp = data["main"]["temp_min"];

                  return [maxTemp, minTemp];
            });
      }

      static getTemperature(data) {
            return data.then(data => data["main"]["temp"]);
      }

      static getHumidity(data) {
            return data.then(data => data["main"]["humidity"]);
      }
}

export default WeatherInterface;