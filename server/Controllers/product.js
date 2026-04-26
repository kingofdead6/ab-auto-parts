import asyncHandler from 'express-async-handler';
import Product from '../Models/Product.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Get all products (optional CarType filter)
export const getProducts = asyncHandler(async (req, res) => {
  const { CarType } = req.query;
  const query = {};

  if (CarType) query.CarType = CarType;

  const products = await Product.find(query).lean();
  res.json(products);
});

// Get featured products
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { CarType } = req.query;

  const query = { showOnProductsPage: true };
  if (CarType) query.CarType = CarType;

  const products = await Product.find(query).lean();
  res.json(products);
});

// Get single product
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// Create product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, CarType } = req.body;

  if (!name || !CarType) {
    res.status(400);
    throw new Error('Name and CarType are required');
  }

  const images = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      images.push({ url });
    }
  }

  const product = await Product.create({
    name,
    CarType,
    images,
    showOnProductsPage: true,
  });

  res.status(201).json(product);
});

// Update product
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { name, CarType } = req.body;

  if (name) product.name = name;
  if (CarType) product.CarType = CarType;

  // Handle images
  if (req.files && req.files.length > 0) {
    const newImages = [];

    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      newImages.push({ url });
    }

    product.images = [...product.images, ...newImages];
  }

  const updated = await product.save();
  res.json(updated);
});

// Toggle visibility
export const toggleShowOnProductsPage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.showOnProductsPage = !product.showOnProductsPage;
  await product.save();

  res.json(product);
});

// Delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.deleteOne({ _id: req.params.id });

  res.json({ message: 'Product deleted' });
});