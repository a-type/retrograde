import React from 'react';
import Layout from './Layout';

export default class UserView extends React.PureComponent {
  render() {
    const { user: { id, name } = {} } = this.props;

    return <Layout>{name}</Layout>;
  }
}
