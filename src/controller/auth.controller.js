import config from "../config/index.js";
import UserTokenSchema from "../model/UserToken.schema.js";
import userSchema from "../model/user.schema.js";
import User from "../model/user.schema.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {
  accessTokenCookiesOption,
  createToken,
  refreshTokenCookiesOption,
} from "../utils/Token.js";
import jwt from "jsonwebtoken";

export const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user = await User.create({ name, email, password });

    const token = await user.createAccessToken();

    res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, 400));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Email and password is required", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Enter valid email or password", 400));
    }

    const checkPass = await user.comparepassword(password);

    if (!checkPass) {
      return next(new ErrorHandler("Enter valid email or password", 400));
    }
    user.password = undefined;
    createToken(user, res);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, 400));
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;

    const verifyJwt = jwt.verify(token, config.REFRESH_TOKEN);
    if (!verifyJwt) {
      return next(new ErrorHandler("Please login in again", 400));
    }

    const tokenCheck = await UserTokenSchema.findOne({ refreshtoken: token });
    if (!tokenCheck) {
      return next(new ErrorHandler("Please login in again", 400));
    }
    console.log(tokenCheck);
    await tokenCheck.deleteOne();
    const accessToken = jwt.sign({ id: verifyJwt.id }, config.ACCESS_TOKEN, {
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign({ id: verifyJwt.id }, config.REFRESH_TOKEN, {
      expiresIn: "3d",
    });

    await UserTokenSchema.create({
      userId: verifyJwt.id,
      refreshtoken: refreshToken,
    });

    res.cookie("access_token", accessToken, accessTokenCookiesOption);
    res.cookie("refresh_token", refreshToken, refreshTokenCookiesOption);

    res.status(200).json({
      status: "success",
      accessToken,
    });
  } catch (error) {
    return next(new ErrorHandler(error), 400);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { access_token, refresh_token } = req.cookies;
    if (!access_token) return next(new ErrorHandler("unauthrize user", 400));
    const tokenVerification = jwt.verify(access_token, config.ACCESS_TOKEN);

    if (!tokenVerification) {
      return next(new ErrorHandler("Please login in again", 400));
    }

    const userId = await UserTokenSchema.findOne({
      userId: new Object(tokenVerification.id),
    });

    userId.deleteOne();
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return next(new ErrorHandler(error), 400);
  }
};

export const allUser = async (req, res, next) => {
  try {
    const allUser = await userSchema.find();
    console.log(allUser);

    res
      .status(200)
      .json({ success: true, message: "Fetched successfully", users: allUser });
  } catch (error) {
    return next(new ErrorHandler(error), 400);
  }
};

export const myInfo = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

export const testing = async (req, res, next) => {
  res.cookie(
    "access_token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2QzODVlZWY4ZTA0OWViYTY1ZjJhZCIsImlhdCI6MTcxOTQ4NTAxMiwiZXhwIjoxNzE5NDg1MzEyfQ.lK7W4kY0WbZKWAFtS0_p6f544hgC5yoTgXGawb1U6Uk",
    accessTokenCookiesOption
  );
  res.send("hello");
};
