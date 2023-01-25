/**
 * @fileoverview This file contains the AppState class, which serves as the interface for
 *              interacting with the application's state stored in the local storage.
 */

import { getUserLongLat, getUserMetric } from "./util.js";

const FORECAST_3_HOURS = 0;
const FORECAST_5_DAYS  = 1;

class AppState {
      constructor() {
            this.loadState();
            this.location = getUserLongLat();

            // If the user's metric system is not set, get the prefered metrics system
            // based on the user's location
            if (!this.state.units) {
                  this.location.then(([long, lat]) => {
                        getUserMetric(lat, long).then(metric => {
                              this.state.units = metric;
                              this.saveState();
                        });
                  });
            }

            // If the user's favourites are not set, set them to an empty array
            if (!this.state.favourites) this.state.favourites = [];

            // If the user's current search is not set, set it to an empty string
            if (!this.state.currentSearch) this.state.currentSearch = "";
            if (!this.state.currentDetails) this.state.currentDetails = "";

            // If the user's prefered forecast range is not set, set it to 3 hours (default)
            if (!this.state.forecastRange) this.state.forecastRange = FORECAST_3_HOURS;
      }


      // Loads the state from the local storage
      loadState() {
            this.state = JSON.parse(localStorage.getItem("state")) ?? {};
      }


      // Saves the state to the local storage
      //
      // We must save the state to the local storage after every 
      // "state altering" function call so that the changes
      // are accessible to other AppState instances when they are created
      // on other pages.
      saveState() {
            localStorage.setItem("state", JSON.stringify(this.state));
      }


      // Returns the list of favorite cities
      getFavorites() {
            return this.state.favourites;
      }


      // Add a city to the list of favorites
      setFavorite(cityName) {
            // Dont allow duplicates
            if (this.state.favourites.includes(cityName)) return;
            this.state.favourites.push(cityName);
      }


      // Remove a city from the list of favorites
      removeFavorite(cityName) {
            this.state.favourites = this.state.favourites.filter(city => city !== cityName);
      }


      // Clear the list of favorites
      clearFavorites() {
            this.state.favourites = [];
      }


      // Sets a city as the current search
      // When clicking the "Procurar" button, the current search will be
      // stored in the AppState. Other pages can then access the current
      // search and use it to fetch the weather data for the specified city.
      setSearch(cityName) {
            this.state.currentSearch = cityName;
      }

      // Sets a city as the current object to display in the details page
      // Works as the above, but for the details page
      setDetails(cityName) {
            this.state.currentDetails = cityName;
      }


      // Swap the units between metric and imperial
      swapUnits() {
            if (this.state.units === "metric") {
                  this.state.units = "imperial";
                  return;
            }
            
            this.state.units = "metric";
      }


      // Return the options for the weather units
      getUnits() {
            return this.state.units;
      }


      // Return the symbol for the weather units
      getPreferredUnitSymbol() {
            if (this.state.units === "metric") {
                  return "ºC";
            }

            return "ºF";
      }


      // Swaps the forecast range between 3 hours and 5 days
      swapForecastRange() {
            if (this.state.forecastRange === FORECAST_3_HOURS) {
                  this.state.forecastRange = FORECAST_5_DAYS;
                  return;
            }

            this.state.forecastRange = FORECAST_3_HOURS;
      }


      getPreferredForecastRange() {
            return this.state.forecastRange;
      }
}

export { AppState, FORECAST_3_HOURS, FORECAST_5_DAYS };