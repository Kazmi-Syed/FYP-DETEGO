const faculty_model = require('../models/facultydb');
const teacher_model = require('../models/teacherdb');
const student_model = require('../models/studentdb');
const bcrypt = require('bcrypt');


var path = require('path');
var mongoose = require('mongoose');
var multer = require('multer');




////////////////////////////////////////////////Setting up file uploader-----------////////////////////////
var filefilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null , true);
    }
    else{
        cb(null , false);
    }
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        //alternate the the file field name with the req.body then the ID
        cb(null, req.body.ID + '-' + Date.now() + path.extname(file.originalname) )
    }
});  

var upload = multer({ 
    storage: storage,
    fileFilter : filefilter
    
});
///////////////////-----------------------Finished  Setting up file uploader-----------////////////////////////

adding_student =async (req,res,next)=>{
    try{        
        //if(await faculty_model.exists({userEmail : req.cookies['insan']}) && await bcrypt.compare(process.env.COOKIE_HLT_CHECK , req.cookies["hlt"])){   
            let [fn , ln , id , g , batch , dep]= [req.body.fstnam,req.body.lstnam,req.body.ID,req.body.gender,req.body.batch,req.body.dep];
            let p = "NAWAZSHAREEF";
            let email_id =await id+ '@students.'+ req.cookies['insan'].split('@faculty.')[1];
            let hashed_password = await bcrypt.hash(p,Number(process.env.SALT_ROUNDS));
            if(process.env.STUDENT_ADD_GENDER.includes(g) && process.env.STUDENT_ADD_BATCH.includes(batch) && process.env.STUDENT_ADD_DEP.includes(dep)){
                    let std = await new student_model(
                        {
                            FirstName : fn,
                            LastName: ln,
                            StdID: id,      
                            userEmail : email_id,
                            secretCode : hashed_password,
                            Gender : g,
                            Department : dep,
                            Batch : batch,
                            AuthPic: req.file.path.split('public\\')[1],
                            DisPic: req.file.path.split('public\\')[1],
                        }
                        )
                        await std.save();
                        await faculty_model.updateOne({userEmail : req.cookies['insan'] }, {$push:{Students : email_id}})
                        res.send({status: 200 , message : "STudent added Successfully" , stdObj : std})
                //}
            }
    }
    catch(error){
        res.send(error);
    }
} 


adding_teacher = async(req , res ,next)=>{
    try{
        // if(await faculty_model.exists({userEmail : req.cookies['insan']}) && await bcrypt.compare(process.env.COOKIE_HLT_CHECK , req.cookies["hlt"])){

            let [fn , ln , g , id ] = [req.body.empfstnam, req.body.emplstnam , req.body.empgender, req.body.ID ];
            let email_id = id+ '@teachers.'+ req.cookies['insan'].split('@faculty.')[1];
            let p = "ALTAFBHAI";
            let hashed_password = await bcrypt.hash(p,Number(process.env.SALT_ROUNDS));
            
            if(process.env.STUDENT_ADD_GENDER.includes(g)){
                let teach = await new teacher_model({
                    FirstName  : fn,
                    LastName: ln,
                    TeacherID : id,
                    userEmail : email_id,
                    Gender : g,
                    secretCode : hashed_password,
                    DisPic : req.file.path.split('public\\')[1]
                })
                await teach.save();
                await faculty_model.updateOne({userEmail : req.cookies['insan'] }, {$push:{Teachers : email_id}})
                res.send({status: 200 , message : "Teacher added Successfully" , stdObj : teach})
            // }
        }
    }
    catch(err){
        res.send(err);
    }
}


///////////////////--------------------Adding Teacher--------------/////////////////







/////////**********--------------------Adding Teacher--------------**********************/////////////////


module.exports = {adding_student , upload , adding_teacher };
/*
//Other information can have

1. Marital status 
2. DOB
3. Father Details
4. Next To kin
5. City
6. Address
7. CNIC-Info

*/