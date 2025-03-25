import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
    required: true,
  },
  products: [
    {
      
      productsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        // required: true,
      },
      productName:{
        type :String,
        // required : true
      },
      quantity: {
        type: Number,
        // required: true,
        default: 1,
      },
      price :{
        type :Number,
        // required :true
      },
      image :{
        type :String,
        // required :true
      }
      
    },
  ],
  payment_status: {
    type: String,
    status: ["pending", "fullfilled", "error"],
  },
  paymentMethod: {
    type: String,
    default: "Google pay",
  },
  Total_Amount: {
    type: Number,
    // required: true,
  },
  Customer_Name: {
    type: String,
    // required: true,
  },
  Address: {
    type: String,
    // required:true
  },
  State: {
    type: String,
  },
  Pincode: {
    type: Number,
  },
  Contact: {
    type: Number,
  },
  orderDate :{
    type : Number,
  }
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
