'use strict'

var express = require('express');
var ArtistController = require('../controllers/artista');
var api = express.Router();
var md_auth = require('../middelwares/autenticacion');

var multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: './uploads/artistas' });

api.get('/artista/:id', md_auth.ensureAuth, ArtistController.getArtista);
api.post('/artista', md_auth.ensureAuth, ArtistController.saveArtista);
api.get('/artistas/:desde?/:limite?', md_auth.ensureAuth, ArtistController.getArtistas);
api.put('/artista/:id', md_auth.ensureAuth, ArtistController.updateArtista);
api.delete('/artista/:id', md_auth.ensureAuth, ArtistController.deleteArtista);
api.post('/upload/artista/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImagen);
api.get('/imagen/artista/:imageFile', ArtistController.getImagenFile);


module.exports = api;