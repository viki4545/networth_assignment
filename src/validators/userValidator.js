import Joi from "joi";

export const userSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  ssn: Joi.string().min(9).optional(),
});
