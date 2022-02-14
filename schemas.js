const Joi = require('joi');

const userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(50).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    }).required(),
});

const groupSchema = Joi.object({
    group: Joi.object({
        number: Joi.number().min(1).required(),
    }).required(),
});

const memberSchema = Joi.object({
    member: Joi.object({
        name: Joi.string().min(1).required(),
    }).required(),
});

module.exports = { userSchema, groupSchema, memberSchema };
