/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";

  // Duplicate Error
  if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/)
    statusCode = 400;
    message = `${matchedArray[1]} already exists!`;
  } 
  
  // Cast Error / ObjectId Error
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid MongoDB ObjectID. Please provide valid id!`;
  }

  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
  });
};
