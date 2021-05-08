import Head from 'next/head';
import Router from 'next/router';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import NProgress from 'nprogress';

import Nav from './Nav';
import HeadContent from './HeadContent';
import React from 'react';

// progress bar will be controlled by the router
Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});
Router.events.on('routeChangeError', () => {
  NProgress.done();
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <HeadContent />
      </Head>
      <Nav />
      <Container text>{children}</Container>
    </>
  );
};

export default Layout;
