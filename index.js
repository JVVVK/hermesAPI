var express =  require('express');
var cors = require('cors');
const addon = require('./build/Release/addon');
var exec = require("child_process").exec;

const app = express();
const runAddon = () => addon.flpenum(100, 10, 25, 5);
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

app.get('/data', function(req, res){
  exec(runAddon(), function (err, stdout, stderr) {
    if (!err) {
      res.send(stdout)
    }
  });
  //res.sendStatus(200);
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port')); 
});