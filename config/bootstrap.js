
// Import crypto to encrypt and decrypt the passwords.
const crypto = require('crypto');

module.exports.bootstrap = async function() {
  // Messages of responses to the consumers.
  sails.messages = {
    ENCRYPT_ERROR: 'Oops, something happened with the encryption process, please try later!!!',
    EMAIL_ALREADY_REGISTERED: 'Email already registered.',
    EMAIL_INVALID: 'The email isn\'t valid.',
    GREETING: 'Hello, ¡Welcome to the 57Blocks Homework!',
    OK: 'Ok',
    PASSWORD_INVALID: 'The password needs to contains at least 10 characters, one lowercase letter, one uppercase letter and one of the following characters: !, @, #, ? or ].',
    UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
    USER_CREATED: 'User created successfully.'
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
  sails.isConnectToTheDb = false;
  if (!sails.isConnectToTheDb) {
    sails.users = [];
  } 
};
