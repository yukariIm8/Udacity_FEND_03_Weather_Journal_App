/* Global Variables */
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=76f0d1944e34bdf55a5bc9afa7ca8345';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// Async GET request to the OpenWeatherMap API.
const getWeather = async (baseURL, zip, apiKey) => {
    const request = await fetch(baseURL+zip+apiKey)
    try {
        const data = await request.json();
        return data;
    } catch(error) {
        console.log("error", error);
    }
}

// Async POST request to add the API data.
const postWeather = async ( url = '', data = {})=>{

    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  });

    try {
      const newData = await response.json();
      return newData
    }catch(error) {
    console.log("error", error);
    }
}

// Add event listner to the generate button.
document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
    const zip = document.getElementById('zip').value;
    const userFeel = document.getElementById('feelings').value;
    // GET all the weather data
    getWeather(baseURL,zip,apiKey)
    .then(function(data){
        console.log(data)
        // POST some data to the app.
        postWeather('/add', {
            temperature: data.main.temp,
            date: newDate,
            feelings: userFeel
        });
    })
    .then(()=>updateUI())
};

// Update UI
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const data = await request.json();
        console.log(data);
        document.getElementById('date').innerHTML = data.date;
        document.getElementById('temp').innerHTML = data.temperature;
        document.getElementById('content').innerHTML = data.feelings;
    } catch(error) {
        console.log("error", error);
    }
}