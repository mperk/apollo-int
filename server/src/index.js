require('dotenv').config();

const { ApolloServer, AuthenticationError } = require('apollo-server');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const jsonwebtoken = require('jsonwebtoken')

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');

const UserAPI = require('./datasources/user');
const BikeAPI = require('./datasources/bike');

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  userAPI: new UserAPI({ store }),
  bikeAPI: new BikeAPI(),
});


// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const token = auth.replace('Bearer ', '')
    if (!token) return null;
    const { username } = jsonwebtoken.verify(token, "test")
    return { username };
  },
  dataSources,
  playground: true,
  introspection: true
  // apollo: {
  //   key: process.env.APOLLO_KEY,
  // },
  // plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test') {
  server.listen().then(() => {
    console.log(`Server is running at http://localhost:4000`);
  });
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  typeDefs,
  resolvers,
  ApolloServer,
  UserAPI,
  store,
  server,
};
