import { Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  price: number;
  sku: string;
  description: string;
  mediaUrl: string;
}

export interface IError {
  message: string;
}
