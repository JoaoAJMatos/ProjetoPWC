import { getUserLongLat, getUserMetric } from "./util.js";

// This class serves as the interface for interacting with the
// application's state stored in the local storage.
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
            if (!this.state.favourites) {
                  this.state.favourites = [];
            }

            // If the user's current search is not set, set it to an empty string
            if (!this.state.currentSearch) {
                  this.state.currentSearch = "";
            }
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
            this.state.favourites.push(cityName);
      }


      // Sets a city as the current search
      // When clicking the "detalhes" button, the current search will be
      // stored in the AppState. Other pages can then access the current
      // search and use it to fetch the weather data for the specified city.
      setSearch(cityName) {
            this.state.currentSearch = cityName;
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
}

export default AppState;