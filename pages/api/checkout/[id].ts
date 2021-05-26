import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import User from '../../../models/User';
import Cart from '../../../models/Cart';
import Order from '../../../models/Order';
import { convertPrice } from '../../../utils/cart';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res);
      break;
    default:
      res.status(405).json({ error: 'method not allowed' });
  }
};

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: 'no authorization provided' });
  }

  try {
    // 0. add authorization header so we could grab current users cart
    const token = jwt.verify(authToken, process.env.NEXT_PUBLIC_JWT_SECRET);
    const userId = token.id;

    // 1. grab session to list items in result page
    const session = await stripe.checkout.sessions.retrieve(id as string, {
      expand: ['payment_intent', 'line_items'],
    });

    // 2. find curr user and their cart
    const user = await User.findById(userId);
    const userCart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product',
    });

    // 3. create a new order in Order collection with users cart
    const newOrder = await Order.create({
      user: user._id,
      products: userCart.products,
      email: user.email,
      total: convertPrice(session.amount_total),
    });

    // 4. delete users cart
    await Cart.findOneAndUpdate(
      { _id: userCart._id },
      { $set: { products: [] } }
    );

    // 201 since new order was created
    res.status(201).json({ session });
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
};
