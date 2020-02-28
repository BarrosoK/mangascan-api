const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const validators = require('./auth.validators');

router.post('/register',
    validators.register,
    controller.register);

module.exports = router;
