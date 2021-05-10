import axios from 'axios';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Header,
  Button,
  Form,
  Input,
  TextArea,
  Label,
} from 'semantic-ui-react';

interface IProduct {
  name: string;
  price: string;
  description: string;
  label: string;
  error: boolean;
  loading: boolean;
}

const initState = {
  name: '',
  price: '',
  description: '',
  label: '',
  error: false,
  loading: false,
};

const Add = () => {
  const [product, setProduct] = useState<IProduct>(initState);
  const [imageFile, setImageFile] = useState<File>();
  const router = useRouter();

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProduct(prevState => ({ ...product, loading: true, error: false }));

    try {
      const url: string = await uploadImage();
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product`,
        {
          name: product.name,
          price: product.price,
          image: url,
          description: product.description,
        }
      );

      setProduct(prevState => ({ ...product, label: 'Product added' }));
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error) {
      setProduct(prevState => ({ ...product, error: true }));
      setProduct(prevState => ({ ...product, label: 'unable to add product' }));
      setTimeout(() => {
        setProduct(prevState => ({ ...product, label: '' }));
      }, 2000);
    }
  };

  // fn that will upload user selected image to cloudinary
  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', 'nextshopproduct');

    const res = await axios.post(process.env.NEXT_PUBLIC_CLOUDINARY_URL, data);
    return res.data.secure_url;
  };

  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;

    // if current is image, we need to update product state differently

    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const buttonDisabled =
    product.loading ||
    !product.name ||
    !product.price ||
    !imageFile ||
    !product.description;

  return (
    <>
      <Header as='h2' style={{ marginTop: '2em' }}>
        Add new product
      </Header>
      {product.label && (
        <Label
          color={product.error ? 'red' : 'green'}
          size='large'
          style={{ marginBottom: '1em' }}
        >
          {product.label}
        </Label>
      )}
      <Form onSubmit={addProduct}>
        <Form.Group widths='equal'>
          <Form.Field
            fluid
            name='name'
            control={Input}
            placeholder='Product name'
            value={product.name}
            onChange={handleFormChange}
            required
          />
          <Form.Field
            fluid
            name='price'
            control={Input}
            placeholder='Product Price'
            value={product.price}
            onChange={handleFormChange}
            type='number'
            min='0.00'
            step='1'
            required
          />
          <Form.Field
            fluid
            name='image'
            control={Input}
            type='file'
            accept='image/*'
            content='Select Image'
            onChange={e => setImageFile(e.target.files[0])}
            required
          />
        </Form.Group>
        <Form.Field
          name='description'
          control={TextArea}
          placeholder='Product description'
          value={product.description}
          onChange={handleFormChange}
          rows={4}
          style={{ resize: 'none' }}
          required
        />
        <Button
          type='submit'
          color='twitter'
          disabled={buttonDisabled}
          loading={product.loading}
        >
          Add
        </Button>
      </Form>
    </>
  );
};

export default Add;
