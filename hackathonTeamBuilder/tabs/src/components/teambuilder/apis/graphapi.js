import { ApolloLink, HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import {config} from '../../config'

export default function(authToken) {
    //const httpLink = new HttpLink({ uri: config.GRAPHQL_ENDPOINT });
    const httpLink = new HttpLink({ uri: 'https://localhost:5501/graphql'});

    // const authLink = new ApolloLink((operation, forward) => {    
    //   // Use the setContext method to set the HTTP headers.
    //   operation.setContext({
    //     headers: {
    //       authorization: authToken ? `Bearer ${authToken}` : ''
    //     }
    //   });
    
    //   // Call the next link in the middleware chain.
    //   return forward(operation);
    // });

    return new ApolloClient({
      link: httpLink,
      //link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      
    });
}