const faculty_model = require('../models/facultydb');
const teacher_model = require('../models/teacherdb');
const student_model = require('../models/studentdb');
const bcrypt = require('bcrypt');
const class_model = require('../models/classes');



///////////----------------Creating Class---------||||||||||||||||||||||||||||||

create_class =async (req,res,next)=>{
    try{
        let user = res.locals.teacher;
        res.render('createclass',{stylefile : "teacher/teachercreateclass",
                                    title: "Create Class | Detego", imgsrc: user.DisPic,tnam : user.FirstName+ " " +user.LastName })
    }
    catch(err){
        res.send(err)
    }
}

//////////////////////////////////////////////////




generateClassCode = (long)=> {
    var can_contain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var totalLength = can_contain.length;
    var final = '';
    for (var i=0; i<long;i++ ){
      final += can_contain.charAt(Math.floor(Math.random() * can_contain.length));
   }
   return final;
}


// checked_generated = async ()=>{
//     do{
//         var new_class_code = await generateClassCode(9); 
//         var class_found = await classes_db.findOne({joincode : new_class_code});
//         console.log(new_class_code);
//     }while(class_found.length() != 0);

//     return new_class_code;
// }



//IDentifier must never be hashed



//////////////////////////////////////////////////

creating_class = async(req,res,next)=>{
    try{
        let code =await generateClassCode(8);
        let cass =await new class_model({
            Name : req.body.cln ,
            Details : req.body.btd ,
            Code : code , 
            Teacher : req.cookies['insan']
        }) 
        Promise.all([cass.save() , teacher_model.updateOne({userEmail : req.cookies['insan']},{$push:{ stdClasses : code}})]);
        res.send({status: 200 , message : "Class Created Successfully" , stdObj : cass})
    }
    catch(err){
        res.send(err)
    }
}
///----------------------------------------------ADD Students to class
/////////////////////////////////////----------------------------QUIZ--------------------------

module.exports = {create_class , creating_class , generateClassCode}