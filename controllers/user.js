'use strict'

var bcrypt = require('bcrypt-nodejs');
var UserModel = require('../models/user');
var jwt = require('../services/jwt');


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

module.exports = {
  pruebas,
  addUser,
  loginUser,
  updateUser
};
