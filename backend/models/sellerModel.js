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
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const sellerSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     organization: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     address: {
//       type: String,
//       required: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["Seller", "Admin"],
//       default: "Seller",
//     },

//     loginId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//       select: false, // ❗ password will not return in queries
//     },

//     blocked: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );


// // 🔐 Hash password before saving
// sellerSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });


// // 🔑 Compare password method
// sellerSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };


// const Seller = mongoose.model("Seller", sellerSchema);

// export default Seller;