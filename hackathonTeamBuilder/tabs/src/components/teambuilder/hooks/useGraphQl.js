import { useState } from "react";
import {
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client";
import { TeamsFx } from "@microsoft/teamsfx";
import { config } from "../../config";

export function useGraphQl(apiFunc) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createApolloClient = async () => {
    const teamsFx = new TeamsFx();
    const tokenResult = await teamsFx.getCredential().getToken("");

    const httpLink = new HttpLink({ uri: config.GRAPHQL_ENDPOINT });

    const authLink = new ApolloLink((operation, forward) => {
      // Use the setContext method to set the HTTP headers.
      operation.setContext({
        headers: {
          authorization: tokenResult ? `Bearer ${tokenResult.token}` : "",
        },
      });

      // Call the next link in the middleware chain.
      return forward(operation);
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  };

  const request = async (data, options) => {
    setLoading(true);
    try {
      const client = await createApolloClient();
      const result = await apiFunc(client, data, options);
      setData(result.data);
      return true;
    } catch (err) {
      setError(err.message || "Unexpected Error!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    request
  };
};
