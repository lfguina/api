'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artista = require('../models/artista');
var Album = require('../models/album');
var Musica = require('../models/musica');

//obtener x id
function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({ path: 'artista' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error en la petición' });
        } else {
            if (!album) {
                res.status(404).send({ ok: false, message: 'El album no existe' });
            } else {
                res.status(200).send({ ok: true, album });
            }
        }
    });

}

//obtener todos los albumes y obtener x artista
function getAlbums(req, res) {
    var artistaId = req.params.artista;

    if (!artistaId) {
        //sacar todos los albums de la base de datos
        var find = Album.find({ estado: true }).sort('titulo');
    } else {
        //sacar los albums de un artista concreto en la bbdd
        var find = Album.find({ artista: artistaId, estado: true }).sort('year');
    }

    find.populate({ path: 'artista' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error en la petición' });
        } else {
            if (!albums) {
                res.status(404).send({ ok: false, message: 'No hay albums' });

            } else {

                res.status(200).send({ ok: true, albums });
            }
        }

    });
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.titulo = params.titulo;
    album.descripcion = params.descripcion;
    album.year = params.year;
    album.imagen = 'null';
    album.artista = params.artista;
    album.categoria = params.categoria;
    album.save((err, albumStored) => {

        if (err) {
            res.status(500).send({ ok: false, message: 'Error en el servidor' });
        } else {
            if (!albumStored) {
                res.status(404).send({ ok: false, message: 'No se ha guardado el album' });
            } else {
                res.status(200).send({ ok: true, album: albumStored });
            }

        }
    });
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, { new: true }, (err, albumUpdated) => {

        if (err) {
            res.status(500).send({ ok: false, message: 'Error en el servidor' });
        } else {
            if (!albumUpdated) {
                res.status(404).send({ ok: false, message: 'No se ha actualizado el album' });
            } else {
                res.status(200).send({ ok: true, album: albumUpdated });
            }

        }
    });

}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    //aki

    let updateEstado = {
        estado: false
    }

    Album.findByIdAndUpdate(albumId, updateEstado, { new: true }, (err, albumBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } //fin del if el error

        if (!albumBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Artista no encontrado'
                }
            });
        } //fin del if para validar asrtista vacio en eliminacion



        Musica.find({ album: albumBD._id }).update(updateEstado, (err, musicaRemoved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } //fin del if el error

            if (!musicaRemoved) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Musica no encontrado'
                    }
                });
            } //fin del if 

            res.status(200).send({ ok: true, album: albumBD });


        });



    });

}

function uploadImagen(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.imagen.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, { imagen: file_name }, { new: true }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ ok: false, message: 'Error al actualizar el usuario' });
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({ ok: false, message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({ ok: true, album: albumUpdated });
                    }
                }
            });
        } else {
            res.status(200).send({ ok: false, message: 'Extensión del archivo invalida' });
        }
    } else {
        res.status(200).send({ ok: false, message: 'No has subidoninguna imagen' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albumes/' + imageFile;
    fs.exists(path_file, function function_name(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}

function buscarTermino(req, res) {

    let termino = req.params.termino;
    //expresion regular
    let regex = new RegExp(termino, 'i');
    Album.find({ estado: true, titulo: regex })
        // .populate('categoria','nombre')
        .exec((err, albumDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } //finde del if err

            res.json({
                ok: true,
                albumes: albumDB
            });
        });


}

function buscarAlbumXCategoria(req, res) {

    let termino = req.params.categoria;
    //expresion regular
    //let regex = new RegExp(termino, 'i');
    Album.find({ estado: true, categoria: termino })
        .populate('artista', 'nombre descripcion imagen')
        .exec((err, albumDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } //finde del if err

            res.json({
                ok: true,
                albumes: albumDB
            });
        });


}

module.exports = {

    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImagen,
    getImageFile,
    buscarTermino,
    buscarAlbumXCategoria
}