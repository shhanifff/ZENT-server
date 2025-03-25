import mongoose from "mongoose";

const wishlishSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
});
const whislistModel = mongoose.model("wishlist", wishlishSchema);
export default whislistModel
