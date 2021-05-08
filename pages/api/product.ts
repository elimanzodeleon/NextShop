import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../utils/connectDB';
import Product from '../../models/Product';

connectDB();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      await handlePostRequest(req, res);
      break;
    case 'DELETE':
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).json({ message: 'method not allowed' });
  }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.body.id as string;
  try {
    const product = await Product.findById(id);
    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

const handleDeleteRequest = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id = req.body.id as string;

  try {
    await Product.findByIdAndDelete(id);
    // 204 -> successful req with no response data
    return res.status(204).json({});
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};
