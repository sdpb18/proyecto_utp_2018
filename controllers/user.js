'use strict'

// --- Modulos
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');

// Modulos - Ficheros
var UserModel = require('../models/user');
var jwt = require('../services/jwt');

// --- Funciones

function pruebas(req,res) {
  res.status(200).send({
    message: 'controlador funciona'
  });
}

function addUser(req,res) {
  var user = new UserModel();
  var params = req.body;

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_USER';
  user.image = 'null';

  if(params.password){
    //encriptacion va aqui
    bcrypt.hash(params.password, null, null, function(err, hash){
      user.password = hash;
      if(user.name != null && user.surname != null && user.email != null){
        //guadar usuario
        user.save((err,userStored) => {
          if(err){
            res.status(500).send({
              message:'Error al guardar usuario'
            });
          } else {
            if(!userStored){
              res.status(404).send({
                message:'No se ha registrado el Usuario'
              });
            }else {
              res.status(200).send({
                user:userStored
              });
            }
          }
        })
      } else {
        res.status(200).send({
          message:'Complete el Formulario'
        });
      }
    });
  } else {
    res.status(200).send({
      message:'Introduce el password'
    });
  }

}

function loginUser(req,res) {
  var params = req.body;

  var email = params.email;
  var password = params.password;

  UserModel.findOne({email: email.toLowerCase()}, (err,user) => {
    if(err){
      res.status(500).send({
        message:'Error en la peticion'
      });
    } else {
      if(!user){
        res.status(404).send({
          message:'El Usuario no existe'
        });
      } else {
        //Comprobar password
        bcrypt.compare(password, user.password, (err,check) =>{
          console.log(check);
          if(check){
            // devolver usuario loggeado
            if(params.gethash){
              // devover token jwt
              res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              res.status(200).send({
                user
              });
            }
          } else {
            res.status(404).send({
              message:'Error al intentar loggearse a la aplicacion'
            });
          }
        });
      }
    }
  })
}

function updateUser(req,res) {
  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if(err){
      res.status(500).send({
        message:'Error al intentar actualizar el Usuario'
      });
    } else if(!userUpdated){
        res.status(404).send({
          message:'No se ha podido actualizar el usuario'
        });
    } else {
      res.status(200).send({
        user: userUpdated
      });
    }
  });
}

function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = 'imagen no subida ... ';

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');

    var file_name = file_split[2];
    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      UserModel.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>{
        if (!userUpdated){
            res.status(404).send({
              message:'No se ha podido actualizar imagen del usuario'
            });
        } else {
          res.status(200).send({
            image: file_name,
            user: userUpdated
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
  var path_file = './uploads/users/'+imageFile

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
  pruebas,
  addUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
