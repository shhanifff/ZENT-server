import orderModel from "../../../Users/models/orderSchema/orderSchema.js";
import userModel from "../../../Users/models/userSchema/userSchema.js";

// << =========================== totalOrders ============================== >>
export const totalOrders = async (req, res) => {
  const totalOrders = await orderModel.find();

  if (!totalOrders)
    return res
      .status(400)
      .json({ success: false, message: `orders not found` });

  res
    .status(201)
    .json({ success: true, message: `Total orders`, data: totalOrders });
};

// << ======================== totalPurchased  ====================== >>
export const totalPurchase = async (req, res) => {
  const orders = await orderModel.find();

  const purchasedProduct = orders.map((item) => item.products).flat();
  const totalPurchasedProduct = purchasedProduct.length;

  if (!totalPurchasedProduct) {
    return res
      .status(201)
      .json({ success: false, message: "calculation error" });
  }

  res.status(201).json({
    success: false,
    message: `totalPurchased product is ${totalPurchasedProduct}`,
    data: totalPurchasedProduct,
  });
};

// << ====================== totalUsers =============================== >>
export const totalUsers = async (req, res) => {
  const users = await userModel.find();
  const totalUsers = users.length;

  if (!totalUsers) {
    return res
      .status(401)
      .json({ success: false, message: "Calculation Error" });
  }

  res.status(201).json({
    success: false,
    message: `total users :${totalUsers}`,
    data: users,
  });
};

// << ======================== totalRevenue =========================== >>
export const totalRevenue = async (req, res) => {
  const result = await orderModel.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$Total_Amount" } } },
  ]);

  if (!result) {
    return res
      .status(201)
      .json({ success: false, message: "Calculation Error" });
  }

  res
    .status(201)
    .json({ success: false, message: `Total Revenue ${result}`, data: result });
};

