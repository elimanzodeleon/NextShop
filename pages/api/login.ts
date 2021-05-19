import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import connectDB from '../../utils/connectDB';
import User from '../../models/User';

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
    // 1 - check if email exists in Users collection
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        error: 'The credentials provided did not match our records',
      });
    }

    // 2 - check if hashed password matches provided password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({
        error: 'The credentials provided did not match our records',
      });
    }

    // 3 - if both conditions above passed successfully, res 200 with auth token, else server error
    const token = jwt.sign(
      { id: user._id },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal server error' });
  }
};
