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
  const { page, resultsPerPage } = req.query;
  const pageNum = Number(page);
  const numResultsPerPage = Number(resultsPerPage);
  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / numResultsPerPage);
  let products;
  // if no page in query, user is at page 1/index
  if (pageNum === 1) {
    products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(numResultsPerPage);
  } else {
    // user is on page 2, 3, ...
    const offset = (pageNum - 1) * numResultsPerPage;
    products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(numResultsPerPage)
      .skip(offset);
  }

  res.status(200).json({ data: { products, totalPages } });
};
