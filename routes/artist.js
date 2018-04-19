'use stric'

// MODULOS
const express = require('express');
const ArtistController = require('../controllers/artist');
const multipart = require('connect-multiparty');

// middlewares
const md_auth = require('../middlewares/authenticated');
const md_upload = multipart({uploadDir: './uploads/artist'});

const api = express.Router();

// Metodos - API
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/updateArtist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload],
 ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

// -- Exportacion metodos del api
module.exports = api;
