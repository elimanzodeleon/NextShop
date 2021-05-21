import { Document } from 'mongoose';
import { IUser } from './user';
import { ICartProduct } from './cart';

export interface IOrder extends Document {
  user: IUser['_id'];
  products: ICartProduct[];
}
