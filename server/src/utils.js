const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports.paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
        cursorIndex + 1,
        Math.min(results.length, cursorIndex + 1 + pageSize),
      )
    : results.slice(0, pageSize);
};

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
