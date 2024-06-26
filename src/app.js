import express from "express";
import router from "./router/index.js";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
app.use(ErrorMiddleware);

//error middleware used

export default app;
