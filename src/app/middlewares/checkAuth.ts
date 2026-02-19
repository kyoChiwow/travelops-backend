import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Token received!");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;

      if (!verifiedToken) {
        throw new AppError(403, `Invalid Token! ${verifiedToken}`);
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, `You are not authorized!`);
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
