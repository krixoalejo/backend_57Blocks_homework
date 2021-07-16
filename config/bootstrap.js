
// Import crypto to encrypt and decrypt the passwords.
const crypto = require('crypto'), jwt = require('jsonwebtoken');

module.exports.bootstrap = async function() {
  // Messages of responses to the consumers.
  sails.messages = {
    CREATE: 'create',
    DELETE: 'delete',
    ENCRYPT_ERROR: 'Oops, something happened with the encryption process, please try later!!!',
    EMAIL_ALREADY_REGISTERED: 'Email already registered.',
    EMAIL_INVALID: 'Invalid email address.',
    EMAIL_PASSWORD_DONT_MATCH: 'Email or password don\'t match.',
    ERROR: 'Internal server error.',
    GREETINGS: 'Hello, ¡Welcome to the 57Blocks Homework!',
    LIKED_POKEMON: 'You liked this pokemon.',
    LOGIN_SUCCESS: 'Login success.',
    OK: 'Ok.',
    ONLY_USER: 'Action not allowed, only you with your idUser can do this.',
    PASSWORD_INVALID: 'The password needs to contains at least 10 characters, one lowercase letter, one uppercase letter and one of the following characters: !, @, #, ? or ].',
    POKEMON_CREATED: 'Pokemon created successfully.',
    POKEMON_DELETED: 'Pokemon deleted successfully.',
    POKEMON_DOESNT_EXIST: 'The pokemon doesn\'t exist.',
    POKEMON_DOESNT_YOURS: 'This pokemon doesn\'t yours.',
    POKEMON_UPDATED: 'Pokemon updated successfully.',
    POKEMONS_DELETED: 'Pokemons deleted successfully.',
    POKEMONS_FOUND: 'Pokemons found.',
    POKEMONS_DONT_FOUND: 'Pokemons don\'t found.',
    UNAUTHORIZED: 'Unauthorized',
    UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
    UPDATE: 'update',
    USER_CREATED: 'User created successfully.',
    USER_DOESNT_EXIST: 'The idUser doesn\'t exist.'
  };
  // Constants for HTTP Status codes.
  sails.statusCodes = {
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    NO_CONTENT: 204,
    OK: 200,
    UNAUTHORIZED: 401
  };
  // Constants of application.
  sails.states = {
    INACTIVE: 0,
    ACTIVE: 1,
  };
  sails.crypto = crypto;
  sails.encrypt = {
    algorithm: 'aes-256-cbc',
    key: sails.crypto.randomBytes(32),
    iv: sails.crypto.randomBytes(16)
  };
  sails.jwt = jwt;
  sails.tokenSecret = '57blockshomework';
  sails.limitPagination = 5;
};
