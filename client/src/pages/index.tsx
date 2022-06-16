import React, { Fragment } from 'react';
import { Router } from '@reach/router';

import { PageContainer } from '../components';
import Bikes from './bikes';

export default function Pages() {
  return (
    <Fragment>
      <PageContainer>
        <Router primary={false} component={Fragment}>
          <Bikes path="/" />
        </Router>
      </PageContainer>
    </Fragment>
  );
}
