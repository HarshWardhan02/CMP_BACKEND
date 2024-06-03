export class AppConstants {
  static MESSAGE = {
    SUCCESS: {
      CODE: "SUCCESS0000",
      MSG: "success",
    },
    BAD_REQUEST: {
      CODE: "ER0400",
      MSG: "bad request",
    },

    INTERNAL_SERVER_ERROR: {
      CODE: "ER0500",
      MSG: "We have encountered some problem. Please try again later.",
    },
    INCORRECT_CREDENTIAL: {
      CODE: "ER0020",
      MSG: "The credentials you have entered are not valid",
    },
    TOKEN_EXPIRED: {
      CODE: "ER0320",
      MSG: "The link you followed has expired",
    },
    ACCESS_TOKEN_EXPIRED: {
      CODE: "ER0034",
      MSG: "Access Token Expired.",
    },
    NOT_FOUND: {
      CODE: "ER0400",
      MSG: "Data not found",
    },
    BAD_PARAMETER: {
      CODE: "ER0042",
      MSG: "Parameters are not valid.",
    },
    FAILED_TO_SEND_MAIL: {
      CODE: "ER0044",
      MSG: "Parameters are not valid.",
    },
  };
  static TOKEN: {
    ERROR_BAD_TOKEN: "ER0280";
    ERROR_MSG_BAD_TOKEN: "Bad Token.";
  };
  static READABLE_ID = {
    USER: {
      ID: "User",
      PREFIX: "UR"
    }
};
}
