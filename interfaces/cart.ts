import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';
import { Document, Model } from 'mongoose';
import { IProduct } from './products';
import { IUser } from './user';

export interface ICart extends Document {
  user: IUser['_id'];
  products: ICartProduct[];
}

export interface ICartModel extends Model<ICart> {
  findOneAndUpdate;
  findByIdAndUpdate;
}

export interface ICartProduct {
  quantity: number;
  product: IProduct['_id'];
}
