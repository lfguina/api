'use strict'

var fs = require('fs');
var path = require('path');

var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');


function guardarUsuario(req, res) {
    var usuario = new Usuario();
    var params = req.body;
    //console.log(params);

    usuario.nombre = params.nombre;
    usuario.apellido = params.apellido;
    usuario.email = params.email;
    usuario.rol = params.rol;
    usuario.imagen = 'null';

    if (params.password) {
        bcrypt.hash(params.password, null, null, function(err, hash) {
            usuario.password = hash;

            if (usuario.nombre != null && usuario.apellido != null && usuario.email != null) {
                //Guardar el usuario
                usuario.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({
                            ok: false,
                            message: 'Error al guardar el usuario'
                        });
                    } else {
                        if (!userStored) {
                            res.status(400).send({
                                ok: false,
                                message: 'No se ha registrado el usuario'
                            });
                        } else {
                            res.status(200).send({
                                ok: true,
                                usuario: userStored
                            });
                        }
                    }
                });
            } else {
                res.status(400).send({
                    ok: false,
                    message: 'Rellena todos los campos'
                });
            }
        });
    } else {
        res.status(400).send({
            ok: false,
            message: 'Introduce la contraseña'
        });
    }


} //fin guardar


function loginUsuario(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    // return;
    if (email == null || password == null) {
        return res.status(400).send({
            ok: false,
            message: ' El usuario no ha podido loguearse'
        });
    }
    Usuario.findOne({
            email: email.toLowerCase(),
            estado:true
        },
        (err, user) => {
            if (err) {
                res.status(500).send({
                    ok: false,
                    message: 'Error en la peticion'
                });
            } else {
                if (!user) {
                    res.status(400).send({ ok: false, message: 'Usuario o password incorrectos!' });
                } else {
                    bcrypt.compare(password, user.password, function(err, check) {

                        if (check) {
                           
                                //devolver un token jwt
                                return res.status(200).send({
                                    ok: true,
                                    usuario:user,
                                    token: jwt.createToken(user),
                                })

                             

                        } else {
                            res.status(400).send({ ok: false, message: 'Usuario o password incorrectos!' });
                        }
                    });
                }
            }
        }
    );

}

function updateUser(req, res) {
    var userID = req.params.id;
    var update = req.body;

    //comprueba que sea el mismo usuario el que desa modificar
    //if (userID != req.usuario.sub) {
    //    return res.status(500).send({ message: 'Sin permiso para actualizar este usuario' });
    // }


    Usuario.findByIdAndUpdate(userID, update, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ ok: false, message: 'Error al actualizar el usuario' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ ok: false, message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ ok: true, usuario: userUpdated });
            }
        }

    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'Sin data';

    if (req.files) {
        var file_path = req.files.imagen.path;
        var file_split = file_path.split('\\');
        //saca el nombre con la ext
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Usuario.findByIdAndUpdate(userId, { imagen: file_name }, { new: true }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ ok: false, message: 'Existe un error al actualizar el usuario' });
                } else {
                    if (!userUpdated) {
                        res.status(400).send({ ok: false, message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({ ok: true, imagen: file_name, usuario: userUpdated });
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'Extensión del archivo invalida' });
        }
    } else {
        res.status(200).send({ message: 'No se subio ninguna imagen' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/usuarios/' + imageFile;
    fs.exists(path_file, function function_name(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'La pick no existe' });
        }
    });
}


module.exports = {
    guardarUsuario,
    loginUsuario,
    updateUser,
    uploadImage,
    getImageFile

};