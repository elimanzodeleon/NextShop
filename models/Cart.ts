import mongoose from 'mongoose';
import { ICart } from '../interfaces/cart';

const { ObjectId } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema<ICart>({
  user: {
    type: ObjectId,
    ref: 'User', // reference to which model ObjectId is referring to
    required: true,
  },
  // products will be a list of objects
  products: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
});

export default mongoose.models.Cart ||
  mongoose.model<ICart>('Cart', CartSchema);
