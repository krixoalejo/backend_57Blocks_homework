/**
 * Pokemon.js
 *
 * @description :: Pokemon model.
 */

module.exports = {
  tableName: 'pokemons',
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
    name: {
      type: 'string',
      columnName: 'name'
    },
    species: {
      type: 'string',
      columnName: 'species'
    },
    ability: {
      type: 'string',
      columnName: 'ability'
    },
    color: {
      type: 'string',
      columnName: 'color'
    },
    isPrivate: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'isPrivate'
    },
    state: {
      type: 'number',
      columnName: 'state'
    }
  }
};

