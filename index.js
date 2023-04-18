process.on('uncaughtException',(err)=>{
  console.log(err);
})
import express from "express";
import { connectionDB } from "./DB/connections.js";
import * as allRouters from "./modules/index.routes.js";
import { config } from "dotenv";
import { appError } from "./service/appError.js";
import { globalErrorHandel } from "./service/globalErrorHandling.js";
config();
const app = express();
const port = process.env.PORT;
const baseUrl = "/api/v1";

app.use(express.json());

connectionDB();
app.use(`/user`, allRouters.userRouter);
app.use(`/product`, allRouters.ProductRouter);
app.use(`/comment`, allRouters.commentRouter);
app.use('/upload', express.static('./upload'));


app.all("*", (req, res, next) => {
  // res.json({ message: "In-valid Routing" });
  // next(new Error("invalid routing" + req.originalUrl, 404));
  next(new appError("invalid routing" + req.originalUrl, 404));
});

app.use(globalErrorHandel)
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


process.on('unhandledRejection', (err) => {
  console.log(err);
})
