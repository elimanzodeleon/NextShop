import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../utils/connectDB';
import Product from '../../models/Product';

connectDB();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'method not allowed' });
  }

  const products = await Product.find();

  res.status(200).json({ data: products });
};
