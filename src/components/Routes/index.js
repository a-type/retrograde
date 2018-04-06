import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Session from './Session';

export default class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/sessions/:id" component={Session} />
        <Route render={() => <div>Not found</div>} />
      </Switch>
    );
  }
}
