var searchBtn = document.querySelector('#search-button')
var searchInput = document.querySelector('#search-city')
var weatherStats = document.querySelector('#weather-stats')
var dailyStats = document.querySelector('#daily-stats')
var displayCityInfo = document.querySelector('#clear-information')
var searchHistory = ''
var cityBtns = document.querySelector('#city-buttons')
var time =''

var showTime = function(){
    time = moment().format('dddd' + ', ' + 'MMMM Do YYYY')
}

var searchCity = function(event){
    event.preventDefault();

    var typedCity = searchInput.value.trim()
    if(typedCity){
        getCityCoordinates(typedCity)
    }
}

var getCityCoordinates = function(city){
    weatherStats.textContent = ''
    dailyStats.textContent = ''
    searchInput.value = ''
    showTime()
    city = city.toUpperCase()

    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=36a8fc1729aa2a8593bb0dac198321dd`

    fetch(apiUrl).then(response => {
        if(response.ok){
            response.json().then(function(data){
                if (data.length === 0){
                    alert('Error: Enter a valid city name!')
                    return
                }
                var lat = data[1].lat
                var lon = data[1].lon
                getCityWeather(lat, lon, city)
                getWeekForecast(lat, lon, city)
                saveSearch(city)
            })
        } else {
            alert("Error: Incorrect City Name")
        }
    })
}

var getCityWeather = function(lat, lon, city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&&units=metric&appid=36a8fc1729aa2a8593bb0dac198321dd`

    fetch(apiUrl).then(response => {
        if(response.ok){
            response.json().then(function(data){
                var currentStats = data.current
                var currentCity = city
                displayCurrentStats(currentStats, currentCity)
            })
        } else {
            alert("Error: City Not Found")
        }
    })
}

var displayCurrentStats = function(current, city){
    weatherStats.className = "weather-stats"

    var cityHeader = document.createElement("h3")
    cityHeader.className="center"
    cityHeader.innerHTML = city + "<br><h5> " + time + "</h5>"
    weatherStats.appendChild(cityHeader)

    var cityBlock = document.createElement('div')
    cityBlock.className= 'city-block' 
    weatherStats.appendChild(cityBlock)

    var weatherImage = document.createElement('div')
    weatherImage.className="center"
    weatherImage.innerHTML =  `<img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png " alt="Current Weather Icon">`
    cityBlock.appendChild(weatherImage)

    var cityStats = document.createElement('div')
    cityStats.className="center"
    cityStats.innerHTML= 
    `Temperature: ${current.temp} Celcius <br> Humidity: ${current.humidity} <br> Wind Speed: ${current.wind_speed} mph`;

    var uviInfo = document.createElement('p')

    if(0 <= current.uvi && current.uvi <= 3){
        uviInfo.className="green"
    }
    if(3 < current.uvi && current.uvi <= 6){
        uviInfo.className="yellow"
    }
    if(6 < current.uvi && current.uvi <= 8){
        uviInfo.className="orange"
    } 
    if(8 < current.uvi && current.uvi <= 11){
        uviInfo.className="red"
    }
    if(current.uvi > 11){
        uviInfo.className="purple"
    }

    uviInfo.innerHTML = `UV: ${current.uvi}`
    cityStats.appendChild(uviInfo)
    cityBlock.append(cityStats)
}

var getWeekForecast = function(lat, lon, city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=36a8fc1729aa2a8593bb0dac198321dd`

    fetch(apiUrl).then(response => {
        if(response.ok){
            response.json().then(function(data){
                displayWeeklyForecast(data.daily) 
            })
        } else {
            alert("Error: City Not Found")
        }
    })
}

var displayWeeklyForecast = function(daily){
    var dailyHeader = document.createElement("h3")
    dailyHeader.className="center"
    dailyHeader.innerHTML = '<h3>5 Day Forecast</h3>'
    dailyStats.appendChild(dailyHeader)

    var weekBlock = document.createElement('div')
    weekBlock.className='center-forecast'
    dailyStats.appendChild(weekBlock)

    for (var i = 0; i < 5; i++){
        var oneDay = daily[i]

        var newTime = moment().add(1 + i, 'd')
        var forecastDay = moment(newTime).format('dddd' + ', ' + 'MMMM Do YYYY')

        var dayBlock = document.createElement('div')
        dayBlock.className='center-future-days'
        weekBlock.appendChild(dayBlock)

        var dayOfWeek = document.createElement('h6')
        dayOfWeek.textContent= forecastDay
        dayBlock.appendChild(dayOfWeek)

        var dayIcon = document.createElement('div')
        dayIcon.className='center'
        dayIcon.innerHTML =  `<img src="https://openweathermap.org/img/wn/${oneDay.weather[0].icon}@2x.png " alt="Current Weather Icon">`
        dayBlock.appendChild(dayIcon)

        var dayStats = document.createElement('div')
        dayStats.className="center-future-days"
        dayStats.innerHTML= 
        `Temperature: <br> ${oneDay.temp.day} Celcius <br><br>
        Humidity: <br> ${oneDay.humidity} <br><br>
        Wind Speed: <br> ${oneDay.wind_speed} mph <br><br>`
        

        var uviInfo = document.createElement('p')

        if(0 <= oneDay.uvi && oneDay.uvi <= 3){
            uviInfo.className="green"
        }
        if(3 < oneDay.uvi && oneDay.uvi <= 6){
            uviInfo.className="yellow"
        }
        if(6 < oneDay.uvi && oneDay.uvi <= 8){
            uviInfo.className="orange"
        } 
        if(8 < oneDay.uvi && oneDay.uvi <= 11){
            uviInfo.className="red"
        }
        if(oneDay.uvi > 11){
            uviInfo.className="purple"
        }

        uviInfo.innerHTML = `UV: ${oneDay.uvi}`
        dayStats.appendChild(uviInfo)
        dayBlock.appendChild(dayStats) 
    }
}

var saveSearch = function(city){
    if(searchHistory.length === 0){
        pushToArray(city)
    } else {
        searchHistory.forEach(savedEntry => {
            if(city.toLowerCase() === savedEntry.toLowerCase()){
                var filtered = searchHistory.filter(e => e !=savedEntry)
                city = city.toUpperCase()
                searchHistory = filtered
                }
        })
        pushToArray(city)
    }
}

var pushToArray = function(city){
    searchHistory.unshift(city)
    if(searchHistory.length > 10)[
        searchHistory = searchHistory.slice(0, 10)
    ]
    localStorage.setItem("cities", JSON.stringify(searchHistory))
    displayHistory()
}

var displayHistory = function(){
    searchHistory = JSON.parse(localStorage.getItem("cities"))

    if(!searchHistory){
        searchHistory = []
    } else {
        if(cityBtns){
            cityBtns.textContent= ''
        }
        var elementTitle = document.createElement('p')
        elementTitle.textContent= "Search History: Click on City to see results"
        cityBtns.appendChild(elementTitle)

        for ( var i = 0; i < searchHistory.length; i++){
            var oneCity = document.createElement('div')
            oneCity.className= 'center-future-days'
            oneCity.innerHTML= searchHistory[i]
            oneCity.setAttribute('city', searchHistory[i])
            cityBtns.appendChild(oneCity)
        }
    }
}

var clickedCity = function(event){
    var city = event.target.getAttribute("city")

    if(city){
        getCityCoordinates(city)
    }
}

cityBtns.addEventListener("click", clickedCity)
searchBtn.addEventListener("click", searchCity)
displayHistory()