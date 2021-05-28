import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import connectDB from '../../utils/connectDB';
import Cart from '../../models/Cart';

connectDB();

const { ObjectId } = mongoose.Types;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res);
      break;
    case 'PUT':
      await handlePutRequest(req, res);
      break;
    case 'DELETE':
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).json({ error: 'method not allowed' });
  }
};

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'no authorization provided' });
  }

  try {
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    const cart = await Cart.findOne({ user: id }).populate({
      path: 'products.product',
    });
    res.status(200).json({ products: cart.products });
  } catch (error) {
    res.status(500).json({ error: 'interval server error ' });
  }
};

const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId, quantity } = req.body;
  const token = req.headers.authorization;
  // check if authorization header included in request
  if (!token) {
    return res.status(401).json({ error: 'no authorization provided' });
  }

  // very auth token sent in header
  try {
    const { id: userId } = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET
    );

    // 1 - get cart based on user id
    const cart = await Cart.findOne({ user: userId });
    // .some looks for one that matches condition
    const productAlreadyInCart = cart.products.some(item => {
      return item.product.equals(ObjectId(productId));
    });
    if (productAlreadyInCart) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, 'products.product': productId },
        { $inc: { 'products.$.quantity': quantity } }
      );
      // return res.status(409).json({ error: 'product already in cart' });
    } else {
      const newProduct = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $addToSet: { products: newProduct } }
      );
    }

    res.status(200).json({ message: 'product added to cart' });
  } catch (error) {
    // invalid token sent to server
    console.log(error);
    return res.status(401).json({ error: 'permission denied: unauthorized.' });
  }
};

const handleDeleteRequest = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'no authorization provided' });
  }

  try {
    const { productId } = req.body;
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    // remove product from products within current cart using given productid
    // 'pulling' (deleting) -> go in products, delete product who's product attr. = productId
    const cart = await Cart.findOneAndUpdate(
      { user: id },
      { $pull: { products: { product: productId } } },
      { new: true } // this returns the updated cart document
    ).populate({
      path: 'products.product',
      ref: 'Product',
    });
    res.status(200).json({ updatedCartProducts: cart.products });
  } catch (error) {
    res.status(500).json({ error: 'interval server error ' });
  }
};
