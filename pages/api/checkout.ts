import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import Cart from '../../models/Cart';
import Order from '../../models/Order';
import connectDB from '../../utils/connectDB';
import { calculateTotal, formatAmountForStripe } from '../../utils/cart';

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
  const { paymentData } = req.body;

  console.log(paymentData);

  // 1 - verify and get user id from token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'no authorization provided' });
  }
  try {
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    // 2 - find cart based on user id, populate it
    const userCart = await Cart.findOne({ user: id }).populate({
      path: 'products.product',
    });

    // 3 - recalculate cart total for extra security (user may have manipulated price on front end)
    const { cartTotal, stripeTotal } = calculateTotal(userCart.products);

    // 3 - BETTER IDEA -> grab quantity, name, price from each product and create a new list to set to line_items
    const cartItems = userCart.products.map(product => {
      // need sku, name, price, quantity
      const {
        quantity,
        product: { name, price, sku, mediaUrl },
      } = product;
      // return object formatted for stripe line_items
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name,
            images: [mediaUrl],
          },
          unit_amount: formatAmountForStripe(price, quantity),
        },
        quantity,
      };
    });

    // 4 - get email from payment data and see if emaiil linked with existing stripe customer
    // const prevCustomer = await stripe.customers.list({
    //   email: paymentData.email,
    //   limit: 1,
    // });

    // 5 - if customer not exist, create one based on email
    // 6 - create charge with total, send receipt to email
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        line_items: cartItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
      }
    );

    // 7 - add order to orders collection
    // 8 - clear product in current users cart once order complete
    // 9 - send res 200 with id to redirect user to checkout-> success
    return res.status(200).json({ sessionId: checkoutSession.id, cartItems });
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({ message: 'req received' });
};
