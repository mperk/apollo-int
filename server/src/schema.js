const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    bikes(page: Int, vehicleType: String): ResponseBikes
    bike(page: Int, vehicleType: String, bikeId: String!): ResponseBike
  }

  type Mutation {
    login(username: String!, password: String!): LoginResponse!
    createUser(username: String!, password: String!): User
  }

  type ResponseBike{
    last_updated: String
    ttl: Int
    data: Bike
    total_count: Int
    nextPage: Boolean
  }

  type ResponseBikes{
    last_updated: String
    ttl: Int
    data: [Bike]!
    total_count: Int
    nextPage: Boolean
  }

  type Bike{
    bike_id: String
    lat: Float
    lon: Float
    is_reserved: Boolean
    is_disabled: Boolean
    vehicle_type: String
  }
  
  type User {
    id: ID!
    username: String!
    password: String!
    email: String
    company: String
    firstName: String
    lastName: String
    createdAt: String!
    updatedAt: String!
  }

  type LoginResponse {
    token: String!
    user: User!
  }
`;

module.exports = typeDefs;
