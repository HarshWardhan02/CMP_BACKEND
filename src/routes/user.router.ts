import express from "express";
import * as UserController from "../controllers/user.controller";
import passport from "passport";

export const userRouter = express.Router({ mergeParams: true });
userRouter.get("/", async (req, res) => {
  res.json({ message: "Hello user" });
});

userRouter.route("/registerUser").post(UserController.registerUser);

userRouter.route("/login").post(UserController.login);
userRouter.route("/refreshToken").get(UserController.refreshToken);

userRouter
  .route("/logout")
  .post(
    [passport.authenticate("jwt", { session: false })],
    UserController.logout
  );
