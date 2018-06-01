import React from 'react';
import Layout from './Layout';
import User from 'components/users/View';
import { H2 } from 'components/generic';

export default class SessionUsers extends React.Component {
  componentDidMount() {
    this.props.subscribe();
  }

  renderUser = user => <User user={user} />;

  render() {
    const { users } = this.props;

    return (
      <Layout>
        <H2>Users</H2>
        {users.map(this.renderUser)}
      </Layout>
    );
  }
}
