import React, { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ApolloProvider} from '@apollo/react-hooks';
import FollowScreen from './src/screens/FollowScreen';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://192.168.137.14:4000/graphql'
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://192.168.137.14:4000/graphql`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={<div>Loading…</div>}>
        <FollowScreen />
      </Suspense>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
