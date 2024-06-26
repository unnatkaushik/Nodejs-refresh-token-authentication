import express from "express";
import {
  login,
  userRegister,
  refreshAccessToken,
  logout,
} from "../controller/auth.controller.js";
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", login);
router.get("/refresh", refreshAccessToken);
router.get("/logout", logout);

export default router;
