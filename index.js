'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.13.139:27017,192.168.13.138:27017,192.168.13.138:27017/rastifyApp?replicaSet=rty0',
(err,res) => {
  if(err){
    throw err;
  } else {
    console.log('se ha establecido la coneccion a la base de datos');

    app.listen(port,
    function() {
      console.log(
        '---- serv de api-rest de musica escuchando en el //localhost:'
        +port+'   ---- \n\n\n');
    });
  }
});
