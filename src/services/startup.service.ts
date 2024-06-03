import { ResposeDTO } from "../interfaces/common.interface";
import { AppConstants } from "../utils/app.constants";
import UserModel, { User, UserDocument } from '../models/user.model';
import { v4 as uuidv4 } from "uuid";
import { logger } from '../utils/log.utils';
import userModel from "../models/user.model";
import * as CommonUtil from "../utils/common.utils";


export const createAdminUser = async (): Promise<ResposeDTO> => {
    const user: User = {
        userID: uuidv4(),
        displayID: 'UR-2023-0001',
        firstName: 'Harsh',
        lastName: 'Pratap',
        username: 'harsh@yopmail.com',
        password: '12345678aA'
    };

    const userModel: UserDocument | null = await UserModel.findOne({ username: user.username });
    if (!userModel) {
        await UserModel.create(user);
        logger.info("New Admin create successfully");
    } else {
        logger.info("User already exit");
    }

    const resposeDto: ResposeDTO = {
        resposeCode: AppConstants.MESSAGE.SUCCESS.CODE,
        resposeMessage: AppConstants.MESSAGE.SUCCESS.MSG
    };
    return resposeDto;
}