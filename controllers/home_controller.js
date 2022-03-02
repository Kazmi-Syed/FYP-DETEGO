var std = require("../models/studentdb");
var classes_db = require("../models/classes");
var Teacher_model = require('../models/teacherdb');
var faculty_model = require('../models/facultydb');
var class_model = require('../models/classes');


var bcrypt = require('bcrypt');
var path = require('path');


renderteacher = async(req , res , next)=>{ 
    try{
        let user = await Teacher_model.findOne({userEmail : req.body.uname}).select("secretCode"); 
        if(user.length != 0){
            let authenticated = await bcrypt.compare(req.body.pcode , user.secretCode);
            if(authenticated){
                res.cookie('insan',req.body.uname,{maxAge: 1000*60*60*3});
                res.cookie('hlt',await bcrypt.hash(process.env.COOKIE_HLT_CHECK + req.body.uname, Number(process.env.COOKIE_SALT_ROUNDS)),{maxAge: 1000*60*60*3});
                res.redirect('/')
        }
        else{
            res.send("No user with this account exists")
        }
    }
}
    catch(err){
        res.send("An error occured in the rendering separate fx");
    }
}

renderstudent = async(req , res , next)=>{ 
    try{
        let user = await std.findOne({userEmail : req.body.uname}).select("secretCode"); 
        if(user.length != 0){
            console.log('Found in db')
            let authenticated = await bcrypt.compare(req.body.pcode , user.secretCode);
            if(authenticated){
                res.cookie('insan',req.body.uname,{maxAge: 1000*60*60*3});
                res.cookie('hlt',await bcrypt.hash(process.env.COOKIE_HLT_CHECK + req.body.uname,
                                                     Number(process.env.COOKIE_SALT_ROUNDS)),{maxAge: 1000*60*60*3});
                
                res.redirect('/');
                }
        else{
            res.send("No user with this account exists")
            }
        }
    }
    catch(err){
        res.send("An error occured in the rendering separate fx");
    }
}

renderfaculty = async(req,res,next)=>{ 
    try{
        let user = await faculty_model.findOne({userEmail : req.body.uname}).select("secretCode");
        if(user.length != 0){
            let authenticated = await bcrypt.compare(req.body.pcode , user.secretCode);
            if(authenticated){
                req.session.userID = req.body.uname;
                res.cookie('insan',req.body.uname,{maxAge: 1000*60*60*3});
                res.cookie('hlt',await bcrypt.hash(process.env.COOKIE_HLT_CHECK + req.body.uname, Number(process.env.COOKIE_SALT_ROUNDS)),{maxAge: 1000*60*60*3});
                res.redirect('/')
        }
        else{
            res.send("No user with this account exists");
        }
    }
}

    catch(err){
        res.status = 100;
        res.redirect('/failedlogin');
    }
}


/*********************************Session/cookie Management************************************************************* */
/********************************************************************************************** */
/********************************************************************************************** */
/********************************************************************************************** */
/********************************************************************************************** */

renderteacher_session = async(req , res , next)=>{ 
    try{
        let user = await Teacher_model.findOne({userEmail : req.cookies['insan']});
        if(user){
            let classes;
            if (user.stdClasses.length === 0){
                classes = null
            }
            else{
                classes =await class_model.find({Code : user.stdClasses});
            }
                res.render("teacher_home" , {
                                            stylefile : "teacher/teacherhome",
                                            title: "Teacher | Détégo",imgsrc:user.DisPic,classis: classes  , tnam : user.FirstName+ " " +user.LastName })
            
        }
        else{
            res.send("No user with this account exists in session ? error");
        }
    }
    catch(err){
        res.send("An error occured in the rendering separate Teacher ");
    }
}

renderstudent_session = async(req , res , next)=>{ 
    try{
        let user = await std.findOne({userEmail : req.cookies['insan']}); 
        if(user){

            let classes;
                if (user.stdClasses.length === 0){
                    classes = null
                }
                else{
                    classes =await class_model.find({Code : user.stdClasses}).select('Code Name Details');
                }
                res.render("student_home" , {title: "Student | Détégo",
                                                stylefile : 'student_home',
                                                classis : classes,
                                                imgsrc:user.DisPic,listo: user.stdClasses  , tnam : user.FirstName+ " " +user.LastName });
                }
    }
    catch(err){
        res.send("An error occured in the rendering separate fx");
    }
}



renderfaculty_session = async(req,res,next)=>{ 
    try{
        if(faculty_model.exists({userEmail : req.cookies['insan']})){
        // if(req.cookies['hlt'] === 'y'){
            let user = await faculty_model.findOne({userEmail : req.cookies['insan']});
            if(user.length != 0){
                res.render('faculty_home' , {title: "Faculty | Détégo" ,
                uniName : user.Name,
                imguni:'/images/'+ "brouni.jpg",
            });
        }
        else{
            res.send("No user with this account exists in session ? error");
        }
    }
    }

    catch(err){
        res.status = 100;
        res.redirect('/failedlogin');
    }
}


home_time = async (req,res,next)=>{
    try{
        if(req.cookies["hlt"] && await bcrypt.compare(process.env.COOKIE_HLT_CHECK + req.cookies['insan'] , req.cookies["hlt"]) ){
            //if(bcrypt.compare(req.cookies['hlt'] , process.env.COOKIE_HLT_CHECK )){}
            console.log("session exist");
            if(req.cookies['insan'].includes("@faculty.")){console.log("session fac");renderfaculty_session(req,res,next);}
            else if(req.cookies['insan'].includes("@teachers.")){console.log("session teac");renderteacher_session(req,res,next);}
            else if(req.cookies['insan'].includes("@students.")){console.log("session std");renderstudent_session(req,res,next);}
        }
        else{
            console.log("session not exist");
            if(req.body.uname.includes("@faculty.")){console.log("going fac");renderfaculty(req,res,next);}
            else if(req.body.uname.includes("@teachers.")){console.log("going teac");renderteacher(req,res,next);}
            else if(req.body.uname.includes("@students.")){console.log("going std");renderstudent(req,res,next);}
            else{
                res.redirect("/");
            }
        }
    }
    catch(error){
        res.send("Error Page");
    }
}

module.exports = {home_time }