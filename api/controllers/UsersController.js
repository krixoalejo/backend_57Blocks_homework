/**
 * UsersController
 *
 * @description :: Actions to the users on platform.
 */

const Utilities = require('./UtilitiesController');
const UtilitiesUsers = require('./UtilitiesUsersController');

module.exports = {
    create: async function (req, res) {
        // UserInfo from the request.
        let userInfo = req.allParams();
        // Check user data.
        let userValidations = UtilitiesUsers.isValidUserData(userInfo);
        if (!userValidations) return Utilities.responseBack(422, sails.messages.UNPROCESSABLE_ENTITY, res);
        // Check if the email is a valid email.
        userValidations = UtilitiesUsers.isValidEmail(userInfo.email);
        if (!userValidations) return Utilities.responseBack(500, sails.messages.EMAIL_INVALID, res);
        // Check if the email already exist on DB.
        userValidations = await UtilitiesUsers.getUserByEmail(userInfo.email);
        if (userValidations) return Utilities.responseBack(500, sails.messages.EMAIL_ALREADY_REGISTERED, res);
        // Check if the password is a valid password.
        userValidations = UtilitiesUsers.isValidPassword(userInfo.password); 
        if (!userValidations) return Utilities.responseBack(500, sails.messages.PASSWORD_INVALID, res);
        // Process to encrypt the password.
        let encPass = await Utilities.encrypt(userInfo.password);
        // Convert to String to save in DB.
        if (!encPass) return Utilities.responseBack(500, sails.messages.ENCRYPT_ERROR, res);
        let stringEncPass = JSON.stringify(encPass);
        // User data object.
        let user = { email: userInfo.email, password: stringEncPass, token: '', state: sails.states.ACTIVE };
        if (sails.isConnectToTheDb) {
            await User.create(user).then(() => {
                Utilities.responseBack(200, sails.messages.USER_CREATED, res);
            }).catch((err) => {
                sails.log.debug(err);
                Utilities.responseBack(false, sails.constantes.ERROR_CREAR_USUARIO, res);
            });
        } else {
            sails.users.push(user);
            console.log(sails.users);
            Utilities.responseBack(200, sails.messages.USER_CREATED, res);
        }
    },
    greetings: function (req, res) {
        Utilities.responseBack(200, sails.messages.GREETING, res);
    },
};

