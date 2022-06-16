const bcrypt = require('bcrypt');
const { ForbiddenError, AuthenticationError } = require('apollo-server');

module.exports = {
  Query: {
    bikes: async (_, { page = 1, vehicleType }, { dataSources, username }) => {
      if (!username) return new AuthenticationError('Authentication token must be passed as a Bearer token in the Authorization header');
      const bikes = await dataSources.bikeAPI.getBikes(page, vehicleType);
      return bikes;
    },
    bike: async (_, { page = 1, vehicleType, bikeId }, { dataSources, username }) => {
      if (!username) return new AuthenticationError('Authentication token must be passed as a Bearer token in the Authorization header');
      const bike = await dataSources.bikeAPI.getBike(page, vehicleType, bikeId);
      return bike ?? null;
    },
  },
  Mutation: {
    login: async (_, { username, password }, { dataSources }) => {
      const hash = await bcrypt.hashSync(password, 10);
      const response = await dataSources.userAPI.login({ username, password });
      return response
    },
    createUser: async (_, args, { dataSources }) => {
      const user = await dataSources.userAPI.findUser(args.username);
      if (user) {
        throw new ForbiddenError('User already exists.')
      }
      args.password = await bcrypt.hashSync(args.password, 10);
      const response = await dataSources.userAPI.createUser(args);
      return response
    }
  },
};
