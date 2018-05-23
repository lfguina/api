'use strict'

var express = require('express');
var MusicaController = require('../controllers/musica');
var api = express.Router();
var md_auth = require('../middelwares/autenticacion');

var multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: './uploads/musicas' });

api.get('/musica/:id', md_auth.ensureAuth, MusicaController.getMusica);
//busca por terminoss
api.get('/musica/buscar/:termino', md_auth.ensureAuth, MusicaController.buscarTermino);
//buscar por terminos//nuevo solo musicas de un artista
api.get('/musicas/only/:artista_id', md_auth.ensureAuth, MusicaController.getMusicasArtista);

api.post('/musica', md_auth.ensureAuth, MusicaController.saveMusica);
api.get('/musicas/:album?', md_auth.ensureAuth, MusicaController.getMusicas);
api.put('/musica/:id', md_auth.ensureAuth, MusicaController.updateMusica);
api.delete('/musica/:id', md_auth.ensureAuth, MusicaController.deleteMusica);
api.post('/upload/musica/:id', [md_auth.ensureAuth, md_upload], MusicaController.uploadFile);
api.get('/get/musica/:songFile', MusicaController.getMusicaFile);



module.exports = api;