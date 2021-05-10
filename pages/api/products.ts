import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../utils/connectDB';
import Product from '../../models/Product';

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
  // sort the products by newest first
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json({ data: products });
};
