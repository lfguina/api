'use strict'

var express = require('express');
var CategoriaController = require('../controllers/categoria');
var api = express.Router();
var md_auth = require('../middelwares/autenticacion');

var multipart = require('connect-multiparty');



api.get('/categoria/:id', md_auth.ensureAuth, CategoriaController.getCategoria);
api.post('/categoria', md_auth.ensureAuth, CategoriaController.saveCategoria);
api.get('/categorias/:desde?/:limite?', md_auth.ensureAuth, CategoriaController.getCategorias);
api.put('/categoria/:id', md_auth.ensureAuth, CategoriaController.updateCategoria);
api.delete('/categoria/:id', md_auth.ensureAuth, CategoriaController.deleteCategoria);


api.get('/all/categorias', md_auth.ensureAuth, CategoriaController.getTodosLasCategorias);
//devuelve todos execpto 
api.get('/categoria/buscar/:termino', md_auth.ensureAuth, CategoriaController.buscarTermino);
//buscar por terminos




module.exports = api;