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
  var artistID = req.params.id;

  ArtistModel.findById(artistID, (err, artist) =>{
    if (err) {
      res.status(500).send({
        message:'Error al consultar el artista'
      });
    } else {
      if(!artist){
        res.status(404).send({
          message:'artista no existe'
        });
      } else {
        res.status(200).send({
          artist: artist
        });
      }
    }
  });

}

function saveArtist(req,res) {
  var artist = new ArtistModel();
  var params = req.body;

  artist.name = params.name;
  artist.description = params.description;
  artist.image = null;

  artist.save((err, artistStored) =>{
    if (err) {
      res.status(500).send({
        message:'Error al guardar el artista'
      });
    } else if(!artistStored){
      res.status(404).send({
        message:'artista no ha sido guardado'
      });
    } else {
      res.status(200).send({
        artist: artistStored
      });
    }
  });
}


//  --- Exportacion de modulos

module.exports = {
  getArtist,
  saveArtist
};
