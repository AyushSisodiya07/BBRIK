import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",   // connects product to Seller model
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    unit: {
      type: String,   // kg, ton, bag, piece, etc.
      required: true,
    },

    images: [
      {
        type: String,   // Cloudinary / S3 image URL
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,  // for admin approval system (optional feature)
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;