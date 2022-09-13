import Joi from 'joi';

export const roleCreateSchema = {
    body: Joi.object({
        name: Joi.string().required()
    })
};