import React from 'react';
import { Item, Label } from 'semantic-ui-react';

import AddProductToCart from './AddProductToCart';

const ProductSummary = ({ _id, name, price, sku, mediaUrl }) => {
  return (
    <>
      <Item.Group>
        <Item style={{ marginTop: '2em' }}>
          <Item.Image src={mediaUrl} size='medium' />
          <Item.Content>
            <Item.Header>{name}</Item.Header>
            <Item.Description>
              <p>${price}</p>
              <Label basic size='tiny'>
                {sku}
              </Label>
            </Item.Description>
            <Item.Extra>
              <AddProductToCart id={_id} />
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
    </>
  );
};

export default ProductSummary;
