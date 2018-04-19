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

function getAlbums(req, res) {
  var artistID = req.params.artist;

  if(!artistID){
    // TODO - buscar todos los albunes
    var find = AlbumModel.find({}).sort('title');

  } else{
    // TODO - buscar los albunes de un artista
    var find = AlbumModel.find({artist:artistID}).sort('year');

  }
  find.populate({path: 'artist'}).exec((err, albums)=>{
    if (err) {
      res.status(500).send({
        message:'Error al consultar los albums'
      });
    } else if(!albums){
      res.status(404).send({
        message:'no hay albums'
      });
    } else {
      res.status(200).send({
        albums: albums
      });
    }
  });
}

function updateAlbum(req, res) {
  var albumID = req.params.id;
  var update = req.body;

  AlbumModel.findByIdAndUpdate(albumID, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({
        message:'Error al consultar los albums'
      });
    } else if(!albumUpdated){
      res.status(404).send({
        message:'no existe album'
      });
    } else {
      res.status(200).send({
        albumUpdated: albumUpdated
      });
    }
  });
}

function deleteAlbum(req, res) {
  var albumID = req.params.id;

  AlbumModel.findByIdAndRemove(albumID,(err, albumRemoved) => {
      if (err) {
        console.log(err);
          res.status(500).send({
              message: 'Error al eliminar album del Artista'
          });
      } else {
          if (!albumRemoved) {
              res.status(404).send({
                  message: 'El album del artista no ha sido eliminado'
              });
          } else {
              res.status(200).send({
                  albumRemoved: albumRemoved
              });

              SongModel.find({
                  artist: albumRemoved._id
              }).remove((err, songRemoved) => {
                  if (err) {
                      res.status(500).send({
                          message: 'Error al eliminar cancion del Artista'
                      });
                  } else {
                      if (!songRemoved) {
                          res.status(404).send({
                              message: 'Las canciones del artista no ha sido eliminadas'
                          });
                      } else {
                          res.status(200).send({
                              album: albumRemoved
                          });
                      }
                  }
              });
          }
      }
  });
}

function uploadImage(req, res) {
    var albumID = req.params.id;
    var file_name = 'imagen no subida ... ';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');

        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            AlbumModel.findByIdAndUpdate(albumID, {
                    image: file_name
                },
                (err, albumUpdated) => {
                    if (!albumUpdated) {
                        res.status(404).send({
                            message: 'No se ha podido actualizar imagen del Artista'
                        });
                    } else {
                        res.status(200).send({
                            album: albumUpdated
                        });
                    }
                });
        } else {
            res.status(200).send({
                message: 'Archivo con extencion no valida  '
            });
        }
    } else {
        res.status(200).send({
            message: 'no hay imagen actualmente '
        });
    }
}

function getImageFile(req,res) {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/albums/'+imageFile

  fs.exists(path_file, (exists)=> {
    if(!exists){
      res.status(404).send({
        message: 'Imagen no existe '
      });
    } else {
      res.sendFile(path.resolve(path_file));
    }
  });
}

//  --- Exportacion de modulos

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};
