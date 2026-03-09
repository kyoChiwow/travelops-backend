/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, async (email: string, password: string, done: any) => {
    try {
      const isUserExist = await User.findOne({ email });
      if (!isUserExist) {
        return done(null, false, { message: "User does not exist!"})
      }

      const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
      if (!isPasswordMatched) {
        return done(null, false, { message: "Password does not match!"})
      }

      return done(null, isUserExist);

    } catch (error) {
      console.log(error);
      return done(error);
    }
  })
)

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found!" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [{ provider: "google", providerId: profile.id }],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log(error, "Google strategy error!");
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});

// Flow of google authentication
// frontend (localhost:5173/login?redirect=/booking or production) --> backend (localhost:5000/api/v1/auth/google?redirect=/booking or production) --> passport --> Google OAuth consent screen --> Gmail login --> Successful --> backend callback url (localhost or production) --> Db store --> token

// Bridge === Google --> User check if exist or not --> User db store --> token

// Custom --> email, password, role etc --> registration --> DB --> User creation (main part is role here)
// Google --> request --> google --> login successful (for google) : JWT token : User role, email etc --> DB Store of the user --> Token for api access
