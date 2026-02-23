import mongoose from "mongoose";

const builderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true }, // Shop/Organization name
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "Builder" }, // automatically set role
  loginId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Builder = mongoose.model("Builder", builderSchema);

export default Builder;