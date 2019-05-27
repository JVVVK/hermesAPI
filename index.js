var express =  require('express');
var cors = require('cors');

const addon = require('./build/Release/addon');

var bodyParser = require('body-parser');

var exec = require("child_process").exec;
const app = express();

//var runAddon = (a, b, c, d) => addon.flpenum(a, b, c, d);

//var x1, x2, x3, x4;
 //const runAddon = () => addon.flpenum(x1, x2, x3, x4);

//var a = 10;
//var b = 10;
//var c = 5;
//var d = 5;
var runAddon = (x1, x2, x3, x4) => addon.flpenum(x1, x2, x3, x4);

/*var runAddon = function(a, b, c, d) {
  console.log(a, b, c, d);
  console.log(typeof a);
  
  console.log(typeof x1);
  addon.flpenum(x1, x2, x3, x4);
}*/ 

var sprendinys;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get('/data', async(req, res)=>{
  console.log(req.query);
  //console.log(req.query.viet_sk)
  //console.log(req.query.e_obj_sk)
  //console.log(req.query.k_obj_sk)
  //console.log(req.query.n_obj_sk)
  var a = req.query.viet_sk;
  var b = req.query.e_obj_sk;
  var c = req.query.k_obj_sk;
  var d = req.query.n_obj_sk;
  //x1 = parseInt(a);
 // x2 = parseInt(b);
  //x3 = parseInt(c);
  //x4 = parseInt(d);
  //var a = 100;
  //var b = 100;
  //var c = 10;
  //var d = 15;
  //var result = (a, b, c, d) => addon.flpenum(a, b, c, d);
  const result = await runAddon(a, b, c, d);
  //var result = runAddon();
  console.log(result);
  res.send(result);
  //res.json(result);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port')); 
});