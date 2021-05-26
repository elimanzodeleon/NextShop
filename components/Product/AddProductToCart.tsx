import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import { Button, Label } from 'semantic-ui-react';

const AddProductToCart = ({ id, user }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [label, setLabel] = useState('');
  const router = useRouter();

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

    if (success) {
      return router.push('/cart');
    }

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
        <>
          <Button
            color={success ? 'grey' : 'twitter'}
            onClick={handleAddProductToCart}
            floated='left'
            loading={loading}
            disabled={loading}
          >
            {success ? 'Checkout' : 'Add to cart'}
          </Button>
          <Button
            basic
            color='grey'
            floated='right'
            onClick={() => router.back()}
          >
            Continue shopping
          </Button>
        </>
      ) : (
        <Link href='/login'>
          <Button color='twitter' fluid>
            Please log in to purchase
          </Button>
        </Link>
      )}

      {label && (
        <Label basic color='green' size='large' style={{ marginTop: '0.5em' }}>
          {label}
        </Label>
      )}
    </div>
  );
};

export default AddProductToCart;
