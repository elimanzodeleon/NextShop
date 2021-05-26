import Router from 'next/router';
import cookie from 'js-cookie';

// fn will handle setting coken with user token upon login/signup
export const handleLogin = (token: string) => {
  // setting cookie with token that expires in 7days
  cookie.set('token', token, { expires: 7 });
};

// fn handles redirecting user to login when accessing protected pages
export const redirectUser = (ctx, location) => {
  if (ctx.res) {
    // server redirect
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    // client redirect
    Router.push(location);
  }
};

export const handleLogout = () => {
  cookie.remove('token');
  Router.push('/');
};
