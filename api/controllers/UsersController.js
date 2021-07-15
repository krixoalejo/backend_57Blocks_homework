/**
 * UsersController
 *
 * @description :: Actions to the users on platform.
 */

const Utilities = require('./UtilitiesController');
const UtilitiesUsers = require('./UtilitiesUsersController');

module.exports = {
    create: async function (req, res) {
        let userInfo = req.allParams(); // UserInfo from the request.
        let userValidations = UtilitiesUsers.isValidUserData(userInfo); // Check user data.
        if (!userValidations) 
            return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.UNPROCESSABLE_ENTITY, res);
        userValidations = UtilitiesUsers.isValidEmail(userInfo.email); // Check if the email is a valid email.
        if (!userValidations) 
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.EMAIL_INVALID, res);
        userValidations = await UtilitiesUsers.getUserByEmail(userInfo.email); // Check if the email already exist on DB.
        if (userValidations.length > 0) 
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.EMAIL_ALREADY_REGISTERED, res);
        userValidations = UtilitiesUsers.isValidPassword(userInfo.password); // Check if the password is a valid password.
        if (!userValidations) 
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.PASSWORD_INVALID, res);
        let encPass = await Utilities.encrypt(userInfo.password); // Process to encrypt the password.
        if (!encPass) return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ENCRYPT_ERROR, res); 
        let stringEncPass = JSON.stringify(encPass); // Convert to String to save in DB.
        let user = { email: userInfo.email, password: stringEncPass, token: '', state: sails.states.ACTIVE }; // User data object.
        return await UtilitiesUsers.createUser(user, res);
    },
    greetings: function (req, res) {
        Utilities.responseBack(sails.statusCodes.OK, sails.messages.GREETINGS, res);
    },
    login: async function (req, res) {
        let userInfo = req.allParams(); // UserInfo from the request.
        let userValidations = UtilitiesUsers.isValidUserData(userInfo); // Check user data.
        if (!userValidations) return Utilities.responseBack(422, sails.messages.UNPROCESSABLE_ENTITY, res);
        userValidations = UtilitiesUsers.isValidEmail(userInfo.email); // Check if the email is a valid email.
        if (!userValidations) 
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.EMAIL_INVALID, res);
        userValidations = UtilitiesUsers.isValidPassword(userInfo.password);  // Check if the password is a valid password.
        if (!userValidations) 
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.PASSWORD_INVALID, res);
        userValidations = await UtilitiesUsers.getUserByEmail(userInfo.email); // Check if user already exist on DB.
        if (userValidations.length === 0) 
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.EMAIL_PASSWORD_DONT_MATCH, res);
        let objectPass = JSON.parse(userValidations[0].password);
        let decrPass = Utilities.decrypt(objectPass); // Process to decrypt the password.
        if (decrPass !== userInfo.password) // Check if the passwords are equals.
            return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.EMAIL_PASSWORD_DONT_MATCH, res);
        let token = await Utilities.createToken({id: userValidations[0].id}); // Create the user token.
        userValidations[0].token = token; // Assign the token to the user.
        return await UtilitiesUsers.updateUserWhenLogin(userValidations, res); // Update the user.
    },
    validateToken: function(req, res){
        return UtilitiesUsers.validateToken(req, res);
    }
};

