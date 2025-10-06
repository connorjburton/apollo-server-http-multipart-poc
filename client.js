import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import gql from 'graphql-tag';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
  cache: new InMemoryCache()
});

const res = await client.query({
  query: gql`
    query Test {
      currentNumber
    }
  `
});
// works
console.log(res);

client.subscribe({
  query: gql`
    subscription Test {
      numberIncremented
    }
  `
}).subscribe({
  next(data) {
    // does not work, returns null
    console.log('data', data, JSON.stringify(data?.error?.errors || ''));
  },
  error(err) { console.error('err', err, err.error.errors) },
  onDisconnect(ctx, code, reason) {
    console.log('Disconnected!', ctx, code, reason);
  },
});

setTimeout(() => process.exit(1), 60000);
