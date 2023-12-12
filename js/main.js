
// add event listener for initial layout
// msnry.on( 'layoutComplete', function( items ) {
//   msnry.layout();
// });
// trigger initial layout


const searchBox = document.getElementById('searchBox')
const searchButton = document.getElementById('searchButton')
const errorMessage = document.getElementById('errorMessage')
const imageBox = document.getElementById('imageBox')
// window.addEventListener('load', searchCityData) // Adds an event listener to the window that detects the load event

searchButton.addEventListener("click", search)

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
  

//   END HERE API

function search(){
    const query = searchBox.value
    searchCityData(query)
    // searchBox.value = ""
}

//Call to the API and get a list of random cat facts
async function searchCityData(query) {
    //Try and run the following code
    try {
        
        //find item
        let geo = await fetch(`https://geocode.search.hereapi.com/v1/geocode?limit=20&q=${query}&apiKey=${geoAPIKey}`)

        let photo = await fetch(`${pixaBaseURL}?key=${pixaApiKey}&q=${query}&image_type=photo&per_page=40`)
        const data = {images:await photo.json(), location:await geo.json()} //Get a list of random facts from the response
        console.log(data); //Output the list of random facts to the console
        console.log(await data.images.hits[0].largeImageURL)
        const lat = data.location.items[0].position.lat
        console.log(lat)
        const lon = data.location.items[0].position.lng
        console.log(lon)
        const address = data.location.items[0].address.city
        let weather = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weatherAPIKey}`)
        const cityWeatherData = {forecast:await weather.json()}
        console.log(cityWeatherData)
        moveMap(map,lat,lon)
        displayData(data) //Pass the list of random facts to the displayData function
    }
    //Catch the error if it the code in the try block fails
    catch (error) {
        console.log(error); //Output the error to the console
        const p = document.getElementById("error"); // Find the P element with the ID of error
        p.innerHTML = "Sorry there's an error! 🤕" // Displays a error message
    }
}

//Moves the map to the city typed in the search bar
function moveMap(map,lat,lon){
  map.setCenter({lat:lat, lng:lon});
  map.setZoom(12);
}



//Displays the data on the page
//Parameters: Data - The data to display from the API
function displayData(data) {
  
    //Loop over the array of random facts 

    for (var i = 0; i < data.images.hits.length; i++) {
        let col = document.createElement("div") //Create a div element to display the data
        col.classList.add("col-3", "p-0")
        col.innerHTML = `<img src="${data.images.hits[i].largeImageURL}"></img>` //Add the first fact to the p element
        imageBox.appendChild(col); //Append the p element to the facts div on the page
        setTimeout(() => {
        var msnry = new Masonry( '#imageBox', {
          percentPosition: true,
          // disable initial layout
          
        });
      }, 4000)
    }
    
}