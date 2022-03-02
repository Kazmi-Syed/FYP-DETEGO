const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const student_model = require('../models/studentdb');
var class_model = require('../models/classes');


//------------------Render Inside Class

student_class = async (req,res,next)=>{
    try{
        let r = await class_model.findOne({Code : req.params.cid});
        res.render('student_classV' , {title: r.Name + " | Detego",
                                        stylefile : "/student_IC",
                                        imgsrc:res.locals.student.DisPic, tnam : res.locals.student.FirstName+ " " +res.locals.student.LastName,
                                        cass : r }
                                        )
    }
    catch(err){
        res.send(err)
    }
}


module.exports = {student_class} 
