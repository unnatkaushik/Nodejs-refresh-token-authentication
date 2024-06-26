import app from "./src/app.js";
import mongoose from "mongoose";
import config from "./src/config/index.js";

(async () => {
  try {
    await mongoose
      .connect(config.DBurl)
      .then((res) => console.log("dbConnected"));

    app.listen(5000, () => {
      console.log("server started");
    });
  } catch (error) {
    console.log(error);
  }
})();
