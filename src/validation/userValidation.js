// import validator
const { check, validationResult } = require("express-validator");

// validation rules
exports.userValidator = [
    check("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 4 })
      .withMessage("Name must be at least 4 chars long")
      .isLength({ max: 12 })
      .withMessage(" Name must be less than 12 chars long")
      .trim()
      .matches(/^[A-Za-z0-9\_]+$/)
      .withMessage("Name must be alphanumeric only")
      .escape(),
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
    check("confirmPassword")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Confirm password is required!")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Both password must be same!");
        }
        return true;
      }),
  ];
  
  // validation message
  exports.userValidatorMsg = (req, res, next) => {
    // console.log("object validator");
    const result = validationResult(req).array();
    if (!result.length) return next();
  
    const error = result[0].msg;
    res.json({ success: false, message: error });
  };
