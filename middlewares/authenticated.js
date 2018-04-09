'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta'

exports.ensureAuth = function(req,res,next) {

  console.log(123, req.headers);
  if(!req.headers.authorization){
    console.log("sii entra");
    return res.status(403).send({
      message: 'La peticion carece de cabecera de autentificacion'
    });
    console.log(567, req.headers.authorization);
    var token = req.headers.authorization.replace(/[''""]+/g,'');
    console.log("TKn:   " + token);
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
}
