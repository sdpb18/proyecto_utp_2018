'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta'

exports.ensureAuth = function(req,res,next) {

  if(!req.headers.authorization){
    return res.status(403).send({
      message: 'La peticion carece de cabecera de autentificacion'
    });
  }
    var token = req.headers.authorization.replace(/[''""]+/g,'');
    try {
      var payload = jwt.decode(token,secret);
      if (payload.exp <= moment().unix()) {
        res.status(401).send({
          message: 'Token Expirado'
        });
      }
    } catch (e) {
      console.log(e);
      res.status(403).send({
        message: 'Token no valido'
      });
    }
    req.user = payload;
    next();

}
