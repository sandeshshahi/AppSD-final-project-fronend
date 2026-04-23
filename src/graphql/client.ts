import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { config } from "../config";
import { HttpLink } from "@apollo/client";

// Point to your backend GraphQL endpoint dynamically!
const httpLink = new HttpLink({
  uri: config.graphqlEndpoint,
});

// The Auth Link: This runs before EVERY request to attach the JWT token
const authLink = new SetContextLink((prevContext) => {
  // Grab the token from local storage
  const token = localStorage.getItem("token");

  // Return the headers merged with the previous context headers
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create and export the actual client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
