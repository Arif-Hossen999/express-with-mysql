const express = require('express');
const router = express.Router();

// import category controller
const categoryController = require('../controllers/categoryController');
// import category validator
const {categoryValidator, categoryValidatorMsg} = require('../validation/categoryValidation');

// get all category 
router.get('/', categoryController.getCategoryList);
// get single category by id
router.get('/:id', categoryController.getCategoryById);
// create new category
router.post('/', categoryValidator, categoryValidatorMsg, categoryController.createNewCategory);
// update category
router.put('/:id', categoryController.categoryUpdate);
// delete category
router.delete('/:id', categoryController.deleteCategory);
// update status for delete category
router.put('/update/status/:id', categoryController.categoryUpdateStatus);

module.exports = router;