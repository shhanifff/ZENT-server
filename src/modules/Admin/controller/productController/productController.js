import mongoose from "mongoose";
import productsModel from "../../models/productSchema/productSchema.js";

// << ======================== addProduct ====================== >>
export const addProduct = async (req, res) => {
  console.log("product check", req.body);

  const { name, category, details, images, price, quantity } = req.body;
  const productExist = await productsModel.findOne({ name });
  if (productExist) {
    return res.status(401).json({ success: false, message: "Product exists" });
  }

  const formattedImages = Array.isArray(images) ? images : [images];
  const newProduct = new productsModel({
    name,
    category,
    details,
    images: formattedImages,
    price,
    quantity,
  });

  await newProduct.save();

  res
    .status(201)
    .json({ success: true, message: "Product added", data: newProduct });
};

// << ============================ Edit Product ========================= >>
export const editProduct = async (req, res) => {
  const { productId } = req.params;
  console.log("Working");
  const { name, category, details, images, price, quantity } = req.body;

  const editedProduct = await productsModel.findByIdAndUpdate(
    productId,
    { $set: { name, category, details, images, price, quantity } },
    { new: true }
  );

  if (!editProduct) {
    return res
      .status(401)
      .json({ success: false, message: "Product Not Found" });
  }

  return res.status(201).json({
    success: true,
    message: "Product Edit Completely",
    data: editedProduct,
  });
};

// << =========================== deleteProduct ========================= >>
export const deleteProduct = async (req, res) => {
  const { productId } = req.body;

  console.log("delete product id "+productId)

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  const deleteProduct = await productsModel.findByIdAndDelete(productId);

  if (!deleteProduct) {
    return res
      .status(401)
      .json({ success: false, message: "Product Not Found" });
  }

  res.status(201).json({
    success: true,
    message: "Product Deleted Successfully",
    data: productId,
  });
};

export const getProducts = async (req, res) => {
  const products = await productsModel.find();

  if (!products) {
    return res
      .status(401)
      .json({ success: false, message: "products not found" });
  }

  return res
    .status(201)
    .json({ success: true, message: "all product fetched", data: products });
};

// << ===========================  inStock & outOfStock ========================= >>
export const inStockAndOutOfStock = async (req, res) => {
  // const { productId, action } = req.body;

  // if (!mongoose.Types.ObjectId.isValid(productId)) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Invalid Product ID" });
  // }

  // if (action === "inStock") {
  //   const product = await productsModel.findById(productId);
  //   const newProduct = product.stock == true;
  //   await newProduct.save()

  //   res.status(201).json({ success: true, message: "inStock", data: product });
  // } else if (action === "outStock") {
  //   const product = await productsModel.findById(productId);
  //   const newProduct = product.stock == false;
  //   await newProduct.save()

  //   res.status(201).json({ success: true, message: "out of stock" });
  // }

  const { productId, action } = req.body;

  // Validate productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  
    // Find product by ID
    const product = await productsModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update stock based on action
    if (action === "inStock") {
      product.stock = true; // ✅ Change stock to true
    } else if (action === "outStock") {
      product.stock = false; // ✅ Change stock to false
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    // Save updated product
    await product.save();

    return res.status(200).json({
      success: true,
      message: action === "inStock" ? "Product is now in stock" : "Product is now out of stock",
      data: product,
    });
  
};
