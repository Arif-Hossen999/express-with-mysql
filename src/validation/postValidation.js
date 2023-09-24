// import validator
const { check, validationResult } = require("express-validator");

// validation rules
exports.postValidator = [
  check("title").notEmpty().withMessage("Title is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("category_id").notEmpty().withMessage("Category Id is required"),
];

// validation message
exports.postValidatorMsg = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};
