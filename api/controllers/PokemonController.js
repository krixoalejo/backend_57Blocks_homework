/**
 * PokemonController
 *
 * @description :: Actions to the pokemons on platform.
 */

const Utilities = require('./UtilitiesController');
const UtilitiesPokemons = require('./UtilitiesPokemonsController');
const UtilitiesUsers = require('./UtilitiesUsersController');

module.exports = {
    create: async function (req, res) {
        let pokemonInfo = req.allParams(); //PokemonInfo from the request.
        let pokemonValidations = UtilitiesPokemons.isValidPokemonData(pokemonInfo, sails.messages.CREATE); // Check pokemon data.
        if (!pokemonValidations)
            return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
        pokemonValidations = await UtilitiesUsers.getUserById(pokemonInfo.idUser); // Check if the user exist.
        if (pokemonValidations.length === 0)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.USER_DOESNT_EXIST, res);
        let pokemon = {
            name: pokemonInfo.name, species: pokemonInfo.species, ability: pokemonInfo.ability,
            color: pokemonInfo.color, isPrivate: true, state: sails.states.ACTIVE
        } // Pokemon data object to DB.
        pokemon = await UtilitiesPokemons.createPokemon(pokemon);
        let userPokemon = {
            idUser: pokemonInfo.idUser, idPokemon: pokemon.id,
            isLikedPokemon: false, state: sails.states.ACTIVE
        } // UserPokemon data object to DB.
        return await UtilitiesPokemons.createUserPokemon(userPokemon, res, sails.messages.CREATE);
    },
    createPublicPokemon: async function (req, res) {
        let pokemonInfo = req.allParams(); //PokemonInfo from the request.
        let pokemonValidations = UtilitiesPokemons.isValidPokemonData(pokemonInfo, sails.messages.CREATE_PUBLIC); // Check pokemon data.
        if (!pokemonValidations)
            return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
        let pokemon = {
            name: pokemonInfo.name, species: pokemonInfo.species, ability: pokemonInfo.ability,
            color: pokemonInfo.color, isPrivate: false, state: sails.states.ACTIVE
        } // Pokemon data object to DB.
        return await Pokemon.create(pokemon) // Create a public pokemon.
            .then(() => Utilities.responseBack(sails.statusCodes.OK, sails.messages.POKEMON_CREATED, res))
            .catch(err => {
                sails.log.debug(err);
                Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res);
            });
    },
    deletePrivatePokemon: async function (req, res) {
        let pokemonInfo = req.allParams(); // PokemonInfo from the request.
        if (!pokemonInfo.idPokemon || !pokemonInfo.idUser)
            return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
        let pokemonValidations = await UtilitiesUsers.getUserById(pokemonInfo.idUser); // Check if the user exist.
        if (pokemonValidations.length === 0)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.USER_DOESNT_EXIST, res);
        pokemonValidations = await UtilitiesPokemons.getPokemonById(pokemonInfo.idPokemon); // Check if the pokemon exist.
        if (pokemonValidations.length === 0)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.POKEMON_DOESNT_EXIST, res);
        let userPokemon = await UtilitiesPokemons.getUserPokemonByIds(pokemonInfo.idUser, pokemonInfo.idPokemon); // Check if UserPokemon exist.
        if (userPokemon.length === 0 || !pokemonValidations[0].isPrivate)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.POKEMON_DOESNT_YOURS, res);
        let pokemon = { state: 0 }; // Deleted logical, change state.
        return await UtilitiesPokemons.updatePrivatePokemon(pokemonValidations[0].id, pokemon, res, sails.messages.DELETE);
    },
    deletePrivatePokemons: async function (req, res) {
        let pokemonInfo = req.allParams(); // PokemonInfo from the request.
        let pokemonValidations = await UtilitiesUsers.getUserById(pokemonInfo.idUser); // Check if the user exist.
        if (pokemonValidations.length === 0)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.USER_DOESNT_EXIST, res);
        let update = 'UPDATE public.pokemons AS poke SET state = $1 ';
        let from = 'FROM user_pokemons AS user_poke  ';
        let where = 'WHERE user_poke."idPokemon" = poke.id and user_poke."idUser" = $2';
        let queryData = [0, pokemonInfo.idUser];
        // Implements native query to delete all private pokemons from user.
        await UtilitiesPokemons.excecuteNativeQuery(update + from + where, queryData);
        return await Utilities.responseBack(sails.statusCodes.OK, sails.messages.POKEMONS_DELETED, res);
    },
    getPublicPokemons: async function (req, res) {
        try {
            const reqBody = req.allParams();
            let page = Number(reqBody.page);
            if (isNaN(page) || page < 0)
                return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
            const limit = sails.limitPagination;
            const skip = Number(page) * limit;
            const where = { isPrivate: false, state: 1 };
            // Implements the ORM find option.
            let pokemons = await Pokemon.find({
                where: where,
                select: ['id', 'name', 'species', 'ability', 'color', 'state'],
                skip: skip, limit: limit
            }).sort('id ASC');
            if (!pokemons || pokemons.length === 0) {
                Utilities.responseBack(sails.statusCodes.NO_CONTENT, sails.messages.POKEMONS_DONT_FOUND, res);
            } else {
                const amount = await UtilitiesPokemons.getAmountPokemons(where);
                const infoPokemons = { pokemons: pokemons, total: amount };
                Utilities.responseBack(sails.statusCodes.OK, sails.messages.POKEMONS_FOUND, res, infoPokemons);
            }
        } catch (error) {
            sails.log.debug(error);
            Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res);
        }
    },
    getPublicLikedPokemons: async function (req, res) {
        try {
            const reqBody = req.allParams();
            let page = Number(reqBody.page);
            let idUser = Number(reqBody.idUser);
            if (isNaN(page) || page < 0 || isNaN(idUser) || idUser < 0)
                return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
            const limit = sails.limitPagination;
            const skip = Number(page) * limit;
            let select = 'SELECT poke.id, poke.name, poke.species, poke.ability, poke.ability, poke.state ';
            let from = 'FROM public.pokemons poke inner join public.user_pokemons user_poke on poke.id = user_poke."idPokemon" ';
            let where = 'where poke."isPrivate" = $1 and user_poke."idUser" = $2 and user_poke."isLikedPokemon" = $3 limit $4 offset $5';
            let queryData = [false, idUser, true, limit, skip];
            // Implements native query to find specific information.
            let pokemons = await UtilitiesPokemons.excecuteNativeQuery(select + from + where, queryData);
            if (!pokemons || pokemons.length === 0) {
                Utilities.responseBack(sails.statusCodes.NO_CONTENT, sails.messages.POKEMONS_DONT_FOUND, res);
            } else {
                select = 'SELECT COUNT(poke.id) ';
                where = 'where poke."isPrivate" = $1 and user_poke."idUser" = $2 and user_poke."isLikedPokemon" = $3';
                queryData = [false, idUser, true];
                const amount = await UtilitiesPokemons.excecuteNativeQuery(select + from + where, queryData);
                const infoPokemons = { pokemons: pokemons, total: amount[0].count };
                Utilities.responseBack(sails.statusCodes.OK, sails.messages.POKEMONS_FOUND, res, infoPokemons);
            }
        } catch (error) {
            sails.log.debug(error);
            Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res);
        }
    },
    getPrivatePokemons: async function (req, res) {
        try {
            const reqBody = req.allParams();
            let page = Number(reqBody.page);
            let idUser = Number(reqBody.idUser);
            if (isNaN(page) || page < 0 || isNaN(idUser) || idUser < 0)
                return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
            const limit = sails.limitPagination;
            const skip = Number(page) * limit;
            let select = 'SELECT poke.id, poke.name, poke.species, poke.ability, poke.ability, poke.state ';
            let from = 'FROM public.pokemons poke inner join public.user_pokemons user_poke on poke.id = user_poke."idPokemon" ';
            let where = 'where poke."isPrivate" = $1 and user_poke."idUser" = $2 and poke.state = $3 limit $4 offset $5';
            let queryData = [true, idUser, 1, limit, skip];
            // Implements native query to find specific information.
            let pokemons = await UtilitiesPokemons.excecuteNativeQuery(select + from + where, queryData);
            if (!pokemons || pokemons.length === 0) {
                Utilities.responseBack(sails.statusCodes.NO_CONTENT, sails.messages.POKEMONS_DONT_FOUND, res);
            } else {
                select = 'SELECT COUNT(poke.id) ';
                where = 'where poke."isPrivate" = $1 and user_poke."idUser" = $2 and poke.state = $3';
                queryData = [true, idUser, 1];
                const amount = await UtilitiesPokemons.excecuteNativeQuery(select + from + where, queryData);
                const infoPokemons = { pokemons: pokemons, total: amount[0].count };
                Utilities.responseBack(sails.statusCodes.OK, sails.messages.POKEMONS_FOUND, res, infoPokemons);
            }
        } catch (error) {
            sails.log.debug(error);
            Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res);
        }
    },
    updatePrivatePokemon: async function (req, res) {
        let pokemonInfo = req.allParams(); //PokemonInfo from the request.
        let pokemonValidations = UtilitiesPokemons.isValidPokemonData(pokemonInfo, sails.messages.UPDATE); // Check pokemon data.
        if (!pokemonValidations)
            return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
        pokemonValidations = await UtilitiesUsers.getUserById(pokemonInfo.idUser); // Check if the user exist.
        if (pokemonValidations.length === 0)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.USER_DOESNT_EXIST, res);
        pokemonValidations = await UtilitiesPokemons.getPokemonById(pokemonInfo.id); // Check if the pokemon exist.
        if (pokemonValidations.length === 0)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.POKEMON_DOESNT_EXIST, res);
        let userPokemon = await UtilitiesPokemons.getUserPokemonByIds(pokemonInfo.idUser, pokemonInfo.id); // Check if UserPokemon exist.
        if (userPokemon.length === 0 || !pokemonValidations[0].isPrivate)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.POKEMON_DOESNT_YOURS, res);
        let pokemon = UtilitiesPokemons.validateDataToUpdate(pokemonInfo, pokemonValidations); // Compare pokemon data to update.
        return await UtilitiesPokemons.updatePrivatePokemon(pokemonValidations[0].id, pokemon, res, sails.messages.UPDATE);
    },
    updatePublicPokemon: async function (req, res) {
        let pokemonInfo = req.allParams(); //PokemonInfo from the request.
        let idUser = pokemonInfo.idUser;
        let idPokemon = pokemonInfo.idPokemon;
        let pokemonValidations = idUser && idPokemon; // Check pokemon data.
        if (!pokemonValidations)
            return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
        pokemonValidations = await UtilitiesUsers.getUserById(idUser); // Check if the user exist.
        if (pokemonValidations.length === 0)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.USER_DOESNT_EXIST, res);
        pokemonValidations = await UtilitiesPokemons.getPokemonById(idPokemon); // Check if the pokemon exist.
        if (pokemonValidations.length === 0 || pokemonValidations[0].isPrivate)
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.POKEMON_DOESNT_EXIST, res);
        let userPokemon = await UtilitiesPokemons.getUserPokemonByIds(idUser, idPokemon); // Check if UserPokemon exist.
        if (userPokemon.length > 0) {
            return await UtilitiesPokemons.updateUserPokemon(userPokemon[0].id, { isLikedPokemon: true }, res);
        } else {
            userPokemon = {
                idUser: idUser, idPokemon: idPokemon,
                isLikedPokemon: true, state: sails.states.ACTIVE
            } // UserPokemon data object to DB.
            return await UtilitiesPokemons.createUserPokemon(userPokemon, res, sails.messages.UPDATE);
        }
    }
}