<template >
    <div style="padding: 10px 10px 10px 10px;" elevation="3">
        <v-card >
            <v-card-title >
            <v-row>
                <v-col cols="9" sm="9" md="9">
                <span class="text-h5">Asignar Ticket</span> 
                </v-col>
                <v-col cols="3" sm="3" md="3">
                <v-btn class="close" style="background: white;" fab small elevation="0" @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
                </v-col>
            </v-row>
            </v-card-title>
            <v-card-text >
                <v-form ref="formAsignacion">
                    <!-- <v-row >
                        <v-radio-group v-model="stAsignacion.IdTipoUsuario" row v-on:change="ActualizarStAsignacion()" 
                            ref="refIdTipoUsuario" :rules="[()=> (this.stAsignacion.IdTipoUsuario != 0 || checkbox) || 'Selección requerida' ]"
                            :disabled="checkbox">
                            <v-radio label="Cliente" :value="usCliente" ></v-radio>
                            <v-radio label="Distribuidor" :value="usDistribuidor"></v-radio>
                        </v-radio-group>
                    </v-row> -->
                    <v-row >
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete v-model="nombreCliente" :items="arClientes" 
                                label="* Ingresar Cliente" item-text="Nombre"  
                                dense filled 
                                return-object
                                 v-on:change="ValidarCliente()" ref="refNombreUsuario"
                                 :rules="[() => this.nombreCliente != '' || 'Campo requerido']"
                                 :disabled="checkbox">
                                
                            </v-autocomplete>
                            <!-- <v-text-field v-model="stAsignacion.IdUsuario" label="* Ingresar cliente" outlined dense autocomplete="off" 
                                ref="refIdUsuario" :rules="[() => stAsignacion.IdUsuario != '' || 'Campo requerido',stAsignacion.Nombre != '' || 'Validación requerida']" :disabled="checkbox">
                            </v-text-field> -->
                        </v-col>
                        <!-- <v-col cols="12" sm="3" md="3">
                            <div class="text-center">
                                <v-btn color="primary" class="xsMarginTop" :disabled="checkbox" @click="ValidarCliente()">Validar</v-btn>
                            </div>
                        </v-col> -->
                    </v-row>
                    <v-row >
                        <v-col cols="12" sm="12" md="12" class="marginTop-24">
                            <v-text-field v-model="this.stAsignacion.Nombre" ref="refNombre" label="* Nombre Cliente"
                             outlined dense :disabled="true">
                             </v-text-field>                
                             <small class="advertencia marginTop-24">&nbsp; {{ msjAdvertencia }}</small>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" sm="12" md="12" class="marginTop-24">
                            <v-text-field v-model="this.tipoUsuario" ref="refTipoUsuario" label="* Tipo Cliente"
                             outlined dense :disabled="true">
                             </v-text-field>                
                             <small class="advertencia marginTop-24">&nbsp; {{ msjAdvertencia }}</small>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" sm="12" md="12" class="marginTop-24" v-if="!asigna">
                            <v-checkbox v-model="checkbox" dense v-on:change="AsignacionDefault()"
                            label="Cliente no identificado"> 
                            </v-checkbox>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios';
    import vuex from 'vuex';
    import { ErrorFormulario } from '@/utils/ManejadorErrores'

    export default {
        name: 'Asignacion',
        props:{
            asigna: false
        },
        data () {
            return{
                usCliente: process.env.VUE_APP_UsuarioCliente,
                usDistribuidor: process.env.VUE_APP_UsuarioDistribuidor,
                checkbox: false,
                validacion: true,
                msjAdvertencia:'',
                tipoUsuario: '',
                arClientes:[],
                nombreCliente:[]
            }
        },
        computed:{
            ...vuex.mapState(['Sesion','stUsuario','stAsignacion','stTicket']),

            formAsignacion(){
                this.msjAdvertencia=''
                return{
                    refNombreUsuario: this.nombreCliente,
                    refNombre: this.stAsignacion.Nombre,
                    refTipoUsuario: this.tipoUsuario
                }
            }
        },
        mounted(){
            this.ObtenerClientes();
            this.InicializaStAsignacion();
        },
        methods: {
            ...vuex.mapActions(['LlenaAsignacionAccion','LlenaTicketAccion','CerrarSesionAccion']),

            Close(){
                this.$emit('exit',true);
            },
            ObtenerClientes(){
                axios.get(process.env.VUE_APP_RUTA_API + "/api/usuarios/consultar-usuarios",this.Sesion.Token)
                    .then(response => {
                        //console.log(response.data);
                        this.arClientes = response.data;
                    })
                    .catch(error => {
                        this.CerrarSesionAccion();
                    });
            },
            InicializaStAsignacion(){
                this.LlenaAsignacionAccion({
                    IdUsuario: 0,
                    IdTipoUsuario: 0,
                    Nombre: '',
                    IdUsuarioAsigno: this.stUsuario.IdUsuario
                });
                this.nombreCliente = '';
                // if(this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioDesa){
                //     this.LlenaAsignacionAccion({
                //     IdUsuario: 0,
                //     IdTipoUsuario: 0,
                //     Nombre: '',
                //     IdUsuarioAsigno: this.stUsuario.IdUsuario
                //     })
                // }else if(this.stUsuario.IdUsuario == this.cliente || this.stUsuario.IdUsuario == this.distribuidor){
                //     this.LlenaAsignacionAccion({
                //         IdUsuario: 0,
                //         IdTipoUsuario: 0,
                //         Nombre: '',
                //         IdUsuarioAsigno: this.stTicket.IdUsuarioAsigno
                //     })
                // }
                // else{
                //     this.LlenaAsignacionAccion({
                //     IdUsuario: 0,
                //     IdTipoUsuario: 0,
                //     Nombre: '',
                //     IdUsuarioAsigno: 0
                //     })
                // }
            },
            ActualizarStAsignacion(){
                if(this.stUsuario.IdUsuario == this.cliente || this.stUsuario.IdUsuario == this.distribuidor){
                    this.stAsignacion.IdUsuarioAsigno = this.stTicket.IdUsuarioAsigno;
                }
                if(this.checkbox){
                    this.AsignacionDefault();
                }
                else{
                    this.stAsignacion.Nombre = '';
                    this.stAsignacion.IdUsuario = '';
                    this.msjAdvertencia = '';
                    this.$refs.formAsignacion.resetValidation();
                }
            },
            AsignacionDefault(){
                if(this.checkbox){
                        this.stAsignacion.IdUsuario = this.stUsuario.IdUsuario;
                        this.stAsignacion.Nombre = this.stUsuario.Nombre;
                        this.stAsignacion.IdTipoUsuario = this.stUsuario.IdTipoUsuario;
                        this.tipoUsuario = 'UsuarioDesa'
                        this.nombreCliente = '';
                }else{
                    this.InicializaStAsignacion();
                    this.tipoUsuario = '';
                }
            },
            ValidarCliente(){
                if(this.nombreCliente){
                    this.stAsignacion.IdTipoUsuario = this.nombreCliente.IdTipoUsuario;
                    this.stAsignacion.Nombre = this.nombreCliente.Nombre;
                    this.stAsignacion.IdUsuario = this.nombreCliente.IdUsuario;
                    this.tipoUsuario = this.nombreCliente.TipoUsuario;
                    console.log(this.stAsignacion);
                }else{
                    this.stAsignacion.IdTipoUsuario = 0;
                    this.stAsignacion.Nombre = '';
                    this.stAsignacion.IdUsuario = 0;
                    this.tipoUsuario = '';
                    console.log(this.stAsignacion);
                }
                
                // axios.get(process.env.VUE_APP_RUTA_API + "/api/usuarios/buscar-asignar/"+this.stAsignacion.IdUsuario+"/"+this.stAsignacion.IdTipoUsuario)
                //     .then(response =>{
                //         if(response.status == 200){
                //             this.stAsignacion.IdUsuario = response.data.IdUsuario;
                //             this.stAsignacion.Nombre = response.data.Nombre;
                            
                //         }else{
                //             this.stAsignacion.Nombre = '';
                //             this.msjAdvertencia=response.data;
                //         }
                //     })
                //     .catch(error =>{
                //         console.log(error);
                //     })
                // if(this.stUsuario.IdUsuario == this.cliente || this.stUsuario.IdUsuario == this.distribuidor){
                //     this.stAsignacion.IdUsuarioAsigno = this.stTicket.IdUsuarioAsigno;
                //     console.log(this.stTicket)
                // }
            },
            Asignacion(){
                if(this.stAsignacion.IdTipoUsuario != 0 && this.stAsignacion.Usuario != "" ){
                    this.$emit('exit',true)
                }
                else{
                    ErrorFormulario(this.formDetalleDistribuidor, this.$refs, this.formErrores);
                }
            }
        }
    }
</script>
<style>
    .marginTop-24{
        margin-top: -24px;
    }
    .advertencia{
        color: red;
        font-size: 14px;
        float: left;
        margin-bottom:10px ;
        width: 100%;
    }
    .close{
    float: right;    
    position: relative;  
  }
</style>