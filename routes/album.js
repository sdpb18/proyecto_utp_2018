'use stric'

// MODULOS
const express = require('express');
const AlbumController = require('../controllers/album');
const multipart = require('connect-multiparty');

// middlewares
const md_auth = require('../middlewares/authenticated');
const md_upload = multipart({uploadDir: './uploads/album'});

const api = express.Router();

// Metodos - API
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/saveAlbum/', md_auth.ensureAuth, AlbumController.saveAlbum);

// -- Exportacion metodos del api
module.exports = api;
