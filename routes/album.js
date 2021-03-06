'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middelwares/autenticacion');

var multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: './uploads/albumes' });

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albumes/:artista?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload/album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImagen);
api.get('/imagen/album/:imageFile', AlbumController.getImageFile);

api.get('/album/buscar/:termino', md_auth.ensureAuth, AlbumController.buscarTermino);
//buscar por terminos

api.get('/album/categoria/:categoria', md_auth.ensureAuth, AlbumController.buscarAlbumXCategoria);
//buscar por categorias


module.exports = api;