var searchBtn = $('#searching');
//stores search result in local storage
searchBtn.click(function () {
    var searchedCity = $("#myInput").val().trim();
    localStorage.setItem('city', searchedCity);
    console.log(searchedCity);
    makeButton()
});

// when the search bar is used. stores the searched city as a button

function makeButton() {
    var previouslySearched = localStorage.getItem('city')
    $('#previous-cities').append('<button type="button" class="btn btn-sm btn-secondary button-search" id=" ">' + previouslySearched + '</button>');
}

//after a city has been input. grabs info from the openWeather API