import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Segment,
  Header,
  Button,
  Accordion,
  Icon,
  Image,
  List,
  Label,
} from 'semantic-ui-react';
import { formatDate } from '../../utils/formatDate';

const AccountOrders = ({ orders }) => {
  const router = useRouter();
  return (
    <div style={{ marginTop: '1em' }}>
      <Header>Order history</Header>
      {orders.length === 0 ? (
        <NoOrders router={router} />
      ) : (
        <OrdersList orders={orders} router={router} />
      )}
    </div>
  );
};

const NoOrders = ({ router }) => {
  return (
    <Segment color='grey' textAlign='center'>
      <Header as='h2' color='grey'>
        No past orders.
      </Header>
      <Button color='twitter' onClick={() => router.push('/')}>
        View products
      </Button>
    </Segment>
  );
};

const OrdersList = ({ orders, router }) => {
  return (
    <>
      <Accordion styled fluid>
        {orders.map(order => {
          return <Order key={order._id} {...order} router={router} />;
        })}
      </Accordion>
    </>
  );
};

const Order = ({ _id, createdAt, products, total, router }) => {
  const [active, setActive] = useState(false);
  return (
    <div key={_id}>
      <Accordion.Title
        active={active}
        index={0}
        onClick={() => setActive(prevState => !prevState)}
      >
        <Icon name='dropdown' />
        Order {_id} <Label>{formatDate(createdAt)}</Label>
      </Accordion.Title>
      {active && (
        <Accordion.Content active={0 === 0}>
          <List.Header>Order total: ${total}</List.Header>
          <List divided relaxed>
            {products.map(p => {
              return (
                <List.Item key={p.product._id}>
                  <Image size='mini' src={p.product.mediaUrl} />
                  <List.Content>
                    <List.Description
                      as='a'
                      onClick={() => router.push(`/product/${p.product._id}`)}
                    >
                      {p.product.name}
                    </List.Description>

                    <List.Description>${p.product.price}</List.Description>
                  </List.Content>
                </List.Item>
              );
            })}
          </List>
        </Accordion.Content>
      )}
    </div>
  );
};

export default AccountOrders;
