import express from "express";
import { login, userRegister } from "../controller/auth.controller.js";
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", login);

export default router;
