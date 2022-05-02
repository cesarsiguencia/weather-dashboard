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
    showTime()

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

    fetch(apiUrl).then(response => {
        if(response.ok){
            response.json().then(function(data){
                var lat = data[1].lat
                var lon = data[1].lon
                saveSearch(city)
                getCityWeather(lat, lon, city)
                getWeekForecast(lat, lon, city)
            })
        } else {
            alert("Error: Github User Not Found")
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
            alert("Error: Github User Not Found")
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
    weatherImage.innerHTML =  `<img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png " alt="Current Weather Icon">`
    cityBlock.appendChild(weatherImage)

    var cityStats = document.createElement('div')
    cityStats.className="center"
    cityStats.innerHTML= 
    `Temperature: ${current.temp} Celcius <br> Humidity: ${current.humidity} <br> Wind Speed: ${current.wind_speed} mph`
    ;
    cityBlock.append(cityStats)

}

var getWeekForecast = function(lat, lon, city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=36a8fc1729aa2a8593bb0dac198321dd`


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
        dayIcon.innerHTML =  `<img src="http://openweathermap.org/img/wn/${oneDay.weather[0].icon}@2x.png " alt="Current Weather Icon">`
        dayBlock.appendChild(dayIcon)

        var dayStats = document.createElement('div')
        dayStats.className="center-future-days"
        dayStats.innerHTML= 
        `Temperature: <br> ${oneDay.temp.day} Celcius <br><br>
        Humidity: <br> ${oneDay.humidity} <br><br>
        Wind Speed: <br> ${oneDay.wind_speed} mph`
        dayBlock.appendChild(dayStats)
     

    }
}

var saveSearch = function(city){

    if(searchHistory.length == 0){
        pushToArray(city)
    } else {
        searchHistory.forEach(savedEntry => {
            if(city === savedEntry){
                console.log('Direct match')
                return
            } else {
                pushToArray(city)
            }
        })
    }



    
}

var pushToArray = function(city){
    searchHistory.push(city)
    console.log(saveSearch)

    localStorage.setItem("cities", JSON.stringify(searchHistory))
    var oneCity = document.createElement('div')
    oneCity.className= 'center-future-days'
    oneCity.innerHTML= city
    cityBtns.appendChild(oneCity)
}



var displayHistory = function(){
    if(!searchHistory){
        searchHistory = []
        console.log(searchHistory)
    } else {
        searchHistory = JSON.parse(localStorage.getItem("cities"))


        for ( var i = 0; i < searchHistory.length; i++){
            var oneCity = document.createElement('div')
            oneCity.className= 'center-future-days'
            oneCity.innerHTML= searchHistory[i]
            oneCity.setAttribute('city', searchHistory[i])
            cityBtns.appendChild(oneCity)
            
        }
    }
}

displayHistory()

searchBtn.addEventListener("click", searchCity)

var clickedCity = function(event){
    var city = event.target.getAttribute("city")

    if(city){
        console.log(`This city is ${city}`)
        getCityCoordinates(city)
    }
    
}



cityBtns.addEventListener("click", clickedCity)

// 36a8fc1729aa2a8593bb0dac198321dd