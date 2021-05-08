import React from 'react';
import { Input } from 'semantic-ui-react';

const AddProductToCart = ({ id }) => {
  return (
    <div>
      <Input
        action={{ color: 'twitter', content: 'Add to Cart' }}
        type='number'
        value={1}
        min='1'
      />
    </div>
  );
};

export default AddProductToCart;
