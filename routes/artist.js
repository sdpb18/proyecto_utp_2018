'use stric'

// MODULOS
const express = require('express');
const ArtistController = require('../controllers/artist');

// middlewares
const md_auth = require('../middlewares/authenticated');


const api = express.Router();

// Metodos - API
api.get('/artist', md_auth.ensureAuth, ArtistController.getArtist);


// -- Exportacion metodos del api
module.exports = api;
