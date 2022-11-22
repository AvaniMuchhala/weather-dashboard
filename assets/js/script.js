var APIKey = "d824f67db78129ee90e5a459c29110be";
// Get current date and time
var today = dayjs();
// Select elements from HTML
var form = document.querySelector("form");
var cityInput = document.querySelector("#city");
var main = document.querySelector("main");
var cityList = document.querySelector("#city-list");

// Get all cities searched by user using local storage
var citiesSearched = JSON.parse(localStorage.getItem("cities"));
if (citiesSearched === null) {
    citiesSearched = [];
}

// Render array of cities as buttons in the aside
function renderCityButtons() {
    cityList.textContent = "";
    for (var i = 0; i < citiesSearched.length; i++){
        var cityButton = document.createElement("button");
        cityButton.textContent = citiesSearched[i];
        cityList.appendChild(cityButton);
    }
}

// Store array of cities in local storage
function storeCities(cityName) {
    if (!citiesSearched.includes(cityName)) {
        citiesSearched.push(cityName);
    }
    localStorage.setItem("cities", JSON.stringify(citiesSearched));
}

function getWeatherData(event) {
    // Prevent default of form submission
    event.preventDefault();

    var cityName = cityInput.value;

    // Store searched city in local storage
    storeCities(cityName);
    renderCityButtons();

    // First fetch for lat and lon coordinates given city name
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            // Get latitude and longitude of city
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log("Lat: " + lat + " Lon: " + lon);

            // Second fetch for CURRENT weather data for those lat and lon coordinates
            // Added query parameter "units=imperial" to get Fahrenheit and MPH
            requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (currentData) {
                    console.log(currentData);
                    console.log(data[0].name + ", " + data[0].state);
                    // Apply black border around current weather section
                    currentWeatherSection = document.querySelector("#current-weather");
                    currentWeatherSection.setAttribute("style", "border: 2px solid black");

                    // Display city, state, and today's date in header
                    var cityHeader = document.querySelector("#city-name");
                    cityHeader.textContent = data[0].name + ", " + data[0].state + today.format(' (M/D/YYYY)');

                    // Display current weather icon
                    console.log(currentData.weather[0].icon);
                    var weatherIcon = document.querySelector("#icon");
                    weatherIcon.setAttribute("src","http://openweathermap.org/img/wn/" + currentData.weather[0].icon + "@2x.png");
                    
                    // Display current weather stats (temp, wind, humidity)
                    var temp = document.querySelector("#current-temp");
                    temp.textContent = "Temp: " + currentData.main.temp + "\u00B0F";   // unicode char to print degrees symbol                
                    var wind = document.querySelector("#current-wind");
                    wind.textContent = "Wind: " + currentData.wind.speed + " MPH";
                    var humidity = document.querySelector("#current-humidity");
                    humidity.textContent = "Humidity: " + currentData.main.humidity + " %";
                });

            // Third fetch for FUTURE weather data for those lat and lon coordinates
            requestUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (futureData) {
                    console.log(futureData);
                    var forecastHeader = document.querySelector("#forecast-header");
                    forecastHeader.textContent = "5-day Forecast:";

                    // Loop through arrray with weather conditions for 3-hr intervals for next 5 days
                    var hourlyArr = futureData.list;
                    var day = 1;
                    for (var i = 0; i < hourlyArr.length; i++) {
                        var date = hourlyArr[i].dt_txt.split(" ")[0];
                        var time = hourlyArr[i].dt_txt.split(" ")[1];

                        // Check if the time for given date is 3:00PM to get representative weather at this time of day
                        if (time === "15:00:00") {    
                            var dayCard = document.querySelector("#day-" + day);
                            // Clear out content of each dayCard before adding new content
                            dayCard.textContent = "";

                            // Append date header to each day card
                            var dateHeader = document.createElement("h3");
                            dateHeader.textContent = dayjs(date).format("M/D/YYYY");
                            dayCard.appendChild(dateHeader);

                            // Display weather icon on each day card
                            console.log(futureData.list[i].weather[0].icon);
                            var futureWeatherIcon = document.createElement("img");
                            futureWeatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + futureData.list[i].weather[0].icon + ".png");
                            dayCard.appendChild(futureWeatherIcon);

                            // Display future weather stats (temp, wind, humidity)
                            var temp = document.createElement("p");
                            temp.textContent = "Temp: " + futureData.list[i].main.temp + "\u00B0F";
                            dayCard.appendChild(temp);
                            var wind = document.createElement("p");
                            wind.textContent = "Wind: " + futureData.list[i].wind.speed + " MPH";
                            dayCard.appendChild(wind);
                            var humidity = document.createElement("p");
                            humidity.textContent = "Humidity: " + futureData.list[i].main.humidity + " %";
                            dayCard.appendChild(humidity);

                            // Increment day by 1 to add weather data to next dayCard
                            day++;
                        }
                    }

                });
        });
}

renderCityButtons();
// Once user clicks on "Search" button, call getWeatherData()
form.addEventListener("submit", getWeatherData);

