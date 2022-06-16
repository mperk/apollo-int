const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports.createStore = () => {
  const db = new Sequelize({
    dialect: 'sqlite',
    storage: './store.sqlite'
  });

  const users = db.define('user', {
    id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, unique: true },
    username: { type: Sequelize.STRING, allowNull: false },
    email: Sequelize.STRING,
    password: { type: Sequelize.STRING, allowNull: false },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  users.validatePassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
  }

  return { db, users };
};
