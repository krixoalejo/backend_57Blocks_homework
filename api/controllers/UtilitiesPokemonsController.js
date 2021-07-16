/**
 * UtilitiesUsersController
 *
 * @description :: Utilities from the actions of a user.
 */

const Utilities = require('./UtilitiesController');

module.exports = {
    createPokemon: async function(pokemon) {
        try {
            return await Pokemon.create(pokemon).fetch();        
        } catch(err) {
            sails.log.debug(err); 
            Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res); 
        }
    },
    createUserPokemon: async function(userPokemon, res, type) {
        return await UserPokemon.create(userPokemon)
            .then(() => Utilities.responseBack(sails.statusCodes.OK, 
                sails.messages.CREATE === type ? sails.messages.POKEMON_CREATED : sails.messages.LIKED_POKEMON, res) )
            .catch(err => { 
                sails.log.debug(err); 
                Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res); 
            });
    },
    excecuteNativeQuery: async function (query, data) {
        let pokemons = await sails.getDatastore().sendNativeQuery(query, data);
        return pokemons.rows;
    },
    getAmountPokemons: async function (filters) {
        return await Pokemon.count({ where: filters });
    },
    getPokemonById: async function (id) {
        return await Pokemon.find({ where: { id: id, state: 1 } });
    },
    getUserPokemonByIds: async function (idUser, idPokemon) {
        return await UserPokemon.find({ where: { idUser: idUser, idPokemon: idPokemon } });
    },
    isValidPokemonData: function (data, type) {
        if (sails.messages.CREATE === type) {
            return data.idUser && data.name && data.species && 
                data.ability && data.color;
        } else {
            return data.id && data.idUser && data.name && data.species && 
                data.ability && data.color;
        }
    },
    updatePrivatePokemon: async function (id, pokemon, res, type) {
        return await Pokemon.update(id, pokemon)
            .then(() => Utilities.responseBack(sails.statusCodes.OK, 
                sails.messages.UPDATE === type ? sails.messages.POKEMON_UPDATED : sails.messages.POKEMON_DELETED, res) )
            .catch(err => {
                sails.log.debug(err);
                Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res);
            });
    },
    updateUserPokemon: async function (id, userPokemon, res) {
        return await UserPokemon.update(id, userPokemon)
            .then(() => Utilities.responseBack(sails.statusCodes.OK, sails.messages.LIKED_POKEMON, res) )
            .catch(err => {
                sails.log.debug(err);
                Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res);
            });
    },
    validateDataToUpdate: function (newData, oldData) {
        return {
            name: oldData.name === newData.name ? oldData.name : newData.name,
            species: oldData.species === newData.species ? oldData.species : newData.species,
            ability: oldData.ability === newData.ability ? oldData.ability : newData.ability,
            color: oldData.color === newData.color ? oldData.color : newData.color
        }
    }
};

