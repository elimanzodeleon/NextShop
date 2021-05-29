# Next Shop

This is a full stack MERN application powered by [Next.js](https://nextjs.org/). Users can sign up and order products listed by root users.

If testing app functionality, use card information:

- card number: 4242 4242 4242 4242
- expiration date: 04/24
- cvc: 424
- name: ANY
- zip: ANY

## Motivation

I decided to build this full stack Ecommerce web app to strengthen my full stack development skills using server-side rendering.

## Front End

The front end was built using [Next.js](https://nextjs.org/) and [React](https://reactjs.org/).

## Back End

The back end was built using [Node.js](https://nodejs.org/en/), [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), and [Mongoose](https://mongoosejs.com/). [Stripe](https://stripe.com/) was used to handle all user payments.

#### TODO

- add search functionality
- add more products (can be done by root users in production)

#### ISSUES

- users cannot checkout in production
- root users cannot add or delete products in production - problem with Product collection in database
