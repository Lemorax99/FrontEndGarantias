<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <!--CARGA DE COMPONENTE UsuarioPerfil-->
                <v-card elevation="15">
                    <UsuarioPerfil ref="refClientePerfil"/>
                <!--ACCIONES DE VISTA Usuarios-->
                    <v-card-actions>                        
                        <v-spacer></v-spacer>
                        <v-btn depressed color="primary" @click="ActualizarUsuario();">Actualizar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    import axios from 'axios';
    import vuex from 'vuex';
    import UsuarioPerfil from "@/components/UsuarioPerfil.vue";
    import Estado from '@/utils/Estados';
    import Encriptador from '@/utils/Encriptador';
    import { Notificacion } from '@/utils/Estados';

    export default {
        name: 'Usuarios',
        components: {
            UsuarioPerfil
        },
        data () {
            return {                
                msjExito: '',
                formHasErrors: false
            }
        },
        computed:{
            ...vuex.mapState(['Sesion', 'stUsuario', 'stNotificacion'])
        },
        mounted(){
            if(this.Sesion.Token == false){
                this.$router.push({path:'/'});
            }else{
                this.LimpiarDatos();                
            }
        },
        methods: {
            
            ...vuex.mapActions(['LlenaUsuarioAccion', 'CerrarSesionAccion','LlenaNotiAccion']),
                    
            ActualizarUsuario(){
                this.LimpiarDatos();
                    if(this.$refs.refClientePerfil.$refs.formCliente.validate()){
                        // Cifrado de contraseña
                    var Contrasena = this.$refs.refClientePerfil.auxiliarContrasena;
                    var ConfContrasena = this.$refs.refClientePerfil.auxiliarConfContrasena;
                    
                    let _contraCifrada = (Contrasena == ConfContrasena && Contrasena != '' && ConfContrasena != '') ? Encriptador.Encriptar(Contrasena) : false;
                    let _body = { 'IdUsuario': '' + this.stUsuario.IdUsuario + '',
                                'Nombre': '' + this.stUsuario.Nombre + '',
                                'IdDistribuidor': '' + this.stUsuario.IdDistribuidor + '',
                                'Rfc': '' + this.stUsuario.Rfc + '',
                                'Contacto': '' + this.stUsuario.Contacto + '',
                                'Telefono': '' + this.stUsuario.Telefono + '',
                                'Activo': '' + this.stUsuario.Activo + '',
                                'Usuario': '' + this.stUsuario.Usuario + '',
                                'Contrasena': '' + _contraCifrada
                                };
                    axios.put(process.env.VUE_APP_RUTA_API + '/api/usuarios/actualizar-usuario',  _body, this.Sesion.Token)
                        .then(response => {
                            //console.log(response);
                            if(response.status == 201){
                                Estado.Usuario(this.Sesion.Usuario, this.Sesion.Token, this.LlenaUsuarioAccion, this.CerrarSesionAccion);
                                this.msjExito = response.data;
                                Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Success,this.msjExito);
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            //alert(error.response.status + ' - ' + error.response.statusText + ' - ' + 'Se ha producido un error.');
                            this.CerrarSesionAccion();
                        });
                }
            },
             LimpiarDatos(){
                 this.msjExito = '';                
            }
        }
    }
    
</script>


<style scoped>
    .exito{
        color: green;
        font-size: 20px;
    }
</style>