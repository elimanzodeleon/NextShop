import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
}

export interface IUserFrontEnd {
  _id: string;
  email: string;
  role: string;
}
