import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import apolloClient from './apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './components/Routes';

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Router>
          <Routes />
        </Router>
      </ApolloProvider>
    );
  }
}
