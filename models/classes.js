const mongoose = require('mongoose');
const _ = require('underscore')

var classSCH = mongoose.Schema({
    Name : {type:String , minlength : 1},
    Details: {type:String , minlength : 1},
    Code : {type : String, unique : true , required:[true , 'Join Code must be unique']} ,
    Teacher: {type : String , required:[true , 'Must have a teacher' ]},
    Students : [{type : String}],
    Quizes : [{type : String , unique: true }]
})


// classSCH.pre('updateOne' , (next)=>{
//     this.Students = _.uniq(this.Students) 
// })

classMDL = mongoose.model('classis' , classSCH);
module.exports = classMDL ; 