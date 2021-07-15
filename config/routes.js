module.exports.routes = {

  // Default route.
  '/': 'UsersController.greetings',

  // User endpoints
  'POST /users': 'UsersController.create',
  'POST /login': 'UsersController.login',
  'POST /validateToken': 'UsersController.validateToken',

};
