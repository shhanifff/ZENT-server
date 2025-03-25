import mongoose from "mongoose";
import userModel from "../../models/userSchema/userSchema.js";
import productsModel from "../../../Admin/models/productSchema/productSchema.js";
import whislistModel from "../../models/whislistSchema/whislistSchema.js";

// << ======================= addToWishlist =================== >>
export const addToWhislist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  console.log("product id " + productId);

  // Validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: "Invalid userId" });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid productId" });
  }

  console.log("userId" + userId, "productId" + productId);

  // Checking the product & user
  const currentUser = await userModel.findById(userId);
  console.log("current user", currentUser);
  if (!currentUser) {
    return res.status(401).json({ success: false, message: "User Not Found" });
  }
  const currentProduct = await productsModel.findById(productId);
  if (!currentProduct) {
    return res
      .status(401)
      .json({ success: false, message: "Product Not Found" });
  }

  //  user already wishlist undo
  let userWishlist = await whislistModel.findOne({ userId });

  if (!userWishlist) {
    // If no wishlist, create a new one
    userWishlist = new whislistModel({
      userId,
      products: [{ productId }],
    });
  } else {
    // product already undo checking
    const existproduct = userWishlist.products.find(
      (item) => item.productId.toString() === productId
    );

    if (existproduct) {
      return res
        .status(401)
        .json({ success: false, message: "Product already exists" });
    }

    userWishlist.products.push({ productId });
  }

  await userWishlist.save();

  res.status(201).json({
    success: true,
    message: "Wishlist added successfully",
    data: userWishlist,
  });
};

// << ======================= removeFromWishlist =================== >>
export const removeFromWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  console.log("user id :" + userId);
  console.log("product id :" + productId);

  // Validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: "Invalid userId" });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid productId" });
  }

  // Check if user & product exist
  const currentUser = await userModel.findById(userId);
  if (!currentUser) {
    return res.status(401).json({ success: false, message: "User Not Found" });
  }

  const currentProduct = await productsModel.findById(productId);
  if (!currentProduct) {
    return res
      .status(401)
      .json({ success: false, message: "Product Not Found" });
  }

  // Find user's wishlist
  const userWishlist = await whislistModel.findOne({ userId });
  if (!userWishlist) {
    return res
      .status(401)
      .json({ success: false, message: "Wishlist not found" });
  }

  // Find index of product in wishlist
  const indexOfProduct = userWishlist.products.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (indexOfProduct !== -1) {
    userWishlist.products.splice(indexOfProduct, 1);
    await userWishlist.save();
    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: userWishlist,
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Product not found in wishlist" });
  }
};

// << ========================= getWishlist ===================== >>
export const getWishlist = async (req, res) => {
  const { userId } = req.params;

  // validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: "Invalid userId" });
  }

  // exist user & userWishlist
  const currentUser = await userModel.findById(userId);
  if (!currentUser) {
    res.status(401).json({ success: false, message: "user Not Found" });
  }

  const userWishlist = await whislistModel
    .findOne({ userId })
    .populate("products.productId");
  if (!userWishlist) {
    res
      .status(401)
      .json({ success: false, message: "User Not Found in Wishlist" });
  }

  res.status(201).json({ success: true, message: "Done", data: userWishlist });
};
