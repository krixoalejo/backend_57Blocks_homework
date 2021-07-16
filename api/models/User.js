/**
 * User.js
 *
 * @description :: User model.
 */

module.exports = {
  tableName: 'users',
  primaryKey: 'id',
  autocreatedAt: true,
  autoupdatedAt: true,
  attributes: {
    id: {
      type: 'number',
      unique: true,
      autoIncrement: true,
      columnName: 'id',
    },
    email: {
      type: 'string',
      columnName: 'email'
    },
    password: {
      type: 'string',
      columnName: 'password'
    },
    token: {
      type: 'string',
      columnName: 'token'
    },
    state: {
      type: 'number',
      columnName: 'state'
    }
  }
};

