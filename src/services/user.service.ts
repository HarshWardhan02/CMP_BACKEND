import { ResposeDTO } from "../interfaces/common.interface";
import { AppConstants } from "../utils/app.constants";
import User, { UserDocument, UserModel } from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/log.utils";
import { DatabaseException } from "../exceptions/database.exception";
import { generateHumanReadableID } from "../utils/common.utils";
import * as CommonUtil from "../utils/common.utils";
import bcrypt from "bcryptjs";
import { UserRequest } from "../interfaces/user.interface";
import { error, log } from "console";
import https from "https";

export const registerUser = async (
  userReq: UserRequest
): Promise<ResposeDTO> => {
  const resposeDto: ResposeDTO = {
    resposeCode: AppConstants.MESSAGE.SUCCESS.CODE,
    resposeMessage: AppConstants.MESSAGE.SUCCESS.MSG,
  };

  try {
    const humanReadableID = await generateHumanReadableID(
      AppConstants.READABLE_ID.USER.ID,
      AppConstants.READABLE_ID.USER.PREFIX
    );
    const user = new User({
      userID: uuidv4(),
      displayID: humanReadableID,
      firstName: userReq.firstName,
      lastName: userReq.lastName,
      username: userReq.userName,
      password: userReq.password,
    });

    const userModel: UserModel | null = await User.findOne({
      username: userReq.userName.toLowerCase(),
    });

    if (!userModel) {
      await user.save();
      resposeDto.resposeCode = AppConstants.MESSAGE.SUCCESS.CODE;
      resposeDto.resposeMessage = "new user created successfully";
    } else {
      resposeDto.resposeCode = AppConstants.MESSAGE.BAD_REQUEST.CODE;
      resposeDto.resposeMessage = "User already exist";
    }
  } catch (ex: any) {
    logger.error("Error in registerUser", ex);
    console.error(ex);
    throw new DatabaseException(
      AppConstants.MESSAGE.INCORRECT_CREDENTIAL.MSG,
      ex
    );
  }
  return resposeDto;
};
