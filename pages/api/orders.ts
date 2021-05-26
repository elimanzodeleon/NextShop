import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Order from '../../models/Order';
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
  if (!token) {
    return res.status(401).json({ error: 'no authorization provided' });
  }

  try {
    // 1 - verify token and extract user id
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    // 2 - find all orders that belong to the current user
    const userOrders = await Order.find({ user: id })
      .populate({ path: 'products.product' })
      .sort({ createdAt: -1 });

    res.status(200).json({ orders: userOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal server error' });
  }
};
