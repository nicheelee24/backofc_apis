import multer from 'multer';

// SET STORAGE
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Audio');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

/* defined filter */
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/octet-stream' ||
        file.mimetype === "audio/mpeg" ||
        file.mimetype === "audio/wav"
    ) {
        cb(null, true);
    } else {
        cb(new Error("File format should be PNG,JPG,JPEG for images and MP3 and WAV for audios "), false);
    }
};

export const upload = multer({ storage: diskStorage, fileFilter: fileFilter });

