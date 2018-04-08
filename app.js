'use strict'

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

// cargar rutas

var user_routes = require('./routes/user');

// fin rutas

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// configurar cabecera http

// rutas base

app.use('/o/api',user_routes);

// fin ruta base

module.exports = app;
