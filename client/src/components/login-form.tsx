import React, { Component } from 'react';
import styled from 'react-emotion';

import Button from './button';
import { colors, unit } from '../styles';
import * as BikeTypes from '../__generated__/gql-bike-types';

interface LoginFormProps {
  login: (a: { variables: BikeTypes.MutationLoginArgs }) => void;
}

interface LoginFormState {
  username: string;
  password: string;
}

export default class LoginForm extends Component<LoginFormProps, LoginFormState> {
  state = { username: '', password: '' };

  onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = (event.target as HTMLInputElement).value;
    this.setState(s => ({ username }));
  };
  onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = (event.target as HTMLInputElement).value;
    this.setState(s => ({ password }));
  };
  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.login({ variables: { ...this.state } });
  };

  render() {
    return (
      <Container>
        <Heading>Bike Explorer</Heading>
        <StyledForm onSubmit={(e) => this.onSubmit(e)}>
          <StyledInput
            required
            type="text"
            name="username"
            placeholder="Username"
            data-testid="login-input-username"
            onChange={(e) => this.onChangeUsername(e)}
          />
          <StyledInput
            required
            type="password"
            name="password"
            placeholder="Password"
            data-testid="login-input-password"
            onChange={(e) => this.onChangePassword(e)}
          />
          <Button type="submit">Log in</Button>
        </StyledForm>
      </Container>
    );
  }
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexGrow: 1,
  paddingBottom: unit * 6,
  color: 'white',
  backgroundColor: colors.secondary,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const Heading = styled('h1')({
  margin: `${unit * 3}px 0 ${unit * 6}px`,
});

const StyledForm = styled('form')({
  width: '100%',
  maxWidth: 406,
  padding: unit * 3.5,
  borderRadius: 3,
  boxShadow: '6px 6px 1px rgba(0, 0, 0, 0.25)',
  color: colors.text,
  backgroundColor: 'white',
});

const StyledInput = styled('input')({
  width: '100%',
  marginBottom: unit * 2,
  padding: `${unit * 1.25}px ${unit * 2.5}px`,
  border: `1px solid ${colors.grey}`,
  fontSize: 16,
  outline: 'none',
  ':focus': {
    borderColor: colors.primary,
  },
});
