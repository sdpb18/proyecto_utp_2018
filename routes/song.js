'use stric'

// MODULOS
const express = require('express');
const SongController = require('../controllers/song');
const multipart = require('connect-multiparty');

// middlewares
const md_auth = require('../middlewares/authenticated');
const md_upload = multipart({uploadDir: './uploads/songs'});

const api = express.Router();

// Metodos - API
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/updateSong/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/deleteSong/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-song/:id', [md_auth.ensureAuth, md_upload],
 SongController.uploadFile);
api.get('/get-song/:songFile', SongController.getSongFile);

// -- Exportacion metodos del api
module.exports = api;
