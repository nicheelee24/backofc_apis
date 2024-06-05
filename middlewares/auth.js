import { NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from '../config/index.js';

export default function(req, res, next)  {
  // req.get() help to fetch data from header
  let decodedToken;
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authorized");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  try {

    decodedToken = jwt.verify(token, config.jwtOption.secret);
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userIdPk;
  next();
};
