'use strict'

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

// cargar rutas

var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');

// fin rutas

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// configurar cabecera http

// rutas base

app.use('/o/api',user_routes);
app.use('/o/api',artist_routes);
app.use('/o/api',album_routes);

// fin ruta base

module.exports = app;
