const factsDiv = document.getElementById("facts"); // Find div to display data
const searchBox = document.getElementById('searchBox')
const searchButton = document.getElementById('searchButton')
const errorMessage = document.getElementById('errorMessage')
// window.addEventListener('load', searchCityData) // Adds an event listener to the window that detects the load event

searchButton.addEventListener("click", search)

const pixaBaseURL = 'https://pixabay.com/api/'
const pixaApiKey = '40691540-3e797e9dfb04505d14334f2aa'

const geoBaseURL = ''
const geoAPIKey = ''

// let map = L.map('cityMap').setView([0, 0], 4)
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

/**
 * Moves the map to display over Berlin
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function moveMapToBerlin(map){
    map.setCenter({lat:52.5159, lng:13.3777});
    map.setZoom(14);
  }
  
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
    center: {lat:50, lng:5},
    zoom: 4,
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
  
  // Now use the map as required...
  window.onload = function () {
    moveMapToBerlin(map);
  }
//   END HERE API

function search(){
    const query = searchBox.value
    searchCityData(query)
    searchBox.value = ""
}

//Call to the API and get a list of random cat facts
async function searchCityData(query) {
    //Try and run the following code
    try {
        
        //find item
        let geo = await fetch(`https://geocode.search.hereapi.com/v1/geocode?limit=20&q=${query}&apiKey=qTKvlimnn76FUoDd227QGneOana1wTZWf_ehfEd9bYM`)
        console.log(geo)


        let photo = await fetch(`${pixaBaseURL}?key=${pixaApiKey}&q=${query}`)
        const data = {images:await photo.json(), location:await geo.json()} //Get a list of random facts from the response
        console.log(data); //Output the list of random facts to the console
        console.log(await data.images.hits[0].largeImageURL)
        displayData(data) //Pass the list of random facts to the displayData function
    }
    //Catch the error if it the code in the try block fails
    catch (error) {
        console.log(error); //Output the error to the console
        const p = document.getElementById("error"); // Find the P element with the ID of error
        p.innerHTML = "Sorry there's an error! 🤕" // Displays a error message
    }
}

//Displays the data on the page
//Parameters: Data - The data to display from the API
function displayData(data) {
    //Loop over the array of random facts 

    for (var i = 0; i < data.images.hits.length; i++) {
        const para = document.createElement("p"); //Create a p element to display the data
        para.innerHTML = `<img src="${data.images.hits[i].largeImageURL}"></img>` //Add the first fact to the p element
        factsDiv.appendChild(para); //Append the p element to the facts div on the page
    }
}