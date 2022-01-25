import "reflect-metadata";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { HiResolvers } from "./resolvers/HiResolvers";
import { UserResolver } from "./resolvers/UserResolver";
import * as redis from "redis";

(async function main() {
  const connection = await createConnection();
  // const client = await redis.createClient(6379);

  const schema = await buildSchema({
    resolvers: [HiResolvers, UserResolver],
  });
  const server = new ApolloServer({ schema });
  await server.listen(4000);
  console.log("Server has started!");
})();
