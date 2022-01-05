<template>
    <v-container>
        <v-row :align="alignment" :justify="justify" class="grey lighten-5 contInicio">
                    <v-card elevation="15" class="ma-3 pa-6 text-center" outlined max-width="415px">
                        <!--CARGA DE COMPONENTE ClientePerfil-->
                        <Password ref="refPassword"/>
                        <small class="advertencia" v-if="stUsuario.OpcRestablecer < 2">&nbsp; {{ msjAdvertencia }}</small>
                        <!-- Botones de funcion-->
                        <p class = "ml-15 mt-1">
                            <v-btn color="blue darken-1" text @click="Cancelar()">Cancelar</v-btn>
                            <v-btn depressed color="primary" @click="ConfirmarDatos();" class="ml-3" v-if="stUsuario.OpcRestablecer == 0">Solicitar</v-btn>
                            <v-btn depressed color="primary" @click="EnviarCodigo();" v-on:keyup.enter="EnviarCodigo" v-if="stUsuario.OpcRestablecer == 1">Confirmar</v-btn>
                            <v-btn depressed color="primary" @click="CambioPassword();" class="ml-3" :disabled ="(stUsuario.OpcRestablecer == 2)" v-if="stUsuario.OpcRestablecer >= 2">Solicitar</v-btn>
                        </p>
                    </v-card>
                </v-row>
    </v-container>
</template>

<script>
    import Password from '@/components/Password.vue'
    import vuex from 'vuex'
    import axios from 'axios'
    import {ErrorFormulario} from '@/utils/ManejadorErrores'
    import Encriptador from '@/utils/Encriptador'
    
    export default {
        name: 'Restablecer',
        components: {
            Password
        },
        data(){
            return{
                alignment: 'center',
                justify: 'center',
                dialog: false,
                msjAdvertencia: '',
                progreso: 0,
                formErrores: false,
            }
        },
        computed: {
            ...vuex.mapState(['Sesion','stUsuario'])
        },
        mounted(){
            this.stUsuario.OpcRestablecer = 0;
            if(this.$route.params.usuario && this.$route.params.codigo){
                this.$refs.refPassword.VerificacionDirecta();
            }
        },
        //CONSULTAR EXISTENCIA USUARIO
        methods:{
            ConfirmarDatos(){
                //console.log(process.env.VUE_APP_RUTA_API + '/api/usuarios/consultar-email/' + this.stUsuario.Usuario);
                if(this.stUsuario.Usuario!=""){
                    axios.get(process.env.VUE_APP_RUTA_API + '/api/usuarios/consultar-email/' + this.stUsuario.Usuario)
                    .then(response => {
                        if(response.status == 200){
                            this.stUsuario.Email = response.data.Email;
                            //Prueba para ocultar parcialmente el correo
                            //this.stUsuario.Correo = "lemorax99@gmail.com"
                            var _limite = this.stUsuario.Email.indexOf('@')-1;
                            this.stUsuario.Email = this.stUsuario.Email[0]+('*'.repeat(_limite-1))+this.stUsuario.Email.substring(_limite,this.stUsuario.Email.length);
                            this.opcion = 1;
                            this.stUsuario.OpcRestablecer = 1;
                        }
                        this.msjAdvertencia="";
                    })
                    .catch(error => {
                        this.msjAdvertencia = 'El usuario no existe.'

                    })
                }else{
                    this.$refs.refPassword.$refs.formRestablecer.validate();
                }
            },
            //CANCELAR OPERACION
            Cancelar(){
                this.stUsuario.VerificadorCuenta = "";
                this.$router.push('/');
            },
            //ENVIO DE CODIGO
            EnviarCodigo(){
                axios.post(process.env.VUE_APP_RUTA_API+'/api/usuarios/generacion-verificador/'+this.stUsuario.Usuario,{'Link': window.location.href})
                    .then(response => {
                        if(response.status == 200){
                            this.msjAdvertencia = "";
                            this.stUsuario.OpcRestablecer = 2;
                        }
                        else{
                            this.msjAdvertencia = "Algo salio mal, intentalo de nuevo o mas tarde.";
                        }
                    }).catch(error => {
                        this.msjAdvertencia = "Algo salio mal, intentalo de nuevo o mas tarde.";
                    });
            },
            //PROCESO DE CAMBIO DE CONTRASEÑA
            CambioPassword(){

                if(this.stUsuario.Contrasena != "" && this.stUsuario.Contrasena == this.stUsuario.ConfContrasena){
                    
                    let _contraCifrada = Encriptador.Encriptar(this.stUsuario.Contrasena);

                    let _body = { 'IdUsuario': '' + this.stUsuario.IdCliente + '',
                                'Nombre': '' + this.stUsuario.NombrePerfil + '',
                                'IdDistribuidor': '' + this.stUsuario.IdDistribuidor + '',
                                'Rfc': '' + this.stUsuario.Rfc + '',
                                'Email': '' + this.stUsuario.Email + '',
                                'IdVendedor': '' + this.stUsuario.IdVendedor + '',
                                'Contacto': '' + this.stUsuario.Contacto + '',
                                'Telefono': '' + this.stUsuario.Telefono + '',
                                'Activo': '' + this.stUsuario.Activo + '',
                                'Usuario': '' + this.stUsuario.Usuario + '',
                                'Contrasena': '' + _contraCifrada + '',
                                'VerificadorCuenta': '' + this.stUsuario.VerificadorCuenta + '',
                                'IdTipoUsuario': '' + this.stUsuario.IdTipoUsuario
                            }; 

                    axios.put(process.env.VUE_APP_RUTA_API+'/api/usuarios/restablecer-contrasena', _body)
                        .then(response => { 
                            if(response.status == 201){
                                localStorage.setItem("Alerta",true);
                                this.stUsuario.VerificadorCuenta = "";
                                this.$router.push('/');
                            }

                        })
                        .catch(error => {
                            this.msjAdvertencia = "Algo salio mal, intentalo de nuevo o mas tarde.";
                        });
                }else{
                    this.$refs.refPassword.$refs.formPassword.validate();
                }
            },
            //FOCUS
            FocusConfContra(){ this.$refs.refConfContrasena.focus(); }
        }
    }
</script>

<style scoped>
    .contInicio{
        height: 550px;
        
    }
    .advertencia{
        color: red;
        font-size: 14px;
        float: left;
        margin-bottom:10px ;
        width: 100%;
    }
</style>
