import React from 'react';
import { gql, useMutation } from '@apollo/client';

import { LoginForm, Loading } from '../components';
import { isLoggedInVar } from '../cache';
import * as BikeTypes from '../__generated__/gql-bike-types';

export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user{
        username
      }
    }
  }
`;

export default function Login() {
  const [login, { loading, error }] = useMutation<
    BikeTypes.Mutation,
    BikeTypes.MutationLoginArgs
  >(
    LOGIN_USER,
    {
      onCompleted({ login }) {
        if (login?.token) {
          localStorage.setItem('token', login.token as string);
          localStorage.setItem('username', login.user?.username as string);
          isLoggedInVar(true);
        }
      },
      onError: (err) => {
        console.log(err)
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <p>{error.message}</p>;

  return <LoginForm login={login} />;
}
