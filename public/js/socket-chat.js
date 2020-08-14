var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre')||!params.has('sala')){
    window.location = "index.html";
    throw new Error('El nombre es necesario')
}

var usuario = {
    nombre : params.get('nombre'),
    sala : params.get('sala')
}

socket.on('connect', function() {
    socket.emit('entrarChat',usuario,function(resp){
        console.log("Usuarios conectados a la sala",resp)
    })
});

// Enviar información
// socket.emit('crear', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(resp) {

    console.log('Servidor:', resp);

});

// Escuchar información
socket.on('listaPersona', function(usuarios) {

    console.log(usuarios);

});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {

    console.log(mensaje);

});