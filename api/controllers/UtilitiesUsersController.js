/**
 * UtilitiesUsersController
 *
 * @description :: Utilities from the actions of a user.
 */

const Utilities = require('./UtilitiesController');

module.exports = {
    createUser: async function (user, res) {
        return await User.create(user)
            .then(() => Utilities.responseBack(sails.statusCodes.OK, sails.messages.USER_CREATED, res))
            .catch(err => {
                sails.log.debug(err);
                Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res);
            });
    },
    getUserByEmail: async function (email) {
        return await User.find({ where: { email: email } });
    },
    getUserById: async function (id) {
        return await User.find({ where: { id: id } });
    },
    isValidEmail: function (email) {
        return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email);
    },
    isValidPassword: function (password) {
        return password.length > 9 && (RegExp(/[(\!)(\@)(\#)(\])(\?)]/)).test(password) &&
            (/[A-Z]/).test(password) && (/[a-z]/).test(password);
    },
    isValidUserData: function (data) {
        return data.email && data.password;
    },
    updateUserWhenLogin: async function (user, res) {
        let userToUpodate = {
            email: user[0].email,
            password: user[0].password,
            token: user[0].token,
            state: user[0].state
        }
        return await User.update(user[0].id, userToUpodate)
            .then(() => Utilities.responseBack(sails.statusCodes.OK, sails.messages.LOGIN_SUCCESS,
                res, { id: user[0].id, token: user[0].token }))
            .catch(err => {
                sails.log.debug(err);
                Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ERROR, res);
            });
    },
    validateToken: function (req, res) {
        let userInfo = req.allParams(); // UserInfo from the request.
        // Validate if the user have an valid token
        Utilities.verifyToken(userInfo.token, function (err, token) {
            if (err) return Utilities.responseBack(sails.statusCodes.UNAUTHORIZED, sails.messages.UNAUTHORIZED, res);
            return Utilities.responseBack(sails.statusCodes.OK, sails.messages.LOGIN_SUCCESS, res, { token: token })
        });
    },
    validateLocalToken: async function (token) {
        // Validate if the user have an valid token
        return await Utilities.verifyToken(token, function (err) { return err ? false : true });
    }
};

