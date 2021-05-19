import axios from 'axios';
import { GetStaticProps } from 'next';
import { Header } from 'semantic-ui-react';
import ProductList from '../components/Index/ProductList';

const Home = ({ products }) => {
  return (
    <div style={{ paddingTop: '1em' }}>
      <Header as='h1' style={{ textAlign: 'center' }}>
        Home
      </Header>
      <ProductList products={products} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`
    );
    const products = res.data.data;
    return {
      props: {
        products,
      },
      revalidate: 1,
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
