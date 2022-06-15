const S3 = require('aws-sdk/clients/s3');
const isEmail = require('isemail');
const mime = require('mime');
const uuidv4 = require('uuid/v4');
const { DataSource } = require('apollo-datasource');
const jsonwebtoken = require('jsonwebtoken')

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async login({ username, password }) {
    if (!username || !password) {
      throw new Error('You must provide an username and password');
    }
    const user = await this.store.users.findOne({ where: { username } });
    if (!user) {
      throw new Error('Username or password is incorrect');
    }

    const isValid = await this.store.users.validatePassword(password, user.password);
    if (!isValid) {
      throw new Error('Username or password is incorrect')
    }
    console.log(process.env.JWT_SECRET)
    // return bearer token to be used for future requests
    const token = jsonwebtoken.sign(
      { username: user.username },
      // process.env.JWT_SECRET,
      "test",
      { expiresIn: '1d' }
    )

    return {
      token, user
    }
  }

  async createUser(args) {
    try {
      if (!args) {
        throw new Error('You must provide username and password');
      }
      const user = await this.store.users.create({
        ...args,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return user;
    } catch (error) {
      console.log(error)
    }
  }

  async findUser(username) {
    const user = await this.store.users.findOne({ where: { username } });
    return user;
  }

}

module.exports = UserAPI;
