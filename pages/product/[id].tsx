import axios from 'axios';
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

import ProductFeatures from '../../components/Product/ProductFeatures';
import ProductSummary from '../../components/Product/ProductSummary';

const Product = ({ product, user }) => {
  const { _id, name, price, description, mediaUrl } = product;
  const router = useRouter();

  return (
    <>
      <ProductSummary {...product} user={user} />
      <ProductFeatures {...product} user={user} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  const id = ctx.params.id as string;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product`,
    {
      params: { id },
    }
  );
  return { props: { product: res.data.data }, revalidate: 1 };
};

// let next js know which dynamic pages to build at build time
export const getStaticPaths: GetStaticPaths = async ctx => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`
  );
  const paths = res.data.data.map(
    product => `/product/${product._id.toString()}`
  );
  return { paths, fallback: false };
};

export default Product;
