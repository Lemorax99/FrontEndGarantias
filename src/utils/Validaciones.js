export const Usuario = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789._\\-]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Contrasena = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789._!#$%&/()=?¡@,*+\\-]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Cliente = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const NoCliente = (event) => {
    var regex = new RegExp("^[0123456789]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Rfc = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Contacto = (event) => {
    var regex = new RegExp("^[a-zA-Z ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Telefono = (event) => {
    var regex = new RegExp("^[0123456789\\-() ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Titulo = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789.\\-/() ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Guia = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789\\-/]");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Factura = (event) => {
    var regex = new RegExp("^[0123456789]");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Producto = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789.\\-/]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Cantidad = (evt) => {
    var regex = new RegExp("^[0123456789]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Motivo = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Comentario = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789.\\-/() ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Direccion = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789.\\-/()# ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Colonia = (event) => {
    var regex = new RegExp("^[a-zA-Z0123456789 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const Poblacion = (event) => {
    var regex = new RegExp("^[a-zA-Z, ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}

export const CodigoPostal = (event) => {
    var regex = new RegExp("^[0123456789]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}


export default {
    Usuario,
    Contrasena,
    Cliente,
    NoCliente,
    Rfc,
    Contacto,
    Telefono,
    Titulo,
    Guia,
    Factura,
    Producto,
    Cantidad,
    Motivo,
    Comentario,
    Direccion,
    Colonia,
    Poblacion,
    CodigoPostal
}