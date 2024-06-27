import express from "express";
import router from "./router/index.js";
import cors from "cors";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware.js";
import cookieParser from "cookie-parser";

const app = express();
const corsOptions = {
  AccessControlAllowOrigin: "*",
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3040"],
    credentials: true,
    httpOnly: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
app.use(ErrorMiddleware);

//error middleware used

export default app;
