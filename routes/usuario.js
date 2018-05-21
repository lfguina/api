'use strict'

var express = require('express');
var UserController = require('../controllers/usuario');
var md_auth = require('../middelwares/autenticacion');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/usuarios' });


//md_auth.ensureAuth
var api = express.Router();
//ruta para guardar un usuario
api.post('/usuario', UserController.guardarUsuario);
//verificar login
api.post('/login', UserController.loginUsuario);
//actualizar usuario
api.put('/usuario/:id', md_auth.ensureAuth, UserController.updateUser);
//actualizar imagen
api.post('/upload/usuario/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
//visualizar imagen
api.get('/imagen/usuario/:imageFile', UserController.getImageFile);



module.exports = api;