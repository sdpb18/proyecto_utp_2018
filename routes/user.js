'use stric'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/prueba-cont', UserController.pruebas);
api.post('/register', UserController.addUser);
api.post('/login', UserController.loginUser);

module.exports = api;
