import axios from 'axios';
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import connectDB from '../../utils/connectDB';
import ProductModel from '../../models/Product';

import ProductFeatures from '../../components/Product/ProductFeatures';
import ProductSummary from '../../components/Product/ProductSummary';

const Product = ({ product, user }) => {
  return (
    <>
      <ProductSummary {...product} user={user} />
      <ProductFeatures {...product} user={user} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  connectDB();
  const id = ctx.params.id as string;

  try {
    const product = await ProductModel.findById(id);
    const productObj = JSON.parse(JSON.stringify(product));
    return { props: { product: productObj }, revalidate: 1 };
  } catch (error) {
    console.log(error);
    return { props: { product: {} } };
  }
};

// let next js know which dynamic pages to build at build time
export const getStaticPaths: GetStaticPaths = async ctx => {
  connectDB();

  try {
    // limit 24 so that the first 24 products are generated at build time, the rest will be
    // rendered when user visits then page. it will then be available statically to other users
    const products = await ProductModel.find()
      .limit(24)
      .sort({ createdAt: -1 });
    const paths = products.map(product => `/product/${product._id.toString()}`);
    return { paths, fallback: true };
  } catch (error) {
    console.log(error);
    return { paths: [], fallback: false };
  }
};

export default Product;
