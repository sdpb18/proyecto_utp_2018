'use stric'

const express = require('express');
const UserController = require('../controllers/user');
const multipart = require('connect-multiparty');

const md_auth = require('../middlewares/authenticated');
const md_upload = multipart({uploadDir: './uploads/users'});

const api = express.Router();

api.get('/prueba-cont', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.addUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image/:id', [md_auth.ensureAuth, md_upload],
 UserController.uploadImage);

module.exports = api;
