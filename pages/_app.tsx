import axios from 'axios';
import React from 'react';
import App, { AppProps, AppContext } from 'next/app';
import { parseCookies, destroyCookie } from 'nookies';
import Layout from '../components/_App/Layout';
import { redirectUser } from '../utils/auth';
import { IUserFrontEnd } from '../interfaces/user';
import '/public/styles.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  // grab the user token from the cookies
  const { token } = parseCookies(appContext.ctx);

  // if no user token, user should not be able to access account or add product page
  if (!token) {
    const isProtectedRoute =
      appContext.ctx.pathname === '/account' ||
      appContext.ctx.pathname === '/add';

    if (isProtectedRoute) {
      redirectUser(appContext.ctx, '/');
    }
  } else {
    try {
      // verify the token
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/account`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // add user to pageProps if it exists in response
      const { user }: { user: IUserFrontEnd } = res.data;

      // if user role is not admin or root they cannot add products (only purchase)
      // so redirect them to home page
      const isRoot = user.role === 'root';
      const isAdmin = user.role === 'admin';
      const notPermitted =
        !(isRoot || isAdmin) && appContext.ctx.pathname === '/add';
      if (notPermitted) {
        redirectUser(appContext.ctx, '/');
      }
      appProps.pageProps.user = user;
    } catch (error) {
      destroyCookie(appContext.ctx, 'token');
      console.log(error.response.data);
    }
  }

  return { ...appProps };
};

export default MyApp;
