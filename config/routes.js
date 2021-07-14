module.exports.routes = {

  // Default route.
  '/': 'UsersController.greetings',

  // User endpoints
  'POST /users': 'UsersController.create'

};
