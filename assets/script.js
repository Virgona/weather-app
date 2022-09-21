const searchBtn = $('#searching');
let searchedCity = $("#myInput").val().trim();
let cityDisplayName = $('#city-name');
let apiUrl = 'http://api.openweathermap.org/data/2.5/';
const apiKey = '051f2bb3cfd048b3c5135242dc4d2da7';
//stores search result in local storage
searchBtn.click(function (event) {
    event.preventDefault()
    let searchedCity = $("#myInput").val().trim();
    localStorage.setItem('city', searchedCity);
    console.log(searchedCity);
    cityDisplayName.html(searchedCity);
    makeButton()

});

// when the search bar is used. stores the searched city as a button

function makeButton() {
    let previouslySearched = localStorage.getItem('city')
    $('#previous-cities').append('<button type="button" class="btn btn-sm btn-secondary button-search" id=" ">' + previouslySearched + '</button>');
    cityWeather()
}

//after a city has been input. grabs info from the openWeather API

function cityWeather() {
    let searchedCity = $("#myInput").val().trim();
    let cityWeatherURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchedCity + "&limit=1&appid=" + apiKey;
    fetch(cityWeatherURL)
        .then(function (response) {
            console.log(response);
            console.log(cityWeatherURL);
            return response.json();
        });
}