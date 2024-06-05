import { Document, Model, model, Types, Schema, Query } from "mongoose";

const loginInfoSchema = new Schema<LoginInfoDocument, LoginInfoModel>({
  clientID: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  userID: {
    type: String,
    required: true,
    trim: true,
  },
  rememberMe: {
    type: Boolean,
  },
  refreshToken: {
    type: String,
    trim: true,
    required: true,
  },
  loginTime: {
    type: Number,
    default: 0,
  },
  logoutTime: {
    type: Number,
    default: 0,
  },
});

export interface LoginInfo {
  clientID: string;
  userID: string;
  rememberMe: boolean;
  refreshToken: string;
  loginTime: number;
  logoutTime: number;
}

export interface LoginInfoDocument extends LoginInfo, Document {}
export interface LoginInfoModel extends Model<LoginInfoDocument> {}

export default model<LoginInfoDocument, LoginInfoModel>(
  "LoginInfo",
  loginInfoSchema
);
