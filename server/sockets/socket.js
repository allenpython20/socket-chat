const { io } = require('../server');
const {crearMensaje} = require('../utilidades/utilidades')
const { Usuarios } = require('../classes/usuarios');


const usuarios = new Usuarios();

io.on('connection', (client) => {
    
    client.on('entrarChat',(data,callback)=>{
        if(!data.nombre||!data.sala){
            return callback({
                err:true,
                mensaje : 'El nombre es necesario'
            })
        }

        client.join(data.sala);/*unir al cliente a una sala con su mismo id,so no se indicia la sala,el usuario se conecta a una global
        //por defecto te conectas a una sala con nombre igual q tu id.eso permite enviar mensaje privado*/
        usuarios.agregarPersona(client.id,data.nombre,data.sala)
        let personasPorSala = usuarios.getPersonasPorSala(data.sala);
        client.broadcast.to(data.sala).emit('listaPersona',personasPorSala)
        callback(personasPorSala)

    })

    client.on('crearMensaje',(data)=>{
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre,data.mensaje)

        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje)
    })

    client.on('disconnect',()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} abandono chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(personaBorrada.sala))
    })

    client.on('mensajePrivado',data =>{
        let persona = usuarios.getPersona(client.id);
        console.log("data" + data.para)
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje))
    })
    

});