var mongoose = require('mongoose');
var DEVDATA = mongoose.Schema({
     SECRETID : String,
     DEVPASS : String
});
var DEVELOPER = mongoose.model("THEDEV" ,  DEVDATA);
module.exports = DEVELOPER;
//Use SHA512 to encrypt the developer's data