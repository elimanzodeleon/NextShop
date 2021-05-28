import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import Cart from '../../models/Cart';
import User from '../../models/User';
import connectDB from '../../utils/connectDB';
import { formatAmountForStripe } from '../../utils/cart';

connectDB();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

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
  // 1 - verify and get user id from token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'no authorization provided' });
  }
  try {
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    console.log(id);
    // 2 - find cart based on user id, populate the products
    const userCart = await Cart.findOne({ user: id }).populate({
      path: 'products.product',
    });

    // 3 - grab quantity, name, price from each product and create a new list to set to line_items for stripe
    const cartItems = userCart.products.map(product => {
      // need sku, name, price, quantity
      const {
        quantity,
        product: { name, price, mediaUrl },
      } = product;
      // return object formatted for stripe line_items
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name,
            images: [mediaUrl],
          },
          unit_amount: formatAmountForStripe(price, 1),
        },
        quantity,
      };
    });
    // 4 - grab user email from Users collection using id
    const user = await User.findById(id);

    // 5 - grab user stripe info if they already exist within stripe
    const prevCustomer = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let stripeCustomerId: string;
    // if customer does not exist yet, create one
    if (prevCustomer.data.length === 0) {
      const newCustomer = await stripe.customers.create({ email: user.email });
      stripeCustomerId = newCustomer.id;
    } else {
      stripeCustomerId = prevCustomer.data[0].id;
    }

    // 6 - create charge using cartItems, send receipt to email
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
      {
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: cartItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
      }
    );

    // 10 - send res 200 with id to redirect user to checkout-> success
    return res.status(200).json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
