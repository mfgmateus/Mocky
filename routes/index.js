var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('conf.txt')
});

mongoose.connect('mongodb://localhost:27017/mocky');
var Route = require('./../models/route');


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

router.post('/routes', function(req, res) {
  var route = new Route(); 
  route.path = req.body.path;
  route.method = req.body.method;
  route.response = JSON.parse(req.body.response);

  route.save(function(err) {
    if(err) return res.send({"sucess": false, "value": err});
    return res.send({"sucess": true, "value": route});
  });
});
router.post('/routes/:id', function(req, res) {
  req.body.response = JSON.parse(req.body.response);
  Route.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
    if(err) return res.send({"sucess": false, "value": err});
    return res.send({"sucess": true, "value": result});
  });
});
router.get('/routes', function(req, res, next){
  Route.find({}, function(err, result){
    if(err) return res.send({"sucess": false, "value": err});
    return res.send({"sucess": true, "value": result});
  });
});
router.delete('/routes/:id', function(req, res, next){
  Route.findByIdAndRemove(req.params.id, function(err,result){
    if(err) return res.send({"success": false, "value": err});
    return res.send({"success": true, "value": "Route deleted!"});
  });
});

router.get("/**", function(req, res, next){
  Route.findOne({method: 'GET', path: req.url}, function(err, result){
    if(err) return res.send({"success": false, "value": err});
    if(!result) return res.send({"success": false, "message": "Route not found", "value": null});
    return res.json(result.response);
  });
});
router.post("/**", function(req, res, next){
  console.log(req.body);
  Route.findOne({method: 'POST', path: req.url}, function(err, result){
    if(err) return res.send({"success": false, "value": err});
    if(!result) return res.send({"success": false, "message": "Route not found", "value": null});
    return res.json(result.response);
  });
});

module.exports = router;
