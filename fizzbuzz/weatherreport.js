'use strict';

if('geolocation' in navigator){

navigator.geolocation.getCurrentPosition(getLocation);

var latitude = 0;
var longitude = 0;
var gridRequest = new XMLHttpRequest;
var request = new XMLHttpRequest;
var city = '';
var state = '';
var pointData = [];
var gridData = [];
var forecast = [];

function getLocation(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    request.open('GET', 'https://api.weather.gov/points/'+latitude+','+longitude);
    request.onload = function(){
        pointData = JSON.parse(this.response);
        city = pointData.properties.relativeLocation.properties.city;
        state = pointData.properties.relativeLocation.properties.state;
        gridRequest.open('GET', pointData.properties.forecast);
        gridRequest.onload = function(){
            forecast=JSON.parse(this.response).properties;
            let time = new Date(forecast.updated);
            let timeStamp = city+', '+state+'<br>Updated '+dayOfWeek(time.getDay())+', '+month(time.getMonth())+' '+time.getDate()+' at '+time.getHours()+':'+time.getMinutes();
            document.getElementById('updated').innerHTML = timeStamp;
            buildDivs();
        }
        gridRequest.send();
    }
    request.send();
}

function dayOfWeek(day){
    switch (day){
        case 0:
            return "Sunday";
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
    }
}
function month(month){
    switch(month){
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        case 11:
            return 'December';
    }
}

function buildDivs(){
    let weatherDiv = document.getElementById('weatherReport');
    for(let i=0; (i<forecast.periods.length && i<9); i++){
        let report = document.createElement('DIV');
        report.className = 'forecast';
        let period = forecast.periods[i];
        report.innerHTML = '<h3>'+period.name+'</h3><img src='+period.icon+'><p>'+period.temperature + '&#176F - ' +period.shortForecast+'</p>';
        weatherDiv.appendChild(report);
    }
}



} else{
    alert('Location unavailable (sorry about that)');
}