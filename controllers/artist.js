'use strict'

// --- Modulos
const fs = require('fs');
const path = require('path');

// Modulos - Ficheros
var ArtistModel = require('../models/artist');
var AlbumModel = require('../models/album');
var SongModel = require('../models/song');

// --- Funciones

function getArtist(req,res) {
  res.status(200).send({
    message:'metodo get artista'
  });
}


//  --- Exportacion de modulos

module.exports = {
  getArtist
};
