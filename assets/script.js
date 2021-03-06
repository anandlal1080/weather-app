const api = {
    key: "9609f439891b90578f23ae3b2c2b314a",
    base: "https://api.openweathermap.org/data/2.5/"  
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
var lat = "";
var lon = "";
var previousSearch = JSON.parse(localStorage.getItem("previous")) || [];

if (previousSearch.length >0) {
    
    getResults(previousSearch[previousSearch.length-1]);
}

for (let i = 0; i < previousSearch.length; i++) {
   
    $("#history").prepend($("<h5>").text(previousSearch[i]));
    
    function history(e) {
        var cities = e.target.innerHTML;
        if (e.target.matches("h5")) {
            
           getResults(cities);
        }
    }
    $(document).on("click", history)
    
}

function setQuery(evt) {
  
    
    if (evt.keyCode == 13) {
        if (searchbox.value == "") {
            return;
            
        } else {
            var city = searchbox.value;
           
            previousSearch.push(city);
            
            localStorage.setItem("previous", JSON.stringify(previousSearch));
            $("#history").prepend($("<h5>").text(city));
            function history(e) {
                var cities = e.target.innerHTML;
                if (e.target.matches("h5")) {
                    
                   getResults(cities);
                }
            }
            $(document).on("click", history)
            
            getResults(city);
            
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
    
    var iconcode =weather.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
    
    
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;
    
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = luxon.DateTime.local().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' });
    
    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>F</span>`;
    
    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;
    $('#wicon').attr('src', iconurl);
    
    let humidity = document.querySelector('.humidity');
    humidity.innerText = "Humidity " + weather.main.humidity + "%";
    
    let windspeed = document.querySelector('.windspeed');
    windspeed.innerText = "Windspeed " + weather.wind.speed+ " mph";
    
    fetch(`${api.base}uvi?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=${api.key}`)
    .then(uvi => {
        return uvi.json()
    }).then(uvIndexFunc);
    
    function uvIndexFunc(uvi) {
        
        let uvindex = document.querySelector('.uvindex ');
        uvindex.innerText = "UV Index " + uvi.value;
    }
    
    fetch(`${api.base}forecast?q=${weather.name}&units=imperial&APPID=${api.key}`)
    .then(forecast => {
        return forecast.json();
        
        
        
    }).then(fiveDay);
    
}



function fiveDay(forecast) {
    let count = 1;
    for (let i = 0; i < forecast.list.length; i++) {
        if (forecast.list[i].dt_txt.includes("12:00:00")) {
        var iconcode =forecast.list[i].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
        $('#wicon' + [count]).attr('src', iconurl);
        $('.temp' + [count]).text((`${Math.round(forecast.list[i].main.temp)}`) + " F");
        $('.humidity' + [count]).text((forecast.list[i].main.humidity) + " %");
        var date = forecast.list[i].dt_txt;
        date = date.split(" ");
        $('#date' + [count]).text((date[0]));
        count++;
        console.log(forecast.list[i]);
        }
        
    }
}
