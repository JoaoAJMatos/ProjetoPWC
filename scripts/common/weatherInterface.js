// Wrapper class for interacting with the OpenWeather API
class WeatherInterface {
      constructor(APIID) {
            this.apiKey    = APIID || "7b6279bb505f54fde5ebc965e13c43de";
            this.lastError = null;
      }

      // Get the current weather for a given city
      getWeatherNow(city) {
            return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`)
                  .then(response => response.json())
                  .then(data => data)
                  .catch(error => this.lastError = error);
      }

      // Get the weather forecast for a given city
      getWeatherForecast(city) {
            return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}`)
                  .then(response => response.json())
                  .then(data => data)
                  .catch(error => this.lastError = error);
      }

      // Get the weather forecast for the next 5 days given a forecast list
      static getNext5DaysForecast(forecastList) {
            return forecastList.then(forecastList => {
                  const forecast = [];
                  let   day = 0;

                  for (let i = 0; i < forecastList.length; i++) {
                        // If the current forecast is at 12:00 PM
                        if (forecastList[i]["dt_txt"].includes("12:00:00")) {
                              if (day === 5)
                                    break;

                              forecast.push(forecastList[i]);
                              day++;
                        }
                  }

                  return forecast;
            });
      }

      // Get the weather forecast for the next 3 hours given a forecast list
      static getNext3HoursForecast(forecastList) {
            // Return the first 3 elements of the forecast list
            return forecastList.then(forecastList => forecastList.slice(0, 3));
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

      static getWindInfo(data) {
            return data.then(data => {
                  const windSpeed = data["wind"]["speed"];
                  const windDirection = data["wind"]["deg"];

                  return [windSpeed, windDirection];
            });
      }

      static getAtmosphericPressure(data) {
            return data.then(data => data["main"]["pressure"]);
      }

      static getClouds(data) {
            return data.then(data => data["clouds"]["all"]);
      }

      static getCityCoords(data) {
            return data.then(data => {
                  const lat = data["coord"]["lat"];
                  const long = data["coord"]["lon"];

                  return [lat, long];
            });
      }
}

export default WeatherInterface;