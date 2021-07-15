
// Import crypto to encrypt and decrypt the passwords.
const crypto = require('crypto'), jwt = require('jsonwebtoken');

module.exports.bootstrap = async function() {
  // Messages of responses to the consumers.
  sails.messages = {
    ENCRYPT_ERROR: 'Oops, something happened with the encryption process, please try later!!!',
    EMAIL_ALREADY_REGISTERED: 'Email already registered.',
    EMAIL_INVALID: 'The email isn\'t valid.',
    EMAIL_PASSWORD_DONT_MATCH: 'Email or password don\'t match.',
    ERROR: 'Internal server error.',
    GREETINGS: 'Hello, ¡Welcome to the 57Blocks Homework!',
    LOGIN_SUCCESS: 'Login success.',
    OK: 'Ok.',
    PASSWORD_INVALID: 'The password needs to contains at least 10 characters, one lowercase letter, one uppercase letter and one of the following characters: !, @, #, ? or ].',
    UNAUTHORIZED: 'Unauthorized',
    UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
    USER_CREATED: 'User created successfully.'
  };
  // Constants for HTTP Status codes.
  sails.statusCodes = {
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    OK: 200,
    UNAUTHORIZED: 401
  };
  // Constants of application.
  sails.states = {
    INACTIVE: 0,
    ACTIVE: 1,
  };
  sails.crypto = crypto;
  sails.jwt = jwt;
  sails.tokenSecret = '57blockshomework';
  sails.encrypt = {
    algorithm: 'aes-256-cbc',
    key: sails.crypto.randomBytes(32),
    iv: sails.crypto.randomBytes(16)
  };
};
