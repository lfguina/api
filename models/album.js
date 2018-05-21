'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    titulo: String,
    descripcion: String,
    year: Number,
    imagen: String,
    estado: {
        type: Boolean,
        default: true
    },
    artista: { type: Schema.ObjectId, ref: 'Artista' }

}, { collection: 'albumes' });

module.exports = mongoose.model('Album', AlbumSchema);