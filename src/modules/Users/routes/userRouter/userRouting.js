import express from "express";
import {
  loginHandle,
  userRegister,
} from "../../controller/userController/userController.js";
import { tryCatch } from "../../../../../utils/trycatch.js";
import {
  addCart,
  decrementQuantity,
  getCart,
  incrementQuantity,
  removeFromCart,
} from "../../controller/cartController/cartController.js";
import {
  addToWhislist,
  getWishlist,
  removeFromWishlist,
} from "../../controller/wishlistController/whislistController.js";
import {
  getOrder,
  Order,
} from "../../controller/orderController/orderController.js";
import {
  createOrder,
  paymentVerification,
} from "../../controller/paymentController/paymentController.js";
export const userRouter = express.Router();

userRouter.post("/register", tryCatch(userRegister));
userRouter.post("/login", tryCatch(loginHandle));

// addCart,getCart & removeFromCart
userRouter.post("/addCart/:userId", tryCatch(addCart));
userRouter.get("/getCart/:userId", tryCatch(getCart));
userRouter.delete("/removeCart/:userId/:productId", tryCatch(removeFromCart));

// inrement & decrement
userRouter.patch("/increment/:userId", tryCatch(incrementQuantity));
userRouter.patch("/decrement/:userId", tryCatch(decrementQuantity));

// addToWishlist , removeFromWishlist & getWhislist
// userRouter.post("/addToWhislist/:userId", tryCatch(addToWhislist));
userRouter.post("/addToWhislist/:userId", tryCatch(addToWhislist));
userRouter.patch("/removeWishlist/:userId", tryCatch(removeFromWishlist));
userRouter.get("/getWishlist/:userId", tryCatch(getWishlist));

// addToOrder & getOrder
userRouter.post("/order/:userId", tryCatch(Order));
userRouter.get("/getOrder/:userId", tryCatch(getOrder));

// payment * paymentVerification
userRouter.post("/payment/:userId", createOrder);
userRouter.post("/paymentVerification/:userId", tryCatch(paymentVerification));
