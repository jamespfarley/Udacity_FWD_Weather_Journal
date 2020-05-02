// Express to run server and routes
const express = require('express');

// Start a server instance
const app = express();

// Dependencies
// Read data from POST requests on the server
const bodyParser = require('body-parser');

// Middleware
// Configure Express to user body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS for cross-origin allowance
const cors = require('cors');
app.use(cors());

/*************************************************************************/
/****************************   CORS-ANYWHERE  ***************************/

// Listen on a specific host via the HOST environment variable
/* var host = process.env.HOST ? '0.0.0.0' : '127.0.0.1';
// Listen on a specific port via the PORT environment variable
var envPort = process.env.PORT || 8080;

const cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [],  // All origins are allowed
    requireHeader: ['origin', 'x-requested-with']
}).listen(host, envPort, function(){
    console.log(`... Running CORS_ANYWHERE on ${host}:${envPort}`);
}); */

/*************************************************************************/
/*************************************************************************/

// Initialize project root folder
app.use(express.static('website'));

// SERVER
//Server port
const port = 8080;

// Create server  app.listen(<port-number>, <callback function>)
const server = app.listen(port, listening);

// Callback to debug
function listening(){
  console.log('... server is running');
  console.log(`... running on location ${port}`);
}

// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Callback function to complete GET '/all'
app.get('/all', (req, res) => {
    // !!!
    console.log('... app.get : req.body = ' + JSON.stringify(req.body));
    res.send(projectData);
});

// Post Route
app.post('/all', addInfo);

function addInfo(req, res){
    // !!!
    console.log('... app.post() :: addInfo : req.body = ' + JSON.stringify(req.body));

    Object.assign(projectData, req.body);

    // !!!
    console.log('... app.post() :: addInfo : projectData = ' + JSON.stringify(projectData));

    res.send(projectData);
}