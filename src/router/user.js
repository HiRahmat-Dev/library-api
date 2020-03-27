const express = require('express');
const Router = express.Router();
const usersController = require('../controller/user');

Router
  .get('/', usersController.getUsers)
  .get('/:idUser', usersController.userDetail)
  .patch('/:idUser', usersController.updateUser);

module.exports = Router;