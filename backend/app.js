import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoute from "./routes/adminRoute.js";
import { mongoDbConnect } from "./connection.js";
import customerRoute from "./routes/customerRoute.js";
import authRoutes from "./routes/authRoute.js";
import sellerRoute from "./routes/sellerRoute.js";
<<<<<<< HEAD
import productRoute from "./routes/productRoute.js";
=======

>>>>>>> 19f2665baf5fab9d8b4e828cfecdbd600e266626



const app = express();

mongoDbConnect("mongodb://localhost:27017/brikDB")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);
  const PORT = process.env.PORT || 5000;

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoute);
app.use("/api/customer", customerRoute);
app.use("/api/seller", sellerRoute);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.log("UPLOAD ERROR:", err);
  res.status(500).json({ error: err.message });
});

<<<<<<< HEAD
app.use("/api/seller", sellerRoute);


app.use("/api/product", productRoute);


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
=======
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running");
>>>>>>> 19f2665baf5fab9d8b4e828cfecdbd600e266626
});
