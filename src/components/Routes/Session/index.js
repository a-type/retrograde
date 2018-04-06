import React from 'react';
import SessionView from 'components/sessions/View';
import { Route } from 'react-router-dom';
import CreateUser from 'components/users/Create';

export default class Session extends React.PureComponent {
  render() {
    return (
      <div>
        <Route path="/sessions/:id/join" component={CreateUser} />
        <SessionView sessionId={this.props.match.params.id} />
      </div>
    );
  }
}
