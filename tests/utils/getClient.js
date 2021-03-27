import fetch from 'cross-fetch'
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const wsLink = token => new WebSocketLink({
  uri: 'ws://localhost:5000',
  options: {
    reconnect: true,
    connectionParams: () => {
      if(token) {
        return {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    }
    // connectionParams: () => {
    //   if(token) {
    //     return {
    //       Authorization: `Bearer ${token}`
    //     }
    //   }
    // }
  }
})

const httpLink = token => new HttpLink({
  uri: 'http://localhost:4000',
  fetch: (uri, options) => {
    options.headers.Authorization = token ? `Bearer ${token}` : "";
    return fetch(uri, options);
  }
})

const splitLink = token => split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink(token),
  httpLink(token)
) 

const getClient = (token) => {
  return new ApolloClient({
    link: splitLink(token),
    cache: new InMemoryCache()
  })
}

export default getClient