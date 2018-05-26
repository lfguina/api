'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artista = require('../models/artista');
var Album = require('../models/album');
var Musica = require('../models/musica');

//obtener musica x id
function getMusica(req, res) {
    var songId = req.params.id;

    Musica.findById(songId).populate({ path: 'album' }).exec((err, song) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error en la petición' });
        } else {
            if (!song) {
                res.status(400).send({ ok: false, message: 'La canción no existe' });
            } else {
                res.status(200).send({ ok: true, musica: song });
            }
        }

    });
}


function buscarMusica(req, res) {
    //trae todas las musicas
    //populate : categoria
    //paginado
    let termino = req.params.termino;
    //expresion regular
    let regex = new RegExp(termino, 'i');
    Musica.find({ estado: true, nombre: regex })
        //.populate('categoria', 'nombre')
        .exec((err, musicasDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } //finde del if err

            res.send({
                ok: true,
                musicas: musicasDB
            });
        });
}




function saveMusica(req, res) {
    var musica = new Musica();

    var params = req.body;

    musica.numero = params.numero;
    musica.nombre = params.nombre;
    musica.duracion = params.duracion;
    musica.file = null;
    musica.album = params.album;

    musica.save((err, musicaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error en el servidor' });
        } else {
            if (!musicaStored) {
                res.status(404).send({ ok: false, message: 'No se ha guardado en el servidor' });
            } else {
                res.status(200).send({ ok: true, musica: musicaStored });
            }
        }

    });

}
//listar todas las musicas, o listar por album, doble populate, si es doble este
function getMusicas(req, res) {
    var albumId = req.params.album;
    if (!albumId) {
        var find = Musica.find({ estado: true }).sort('numero');
    } else {
        var find = Musica.find({ album: albumId, estado: true }).sort('numero');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artista',
            model: 'Artista'
        }
    }).exec(function(err, musicas) {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error en el servidor' });
        } else {

            if (!musicas) {
                res.status(404).send({ ok: false, message: 'No hay canciones' });
            } else {
                res.status(200).send({ ok: true, musicas });
            }
        }
    });
}

function updateMusica(req, res) {
    var musicaId = req.params.id;
    var update = req.body;

    Musica.findByIdAndUpdate(musicaId, update, { new: true }, (err, musicaUpdated) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error en el servidor' });
        } else {

            if (!musicaUpdated) {
                res.status(400).send({ ok: false, message: 'No se ha actulizado la canción' });
            } else {
                res.status(200).send({ ok: true, musica: musicaUpdated });
            }
        }
    });
}

function deleteMusica(req, res) {
    let id = req.params.id;
    //Usuario.findByIdAndRemove(id,(err, usuarioBD)=>{
    let updateEstado = {
        estado: false
    }
    Musica.findByIdAndUpdate(id, updateEstado, { new: true }, (err, musicaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } //fin del if el error

        if (!musicaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Musica no encontrado'
                }
            });
        } //fin del if para validar usuario vacio en eliminacion

        res.json({
            ok: true,
            musica: musicaBD
        })

    });
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];
        if (file_ext == 'mp3' || file_ext == 'ogg') {
            Musica.findByIdAndUpdate(songId, { file: file_name }, { new: true }, (err, songUpated) => {
                if (err) {
                    res.status(500).send({ ok: false, message: 'Error al actualizar la canción' });
                } else {
                    if (!songUpated) {
                        res.status(404).send({ ok: false, message: 'No se ha podido actualizar la canción' });
                    } else {
                        res.status(200).send({ ok: true, musica: songUpated });
                    }
                }
            });
        } else {
            res.status(400).send({ ok: false, message: 'Extensión del archivo invalida' });
        }
    } else {
        res.status(400).send({ ok: false, message: 'No has subido el fichero de audio' });
    }
}

function getMusicaFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/musicas/' + songFile;
    fs.exists(path_file, function function_name(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe el archivo de audio' });
        }
    });
}




function getMusicasArtista(req, res) {
    var artista_id = req.params.artista_id;
    Artista.find({ estado: true, _id: artista_id })
        .exec((err, artistaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } //finde del if err

            Album.find({ estado: true, artista: artistaDB[0]._id })
                .exec((err, albumDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    } //finde del if err
                    Musica.find({ estado: true, album: albumDB[0]._id })
                        .exec((err, musicaDB) => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
                                    err
                                });
                            } //finde del if err

                            res.send({
                                ok: true,
                                musicas: musicaDB
                            });
                        });


                });
        });
}


function buscarTermino(req, res) {

    let termino = req.params.termino;
    //expresion regular
    let regex = new RegExp(termino, 'i');
    Musica.find({ estado: true, nombre: regex })
        // .populate('categoria','nombre')
        .exec((err, musicasDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } //finde del if err

            res.json({
                ok: true,
                musicas: musicasDB
            });
        });


}


function buscarMusicaXAlbum(req, res) {

    let termino = req.params.album;
    //expresion regular
    //let regex = new RegExp(termino, 'i');
    Musica.find({ estado: true, album: termino })
        .populate('album', 'titulo artista imagen')
        .exec((err, musicasDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } //finde del if err

            res.send({
                musicas: musicasDB
            });
        });


}



module.exports = {
    getMusica,
    saveMusica,
    getMusicas,
    updateMusica,
    deleteMusica,
    uploadFile,
    getMusicaFile,
    buscarMusica,
    getMusicasArtista,
    buscarTermino,
    buscarMusicaXAlbum
}