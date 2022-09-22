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
    const buttonEl = $('<button type="button" class="btn btn-sm btn-secondary button-search previous">' + previouslySearched + '</button>')
    $('#previous-cities').append(buttonEl);
    cityWeather()

    // let lastCityBtn = $('.previous');
    buttonEl.click(function () {
        searchedCity = $(this).text();
        console.log(searchedCity);
        $("#myInput").val(searchedCity);
        $("#searching").click();
    })
}


//after a city has been input. grabs info from the openWeather API

function cityWeather() {

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

            // loads the weather information onto the page for current day
            cityDisplayName.html(coordData.name);
            $('#temp').html(coordData.main.temp + '&#8451;');
            $('#humidity').html(coordData.main.humidity + ' %');
            $('#wind').html(coordData.wind.speed + ' MPH');

            let iconCode = coordData.weather[0].icon;
            let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $('#wicon').attr('src', iconUrl);

            //gets the latitude and longitude for the UV Index reading and loads it to the page. Also changes the CSS depending on severity

            fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
                .then(function (response) {
                    console.log(response)
                    return response.json();
                })
                .then(function (uvData) {
                    console.log(uvData)
                    $('#uv').html(uvData.value);
                    let uvIndexValue = uvData.value;

                    if (uvIndexValue < 3) {
                        $('#uv').css('background-color', 'green')

                    }
                    if (uvIndexValue <= 5) {
                        $('#uv').css('background-color', 'orange')

                    } else $('#uv').css('background-color', 'red')

                    let currentDate = uvData.date_iso.slice(0, 10)
                    cityDisplayName.append(' (' + currentDate + ')')

                })

            //fetchs the forecast for the next 5 days and displays the results dynamically on the page

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=${apiKey}`)
                .then(function (response) {
                    console.log(response)
                    return response.json()
                })
                .then(function (forecastData) {
                    console.log(forecastData)

                    let forecastDates = forecastData.list

                    for (const date of forecastDates) {
                        let iconUrl = "http://openweathermap.org/img/w/" + date.weather[0].icon + ".png";


                        $('#next-5-days').append(`<div class="card bg-light mb-3">
                        <div class="card-header">${date.dt_txt}</div>
                        <div class="card-body">
                        <h5 class="card-title">
                        <div id="icon"><img src="${iconUrl}">
                        </h5>
                        <p class="card-text">
                        Temp:${date.main.temp}&#8451;</br>
                        Wind:${date.wind.speed}MPH</br>
                        Hum:${date.main.humidity}%
                        
                        </p></div>`)
                    }
                })

        });
}