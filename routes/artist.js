'use stric'

// MODULOS
const express = require('express');
const ArtistController = require('../controllers/artist');

// middlewares
const md_auth = require('../middlewares/authenticated');


const api = express.Router();

// Metodos - API
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/updateArtist/:id', md_auth.ensureAuth, ArtistController.updateArtist);

// -- Exportacion metodos del api
module.exports = api;
