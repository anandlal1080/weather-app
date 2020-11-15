const api = {
    key: "9609f439891b90578f23ae3b2c2b314a",
    base: "https://api.openweathermap.org/data/2.5/"  
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
var lat = "";
var lon = "";
function setQuery(evt) {

    
    if (evt.keyCode == 13) {
        if (searchbox.value == "") {
            return;
            
        } else {
            
            getResults(searchbox.value);
            $("#history").append($("<h5>").text(searchbox.value));
            
            document.getElementById("history").addEventListener("click", myFunction); 
            
            function myFunction() {
                console.log(document.getElementById("history").innerText);
            }
        }
        
    }
    
}

function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=imperial&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
        
        
    }).then(displayResults);
    
}

function displayResults(weather) {
    lat = weather.coord.lat;
    lon = weather.coord.lon;
  
    
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;
    
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = luxon.DateTime.local().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' });
    
    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>F</span>`;
    
    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;
    
    let humidity = document.querySelector('.humidity');
    humidity.innerText = "Humidity " + weather.main.humidity + "%";

    let windspeed = document.querySelector('.windspeed');
    windspeed.innerText = "Windspeed " + weather.wind.speed+ "mph";

    fetch(`${api.base}uvi?lat=${lat}&lon=${lon}&appid=${api.key}`)
    .then(uvi => {
        return uvi.json()
    }).then(uvIndexFunc);
    
    function uvIndexFunc(uvi) {
        
        console.log(uvi);
        let uvindex = document.querySelector('.uvindex ');
        uvindex.innerText = "UV Index " + uvi.value;
    }

}
