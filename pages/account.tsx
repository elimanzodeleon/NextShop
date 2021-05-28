import React from 'react';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import Order from '../models/Order';
import connectDB from '../utils/connectDB';

import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';

const Account = ({ orders, user }) => {
  return (
    <>
      <AccountHeader user={user} />
      <AccountOrders orders={orders} />
    </>
  );
};

export const getServerSideProps = async ctx => {
  connectDB();
  const { token } = parseCookies(ctx, 'token');
  try {
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    const orders = await Order.find({ user: id })
      .populate({ path: 'products.product' })
      .sort({ createdAt: -1 });

    const ordersObj = JSON.parse(JSON.stringify(orders));
    return { props: { orders: ordersObj } };
  } catch (error) {
    console.log(error);
    return { props: { orders: [] } };
  }
};

export default Account;
