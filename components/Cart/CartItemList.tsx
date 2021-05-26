import React from 'react';
import Link from 'next/link';
import { Header, Segment, Button, Item, Divider } from 'semantic-ui-react';
import { useRouter } from 'next/router';

const CartItemList = ({ products, removeProduct }) => {
  return (
    <Segment secondary placeholder>
      {products.length === 0 ? (
        <EmptyCart />
      ) : (
        <CartList products={products} removeProduct={removeProduct} />
      )}
    </Segment>
  );
};

const CartList = ({ products, removeProduct }) => {
  const router = useRouter();

  return (
    <Item.Group divided>
      {products.map(product => {
        const { _id, sku, name, mediaUrl, price } = product.product;
        const { quantity } = product;
        return (
          <Item key={sku}>
            <Item.Image size='tiny' src={mediaUrl} />

            <Item.Content>
              <Item.Header
                as='a'
                onClick={() => router.push(`/product/${_id}`)}
              >
                {name}
              </Item.Header>
              <Item.Meta>
                <span>
                  {quantity} x ${price}
                </span>
              </Item.Meta>
              <Item.Description
                as='a'
                onClick={() => removeProduct(_id)}
                style={{
                  color: 'red',
                }}
              >
                remove
              </Item.Description>
            </Item.Content>
          </Item>
        );
      })}
      <Divider />
      <Link href='/'>
        <Button>Continue shopping</Button>
      </Link>
    </Item.Group>
  );
};

const EmptyCart = () => {
  return (
    <>
      <Header textAlign='center'>Your cart is empty</Header>
      <Link href='/'>
        <Button color='twitter'>View products</Button>
      </Link>
    </>
  );
};

export default CartItemList;
