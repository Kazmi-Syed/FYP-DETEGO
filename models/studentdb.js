const mongoose = require('mongoose');

//Creating schema
var studentSCH = mongoose.Schema
({
    FirstName : {type:String , minlength : 1},
    LastName: {type:String , minlength : 1},
    StdID: {type : Number},      
    userEmail : {type : String, unique : true , required:[true , 'Email is required']},
    secretCode : {type : String,required:true},
    Gender : {type : String , required : true},
    Department : {type : String , required : true},
    Batch : {type : String , required : true},
    AuthPic : {type : String, unique : true , required:[true , 'Image is required']},
    DisPic : {type : String, unique : true , required:[true , 'Image is required']},
    stdClasses: [String], 
})
//creating model
//What are the parameter para 1 is collection name in db
var studentModel = mongoose.model("Studentay" , studentSCH);

module.exports = studentModel;