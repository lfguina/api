'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistaSchema = Schema({
    nombre: String,
    descripcion: String,
    imagen: String,
    estado: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('Artista', ArtistaSchema);