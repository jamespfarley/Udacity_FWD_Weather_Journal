// Personal API Key for OpenWeatherMap API
/** ZIP code API call format : api.openweathermap.org/data/2.5/weather?zip={zip code},{country code, default=US}&appid={your api key} */
const openWeatherMapAPIkey = '&appid=e4fa00c5c00a4b4f38f350a516b57260';
const unitsFormats = '&units=imperial';
const noDataFound = "No weather data found for zipcode ";

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', getWeather);
addzipCodeFocus();


// Add focus to zip code input
function addzipCodeFocus(){
    document.getElementById('zip').focus();
}

/* Function called by event listener */
function getWeather(event){
    event.preventDefault();

    // !!!
    console.log('... app.js : getWeather()');

    const zipCode = document.getElementById('zip').value;
    document.getElementById('errMsg').innerHTML = "";
    document.getElementById('intro').innerHTML = "";

    if ( zipCode.length < 5 ){

        document.getElementById("errMsg").innerHTML = "Please enter a valid 5 digit zip code"
        return;

    } else {

        const feelings = document.getElementById('feelings').value;
        const openWeatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}${unitsFormats}${openWeatherMapAPIkey}`;

        getWeatherByZip(openWeatherURL, zipCode)
        .then((data) => postData('http://localhost:8080/all', { temperature: data.main.temp
                                                                , date: data.dt
                                                                , city: data.name
                                                                , userResponse: feelings }))
        .then(() => updateUI())
        .catch((error) => {console.error(`getWeather() chained promises :: error: ${error}`)});
    }

    addzipCodeFocus();
}


/* Function to GET Web API Data*/
const getWeatherByZip = async (url, zipCode) => {
    // !!!
    console.log('... app.js : getWeatherByZip()');

    const response = await fetch(url).catch( error => { console.log(`getWeatherByZip fetch() error: ${error}`)});
    try{
        const weatherData = await response.json();

        // !!!
        weatherData.cod === "404" ? console.log("code = 404") : console.log("code != 404");
        console.log('app.js : getWeatherByZip() :: weatherData = ' + JSON.stringify(weatherData));

        if (weatherData.cod === "404"){
            document.getElementById('date').innerHTML = "";
            document.getElementById('temp').innerHTML = "";
            document.getElementById('city').innerHTML = "";
            document.getElementById('content').innerHTML = "";          
            document.getElementById('intro').innerHTML = `No data available for ${zipCode}.`;
        };

        return weatherData;
    } catch(error) {
        console.error(`Error in getWeatherByZip() : ${error}`);
    }
}


/* Function to POST data */
const postData = async (url, data) => {  

        // !!!
        console.log('... app.js : postData() :: data = ' + JSON.stringify(data));

        const response = await fetch(url,
                                    { method: 'POST',
                                      credentials: 'same-origin',
                                      headers: {'Content-type':'application/json', },
                                      body: JSON.stringify(data)
                                    }).catch( 
                                        error => { console.log(`postData() fetch() error: ${error}`)}
                                    );
        try{
            const newData = await response.json();

            // !!!
            console.log('... app.js : postData() :: newData = ' + JSON.stringify(newData));

            return newData;
        } catch(error){
            console.error(`Error in postData() : ${error}`);
        }                                   
}


/* Function to GET Project Data */
const updateUI = async () => {
    console.log('... app.js : updateUI()');
    const currTmpIntro = `Current temperature in`;

    const request = await fetch('http://localhost:8080/all').catch( error => { console.log(`updateUI fetch() error: ${error}`)});
    try{
        const data = await request.json();

        // !!!
        console.log('... app.js : updateUI() :: data = ' + JSON.stringify(data));

        const dateObj = new Date(data.date * 1000);
        const newDate = dateObj.toUTCString();

        document.getElementById('intro').innerHTML = currTmpIntro;
        document.getElementById('date').innerHTML = newDate;
        document.getElementById('temp').innerHTML = data.temperature;
        document.getElementById('city').innerHTML = data.city;
        document.getElementById('content').innerHTML = data.userResponse;
    } catch(error) {
        console.error(`Error in updateUI() : ${error}`);
    }
}
