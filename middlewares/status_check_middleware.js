const bcrypt = require('bcrypt');
var faculty_model = require('../models/facultydb');
var teacher_model = require('../models/teacherdb');
var student_model = require('../models/studentdb');
var class_model = require('../models/classes');




IS_LOGGED_AS_FACULTY = async (req,res,next)=>{
    try{
        if(req.cookies['insan'] &&
            await faculty_model.exists({userEmail:req.cookies['insan']})  &&
            await bcrypt.compare(process.env.COOKIE_HLT_CHECK + req.cookies['insan'] , req.cookies["hlt"])
        ){
            next();
        }
        else{throw err}
    }
    catch(err){
        res.redirect('/')
    }
}


IS_LOGGED_AS_TEACHER = async (req,res,next)=>{
    try{
        if(req.cookies['insan'] &&
            await teacher_model.exists({userEmail:req.cookies['insan']})  &&
            await bcrypt.compare(process.env.COOKIE_HLT_CHECK + req.cookies['insan'] , req.cookies["hlt"])
        ){
            next();
        }
        else{throw err}
    }
    catch(err){
        res.redirect('/')
    }
}

IS_LOGGED_AND_TEACHER = async (req,res,next)=>{
    try{
        if(req.cookies['insan'] &&
        await teacher_model.exists({userEmail:req.cookies['insan']})  &&
        await bcrypt.compare(process.env.COOKIE_HLT_CHECK + req.cookies['insan'] , req.cookies["hlt"])
        
        ){

            res.locals.teacher = await teacher_model.findOne({userEmail : req.cookies['insan']})
                                            .select("FirstName LastName DisPic")
            next();
        }
        else{throw err}
    }
    catch(err){
        res.redirect('/')
    }
}

IS_LOGGED_AND_STUDENT = async (req,res,next)=>{
    try{
        if(req.cookies['insan'] &&
        await student_model.exists({userEmail:req.cookies['insan']})  &&
        await bcrypt.compare(process.env.COOKIE_HLT_CHECK + req.cookies['insan'] , req.cookies["hlt"])
        
        ){

            res.locals.student = await student_model.findOne({userEmail : req.cookies['insan']})
                                            .select("FirstName LastName DisPic")
            next();
        }
        else{throw err}
    }
    catch(err){
        res.redirect('/')
    }
}

IS_LOGGED_AS_TEACHER_OF_THE_CLASS =async (req,res,next)=>{
    try {
        
        if(req.cookies['insan'] &&
        await teacher_model.exists({userEmail:req.cookies['insan']})  &&
        await bcrypt.compare(process.env.COOKIE_HLT_CHECK + req.cookies['insan'] , req.cookies["hlt"]) && 
        await class_model.exists({Code:req.params.cid, Teacher:req.cookies['insan']})
        ){
            next()
        }
        else{throw err;}
        
        
    } catch (err) {
        res.redirect('/')
        
    }
}

module.exports = {IS_LOGGED_AS_FACULTY , IS_LOGGED_AND_TEACHER , IS_LOGGED_AS_TEACHER , IS_LOGGED_AND_STUDENT , 
                    IS_LOGGED_AS_TEACHER_OF_THE_CLASS
                }