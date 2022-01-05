<template>
    <div>
        <v-card-title>
            <span class="text-h5 titulo">Garantias y Devoluciones</span>
        </v-card-title>
        <v-form ref="formInicio">
            <v-text-field label="Usuario" outlined v-model="arIniSesion.Usuario" autocomplete="off" :rules="[() => !!arIniSesion.Usuario || 'Debe ingresar un usuario']" ref="refUsuario" v-on:keypress="ValUsuario($event)" v-on:keyup.enter="FocusContra"></v-text-field>
            <v-text-field
                v-model="arIniSesion.Contrasena"
                autocomplete="off"
                :append-icon="btnPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[() => !!arIniSesion.Contrasena || 'Debe ingresar la contraseña']" ref="refContrasena" v-on:keypress="ValContrasena($event)" v-on:keyup.enter="FocusInicioSesion"
                :type="btnPass ? 'text' : 'password'"
                label="Contraseña"
                outlined
                @click:append="btnPass = !btnPass"
            ></v-text-field>
            <v-btn x-large color="primary" @click="IniciarSesion();" class="btnIniciarSesion" ref="refInicioSesion">Iniciar Sesión</v-btn>
            <small class="advertencia">&nbsp; {{ msjAdvertencia }}</small>
        </v-form>
    </div>
</template>


<script>

    import axios from 'axios';
    import vuex from 'vuex';
    import { ErrorFormulario } from '@/utils/ManejadorErrores'
    import Validaciones from '@/utils/Validaciones'
    import { Sesion, Notificacion } from '@/utils/Estados'

    var qs = require('qs') // biblioteca para stringificación.
    var cryptoJS = require("crypto-js"); // biblioteca para encriptar contraseña.
    
    export default {
        name: 'Sesion',
        data () {
            return {
                btnPass: false,
                msjAdvertencia: '',
                arIniSesion: {
                    Usuario: '',
                    Contrasena: ''
                },
                formErrores: false,
            }
        },
        computed:{
            formSesion(){
                return {
                    refUsuario: this.arIniSesion.Usuario,
                    refContrasena: this.arIniSesion.Contrasena
                }
            }
        },
        methods: {

            ...vuex.mapActions(['IniciarSesionAccion', 'LlenaNotiAccion']),

            // VALIDACION SOBRE INGRESO DE DATOS
            ValUsuario(evt) { Validaciones.Usuario(evt);},
            ValContrasena(evt) { Validaciones.Contrasena(evt);},

            // FOCUS
            FocusContra(){ this.$refs.refContrasena.focus(); },
            FocusInicioSesion(){ this.$refs.refInicioSesion.$el.focus();},
            
            // METODOS OPERATIVOS
            IniciarSesion(){
                if(this.arIniSesion.Usuario != '' && this.arIniSesion.Contrasena != ''){
                    let parametros = qs.stringify({"grant_type": "password", "username": this.arIniSesion.Usuario, "password": cryptoJS.AES.encrypt(this.arIniSesion.Contrasena, process.env.VUE_APP_LlaveEncriptacion).toString()});
                    let header = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}};
                    axios.post(process.env.VUE_APP_RUTA_API + '/Token', parametros, header)
                    .then(response => {
                        //console.log(response.data);                        
                        Sesion(this.IniciarSesionAccion, response.data.idUsuario, response.data.userName, response.data.access_token)
                        Notificacion(this.LlenaNotiAccion, false, 'error')
                        this.$router.push('Home')
                    })
                    .catch(error => {
                        //console.log(error.response)
                        this.msjAdvertencia = /*error.response.status + ' - ' + error.response.statusText + ' - ' +*/ 'El usuario o password es incorrecto.'
                    });
                }else{
                    ErrorFormulario(this.formSesion, this.$refs, this.formErrores);
                }
            }
        }
    }

</script>


<style scoped>
    .titulo{
        width: 100%;
    }
    .btnIniciarSesion{
        width: 100%;
    }
    .advertencia{
        color: red;
        font-size: 14px;
        float: left;
        margin: 10px 0 0 0;
        width: 100%;
    }
</style>