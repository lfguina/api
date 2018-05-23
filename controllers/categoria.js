'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artista = require('../models/artista');
var Album = require('../models/album');
var Musica = require('../models/musica');
var Categoria = require('../models/categoria');


//obtener x id
function getCategoria(req, res) {
    var categoriaId = req.params.id;

    Categoria.findById(categoriaId, (err, categoria) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error en la petición' });
        } else {
            if (!categoria) {
                res.status(400).send({ ok: false, message: 'La categoria no existe' });
            } else {
                res.status(200).send({ ok: true, categoria });
            }

        }

    });

}


//obtener todos los artisttas paginados
function getCategorias(req, res) {
    let desde = req.params.desde || 0;
    desde = Number(desde);

    let limite = req.params.limite || 4;
    limite = Number(limite)
    Categoria.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, categoriaBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } //fin del if el error
            Categoria.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria: categoriaBD,
                    total: conteo
                });
            });


        });
}

function getTodosLasCategorias(req, res) {

    Categoria.find({ estado: true })

    .exec((err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } //fin del if el error
        res.json({
            ok: true,
            categorias: categoriaBD,

        });

    });
}


function saveCategoria(req, res) {
    var categoria = new Categoria();
    var params = req.body;
    categoria.nombre = params.nombre;
    categoria.descripcion = params.descripcion;

    categoria.save((err, categoriaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error al guardar el artista' });
        } else {
            if (!categoriaStored) {
                res.status(400).send({ ok: false, message: 'La categoria no ha sido guardado' });
            } else {}
            res.status(200).send({ ok: true, categoria: categoriaStored });
        }
    });
}


function updateCategoria(req, res) {
    var categoriaId = req.params.id;

    var update = req.body;

    Categoria.findByIdAndUpdate(categoriaId, update, { new: true }, (err, categoriatUpdated) => {
        if (err) {

            res.status(500).send({ ok: false, message: 'Error al actualizar la categoria' });
        } else {
            if (!categoriatUpdated) {
                res.status(400).send({ ok: false, message: 'El artista no existe' });
            } else {
                res.status(200).send({ ok: true, categoria: categoriatUpdated });
            }
        }

    });
}


function deleteCategoria(req, res) {
    var categoriaId = req.params.id;

    //aki

    let updateEstado = {
        estado: false
    }

    Categoria.findByIdAndUpdate(categoriaId, updateEstado, { new: true }, (err, caregoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } //fin del if el error

        if (!caregoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        } //fin del if para validar asrtista vacio en eliminacion
        res.status(200).send({ ok: true, categoria: categoriatDB });




    });

}

function buscarTermino(req, res) {

    let termino = req.params.termino;
    //expresion regular
    let regex = new RegExp(termino, 'i');
    Categoria.find({ estado: true, nombre: regex })
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





module.exports = {
    getCategoria,
    saveCategoria,
    getCategorias,
    updateCategoria,
    deleteCategoria,
    buscarTermino,
    getTodosLasCategorias
}