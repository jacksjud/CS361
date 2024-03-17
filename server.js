const fs = require('fs/promises');
const path = require('path');
const hb_adapter = require('express-handlebars');
const express = require('express')

require('dotenv').config()



const apiKey = process.env.APIkey ;      // personal api key

var dataToUse = require("./defaultData.json")

var buttonData = require("./buttonData.json")

const clothingData = require("./clothingData.json")

var tabs = require("./tabs.json")

                    // rain jacket, jeans , and scarf
var defaultClothes = [clothingData[16] , clothingData[8], clothingData[17]]

// Create the express server
var app = express()
var port = process.env.PORT || 3000 // PORT

// Use the static middleware and don't serve directory index files
app.use(express.static('static', { index: false }))

// preparses json data
app.use(express.json());


// Use handlebars
app.engine('handlebars', hb_adapter.engine({ defaultLayout: "main" }))   // sets up template engine (handlebars)
app.set('view engine', 'handlebars')            // sets up view engine 
app.set('views', './views')                // registers where templates are


app.get("/" , function(req, res) {
    res.render('body',{
        smallButtons: buttonData,       // for Wardrobe and Preferences Buttons
        weather: dataToUse.weather,     // for weather
        chosenClothing: defaultClothes,    // for clothing -> sends array of clothing 
        first: defaultClothes[0],  
        tabs: tabs,                      // for tabs
        displayUV: true,                 // constant for now, will change once the user files are used 
        wardrobeItems: clothingData         // array of all clothes available
    })
})

// For future implementations (potentially) -- NOT code smell 
let lat
let long

// Gets weather info from api via lat and long 
app.get("/weather-data/temp-ll", function(req, res) {
    // Gets lat and long from browser
    ({lat, long} = req.query)
    weather_info = {}
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`
    fetch(apiURL)
        .then(response => response.json())     
        .then(data => {
            var tempData = data.main        // Gets temperature data (temp, feels_like, max and min)
            var allData = data              // gets all other data
            weather_info["location"] = allData.name
            weather_info["max-temp"] = tempData.temp_max
            weather_info["min-temp"] = tempData.temp_min
            weather_info["current-temp"] = tempData.temp
            weather_info["weather"] = allData.weather[0]
            res.json({"data": weather_info})
        })
        .catch(error => {
            console.error("Did not receive weather data: ", error);
            res.status(800).json({ error : "Internal Server Error"})
        });

})



app.get("/weather-data/uv" , function(req, res) {
    ({lat, long} = req.query)
    var uvIndexURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`;
    fetch(uvIndexURL)
        .then(response => response.json())
        .then(data => {
            res.json({"uv": data.current.uvi})
        })
})

app.get("/get-location/zip", function(req, res) {
    const zip = req.query["zip"]
    var locationURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${apiKey}`
    fetch(locationURL)
        .then(response => response.json())
        .then(data => {
            lat = data.lat                                                                                  //// Changes made here, removed 'var' from before lat and long
            long = data.lon
            res.json({"lat": lat , "long": long})
        })
        .catch(error => {
            console.error("Did not receive weather data: ", error);
            res.status(800).json({ error : "Internal Server Error"})
        });

})




app.get('*', function (req, res) {
    res.render('404')
})

// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})

