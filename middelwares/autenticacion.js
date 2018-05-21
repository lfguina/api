'user strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_appmusic';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(400).send({ message: 'Solicitud  no tiene la cabecera de autenticacion' });
    }
    //eliminar comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(400).send({ message: 'El Token ha expirado' });
        }

    } catch (ex) {
        return res.status(400).send({ message: 'Token no valido' });
    }
    req.usuario = payload;

    next();
};