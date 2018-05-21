'user strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/appmusic', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('La conexión a la base de datos esta corrriendo correctamente');

        app.listen(port, function() {

            console.log("Servidor del api rest de musica escuchando en http://localhost:" + port)
        });
    }
});