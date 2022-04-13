const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validatelink = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат URL');
  }
  return value;
};

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validatelink).required(),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
      .alphanum(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .alphanum(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(validatelink).required(),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validatelink),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateUser,
  validateAvatar,
  validateUserId,
  validateCardId,
  validateCard,
  validateSignup,
  validateSignin,
};
