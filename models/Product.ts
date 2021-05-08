import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { IProduct } from '../interfaces/products';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name for the product'],
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    default: () => nanoid(),
  },
  description: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
});

// if the Product model already exists then we will export it
// else we will export a newly created model
export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema);
