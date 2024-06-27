import express from "express";
import {
  login,
  userRegister,
  refreshAccessToken,
  logout,
  allUser,
  myInfo,
  testing,
} from "../controller/auth.controller.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", login);
router.get("/refresh", refreshAccessToken);
router.get("/logout", logout);

router.get("/allUser", AuthMiddleware, allUser);
router.get("/test", testing);
router.get("/me", AuthMiddleware, myInfo);

export default router;
