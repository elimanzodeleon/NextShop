import mongoose from 'mongoose';
import { IUser } from '../interfaces/user';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin', 'root'],
    },
  },
  { timestamps: true }
);
// mongoose.models = {};

// console.log(mongoose.models);
// export default mongoose.models.User ||
//   mongoose.model<IUser>('User', UserSchema);

let User;
try {
  User = mongoose.model('User');
} catch (e) {
  User = mongoose.model<IUser>('User', UserSchema);
}
export default User;
