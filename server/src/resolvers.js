const { paginateResults } = require('./utils');
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
      return bike;
    },
    // bikes: async (parent, { pageSize = 10, after }, { dataSources }) => {
    //   const allBikes = await dataSources.bikeAPI.getBikes();
    //   const bikes = paginateResults(allBikes, after, pageSize);
    //   return {
    //     bikes,
    //     cursor: bikes.length ? bikes[bikes.length - 1].id : null,
    //     hasMore: bikes.length === pageSize,
    //   };
    // },
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
  // User: {
  //   trips: async (_, __, { dataSources }) => {
  //     // get ids of launches by user
  //     const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

  //     if (!launchIds.length) return [];

  //     // look up those launches by their ids
  //     return (
  //       dataSources.launchAPI.getLaunchesByIds({
  //         launchIds,
  //       }) || []
  //     );
  //   },
  // },
};
