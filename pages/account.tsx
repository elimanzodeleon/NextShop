import axios from 'axios';
import React from 'react';
import { parseCookies } from 'nookies';

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
  const { token } = parseCookies(ctx, 'token');
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`,
      {
        headers: { authorization: token },
      }
    );
    const { orders } = res.data;
    return { props: { orders } };
  } catch (error) {
    console.log(error);
    return { props: { orders: [] } };
  }
};

export default Account;
