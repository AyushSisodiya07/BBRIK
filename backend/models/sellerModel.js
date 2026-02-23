import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true }, // Shop/Organization name
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "Seller" }, // automatically set role
  loginId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;