var express =  require('express');
var cors = require('cors');
//var fs = require("fs");

const app = express();
app.use(cors());

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.get('/users', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    {"id": 1,"firstName":"Juozas","lastName":"Venskutonis","email":"juozas.venskutonis@vvk.lt"},
    {"id": 2,"firstName":"Juozas","lastName":"Venskutonis","email":"juozas.venskutonis@vvk.lt"},
    {"id": 3,"firstName":"Juozas","lastName":"Venskutonis","email":"juozas.venskutonis@vvk.lt"},
    {"id": 4,"firstName":"Juozas","lastName":"Venskutonis","email":"juozas.venskutonis@vvk.lt"},
    {"id": 5,"firstName":"Juozas","lastName":"Venskutonis","email":"juozas.venskutonis@vvk.lt"},
    {"id": 6,"firstName":"Juozas","lastName":"Venskutonis","email":"juozas.venskutonis@vvk.lt"}
  ]);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port')); 
});


/*var numDP = 10000;     // Vietoviu skaicius (demand points, max 10000)
var numPF = 10;        // Esanciu objektu skaicius (preexisting facilities)
var numCL = 25;        // Kandidatu naujiems objektams skaicius (candidate locations)
var numX  = 5;         // Nauju objektu skaicius
var demandPoints;      // Geografiniai duomenys

var startTime = new Date().getTime() / 1000;

loadDemandPoints();

function loadDemandPoints() {
    var file = fs.readfileSync("./geoData/demandPoints.dat");
    demandPoints = file.split("\r\n").map(function(line){
        return line.split(" ");
    });
    console.log(demandPoints);
} */
