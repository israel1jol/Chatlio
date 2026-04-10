const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3 } = require("aws-sdk");
const path = require("path");

const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const time = Date.now();
            cb(null, time + ext);
        },
        acl: "public-read"
    }),
    limits: {
        fileSize: 10000000 // 10MB
    },
    fileFilter: (req, file, cb) => {
        const mime = file.mimetype;
        if (mime === "image/jpg" || mime === "image/jpeg" || mime === "image/png") {
            cb(null, true);
        } else {
            cb(new Error("File format not supported"), false);
        }
    }
});

module.exports = upload;