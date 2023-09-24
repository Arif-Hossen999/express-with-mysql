// import validator
const { check, validationResult } = require("express-validator");

// validation rules
exports.loginValidator = [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email!"),
    check("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password is empty!")
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be 6 to 20 characters long!"),
    
  ];
  
  // validation message
  exports.loginValidatorMsg = (req, res, next) => {
    // console.log("object validator");
    const result = validationResult(req).array();
    if (!result.length) return next();
  
    const error = result[0].msg;
    res.json({ success: false, message: error });
  };
