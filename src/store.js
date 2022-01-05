import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

    state:{
        Sesion:{
            IdUsuario: 0,
            Usuario: false,
            Token: false
        },
        stUsuario: {
            IdUsuario: 0,
            Nombre: '',
            IdDistribuidor: '',
            Rfc: '',
            IdVendedor: '',
            Contacto: '',
            Telefono: '',
            Activo: true,
            Usuario: '',
            Contrasena: '',
            ConfContrasena: '',
            Email: '',
            VerificadorCuenta: '',
            IdTipoUsuario: 0,
            IdSubTipoUsuario: 0,
            IdZona:0,
            OpcRestablecer: 0
        },
        stTicket: {
            IdTicket: 0,
            Nombre: '',
            Motivo: [],
            Titulo: '',
            Guia: '',
            Distribuidor: '',
            NoFactura: '',
            FechaFactura: '',            
            Comentario: '',
            ComentarioDictamen: '',
            ComentarioNC: '',
            Productos: [], 
            DescargarFormatos: '',
            FormatosProducto: [],
            FormatosVenta: [],
            IdUsuarioAsigno: 0,
            IdUsuario:0,
            FechaTicket: '',
            RptCartaFletera: false
        },
        stNotificacion: {
            Value: false,
            Type: '',
            Notificacion: ''
        },
        stAsignacion: {
            IdUsuario: 0,
            IdTipoUsuario: 0,
            Nombre: '',
            IdUsuarioAsigno:0
        }
    },
    mutations:{
        IniciarSesion(state, arSesion){
            state.Sesion.IdUsuario = arSesion.IdUsuario;
            state.Sesion.Usuario = arSesion.Usuario;
            state.Sesion.Token = { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '.concat(arSesion.Token) }};
        },
        CerrarSesion(state){
            state.Sesion.Usuario = false;
            state.Sesion.Token = false;
        },
        LlenaUsuario(state, arUsuario){
            state.stUsuario.IdUsuario = arUsuario.IdUsuario;
            state.stUsuario.Nombre = arUsuario.Nombre;
            state.stUsuario.IdDistribuidor = arUsuario.IdDistribuidor;
            state.stUsuario.Rfc = arUsuario.Rfc;
            state.stUsuario.IdVendedor = arUsuario.IdVendedor;
            state.stUsuario.Contacto = arUsuario.Contacto;
            state.stUsuario.Telefono = arUsuario.Telefono;
            state.stUsuario.Activo = arUsuario.Activo;
            state.stUsuario.Usuario = arUsuario.Usuario;
            state.stUsuario.Contrasena = arUsuario.Contrasena;
            state.stUsuario.ConfContrasena = arUsuario.ConfContrasena;
            state.stUsuario.Email = arUsuario.Email;
            state.stUsuario.IdTipoUsuario = arUsuario.IdTipoUsuario;
            state.stUsuario.IdSubTipoUsuario = arUsuario.IdSubTipoUsuario;
            state.stUsuario.IdZona = arUsuario.IdZona;
        },
        LlenaTicket(state, arTicket){
            state.stTicket.IdTicket = arTicket.IdTicket;
            state.stTicket.Nombre = arTicket.Nombre;
            state.stTicket.Motivo = arTicket.Motivo;
            state.stTicket.Titulo = arTicket.Titulo;
            state.stTicket.Guia = arTicket.Guia;
            state.stTicket.Distribuidor = arTicket.Distribuidor;
            state.stTicket.NoFactura = arTicket.NoFactura;
            state.stTicket.FechaFactura = arTicket.FechaFactura;
            state.stTicket.Comentario = arTicket.Comentario;
            state.stTicket.ComentarioDictamen = arTicket.ComentarioDictamen;
            state.stTicket.ComentarioNC = arTicket.ComentarioNC;
            state.stTicket.Productos = arTicket.Productos;
            state.stTicket.DescargarFormatos = arTicket.DescargarFormatos;
            state.stTicket.FormatosProducto = arTicket.FormatosProducto;
            state.stTicket.FormatosVenta = arTicket.FormatosVenta;
            state.stTicket.FechaTicket = arTicket.FechaTicket;
            state.stTicket.RptCartaFletera = arTicket.RptCartaFletera;
            state.stTicket.IdUsuarioAsigno = arTicket.IdUsuarioAsigno;
            state.stTicket.IdUsuario = arTicket.IdUsuario;
        },
        LlenaNotificacion(state, arNotificacion){            
            state.stNotificacion.Value = arNotificacion.Value,
            state.stNotificacion.Type = arNotificacion.Type,
            state.stNotificacion.Notificacion = arNotificacion.Notificacion
        },
        LlenaAsignacion(state,arAsignacion){
            state.stAsignacion.IdUsuario = arAsignacion.IdUsuario,
            state.stAsignacion.IdTipoUsuario = arAsignacion.IdTipoUsuario,
            state.stAsignacion.Nombre = arAsignacion.Nombre,
            state.stAsignacion.IdUsuarioAsigno = arAsignacion.IdUsuarioAsigno   
        }
    },
    actions:{
        IniciarSesionAccion(context, arSesion){
            context.commit('IniciarSesion', arSesion);
        },
        CerrarSesionAccion(context){
            context.commit('CerrarSesion');
        },
        LlenaUsuarioAccion(context, arUsuario){
            context.commit('LlenaUsuario', arUsuario);
        },
        LlenaTicketAccion(context, arTicket){
            context.commit('LlenaTicket', arTicket);
        },
        LlenaNotiAccion(context, arNotificacion){
            context.commit('LlenaNotificacion', arNotificacion);
        },
        LlenaAsignacionAccion(context, arAsignacion){
            context.commit('LlenaAsignacion',arAsignacion);
        }
    }
    
})