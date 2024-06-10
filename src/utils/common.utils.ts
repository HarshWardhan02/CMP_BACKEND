import readableSettingModel from "../models/readableSetting.model";
import { logger } from "../utils/log.utils";

export const getUTCTimeStamp = () => {
  const currTimestamp = new Date().toISOString();
  return new Date(currTimestamp).getTime();
};
export const getUTCDate = () => {
  const currTimestamp = new Date().toISOString();
  return new Date(currTimestamp);
};

export const errorMessageFormat = (message: string) => {
  let findValue = message.indexOf(":");
  if (findValue < 0) {
    return message.replace(/"/g, "");
  }
  message = message.substr(0, findValue);
  return message.replace(/"/g, "");
};
const sleep = (waitTimeInMs: number) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

export const generateHumanReadableID = async (
  idType: string,
  prefix: string
) => {
  try {
    const strDate = new Date();
    const shortYear = strDate.getFullYear();
    const currentYear = shortYear.toString().substr(-2);
    let currentMonth = "";
    if ((strDate.getMonth() + 1).toString().length === 2) {
      currentMonth = (strDate.getMonth() + 1).toString();
    } else {
      currentMonth = `0${(strDate.getMonth() + 1).toString()}`;
    }

    const initialNumber = 1000;
    const maxRetry = 3;
    let generatedID = "";
    let retry = true;
    let retryCount = 0;
    while (retry) {
      try {
        retry = false;
        retryCount += 1;
        generatedID = await upsertReadableID(
          idType,
          prefix,
          currentYear,
          currentMonth,
          initialNumber
        );
      } catch (exception) {
        if (retryCount <= maxRetry) {
          retry = true;
          sleep(5 * retryCount);
        } else {
          throw exception;
        }
      }
    }

    return generatedID;
  } catch (exception) {
    logger.error("Error in generateHumanReadableID", exception);
    throw exception;
  }
};

const upsertReadableID = async (
  inputIdType: string,
  inputPrefix: string,
  currentYear: string,
  currentMonth: string,
  initialNumber: number
) => {
  try {
    const data = await readableSettingModel.findOneAndUpdate(
      {
        idType: inputIdType.trim(),
        prefix: inputPrefix.trim(),
        year: currentYear,
        month: currentMonth,
      },
      {
        $inc: { currentNumber: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (data.currentNumber <= initialNumber) {
      data.currentNumber = initialNumber + (data.currentNumber - 1);
      await readableSettingModel.updateOne(
        {
          idType: inputIdType.trim(),
          prefix: inputPrefix.trim(),
          year: currentYear,
          month: currentMonth,
        },
        { $set: { currentNumber: data.currentNumber } }
      );

      await readableSettingModel.deleteMany({
        idType: inputIdType.trim(),
        prefix: inputPrefix.trim(),
        $or: [{ year: { $ne: currentYear } }, { month: { $ne: currentMonth } }],
      });
    }

    const generatedID = `${data.prefix}-${data.year}${data.month}-${data.currentNumber}`;
    return generatedID;
  } catch (exception) {
    logger.error("Error in upsertReadableID", exception);
    throw exception;
  }
};

export const replaceSpecialCharacterByRegex = (
  inputGlobalSearchPattern: string
): string => {
  let globalSearchPattern = inputGlobalSearchPattern;
  globalSearchPattern = globalSearchPattern.replace(/\+/g, "\\+"); // replace + character
  globalSearchPattern = globalSearchPattern.replace(/\*/g, "\\*"); // replace + character
  globalSearchPattern = globalSearchPattern.replace(/\(/g, "\\("); // replace ( character
  globalSearchPattern = globalSearchPattern.replace(/\)/g, "\\)"); // replace ) character
  globalSearchPattern = globalSearchPattern.replace(/\?/g, "\\?"); // replace ? character
  globalSearchPattern = globalSearchPattern.replace(/\|/g, "\\|"); // replace | character
  globalSearchPattern = globalSearchPattern.replace(/\[/g, "\\["); // replace [ character
  globalSearchPattern = globalSearchPattern.replace(/\]/g, "\\]"); // replace ] character
  globalSearchPattern = globalSearchPattern.replace(/\$/g, "\\$"); // replace $ character
  globalSearchPattern = globalSearchPattern.replace(/\./g, "\\."); // replace . character
  globalSearchPattern = globalSearchPattern.replace(/\"/g, '\\"'); // replace " character

  // need to add another special character.
  return globalSearchPattern;
};
