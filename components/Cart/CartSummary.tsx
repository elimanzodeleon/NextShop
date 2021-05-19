import React, { useState, useEffect } from 'react';
import { Button, Segment, Divider } from 'semantic-ui-react';
import { calculateTotal } from '../../utils/cart';

const CartSummary = ({ products }) => {
  const [cartTotal, setCartTotal] = useState('0');
  const [stripeTotal, setStripeTotal] = useState(0);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  useEffect(() => {
    // check if cart is empty
    setIsCartEmpty(products.length === 0);
    // calculate total
    const { cartTotal, stripeTotal } = calculateTotal(products);
    setCartTotal(cartTotal);
    setStripeTotal(stripeTotal);
  }, [products]);
  return (
    <>
      <Divider />
      <Segment clearing size='large'>
        <strong>Subtotal: </strong> ${cartTotal}
        <Button color='twitter' floated='right' disabled={isCartEmpty}>
          Checkout
        </Button>
      </Segment>
    </>
  );
};

export default CartSummary;
