import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  // if (isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User already exists!");
  // }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  /**
   * Email - You cannot update that
   * name, phone, password, address - updatable
   * password - rehashing required
   * Role changing - admin, superadmin, isDeleted
   * Superadmin promote - you can't do that
   */

  const ifUserExists = await User.findById(userId);

  if (!ifUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change role!",
      );
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change role!",
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change status!",
      );
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND,
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};
