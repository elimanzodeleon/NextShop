import axios from 'axios';
import React, { useState } from 'react';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { Segment } from 'semantic-ui-react';
import cookie from 'js-cookie';

import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';

const Cart = ({ products }) => {
  const [cartProducts, setCartProducts] = useState(products);

  const handleRemoveProduct = async (id: string) => {
    // send delete request to cart endpoint
    try {
      const token: string = cookie.get('token');
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
        {
          headers: {
            authorization: token,
          },
          data: {
            productId: id,
          },
        }
      );
      setCartProducts(res.data.updatedCartProducts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Segment style={{ marginTop: '1em' }}>
      <CartItemList
        products={cartProducts}
        removeProduct={handleRemoveProduct}
      />
      <CartSummary products={cartProducts} />
    </Segment>
  );
};

export const getServerSideProps = async ctx => {
  const { token } = parseCookies(ctx, 'token');
  // if there is no token redirect user to login + return
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  // if token is invalid, redirect user
  try {
    jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  // grab current users cart from db
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return { props: { products: res.data.products } };
  } catch (error) {
    console.log(error.response.data.error);
    return { props: {} };
  }
};

export default Cart;
