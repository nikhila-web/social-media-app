import express from "express";
import mongoose from "mongoose";
import router from "./routes.js";
import config from "./config.js";
import cookieParser from "cookie-parser";
const app = express();

mongoose
  .connect(config.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((res) => console.log(`Connection Succesful `))
  .catch((err) => console.log(`Error in DB connection ${err}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/", router);

app.listen(config.SERVER_PORT, () => {
  console.log(`Application is listening at port ${config.SERVER_PORT}`);
});
