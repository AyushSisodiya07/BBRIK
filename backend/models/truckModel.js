import mongoose from "mongoose";

const truckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true }, // Truck company or owner name
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "Truck" }, // automatically set role
  loginId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Truck = mongoose.model("Truck", truckSchema);

export default Truck;