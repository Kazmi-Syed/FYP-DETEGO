var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const std = require("../models/studentdb");
const caz = require("../models/classes");
const bcrypt = require('bcrypt');
const devv = require('../models/devloperdb');
var faculty_model = require('../models/facultydb');
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies['insan']){
    res.redirect("/home/");
  }
  else{
    req.session.userID = null;
    res.render('index',{title: 'Détégo',Developer:'Phoenix Research Group'});
  }
});

router.get('/updatebilal' , async (req,res,next)=>{
  try{
    let z = '1234';
    console.log(z);
    let p =await bcrypt.hash(z, 12);
    console.log(p);
    const v = await std.findOneAndUpdate({stdEmail : 'bilalshah@students.au.com'} , {stdPassword : p});
    res.send("Updated password");
  }
  catch(err){
    res.send("An error occured");
  }
})

router.get('/failedlogin', function(req, res, next) {
  res.render('wronglogin', { title: 'Detego'});
});

router.get('/accountrecovery', function(req, res, next) {
  res.render('passrecins', { title: 'Detego'});
});

//Must use destructering method
//Must add add teacher or add student thing here carefull with std or teacherdb
router.post("/addedresult",async (req,res,next)=>{
  
  try{
  let f =await req.body.first;
  let l =await req.body.last;
  let i =await req.body.roll;
  let e =await req.body.mail;
  let p =await bcrypt.hash(req.body.pwd, 12);
  let newStudent =new std({
    FirstName : f,
    LastName: l,
    StdID: i,
    stdEmail: e,
    stdPassword: p
  });
  await newStudent.save((errors,newStudent)=>{
    if(errors){res.send(errors);}
    else{res.send({status: 200 , message : "STudent added Successfully" , stdObj : newStudent});}
  });
} 
  catch(error){
    console.log("Error Occured");
  }  
//search about req.data.first
});

router.all('/teacher/createclass' , (req,res,next)=>{
  res.render("createclass" , {title:"Class Creation | Detego"});
})

router.post("/teacher/classcreated" ,async (req,res,next)=>{

  try{
    var classNAME = await req.body.classname ;
    var classcode = await req.body.classcode ;
    var Studentmail = await  req.body.StudentMail;

    const a  = await std.findOneAndUpdate({stdEmail : Studentmail} , {$push:{ stdClasses : classNAME}});
    const b = await new caz({
      cname : classNAME,
      joincode : classcode,
      cstudents : Studentmail
    }); 
    const t = await b.save()
    const s = await std.findOneAndUpdate({stdEmail : req.session.useremail} , {$push:{ stdClasses : classNAME}});
    res.send("Done creating class");
  }
  catch(ErRoR){
    res.send("An Errror occured while processing your request Try Again later ");
  }
});
//  std.update({stdEmail : Studentmail} , {$push:{ stdClasses : classNAME}}); 
//   var t = new caz({
//     cname : classNAME,
//     joincode : classcode,
//     cstudents : Studentmail
//   })
//    t.save(function(errors , t ){
//     if(errors){
//       res.send(errors);
//     }
//     else{
//       res.send({status:200,message:"STudent added Successfully",stdObj:t});
//     }
  
  /*
  caz.find({} , (erro , findres) => {
    if(erro){
      res.send("Error Occured");
    }
    if(findres.length != 0){
      let allClasses = findres.joincode ;
      res.send(allClasses);
    }
    else{
      res.send("cannot");
    }
  })
*/
router.get("/developerPage" , (req,res,next)=>{
  res.render("DEVELOPERPAGE" , {});
})


router.all("/devcheck" , async (req,res,next)=>{
  try{
    const userz = await devv.findOne({SECRETID : req.body.DEV_ID});
    if(userz.length != 0 ){
            console.log(userz);
            const authenticated = await bcrypt.compare(req.body.DEV_SEC,userz.DEVPASS);
            if(authenticated){
              res.send("USer Exists")
            }
            else{
                res.send("Wrong Login password");
            }
        }
        else{
            res.send("No user exist with this Email address");
        }
  }
  catch(ERROR){
    console.log("Error Occured ")
    res.send(Error.message);
  }
})



router.get('/newstudent' , (req,res,next)=>{
  res.render('addstudent',{})
})






router.get("/faculty/addtch/" , async (req,res,next) => {
  try{ 
      var z = "ABC123";
      var c = await bcrypt.hash(z, 12);
      const f = await new faculty_model({
        ImgADD : "brouni",
        userEmail : "assassin@faculty.dbh.com",
        secretCode: c,
        Name: "Brotherhood",
      })
      await f.save((errors , newobjt)=>{if(errors){res.send("Error occured while saving");}else{res.send({status: 200 , message : "STudent added Successfully" , stdObj : f})}});
  }
  catch(error){
      res.send("an error occured while processing the reqquest to add teachers");
  }
})















module.exports = router;

//Need to add password encryption
//Try using modules

  //PAssport-local
  //Locals
  //O-auth for google authorization
  //md5(input_password);
  //bcrypt(input)