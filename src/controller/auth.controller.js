import User from "../model/user.schema.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user = await User.create({ name, email, password });

    const token = await user.createJwtToken();

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
    console.log(user);
    if (!user) {
      return next(new ErrorHandler("Enter valid email or password", 400));
    }

    const checkPass = await user.comparepassword(password);

    if (checkPass) {
      user.password = undefined;
      res
        .status(200)
        .json({ message: "user loggedin successfully", success: true, user });
    }
    return next(new ErrorHandler("sorry", 400));
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, 400));
  }
};
