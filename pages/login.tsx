import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import validator from 'validator';
import {
  Header,
  Form,
  Button,
  Segment,
  Divider,
  Label,
} from 'semantic-ui-react';
import { ILoginForm } from '../interfaces/auth';
import { IError } from '../interfaces/products';
import { handleError } from '../utils/handleError';
import { handleLogin } from '../utils/auth';

const initialState = {
  email: '',
  password: '',
};

const errorInitialState = {
  isError: false,
  message: '',
};

const Login = () => {
  const [form, setForm] = useState<ILoginForm>(initialState);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IError>(errorInitialState);
  const router = useRouter();

  useEffect(() => {
    const isDisabled = loading || !form.email || !form.password;
    isDisabled ? setButtonDisabled(true) : setButtonDisabled(false);
  }, [form, loading]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(errorInitialState);

    if (!validator.isEmail(form.email)) {
      setLoading(false);
      return setError({ isError: true, message: 'Please enter a valid email' });
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
        {
          email: form.email,
          password: form.password,
        }
      );
      handleLogin(res.data.token);
      router.push('/');
    } catch (error) {
      setLoading(false);
      handleError(error, setError);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;

    setForm(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <Segment style={{ marginTop: '1em' }}>
      <Header as='h1'>login</Header>
      {error.isError && (
        <Label color='red' size='large' style={{ marginBottom: '1em' }}>
          {error.message}
        </Label>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <input
            name='email'
            value={form.email}
            onChange={handleFormChange}
            placeholder='email'
            required
          />
        </Form.Field>
        <Form.Field>
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleFormChange}
            placeholder='password'
            required
          />
        </Form.Field>
        <Button
          type='submit'
          color='twitter'
          disabled={buttonDisabled}
          loading={loading}
        >
          Login
        </Button>
        <Divider />
        <p>
          Don't have an account? <Link href='/signup'>Sign up</Link>
        </p>
      </Form>
    </Segment>
  );
};

export default Login;
