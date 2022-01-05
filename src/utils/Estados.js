import axios from 'axios';
import { ToFile } from '@/utils/Imagenes'


export const Sesion = (IniciarSesionAccion, idUsuario, usuario, token) => {    
    IniciarSesionAccion
    ({
        IdUsuario: idUsuario, 
        Usuario: usuario, 
        Token: token
    })
}


export const Usuario = (usuario, token, LlenaUsuarioAccion, CerrarSesionAccion) => {
    axios.get(process.env.VUE_APP_RUTA_API + '/api/usuarios/consultar-usuario/' + usuario, token)
        .then(response => {
            //console.log(response);
            if(response.status == 200){
                LlenaUsuarioAccion
                    ({
                        IdUsuario: response.data.IdUsuario,
                        Nombre: response.data.Nombre,
                        IdDistribuidor: response.data.IdDistribuidor,
                        Rfc: response.data.Rfc,
                        Email: response.data.Email,
                        IdVendedor: response.data.IdVendedor,
                        Contacto: response.data.Contacto,
                        Telefono: response.data.Telefono,
                        Activo: response.data.Activo,
                        Usuario: response.data.Usuarioo,
                        VerificadorCuenta: response.data.VerificadorCuenta,
                        IdTipoUsuario: response.data.IdTipoUsuario,
                        IdSubTipoUsuario: response.data.IdSubTipoUsuario,
                        IdZona: response.data.IdZona,
                        Contrasena: response.data.Contrasena,
                        ConfContrasena: response.data.Contrasena
                    })
            }
        })
        .catch(error => {
            console.log(error.response.status + ' - ' + error.response.statusText + ' - ' + 'Se ha producido un error.')
            CerrarSesionAccion();
        });
}


export const Ticket = (idTicket, token, LlenaTicketAccion, CerrarSesionAccion) => {
    axios.get(process.env.VUE_APP_RUTA_API + '/api/tickets/consultar-ticket/' + idTicket, token)
        .then(response => {
            //console.log(response);
            if(response.status == 200){
                let arProductos = [];
                response.data.TicketDetalle.forEach(v => {
                    arProductos.push({ Producto: v.Producto, Cantidad: v.Cantidad, Descripcion: v.Descripcion, Motivo: v.Motivo, Vendido: v.Vendido, Imagenes: v.Imagenes, Archivos: ToFile(v.Imagenes) })
                });
                LlenaTicketAccion
                    ({
                        IdTicket: response.data.IdTicket,
                        Motivo: { IdMotivo: response.data.IdMotivo, Motivo: response.data.Motivo },
                        Titulo: response.data.Titulo,
                        Guia: response.data.Guia,
                        Distribuidor: response.data.DistribuidorCteFinal,
                        NoFactura: response.data.NoFactura,
                        FechaFactura: response.data.FechaFactura.replace('T', '').substr(0,10),                        
                        Productos: arProductos,
                        Comentario: response.data.Comentario,
                        ComentarioDictamen: response.data.ComentarioDictamen,
                        ComentarioNC: response.data.ComentarioNC,
                        Nombre: response.data.Nombre,
                        FormatosProducto: response.data.Formatos.filter(v => v.IdTipoFormato == 1),
                        FormatosVenta: response.data.Formatos.filter(v => v.IdTipoFormato == 2),
                        FechaTicket: response.data.Fecha.replace('T', '').substr(0,10),
                        RptCartaFletera: response.data.RptCartaFletera,
                        IdUsuarioAsigno: response.data.IdUsuarioAsigno,
                        IdUsuario: response.data.IdUsuario
                    })
            }
        })
        .catch(error => {            
            console.log(error.response.status + ' - ' + error.response.statusText)
            CerrarSesionAccion();
        });
}


export const Notificacion = (LlenaNotiAccion, value = false, type = '', notificacion) => {    
    LlenaNotiAccion
    ({
        Value: value,
        Type: type,
        Notificacion: notificacion
    })
    //CERRAR NOTIFICACION
    setTimeout(() => LlenaNotiAccion({ Value: false, Type: type, Notificacion: ''}), process.env.VUE_APP_TiempoNotificacion);
}



export default {
    Sesion,
    Usuario,
    Ticket,
    Notificacion
}