var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RouteSchema   = new Schema({
      path: String,
      method: String,
      response: Object
});

module.exports = mongoose.model('Route', RouteSchema);
