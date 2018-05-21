'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    email: String,
    password: String,
    rol: String,
    imagen: String,
    estado: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('Usuario', UsuarioSchema);