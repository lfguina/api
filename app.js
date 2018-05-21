'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// rutas
var usuario_routes = require('./routes/usuario');
var artista_routes = require('./routes/artista');
var albumes_routes = require('./routes/album');
var musicas_routes = require('./routes/musica');





app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cabeceras http
app.use((req, res, next) => {
    //acceso al dominio
    res.header('Access-Control-Allow-Origin', '*');
    //acceso 
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    //permitir metodos http
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// rutas base
app.use('/api', usuario_routes);
app.use('/api', artista_routes);
app.use('/api', albumes_routes);
app.use('/api', musicas_routes);





module.exports = app;