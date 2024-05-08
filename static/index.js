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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// WEATHER LOCATION AND DATA ///////////////////////////////////////////////////////////////////////////////////

var lat 
var long



// Make tutorial modal pop up on load and make 
document.addEventListener("DOMContentLoaded", function() {  
    document.getElementById("tutorial-modal").style.display = "block"       

    applyPreferences()

    // Sets up location function 
    const newLocationButton = document.getElementById("new-location-button")
    newLocationButton.addEventListener("click", getNewLocation)
})


// Initial ask for location to get weather data.
navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    getWeatherData(lat, long)
});

// Function to get weather data.
function getWeatherData(lat, long) {
    console.log(`== ${arguments.callee.name} called == `);
    fetch(`/weather-data/temp-ll?lat=${lat}&long=${long}`)
        .then(response => response.json())
        .then(data => {
            weather_info = data.data
            changeWeatherDisplayed()
            updateUVIndex(lat, long)
        })
        .catch(error => {
            console.error("ERROR: " , error)
        })
}


// Gets lat and long for newly inputted location based on zip 
function getNewLocation(event){
    console.log(`== ${arguments.callee.name} called == `);
    event.preventDefault()
    var zip = document.getElementById("new-location").value
    console.log(zip)
    fetch(`/get-location/zip?zip=${zip}`)
        .then(response => response.json())
        .then( data => {


            var lat = data["lat"]
            var long = data["long"]


            console.log("data:: " + data)
            console.log("lat, long: " + lat , long)

            getWeatherData(lat, long)
            
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
    console.log(`== ${arguments.callee.name} called == `);
    fetch(`/weather-data/uv?lat=${lat}&long=${long}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("uv-value").innerText = data.uv
        })
        .catch(error => {
            console.error("New UV could not be received: ", error) 
        })

}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//  Initializes item buttons to react to clicks
var itemButtons = document.querySelector(".item-selection").querySelectorAll('.small-button')
itemButtons.forEach(function(button){
    button.addEventListener("click", writeClothingInfo)
});


function writeClothingInfo(event) {
    console.log(`== ${arguments.callee.name} called == `);
    var id = event.target.id
    var item
    for(index in wardrobeContents){
        if(id === wardrobeContents[index].id){
            item = wardrobeContents[index]
            break
        }
    }

    // Updates name
    document.querySelector(".item-name").textContent = "Item: " + item["itemName"]
    // Update description
    document.getElementById("descr-content").textContent = getDescription(item)
}

function getDescription(item){
    console.log(`== ${arguments.callee.name} called == `);
    // Creates description / reasons why it was chosen
    var description = ""
    for (var key in preferences) {
        if (key in item) {
            description += key.charAt(0).toUpperCase() + key.slice(1) + ": " + preferences[key] + "\n"
        }
    }
    return description
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// MODALS ///////////////////////////////////////////////////////////////////////////////////////////////////////


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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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


// 
/////////////////////        Earthquake Modal      ///////////////////////
// 

// Variable to hold data of closest earthquake
var closest
document.getElementById("eq-button").addEventListener('click', getClosestEQData)

function getClosestEQData() {

    // URL to get data for closest EQ , uses current lat and long values
    const url = new URL('http://localhost:8000/get-closest-earthquake/?latitude='+ lat +'&longitude='+ long);
    
    fetch(url)
        .then(response => response.json())     
        .then(data => {
            closest = data.closest_earthquake
            eqData = {}
            eqData["title"] = closest.place
            eqData["magnitude"] = closest.magnitude
            eqData["place"] = closest.place
            eqData["time"] = closest.time
            getEQURL(closest.detail)
            // eqData["link"] = getEQURL(closest.detail)

            eqData["tsunami"] = closest.tsunami
            console.log(eqData)
            displayEQModal(eqData)
            
            
        })
        .catch(error => {
            console.error("Earthquake data not gotten correctly ", error);
        });

}


function displayEQModal(data){
    document.getElementById("eq-title").textContent = data["title"]
    document.getElementById("eq-magnitude").textContent = data["magnitude"]
    document.getElementById("eq-time").textContent = data["time"]

    document.getElementById("eq-tsunami").textContent = data["tsunami"] ? "Yes" : "No"

    document.getElementById("eq-modal").style.display = "block"
    
}

// Tutorial done button 
var closeEQ = document.getElementById("close-eq-done").addEventListener("click", closeEQModal)
function closeEQModal(){
    document.getElementById("eq-modal").style.display = "none"
}

function getEQURL(link) {
    fetch(link)
        .then(response => response.json())
        .then(data => {
            console.log(data["properties"]["url"]+'/executive')
            document.getElementById("eq-link").href = data["properties"]["url"]+'/executive'
        })
        .catch(error => {
            console.error("Error getting URL of details page for EQ: " , error)
        })
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////        Preferences Modal      ////////////////////////////////////////////////////////////////////////////////

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
document.getElementById("applyPreferences").addEventListener("click", applyPreferences)

function applyPreferences(){
    console.log(`== ${arguments.callee.name} called == preferences updated`);
    // Sets preferences 
    preferences.temperature = document.querySelector('input[name="temperature"]:checked').value;
    preferences.uvIndex = document.getElementById("uvIndex").checked;
    preferences.wayOfTravel = document.getElementById("wayOfTravel").value;
    preferences.stayingDry = document.getElementById("stayingDry").value;
    preferences.formality = document.getElementById("formality").value;
    preferences.gender = document.getElementById("gender").value;
  
    // savePreferences(preferences);    // Eventually, for when we can push to server and all that

    // Close the modal
    document.getElementById("preferencesModal").style.display = "none";

    // Update displayed suggestion based on new preferences
    updateSuggestion()

  };

  
  // If cancel button is pressed for preferences, check that it's okay if changes don't get saved.
document.getElementById("cancelPreferences").addEventListener("click", function(){
    if(window.confirm("Changes will not be saved. Proceed?")){
        revertPreferences()
    }
  });


function revertPreferences() {
    console.log(`== ${arguments.callee.name} called ==  preferences reverted to previous`);
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

  



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////       WARDROBE  //////////////////////////////////////////////////////////////////////////////////////////////////


// Make it appear with button 
const wardrobeButton = document.getElementById("wardrobe").addEventListener("click", function(){
    document.getElementById("addToWardrobe").style.display = "block"
})


// Wardrobe cancel Button 
const closeWardrobe = document.getElementById("wardrobeClose").addEventListener("click", function(){
    console.log(`== ${arguments.callee.name} called == `);
    var confirm = window.confirm("Input values will be lost. Proceed?")
    if(confirm){
        // Set all back to default 
        document.getElementById("itemName").value = '';
        document.getElementById("type-choice").value = defaultWardrobeInputs.type
        document.getElementById("temperature-choice").value = defaultWardrobeInputs.temperature;
        document.getElementById("formality-choice").value = defaultWardrobeInputs.formality;
        document.getElementById("gender-choice").value = defaultWardrobeInputs.gender;

        document.getElementById("addToWardrobe").style.display = "none"
    }
})


const wardrobeContents = [
    {
      "itemName": "Collared Shirt",
      "itemType": "Top",
      "temperature": "Neutral",
      "formality": "Formal",
      "gender": "None",
      "src": "/clothingitems/blouse.svg",
      "id": "blouse"
    },
    {
      "itemName": "Sweater",
      "itemType": "Top",
      "temperature": "Cold",
      "formality": "Casual",
      "gender": "None",
      "src": "/clothingitems/baby-knitwear.svg",
      "id": "baby-knitwear"
    },
    {
      "itemName": "Blouse",
      "itemType": "Top",
      "temperature": "Neutral",
      "formality": "Casual",
      "gender": "Female",
      "src": "/clothingitems/bolero-jacket.svg",
      "id": "bolero-jacket"
    },
    {
      "itemName": "Puffer",
      "itemType": "Top",
      "temperature": "Cold",
      "formality": "Casual",
      "gender": "None",
      "src": "/clothingitems/down-jacket.svg",
      "id": "down-jacket"
    },
    {
      "itemName": "Suit Jacket",
      "itemType": "Top",
      "temperature": "Neutral",
      "formality": "Formal",
      "gender": "None",
      "src": "/clothingitems/jacket-male.svg",
      "id": "jacket-male"
    },
    {
      "itemName": "Pants",
      "itemType": "Bottom",
      "temperature": "Neutral",
      "formality": "Casual",
      "gender": "None",
      "src": "/clothingitems/jeans-boy.svg",
      "id": "jeans-boy"
    },
    {
      "itemName": "Suit Pants",
      "itemType": "Bottom",
      "temperature": "Neutral",
      "formality": "Formal",
      "gender": "None",
      "src": "/clothingitems/jeans-boy.svg",
      "id": "jeans-boy"
    },
    {
      "itemName": "Dress",
      "temperature": "Neutral",
      "itemType": "Top",
      "formality": "Formal",
      "gender": "Female",
      "src": "/clothingitems/knitwear-dress.svg",
      "id": "knitwear-dress"
    },
    {
      "itemName": "Sweatpants",
      "itemType": "Bottom",
      "temperature": "Neutral",
      "formality": "Intimate",
      "gender": "None",
      "src": "/clothingitems/pants.svg",
      "id": "pants"
    },
    {
      "itemName": "Shorts",
      "itemType": "Bottom",
      "temperature": "Hot",
      "formality": "Casual",
      "gender": "None",
      "src": "/clothingitems/shorts.svg",
      "id": "shorts"
    },
    {
      "itemName": "Tank Top",
      "itemType": "Top",
      "temperature": "Hot",
      "formality": "Casual",
      "gender": "None",
      "src": "/clothingitems/singlet.svg",
      "id": "singlet"
    },
    {
      "itemName": "Skirt",
      "itemType": "Bottom",
      "temperature": "Neutral",
      "formality": "Casual",
      "gender": "Female",
      "src": "/clothingitems/skirt.svg",
      "id": "skirt"
    },
    {
      "itemName": "Hoodie",
      "itemType": "Top",
      "temperature": "Cold",
      "formality": "Casual",
      "gender": "None",
      "src": "/clothingitems/sport-jacket.svg",
      "id": "sport-jacket"
    },
    {
        "itemName": "Mittens",
        "itemType": "Accessory",
        "temperature": "Cold",
        "formality": "Casual",
        "gender": "None",
        "src": "/clothingitems/mittens-baby.svg",
        "id": "mittens-baby"
    },
    {
        "itemName": "Vest",
        "itemType": "Accessory",
        "temperature": "Neutral",
        "formality": "Casual",
        "gender": "None",
        "src": "/clothingitems/jerkin.svg",
        "id": "jerkin"
    },
    {
        "itemName": "Long Sleeve",
        "itemType": "Top",
        "temperature": "Neutral",
        "formality": "Casual",
        "gender": "Male",
        "src": "/clothingitems/tshirt-sleeved.svg",
        "id": "tshirt-sleeved"
    },
    {
        "itemName": "Tie",
        "itemType": "Accessory",
        "temperature": "Neutral",
        "formality": "Formal",
        "gender": "Male",
        "src": "/clothingitems/tie.svg",
        "id": "tie"
      }
  ]


const addToWardrobeButton = document.getElementById("addToWardrobeButton").addEventListener("click", addWardrobeItem)
function addWardrobeItem(){
    console.log(`== ${arguments.callee.name} called == `);
    
    var desiredImage = document.querySelector('input[name="selectedImage"]:checked')
    var imageURL = desiredImage.previousElementSibling.getAttribute("src")

    setNewItem(imageURL)

    defaultWardrobeInputs()
}

function defaultWardrobeInputs() {
    const defaultInputs = {
        type: "Select",
        temperature :"Neutral",
        formality: "Casual",
        gender: "None"
    }
    // Set all back to default 
    document.getElementById("itemName").value = '';
    document.getElementById("type-choice").value = defaultInputs.type
    document.getElementById("temperature-choice").value = defaultInputs.temperature;
    document.getElementById("formality-choice").value = defaultInputs.formality;
    document.getElementById("gender-choice").value = defaultInputs.gender;

    
}

function setNewItem(imageURL){
    console.log(`== ${arguments.callee.name} called == `);

    var newItem = {}
    newItem["itemName"] = document.getElementById("itemName").value;
    itemType = document.getElementById("type-choice").value
    // Select cannot be chosen, an item type must be selected (unlike other preferences)
    if (itemType === "Select") {
        window.alert("You must select the item type.")
        return}
    newItem["itemType"] = itemType
    newItem["temperature"] = document.getElementById("temperature-choice").value;
    newItem["formality"] = document.getElementById("formality-choice").value;
    newItem["gender"] = document.getElementById("gender-choice").value;
    newItem["src"] = imageURL
    newItem["id"] = newItem.itemName.replace(" ", "-").toLowerCase()    // Uses new name as ID so that it is unique
    wardrobeContents.push(newItem)
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Suggestion change

const coldTemp = 40 // <=40 degrees F 
// Neutral is betwween 
const hotTemp  = 90 // >= 90 degrees F


function determineTempChange(){
    console.log(`== ${arguments.callee.name} called == `);
    // Multiplyer scale for calculating suggestion via temps 
    scale = 1
    // Most up to date weather info gotten
    var max_temp = weather_info["max-temp"]
    var min_temp = weather_info["min-temp"]
    var curr_temp = weather_info["current-temp"]
    // Increases severity of change (scale) if method of travel subjects user to extended time outdoors
    if(preferences.wayOfTravel.toLowerCase() === "walking" || preferences.wayOfTravel.toLowerCase() === "biking"){
        var scale = 2
    }
    // Makes our temperature lower if user preferes to be warmer 
    if(preferences.temperature.toLowerCase() == "hotter"){
        scale *= -1
    }
    // If it should be 
    if(preferences.temperature.toLowerCase() !== "neutral"){
        max_temp += (scale * 5)
        min_temp += (scale * 5)
        curr_temp += (scale * 5)    
    }
    return max_temp, min_temp, curr_temp
}



function findClothingItem(itemType, tempRange, formality, gender){
    console.log(`== ${arguments.callee.name} called == `);
    for(itemIndex in wardrobeContents){
        item = wardrobeContents[itemIndex]
        if(item.itemType == itemType){
            if(item.temperature === tempRange){
                if(item.formality === formality){
                    if(gender !== "None"){
                        if(item.gender === gender || item.gender === "None"){
                            return item
                        }
                    }
                    // Item found bc gender doesn't matter
                    else{
                        return item
                    }

                }
            }
        }
    }
}


function updateSuggestion() {
    console.log(`== ${arguments.callee.name} called == `);

    var max, min, curr = determineTempChange()

    // Determine if we'll change the UV container's visibility 
    checkToChangeUV()

    var range = "Neutral"
    if(curr >= hotTemp || max >= hotTemp){
        range = "Hot"
    }else if( curr <= coldTemp || max <= coldTemp){
        range = "Cold"
    }

    var suggestions = []
    suggestions.push(findClothingItem('Top', range, preferences.formality, preferences.gender))
    suggestions.push(findClothingItem('Bottom', range, preferences.formality, preferences.gender))
    suggestions.push(findClothingItem('Accessory', range, preferences.formality, preferences.gender))

    updateButtons(suggestions)
    updateDisplay(suggestions)

    checkToChangeStayingDry()

}


function updateButtons(suggestions) {
    console.log(`== ${arguments.callee.name} called == `);
     // All buttons to change in object form
    var itemButtons = document.querySelector(".item-selection").querySelectorAll('.small-button')
    // Same functionality of enumerate() in Python3
    suggestions.forEach(function(item, index){
        try{
            var button = itemButtons[index]
            button.id = item.id
            var img = button.querySelector("img")
            img.src = item.src
            img.alt = item.id
            button.querySelector("span").textContent = item.itemName
        } catch(error){
            // If it's a problem with not having the item in your wardrobe...
            if(error instanceof TypeError){
                window.alert("You don't have the clothing items in your wardrobe "+
                "to make a suggestion with your current preferences.\n" +
                "Some items may not be updated.")
                return
            } else
                console.log("An error occurred in updateButtons: ", error.message)

        }
    })
}

function updateDisplay(suggestions) {
    console.log(`== ${arguments.callee.name} called == `);
    // All images
    var displayImages = document.querySelector(".image-display-container").querySelectorAll("img")
    // Uses suggestions to update the images
    try{
        suggestions.forEach(function(item, index){
            var image = displayImages[index]
            image.src = item["src"]
            image.alt = item["itemName"]
        })
    } catch(error){
        console.log("An error occurred in updateDisplay: " + error.message)
    }
}

function checkToChangeUV() {
    console.log(`== ${arguments.callee.name} called == `);
    var uvContainer = document.getElementById("uv-index-container")
    if (preferences.uvIndex){
        uvContainer.style.display = 'block'
    }
    else{
        uvContainer.style.display = 'none'
    }
}

function checkToChangeStayingDry(){
    console.log(`== ${arguments.callee.name} called == `);
    var dry_suggestion = document.getElementById("dry-suggestion")

    if(preferences.stayingDry.toLowerCase() === "none"){
        dry_suggestion.style.display = 'none'
    } else{
        dry_suggestion.style.display = 'block'
        var pref = preferences.stayingDry.replace(" ", "-").toLowerCase()
        dry_suggestion.src = "/rainItems/" + pref + ".svg"
    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
