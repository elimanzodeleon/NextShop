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
import { ISignUpForm } from '../interfaces/auth';
import { handleError } from '../utils/handleError';
import { handleLogin } from '../utils/auth';

const initialState = {
  email: '',
  password: '',
  confirmPassword: '',
};

const errorInitialState = {
  isError: false,
  message: '',
};

const SignUp = () => {
  const [form, setForm] = useState<ISignUpForm>(initialState);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorInitialState);
  const router = useRouter();

  useEffect(() => {
    const isDisabled =
      loading || !form.email || !form.password || !form.confirmPassword;
    isDisabled ? setButtonDisabled(true) : setButtonDisabled(false);
  }, [form, loading]);

  const handleSubmit = async () => {
    setError(errorInitialState);

    if (!validator.isEmail(form.email)) {
      return setError({ isError: true, message: 'Please enter a valid email' });
    }
    if (form.password !== form.confirmPassword) {
      return setError({ isError: true, message: 'Passwords do not match' });
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/signup`,
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
    const { name, value } = e.target;

    setForm(prevState => ({ ...prevState, [name]: value }));
  };
  return (
    <Segment style={{ marginTop: '1em' }}>
      <Header as='h1'>Sign up</Header>
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
        <Form.Field>
          <input
            type='password'
            name='confirmPassword'
            value={form.confirmPassword}
            onChange={handleFormChange}
            placeholder='confirm password'
            required
          />
        </Form.Field>
        <Button
          type='submit'
          color='twitter'
          disabled={buttonDisabled}
          loading={loading}
        >
          Sign up
        </Button>
        <Divider />
        <p>
          Already have an account? <Link href='/login'>Login</Link>
        </p>
      </Form>
    </Segment>
  );
};

export default SignUp;
