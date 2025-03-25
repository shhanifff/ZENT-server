import mongoose from "mongoose";
import productsModel from "../../../Admin/models/productSchema/productSchema.js";
import cartModel from "../../models/cartsSchema/cartSchema.js";
import userModel from "../../models/userSchema/userSchema.js";

//  << ======================= addCart =========================== >>
export const addCart = async (req, res) => {
  const { userId } = req.params;
  console.log("User id :", userId);
  const { productId } = req.body;
  console.log("Product id :", productId);

  // ==================================
  // **Validate userId and productId**
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  // ==================================
  // **Find user and product**
  const currentUser = await userModel.findById(userId);
  const currentProduct = await productsModel.findById(productId);

  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!currentProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // ============================================
  // **Check if user already has a cart**
  let specificCart = await cartModel.findOne({ userId });

  if (!specificCart) {
    // **Create a new cart for the user**
    specificCart = new cartModel({ userId, products: [{ productId }] });
    currentUser.cart = specificCart._id;
  } else {
    // **Check if the product already exists in the cart**
    const existingProduct = specificCart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (existingProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Product already exists in cart",data : existingProduct });
    } else {
      specificCart.products.push({ productId });
    }
  }

  await currentUser.save();
  await specificCart.save();

  res
    .status(201)
    .json({ success: true, message: "Cart added", data: currentProduct });
};

//  << ======================= Fetch Cart =========================== >>
export const getCart = async (req, res) => {
  const { userId } = req.params;
  // Validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  console.log("userId in getCart :" + userId);

  const userCart = await cartModel.findOne({ userId }).populate("products.productId");
  // const productDetails=await userCart.populate('products')

  console.log("all products",userCart)

  if (!userCart) {
    return res
      .status(401)
      .json({ success: false, message: "User cart not found" });
  }

  res
    .status(201)
    .json({ success: true, message: "cart fetched", data: userCart });
};

// << ======================= Remove From Cart =========================== >>
// export const removeFromCart = async (req, res) => {
//   const { userId, productId } = req.params;
//   // const { productId } = req.body;
//   console.log(`user id :${userId} , productId is :${productId}  in remove from cart`);

//   // Validate userId and productId
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ success: false, message: "Invalid User ID" });
//   }
//   if (!mongoose.Types.ObjectId.isValid(productId)) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid Product ID" });
//   }

//   // Check User & Cart
//   const currentUser = await userModel.findById(userId);
//   if (!currentUser) {
//     return res.status(404).json({ success: false, message: "User  not found" });
//   }
//   const currentCart = await cartModel.findOne({ userId });
//   if (!currentCart) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Product not found" });
//   }

//   const productIndex = currentCart.products.find(
//     (item) => item.productId.toString() === productId
//   );


//   if (productIndex === -1) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Product not found in cart" });
//   }

//   currentCart.products.splice(productIndex,1)
//   currentCart.save()

//   res
//     .status(201)
//     .json({ success: true, message: "successfuly removed", data: currentCart });
// };

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log(`User ID: ${userId}, Product ID: ${productId} in removeFromCart`);

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID or Product ID" });
    }

    // Find user
    const currentUser = await userModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find Cart
    const currentCart = await cartModel.findOne({ userId });
    if (!currentCart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find product index
    const productIndex = currentCart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    // Remove product
    currentCart.products.splice(productIndex, 1);
    await currentCart.save(); // ✅ Save properly

    return res.status(200).json({ success: true, message: "Successfully removed", data: currentCart });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// << ======================= Increment Quantity =========================== >>
export const incrementQuantity = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  console.log("Increment product ID:", productId, "User ID:", userId);

  // Validate userId and productId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  // check user and userCart
  const currentUser = await userModel.findById(userId);
  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const userCart = await cartModel.findOne({ userId });
  if (!userCart) {
    return res
      .status(404)
      .json({ success: false, message: "User cart not found" });
  }

  //  currentCart yl ninn product inte object find chyan
  const currentProduct = userCart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (!currentProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in cart" });
  } else {
    currentProduct.quantity += 1;
  }

  await userCart.save();

  res.status(200).json({
    success: true,
    message: "Quantity incremented successfully",
    data: userCart,
  });
  console.log("done")
};

// << ======================= Decrement Quantity =========================== >>
export const decrementQuantity = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  console.log("Increment product ID:", productId, "User ID:", userId);

  // Validate userId and productId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  // check user and userCart
  const currentUser = await userModel.findById(userId);
  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const userCart = await cartModel.findOne({ userId });
  if (!userCart) {
    return res
      .status(404)
      .json({ success: false, message: "User cart not found" });
  }

  //  currentCart yl ninn product inte object find chyan
  const currentProduct = userCart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (!currentProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in cart" });
  } else if (currentProduct.quantity > 1) {
    currentProduct.quantity -= 1;
  }

  await userCart.save();

  res.status(200).json({
    success: true,
    message: "Quantity incremented successfully",
    data: userCart,
  });
};
