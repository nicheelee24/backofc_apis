import { validationResult, body, query, param, check } from "express-validator";
import fs from 'fs'
import { logger } from './logger.js'
import bcryptJs from "bcryptjs";
import sgMail from '@sendgrid/mail'
import ejs from "ejs"
import { DateTime } from "luxon";
import path from "path"
import jwt from "jsonwebtoken"
import  { createTransport }  from "nodemailer"
import { uploadPromise } from "../middlewares/bucket-upload.js";
// if(process.env.SENDGRID_API_KEY !== undefined)
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const connection = {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    service: process.env.MAIL_MAILER,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
}
const transporter = createTransport({
    service: "service-name",
    host: "host",
    auth: {
        user: 'username',
        pass: 'password'
    },
    secure: false, 
    port: 587,
    tls: {rejectUnauthorized: false},
  });
export const bodyNotEmpty = (key) => {
    return body(key).notEmpty().withMessage(`${key} field is empty`);
};

export const queryNotEmpty = (key) => {
    return query(key).notEmpty().withMessage(`${key} field is empty`);
};

export const paramNotEmpty = (key) => {
    return param(key).notEmpty().withMessage(`${key} field is empty`);
};
export const ValidateDateFormat = (key) =>{
    return check(key).matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).withMessage(`${key} format should be (YYYY-MM-DD)`)
}
export const ValidateStatus = (key) =>{
    return check(key).trim().matches(/^[A-Z]+$/).withMessage(`${key} Should be in caps`)
}
export const ValidateName = (key) =>{
    return check(key).matches(/^([a-zA-Z]+\s)*[a-zA-Z]+$/).withMessage(`${key} can contain only Uppercase, lowercase and single space`)
}
export const clearImage= (path)=>{
    fs.unlink(path, (err) => {
        if (err) {
            logger.error(err)
        }})
}

export const generateToken = (tokenData, secretKey, expiresIn) => {
    return jwt.sign(tokenData, secretKey, { expiresIn: '30d' });
  };

export const hashPassword = (password) => {
    if(process.env.SALT_ROUNDS) {
        const salt = bcryptJs.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        return bcryptJs.hashSync(password, salt);
    }
  };
  
export const comparePassword = (password1, password2) => {
    return bcryptJs.compareSync(password1, password2);
  };
export const checkInputError = function(req, images = []) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (images.length > 0) {
            images.forEach((image) => {
                clearImage(image.path);
            });
        }
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
};


export const sendEmail = async function({to, from, subject, templateName, data}) {
    try {
        const html = await ejs.renderFile(path.join(__dirname, `../Templates/${templateName}.ejs`), data, { async: true })
        const msg = {
            to, 
            from,
            subject,
            html
          }
          
          const mailSent = await transporter.sendMail(msg)
          console.log(mailSent);
          
          return mailSent
          
    } catch (error) {
        console.log(error);
        
        throw error
    }
}

export const generateRandom = () => {
    return Math.floor(100000 + Math.random() * 900000)
  }

export const catchError = function (err, next) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}


  export function getDateTimeForToday(timezone = "America/Chicago") {
    // NOTE: Change the timezone instead of America/Chicago to anything
    const today = DateTime.local().setZone(timezone);
  
    return {
      day: today.day,
      month: today.month,
      year: today.year,
      hour: today.hour,
      minute: today.minute,
      datestamp: ((today.year-2000)+''+((today.month<10?'0':'')+today.month)+''+((today.day<10?'0':'')+today.day)+''+((today.hour<10?'0':'')+today.hour)+''+((today.minute<10?'0':'')+today.minute)),
      timestamp: today.setZone(timezone).toJSDate(),
      mongoTimestamp: today.setZone(timezone).toISO({ includeOffset: true })
    }
  }
  
  export function generateFileName(fileExtension) {
    // Get current date
    const currentDate = new Date();
  
    // Extract date components
    const year = currentDate.getFullYear() % 100;
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
    // Generate random number (between 1000 and 9999)
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  
    // Construct file name with date stamp and random number
    const fileName = `${year}${month}${day}_${hours}${minutes}${seconds}_${randomNumber}`;
  
    return `${fileName}.${fileExtension}`;
  }
  
  
export async function uploadBase64ImageToS3(base64String, sessionId) {
    try {
        let base64Image = base64String.split(';base64,').pop();
        const fileName = generateFileName("jpeg")
        fs.writeFileSync(fileName, base64Image,{encoding: "base64"});
        const uploadResult = await uploadPromise(fileName, `${sessionId}/${fileName}`)
        console.log('Image uploaded successfully:');
        fs.unlinkSync(fileName);
        return uploadResult
      } catch (error) {
        console.error('Error uploading image to S3:', error);
      }
}

