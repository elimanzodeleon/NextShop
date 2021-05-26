import axios from 'axios';
import React from 'react';
import { GetServerSideProps } from 'next';
import { Header, List } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import { convertPrice } from '../utils/cart';

const result = props => {
  const { products, total } = props.data;
  console.log(products);
  const orderTotal = convertPrice(total);
  return (
    <div style={{ marginTop: '1em' }}>
      <Header as='h1'>Thank you for your order.</Header>
      <p>
        <strong>
          Your order will be shipped within the next 1-3 business days.
        </strong>
      </p>
      <Header as='h4' color='grey'>
        Order summary
      </Header>
      <List divided relaxed>
        {products.map(product => {
          const {
            id,
            description,
            price: { unit_amount },
            quantity,
          } = product;
          return (
            <List.Item key={id}>
              <List.Content>
                <List.Header>{description}</List.Header>
                <List.Description>
                  {quantity} x ${convertPrice(unit_amount)}
                </List.Description>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
      <Header as='h4'>Order total: ${orderTotal}</Header>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { session_id } = ctx.query;
  const { token } = parseCookies(ctx, 'token');
  console.log(token);
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/${session_id}`,
      { headers: { authorization: token } }
    );
    const {
      session: {
        amount_total,
        line_items: { data },
      },
    } = res.data;
    return {
      props: { data: { products: data, total: amount_total } },
    };
  } catch (error) {
    // console.log(error);
    return { props: {} };
  }
};

export default result;
