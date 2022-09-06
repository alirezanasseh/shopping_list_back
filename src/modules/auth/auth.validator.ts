import Joi from 'joi';

export const authRegisterSchema = {
    body: Joi.object({
        name: Joi.string().min(2),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
};

export const authLoginSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};