const mongoose = require('mongoose')
const teacher_model = require('../models/teacherdb');
const student_model = require('../models/studentdb');
const class_model = require('../models/classes');
const bcrypt = require('bcrypt');
const studentModel = require('../models/studentdb');

//**************Teacher_________RENDERING_____________DASHBOARD */
teacher_class =async (req,res,next)=>{
    try{
        let user = await teacher_model.findOne({userEmail : req.cookies['insan']}).select("FirstName LastName DisPic");
        
        if(user){
            let r = await class_model.findOne({Code : req.params.cid});
            res.render('class_teacher' , {title: r.Name + " | Detego",
                                            stylefile : "teacher/class_inside/classHome",
                                            imgsrc:user.DisPic, tnam : user.FirstName+ " " +user.LastName,
                                            cass : r }
                                            )
        }
    }
    catch(err){
        res.send(err)
    }
}
//*************TEACHER_______ADD____STUDENT___ROLLNO_TO ENROLL____STUDENT______IN_________CLASS */
teacher_class_addStudents = async(req,res,next)=>{
    try{
        let user = await teacher_model.findOne({userEmail : req.cookies['insan']}).select("FirstName LastName DisPic");
        
        if(user){
            let r = await class_model.findOne({Code : req.params.cid});
            res.render('enroll_class' , {title: r.Name + " | Detego",
                                        stylefile : "teacher/teacherclassenroll",
                                        imgsrc:user.DisPic, tnam : user.FirstName+ " " +user.LastName,
                                        cass : r 
                                    }
            )
        }

    }
    catch(err){
        res.send(err)
    }
}


//THE REQUEST FE"TCHED AND PROCESSED
teacher_class_addStudents_finish =async (req,res,next)=>{
    try{
        let r =await class_model.findOne({Code: req.params.cid , Teacher:req.cookies['insan']}); 
        if(req.body.stu.split('@students.')[1]!=req.cookies['insan'].split('@teachers.')[1] || r.Students.includes(req.body.stu) || !await student_model.exists({userEmail : req.body.stu})){
            throw err;
        }
        else{

            Promise.all(
                [
                    class_model.updateOne({Code: req.params.cid} ,{$push:{Students: req.body.stu}}),
                    student_model.updateOne({userEmail:req.body.stu } ,{$push:{ stdClasses : req.params.cid}})
                    
                ])
                res.send('Student added to class');
            }
        
    }
    catch(err){
        res.send(err)
    }
}

//*******---------------------------------See Students********** */
teacher_see_students = async(req,res,next)=>{
    try{
        let r = await class_model.findOne({Code : req.params.cid});
        if(r){
            let user = await teacher_model.findOne({userEmail : req.cookies['insan']}).select("FirstName LastName DisPic");
            res.render('teacher_see_students' , {title : "Enrolled Students | " + r.Name,
                                        stylefile : "teacher/teacherseestudents",
                                        imgsrc:user.DisPic, tnam : user.FirstName+ " " +user.LastName,
                                        cass : r,
                                        slength : r.Students.length,
            })
        }
    }
    catch(err){
        res.send(err)
    }
}

//**************Delete____________CLASS________ONLY___TEACHER *************************/
teacher_deleting_class = async(req,res,next)=>{
    try{
    
        let students = await class_model.findOne({Code : req.params.cid , Teacher : req.cookies['insan']}).select("Students");
        students = students.Students
        console.log(students)
    
        await class_model.deleteOne({Code : req.params.cid , Teacher : req.cookies['insan']});
    
        await student_model.updateMany({userEmail:students} , {$pull:{stdClasses : req.params.cid}});

        await teacher_model.updateOne({userEmail:req.cookies['insan']} , {$pull:{stdClasses : req.params.cid}})
    
        res.redirect('/')
    }

    catch(err){
        res.send(err)
    }

}


module.exports = {teacher_class , teacher_class_addStudents , teacher_class_addStudents_finish , teacher_see_students , teacher_deleting_class}