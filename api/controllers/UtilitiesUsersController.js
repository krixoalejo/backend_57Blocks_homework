/**
 * UtilitiesUsersController
 *
 * @description :: Utilities from the actions of a user.
 */

module.exports = {
    getUserByEmail: async function (email) {
        if (sails.isConnectToTheDb) {
            let user = await User.find({ where: { email: email } });
            return user.length > 0;
        } else {
            let exist = false;
            sails.users.forEach(user => { if (email === user.email) exist = true; });
            return exist;
        } 
    },
    getUserById: async function (id) {
        return await User.find({ where: { id: id } });
    },
    isValidEmail: function(email) {
        return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email);
    },
    isValidPassword: function(password) {
        return password.length > 9 && (RegExp(/[(\!)(\@)(\#)(\])(\?)]/)).test(password) && 
            (/[A-Z]/).test(password) && (/[a-z]/).test(password);
    },
    isValidUserData: function (data) {
        return data.email && data.password;
    }
};

