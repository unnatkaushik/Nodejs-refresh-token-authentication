import express from "express";
import router from "./router/index.js";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
app.use(ErrorMiddleware);

//error middleware used

export default app;
