import jwt from "jsonwebtoken";
import config from "../config/index.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import userSchema from "../model/user.schema.js";

export const AuthMiddleware = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const { access_token } = req.cookies;
    const tokenRes = jwt.verify(access_token, config.ACCESS_TOKEN);
    if (!tokenRes) {
      return next(new ErrorHandler("invalid token", 500));
    }
    const user = await userSchema.findOne({ _id: new Object(tokenRes.id) });
    if (!user) {
      return next(new ErrorHandler("user not found", 400));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, 500));
  }
};
