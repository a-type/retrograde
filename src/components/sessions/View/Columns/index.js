import React from 'react';
import Layout from './Layout';
import Column from 'components/columns/View';
import CreateColumn from 'components/columns/Create';

export default class SessionViewColumns extends React.PureComponent {
  render() {
    return (
      <Layout>
        {this.props.columns.map(column => (
          <Column key={column.id} column={column} />
        ))}
        <CreateColumn />
      </Layout>
    );
  }
}
