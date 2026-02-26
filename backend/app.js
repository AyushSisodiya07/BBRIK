import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoute from "./routes/adminRoute.js";
import { mongoDbConnect } from "./connection.js";
import customerRoute from "./routes/customerRoute.js";
import authRoutes from "./routes/authRoute.js";
import sellerRoute from "./routes/sellerRoute.js";



dotenv.config();

const app = express();

mongoDbConnect("mongodb://localhost:27017/brikDB")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);
  const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoute);
app.use("/api/customer", customerRoute);
app.use("/api/seller", sellerRoute);


app.listen(5000, "0.0.0.0", () => {
  console.log("Server running");
});
