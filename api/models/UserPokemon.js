/**
 * Pokemon.js
 *
 * @description :: Pokemon model.
 */

module.exports = {
  tableName: 'user_pokemons',
  primaryKey: 'id',
  autocreatedAt : true,
  autoupdatedAt : true,
  attributes: {
    id: {
      type: 'number',
      unique: true,
      autoIncrement: true,
      columnName: 'id',
    },
    idUser: {
      type: 'number',
      columnName: 'idUser'
    },
    idPokemon: {
      type: 'number',
      columnName: 'idPokemon'
    },
    isLikedPokemon: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'isLikedPokemon'
    },  
    state: {
      type: 'number',
      columnName: 'state'
    }
  }
};

