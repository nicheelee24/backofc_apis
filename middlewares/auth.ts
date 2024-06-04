import { NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from '../config';

export default function(req: any, res: Response, next: NextFunction)  {
  // req.get() help to fetch data from header
  let decodedToken: any;
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: any = new Error("Not authorized");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  try {

    decodedToken = jwt.verify(token, config.jwtOption.secret);
  } catch (err: any) {
    err.statusCode = 401;
    throw err;
  }

  if (!decodedToken) {
    const error: any = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userIdPk;
  next();
};
