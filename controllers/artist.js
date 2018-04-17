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

function getArtists(req, res) {
  var page = 1;
  var itemsPerPage = 3;
  if (req.params.page) page = req.params.page;

  ArtistModel.find().sort('name').paginate(page, itemsPerPage,
    (err, artists, total) => {
      if (err) {
        res.status(500).send({
          message:'Error en la peticion'
        });
      } else {
        if (!artists) {
          res.status(404).send({
            message:'No hay artistas disponibles'
          });
        } else {
          return res.status(200).send({
            total_items: total,
            artists: artists
          });
        }
      }
    });
}

function updateArtist(req, res) {
  var artistID = req.params.id;
  var update = req.body;

  ArtistModel.findByIdAndUpdate(artistID, update,
  (err, artistUpdated) =>{
    if (err) {
      res.status(500).send({
        message:'Error al actualizar artista'
      });
    } else {
      if (!artistUpdated) {
        res.status(404).send({
          message:'El artista no ha sido actualizado'
        });
      } else {
        res.status(200).send({
          artis: artistUpdated
        });
      }
    }
  });
}

function deleteArtist(req, res) {
    var artistID = req.params.id;
    ArtistModel.findByIdAndRemove(artistID, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({
                message: 'Error al eliminar Artista'
            });
        } else {
            if (!artistRemoved) {
                res.status(404).send({
                    message: 'El artista no ha sido eliminado'
                });
            } else {
                res.status(200).send({
                    artis: artistRemoved
                });

                AlbumModel.find({
                    artist: artistRemoved._id
                }).remove((err, albumRemoved) => {
                    if (err) {
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
                                artis: albumRemoved
                            });

                            SongModel.find({
                                artist: artistRemoved._id
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
                                            artis: songRemoved
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'imagen no subida ... ';

    if (req.files) {
      console.log(123,req.files);
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');

        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            ArtistModel.findByIdAndUpdate(artistId, {
                    image: file_name
                },
                (err, artistUpdated) => {
                    if (!artistUpdated) {
                        res.status(404).send({
                            message: 'No se ha podido actualizar imagen del Artista'
                        });
                    } else {
                        res.status(200).send({
                            artist: artistUpdated
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
  var path_file = './uploads/artist/'+imageFile

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
  getArtist,
  getArtists,
  saveArtist,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
