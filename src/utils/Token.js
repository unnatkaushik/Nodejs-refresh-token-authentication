import config from "../config/index.js";
import UserTokenSchema from "../model/UserToken.schema.js";

const accessTokenExpire = parseInt(config.ACCESS_TOKEN_EXPIRE || "300", 10);

const refreshTokenExpire = parseInt(config.REFRESH_TOKEN_EXPIRE || "300", 10);

export const accessTokenCookiesOption = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  secure: false,
};

export const refreshTokenCookiesOption = {
  expires: new Date(Date.now() + refreshTokenExpire * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  secure: false,
};

export const createToken = async (user, res) => {
  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  const checkPrevToken = await UserTokenSchema.findOneAndDelete({
    userId: user._id,
  });
  console.log(checkPrevToken);
  await UserTokenSchema.create({
    userId: user._id,
    refreshtoken: refreshToken,
  });
  res.cookie("access_token", accessToken, accessTokenCookiesOption);
  res.cookie("refresh_token", refreshToken, refreshTokenCookiesOption);

  res.status(200).json({
    message: "user loggedin successfully",
    success: true,
    user,
    accessToken,
  });
};
