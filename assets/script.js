//globally declared variables
var today = dayjs();
var currentTitle = document.getElementById('citydate');
var userInput;
var inputField = document.getElementById('input');
var searchBtn = document.getElementById('searchBtn');
var currentTemp = document.getElementById('temp');
var currentWind = document.getElementById('wind');
var currentHumid = document.getElementById('humid');
var searchHistory = [];
var ulHistory = document.getElementById('search-history');
//apikeyw can be used for both geocoding and getting weather info
var APIkeyW = "e62d64be9b5b8baedff8301f0d55e47f";

//functions
//search history functions
function loadSearch() {
if (ulHistory.childElementCount !== 0) {
    function deleteChild() {
        var first = ulHistory.firstElementChild
        while (first) {
            first.remove();
            first = ulHistory.firstElementChild;
        }
    }
    deleteChild();
};
for(i=0; i< searchHistory.length; i+= 1){
    var historyBtn = document.createElement('button');
    historyBtn.textContent = searchHistory[i];
    historyBtn.className = "prevSearchBtn";
    ulHistory.appendChild(historyBtn);
}
};
function saveSearch() {
var currentSearch = userInput.toUpperCase();
if (searchHistory.includes(currentSearch)){
    return;}else{
        searchHistory.push(currentSearch);
        window.localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
        loadSearch();
    };
};
function clearHistory() {
    searchHistory =[];
    window.localStorage.removeItem('searchHistory');
    loadSearch();
};
//search functions
function getUserInput() {
    userInput = document.getElementById('input').value;
    search();
};
function search() {
    //convert userInput to lat and lon with geocoding api
    var requestURLgeo = 'https://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=1&appid=' + APIkeyW;
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
                getWeather(lat, lon);
                saveSearch();
            };
        });
    function getWeather(lat, lon) {
        //display city and date
        var todayDate = today.format('MM/DD/YYYY');
        var resultsTitle = userInput.toUpperCase();
        currentTitle.textContent = resultsTitle + " " + todayDate;
        //get and display weather data
        var requestURLwet = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkeyW;
        fetch(requestURLwet)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                //current weather
                //temperature data is in kelvin 
                var tempK = parseInt(data.list[0].main.temp);
                //convert to F
                var tempF = 1.8 * (tempK - 273) + 32;
                //dispaly data
                currentTemp.textContent = tempF;
                currentHumid.textContent = data.list[0].main.humidity;
                currentWind.textContent = data.list[0].wind.speed;
                //icon
                var currentIcon = document.getElementById('currenticon');
                var currentIconID = data.list[0].weather[0].icon;
                currentIcon.style.display = "inline-block";
                currentIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + currentIconID + '@2x.png');
                //five day forecast display
                for (i = 1; i < 6; i += 1) {
                    //icon 
                    var nextIcon = document.getElementById('icon' + i);
                    var nexticonID = data.list[i].weather[0].icon;
                    nextIcon.style.display = "inline-block";
                    nextIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + nexticonID + '@2x.png');
                    //date display
                    var title = document.getElementById("day" + i + "date");
                    title.textContent = today.add(i, 'd').format('MM/DD/YYYY');
                    //get and display forecasted weather conditions
                    var futureTemp = document.getElementById("day" + i + "temp");
                    var nextTempK = parseInt(data.list[i].main.temp);
                    var nextTempF = 1.8 * (nextTempK - 273) + 32;
                    futureTemp.textContent = nextTempF;
                    var futureWind = document.getElementById("day" + i + "wind");
                    futureWind.textContent = data.list[i].wind.speed;
                    var futureHumid = document.getElementById("day" + i + "humid");
                    futureHumid.textContent = data.list[i].main.humidity;
                };
            });
           
    };
   
};

//event listeners
//search btns
searchBtn.addEventListener('click', getUserInput);
//lets pressing enter trigger search functions
inputField.addEventListener('keypress', function (event) { if (event.key === "Enter") { getUserInput(); } });
//search history btns
ulHistory.addEventListener('click', function(event){ 
    userInput = event.target.innerHTML;
    search();
});
document.getElementById("clearHistory").onclick = clearHistory;
