import express from "express";
import * as UserController from "../controllers/user.controller";
export const userRouter = express.Router({ mergeParams: true });
userRouter.get("/", async (req, res) => {
  res.json({ message: "Hello user" });
});

userRouter.route("/registerUser").post(
  // [passport.authenticate("jwt", { session: false })],
  UserController.registerUser
);

userRouter.route("/login").post(UserController.login);
userRouter.route("/refreshToken").get(UserController.refreshToken);
