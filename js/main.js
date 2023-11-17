const factsDiv = document.getElementById("facts"); // Find div to display data
window.addEventListener('load', callRandomCatFactsAPI) // Adds an event listener to the window that detects the load event

const baseURL = 'https://pixabay.com/api/'
const apiKey = '40691540-3e797e9dfb04505d14334f2aa'

//Call to the API and get a list of random cat facts
async function callRandomCatFactsAPI() {
    //Try and run the following code
    try {
        
        //find item
        let res = await fetch(`${baseURL}?key=${apiKey}&q=sapporo`)
        const data = await res.json(); //Get a list of random facts from the response
        console.log(data); //Output the list of random facts to the console
        // console.log(data.track.image[0]["#text"])
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

    for (var i = 0; i < data.hits.length; i++) {
        const para = document.createElement("p"); //Create a p element to display the data
        para.innerHTML = `<img src="${data.hits[i].largeImageURL}"></img>` //Add the first fact to the p element
        factsDiv.appendChild(para); //Append the p element to the facts div on the page
    }
}