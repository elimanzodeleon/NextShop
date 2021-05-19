import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../utils/connectDB';
import Product from '../../models/Product';
import { IError } from '../../interfaces/products';

connectDB();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res);
      break;
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

// method that handles get req sent to /api/product (client must send {params: {<id-or-whatever>}} in req)
const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;
  try {
    const product = await Product.findById(id);
    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

// method that handles post req sent to /api/product
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    name,
    price,
    image,
    description,
  }: {
    name: string;
    price: string;
    image: string;
    description: string;
  } = req.body;

  try {
    // NOTE, sku will be added by default (defined in models/Product.ts)
    const product = await Product.create({
      name,
      price,
      description,
      mediaUrl: image,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    let message = 'Internal Server Error: Unable to add product';
    if (error.name === 'ValidationError') {
      const err = Object.values(error.errors)[0] as IError;
      message = err['message'];
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: message });
  }
};

// method that handles delete req sent to /api/product
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
