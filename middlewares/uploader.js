const multer = require('multer');

var stor = multer.diskStorage({
    dest : (req , file , cb)=>{
        cb(null , 'uploads')
    },

    filename : (req,file,cb)=>{
        const img_name = 'TestImage' + Date.now();
        const ext = file.originalname.substr(file.originalname.lastIndexOf("."));
        cb(null , file.fieldname + img_name + ext); 
    },
})

module.exports = uplo = multer({storage : stor})
