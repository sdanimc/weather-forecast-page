//globally declared variables
var userInput;
var searchBtn = document.getElementById('searchBtn')
//apikeyw can be used for both geocoding and getting weather info
var APIkeyW = "e62d64be9b5b8baedff8301f0d55e47f";

//functions
function getUserInput() {
    userInput = document.getElementById('input').value;
    console.log(userInput);
    search();
};
function search() {
    //convert userInput to lat and lon with geocoding api
    var requestURLgeo = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=1&appid=' + APIkeyW;
    fetch(requestURLgeo)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if (!data[0]) { alert('This city is not in our database. Please try again') };
            var lat = data[0].lat;
            var lon = data[0].lon;
            getWeather(lat, lon);
        });
    function getWeather(lat, lon) {
        var requestURLwet = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkeyW;
        fetch(requestURLwet)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);});
        /*
         add to search history and run display function
         may have to run display data inside this function to reference data
        */
    };
}
function displayData() {
    /* get current and next 5 dates
function? display current date and conditions
for each fivedayfore display date temp wind and display*/
}

//event listeners
//event listener for search history btns with function that sets user input to btn text and runs search
searchBtn.addEventListener('click', getUserInput);