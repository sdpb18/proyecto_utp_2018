'use strict'

// --- Modulos
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

// Modulos - Ficheros
var ArtistModel = require('../models/artist');
var AlbumModel = require('../models/album');
var SongModel = require('../models/song');

// --- Funciones

function getAlbum(req,res) {
  var albumID = req.params.id;

  AlbumModel.findById(albumID).populate({path: 'artist'}).exec((err, album) =>{
    if (err) {
      res.status(500).send({
        message:'Error al consultar el album'
      });
    } else {
      if(!album){
        res.status(404).send({
          message:'album no existe'
        });
      } else {
        res.status(200).send({
          album: album
        });
      }
    }
  });

}

function saveAlbum(req, res) {
  var album = new AlbumModel();
  var params = req.body;

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.artist = params.artist;
  album.image = null;

album.save((err, albumStored) => {
  if (err) {
    res.status(500).send({
      message:'Error al guardar el album'
    });
  } else if(!albumStored){
    res.status(404).send({
      message:'el album no ha sido guardado'
    });
  } else {
    res.status(200).send({
      album: albumStored
    });
  }
});
}

//  --- Exportacion de modulos

module.exports = {
  getAlbum,
  saveAlbum
};
