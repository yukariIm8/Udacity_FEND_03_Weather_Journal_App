// Setup empty JS object to act as endpoint for all routes
projectData = {};
let history = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8000;
const server = app.listen(port, listening);

function listening() {
    console.log(`Server is running on local host: ${port}`);
};

// POST route for current weather data
app.post('/add', postData);

function postData(request, response) {
    projectData = {
        place: request.body.place,
        date: request.body.date,
        temperature: request.body.temperature,
        icon: request.body.icon,
        description: request.body.description,
        feelings: request.body.feelings,
    };
    history.push(projectData);
    response.send(projectData);
    console.log(projectData);
};

// GET route for current weather data
app.get('/all', getData);

function getData(request, response) {
    response.send(projectData);
};

// GET route for historical data
app.get('/history', getHistory);

function getHistory(request, response) {
    response.send(history);
};