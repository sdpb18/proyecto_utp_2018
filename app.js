'use strict'

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

// cargar rutas

var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

// fin rutas

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// configurar cabecera http
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
          'Autorization, X-API-KEY,X-Requested-With, Origin, Content-Type, Accepy, Acces - Control - Allow - Request - Method ');
          res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE'); res
          .header('Allow', 'GET,POST,OPTIONS,PUT,DELETE');

   next();
});
// rutas base

app.use('/o/api',user_routes);
app.use('/o/api',artist_routes);
app.use('/o/api',album_routes);
app.use('/o/api',song_routes);

// fin ruta base

module.exports = app;
