import React from 'react';
import CreateSession from 'components/sessions/Create';
import Layout from './Layout';
import { H1 } from 'components/generic';

export default class Home extends React.PureComponent {
  render() {
    return (
      <Layout>
        <div>
          <H1>Start a Retro</H1>
          <CreateSession />
        </div>
      </Layout>
    );
  }
}
