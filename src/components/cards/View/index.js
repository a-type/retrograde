import React from 'react';

export default class CardView extends React.PureComponent {
  render() {
    return <div>{JSON.stringify(this.props.card)}</div>;
  }
}
