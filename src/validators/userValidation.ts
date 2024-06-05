import Joi from "joi";

export function validateUser(user: any) {
  const schema = Joi.object({
    _csrf: Joi.string().allow(null, ""),
    firstName: Joi.string()
      .max(100)
      .required()
      .label("firstName field is missing:"),
    lastName: Joi.string()
      .max(100)
      .required()
      .label("lastName field is missing:"),
    password: Joi.string()
      .min(8)
      .required()
      .label("password field is missing:"),
    userName: Joi.string()
      .max(100)
      .required()
      .label("userName field is missing:"),
  });
  return schema.validate(user);
}

export function validateLoginForm(user: any) {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .required()
      .label("password field is missing:"),
    userName: Joi.string()
      .max(100)
      .required()
      .label("userName field is missing:"),
    rememberMe: Joi.boolean().label("rememberMe field is missing:"),
  });
  return schema.validate(user);
}

export default validateUser;
