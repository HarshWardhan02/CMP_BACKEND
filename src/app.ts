import express from "express";
import * as DbConnectUtil from "./utils/dbconnection.utils";
import { logger } from "./utils/log.utils";
import bodyParser from "body-parser";
import { indexRouter } from "../src/routes/index.router";
import * as StartupService from "../src/services/startup.service";
import { ResposeDTO } from "../src/interfaces/common.interface";
import dotenv from "dotenv";
import { AppConstants } from "./utils/app.constants";
import passport from 'passport';
import * as middle from './middlewares/passport.middleware';


dotenv.config();

const app = express();
var cors = require('cors')
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

passport.use(middle.strategy);
app.use(passport.initialize());

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
