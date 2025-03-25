import mongoose from "mongoose";
import cartModel from "../../models/cartsSchema/cartSchema.js";
import razorpay from "../../../../../ocnfig/razorpay.js";
import crypto from "crypto";
import orderModel from "../../models/orderSchema/orderSchema.js";

export const createOrder = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: "User Id Invalid" });
  }

  //   console.log("user id in createOrder :", userId);

  const { currency } = req.body;
  //   console.log(`addres :${address}`);
  //   console.log(`pincode :${pincode}`);
  //   console.log(`phone :${phone}`);
  //   console.log(`name :${name}`);

  const userCart = await cartModel
    .findOne({ userId })
    .populate("products.productId");

  const Total_Amount = userCart.products.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  const options = {
    amount: Total_Amount * 100,
    currency,
  };

  //   console.log()
  console.log("options in creatOrder :" + options);

  try {
    const order = await razorpay.orders.create(options);
    console.log("options in creatOrder :" + order);

    res.status(201).json({
      success: true,
      message: "payment order created successfully",
      data: order,
    });
  } catch (error) {
    console.log(error);
  }

  //   console.log("totalAmount :" + Total_Amount);
  // res.status(201).json({ success: true, message: "Done", data: order });
};

// << =================================== paymentVerification =================================>>
// export const paymentVerification = async (req, res) => {
//   const { userId } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(401).json({ success: false, message: "User Id Invalid" });
//   }

//   const cart = await cartModel
//     .findOne({ userId })
//     .populate("products.productId");

//   console.log("req.body", req.body);

//   const {
//     address,
//     pincode,
//     phone,
//     name,
//     razorpay_payment_id,
//     razorpay_order_id,
//     razorpay_signature,
//   } = req.body;

//   console.log(req.body);

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.KEY_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   //   console.log(`addres :${address}`);
//   //   console.log(`pincode :${pincode}`);
//   //   console.log(`phone :${phone}`);
//   //   console.log(`name :${name}`);

//   //   console.log("user id", userId);

//   const totalAmount = cart.products.reduce(
//     (total, item) => total + item.productId.price * item.quantity,
//     0
//   );

//   if (isAuthentic) {
//     var order = new orderModel({
//       userId,
//       products: cart.products.map((item) => ({
//         productsId: item.productId._id,
//         quantity: item.quantity,
//         image: item.productId.images[0],
//       })),
//       Total_Amount: totalAmount,
//       Customer_name: name,
//       phone_number: phone,
//       Address: address,
//       pincode: pincode,
//       orderDate: new Date(Date.now()),
//     });
//   }

//   await order.save();

//   await cartModel.deleteOne({ userId });
//   res.status(200).json({
//     success: true,
//     message: `payment done successfully`,
//   });

//   res
//     .status(201)
//     .json({ success: true, message: "Its Working", data: req.body });
// };


export const paymentVerification = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: "User Id Invalid" });
  }

  const cart = await cartModel.findOne({ userId }).populate("products.productId");

  const { address, pincode, phone, name, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  const totalAmount = cart.products.reduce((total, item) => total + item.productId.price * item.quantity, 0);

  if (!isAuthentic) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }

  const order = new orderModel({
    userId,
    products: cart.products.map((item) => ({
      productsId: item.productId._id,
      quantity: item.quantity,
      image: item.productId.images[0],
    })),
    Total_Amount: totalAmount,
    Customer_name: name,
    phone_number: phone,
    Address: address,
    pincode: pincode,
    orderDate: new Date(Date.now()),
  });

  await order.save();
  await cartModel.deleteOne({ userId });

  return res.status(200).json({
    success: true,
    message: `Payment done successfully`,
  });
};
