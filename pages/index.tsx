import axios from 'axios';
import { GetServerSideProps } from 'next';
import { Header } from 'semantic-ui-react';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';

const Home = ({ products, totalPages, page }) => {
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
  const page = ctx.query.page ? Number(ctx.query.page) : 1;
  const resultsPerPage = 12;
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`;
    const payload = { params: { page, resultsPerPage } };
    const res = await axios.get(url, payload);
    const { products, totalPages } = res.data.data;
    return {
      props: {
        products,
        totalPages,
        page: page ? page : 1,
      },
    };
  } catch (error) {
    return {
      props: {
        products: [],
      },
    };
  }
};

export default Home;
