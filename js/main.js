
// add event listener for initial layout
// msnry.on( 'layoutComplete', function( items ) {
//   msnry.layout();
// });
// trigger initial layout


const searchBox = document.getElementById('searchBox')
const searchButton = document.getElementById('searchButton')
const errorMessage = document.getElementById('errorMessage')
const imageBox = document.getElementById('imageBox')
const mapContainer = document.getElementById('mapContainer')
const errorBox = document.getElementById("error"); // Find the P element with the ID of error
const pageLoading = document.getElementById("loadingSpinner"); // Loading spinner displayed when api is fetching
// window.addEventListener('load', searchCityData) // Adds an event listener to the window that detects the load event

// this function returns a promise that resolves after n milliseconds
const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));

searchButton.addEventListener("click", search) //Add click event listener to search button

const pixaBaseURL = 'https://pixabay.com/api/'
const pixaApiKey = '40691540-3e797e9dfb04505d14334f2aa'

const geoBaseURL = ''
const geoAPIKey = 'qTKvlimnn76FUoDd227QGneOana1wTZWf_ehfEd9bYM'

const weatherBaseURL = ''
const weatherAPIKey = 'fb879606d40b4356bc0535afa14c649d'




/**
 * Moves the map to display over Berlin
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */

  
  /**
   * Boilerplate map initialization code starts below:
   */
  
  //Step 1: initialize communication with the platform
  // In your own code, replace variable window.apikey with your own apikey
  var platform = new H.service.Platform({
    apikey: 'qTKvlimnn76FUoDd227QGneOana1wTZWf_ehfEd9bYM'
  });
  var defaultLayers = platform.createDefaultLayers();
  
  //Step 2: initialize a map - this map is centered over Europe
  var map = new H.Map(document.getElementById('cityMap'),
    defaultLayers.vector.normal.map,{
    center: {lat:0, lng:0},
    zoom: 2,
    pixelRatio: window.devicePixelRatio || 1
  });
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  // Get an instance of the search service:
  var service = platform.getSearchService();

  // Call the "autosuggest" method with the search parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  service.autosuggest({
    // Search query
    q: 'Chicago ORD',
    // Center of the search context
    at: '38.71014896078624,-98.60787954719035'
  }, (result) => {
    let {position, title} = result.items[0];
    // Assumption: ui is instantiated
    // Create an InfoBubble at the returned location
    ui.addBubble(new H.ui.InfoBubble(position, {
      content: title
    }));
  }, alert);
  

//   END HERE API

// The function that attempts to validate the text entry, starts the APIs and changes the visuals on the page
function search(){
  // Very basic textbox validation
  if (searchBox.value == "") {
    
    errorBox.innerHTML = "The search box is empty!"
    return
  } else {
    errorBox.innerHTML = ""
    document.getElementById("headerText").classList.add("searchClicked")
    document.getElementById("headerText").onanimationend = () => {document.getElementById("headerH").style.display='none'}
    pageLoading.classList.add("loading")
    const query = searchBox.value
    searchCityData(query)
  }
}

//Call to the API's and display the information
async function searchCityData(query) {
    //Try and run the following code
    try {

        
        
        //find item
        let geo = await fetch(`https://geocode.search.hereapi.com/v1/geocode?limit=20&q=${query}&apiKey=${geoAPIKey}`)

        let photo = await fetch(`${pixaBaseURL}?key=${pixaApiKey}&q=${query}&image_type=photo&per_page=40`)
        const data = {images:await photo.json(), location:await geo.json()} //Get a list of random facts from the response
        displayData(data) //Pass the list of random facts to the displayData function
        const lat = data.location.items[0].position.lat
        console.log(lat)
        const lon = data.location.items[0].position.lng
        console.log(lon)
        const address = data.location.items[0].address.city
        let weather = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${weatherAPIKey}`)
        const cityWeatherData = {forecast:await weather.json()}
        console.log(cityWeatherData)
        moveMap(map,lat,lon)
        
        landmarkData(lat,lon)
        displayWeatherData(cityWeatherData)

        await wait(10000)
        mapContainer.classList.remove("visually-hidden")
        await wait(3000)
        pageLoading.classList.remove("loading")
        map.getViewPort().resize()
        await wait(3000)
        document.getElementById("weatherCard").style.opacity='100'
        
        
    }
    //Catch the error if it the code in the try block fails
    catch (error) {
        console.log(error); //Output the error to the console
        errorBox.innerHTML = "Sorry there's an error! 🤕" // Displays a error message
    }
}

//Moves the map to the city typed in the search bar
function moveMap(map,lat,lon){
  map.setCenter({lat:lat, lng:lon});
  map.setZoom(12);
}



//Displays the data on the page
//Parameters: Data - The data to display from the API
async function displayData(data) {
  
    //Loop over the array of random facts 

    for (var i = 0; i < data.images.hits.length; i++) {
        let col = document.createElement("div") //Create a div element to display the data
        col.classList.add("col-3", "p-0")
        col.innerHTML = `<img src="${data.images.hits[i].largeImageURL}"></img>` //Add the first fact to the p element
        imageBox.appendChild(col); //Append the p element to the facts div on the page
        await wait(500)
        
        var msnry = new Masonry( '#imageBox', {
          percentPosition: true,
          // disable initial layout
          
        });
      
    }
    
}

async function landmarkData(lat,lon) {
  // let landmarks = await fetch(`https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${geoAPIKey}&mode=retrieveLandmarks&prox=${lat},${lon},1000`)
  // console.log(landmarks)

  // Call the reverse geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
// service.reverseGeocode({
//   in: `circle,${lat},${lon},1000`,
//   mode: 'retrieveLandmarks' 
// }, (result) => {
//   console.log(result)
//   result.items.forEach((item) => {
//     // Assumption: ui is instantiated
//     // Create an InfoBubble at the returned location with
//     // the address as its contents:
//     ui.addBubble(new H.ui.InfoBubble(item.position, {
//       content: item.address.label
//     }));
//   });
// }, alert);
}

async function displayWeatherData(cityWeatherData) {
  const wCityName = document.getElementById("wCityName")
  wCityName.innerHTML = cityWeatherData.forecast.data[0].city_name
  
  const wCityTime = document.getElementById("wCityTime")
  const cTimeDate = cityWeatherData.forecast.data[0].ob_time
  const convertedTime = cTimeDate.split(" ")
  wCityTime.innerHTML = convertedTime[1]

  const wCityTemp = document.getElementById("wCityTemp")
  wCityTemp.innerHTML = `${cityWeatherData.forecast.data[0].app_temp}°C`

  const wCityCondition = document.getElementById("wCityCondition")
  wCityCondition.innerHTML = cityWeatherData.forecast.data[0].weather.description

  const wCityWind = document.getElementById("wCityWind")
  wCityWind.innerHTML = `${cityWeatherData.forecast.data[0].wind_spd} km/h`

  const wCityHumid = document.getElementById("wCityHumid")
  wCityHumid.innerHTML = `${cityWeatherData.forecast.data[0].rh}%`

  const wCityIcon = document.getElementById("wCityIcon")
  wCityIcon.innerHTML = `<img src="../images/w_icons/${cityWeatherData.forecast.data[0].weather.icon}.png"></img>`
}