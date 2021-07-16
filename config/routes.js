module.exports.routes = {

  // Default route.
  '/': 'UsersController.greetings',

  // User endpoints
  'POST /users': 'UsersController.create',
  'POST /login': 'UsersController.login',
  'POST /validateToken': 'UsersController.validateToken',

  // Pokemon endpoints
  'GET /pokemons/public/:page': 'PokemonController.getPublicPokemons',
  'GET /pokemons/private/:idUser/:page': 'PokemonController.getPrivatePokemons',
  'GET /pokemons/public-liked/:idUser/:page': 'PokemonController.getPublicLikedPokemons',
  'POST /pokemons': 'PokemonController.create',
  'PUT /pokemons': 'PokemonController.updatePrivatePokemon',
  'PUT /pokemons/like': 'PokemonController.updatePublicPokemon',
  'PUT /pokemons/delete/pokemon': 'PokemonController.deletePrivatePokemon',
  'PUT /pokemons/delete/pokemons': 'PokemonController.deletePrivatePokemons',

};
