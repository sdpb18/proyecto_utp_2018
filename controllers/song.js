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

function getSong(req, res) {
  var songID = req.params.id;

  SongModel.findById(songID).populate({path: 'album'}).exec((err, song) =>{
    if (err) {
      res.status(500).send({
        message:'Error al consultar la cancion'
      });
    } else if(!song){
      res.status(404).send({
        message:'la cancion no existe'
      });
    } else {
      res.status(200).send({
        song: song
      });
    }
  });

}

function saveSong(req, res) {
  var song = new SongModel();
  var params = req.body;

  song.name = params.name;
  song.number = params.number;
  song.duration = params.duration;
  song.album = params.album;
  song.file = null;
  song.image = null;

  song.save((err, songStored) => {
    if (err) {
      res.status(500).send({
        message:'Error al guardar la cancion'
      });
    } else if(!songStored){
      res.status(404).send({
        message:'la cancion no ha sido guardada'
      });
    } else {
      res.status(200).send({
        song: songStored
      });
    }
  });
}

function getSongs(req, res) {
    var albumID = req.params.album;

    if (!albumID) {
        // TODO - buscar todos las canciones
        var find = SongModel.find({}).sort('number');

    } else {
        // TODO - buscar los albunes de una cancion
        var find = SongModel.find({
            album: albumID
        }).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({
                message: 'Error al consultar las canciones'
            });
        } else if (!songs) {
            res.status(404).send({
                message: 'no hay canciones'
            });
        } else {
            res.status(200).send({
                songs: songs
            });
        }
    });
}

function updateSong(req, res) {
  var songID = req.params.id;
  var update = req.body;

  SongModel.findByIdAndUpdate(songID, update, (err, songUpdated) => {
    if (err) {
      res.status(500).send({
        message:'Error al consultar la cancion'
      });
    } else if(!songUpdated){
      res.status(404).send({
        message:'no existe cancion'
      });
    } else {
      res.status(200).send({
        songUpdated: songUpdated
      });
    }
  });
}

function deleteSong(req, res) {
  var songID = req.params.id;

  SongModel.findByIdAndRemove(songID, (err, songRemoved)=>{
    if (err) {
      res.status(500).send({
        message:'Error al consultar la cancion'
      });
    } else if(!songRemoved){
      res.status(404).send({
        message:'no existe cancion'
      });
    } else {
      res.status(200).send({
        songRemoved: songRemoved
      });
    }
  });
}

function uploadFile(req, res) {
    var songID = req.params.id;
    var file_name = 'imagen no subida ... ';

    if (req.files) {
        var file_path = req.files.song.path;
        var file_split = file_path.split('/');

        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'mp3') { console.log(songID);
            SongModel.findByIdAndUpdate(songID, {
                    file: file_name
                },
                (err, songUpdated) => {
                    if (!songUpdated) {
                        res.status(404).send({
                            message: 'No se ha podido actualizar el audio'
                        });
                    } else {
                        res.status(200).send({
                            song: songUpdated
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
            message: 'no hay canciones actualmente '
        });
    }
}

function getSongFile(req,res) {
  var songFile = req.params.songFile;
  var path_file = './uploads/songs/'+songFile

  fs.exists(path_file, (exists)=> {
    if(!exists){
      res.status(404).send({
        message: 'cancion no existe '
      });
    } else {
      res.sendFile(path.resolve(path_file));
    }
  });
}

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
}
