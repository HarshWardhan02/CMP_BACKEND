import express from "express";
import { userRouter } from "./user.router";
import { logger } from "../utils/log.utils";

export const indexRouter = express.Router({ mergeParams: true });
indexRouter.use((req, res, next) => {
  logger.info(`${new Date().toISOString()} => ${req.originalUrl}`);
  next();
});

indexRouter.get("/", (req, res) => {
  logger.info("Welcome to router");
  res.json({ message: "coming from index router" });
});
indexRouter.use("/user", userRouter);
