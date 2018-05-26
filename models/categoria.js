'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    descripcion: String,

    estado: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('Categoria', CategoriaSchema);