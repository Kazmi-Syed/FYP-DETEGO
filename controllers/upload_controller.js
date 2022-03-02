f = (req,res,next)=>{
    const file  = req.files;

    if(file){
        res.send("file uploaded")
    }
    else{
        res.send("had no file to upload")
    }
}


module.exports = f


