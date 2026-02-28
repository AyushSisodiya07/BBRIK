import Product from "../models/productModel.js";

/* =====================================
   ➜ Add Product (Seller Only)
===================================== */
export const addProduct = async (req, res) => {
 
  try {
    const {
      name,
      description,
      category,
      price,
      stock,
      unit,
      isAvailable,
    } = req.body;

    // 🔥 Get Cloudinary URLs from uploaded files
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.create({
      seller: req.user.id,
      name,
      description,
      category,
      price,
      stock,
      unit,
      isAvailable,
      images: imageUrls, // ✅ Save Cloudinary URLs
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/* =====================================
   ➜ Update Product
===================================== */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      name,
      description,
      category,
      price,
      stock,
      unit,
      isAvailable,
    } = req.body;

    // 🔥 New uploaded images (if any)
    const newImages = req.files ? req.files.map(file => file.path) : null;

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.stock = stock ?? product.stock;
    product.unit = unit || product.unit;

    // ✅ Only replace images if new uploaded
    if (newImages && newImages.length > 0) {
      product.images = newImages;
    }

    product.isAvailable =
      typeof isAvailable === "boolean"
        ? isAvailable
        : product.isAvailable;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/* =====================================
   ➜ Delete Product
===================================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   ➜ Get All Approved Products (Public)
===================================== */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isApproved: true,
      isAvailable: true,
    }).populate("seller", "name organization phone");

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   ➜ Get Single Product
===================================== */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name organization phone");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   ➜ Get Logged-in Seller Products
===================================== */
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.id,
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};