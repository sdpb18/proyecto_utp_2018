'use stric'
// MODULOS
const express = require('express');
const UserController = require('../controllers/user');
const multipart = require('connect-multiparty');

// middlewares
const md_auth = require('../middlewares/authenticated');
const md_upload = multipart({uploadDir: './uploads/users'});

const api = express.Router();

// Metodos - API
api.get('/prueba-cont', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.addUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload],
 UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

// -- Exportacion metodos del api
module.exports = api;
