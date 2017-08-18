// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var czs =io.of('czs')
var coordinaciones = new Map();
var clientes = new Map();

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/views/index.html');
});

czs.on('connection', function(client) {  
    console.log('Client connected...');
    client.on('join', function(data) {
        coordinaciones.set(data.zona, client.id);
        clientes.set(client.id, data.zona);
        console.log(coordinaciones);
        client.emit('messages', 'Hello from server');
    });
    client.on('disconnect', function() {
        cz = clientes.get(client.id);
        if(coordinaciones.has(cz)){
            coordinaciones.delete(cz);
        }
        console.log('cliente desconenctado: '+cz);
        console.log(coordinaciones);
    });
});

server.listen(4200);  