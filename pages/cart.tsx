import axios from 'axios';
import React, { useState } from 'react';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import { Segment, Label } from 'semantic-ui-react';
import cookie from 'js-cookie';
import CartModel from '../models/Cart';
import connectDB from '../utils/connectDB';
import getStripe from '../utils/stripe';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';

const Cart = ({ products }) => {
  const [cartProducts, setCartProducts] = useState(products);
  const [loading, setLoading] = useState(false);

  const handleRemoveProduct = async (id: string) => {
    // send delete request to cart endpoint
    try {
      const token: string = cookie.get('token');
      const res = await axios.delete('/api/cart', {
        headers: {
          authorization: token,
        },
        data: {
          productId: id,
        },
      });
      setCartProducts(res.data.updatedCartProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const token = cookie.get('token');
      const {
        data: { sessionId },
      } = await axios.post(
        '/api/checkout',
        {},
        { headers: { authorization: token } }
      );

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Segment loading={loading} style={{ marginTop: '1em' }}>
      <CartItemList
        products={cartProducts}
        removeProduct={handleRemoveProduct}
      />
      <CartSummary products={cartProducts} handleCheckout={handleCheckout} />
      <Label color='red' size='large'>
        For testing purposes use card information [4242 4242 4242 4242, 04/24,
        424]
      </Label>
    </Segment>
  );
};

export const getServerSideProps = async ctx => {
  connectDB();
  const { token } = parseCookies(ctx, 'token');
  let authToken;
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
    authToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  const { id } = authToken;

  // grab current users cart from db
  try {
    const cart = await CartModel.findOne({ user: id }).populate({
      path: 'products.product',
    });
    const products = JSON.parse(JSON.stringify(cart.products));
    return { props: { products } };
  } catch (error) {
    console.log(error.response.data.error);
    return { props: {} };
  }
};

export default Cart;
