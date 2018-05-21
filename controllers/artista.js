'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artista = require('../models/artista');
var Album = require('../models/album');
var Musica = require('../models/musica');


//obtener x id
function getArtista(req, res) {
    var artistaId = req.params.id;

    Artista.findById(artistaId, (err, artista) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error en la petición' });
        } else {
            if (!artista) {
                res.status(400).send({ ok: false, message: 'El artista no existe' });
            } else {
                res.status(200).send({ ok: true, artista });
            }

        }

    });

}


//obtener todos los artisttas paginados
function getArtistas(req, res) {
    let desde = req.params.desde || 0;
    desde = Number(desde);

    let limite = req.params.limite || 4;
    limite = Number(limite)
    Artista.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, artistaBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } //fin del if el error
            Artista.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    artistas: artistaBD,
                    total: conteo
                });
            });


        });
}

function saveArtista(req, res) {
    var artista = new Artista();
    var params = req.body;
    artista.nombre = params.nombre;
    artista.descripcion = params.descripcion;
    artista.imagen = 'null';

    artista.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error al guardar el artista' });
        } else {
            if (!artistStored) {
                res.status(400).send({ ok: false, message: 'El artista no ha sido guardado' });
            } else {}
            res.status(200).send({ ok: true, artista: artistStored });
        }
    });
}


function updateArtista(req, res) {
    var artistaId = req.params.id;

    var update = req.body;

    Artista.findByIdAndUpdate(artistaId, update, { new: true }, (err, artistUpdated) => {
        if (err) {

            res.status(500).send({ ok: false, message: 'Error al actualizar el artista' });
        } else {
            if (!artistUpdated) {
                res.status(400).send({ ok: false, message: 'El artista no existe' });
            } else {
                res.status(200).send({ ok: true, artista: artistUpdated });
            }
        }

    });
}


function deleteArtista(req, res) {
    var artistId = req.params.id;

    //aki

    let updateEstado = {
        estado: false
    }

    Artista.findByIdAndUpdate(artistId, updateEstado, { new: true }, (err, artistaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } //fin del if el error

        if (!artistaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Artista no encontrado'
                }
            });
        } //fin del if para validar asrtista vacio en eliminacion

        Album.find({ artista: artistaBD._id }).update(updateEstado, (err, albumRemoved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } //fin del if el error

            if (!albumRemoved) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Album no encontrado'
                    }
                });
            } //fin del if para validar usuario vacio en eliminacion

            Musica.find({ album: albumRemoved._id }).update(updateEstado, (err, musicaRemoved) => {
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
                            message: 'Usuario no encontrado'
                        }
                    });
                } //fin del if para validar usuario vacio en eliminacion

                res.status(200).send({ ok: true, artista: artistaBD });

            });

        });



    });

}


function uploadImagen(req, res) {
    var artistId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.imagen.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artista.findByIdAndUpdate(artistId, { imagen: file_name }, { new: true }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ ok: false, message: 'Error al actualizar el artista' });
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({ ok: false, message: 'No se ha podido actualizar el artista' });
                    } else {
                        res.status(200).send({ ok: true, artista: artistUpdated });
                    }
                }
            });
        } else {
            res.status(200).send({ ok: false, message: 'Extensión del archivo invalida' });
        }
        console.log(file_path);
    } else {
        res.status(200).send({ ok: false, message: 'No has subido imagen' });
    }
}

function getImagenFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artistas/' + imageFile;
    fs.exists(path_file, function function_name(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}

module.exports = {
    getArtista,
    saveArtista,
    getArtistas,
    updateArtista,
    deleteArtista,
    uploadImagen,
    getImagenFile
}