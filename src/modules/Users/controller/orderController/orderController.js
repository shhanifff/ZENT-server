import mongoose from "mongoose";
import cartModel from "../../models/cartsSchema/cartSchema.js";
import orderModel from "../../models/orderSchema/orderSchema.js";
import userModel from "../../models/userSchema/userSchema.js";

export const Order = async (req, res) => {
  const { userId } = req.params;
  console.log("user Id :", userId);

  const { Address, mobile, email, fullName } = req.body;
  console.log("Address :", Address);
  console.log("mobile :", mobile);
  console.log("email :", email);
  console.log("fullName :", fullName);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: "Invalid User Id" });
  }

  const userCart = await cartModel
    .findOne({ userId })
    .populate("products.productId");
  if (!userCart) {
    return res
      .status(401)
      .json({ success: false, message: "User Cart Not Found " });
  }

  const totalAmount = userCart.products.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);

  console.log("Total amount :", totalAmount);

  console.log()

  const newOrder = new orderModel({
    userId: userId,
    products: userCart.products.map((item) => ({
      productsId: item.productId._id,
      productName: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
      image: item.productId.images[0],
    })),
    payment_status: "pending",
    Total_Amount: totalAmount,
    Customer_Name: fullName,
    Address,
    Contact: mobile,
    orderDate: Date.now(),
  });

  console.log(newOrder)

  await newOrder.save();

  userCart.products = [];
  await userCart.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: newOrder,
    // data : userCart
  });
};

// << ============================ getOrder ================================== >>
export const getOrder = async (req, res) => {
  const { userId } = req.params;
  console.log("user id is ", userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: "Invalid User Id" });
  }

  const currentUser = await userModel.findById(userId);
  if (!currentUser) {
    return res.status(401).json({ success: true, message: "User Not Found" });
  }

  const userOrder = await orderModel.find({ userId });

  if (!userOrder) {
    return res.status(401).json({ success: true, message: "Order Not Found" });
  }

  res.status(201).json({ success: true, message: "Done", data: userOrder });
  console.log("Order get")
};
