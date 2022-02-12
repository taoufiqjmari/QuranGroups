const Joi = require('joi');

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

module.exports = { groupSchema, memberSchema };
