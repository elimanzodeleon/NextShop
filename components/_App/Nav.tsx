import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter, NextRouter } from 'next/router';
import { Menu, Container, Button, Image } from 'semantic-ui-react';
import { IUserFrontEnd } from '../../interfaces/user';

interface Props {
  user: IUserFrontEnd;
}

const Nav: React.FC<Props> = ({ user }) => {
  const [search, setSearch] = useState(true);
  const router = useRouter();
  return (
    <div>
      <Head>
        <link rel='stylesheet' href='/nprogress.css' />
      </Head>
      <Menu fluid pointing secondary stackable>
        <Container text>
          <Link href='/'>
            <Menu.Item active={router.pathname === '/'}>Next Shop</Menu.Item>
          </Link>
          <Menu.Menu position='right'>
            {user ? <AuthLinks router={router} /> : <Links router={router} />}
          </Menu.Menu>
        </Container>
      </Menu>
    </div>
  );
};

const Links: React.FC<{ router: NextRouter }> = ({ router }) => {
  return (
    <>
      <Link href='/signup'>
        <Menu.Item className='button' active={router.pathname === '/signup'}>
          Sign up
        </Menu.Item>
      </Link>
      <Link href='/login'>
        <Menu.Item active={router.pathname === '/login'}>Login</Menu.Item>
      </Link>
    </>
  );
};

const AuthLinks = ({ router }) => {
  return (
    <>
      <Link href='/account'>
        <Menu.Item className='button' active={router.pathname === '/account'}>
          Account
        </Menu.Item>
      </Link>
      <Link href='/cart'>
        <Menu.Item>
          <Image src='/icons/cart.png' width='18px' height='18px' />
        </Menu.Item>
      </Link>
    </>
  );
};

export default Nav;
