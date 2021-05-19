import React from 'react';
import { Card, Image } from 'semantic-ui-react';

const ProductList = ({ products }) => {
  return (
    <>
      {/* stackable makes card group responsive o diff screen sizes */}
      <Card.Group doubling itemsPerRow={4}>
        {products.map(product => {
          const { _id, name, price, mediaUrl } = product;
          return (
            <Card key={_id} href={`/product/${_id}`}>
              <Image src={mediaUrl} wrapped ui={false} />
              <Card.Content>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>
                  <span className='date'>${price}</span>
                </Card.Meta>
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    </>
  );
};

export default ProductList;
