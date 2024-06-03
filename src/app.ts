import express from "express";
import * as DbConnectUtil from "./utils/dbconnection.utils";
import { logger } from "./utils/log.utils";
import bodyParser from "body-parser";
import { indexRouter } from "../src/routes/index.router";
import * as StartupService from "../src/services/startup.service";
import { ResposeDTO } from "../src/interfaces/common.interface";
import dotenv from "dotenv";
import { AppConstants } from "./utils/app.constants";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api/v1", indexRouter);

app.get("/startup", async (req, res) => {
  logger.info("Welcome to startup api");
  console.log("welcome to startup application");
  await StartupService.createAdminUser();

  const resposeDto: ResposeDTO = {
    resposeCode: AppConstants.MESSAGE.SUCCESS.CODE,
    resposeMessage: AppConstants.MESSAGE.SUCCESS.MSG,
  };
  res.json(resposeDto);
});

DbConnectUtil.connectDatabase();

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
