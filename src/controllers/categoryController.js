// import db
var {db} = require("../models");

// create main Model
const Category = db.categories;

// get all category
async function getCategoryList(req, res) {
  try {
    const categories = await Category.findAll({
      where: { status: 1 },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// get single category by id
async function getCategoryById(req, res) {
  try {
    const id = req.params.id;
    const category = await Category.findOne({
      where: {
        id: id,
        status: 1,
      },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// create new category
async function createNewCategory(req, res) {
  try {
    const { category_name } = req.body;

    // check category name exist or not
    let check_category = await Category.findOne({
      where: { category_name: category_name },
    });
    if (check_category) {
      return res.status(409).json({
        messlage: "Category already exist",
      });
    }
    // create category
    const category = await Category.create({ category_name });
    return res.status(201).json({
      messlage: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// update category
async function categoryUpdate(req, res) {
  try {
    const { category_name } = req.body;
    const id = req.params.id;
    // Find the category by ID
    const category = await Category.findOne({
      where: {
        id: id,
        status: 1,
      },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    await category.update({
      category_name: category_name,
    });
    return res.status(200).json({
      message: "Category update successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// delete category
async function deleteCategory(req, res) {
  try {
    const id = req.params.id;
    // Find the category by ID
    const category = await Category.findOne({
      where: {
        id: id,
        status: 1,
      },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    // Delete the category
    await category.destroy();
    return res.status(200).json({
      message: "Category delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// update category status for delete
async function categoryUpdateStatus(req, res) {
  try {
    const id = req.params.id;
    // Find the category by ID
    const category = await Category.findOne({
      where: {
        id: id,
        status: 1,
      },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    await category.update({
      status: 0,
    });
    return res.status(200).json({
      message: "Category delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
// export all function
module.exports = {
  createNewCategory,
  getCategoryList,
  getCategoryById,
  categoryUpdate,
  deleteCategory,
  categoryUpdateStatus,
};
