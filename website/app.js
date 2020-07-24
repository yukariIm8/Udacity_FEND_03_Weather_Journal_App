// Global Variables
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=76f0d1944e34bdf55a5bc9afa7ca8345&units=imperial';


// Create a new date instance dynamically with JS
const monArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let d = new Date();
let newDate = monArr[d.getMonth()]+'. '+ ('0'+d.getDate()).slice(-2)+'. '+ d.getFullYear()+'. '+ ('0'+d.getHours()).slice(-2) +':'+ ('0'+d.getMinutes()).slice(-2);


// Async GET request to the OpenWeatherMap API.
const getWeather = async (baseURL, zip, apiKey) => {
    const request = await fetch(baseURL+zip+apiKey)

    try {
        const data = await request.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};


// Async POST request to add the API data.
const postWeather = async (url='', data={}) => {
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
    } catch (error) {
    console.log('error', error);
    }
};


// Update UI
const updateUI = async () => {
  const request = await fetch('/all');

  try {
      const data = await request.json();
      const parent = document.getElementById('entry-holder');
      parent.setAttribute('class', 'entry');

      while(parent.firstChild){
        parent.removeChild(parent.firstChild);
      }

      const htmlSnippet =
      `<div class="box-place-date">
        <h2 class="place">${data.place}</h2>
        <h3 class="date">${data.date}</h3>
      </div>
      <div class="box-temp-icon-desc">
        <p class="temp">${data.temperature}<span>°F</span></p>
        <div class="box-icon-desc">
          <img src=${data.icon} alt="weather-icon">
          <h4 class="description">${data.description}</h4>
        </div>
      </div>
      <div class="box-feeling-content">
        <h4 class="feeling">feeling</h4>
        <p class="content">${data.feelings}</p>
      </div>`;

      parent.insertAdjacentHTML('beforeend', htmlSnippet);

  } catch(error) {
      console.log('error', error);
  }
};


// Populate entry history
const populateHistory = async () => {
  const request = await fetch('/history');

  try {
      const data = await request.json();
      const parent = document.getElementById('history-list');

      while(parent.firstChild){
        parent.removeChild(parent.firstChild);
      }

      for(let i = 0; i < data.length; i++) {
        const newListItem = document.createElement('li');
        newListItem.setAttribute('class', 'history-card');
        parent.insertBefore(newListItem, parent.childNodes[0]);

        const htmlSnippet =
          `<div class="box-place-date">
            <h2 class="place">${data[i].place}</h2>
            <h3 class="date">${data[i].date}</h3>
          </div>
          <div class="box-temp-icon-desc">
            <p class="temp">${data[i].temperature}<span>°F</span></p>
            <div class="box-icon-desc">
              <img src=${data[i].icon} alt="weather-icon">
              <h4 class="description">${data[i].description}</h4>
            </div>
          </div>
          <div class="box-feeling-content" id="box-feeling">
            <h4 class="feeling">feeling</h4>
            <p class="content">${data[i].feelings}</p>
          </div>`;
        newListItem.insertAdjacentHTML('beforeend', htmlSnippet);
      }
  } catch(error) {
      console.log('error', error);
  }
};


// Add event listner to the generate button.
document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
    const zip = document.getElementById('zip').value;
    if (!zip) {
      alert('Zip Code is required.');
    }
    const feelings = document.getElementById('feelings').value;
    getWeather(baseURL,zip,apiKey)  // GET all the weather data
    .then(function(data) {          // POST some data to the app
        postWeather('/add', {
            place: data.name,
            date: newDate,
            temperature: Math.ceil(data.main.temp),
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            description: data.weather[0].description,
            feelings: feelings,
        });
    })
    .then(()=>updateUI())           // Update Most Recent Entry
    .then(()=>populateHistory())    // Update History
}


// Show the pagetop button when the user scrolls down 100px from the top of the document 
const pageTopButton = document.getElementById('page-top');

const showButton = () => {
  let y = window.scrollY;
  if (y > 100) {
    pageTopButton.className = 'top-button show';
  } else {
    pageTopButton.className = 'top-button hide';
  }
};

const showPageTop = () => {
  window.addEventListener('scroll', showButton);
};


// Scroll to page top if the user click the page top button
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 40);
  }
};

const goTop = () => {
  pageTopButton.onclick = function(e) {
  e.preventDefault();
  scrollToTop();
  }
};


// Show page top button
showPageTop();


// Scroll to page top
goTop();