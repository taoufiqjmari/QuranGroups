const Joi = require('joi');

module.exports.groupSchema = Joi.object({
    num: Joi.number().min(1).required(),
});
