import React from 'react';
import Layout from './Layout';
import Card from 'components/cards/View';

export default class ColumnView extends React.PureComponent {
  render() {
    const { column: { name, cards } } = this.props;

    return (
      <Layout>
        <h2>{name}</h2>
        {cards.map(card => <Card key={card.id} card={card} />)}
      </Layout>
    );
  }
}
