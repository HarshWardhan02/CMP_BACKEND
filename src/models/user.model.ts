import { Document, Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import config from "config";
import jwt, { Secret } from "jsonwebtoken";

const userSchema = new Schema<UserDocument, UserModel>({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  displayID: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export interface User {
  userID: string;
  displayID: string;
  firstName: string;
  lastName?: string;
  username: string;
  password: string;
}

export interface UserDocument extends User, Document {
  fullName: string;
  getUserType(): string;
  generateJWTAcessToken(clientID: string): string;
  generateJWTRefreshToken(clientID: string): string;
}

userSchema.virtual("fullName").get(function (this: UserDocument) {
  return this.firstName + " " + this.lastName;
});

userSchema.methods.generateJWTAcessToken = function (
  this: UserDocument,
  clientID: string
) {
  const activeDirectoryDomain: string = config.get("activeDirectoryDomain");
  const expiresInMunites = 60;
  let payload = {
    clientID: clientID,
    userID: this.userID,
    userName: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    expireMinutes: expiresInMunites,
  };

  let secreteKey: Secret = config.get("access_token_secrete_key");
  let token = jwt.sign(payload, secreteKey, {
    expiresIn: expiresInMunites + "m",
  });
  return token;
};

userSchema.methods.generateJWTRefreshToken = function (
  this: UserDocument,
  clientID: string
) {
  const expiresInMunites = 24 * 60;
  let payload = {
    clientID: clientID,
    userID: this.userID,
    userName: this.username,
    expireMinutes: expiresInMunites,
  };

  let secreteKey: Secret = config.get("refresh_token_secrete_key");
  let token = jwt.sign(payload, secreteKey, {
    expiresIn: expiresInMunites + "m",
  });
  return token;
};

userSchema.pre<UserDocument>("save", function (next) {
  const user = this;
  if (this.isModified("password")) {
    bcrypt.genSalt(10, (err: any, salt: any) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

export interface UserModel extends Model<UserDocument> {}

export default model<UserDocument, UserModel>("User", userSchema);
