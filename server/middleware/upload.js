const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const time = Date.now();
        cb(null, time+ext);
    }
})

const upload = multer({
    storage:storage,
    limits:{
        fileSize:10000000
    },
    fileFilter:(req, file, cb) => {
        const mime = file.mimetype;
        if(mime === "image/jpg" || mime === "image/jpeg" || mime === "image/png"){
            cb(null, true);
        }
        else{
            cb({"error":"File format not supported"}, false);
        }
    }
})

module.exports = upload;