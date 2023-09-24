// import validator
const { check, validationResult } = require("express-validator");

// validation rules
exports.categoryValidator = [
  check("category_name")
    .notEmpty()
    .withMessage("Category Name is required"),
    // .trim()
    // .matches(/^[A-Za-z0-9\_]+$/)
    // .withMessage("Name must be alphanumeric only")
    // .escape(),
];

// validation message
exports.categoryValidatorMsg = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};
