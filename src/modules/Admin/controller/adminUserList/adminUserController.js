import mongoose from "mongoose";
import userModel from "../../../Users/models/userSchema/userSchema.js";
import cartModel from "../../../Users/models/cartsSchema/cartSchema.js";

// << ================== Get all users ============= >>
export const getAllUsers = async (req, res) => {
  const users = await userModel.find();

  if (!users) {
    return res
      .status(401)
      .json({ success: false, message: "Users Fetching Failed" });
  }

  res
    .status(201)
    .json({ success: true, message: "Users Fetched COmpleted", data: users });
};

// << ==================== getUserById =========================== >>
export const UserById = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const currentUser = await userModel.findById(userId);

  if (!currentUser) {
    return res.status(201).json({ success: false, message: "User Not Found" });
  }
  res
    .status(201)
    .json({ success: true, message: "User By Id Done", data: currentUser });
};

// << ======================== Remove User =================== >>
export const removeUser = async (req, res) => {
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const deleteUser = await userModel.findByIdAndDelete(userId);

  if (!deleteUser) {
    return res
      .status(201)
      .json({ success: false, message: "User Can't Found" });
  }

  res.status(201).json({
    success: true,
    message: "User removed Successfully",
    data: userId,
  });
};

// << ===================== userBlock & Unblock ====================== >>
export const blockAndUnblock = async (req, res) => {
  const { userId } = req.params;

  const currentUser = await userModel.findById(userId);

  // toggle the boolean value
  currentUser.isBlocked = !currentUser.isBlocked;
  currentUser.save();

  // user isBlock edth true ano nokkm , anenkil action blocked save otherwise unBlocked
  const action = currentUser.isBlocked === true ? "Blocked" : "Unblocked";

  res
    .status(201)
    .json({ success: true, message: `user ${action}`, data: currentUser });
};

// << ===================== getUserCart ============================= >>
export const getUserCart = async (req, res) => {
  const { userId } = req.params;

  const userCart = await cartModel.find({ userId });
  if (!userCart) {
    return res
      .status(404)
      .json({ success: false, message: "User Cart Not Found" });
  }

  // user cart empty
  const isCartEmpty = userCart.every((cart) => cart.products.length === 0);
  if (isCartEmpty) {
    return res
      .status(200)
      .json({ success: false, message: "User Cart is Empty", data: userCart });
  }

  res
    .status(200)
    .json({ success: true, message: "User Cart Fetched", data: userCart });
};
