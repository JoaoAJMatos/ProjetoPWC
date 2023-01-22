/**
 * @fileoverview This file contains the WeatherInterface class, which can be clasified as a wrapper
 *              for interacting with the OpenWeatherMap API.
 */

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


      // Returns the minimum and maximum temperatures given an incoming 
      // API response
      static getMaxMinTemp(data) {
            return data.then(data => {
                  const maxTemp = data["main"]["temp_max"];
                  const minTemp = data["main"]["temp_min"];

                  return [maxTemp, minTemp];
            });
      }

      // Returns the current temperature given an incoming API response
      static getTemperature(data) {
            return data.then(data => data["main"]["temp"]);
      }

      // Returns the current humidity given an incoming API response
      static getHumidity(data) {
            return data.then(data => data["main"]["humidity"]);
      }

      // Returns the current wind speed and direction given an incoming API response
      static getWindInfo(data) {
            return data.then(data => {
                  const windSpeed = data["wind"]["speed"];
                  const windDirection = data["wind"]["deg"];

                  return [windSpeed, windDirection];
            });
      }

      // Returns the current atmospheric pressure given an incoming API response
      static getAtmosphericPressure(data) {
            return data.then(data => data["main"]["pressure"]);
      }

      // Returns the current cloud coverage given an incoming API response
      static getClouds(data) {
            return data.then(data => data["clouds"]["all"]);
      }

      // Returns the current weather description given an incoming API response
      static getCityCoords(data) {
            return data.then(data => {
                  const lat = data["coord"]["lat"];
                  const long = data["coord"]["lon"];

                  return [lat, long];
            });
      }
}

export default WeatherInterface;