const express = require('express');
const router = express.Router();

const userController = require('../controllers/user')


router.post('/signup', userController.signupData);

router.post('/login', userController.loginData);

module.exports = router;