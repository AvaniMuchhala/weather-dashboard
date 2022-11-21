var APIKey = "d824f67db78129ee90e5a459c29110be";
var today = dayjs();
var form = document.querySelector("form");
var cityInput = document.querySelector("#city");
var main = document.querySelector("main");
var cityHeader = document.querySelector("#city-name");
var weatherIcon = document.querySelector("#icon");
var currentStats = document.querySelector("#current-stats");
var forecastHeader = document.querySelector("#forecast-header");

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

            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (currentData) {
                    console.log(currentData);
                    console.log(data[0].name + ", " + data[0].state);
                    currentWeatherSection = document.querySelector("#current-weather");
                    currentWeatherSection.setAttribute("style", "border: 2px solid black");


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

            requestUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (futureData) {
                    console.log(futureData);

                    // for loop thru 5 sections
                    // get current time (round to closest 3-hour interval)
                    // loop through data array and for each date grab weather conditions from that same 3 hour interval
                    // attach header, icon, stats for each card

                    forecastHeader.textContent = "5-day Forecast: ";
                    // FIGURE OUT HOW TO ROUND HOUR
                    var currentHour = Number(today.format('H'));
                    var currentMinutes = Number(today.format('m'));
                    console.log("currentHour: " + currentHour + " currentMinutes: " + currentMinutes);
                    console.log(typeof currentHour);
                    if (currentHour % 3 === 1) {
                        // check minutes
                        if (currentMinutes < 30) {
                            // round down
                            currentHour--;
                        } else if (currentMinutes >= 30) {
                            // round up
                            currentHour = currentHour + 2;
                        }
                    } else if (currentHour % 3 === 2) {
                        // round up
                        currentHour++;
                    }
                    
                    if (currentHour < 10) {
                        currentHour = "0" + currentHour + ":00:00";
                    } else {
                        currentHour = currentHour + ":00:00";
                    }
                    console.log("Current hour in 3-hr interval is: " + currentHour);

                    // Display 5-day forecast
                    var hourlyArr = futureData.list;
                    var day = 1;
                    for (var i = 0; i < hourlyArr.length; i++) {
                        var date = hourlyArr[i].dt_txt.split(" ")[0];
                        var time = hourlyArr[i].dt_txt.split(" ")[1];

                        if (currentHour === time) {
                            console.log("true: " + currentHour + " = " + time);
                            console.log(dayjs(date).format("M/D/YYYY"));
                            var dayCard = document.querySelector("#day-" + (day));
                            var dateHeader = document.createElement("h3");
                            dateHeader.textContent = dayjs(date).format("M/D/YYYY");
                            dayCard.appendChild(dateHeader);

                            // Display weather icon
                            console.log(futureData.list[i].weather[0].icon);
                            var futureWeatherIcon = document.createElement("img");
                            futureWeatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + futureData.list[i].weather[0].icon + ".png");
                            dayCard.appendChild(futureWeatherIcon);

                            var temp = document.createElement("p");
                            temp.textContent = "Temp: " + futureData.list[i].main.temp;
                            dayCard.appendChild(temp);

                            var wind = document.createElement("p");
                            wind.textContent = "Wind: " + futureData.list[i].wind.speed;
                            dayCard.appendChild(wind);
                            
                            var humidity = document.createElement("p");
                            humidity.textContent = "Humidity: " + futureData.list[i].main.humidity;
                            dayCard.appendChild(humidity);

                            day++;
                        }
                    }


                });
        });
}

form.addEventListener("submit", getWeatherData);

