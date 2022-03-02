const mongoose = require('mongoose');

var Question = new mongoose.Schema({
    Q :{
        type:String,
        default:''
    },
    M:{
        type : Number,
        require:true
    },
    O:[String],
    C: {
        type:String
    }
},{ _id : false })

var QUIZ_SCHEMA = new mongoose.Schema({
    Code :{type : String , unique:true }, 
    Title : String,
    DateCreated: String ,    
    DateEdited:String ,
    DateStarts:String ,
    DateExpires:String ,
    Marks : String ,
    Questions : [Question],
})

const Quiz = mongoose.model('AssignedQuiz',QUIZ_SCHEMA)

module.exports = Quiz;


//Student interface must have a Quickly missed quizes, upcoming quizes