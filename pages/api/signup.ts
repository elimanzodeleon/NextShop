import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import connectDB from '../../utils/connectDB';
import User from '../../models/User';
import Cart from '../../models/Cart';

connectDB();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      await handlePostRequest(req, res);
      break;
    default:
      res.status(405).json({ error: 'method not allowed' });
  }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  try {
    // 0 - validate email (isEmail) and password (isLength)
    if (!validator.isEmail(email)) {
      return res.status(422).json({ error: 'Please enter a valid email' });
    }
    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(422)
        .json({ error: 'Password must be at least 8 characters long' });
    }

    // 1 - check if email is already in use
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ error: 'This email is already in use' });
    }

    // 2 - hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3 - create user with given info
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    // 4 - create a cart for the new user
    const userCart = await Cart.create({
      user: newUser._id,
    });

    // 5 - create jwt for new user
    const token = jwt.sign(
      { id: newUser._id },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    // 5 - send token of new user in response
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Unable to sign up user' });
  }
};
