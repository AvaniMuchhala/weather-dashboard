var APIKey = "d824f67db78129ee90e5a459c29110be";
var today = dayjs();
var form = document.querySelector("form");
var cityInput = document.querySelector("#city");
var main = document.querySelector("main");
var cityHeader = document.querySelector("#city-name");
var weatherIcon = document.querySelector("#icon");
var currentStats = document.querySelector("#current-stats");


// Add event listener to Search button
// Prevent default
// Store city in local storage
// First fetch data on long & lat
// Fetch current weather data for those coordinates
// Display

function getWeatherData(event) {
    // Check this
    event.preventDefault(); 

    var cityName = cityInput.value;
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            // Get latitude and longitude
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log("Lat: " + lat + " Lon: " + lon);

            // Fetch current weather data for those lat and lon coordinates
            requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            
            //requestUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;


            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (currentData) {
                    console.log(currentData);
                    console.log(data[0].name + ", " + data[0].state);
                    currentWeatherSection = document.querySelector("#current-weather");
                    currentWeatherSection.setAttribute("style","border: 2px solid black");
                    
                    
                    cityHeader.textContent = data[0].name + ", " + data[0].state + today.format(' (M/D/YYYY)');
                    
                    // Display weather icon
                    console.log(currentData.weather[0].icon);
                    weatherIcon.setAttribute("src","http://openweathermap.org/img/wn/" + currentData.weather[0].icon + "@2x.png");
                    
                    // Display current weather stats (CHECK METRICS)
                    var temp = document.querySelector("#current-temp");
                    temp.textContent = "Temp: " + currentData.main.temp;
                    currentStats.appendChild(temp);

                    var wind = document.querySelector("#current-wind");
                    wind.textContent = "Wind: " + currentData.wind.speed + " MPH";
                    currentStats.appendChild(wind);

                    var humidity = document.querySelector("#current-humidity");
                    humidity.textContent = "Humidity: " + currentData.main.humidity + " %";
                    currentStats.appendChild(humidity);


                });

        });
}

form.addEventListener("submit",getWeatherData);

