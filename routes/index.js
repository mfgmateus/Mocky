var express = require('express');
var router = express.Router();

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('conf.txt')
});

lineReader.on('line', function (line) {
  var method = line.split('=')[0];
  var path = line.split('=')[1];
  var response = line.split('=')[2];
  if(method == "POST")
    router.post(path, function(req, res, next){
      let responseJson = require(response);
      res.send(responseJson);
    });
  else{
    router.get(path, function(req, res, next){
      let responseJson = require(response);
      res.send(responseJson);
    });
  }
});

/* GET home page. */
router.get('/*', function(req, res, next) {
              console.log(req.headers.authorization);
              next();
});

module.exports = router;
