import { tryCatch } from "../../../../../utils/trycatch.js";
import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProducts,
  inStockAndOutOfStock,
} from "../../controller/productController/productController.js";
import {
  blockAndUnblock,
  getAllUsers,
  getUserCart,
  removeUser,
  UserById,
} from "../../controller/adminUserList/adminUserController.js";
import {
  totalOrders,
  totalPurchase,
  totalRevenue,
  totalUsers,
} from "../../controller/adminDashboard/adminDashboard.js";
export const adminRouter = express.Router();

// addProduct , getProducts ,editProduct & deleteProduct
adminRouter.post("/addproduct", tryCatch(addProduct));
adminRouter.patch("/editproduct/:productId", tryCatch(editProduct));
adminRouter.post("/deleteProduct", tryCatch(deleteProduct));
adminRouter.get("/allproducts", tryCatch(getProducts));

// allUSers ,getUserById ,removeUser ,getUserCart & blockAndUnblock
adminRouter.get("/allUsers", tryCatch(getAllUsers));
adminRouter.get("/UserById/:userId", tryCatch(UserById));
adminRouter.post("/removeUser", tryCatch(removeUser));
adminRouter.get("/userCart/:userId", tryCatch(getUserCart));
adminRouter.patch("/blockAndUnblock/:userId", tryCatch(blockAndUnblock));

//totalOrders ,totalPurchased ,totalUsers , totalRevenue , inStock&outOfStock
adminRouter.get("/totalOrders", tryCatch(totalOrders));
adminRouter.get("/totalPurchase", tryCatch(totalPurchase));
adminRouter.get("/totalUsers", tryCatch(totalUsers));
adminRouter.get("/totalRevenue", tryCatch(totalRevenue));
adminRouter.patch('/handleStock',tryCatch(inStockAndOutOfStock))
