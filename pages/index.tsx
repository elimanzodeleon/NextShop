import { GetServerSideProps } from 'next';
import { Header } from 'semantic-ui-react';
import Product from '../models/Product';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';
import connectDB from '../utils/connectDB';
import { IProduct } from '../interfaces/products';

const Home = ({ products, totalPages, page, user }) => {
  return (
    <div style={{ padding: '1em 0 2em 0' }}>
      <Header as='h1' style={{ textAlign: 'center' }}>
        Home
      </Header>
      <ProductList products={products} />
      <ProductPagination page={page} totalPages={totalPages} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  connectDB();
  const page = ctx.query.page ? Number(ctx.query.page) : 1;
  const resultsPerPage = 12;
  try {
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / resultsPerPage);
    let products: IProduct[];
    if (page === 1) {
      products = await Product.find()
        .limit(resultsPerPage)
        .sort({ createdAt: -1 });
    } else {
      const offset = (page - 1) * resultsPerPage;
      products = await Product.find()
        .skip(offset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 });
    }
    const productsObj = JSON.parse(JSON.stringify(products));
    return {
      props: {
        products: productsObj,
        totalPages,
        page: page ? page : 1,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        products: [],
        totalPages: 0,
        page: 1,
        user: {},
      },
    };
  }
};

export default Home;
