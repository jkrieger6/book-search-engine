import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage
  const token = localStorage.getItem('id_token');
  // Return the headers to the context so HTTP requests can be made while authenticated
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Instantiate Apollo Client
const client = new ApolloClient({
  // Link requests to the API route
  link: authLink.concat(httpLink),
  // Instantiate a new cache object
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route 
            exact path='/' 
            component={<SearchBooks />} 
          />
          <Route 
            exact path='/saved' 
            component={<SavedBooks />} 
          />
          <Route 
            render={() => <h1 className='display-2'>Wrong page!</h1>}
          />
          </Switch>
        </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
