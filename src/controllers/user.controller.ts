import { Request, Response, response } from "express";
import * as UserService from "../services/user.service";
import { ResposeDTO } from "../interfaces/common.interface";
import { validateUser, validateLoginForm } from "../validators/userValidation";
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

export const login = async (req: Request, res: Response) => {
  const startTime = new Date();
  logger.info("START TAG :---LOGIN START");
  try {
    console.log("eeeeee", req.body);

    // const { error } = validateLoginForm(req.body);
    // if (error) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     responseCode: AppConstants.MESSAGE.BAD_REQUEST.CODE,
    //     responseMessage: errorMessageFormat(error.details[0].message),
    //   });
    // }
    const user: UserDocument | null = await UserService.getUserByUserName(
      req.body.userName
    );
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        responseCode: AppConstants.MESSAGE.INCORRECT_CREDENTIAL.CODE,
        responseMessage: AppConstants.MESSAGE.INCORRECT_CREDENTIAL.MSG,
      });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        responseCode: AppConstants.MESSAGE.INCORRECT_CREDENTIAL.CODE,
        responseMessage: AppConstants.MESSAGE.INCORRECT_CREDENTIAL.MSG,
      });
    }

    const rememberMe: boolean = req.body.rememberMe;
    const clientID = uuidv4();
    const accessToken = user.generateJWTAcessToken(clientID);
    const refreshToken = user.generateJWTRefreshToken(clientID);
    await UserService.recordLogin(
      clientID,
      user.userID,
      refreshToken,
      rememberMe
    );

    return res.status(StatusCodes.OK).json({
      responseCode: AppConstants.MESSAGE.SUCCESS.CODE,
      responseMessage: AppConstants.MESSAGE.SUCCESS.MSG,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (ex: any) {
    const resposeDto: ResposeDTO = {
      resposeCode: AppConstants.MESSAGE.INTERNAL_SERVER_ERROR.CODE,
      resposeMessage: ex.message,
    };
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(resposeDto);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const startTime = new Date();
  logger.info("START TAG :---REFRESH START");
  try {
    const inputRefreshToken: string | undefined =
      req.query.refreshToken?.toString();
    let inputAccessToken: string = "";
    if (req.query.accessToken) {
      inputAccessToken = req.query.accessToken.toString();
    }

    if (
      inputRefreshToken === null ||
      inputRefreshToken === "" ||
      inputRefreshToken === undefined
    ) {
      logger.info("Rerefsh token blank:", inputRefreshToken);
      return res.status(StatusCodes.BAD_REQUEST).json({
        responseCode: AppConstants.MESSAGE.INCORRECT_CREDENTIAL.CODE,
        responseMessage: AppConstants.MESSAGE.INCORRECT_CREDENTIAL.MSG,
      });
    }

    let refreshTokenDecode: any = null;
    try {
      const secreteKey: Secret = config.get("refresh_token_secrete_key");
      refreshTokenDecode = jwt.verify(inputRefreshToken, secreteKey);
    } catch (exception) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        responseCode: AppConstants.MESSAGE.TOKEN_EXPIRED.CODE,
        responseMessage: AppConstants.MESSAGE.TOKEN_EXPIRED.MSG,
      });
    }

    const user: UserDocument | null = await UserService.getUserByUserName(
      refreshTokenDecode.userName
    );
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        responseCode: AppConstants.MESSAGE.INCORRECT_CREDENTIAL.CODE,
        responseMessage: AppConstants.MESSAGE.INCORRECT_CREDENTIAL.MSG,
      });
    }

    if (inputAccessToken) {
      let decryptedAccessToken = null;
      try {
        const accessSecreteKey: Secret = config.get("access_token_secrete_key");
        decryptedAccessToken = jwt.verify(inputAccessToken, accessSecreteKey);
      } catch (exception) {
        logger.info(exception);
        return res.status(StatusCodes.BAD_REQUEST).json({
          responseCode: AppConstants.MESSAGE.ACCESS_TOKEN_EXPIRED.CODE,
          responseMessage: AppConstants.MESSAGE.ACCESS_TOKEN_EXPIRED.MSG,
        });
      }
    }

    const newAccessToken = user.generateJWTAcessToken(
      refreshTokenDecode.clientID
    );
    return res.status(StatusCodes.OK).json({
      responseCode: AppConstants.MESSAGE.SUCCESS.CODE,
      responseMessage: AppConstants.MESSAGE.SUCCESS.MSG,
      data: {
        accessToken: newAccessToken,
        refreshToken: inputRefreshToken,
      },
    });
  } catch (ex: any) {
    const resposeDto: ResposeDTO = {
      resposeCode: AppConstants.MESSAGE.INTERNAL_SERVER_ERROR.CODE,
      resposeMessage: ex.message,
    };
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(resposeDto);
  } finally {
    logger.info("END TAG :---REFRESH END");
  }
};
