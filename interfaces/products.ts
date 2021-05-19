import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  sku: string;
  description: string;
  mediaUrl: string;
}

export interface IError {
  isError?: boolean;
  message: string;
}
