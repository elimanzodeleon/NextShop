import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Header,
  Button,
  Form,
  Input,
  TextArea,
  Label,
} from 'semantic-ui-react';
import { handleError } from '../utils/handleError';
import { IError } from '../interfaces/products';

interface IProduct {
  name: string;
  price: string;
  image: File;
  description: string;
}

const initialState = {
  name: '',
  price: '',
  image: null,
  description: '',
};

const errorInitialState = {
  isError: false,
  message: '',
};

const Add = () => {
  const [product, setProduct] = useState<IProduct>(initialState);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<IError>(errorInitialState);
  const router = useRouter();

  useEffect(() => {
    const buttonDisabled =
      loading ||
      !product.name ||
      !product.price ||
      !product.image ||
      !product.description;

    buttonDisabled ? setDisabled(true) : setDisabled(false);
  }, [product]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (success) {
      timeout = setTimeout(() => {
        setLabel('');
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [success]);

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(errorInitialState);

    try {
      const url: string = await uploadImage();
      const res = await axios.post('/api/product', {
        name: product.name,
        price: product.price,
        image: url,
        description: product.description,
      });

      setProduct(prevState => ({
        ...product,
        name: '',
        price: '',
        description: '',
      }));
      setLabel('Product added');
      setProduct(initialState);
      setSuccess(true);
    } catch (error) {
      handleError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  // fn that will upload user selected image to cloudinary
  const uploadImage = async () => {
    try {
      const data = new FormData();
      data.append('file', product.image);
      data.append('upload_preset', 'nextshopproduct');

      const res = await axios.post(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL,
        data
      );
      return res.data.secure_url;
    } catch (error) {
      handleError(error, setError);
    }
  };

  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    // need to set image property differently
    if (name === 'image') {
      setProduct(prevState => ({ ...prevState, image: files[0] }));
    } else {
      setProduct(prevState => ({ ...prevState, [name]: value }));
    }
  };

  return (
    <>
      <Form onSubmit={addProduct} loading={loading}>
        <Header as='h2' style={{ marginTop: '1em' }}>
          Add new product
        </Header>
        {label && (
          <Label color='green' size='large' style={{ marginBottom: '1em' }}>
            {label}
          </Label>
        )}
        {error.isError && (
          <Label color='red' size='large' style={{ marginBottom: '1em' }}>
            {error.message}
          </Label>
        )}
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
            onChange={handleFormChange}
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
        <Button type='submit' color='twitter' disabled={disabled}>
          Add
        </Button>
      </Form>
    </>
  );
};

export default Add;
