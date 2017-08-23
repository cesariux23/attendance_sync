// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var czs =io.of('czs')

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/views/index.html');
});

var coordinaciones = {}
var clientes = new Map();
var coords = [];
var test = 'test';

czs.on('connection', function(client) {

    console.log('Client connected...');
    client.on('join', function(data) {
        coordinaciones[data.zona] = client.id;
        clientes.set(client.id, data.zona);
        coords.push(data);
        console.log(coordinaciones);
        client.emit('messages', 'Conectado');
        client.broadcast.emit('online', {coordinaciones});
    });

    client.on('reqZonas', function(data) {
        client.emit('online', {coordinaciones});
    });

    client.on('reqSync', function(data) {
        client.broadcast.to([data]).emit('getLastEvents', new Date());
    });

    client.on('sendAttEvents', function(data) {
        console.log('eventos recibidos: ');
        data.forEach(function(element) {
            console.log(element.user);
            console.log(element.verifyMode);
            console.log(element.date);
        });
    });

    client.on('disconnect', function() {
        cz = clientes.get(client.id);
        if(coordinaciones.hasOwnProperty(cz)){
            //(coordinaciones.delete(cz);
            delete coordinaciones[cz];
        }
        console.log('cliente desconectado: '+cz);
        console.log(coordinaciones);
        coords=coords.splice(coords.lastIndexOf(cz),1);
        client.broadcast.emit('online',{coordinaciones});
    });
});




server.listen(4200);  