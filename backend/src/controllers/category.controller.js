import Category from "../models/category.schema.js";

export async function createCategory(req, res) {
  try {
    const category = req.body.categoryName;
    const existingCategory = await Category.findOne({
      categoryName: category,
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, msg: "Category already exists" });
    }
    const newCategory = await Category.create({
      categoryName: category,
      businessId: req?.params?.id,
      clientId: req.user?.id,
    });
    return res
      .status(201)
      .json({ success: true, msg: "Category Added", newCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
