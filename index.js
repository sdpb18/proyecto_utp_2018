'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/proyUTP',
(err,res) => {
  if(err){
    throw err;
  } else {
    console.log('se ha establecido la coneccion a la base de datos');

    app.listen(port,
    function() {
      console.log(
        'serv de api-rest de musica escuchando en el //localhost:'+port);
    });
  }
});
