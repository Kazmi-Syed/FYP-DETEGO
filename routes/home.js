const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
//Importing models and using them
//DAtabase models
var class_model = require("../models/classes");
var Teacher_model = require('../models/teacherdb');
var faculty_model = require('../models/facultydb.js');
var student_model = require('../models/studentdb')
var Quiz_model  = require('../models/quizesdb');

//importing controller
var f = require('../controllers/home_controller.js');
var ADD_MEMBERS = require('../controllers/adding_members_controller');

//Creating Classes Controllers
const CREATE_ROOMS = require('../controllers/creating_rooms');
const CLASS_REND = require('../controllers/class_controller');

//Student Class Controller
const STD_CLASS = require('../controllers/student_classControllers')

//Middlewares
const STATUS_CHECKER = require('../middlewares/status_check_middleware')



//***********************---------Route Handling--------------------------------************* */
router.all("/" , f.home_time);

router.all('/addstudentpage/',STATUS_CHECKER.IS_LOGGED_AS_FACULTY,async (req,res,next)=>{
    try{
        res.render('addstudent',{})
    }
    catch(err){
        res.render('error')
    }
})

router.all('/finishAddStudent',STATUS_CHECKER.IS_LOGGED_AS_FACULTY ,ADD_MEMBERS.upload.single('imginaryfile') , ADD_MEMBERS.adding_student) 


router.all('/addteacherpage/',STATUS_CHECKER.IS_LOGGED_AS_FACULTY,async (req,res,next)=>{
    try{
            res.render('addteacher',{})
    }
    catch(err){
        res.render('error')
    }
})

router.all('/finishAddTeacher/',STATUS_CHECKER.IS_LOGGED_AS_FACULTY , ADD_MEMBERS.upload.single('empimginaryfile') , ADD_MEMBERS.adding_teacher)


//An error here---------------->-------^^^^^^^ can occur Caz no auth before uploading file on the system

router.all('/logout' , async (req,res,next)=>{
    try{
        if(await bcrypt.compare(process.env.COOKIE_HLT_CHECK + req.cookies['insan'], req.cookies["hlt"])){
            res.clearCookie('hlt');
            res.clearCookie('insan');
        }
        res.redirect('/');
    }
    catch(err){
        res.send('error');
    }
})




router.all('/createclass',STATUS_CHECKER.IS_LOGGED_AND_TEACHER , CREATE_ROOMS.create_class)

router.all('/classcreated',STATUS_CHECKER.IS_LOGGED_AS_TEACHER , CREATE_ROOMS.creating_class)

router.get('/class/:cid/', CLASS_REND.teacher_class)

router.all('/class/:cid/enrollstudents/' , CLASS_REND.teacher_class_addStudents)
router.all('/class/:cid/seestudents/' , CLASS_REND.teacher_see_students)

router.all('/class/:cid/enrollstudents/getenrolldone' , CLASS_REND.teacher_class_addStudents_finish)


router.all('/:cid/delete' ,CLASS_REND.teacher_deleting_class)



router.all('/joinclass',STATUS_CHECKER.IS_LOGGED_AND_STUDENT, (req,res,next)=>{
    try{
        res.render("joinclass", {title: "Join Class | Détégo",
        stylefile : 'student_home',
        imgsrc:res.locals.student.DisPic, tnam : res.locals.student.FirstName+ " " +res.locals.student.LastName});
    }
    catch(err){
        res.send(err)
    }
})



router.all('/donejoining' ,async (req,res,next)=>{
    try{
        await Promise.all(
            [
                classes_db.updateOne({Code:req.body.cco , Students: {$ne: req.cookies['insan']}} , {$push : {Students:req.cookies['insan']} }),
                student_model.updateOne({userEmail : req.cookies['insan'] , stdClasses : {$ne: req.body.cco}} ,{$push : {stdClasses: req.body.cco}})
            ]
        )
        res.send('Done Updating ')
    }
    catch(err){
        res.send(err.message)
    }
})

router.all('/c/:cid/', STATUS_CHECKER.IS_LOGGED_AND_STUDENT , STD_CLASS.student_class)
//************--------------------------DAS TESTING--------------------****************/



//***********************Tester************** */






router.all('/class/:cid/assignQuiz/',STATUS_CHECKER.IS_LOGGED_AS_TEACHER_OF_THE_CLASS , (req,res,next)=>{
    try {
        res.render('quiztester' , {});
    } catch (err) {
        
    }
})


router.all('/class/:cid/assignQuiz/quizcheck',STATUS_CHECKER.IS_LOGGED_AS_TEACHER_OF_THE_CLASS ,async (req,res,next)=>{
    try {
        
        let r = new Date(req.body.sdat+ " "+ req.body.stim)
        r = r.getTime()
        

        let f = new Date(req.body.fdat+ " "+ req.body.ftim)
        f = f.getTime()
        
        let h = CREATE_ROOMS.generateClassCode(20);
            const z =await new Quiz_model({
            Code : h,
            Title : 'Chapter # ',
            DateCreated:  Date.now(),    
            DateStarts: r ,
            DateExpires:f ,
            Questions :JSON.parse(req.body.quiz), 
        });
        Promise.all([z.save(),class_model.updateOne({Code:req.params.cid,Teacher:req.cookies['insan']} , {$push:{Quizes: h}})]);
        console.log(r.toDateString());
        res.send("Done assigning quiz" );
    } 

    catch (err) {
        res.send(err)    
    }
})






// /////////////////////////////////////////////////////////////////////////////////////Setting up file uploader-----------////////////////////////
// var filefilter = (req,file,cb)=>{
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb(null , true);
//     }
//     else{
//         cb(null , false);
//     }
// }

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/images')
//     },
//     filename: (req, file, cb) => {
//         //alternate the the file field name with the req.body then the ID
//         cb(null, req.body.ID + '-' + Date.now() + path.extname(file.originalname) )
//     }
// });  

// var upload = multer({ 
//     storage: storage,
//     fileFilter : filefilter
    
// });
////////////////////////////////////////////////////////-----------------------Finished  Setting up file uploader-----------////////////////////////

//***********************Tester Coded************** */


//************------------------///////////--------DAS TESTING-------\\\\\\\\\\\\\\\\\\-------------****************/
/*
router.all('/das' , (req,res,next)=>{
    try{
        
        if(req.cookies['hlt']===process.env.COOKIE_STATUS && req.cookies['insan'].includes("@faculty.")){
            let [fn , ln , id , g , batch , dep]=[req.body.fstnam,req.body.lstnam,req.body.ID,req.body.gender,req.body.batch,req.body.dep] ;
            let p = generateClassCode(6);
            console.log("First Name : " , fn )
            console.log("Last Name : " , ln)
            console.log("ID : " , id)
            console.log("email : " , id+ '@students.'+ req.cookies['insan'].split('@faculty.')[1] )
            console.log("Password : " , p)
            console.log("Gender : " , g)
            console.log("Batch : " , batch)
            console.log("Dep : " , dep)
            res.redirect('/home/addstudentpage')
        }
        else{
            res.redirect("/");
        }
    }
    catch(err){
        res.send("Erreor")
    }
})
*/



// router.all('/addstudent' , add_ppl);



//radial-gradient(#c0c576, #f8ec7c)


/*
renderteacher = async(reqbody , res , data=null)=>{ 
    try{
        const user = await Teacher_model.findOne({userEmail : reqbody.uname}); 
        if(user.length != 0){
            const authenticated = await bcrypt.compare(reqbody.pcode , user.secretCode);
            if(authenticated){res.send("--------- exists and authenticated");}
        }
        else{
            res.send("No user with this account exists")
        }
    }
    
    catch(err){
        res.send("An error occured in the rendering separate fx");
    }
}

renderstudent = async(reqbody , res , data=null)=>{ 
    try{
        const user = await std.findOne({userEmail : reqbody.uname}); 
        if(user.length != 0){
            const authenticated = await bcrypt.compare(reqbody.pcode , user.secretCode);
            if(authenticated){res.send("--------- exists and authenticated");}
        }
        else{
            res.send("No user with this account exists")
        }
    }
    
    catch(err){
        res.send("An error occured in the rendering separate fx");
    }
}

renderfaculty = async(reqbody , res , data=null)=>{ 
    try{
        const user = await faculty_model.findOne({userEmail : reqbody.uname});
        if(user.length != 0){
            const authenticated = await bcrypt.compare(reqbody.pcode , user.secretCode);
            if(authenticated){res.send("--------- exists and authenticated");}
        }
        else{
            res.send("No user with this account exists");
        }
    }
    
    catch(err){
        res.send("An error occured in the rendering separate fx of faculty ");
    }
}
*/

    /*(req,res,next)=>{
    try{
        if(req.session.userID != null){
            console.log("session exist");
        }
        else{
            console.log("session not exist");
            if(req.body.uname.includes("@faculty.")){console.log("going fac");renderfaculty(req.body,res);}
            else if(req.body.uname.includes("@teachers.")){console.log("going teac");renderstudent(req.body,res);}
            else if(req.body.uname.includes("@students.")){console.log("going std");renderteacher(req.body,res);}
            else{
                res.redirect("/");
            }
        }
    }
    catch(error){
        res.send("Error Page");
    }
})*/



/*
router.get("/faculty/addtch/" , async (req , res ,next) => {
    try{
        vr
        var z = "ABC123"
        var c = await bcrypt.hash(z, 12)
        var f = new faculty_model({
            userEmail : "assassin@faculty.dbh.com",
            secretCode:c ,
            Name: "Brotherhood" 
        })
        await f.save((errors , newobjt)=>{if(errors){res.send("Error occured while saving");}else{res.send({status: 200 , message : "STudent added Successfully" , stdObj : f})}});
    }
    catch(error){
        res.send("an error occured while processing the reqquest to add teachers");
    }
})
*/

router.get('/createaaaClass', async(req,res,next)=>{

    try{
        var classNAME = await req.body.classname ;
        var classcode = await generateClassCode(8);
        var Studentmail = await  req.body.StudentMail;

    
        const a  = await std.findOneAndUpdate({stdEmail : Studentmail} , {$push:{ stdClasses : classNAME}});
        const b = await new caz({
          cname : classNAME,
          joincode : classcode,
          cstudents : Studentmail,
          cteacher: req.session.userID,
        }); 
        const t = await b.save()
        const s = await std.findOneAndUpdate({stdEmail : req.session.useremail} , {$push:{ stdClasses : classNAME}});
        res.send("Done creating class");
      }
      catch(ErRoR){
        res.send("An Errror occured while processing your request Try Again later ");
      }
    });

    

generateClassCode = (long)=> {
    var can_contain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var totalLength = can_contain.length;
    var final = '';
    for (var i=0; i<long;i++ ){
      final += can_contain.charAt(Math.floor(Math.random() * can_contain.length));
   }
   return final;
}


checked_generated = async ()=>{
    do{
        var new_class_code = await generateClassCode(9); 
        var class_found = await classes_db.findOne({joincode : new_class_code});
        console.log(new_class_code);
    }while(class_found.length() != 0);

    return new_class_code;
}

router.post('/created/' ,async (req,res,next)=>{
    try{
        if(req.session.userID.includes('@teachers.')){
            var joining_code = await checked_generated;
            let new_class = await new classes_db({
                cname : req.body.class_name,
                csection: req.body.section_details,
                joincode : joining_code ,
                cteacher: req.session.userID,
            }) 
            await new_class.save();
            const a  = await std.findOneAndUpdate({stdEmail : Studentmail} , {$push:{ stdClasses : classNAME}})

        }
        else{
            res.send("USers are not allowed here");
        }
    }
    catch(error){
        res.send('Error occured while we were creating class for you');
    }
} )

//Add class to database and update teachers 


router.get('/createclass/', (req,res,next)=>{
    if(req.session.userID== null){
        res.redirect('/');
    }
    else if(req.session.userID.includes('@students.')){
        res.send('Student account cannot create class');
    }
    else if(req.session.userID.includes('@teachers.'))
        res.send('teachers can create class');
})


module.exports = router;



/*

renderhome = async (user_email , res , data = null)=>{
    if(user_email.includes('@teachers')){       
        const z = await data.stdClasses ; 
        res.render("teacher" , {title: "Teacher | Detego",imgsrc:"dress.png" , listo: z , tnam : data.FirstName+ " " +data.LastName });
 }
    else if(user_email.includes('@students')){res.render('student' , {requistee:"req.body.uname",hispass:"asd"})}
    else if(user_email.includes('@faculty')){res.render('addstudents')}
}
*/


//***************************************************** */

/*

router.all('/' , async (req,res , next)=>{
    try{
        if(req.session.userID != null){
            const userz = await std.findOne({stdEmail : req.session.userID});
            if(userz.length != 0 ){
                renderhome(req.session.userID ,res , userz);
            }                else{
                res.render("wronglogin");
            }

        }
        else{
            const userz = await std.findOne({stdEmail : req.body.uname});
            if(userz.length != 0 )
            {
                const authenticated = await bcrypt.compare(req.body.pcode , userz.stdPassword)
                if(authenticated){
                    req.session.userID = req.body.uname;
                    renderhome(req.body.uname , res , userz);
                }
                else{
                    res.render("wronglogin");
                }
            }
            else{
                res.send("No user exist with this Email address");
            }
    }
}
    catch(error){
        res.send("Error Occured");
    }
})



*/


/*
//This is first approach without 
//session management

router.all("/" ,async (req,res, next)=> { 
    try{
        const userz = await std.findOne({stdEmail : req.body.uname});
        if(userz.length != 0 )
        {
            const authenticated = await bcrypt.compare(req.body.pcode , userz.stdPassword)
            if(authenticated){
                // req.session.userID = req.body.name; 
                if(req.body.uname.includes("teachers")){
                    const z = userz.stdClasses ; 
                    res.render("teacher" , {title: "Teacher | Detego",imgsrc:"dress.png" , listo: z , tnam : userz.FirstName+ " " +userz.LastName });
                }
                else if(req.body.uname.includes("students")){
                    res.render('student' , {requistee:req.body.uname,hispass:"asd"});
                }
                else if(req.body.uname.includes("faculty")){
                    res.render("addstudents" , {title:"Faculty | Admin Page",fn:"A University"});
                }
            }
            else{
                res.render("wronglogin");
            }
        }
        else{
            res.send("No user exist with this Email address");
        }
    }
    catch(error){res.send("An Error Occured while Processing your request")}           
})

*/



//****************************************************** */
//This is the second attempt with session management

//     router.all("/" ,async (req,res, next)=> { 
//     //body parser
//     let requisteee;
//     if(req.session.useremail){
//         requisteee = String(req.session.useremail);
//         }
//     else{
//      requisteee = req.body.uname;
//     }
//     if(requisteee.includes('teachers')){
//         std.find({stdEmail : requisteee},(err, userz)=>{
//             if(err){
//                 res.send(err);//if error occured while searching/finding
//             }
//             else{
//                 if(userz.length != 0){
//                     console.log(userz);
//                     console.log(bcrypt.hash(req.body.pcode,12)); 
//                     bcrypt.compare(req.body.pcode , userz.stdPassword ,(errorr,result)=>{
//                         if(errorr){
//                             res.send("An error Occured");
//                         }
//                         else if(result === true){
//                             if(!req.session.useremail){
//                                 req.session.useremail = requisteee ; 
//                             }
//                             res.send("Login successfull");
//                         }
//                         else{
//                             res.send("Wrong login");
//                         }
//                     } )
//                     res.render("teacher" , {title: "Teacher | Detego"});
//                 }
//                 else{
//                     res.redirect('/failedlogin');
//                 }
//             }
//         })   
//     }
//     //res.render("teacher");
//     else if(requisteee.includes('students')){
//         if(!req.session.useremail){
//             req.session.useremail = requisteee ; 
//         }
//         res.render('student' , {requistee : requisteee , hispass : "asd"}) ;
//     }
//     else if(requisteee.includes('faculty') ){
//         if(!req.session.useremail){
//             req.session.useremail = requisteee ; 
//         }
//         console.log(req.session.useremail);
//         res.render("addstudents" , {title:"Faculty | Admin Page",fn:"A University"});
//     }
//     else{
//         res.redirect('/failedlogin');
//     }
// })



//query parser req.query.variable_naame
//req.params.
// req.query.
// req.body.
//req.data.
//res.locals
//req.locals


/*
//Controling image uploading
const multer = require('multer');
const { render } = require('../app');
const upload = multer({ dest: 'uploads/' });
*/
//Put focus on map() , bind() , forEAch()