const mongoose = require("mongoose");

var FacultySch = mongoose.Schema({
                                    Name  : String,
                                    userEmail : String,
                                    secretCode : String,
                                    Students: [String], 
                                    Teachers: [String], 
                                }) 

var FacultyModel = mongoose.model("FacultyMod" , FacultySch);

module.exports = FacultyModel; 
