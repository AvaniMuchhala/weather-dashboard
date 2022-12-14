var APIKey = "d824f67db78129ee90e5a459c29110be";
// Get current date and time
var today = dayjs();
var currentDate = today.format('YYYY-MM-DD');
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
    for (var i = 0; i < citiesSearched.length; i++) {
        var cityButton = document.createElement("button");
        cityButton.textContent = citiesSearched[i];
        cityButton.setAttribute("class", "city-button p-2 m-2 rounded fs-5 border-0 bg-secondary bg-opacity-50");
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
    // Check whether event.type is submit (user clicked "Search") or click (user clicked on city button)
    if (event.type === "submit") {
        event.preventDefault();
        var cityName = cityInput.value.trim();     // cityName = user input
    } else if (event.type === "click") {
        // Since all buttons created have class name of "city-button", 
        // check whether user actually clicked on button or on white space within the section
        if (!event.target.className.includes("city-button")) {
            return;
        }
        var cityName = event.target.textContent;    // cityName = city on the button
    }

    // First fetch for lat and lon coordinates given city name
    var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Check whether user inputted valid city (data.length is 0 if invalid search)
            if (data.length === 0) {
                window.alert("Invalid input. Enter the name of a city.");
                return;
            }

            // Store searched city in local storage
            storeCities(cityName);
            renderCityButtons();

            // Get latitude and longitude of city
            var lat = data[0].lat;
            var lon = data[0].lon;

            // Second fetch for CURRENT weather data for those lat and lon coordinates
            // Added query parameter "units=imperial" to get Fahrenheit and MPH
            requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (currentData) {
                    // Apply black border around current weather section
                    currentWeatherSection = document.querySelector("#current-weather");
                    currentWeatherSection.setAttribute("style", "border: 1px solid black");

                    // Display city, state, and today's date in header
                    var cityHeader = document.querySelector("#city-name");
                    cityHeader.textContent = data[0].name + ", " + data[0].state + today.format(' (M/D/YYYY)');

                    // Display current weather icon
                    var weatherIcon = document.querySelector("#icon");
                    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + currentData.weather[0].icon + "@2x.png");

                    // Display current weather stats (temp, wind, humidity)
                    var temp = document.querySelector("#current-temp");
                    temp.textContent = "Temp: " + currentData.main.temp + "\u00B0F";   // unicode char to print degrees symbol                
                    var wind = document.querySelector("#current-wind");
                    wind.textContent = "Wind: " + currentData.wind.speed + " MPH";
                    var humidity = document.querySelector("#current-humidity");
                    humidity.textContent = "Humidity: " + currentData.main.humidity + " %";
                });

            // Third fetch for FUTURE weather data for those lat and lon coordinates
            requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (futureData) {
                    var forecastHeader = document.querySelector("#forecast-header");
                    forecastHeader.textContent = "5-Day Forecast:";

                    // Loop through array with weather conditions for 3-hr intervals for next 5 days
                    var hourlyArr = futureData.list;
                    var day = 1;
                    for (var i = 0; i < hourlyArr.length; i++) {
                        var date = hourlyArr[i].dt_txt.split(" ")[0];
                        var time = hourlyArr[i].dt_txt.split(" ")[1];

                        // Check if the time for given date is 3:00PM to get representative weather at this time of day
                        // Also confirm that this future date does not equal the current date
                        if (time === "15:00:00" && date !== currentDate) {
                            var dayCard = document.querySelector("#day-" + day);
                            // Clear out content of each dayCard before adding new content
                            dayCard.textContent = "";
                            dayCard.setAttribute("style", "height: 15rem; margin: 0 15px 0 15px; padding: 6px; background-color: #231336; color: white; line-height: 2rem");

                            // Append date header to each day card
                            var dateHeader = document.createElement("h3");
                            dateHeader.textContent = dayjs(date).format("M/D/YYYY");
                            dateHeader.setAttribute("class", "fs-4 fw-bold mb-0");
                            dayCard.appendChild(dateHeader);

                            // Display weather icon on each day card
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
        })
}

renderCityButtons();
// Once user clicks on "Search" button or one of the city buttons, call getWeatherData()
form.addEventListener("submit", getWeatherData);
cityList.addEventListener("click", getWeatherData);

