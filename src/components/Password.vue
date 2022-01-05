<template>
    <div >
        <v-card-title>
            <span class="text-h5">Restablecer contrseña</span>
        </v-card-title>
        <!-- APARTADO DE OBTENCIÓN DE USUARIO-->
        <v-card-text v-if="stUsuario.OpcRestablecer == 0" >
            <v-form ref="formRestablecer">
                <v-text-field label="Usuario" 
                dense
                outlined 
                v-model="stUsuario.Usuario" 
                autocomplete="off" 
                :rules="[() => !!stUsuario.Usuario || 'Debe ingresar un usuario']" 
                ref="refUsuario" v-on:keypress="ValUsuario($event)" v-on:keyup.enter="ConfirmarDatos"></v-text-field>
            </v-form>
        </v-card-text>
        <!-- APARTADO DE CONFIRMACIÓN PARA ENVIO DE CODIGO DE SEGURIDAD-->
        <v-card-text v-if="stUsuario.OpcRestablecer == 1">
            <span class="text-h6 ">
                Usuario: {{stUsuario.Usuario}}
            </span><br>
            <span class = "text-body2">
                Te enviaremos un codigo para restablecer tu contraseña
                <br><br>
                Correo para envio del codigo
                <br>{{stUsuario.Email}} 
            </span>
        </v-card-text>
        <!-- PROCESO DE VERIFICACIÓN DE CODIGO Y ESTABLECIMIENTO DE NUEVA CONTRASEÑA-->
        <v-card-text v-if="stUsuario.OpcRestablecer >= 2">
            <span class="text-h6 ">
                Usuario: {{stUsuario.Usuario}}
            </span><br>
            <v-form ref="formCodigo">
                <v-row class = "mt-2">
                    <v-col cols="12" md="7" sm="7" style="height:40px;">
                        <v-text-field label="Codigo" dense outlined v-model="stUsuario.VerificadorCuenta" autocomplete="off" :rules="[() => !!stUsuario.VerificadorCuenta || 'Debe ingresar codigo de verificación']" ref="refCodigo" v-on:keypress="ValUsuario($event)" v-on:keyup.enter="ComprobacionCodigo" :disabled ="!verificar"></v-text-field>
                        
                    </v-col>
                    <v-col cols="12" md="5" sm="5" style="height:40px;">
                        <v-btn dense depressed color="primary" @click="ComprobacionCodigo();" class="ml-3" :disabled ="!verificar">Verificar</v-btn>
                    </v-col>
                    <v-col clos="12" md="12" sm="12">
                        <small class="advertencia">&nbsp; {{ msjAdvertencia }}</small>
                    </v-col>
                </v-row>

                <v-form ref="formPassword">
                    <v-text-field 
                        dense
                        :append-icon="btnPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="btnPass ? 'text' : 'password'"
                        @click:append="btnPass = !btnPass"
                        label="Nueva contraseña" 
                        outlined 
                        v-model="stUsuario.Contrasena" 
                        autocomplete="off" 
                        :rules="[() => !!stUsuario.Contrasena || 'Debe escribir contraseña']" 
                        ref="refContrasena" 
                        v-on:keypress="ValContrasena($event)"
                        v-on:keyup.enter="FocusConfContra"
                        :disabled ="verificar">
                        
                    </v-text-field>
                    <v-text-field
                        dense
                        :append-icon="btnPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="btnPass2 ? 'text' : 'password'"
                        @click:append="btnPass2 = !btnPass2"
                        label="Confirmar contraseña" 
                        outlined 
                        v-model="stUsuario.ConfContrasena" 
                        autocomplete="off" 
                        :rules="[() => !!stUsuario.ConfContrasena || 'Debe volver a escribir contraseña' , stUsuario.Contrasena === stUsuario.ConfContrasena || 'No concide la contraseña']" 
                        v-on:keypress="ValContrasena($event)"
                        ref="refConfContrasena"
                        v-on:keyup.enter="CambioPassword" 
                        :disabled ="verificar">
                    </v-text-field>
                </v-form>
            </v-form>
        </v-card-text>
    </div>
</template>

<script>
    import Validaciones from '@/utils/Validaciones'
    import vuex from 'vuex'
    import axios from 'axios'

    export default {
        name : 'Password',
        data(){
            return {
                btnPass: false,
                btnPass2: false,
                msjAdvertencia: '',
                opcion: 0,
                verificar: true,
            }
        },
        computed: {
            ...vuex.mapState(['Sesion','stUsuario']),
        },
        mounted(){
            this.Referencias();
        },
        methods: {
            
            //VALIDACION SOBRE INGRESO DE DATOS
            ValUsuario(evt) { Validaciones.Usuario(evt);},
            ValContrasena(evt) { Validaciones.Contrasena(evt);},
            
            //METODOS OPERATIVOS
            Referencias(){
                return{
                    refUsuario: this.stUsuario.Usuario,
                    refContrasena: this.stUsuario.Contrasena,
                    refConfContrasena: this.stUsuario.ConfContrasena,
                    refEmail: this.stUsuario.Email,
                    refOpcRestablecer: this.stUsuario.OpcRestablecer,
                }
            },
            //PROCESO DE VERIFICACION DE CODIGO 
            ComprobacionCodigo(){
                axios.get(process.env.VUE_APP_RUTA_API+'/api/usuarios/consultar-codigo/'+this.stUsuario.Usuario+'/'+this.stUsuario.VerificadorCuenta)
                    .then(response => {
                        if(response.status == 200){
                            this.verificar = !this.verificar;
                            this.stUsuario.OpcRestablecer = 3;
                            this.msjAdvertencia = "";
                            
                        }else{
                            this.msjAdvertencia = "Codigo incorrecto o expirado";
                        }
                    })
                    .catch(error =>{
                        this.msjAdvertencia = "Codigo incorrecto o expirado";
                    })
            },
            VerificacionDirecta(){
                this.stUsuario.OpcRestablecer = 3;
                this.stUsuario.Usuario = this.$route.params.usuario;
                this.stUsuario.VerificadorCuenta = this.$route.params.codigo;
                this.ComprobacionCodigo();

            }
        }
    }
</script>

<style scoped>
    .advertencia{
        color: red;
        font-size: 14px;
        float: left;
        margin-bottom:10px ;
        width: 100%;
    }
    .marginTop-24{
        margin-top: -24px;
    }
</style>