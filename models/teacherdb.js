const mongoose = require("mongoose");

var teacherSch = mongoose.Schema({
                                    FirstName  : {type:String , minlength : 1},
                                    LastName: {type:String , minlength : 1},
                                    TeacherID : {type : Number , unique : true },
                                    userEmail : {type : String, unique : true , required:true},
                                    Gender : {type : String , required : true},
                                    secretCode : String,
                                    DisPic : {type : String, unique : true , required:[true , 'Email is required']},
                                    stdClasses: [String], 
                                }) 

var TeacherModel = mongoose.model("TeacherMod" , teacherSch);

module.exports = TeacherModel; 

//Whenever a teacher creates a class his model must also b updated;
//classes list must have the class code.