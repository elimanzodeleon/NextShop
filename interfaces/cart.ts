import { Document } from 'mongoose';
import { IProduct } from './products';
import { IUser } from './user';

export interface ICart extends Document {
  user: IUser['_id'];
  products: ICartProduct[];
}

export interface ICartProduct {
  quantity: number;
  product: IProduct['_id'];
}
