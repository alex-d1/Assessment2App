/** Find elements in document */
const searchBox = document.getElementById('searchBox')
const searchButton = document.getElementById('searchButton')
const errorMessage = document.getElementById('errorMessage')
const imageBox = document.getElementById('imageBox')
const mapContainer = document.getElementById('mapContainer')
const errorBox = document.getElementById("error");
const pageLoading = document.getElementById("loadingSpinner"); // Loading spinner displayed when api is fetching

/** This function is used to pause operations to let things load */
const wait = (n) => new Promise((resolve) => setTimeout(resolve, n)); 

/** Add click event listener to search button */
searchButton.addEventListener("click", search) 

const pixaBaseURL = 'https://pixabay.com/api/' //Stores the pixabay api url
const pixaApiKey = '40691540-3e797e9dfb04505d14334f2aa' //Stores the api key

const geoBaseURL = 'https://geocode.search.hereapi.com/v1/geocode'
const geoAPIKey = 'qTKvlimnn76FUoDd227QGneOana1wTZWf_ehfEd9bYM' //Stores the here api key

const weatherBaseURL = 'https://api.weatherbit.io/v2.0/'
const weatherAPIKey = 'fb879606d40b4356bc0535afa14c649d' //Stores the weatherkit api key





  
  // new here map object
  var platform = new H.service.Platform({
    apikey: `${geoAPIKey}` //here map api key
  });
  var defaultLayers = platform.createDefaultLayers(); //load map layers
  
  // initialize the map object
  var map = new H.Map(document.getElementById('cityMap'),
    defaultLayers.vector.normal.map,{
    center: {lat:0, lng:0},
    zoom: 2,
    pixelRatio: window.devicePixelRatio || 1
  });
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  //enables map interaction
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  // Get an instance of the search service:
  var service = platform.getSearchService();



// The function that attempts to validate the text entry, starts the APIs and changes the visuals on the page
function search(){
  // Very basic textbox validation
  if (searchBox.value == "") {
    errorBox.innerHTML = "The search box is empty!" //displays message on page
    return //stops function
  } else {
    errorBox.innerHTML = "" //clears any error message
    document.getElementById("headerText").classList.add("searchClicked") //applies class to a container when the search button is clicked
    document.getElementById("headerText").onanimationend = () => {document.getElementById("headerH").style.display='none'} //removes the h1 from display completely when animation ends
    pageLoading.classList.add("loading") //adds visibility class to a loading spinner
    const query = searchBox.value //query is equal to the text typed in search box
    searchCityData(query) //run function with query value
  }
}

//Call to the API's and display the information, this is the main function of the app
async function searchCityData(query) {
    //Try and run the following code
    try {

        let geo = await fetch(`${geoBaseURL}?limit=20&q=${query}&apiKey=${geoAPIKey}`) //geo fetches the here api information

        let photo = await fetch(`${pixaBaseURL}?key=${pixaApiKey}&q=${query}&image_type=photo&per_page=40`) //photo fetches the pixabay api information
        const data = {images:await photo.json(), location:await geo.json()} //data object that contains the geo and photo responses, converted to json format
        displayData(data) //pass the here and pixabay api information off to be displayed

        const lat = data.location.items[0].position.lat //store latitude value from here api json result
        const lon = data.location.items[0].position.lng //store longitude value from here api json result

        let weather = await fetch(`${weatherBaseURL}current?lat=${lat}&lon=${lon}&key=${weatherAPIKey}`) //fetche weatherbit api results for city and store in weather variable
        const cityWeatherData = {forecast:await weather.json()} //convert weather api result to json format

        moveMap(map,lat,lon) //change location of here api map object to the city
        
        landmarkData(lat,lon) //send city coordinates to the landmark search function

        displayWeatherData(cityWeatherData) //send city weather to the display weather function

        await wait(10000) //apply a wait of 10 seconds to the function, this allows pictures to load before the map opens
        mapContainer.classList.remove("visually-hidden") //removes the hide class from the map
        await wait(3000) //3 second wait to make sure animations finish
        pageLoading.classList.remove("loading") //hide the loading spinner
        map.getViewPort().resize() //now that the map is visible, size to the new viewport 
        await wait(3000) //wait 3 seconds
        document.getElementById("weatherCard").style.opacity='100' //makes the weather card visible
        
        
    }
    //Catch the error if the code in the try block fails
    catch (error) {
        console.log(error); //Output the error to the console
        errorBox.innerHTML = "Sorry there's an error! 🤕" // Displays a error message
    }
}

//Moves the map to the city typed in the search bar
function moveMap(map,lat,lon){
  map.setCenter({lat:lat, lng:lon}); //map center on lat and lon
  map.setZoom(12); //zooms map in
}



//Displays the data on the page
//Parameters: Data - The data to display from the API
async function displayData(data) {
  
    //Loop over the array of images

    for (var i = 0; i < data.images.hits.length; i++) {
        let col = document.createElement("div") //Create a div element to display the data
        col.classList.add("col-3", "p-0") //adds bootstrap classes to the div, makes it a flexbox column
        col.innerHTML = `<img src="${data.images.hits[i].largeImageURL}"></img>` //adds image element from pixabay to the div
        imageBox.appendChild(col); //Append the div element to the page
        await wait(500) //wait 5 seconds
        
        // this is the masonry object that makes sure the images don't leave gaps no matter what size they are
        // (putting it here seems wrong but it works)
        var msnry = new Masonry( '#imageBox', {
          percentPosition: true,
        });
    }
    
}

//Finds landmarks around lat and lon values
//Parameters: lat - latitude value from here api geocode search
//lon - longitude value from here api geocode search
//(I couldn't really get this to work properly, the documentation for the here api is atrocious)
async function landmarkData(lat,lon) {

//calls the reverse geocode method on the service object from the here api, declared above
service.reverseGeocode({
  at: `${lat},${lon},1000`, 
  mode: 'retrieveLandmarks' 
}, (result) => {
  result.items.forEach((item) => {
    // Assumption: ui is instantiated
    // Create an InfoBubble at the returned location with
    // the address as its contents:
    ui.addBubble(new H.ui.InfoBubble(item.position, {
      content: item.address.label
    }));
  });
}, alert);
}


//Finds the page elements for the weather data and sends it to the dom
//Parameters: cityWeatherData - the json response from weatherbit api
async function displayWeatherData(cityWeatherData) {
  const wCityName = document.getElementById("wCityName")
  wCityName.innerHTML = cityWeatherData.forecast.data[0].city_name
  
  const wCityTime = document.getElementById("wCityTime")
  const cTimeDate = cityWeatherData.forecast.data[0].ob_time
  const convertedTime = cTimeDate.split(" ") //the string has to be split because it includes the date but we only want the time
  wCityTime.innerHTML = convertedTime[1] //date is [0] and time is [1] in the array

  const wCityTemp = document.getElementById("wCityTemp")
  wCityTemp.innerHTML = `${cityWeatherData.forecast.data[0].app_temp}°C`

  const wCityCondition = document.getElementById("wCityCondition")
  wCityCondition.innerHTML = cityWeatherData.forecast.data[0].weather.description

  const wCityWind = document.getElementById("wCityWind")
  wCityWind.innerHTML = `${cityWeatherData.forecast.data[0].wind_spd} km/h`

  const wCityHumid = document.getElementById("wCityHumid")
  wCityHumid.innerHTML = `${cityWeatherData.forecast.data[0].rh}%`

  const wCityIcon = document.getElementById("wCityIcon")
  wCityIcon.innerHTML = `<img src="../images/w_icons/${cityWeatherData.forecast.data[0].weather.icon}.png"></img>` //the weatherbit api has codes for icons that display the weather conditions, this is how it is displayed
}