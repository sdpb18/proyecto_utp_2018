'use stric'

// MODULOS
const express = require('express');
const AlbumController = require('../controllers/album');
const multipart = require('connect-multiparty');

// middlewares
const md_auth = require('../middlewares/authenticated');
const md_upload = multipart({uploadDir: './uploads/albums'});

const api = express.Router();

// Metodos - API
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/saveAlbum/', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/updateAlbum/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-albums/:id', [md_auth.ensureAuth, md_upload],
 AlbumController.uploadImage);
api.get('/get-image-albums/:imageFile', AlbumController.getImageFile);

// -- Exportacion metodos del api
module.exports = api;
