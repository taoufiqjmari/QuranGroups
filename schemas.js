const Joi = require('joi');

const groupSchema = Joi.object({
    number: Joi.number().min(1).required(),
});

const memberSchema = Joi.object({
    number: Joi.number().min(1).max(60).required(),
    name: Joi.string().min(1).required(),
});

module.exports = { groupSchema, memberSchema };
