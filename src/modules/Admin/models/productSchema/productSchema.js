import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  stock :{
    type : Boolean,
    default : true
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const productsModel = mongoose.model("Product", productSchema);
export default productsModel;
