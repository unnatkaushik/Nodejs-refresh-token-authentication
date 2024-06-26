import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLenght: 30,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: 6,
      select: false,
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
    __v: { type: Number, select: false },
  },
  { timestams: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods = {
  comparepassword: async function (password) {
    return await bcrypt.compare(password.toString(), this.password);
  },

  createAccessToken: function () {
    return jwt.sign({ id: this._id }, config.ACCESS_TOKEN, {
      expiresIn: "5m",
    });
  },
  createRefreshToken: function () {
    return jwt.sign({ id: this._id }, config.REFRESH_TOKEN, {
      expiresIn: "3d",
    });
  },
};
export default mongoose.model("User", userSchema);
