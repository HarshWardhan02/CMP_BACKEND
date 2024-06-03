import { Request, Response, response } from "express";
import * as UserService from "../services/user.service";
import { ResposeDTO } from "../interfaces/common.interface";
import { validateUser } from "../validators/userValidation";
import { AppConstants } from "../utils/app.constants";
import { StatusCodes } from "http-status-codes";
import { errorMessageFormat } from "../utils/common.utils";
import { logger } from "../utils/log.utils";
import { UserDocument } from "../models/user.model";
import bcrypt from "bcryptjs";
import config from "config";
import jwt, { Secret } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UserRequest } from "../interfaces/user.interface";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userReq: UserRequest = req.body;
    const { error } = validateUser(userReq);
    if (error) {
      const resposeDto: ResposeDTO = {
        resposeCode: AppConstants.MESSAGE.BAD_REQUEST.CODE,
        resposeMessage: errorMessageFormat(error.message),
      };
      return res.status(StatusCodes.BAD_REQUEST).json(resposeDto);
    }

    const resposeDto = await UserService.registerUser(userReq);
    if (resposeDto.resposeCode != AppConstants.MESSAGE.SUCCESS.CODE) {
      return res.status(StatusCodes.BAD_REQUEST).json(resposeDto);
    }
    return res.status(StatusCodes.CREATED).json(resposeDto);
  } catch (ex: any) {
    const resposeDto: ResposeDTO = {
      resposeCode: AppConstants.MESSAGE.INTERNAL_SERVER_ERROR.CODE,
      resposeMessage: ex.message,
    };
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(resposeDto);
  }
};
