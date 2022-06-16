import React, { Fragment } from 'react';
import styled from 'react-emotion';

import { unit, colors } from '../styles';

export default function PageContainer (props: any) {
  return (
    <Fragment>
      <Container>{props.children}</Container>
    </Fragment>
  );
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  width: '100%',
  margin: '0 auto',
  padding: unit * 3,
  paddingBottom: unit * 5,
});
