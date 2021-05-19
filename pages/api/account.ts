import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/User';
import connectDB from '../../utils/connectDB';

connectDB();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res);
      break;
    default:
      res.status(405).json({ message: 'method not allowed' });
  }
};

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;

  // if there is no token, user is unauthorized
  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    // verify the token
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    // find user with id from jwt
    const user = await User.findById(id);

    // if the user exists return it in response
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
