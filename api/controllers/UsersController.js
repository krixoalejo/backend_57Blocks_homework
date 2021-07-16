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
            return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.BAD_REQUEST, res);
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
        let user = { email: userInfo.email, password: stringEncPass, token: '', state: sails.states.ACTIVE }; // User data object to DB.
        return await UtilitiesUsers.createUser(user, res);
    },
    greetings: function (req, res) {
        Utilities.responseBack(sails.statusCodes.OK, sails.messages.GREETINGS, res);
    },
    login: async function (req, res) {
        let userInfo = req.allParams(); // UserInfo from the request.
        let userValidations = UtilitiesUsers.isValidUserData(userInfo); // Check user data.
        if (!userValidations) return Utilities.responseBack(422, sails.messages.BAD_REQUEST, res);
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
        if (userValidations[0].token) {
            let validateToken = await UtilitiesUsers.validateLocalToken(userValidations[0].token);
            if (validateToken) return Utilities.responseBack(sails.statusCodes.OK, sails.messages.LOGIN_SUCCESS,
                res, { id: userValidations[0].id, token: userValidations[0].token }) // Return the saved token if is valid.
        }
        let token = await Utilities.createToken({ id: userValidations[0].id }); // Create the user token.
        userValidations[0].token = token; // Assign the token to the user.
        return await UtilitiesUsers.updateUserWhenLogin(userValidations, res); // Update the user.
    },
    randomNumber: function (req, res) {
        // Import necessary module to do the request.
        let request = require('request');
        // URL form the API (http://www.randomnumberapi.com)
        let url = 'http://www.randomnumberapi.com/api/v1.0/randomredditnumber?min=100&max=1000&count=1';
        request.get({
            url: url
        }, function (error, response) {
            if (error) sails.log.error(error);
            return Utilities.responseBack(sails.statusCodes.OK, sails.messages.RANDOM_NUMBER, res, response.body)
        });
    }
};

