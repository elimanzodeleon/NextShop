import axios from 'axios';
import React from 'react';
import { GetServerSideProps, GetStaticPaths } from 'next';
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

export const getServerSideProps: GetServerSideProps = async ctx => {
  connectDB();
  const id = ctx.params.id as string;

  try {
    const product = await ProductModel.findById(id);
    const productObj = JSON.parse(JSON.stringify(product));
    return { props: { product: productObj } };
  } catch (error) {
    console.log(error);
    return { props: { product: {} } };
  }
};

export default Product;
