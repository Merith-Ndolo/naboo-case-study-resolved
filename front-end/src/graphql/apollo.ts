import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

//TODO: use env variable instead
export const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
    credentials: "include",
  }),
  ssrMode: typeof window === "undefined",
});
