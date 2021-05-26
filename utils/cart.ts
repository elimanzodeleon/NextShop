// cart helpr fn that calculates total of cart
export const calculateTotal = (
  products: any
): { cartTotal: string; stripeTotal: number } => {
  if (!products) {
    return { cartTotal: '0', stripeTotal: 0 };
  }
  const total = products.reduce((accumulator, item) => {
    return accumulator + item.product.price * item.quantity;
  }, 0);

  // total used to display - prevent rounding errors
  const cartTotal = ((total * 100) / 100).toFixed(2);

  // total used for stripe (needed in cents)
  const stripeTotal = Number((total * 100).toFixed(2));

  return { cartTotal, stripeTotal };
};

export const formatAmountForStripe = (price, quantity) => {
  const total = price * quantity;
  const stripeTotal = Number((total * 100).toFixed(2));
  return stripeTotal;
};

// convert price from cents to dollars
export const convertPrice = price => (price / 100.0).toFixed(2);
