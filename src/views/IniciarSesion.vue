<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <!--NOTIFICACIONES-->
                <v-alert :value="stNotificacion.Value" :type="stNotificacion.Type" transition="scale-transition" style="position: absolute; width:90%; z-index:1;" class="notificaciones">
                    {{stNotificacion.Notificacion}}
                </v-alert>
                <v-row :align="alignment" :justify="justify" class="grey lighten-5 contInicio">
                    <v-card elevation="15" class="ma-3 pa-6 text-center" outlined max-width="415px">
                        <!--CARGA DE COMPONENTE ClientePerfil-->
                        <Sesion ref="refSesion"/>
                        <!--PARTE DE LA VISTA-->
                        <a v-bind:href="'/Restablecer'" class="linkContra">¿Olvidaste tu Contraseña?</a>
                        <div class="lineaDivisora"></div>
                        <!--INICIO DIALOG CREAR CUENTA NUEVA-->
                        <v-row justify="center">
                            <v-dialog v-model="dialog" persistent max-width="600px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn large color="success"  v-on="on" @click="LimpiarDatos();">Crear cuenta nueva</v-btn>
                                </template>
                                <v-card >
                                    <!--CARGA DE COMPONENTE ClientePerfil-->
                                    <UsuarioPerfil ref="refClientePerfil" @exit="ResetFormulario()" />
                                    <!--ACCIONES DE VISTA Iniciar Sesion (Crear cuenta)-->
                                    <v-card-actions>
                                        <small class="advertencia">{{ msjAdvertencia }}</small>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="ResetFormulario();">Cerrar</v-btn>
                                        <v-btn depressed color="primary" @click="RegistrarUsuario();">Registrarte</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-row>
                        <!--FIN DIALOG CREAR CUENTA NUEVA-->
                    </v-card>
                </v-row>
                <v-alert dense text type="success" v-if="alerta">
                    Contraseña restablecida satisfactoriamente
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>

    import axios from 'axios';
    import vuex from 'vuex';
    import UsuarioPerfil from "@/components/UsuarioPerfil.vue";
    import Sesion from "@/components/Sesion.vue";
    import Encriptador from '@/utils/Encriptador';
    import { Notificacion } from '@/utils/Estados';

    export default {
        name: 'IniciarSesion',
        components: {
            UsuarioPerfil,
            Sesion
        },
        data () {
            return {
                alignment: 'center',
                justify: 'center',
                dialog: false,
                msjAdvertencia: '',
                formErrores: false,
                alerta: false
            }
        },
        computed:{
            ...vuex.mapState(['stUsuario','stNotificacion'])
        },
        created(){
            this.InicializaStates();
        },
        mounted(){
            this.Alerta();
        },
        methods: {
            
            ...vuex.mapActions(['LlenaUsuarioAccion','LlenaNotiAccion']),

            InicializaStates(){
                this.LlenaUsuarioAccion
                    ({
                        IdUsuario: 0,
                        Nombre: '',
                        IdDistribuidor: '',
                        Rfc: '',
                        Contacto: '',
                        Telefono: '',
                        Email: '',
                        Activo: true,
                        Usuario: '',
                        IdVendedor: '',
                        Contrasena: '',
                        ConfContrasena: '',
                        VerificadorCuenta: '',
                        IdTipoUsuario: 0,
                        IdSubTipoUsuario: 0,
                        IdZona: 0
                    })
                this.LlenaNotiAccion({
                        Value: false,
                        Type: 'success',
                        Notificacion: ''
                        
                    })
            },
            Alerta(){
                if(localStorage.getItem("Alerta")){
                    Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Success,"Contraseña restablecida con exito.");
                    localStorage.removeItem("Alerta");
                }            
            },
            RegistrarUsuario(){
                //Cifrado de contraseña
                this.msjAdvertencia = "";
                if(this.$refs.refClientePerfil.$refs.formCliente.validate()){
                    var Contrasena = this.$refs.refClientePerfil.auxiliarContrasena;

                    var _contraCifrada = Encriptador.Encriptar(Contrasena) ;

                    let _body = { 'Nombre': '' + this.stUsuario.Nombre + '',
                                'IdDistribuidor': '' + this.stUsuario.IdDistribuidor + '',
                                'Rfc': '' + this.stUsuario.Rfc + '',
                                'Contacto': '' + this.stUsuario.Contacto + '',
                                'Telefono': '' + this.stUsuario.Telefono + '',
                                'Email': '' + this.stUsuario.Email + '',
                                'Activo': '' + this.stUsuario.Activo + '',
                                'IdTipoUsuario': '' + this.stUsuario.IdTipoUsuario + '',
                                'Usuario': '' + this.stUsuario.Usuario + '',
                                'Contrasena': '' + _contraCifrada + '',
                                'IdVendedor': '' + this.stUsuario.IdVendedor + '',
                                'IdSubTipoUsuario': '' + this.stUsuario.IdSubTipoUsuario + '',
                                'IdZona': '' + this.stUsuario.IdZona + '',
                                };
                    axios.post(process.env.VUE_APP_RUTA_API + '/api/usuarios/registrar-usuario',  _body)
                        .then(response => {
                            //console.log(response);
                            if(response.status == 200){
                                this.$refs.refSesion.arIniSesion.Usuario = this.stUsuario.Usuario;
                                this.$refs.refSesion.arIniSesion.Contrasena= Encriptador.Desencriptar(_contraCifrada);
                                this.dialog = false;
                                Notificacion(this.LlenaNotiAccion,true,process.env.VUE_APP_Success,"Usuario registrando, iniciando sesión...")
                                setTimeout(()=>{
                                    this.$refs.refSesion.IniciarSesion();
                                }, 1500);
                            }
                            if(response.status == 202){
                                this.msjAdvertencia = response.data.Message;

                                setTimeout(() => {
                                    this.msjAdvertencia = "";
                                },3500);
                            }
                        })
                        .catch(error => {
                            this.msjAdvertencia = error.response.status + ' - ' + error.response.statusText + ' - ' + 'Se ha producido un error.'
                        });
                }
            },
            LimpiarDatos(){
                this.msjAdvertencia = '';
            },
            ResetFormulario(){
                this.dialog = false;
                this.$refs.refClientePerfil.$refs.formCliente.resetValidation();
                this.InicializaStates();
            }
        }
    }

</script>

<style scoped>
    .contInicio{
        height: 550px;
    }
    .linkContra{
        float: left;
        margin: 25px 0 0 0;
        width: 100%;
    }
    .lineaDivisora{
        border-bottom: 1px solid #dadde1;
        float: left;
        margin: 25px 0 25px 0;
        width: 100%;
    }
    .advertencia{
        color: red;
        font-size: 14px;
    }
</style>