import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import { Input, Button, Label } from 'semantic-ui-react';

const AddProductToCart = ({ id, user }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [label, setLabel] = useState('');

  // useeffect to prevent warning trying to change state of unmounted component
  // occurs if user attempts to change page before setTimout completes
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (success) {
      timeout = setTimeout(() => {
        setLabel('');
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  const handleAddProductToCart = async () => {
    setLoading(true);
    setSuccess(false);
    const token = cookie.get('token');
    try {
      // send put request to api since adding NOT creating
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
        { productId: id, quantity },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setLabel('Product added');
      setSuccess(true);
    } catch (error) {
      // set label error unable to add product
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user ? (
        <Input
          action={{
            color: 'twitter',
            content: 'Add to Cart',
            disabled: loading,
            loading: loading,
            onClick: handleAddProductToCart,
          }}
          type='number'
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          min={1}
          max={5}
          fluid
        />
      ) : (
        <Link href='/login'>
          <Button color='twitter' fluid>
            Please log in to purchase
          </Button>
        </Link>
      )}
      {label && (
        <Label color='green' size='large' style={{ marginTop: '1em' }}>
          {label}
        </Label>
      )}
    </div>
  );
};

export default AddProductToCart;
