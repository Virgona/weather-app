const searchBtn = $('#searching');
let searchedCity;
let cityDisplayName = $('#city-name');
let apiUrl = 'http://api.openweathermap.org/data/2.5/';
const apiKey = '051f2bb3cfd048b3c5135242dc4d2da7';

//stores search result in local storage
searchBtn.click(function (event) {
    event.preventDefault()
    searchedCity = $("#myInput").val().trim();
    console.log('once clicked, searchedCity contains: ', searchedCity)
    localStorage.setItem('city', searchedCity);
    console.log(searchedCity);
    $('#next-5-days').html(' ');
    makeButton()

});


// when the search bar is used. stores the searched city as a button

function makeButton() {
    let previouslySearched = localStorage.getItem('city')
    $('#previous-cities').append('<button type="button" class="btn btn-sm btn-secondary button-search previous">' + previouslySearched + '</button>');
    cityWeather()

    let lastCityBtn = $('.previous');
    lastCityBtn.click(function () {
        searchedCity = $('.previous').text();
        console.log(searchedCity)
    })
}


//after a city has been input. grabs info from the openWeather API

function cityWeather() {
    // let searchedCity = $("#myInput").val().trim();
    let testUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=metric&appid=${apiKey}`;
    fetch(testUrl)
        .then(function (response) {
            console.log(response);
            console.log(testUrl);
            return response.json();
        })
        .then(function (coordData) {
            console.log(coordData)
            let lat = coordData.coord.lat;
            let lon = coordData.coord.lon;
            // console.log(lat, lon);
            cityDisplayName.html(coordData.name);
            $('#temp').html(coordData.main.temp + '&#8451;');
            $('#humidity').html(coordData.main.humidity + ' %');
            $('#wind').html(coordData.wind.speed + ' MPH');

            let iconCode = coordData.weather[0].icon;
            let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $('#wicon').attr('src', iconUrl);

            fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
                .then(function (response) {
                    console.log(response)
                    return response.json();
                })
                .then(function (uvData) {
                    console.log(uvData)
                    $('#uv').html(uvData.value);
                    let uvIndexValue = uvData.value;

                    if (uvIndexValue > 5) {
                        $('#uv').css('background-color', 'red')

                        if (uvIndexValue > 2) {
                            $('#uv').css('background-color', 'orange')
                        }
                    } else $('#uv').css('background-color', 'green')

                    let currentDate = uvData.date_iso.slice(0, 10)
                    cityDisplayName.append(' (' + currentDate + ')')

                })



            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=${apiKey}`)
                .then(function (response) {
                    console.log(response)
                    return response.json()
                })
                .then(function (forecastData) {
                    console.log(forecastData)

                    let fiveDayForecast = forecastData.list.length;

                    for (let i = 0; i < fiveDayForecast; i++) {
                        $('#next-5-days').append(`<div class="card bg-light mb-3"><div class="card-header"></div><div class="card-body"><h5 class="card-title"></h5><p class="card-text"></p></div>`)
                    }

                    // let forecastDates = forecastData.list[0]

                    // for (const date of forecastDates)
                    //     $('.card-header').text(forecastData.list[0].dt_txt)
                    // console.log(forecastData.list[0].dt_txt)
                    // forecastDates++;
                    // $('.card-body').append(`<div>Temp: forecastData.list[0].main.temp </br> Wind: forecastData.list[0].wind.speed MPH`)
                    // forecastData.list++;
                })




            // fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${apiKey}`)
            //     .then(function (response) {
            //         console.log(response);
            //         return response.json();
            //     })
            //     .then(function (weatherData) {
            //         console.log(weatherData);
            //     })
            // let base = data.base; // "stations"
            // let latitude = data.coords.lat; // -33 
            // let todaysWeatherSummary = data.weather[0].main; // "Rain"

            // extract the lat and lon
            // concatenate those variables into the oneCall api url
            // -- https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=hourly&appid={API key}
            // make another fetch
            // -- then convert the respons to json
            // -- -- then look at the data
            // -- -- extract the data you want
            // -- -- reach into the html grabe the elemtn you want
            // -- -- stuff you data into the html element

        });
}