import React from 'react';
import SessionView from 'components/sessions/View';

export default class Session extends React.PureComponent {
  render() {
    return <SessionView sessionId={this.props.match.params.id} />;
  }
}
