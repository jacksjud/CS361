

const apiKey = 'c56cc30f3df33acb43dd2b5911ed1d5d';      // personal api key

// Default weather info loaded on start, replaced once location is received
weather_info = {
    "location": "NONE",
    "max-temp": 66,
    "min-temp": 41,
    "current-temp": 52,
    "weather": 
        {
            "id": 500,
            "main": "Rain",
            "description": "light rain",
            "icon": "10n"
        }
    
}

///////////////////// WEATHER LOCATION AND DATA ////////////////////////

// Make tutorial modal pop up on load and make 
document.addEventListener("DOMContentLoaded", function() {  
    document.getElementById("tutorial-modal").style.display = "block"       

    // Sets up location function 
    const newLocationButton = document.getElementById("new-location-button")
    newLocationButton.addEventListener("click", getNewLocation)
})


// Initial ask for location to get weather data.
navigator.geolocation.getCurrentPosition((position) => {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    // const apiKey = 'c56cc30f3df33acb43dd2b5911ed1d5d';      // personal api key
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`;

    fetch(apiURL)
        .then(response => response.json())     
        .then(data => {
            var tempData = data.main        // Gets temperature data (temp, feels_like, max and min)
            var allData = data              // gets all other data
            
            weather_info["location"] = allData.name
            weather_info["max-temp"] = tempData.temp_max
            weather_info["min-temp"] = tempData.temp_min
            weather_info["current-temp"] = tempData.current_temp
            weather_info["weather"] = allData.weather[0]
            changeWeatherDisplayed()
            updateUVIndex(lat, long)
        })
        .catch(error => {
            console.error("Did not receive weather data: ", error);
        });
});

// Function to get weather data.
function getWeatherData(lat, long) {
    console.log("getWeatherData called -- ")
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`;
    console.log("getWeatherData fetch started")
    fetch(apiURL)
        .then(response => response.json())     
        .then(data => {
            var tempData = data.main        // Gets temperature data (temp, feels_like, max and min)
            var allData = data              // gets all other data
            
            weather_info["location"] = allData.name
            weather_info["max-temp"] = tempData.temp_max
            weather_info["min-temp"] = tempData.temp_min
            weather_info["current-temp"] = tempData.current_temp
            weather_info["weather"] = allData.weather[0]
            console.log("updated weather_info:", weather_info)
            changeWeatherDisplayed()
            updateUVIndex(lat, long)
        })
        .catch(error => {
            console.error("Did not receive weather data: ", error);
        });
}


// Gets lat and long for newly inputted location based on zip 
function getNewLocation(event){
    event.preventDefault()
    console.log("getNewLocation called -- ")
    var zip = document.getElementById("new-location").value
    console.log("zip: ", zip)
    var locationURL = 'http://api.openweathermap.org/geo/1.0/zip?zip='+ zip +',US&appid='+ apiKey;

    console.log("getNewLocation fetch started")
    fetch(locationURL)
        .then(response => response.json())
        .then(data => {
            var lat = data.lat
            var long = data.lon
            getWeatherData(lat, long);
        })
        .catch(error => {
            console.error("New location could not be received: ", error)
        })

}


// Changes Displayed weather: icon, description, location, and low and high temps 
function changeWeatherDisplayed(){
    document.getElementById("lowTemp").textContent = `${weather_info["min-temp"]}`;
    document.getElementById("highTemp").textContent = `${weather_info["max-temp"]}`;
    document.getElementById( "weather-location-title").textContent = `${weather_info["location"]}`;
    document.getElementById("weather-description").textContent = `${weather_info["weather"]["main"]}`
    // use icon code to get src for weather image of current conditions
    var iconcode = weather_info.weather.icon
    var iconURL = 'http://api.openweathermap.org/img/w/'+ iconcode +'.png';
    document.getElementById("weather-icon-img").setAttribute("src" , iconURL)
}

// Uses provided latitude and longitude to get UV Index and set value accordingly 
function updateUVIndex(lat, long){
   // var uvIndexURL = 'http://api.openweathermap.org/v3/uvi/' ',''/current.json?appid='+apiKey+''
    var uvIndexURL ='https://api.openweathermap.org/data/3.0/onecall?lat=' + lat+'&lon='+long+ '&appid=dc29d5e0a2cea7b7c5fbd5be13aaa950'
    fetch(uvIndexURL)
        .then(response => response.json())
        .then(data => {
            document.getElementById("uv-value").innerText = data.current.uvi   // Gets UV index from data, sets to val
        })
}








///////////////////// MODALS ////////////////////////


// 
//                          Login and Sign Up Modals
// 

// Big Button for Login/Signup  // Shows Sign Up Modal
var loginSignUpButton = document.getElementById("login-sign-up-button") 
loginSignUpButton.addEventListener("click", function () {
    document.getElementById("signUpModal").style.display = "block"      
})

// all X buttons work with 'close' class 
var close = document.querySelectorAll(".close")                         
close.forEach(function(button) {
    button.addEventListener("click", function() {
        this.closest(".modal").style.display = "none"
    });
});

// Make Cancel Button Work for Sign Up
var cancelSignUp = document.getElementById("cancelSignUp")      
cancelSignUp.addEventListener("click", function () {
    document.getElementById("signUpModal").style.display = "none"
})

// make cancel button work for login
var cancelSignUp = document.getElementById("cancelLogin")       
cancelSignUp.addEventListener("click", function () {
    document.getElementById("loginModal").style.display = "none"
})

// transfer from Sign up to Login
var loginButton = document.getElementById("login-button")           
loginButton.addEventListener("click", function () {
    document.getElementById("signUpModal").style.display = "none"   
    document.getElementById("loginModal").style.display = "block"
})

var signUpButton = document.getElementById("signUp-button")         // transfer from login to sign up
signUpButton.addEventListener("click", function () {
    document.getElementById("loginModal").style.display = "none"
    document.getElementById("signUpModal").style.display = "block"
})

var loginSubmit = document.getElementById("login-submit").addEventListener("click", logUserIn)
var signupSubmit = document.getElementById("signup-submit").addEventListener("click", signUpUser)

/////////// User login and Sign Up

users = {}

function logUserIn(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Check if username exists and password matches
    if (users.hasOwnProperty(username) && users[username] === password) {
        console.log("Login successful!");
    } else {
        console.log("Invalid username or password. Please try again.");
    }

    document.getElementById("loginModal").style.display = "none"
}

function signUpUser(){
     var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Check if username already exists
    if (users.hasOwnProperty(username)) {
        console.log("Username already exists. Please choose a different username.");
    } else {
        users[username] = password;
        console.log("User signed up successfully!");
        console.log(users);
    }
    document.getElementById("signUpModal").style.display = "none"
}


// 
/////////////////////        Tutorial Modal      ///////////////////////
// 

// Tutorial Button 
var tutorialButton = document.getElementById("tutorial-button")
tutorialButton.addEventListener("click", function() {
    document.getElementById("tutorial-modal").style.display = "block"
})

// Tutorial done button 
var closeTut = document.getElementById("close-tut-done").addEventListener("click", function(){
    document.getElementById("tutorial-modal").style.display = "none"
})





/////////////////////        Preferences Modal      ///////////////////////

// Default preferences 
const preferences = {   temperature: "neutral", 
                        uvIndex: true, 
                        wayOfTravel: "None", 
                        stayingDry: "None", 
                        formality: "Casual", 
                        gender: "None" };

// Preferences Button                         
document.getElementById("preferences").addEventListener("click", function() {
    document.getElementById("preferencesModal").style.display = "block"
})



//  Apply button on Preferences Modal 
document.getElementById("applyPreferences").addEventListener("click", function() {
  
    preferences.temperature = document.querySelector('input[name="temperature"]:checked').value;
    preferences.uvIndex = document.getElementById("uvIndex").checked;
    preferences.wayOfTravel = document.getElementById("wayOfTravel").value;
    preferences.stayingDry = document.getElementById("stayingDry").value;
    preferences.formality = document.getElementById("formality").value;
    preferences.gender = document.getElementById("gender").value;
  
    // savePreferences(preferences);    // Eventually, for when we can push to server and all that
    
    checkToChange()

    // Close the modal
    document.getElementById("preferencesModal").style.display = "none";
  });
  
  // If cancel button is pressed for preferences, check that it's okay if changes don't get saved.
  document.getElementById("cancelPreferences").addEventListener("click", function() {

    var confirm = window.confirm("Changes will not be saved. Proceed?")
    
    if(confirm){
        // erase data to whatever previous was.
        document.querySelector('input[name="temperature"][value="' + preferences.temperature + '"]').checked = true;
        document.getElementById("uvIndex").checked = preferences.uvIndex;
        document.getElementById("wayOfTravel").value = preferences.wayOfTravel;
        document.getElementById("stayingDry").value = preferences.stayingDry;
        document.getElementById("formality").value = preferences.formality;
        document.getElementById("gender").value = preferences.gender;
        // Close the modal without saving preferences
        document.getElementById("preferencesModal").style.display = "none";
    }

  });
  

function checkToChange() {
    var uvContainer = document.getElementById("uv-index-container")
    console.log(uvContainer)
    if (preferences.uvIndex){
        uvContainer.style.display = 'block'
    }
    else{
        uvContainer.style.display = 'none'
    }
}


/////////////////       WARDROBE  //////////////

var userWardrobe = {}


// Make it appear with button 
const wardrobeButton = document.getElementById("wardrobe").addEventListener("click", function(){
    document.getElementById("wardrobeModal").style.display = "block"
})

const wardrobeApply = document.getElementById("wardrobeApply").addEventListener("click", function() {
    var allClothes = document.querySelectorAll(".post")
    allClothes.forEach(function(post){
        if(post.querySelector('input').checked){  // If selected 
            if(!post.id in userWardrobe){   // if not already in users wardrobe 
                var id = post.id;
                var src = post.querySelector('img').src
                var description = post.querySelector('img').alt
                userWardrobe[id] = {"url": src,                 // Add to user library w/ ID as key
                                    "description": description}
            }
        }
        else if(post.id in userWardrobe){           // Delete item if it is in wardrobe but not selected
            delete userWardrobe.post.id
        }
    })
    document.getElementById("wardrobeModal").style.display = "none"
})



// Wardrobe cancel Button 
const closeWardrobe = document.getElementById("wardrobeClose").addEventListener("click", function(){
    var confirm = window.confirm("Changes will not be saved. Proceed?")
    if(confirm){
        document.getElementById("wardrobeModal").style.display = "none"
    }
})









///////////// Potential input for clothing items ??

// const fs = require('fs');
// const path = require('path');

// function saveSVGFileInfo(folderPath, jsonDataFilePath) {
//     const clothingData = [];

//     fs.readdir(folderPath, (err, files) => {
//         if (err) {
//             console.error('Error reading folder:', err);
//             return;
//         }

//         files.forEach(file => {
//             if (path.extname(file) === '.svg') {
//                 const id = path.basename(file, '.svg').replace(/-svgrepo-com/g, '');
//                 const newFileName = id + '.svg';
//                 const url = `/clothingitems/${newFileName}`;
//                 const description = `${id}`;
//                 const scale = '.3';

//                 clothingData.push({ id, url, description, scale });

//                 // Rename the file
//                 fs.rename(path.join(folderPath, file), path.join(folderPath, newFileName), err => {
//                     if (err) {
//                         console.error('Error renaming file:', err);
//                         return;
//                     }
//                 });
//             }
//         });

//         fs.writeFile(jsonDataFilePath, JSON.stringify(clothingData, null, 2), err => {
//             if (err) {
//                 console.error('Error writing JSON data:', err);
//                 return;
//             }
//             console.log('SVG file information saved successfully.');
//         });
//     });
// }

// saveSVGFileInfo('./clothingitems', './clothingData.json');




