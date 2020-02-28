const { check, body, validationResult } = require('express-validator');
const {validatorsValid} = require('../utils/utils');

module.exports = {
  register: [
    body('email').exists().isEmail().withMessage('email required'),
    body('name').exists().withMessage('name required'),
    body('password').exists().isLength({min: 4}),
    validatorsValid
  ]
};
