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
        console.log(error, "Google strategy error!")
        return done(error);
      }
    },
  ),
);

// Flow of google authentication
// frontend (localhost or production) --> backend (localhost or production) --> passport --> Google OAuth consent screen --> Gmail login --> Successful --> backend callback url (localhost or production) --> Db store --> token

// Bridge === Google --> User check if exist or not --> User db store --> token

// Custom --> email, password, role etc --> registration --> DB --> User creation (main part is role here)
// Google --> request --> google --> login successful (for google) : JWT token : User role, email etc --> DB Store of the user --> Token for api access
