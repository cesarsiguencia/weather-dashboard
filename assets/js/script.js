var searchBtn = document.querySelector('#search-button')
var searchInput = document.querySelector('#search-city')
var weatherStats = document.querySelector('#weather-stats')
var dailyStats = document.querySelector('#daily-stats')
var displayCityInfo = document.querySelector('#clear-information')

var cityBtns = document.querySelector('#city-buttons')

var searchCity = function(event){
    console.log("Search works")

    event.preventDefault();
    weatherStats.textContent = ''
    dailyStats.textContent = ''

    var typedCity = searchInput.value.trim()
    if(typedCity){
        console.log(typedCity)
        getCityCoordinates(typedCity)

    }


}

var getCityCoordinates = function(city){
    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=36a8fc1729aa2a8593bb0dac198321dd`

    console.log(apiUrl)

    fetch(apiUrl).then(response => {
        if(response.ok){
            response.json().then(function(data){
                console.log(data)

                var lat = data[1].lat
                var lon = data[1].lon
                getCityWeather(lat, lon, city)
                getWeekForecast(lat, lon, city)
                
            })
        } else {
            alert("Error: Github User Not Found")
        }
    })
}

var getCityWeather = function(lat, lon, city){
    console.log(lat)
    console.log(lon)

    // var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=36a8fc1729aa2a8593bb0dac198321dd`

    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&&units=metric&appid=36a8fc1729aa2a8593bb0dac198321dd`
    console.log('Current Weather', apiUrl)

    fetch(apiUrl).then(response => {
        if(response.ok){
            response.json().then(function(data){
                console.log(data)

                var currentStats = data.current
                var currentCity = city
                displayCurrentStats(currentStats, currentCity)

                
            })
        } else {
            alert("Error: Github User Not Found")
        }
    })

}

var displayCurrentStats = function(current, city){
    var cityHeader = document.createElement("h3")
    cityHeader.textContent = city

    weatherStats.appendChild(cityHeader)

    var cityStats = document.createElement('div')


    cityStats.textContent= 
    `Temperature: ${current.temp} Celcius |


    Humidity: ${current.humidity} |


    Wind Speed: ${current.wind_speed} mph`
    ;


    weatherStats.append(cityStats)

}

var getWeekForecast = function(lat, lon, city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=36a8fc1729aa2a8593bb0dac198321dd`

    console.log(city)

    console.log('5 day', apiUrl)

    fetch(apiUrl).then(response => {
        if(response.ok){
            response.json().then(function(data){
                console.log(data)
                displayWeeklyForecast(data.daily)
                

                
            })
        } else {
            alert("Error: Github User Not Found")
        }
    })
}

var displayWeeklyForecast = function(daily){
    console.log(daily)

    var dailyHeader = document.createElement("h3")
    dailyHeader.innerHTML = '<h3>5 day forecast</h3>'

    dailyStats.appendChild(dailyHeader)

    for (var i = 0; i < 5; i++){
        var oneDay = daily[i]
        console.log(oneDay)
        var dayBlocks = document.createElement('div')
        dayBlocks.textContent= 
        `Temperature: ${oneDay.temp.day} Celcius |
    
    
        Humidity: ${oneDay.humidity} |
    
    
        Wind Speed: ${oneDay.wind_speed} mph`
        ;

        dailyStats.appendChild(dayBlocks)
     

    }
}

var singleCity = function(event){
    var city = event.target.getAttribute("city")

    if(city){
        console.log(`This city is ${city}`)
    }
    
}

searchBtn.addEventListener("click", searchCity)

cityBtns.addEventListener("click", singleCity)

// 36a8fc1729aa2a8593bb0dac198321dd