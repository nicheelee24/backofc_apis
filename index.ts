import express from "express";
import bodyparser from "body-parser";
import path from "path";
// import mongoose from "mongoose"
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { config } from "dotenv";
config({ path: `./.env` });
// import db from "./Utils/Database"
import redisDb from "./utils/redis"
import https from 'https'
import fs from 'fs'
import Shared from "./routes/shared.route";
import { logger } from "./utils/logger";
// import "./Config/Db-association"
// import http from "http"
// import rabbitMq from "./utils/rabbit-mq"
import envVariables from "./EnvVariables"
import mongoose from "mongoose"
import pagination from "./middlewares/pagination";
import { connectToMongoDb } from "./utils/database"
redisDb()
let v = envVariables()
if(!v.success) {
  console.log("Server could not start . Not all environment variable is provided");
  process.exit();
}

export const app = express();
// rabbitMq()
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyparser.json());
const port: any = process.env.PORT || 8080;

/* Swagger API initialization Served */

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "Backend web api created",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./Routes*.js"],
};
const specs = swaggerJsDoc(options);

/* Static Content Served */

app.use("/", express.static(path.join(__dirname, "public/starter-dashboard")));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../Templates')));
/* Swagger Route Served */
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

/* Deals with the CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/* Routes defined for all module */
app.use(pagination)
app.use("/api", Shared);

// globalThis.rabbitMqChannel.consume(helpers.queues.TRANSCRIPTION_RESULT_QUEUE, (msg: any) => {
//   // if(!msg.content) reject("No Message Received!!")
//   if (msg.content) {
//     console.log(`Received: ${msg.content.toString()}`);
//     // resolve(msg.content)
//   }
// }, { noAck: true });
// error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  const status = error.statusCode || 500;
  const message = error.message || "";
  let errorData = [];

  if (error.data) {
    errorData = error.data;
  }
  res.status(status).json({
    message: message,
    status: "failure",
    statusCode: status,
    error: errorData,
  });
});



function onError(error: any) {
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.log(process.env.PORT + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.log(process.env.PORT + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}


if(process.env.MONGODB_URL) {
  connectToMongoDb(process.env.MONGODB_URL)
}

if (process.env.NODE_ENV === 'production') {
  // only use in development
  //SSL ENABLED SERVER
  const ssl: any = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH ?? "", {encoding: 'utf8'}),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH ?? "", {encoding: 'utf8'}),
    ca: fs.readFileSync(process.env.SSL_CA_PATH ?? "", {encoding: 'utf8'}),
    passphrase: "qwerty"
  }
  
  https.createServer(ssl, app)
  .listen(port, () => {
    logger.info(`=================================`);
    logger.info(`🚀 Backend Service ready at http://localhost:${port} on ${process.env.NODE_ENV}`)
    logger.info(`=================================`);
  });
} else {
  app.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`🚀 Backend Service ready at http://localhost:${port} on ${process.env.NODE_ENV}`)
    logger.info(`=================================`);
  });
}
