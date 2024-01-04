import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import {
  getGoogleOAuthTokens,
  jwtDecode,
  generatePasswordSalt,
  comparePassword,
} from "../services/auth.services";
import { signJwt } from "../utils/jwt.utils";
import configClass from "../configs";
import { HttpException } from "../interfaces/http.exception";
import { MongoMethod } from "../databases/mongo/method";

class AuthController {
  mongoMethod: MongoMethod = MongoMethod.initialize();

  public googleOauth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //get the code from qs
      const code = req.query.code as string;
      //get the id and access token with code
      const { id_token, access_token } = await getGoogleOAuthTokens({ code });

      //get user with token
      const googleUser: any = jwtDecode(id_token) || {};

      if (!googleUser && !googleUser.email_verified) {
        return res.status(403).send("Google account is not verified");
      }

      //upsert the user
      const user = await this.mongoMethod.findAndUpdateuser(
        { user_email: googleUser.email },
        {
          user_type: "Google",
          user_email: googleUser.email,
          user_name: googleUser.name,
          created_at: new Date(),
          updated_at: new Date(),
          expiry: new Date(),
        },
        "user"
      );

      //create a session
      //   const session = await createSession(
      //     user._id,
      //     req.get("user-agent") || ""
      //   );

      //create access and refresh token
      const access_jwt_token = signJwt({ ...user }, { expiresIn: 15 });

      //set cookies
      res.cookie("accessToken", access_jwt_token, {
        maxAge: 90000,
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "lax",
        secure: false,
      });
      //redirect back to client
      res.redirect("http://localhost:4200");
    } catch (error) {
      console.error(error);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { user_name, user_email, password } = req.body;
      const existingUser = await this.mongoMethod.findOne("user", {
        user_email,
      });
      console.log(existingUser);

      if (existingUser?._id) {
        return res.status(400).json({ message: "User already exist" });
      }

      //create password hash
      password = generatePasswordSalt(password);

      //update user collection
      await this.mongoMethod.insertOne("user", {
        user_type: "Custom",
        user_email: user_email,
        user_name: user_name,
        password: password,
        created_at: new Date(),
        updated_at: new Date(),
        expiry: new Date(),
      });
      return res.status(200).json({ message: "User created" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server Issue. Please contact Admin" });
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { user_email, password } = req.body;
      const existingUser = await this.mongoMethod.findOne("user", {
        user_email,
      });
      if (!comparePassword(password, existingUser?.password)) {
        return res.status(401).json({ message: "Bad Password" });
      }
      const access_jwt_token = signJwt({ ...existingUser }, { expiresIn: 15 });

      return res.status(200).json({
        user_data: {
          email: existingUser.user_email,
          name: existingUser.user_name,
          id: existingUser._id,
          created_at: existingUser.created_at,
        },
        token: access_jwt_token,
      });

      //set cookies
      // res.cookie("accessToken", access_jwt_token, {
      //   maxAge: 90000,
      //   httpOnly: true,
      //   domain: "localhost",
      //   path: "/",
      //   sameSite: "lax",
      //   secure: false,
      // });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server Issue. Please contact Admin" });
    }
  };

  public tokenValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.header("accessToken")
        ? req.header("accessToken")
        : null;
      if (token) {
        let data: any = await verify(token, configClass.initialize().Salt.salt);
        const userData = {
          user_name: data.user_name || "",
          user_email: data.user_email || "",
        };
      } else {
        next(new HttpException(404, "Authentication token missing"));
      }
    } catch (error) {
      next(new HttpException(401, "Wrong Authentication"));
    }
  };
}

export default AuthController;
