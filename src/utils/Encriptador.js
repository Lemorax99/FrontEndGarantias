
var cryptoJS = require("crypto-js");

export const Encriptar = (password) => {
    
    return(cryptoJS.AES.encrypt(password,process.env.VUE_APP_LlaveEncriptacion).toString());

}

export const Desencriptar = (password) => {

    return(cryptoJS.AES.decrypt(password,process.env.VUE_APP_LlaveEncriptacion).toString(cryptoJS.enc.Utf8));

}

export default {
    Encriptar,
    Desencriptar
}