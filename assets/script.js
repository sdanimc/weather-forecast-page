//globally declared variables
var today = dayjs();
var currentTitle = document.getElementById('citydate');
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
            if (!data[0]) {
                alert('This city is not in our database. Please try again');
            } else {
                var lat = data[0].lat;
                var lon = data[0].lon;
                //add to search history here
                getWeather(lat, lon);
            };
        });
    function getWeather(lat, lon) {
        var todayDate = today.format('MM/DD/YYYY');
        currentTitle.textContent= userInput + " " + todayDate;
        //display city name and date
        var requestURLwet = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkeyW;
        fetch(requestURLwet)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                //current weather
                //temperature data is in kelvin 
                var tempK = parseInt(data.list[0].main.temp);
                //convert to F
                var tempF = 1.8 * (tempK - 273) + 32;
                //need to add display functions
                //five day forecast display for loop, need to add ids in html
                //need to add temp wind and humidity both here and in html
                for (i=1; i<6; i+=1){
                    var title = document.getElementById("day"+i+"date");
                    title.textContent = today.add(i,'d').format('MM/DD/YYYY');
                };
            });
    };
};

//event listeners
//event listener for search history btns with function that sets user input to btn text and runs search
searchBtn.addEventListener('click', getUserInput);