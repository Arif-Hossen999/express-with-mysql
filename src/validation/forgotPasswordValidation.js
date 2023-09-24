// import validator
const { check, validationResult } = require("express-validator");

// validation rules
exports.forgotPasswordValidator = [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email!"),
    
  ];
  
  // validation message
  exports.forgotPasswordValidatorMsg = (req, res, next) => {
    // console.log("object validator");
    const result = validationResult(req).array();
    if (!result.length) return next();
  
    const error = result[0].msg;
    res.json({ success: false, message: error });
  };
