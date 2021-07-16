/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token.
 */

const Utilities = require('../controllers/UtilitiesController');
const endpointsNotIdUser = ['/pokemons/public/']

module.exports = function (req, res, next) {
    const token = req.headers.token;
    if (!token) {
        Utilities.responseBack(sails.statusCodes.UNAUTHORIZED, sails.messages.UNAUTHORIZED, res);
    } else {
        // Validate if the user have an valid token
        Utilities.verifyToken(token, function (err, token) {
            if (err) return Utilities.responseBack(sails.statusCodes.UNAUTHORIZED, sails.messages.UNAUTHORIZED, res);
            let haveEndpoint = false;
            endpointsNotIdUser.forEach(endpoint => {
                if (req.url.includes(endpoint)) haveEndpoint = true;
            });
            if (!haveEndpoint) {
                let data = req.allParams();
                let idUser = Number(data.idUser);
                if (isNaN(idUser))
                    return Utilities.responseBack(sails.statusCodes.BAD_REQUEST, sails.messages.UNPROCESSABLE_ENTITY, res);
                if (idUser !== token.id) 
                    return Utilities.responseBack(sails.statusCodes.INTERNAL_SERVER_ERROR, sails.messages.ONLY_USER, res);
            }
            next();
        });
    }
};