export const config = {
  graphqlEndpoint:
    import.meta.env.VITE_GRAPHQL_API_URL || "http://localhost:8080/graphql",
};
