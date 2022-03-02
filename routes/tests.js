var express = require('express');
var router = express.Router();
var student_model =require('../models/studentdb');
var teacher_model =require('../models/teacherdb');

var mw = require("../middlewares/uploader").single('avatar');
var t = require('../controllers/upload_controller');
var fs = require('fs')
var path = require('path');
var mongoose = require('mongoose');
var multer = require('multer');

var bcrypt = require('bcrypt');
const { findOne } = require('../models/studentdb');
const { array } = require('../middlewares/uploader');
// const { resourceUsage } = require('process');
// const { extname } = require('path');
// const { resolveNs } = require('dns/promises');

router.get("/api/" , async (req,res,next)=>{
    try{
        console.log(req)
        console.log(req.query.uname)
        console.log(req.query.pcode)
        let t = await teacher_model.findOne({userEmail : req.query.uname}).select("FirstName LastName DisPic");
        res.json(t);
    }
    catch(err){
        res.status(404);
    }
})

router.all('/' ,  (req,res,next)=>{
    res.render('quiztester' , {})
})


router.all('/quizcheck/' , (req,res,next)=>{

    let r = new Date(req.body.sdat+ " "+ req.body.stim)
    r = r.getTime()
    console.log(r);

    let f = new Date(req.body.fdat+ " "+ req.body.ftim)
    f = f.getTime()
    console.log(f);

    console.log(Date.now());
    if(r > Date.now() ){console.log('Quiz not started yet')}
    else if(r < Date.now() && Date.now() < f){console.log('Quiz is allowed')}
    else if(Date.now()>f){console.log('Quiz Finished')}
    console.log(JSON.parse(req.body.quiz));
    if(f<r){
        console.log('Finish pehle kr dye ho');
        res.redirect('/tests/')
    }

})

router.all('/datepractice' , (req,res,next)=>{
    
    let     E = new Date()
    let     A = E.toDateString();
    let     Sta = E.toLocaleString();
    let     Fin = E.toLocaleString();
    console.log("Assigned : " , A)
    console.log("Starts : " , Sta)
    console.log("Finishes : " , Fin)
    res.redirect('/')
        
})


router.all('/o2a' , (req,res,next)=>{
    const A= {
        0 : 'Hamza',
        1 : 'Shah',
        3 : 'Waleed'
    }
    var t = [];

    for (let [key, value] of Object.entries(A)) {
        t.push(value)
      }

    console.log(t)
    })

module.exports = router 