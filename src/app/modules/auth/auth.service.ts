/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { User } from "../user/user.model";

// const crendentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string,
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!");
//   }

//   const userTokens = createUserTokens(isUserExist);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: passwordToRemove, ...rest } = isUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken =
    await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatched = await bcryptjs.compare(
    oldPassword,
    user!.password as string,
  );
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password does not match!");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  user!.save();
};

export const AuthServices = {
  // crendentialsLogin,
  getNewAccessToken,
  resetPassword,
};
