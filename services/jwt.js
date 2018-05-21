'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_appmusic';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        imagen: user.imagen,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }
    return jwt.encode(payload, secret);
}