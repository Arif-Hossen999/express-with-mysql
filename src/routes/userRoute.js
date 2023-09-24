const express = require('express');
const router = express.Router();

// import user controller
const userController = require('../controllers/userController');
// import user validator
const {userValidator, userValidatorMsg} = require('../validation/userValidation');
// login validator
const {loginValidator, loginValidatorMsg} = require('../validation/loginValidator');
// forgotPassword validator
const {forgotPasswordValidator, forgotPasswordValidatorMsg} = require('../validation/forgotPasswordValidation');


// create new user
router.post('/', userValidator, userValidatorMsg, userController.createNewUser);
// login user
router.post('/login/', loginValidator, loginValidatorMsg, userController.loginUser);
// get new accessToken with refreshToken
router.post('/refresh-token/', userController.refreshToken);
// update password
router.post('/update/password/', userController.updatePassword);
// forgot password
router.post('/forgot-password/', forgotPasswordValidator, forgotPasswordValidatorMsg, userController.forgotPassword);
// create 2fa with google auth app
router.get('/create/two-fa/', userController.createTwoFA);
// verify 2fa 
router.post('/verify/two-fa/', userController.twoFAVerify);

module.exports = router;