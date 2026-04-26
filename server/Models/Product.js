import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    CarType: { type: String, required: true },
    images: [{ url: { type: String, required: true },}],
    showOnProductsPage: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);