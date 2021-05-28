import React from 'react';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { GetServerSideProps } from 'next';
import { Header, List } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import User from '../models/User';
import Cart from '../models/Cart';
import Order from '../models/Order';
import { convertPrice } from '../utils/cart';
import connectDB from '../utils/connectDB';

const result = props => {
  const { products, total } = props.data;
  const orderTotal = convertPrice(total);
  return (
    <div style={{ marginTop: '1em' }}>
      <Header as='h1'>Thank you for your order.</Header>
      <p>
        <strong>
          Your order will be shipped within the next 1-3 business days.
        </strong>
      </p>
      <Header as='h4' color='grey'>
        Order summary
      </Header>
      <List divided relaxed>
        {products.map(product => {
          const {
            id,
            description,
            price: { unit_amount },
            quantity,
          } = product;
          return (
            <List.Item key={id}>
              <List.Content>
                <List.Header>{description}</List.Header>
                <List.Description>
                  {quantity} x ${convertPrice(unit_amount)}
                </List.Description>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
      <Header as='h4'>Order total: ${orderTotal}</Header>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  connectDB();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
  });
  const { session_id } = ctx.query;
  const { token } = parseCookies(ctx, 'token');
  try {
    // 0. verify token and grab id so we could grab current users cart
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    // 1. grab session to list items in result page
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string,
      {
        expand: ['payment_intent', 'line_items'],
      }
    );

    // 2. find curr user and their cart
    const user = await User.findById(id);
    const userCart = await Cart.findOne({ user: id }).populate({
      path: 'products.product',
      ref: 'Product',
    });

    // 3. create a new order in Order collection with users cart
    await Order.create({
      user: user._id,
      products: userCart.products,
      email: user.email,
      total: convertPrice(session.amount_total),
    });

    // 4. delete users cart
    await Cart.findByIdAndUpdate(userCart._id, { $set: { products: [] } });

    const {
      amount_total,
      line_items: { data },
    } = session;

    return {
      props: { data: { products: data, total: amount_total } },
    };
  } catch (error) {
    return { props: { products: [], total: 0 } };
  }
};

export default result;
