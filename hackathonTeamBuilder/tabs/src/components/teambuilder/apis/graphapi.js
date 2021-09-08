import { ApolloLink, HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";

export default function(authToken) {
    const httpLink = new HttpLink({ uri: 'https://nh4h-graphql-fjjjjjwgkmniu.azurewebsites.net/api/hack' });

    const authLink = new ApolloLink((operation, forward) => {    
      // Use the setContext method to set the HTTP headers.
      operation.setContext({
        headers: {
          authorization: authToken ? `Bearer ${authToken}` : ''
        }
      });
    
      // Call the next link in the middleware chain.
      return forward(operation);
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      
    });
}