// Define global variables
var apiKey = "df013db2b69272b1774351d54b370620";
var cityInput = document.querySelector("#city-input");
var searchButton = document.querySelector("#search-button");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var cityName = document.querySelector('#city-name');
var currentWeather = document.querySelector('#current-weather');
var forecastContainer = document.querySelector('#forecast-container');
var aside = document.querySelector('aside');


// Event listener for search button
searchButton.addEventListener("click", function () {
    var city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        cityInput.value = "";
    }
});

// Event listener for toggle button
const toggleButton = document.querySelector('#toggle-button');
toggleButton.addEventListener('click', function() {
    if (toggleButton.checked) {
        cityName.style.display = 'block';
        currentWeather.style.display = 'block';
        forecastContainer.style.display = 'block';
        aside.style.display = 'block';
    } else {
        cityName.style.display = 'none';
        currentWeather.style.display = 'none';
        forecastContainer.style.display = 'none';
        aside.style.display = 'none';
    }
});

// Event listener for search history
document.querySelector("#search-history").addEventListener("click", function (event) {
    if (event.target.matches("li")) {
        var city = event.target.textContent;
        getWeatherData(city);
    }
});

// Function to retrieve weather data from OpenWeatherMap API
function getWeatherData(city) {
    // Build URL for API call
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    // Make API call
    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.statusText;
            }
            return response.json();
        })
        .then(function (data) {
            // Update search history
            if (!searchHistory.includes(city)) {
                searchHistory.push(city);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                updateSearchHistory();
            }

            // Store current weather data
            var currentWeather = {
                city: data.city.name,
                date: moment().format("M/D/YYYY"),
                icon: "https://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png",
                temp: data.list[0].main.temp,
                humidity: data.list[0].main.humidity,
                wind: data.list[0].wind.speed
            };

            // Display current weather data
            displayCurrentWeather(currentWeather);

            // Store 5-day forecast data
            var forecastData = [];
            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.endsWith("12:00:00")) {
                    var forecast = {
                        date: moment(data.list[i].dt_txt).format("M/D/YYYY"),
                        icon: "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png",
                        temp: data.list[i].main.temp,
                        humidity: data.list[i].main.humidity,
                        wind: data.list[i].wind.speed
                    };
                    forecastData.push(forecast);
                }
            }

            // Display 5-day forecast data
            displayForecastData(forecastData); 
        })
        .catch(function (error) {
            // Display error message if API call fails
            alert("Error: " + error);
        });
}

function displayForecastData(forecastData) {
    // Loop through forecast data and update HTML
    for (var i = 0; i < forecastData.length; i++) {
        var forecastCard = document.querySelector("#forecast-card-" + i);
        forecastCard.querySelector(".card-date").textContent = forecastData[i].date;
        forecastCard.querySelector(".card-icon").setAttribute("src", forecastData[i].icon);
        forecastCard.querySelector(".card-temp").textContent = "Temp: " + forecastData[i].temp + " °F";
        forecastCard.querySelector(".card-humidity").textContent = "Humidity: " + forecastData[i].humidity + "%";
        forecastCard.querySelector(".card-wind-speed").textContent = "Wind Speed: " + forecastData[i].wind + " MPH";
    }
}

 // Function to update search history
 function updateSearchHistory() {
    // Clear existing search history
    document.querySelector("#search-history").innerHTML = "";

    // Loop through search history and create list items
    for (var i = 0; i < searchHistory.length; i++) {
        var liEl = document.createElement("li");
        liEl.textContent = searchHistory[i];
        document.querySelector("#search-history").appendChild(liEl);
    }
}


// Function to display current weather data
function displayCurrentWeather(currentWeather) {
    // Update HTML with current weather data
    document.querySelector("#city-name").textContent = currentWeather.city + " (" + currentWeather.date + ")";
    document.querySelector("#weather-icon").setAttribute("src", currentWeather.icon);
    document.querySelector("#temperature").textContent = "Temperature: " + currentWeather.temp + " °F";
    document.querySelector("#humidity").textContent = "Humidity: " + currentWeather.humidity + "%";
    document.querySelector("#wind-speed").textContent = "Wind Speed: " + currentWeather.wind + "%";

    // Initialize search history
    updateSearchHistory();
}
