'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombre: String,
    descripcion: String,

    estado: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('Categoria', CategoriaSchema);