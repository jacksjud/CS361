const fs = require('fs/promises');
const path = require('path');
const hb_adapter = require('express-handlebars');
var express = require('express')
// var exphbs = require("express-handlebars")

var dataToUse = require("./defaultData.json")
//console.log("dataToUse.weather:", dataToUse.weather)
var buttonData = require("./buttonData.json")
//console.log("buttonData:", buttonData)
const clothingData = require("./clothingData.json")
////console.log("clothingData.slice:", clothingData.slice)
//console.log("clothingData.slice(0,3)[0].description:", clothingData.slice(0,3)[0].description)
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


console.log("clothing Data:",clothingData)
console.log("default Clothes: ",defaultClothes)

// Use handlebars
app.engine('handlebars', hb_adapter.engine({ defaultLayout: "main" }))   // sets up template engine (handlebars)
app.set('view engine', 'handlebars')            // sets up view engine 
app.set('views', './views')                // registers where templates are

app.get("/" , function(req, res) {
    res.render('body',{
        smallButtons: buttonData,       // for Wardrobe and Preferences Buttons
        weather: dataToUse.weather,     // for weather
        chosenClothing: defaultClothes,    // for clothing -> sends array of clothing 
        first: defaultClothes[0].description,  
        tabs: tabs,                      // for tabs
        displayUV: true,                 // constant for now, will change once the user files are used 
        wardrobeItems: clothingData         // array of all clothes available
    })
})

app.get('*', function (req, res) {
    res.render('404')
})

// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})

