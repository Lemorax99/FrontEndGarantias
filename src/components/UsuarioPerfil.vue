<template>
    <div  style="padding: 10px 10px 10px 10px;" elevation="3">
        <v-card  >
            <v-card-title>
                <span class="text-h5">Mi Perfil</span>
                <v-btn v-if="!disabled" fab small elevation="0" @click="ResetFormulario()" style="float: right;background: white;margin-left: auto;"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <span class = "text-s2 " v-if="!disabled">Tipo de usuario :</span>
                <v-form ref="formCliente">
                    <v-container>
                        <!-- Apartado de radio button para seleccionar tipo de usuario -->
                        <v-row v-if="!disabled" class="marginTop-24"> 
                            <v-col cols="12" sm="6" md="6" >
                                <v-radio-group column v-model="stUsuario.IdTipoUsuario" v-on:change="LimpiarDatos()" :rules="[() => this.stUsuario.IdTipoUsuario != 0 || 'Selección requerida']">
                                    <v-radio label="Distribuidor" :value="usGralDistribuidor" ></v-radio>
                                    <v-radio label="Cliente" :value="usGralCliente" ></v-radio>
                                    <v-radio label="Usuario DESA" :value="usGralUsuarioDesa"></v-radio>
                                </v-radio-group>  
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="mt-5" v-if='stUsuario.IdTipoUsuario == usGralDistribuidor'>
                                <span>¿Lo ha registrado un vendedor?</span>
                                <v-radio-group row class = "ml-16" v-model="vendedor" v-on:change="LimpiarVendedor()" :rules="[() => vendedor != 0 || 'Selección requerida']">
                                    <v-radio label = "Si" value=1></v-radio>
                                    <v-radio label = "No"  value=2></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" id="subUsuarios" v-if='arSubUsuarios.length > 0 '>
                                <span >Cargo : </span>
                                <v-radio-group  v-model="stUsuario.IdSubTipoUsuario" class="marginTop-10 scroll" :rules ="[() => !!stUsuario.IdSubTipoUsuario || 'Selección requerida' ]"
                                    v-on:change="SeleccionSubTipo()">
                                    <v-radio 
                                        v-for="subTipo in arSubUsuarios"
                                        :key="subTipo.IdSubTipoUsuario"
                                        :value="subTipo.IdSubTipoUsuario"
                                        :label="`${subTipo.SubTipousuario}`">
                                    </v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6" md="6" class="marginTop-24" >
                                <v-text-field dense outlined label="* Cliente" 
                                    v-model="stUsuario.Nombre" autocomplete="off" 
                                    :disabled="(disabled && stUsuario.IdTipoUsuario != usGralCliente ) || (!disabled && stUsuario.IdTipoUsuario != usGralCliente)" 
                                    :rules="[() => !!stUsuario.Nombre || 'Campo requerido']" 
                                    ref="refNombre" v-on:keypress="ValCliente($event)" 
                                    v-on:keyup.enter="FocusIdDistribuidor">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="marginTop-24" >
                                <v-text-field dense outlined label="* Correo electronio" 
                                    v-model="stUsuario.Email" autocomplete="off" 
                                    :disabled="(disabled && stUsuario.IdTipoUsuario == usGralUsuarioDesa)  || ( !disabled && stUsuario.IdTipoUsuario != usGralCliente)">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="marginTop-24" v-if="stUsuario.IdTipoUsuario == usGralDistribuidor">
                                <v-text-field dense outlined label="* No Cliente" 
                                    v-model="stUsuario.IdDistribuidor" autocomplete="off" 
                                    :disabled="disabled || stUsuario.IdTipoUsuario==0" 
                                    :rules="[() => !!stUsuario.IdDistribuidor || 'Campo requerido' , verificacion || 'RFC y No Cliente no encontrados' ]" 
                                    ref="refIdDistribuidor" v-on:keypress="ValNoCliente($event)" 
                                    @blur="VerificarUsuario"
                                    v-on:keyup.enter="FocusRfc">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="marginTop-24" v-if="stUsuario.IdTipoUsuario == usGralDistribuidor">
                                <v-text-field dense outlined label="* RFC" 
                                    v-model="stUsuario.Rfc" autocomplete="off" 
                                    :disabled="disabled || stUsuario.IdTipoUsuario==0" 
                                    :rules="[() => !!stUsuario.Rfc || 'Campo requerido' , verificacion || 'RFC y No Cliente no encontrados']" 
                                    ref="refRfc" v-on:keypress="ValRfc($event)" 
                                    @blur="VerificarUsuario"
                                    v-on:keyup.enter="FocusUsuario">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" class="marginTop-24" v-if="vendedor == 1 && stUsuario.IdTipoUsuario == usGralDistribuidor">
                                <v-select dense outlined label="* Vendedor" 
                                    :items="arVendedores[0]" v-model="selectVendedor" 
                                    v-on:change="ObtenerIdVendedor()" :rules="[() => this.stUsuario.IdVendedor != '' || 'Selección necesaria']"></v-select>
                            </v-col>
                            <v-col cols="12" class="marginTop-24" v-if="stUsuario.IdSubTipoUsuario == usSubTipoVendedor && !disabled">
                                <v-text-field dense outlined label="* Numero de vendedor" 
                                    v-model="stUsuario.IdVendedor" autocomplete="off"
                                    :rules="[() => stUsuario.IdVendedor != 0 || 'Campo requerido' , verificacion || 'Vendedor no encontrado']" 
                                    ref="refIdVendedor" 
                                    @blur="VerificarUsuario"
                                    v-on:keyup.enter="FocusContra">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" class="marginTop-24">
                                <v-text-field dense outlined label="* Usuario" 
                                    v-model="stUsuario.Usuario" autocomplete="off" 
                                    :disabled="disabled || stUsuario.IdTipoUsuario == 0 || stUsuario.IdSubTipoUsuario == usSubTipoVendedor || subTipo" 
                                    :rules="[() => !!stUsuario.Usuario || 'Campo requerido' , verificacion || 'Usuario no encontrado']" 
                                    ref="refUsuario" v-on:keypress="ValUsuario($event)" 
                                    @blur="VerificarUsuario"
                                    v-on:keyup.enter="FocusContra">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="marginTop-24">
                                <v-text-field
                                    outlined
                                    dense
                                    v-model="auxiliarContrasena"
                                    autocomplete="off"
                                    :append-icon="btnPass1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[() => !!auxiliarContrasena || 'Campo requerido']" ref="refContrasena" v-on:keypress="ValContrasena($event)" v-on:keyup.enter="FocusConfContra"
                                    :type="btnPass1 ? 'text' : 'password'"
                                    label="* Contraseña"
                                    @click:append="btnPass1 = !btnPass1"
                                    :disabled="stUsuario.IdTipoUsuario == 0 || subTipo"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="marginTop-24">
                                <!--v-model="auxiliarConfContrasena" -->
                                <v-text-field
                                    outlined
                                    dense
                                    v-model="auxiliarConfContrasena"
                                    autocomplete="off"
                                    :append-icon="btnPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[() => !!auxiliarConfContrasena || 'Campo requerido', auxiliarContrasena === auxiliarConfContrasena || 'No concide la contraseña']" ref="refConfContrasena" v-on:keypress="ValContrasena($event)"
                                    :type="btnPass2 ? 'text' : 'password'"
                                    label="* Confirmar Contraseña"
                                    @click:append="btnPass2 = !btnPass2"
                                    :disabled=" stUsuario.IdTipoUsuario == 0 || subTipo"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>


<script>
    
    import vuex from 'vuex';
    import Validaciones from '@/utils/Validaciones'
    import axios from 'axios'
    import Encriptador from '@/utils/Encriptador'

    export default {

        name: 'UsuarioPerfil',
        data () {
            return {
                btnPass1: false,
                btnPass2: false,
                disabled: false,
                verificacion: true,
                subTipo: false,
                usGralDistribuidor: process.env.VUE_APP_UsuarioDistribuidor,
                usGralCliente: process.env.VUE_APP_UsuarioCliente,
                usGralUsuarioDesa: process.env.VUE_APP_UsuarioDesa,
                usSubTipoVendedor: process.env.VUE_APP_SubTipoVendedor,
                usSubTipoSupervisor: process.env.VUE_APP_SubTipoSupervisor,
                vendedor: 0,
                arVendedores : [[],[]],
                arSubUsuarios : [],
                selectVendedor: "",
                auxiliarContrasena: "",
                auxiliarConfContrasena: "",

            }

        },
        computed:{

            ...vuex.mapState(['Sesion','stUsuario'])

        },
        mounted(){

            this.RefFormulario();
            this.disabled = (this.Sesion.Usuario != '') ? true : false;
            this.ObtenerVendedores();
            this.auxiliarContrasena = Encriptador.Desencriptar(this.stUsuario.Contrasena);
            this.auxiliarConfContrasena = Encriptador.Desencriptar(this.stUsuario.ConfContrasena); 
            
        },
        methods: {

            // VALIDACION SOBRE INGRESO DE DATOS
            ValCliente(evt) { Validaciones.Cliente(evt); },
            ValNoCliente(evt) { Validaciones.NoCliente(evt); },
            ValRfc(evt) { Validaciones.Rfc(evt); },
            ValUsuario(evt) { Validaciones.Usuario(evt); },
            ValContrasena(evt) { Validaciones.Contrasena(evt);},
            
            // FOCUS
            FocusIdDistribuidor(){ this.$refs.refIdDistribuidor.focus(); },
            FocusRfc(){ this.$refs.refRfc.focus(); },
            FocusUsuario(){ this.$refs.refUsuario.focus(); },
            FocusContra(){ this.$refs.refContrasena.focus(); },
            FocusConfContra(){ this.$refs.refConfContrasena.focus(); },
            
            // METODOS OPERATIVOS
            RefFormulario(){

                return {
                    refNombre: this.stUsuario.Nombre,
                    refIdDistribuidor: this.stUsuario.IdDistribuidor,
                    refRfc: this.stUsuario.Rfc,
                    refUsuario: this.stUsuario.Usuario,
                    refContrasena: this.stUsuario.Contrasena,
                    refConfContrasena: this.stUsuario.ConfContrasena,
                    refIdTipoUsuario: this.stUsuario.IdTipoUsuario,
                }
            },
            //REINICIAR FORMULARIO
            LimpiarDatos(){
                
                this.$refs.formCliente.resetValidation();
                this.stUsuario.Nombre = "",
                this.stUsuario.IdDistribuidor = "",
                this.stUsuario.Rfc = "",
                this.stUsuario.Email = "",
                this.stUsuario.IdVendedor = 0,
                this.stUsuario.Usuario = ""
                this.auxiliarContrasena = "",
                this.auxiliarConfContrasena = "",
                this.stUsuario.IdSubTipoUsuario = 0,
                this.vendedor = 0, 
                this.arSubUsuarios = [];
                axios.get(process.env.VUE_APP_RUTA_API+'/api/usuarios/consultar-subtipos/'+this.stUsuario.IdTipoUsuario)
                .then(response =>{
                    if(response.status == 200){
                        response.data.forEach(subTipo =>{
                            this.arSubUsuarios.push(subTipo);
                        });
                    }
                })
                .catch(error =>{
                    console.log(error);
                });
                if(this.stUsuario.IdTipoUsuario == this.usGralUsuarioDesa){
                    this.subTipo = true;
                }
            },
            ObtenerVendedores(){
                console.log(this.stUsuario);
                axios.get(process.env.VUE_APP_RUTA_API+'/api/usuarios/consultar-vendedores')
                .then(response=>{
                    if(response.status == 200){
                        response.data.forEach(vendedor => {
                            this.arVendedores[0].push('0'.repeat(5-String(vendedor.IdVendedor).length)+vendedor.IdVendedor+"  -  "+vendedor.Nombre);
                            this.arVendedores[1].push(vendedor.IdUsuario);
                        });
                        // console.log(this.arVendedores);
                    }
                })
                .catch(error =>{
                    console.log(error);
                })
            },
            ObtenerIdVendedor(){
                var _index = this.arVendedores[0].indexOf(this.selectVendedor);
                this.stUsuario.IdVendedor = this.arVendedores[1][_index];
                // console.log(this.arVendedores[0]);
                // console.log(this.arVendedores[1]);
            },
            LimpiarVendedor(){
                if(this.vendedor == 0 || this.vendedor == 2){
                    this.stUsuario.IdVendedor = 0 ;
                    this.selectVendedor = "";
                }
            },
            VerificarUsuario(){
                console.log(this.stUsuario);
                if(this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioDistribuidor){
                    if(this.stUsuario.NoCliente != "" && this.stUsuario.Rfc != "" )
                    {
                        //Comprobar datos de usuario de distribuidor
                        axios.get(process.env.VUE_APP_RUTA_API+"/api/usuarios/verificar-distribuidor/"+this.stUsuario.Rfc+"/"+this.stUsuario.IdDistribuidor)
                        .then(response => {
                            if(response.status == 200){
                                this.stUsuario.Nombre = response.data.Nombre;
                                this.stUsuario.Email = response.data.Email;
                                this.stUsuario.IdZona = response.data.IdZona;
                                this.verificacion = true;
                            }
                            else{
                                this.stUsuario.Nombre = "";
                                this.stUsuario.Email = "";
                                this.stUsuario.IdZona = 0;
                                this.verificacion = false;
                            }
                        })
                    }
                    console.log(this.stUsuario);
                }else if (this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioDesa){
                    if(this.stUsuario.IdSubTipoUsuario == this.usSubTipoVendedor && this.stUsuario.IdVendedor != 0){
                        //Comprobar datos de usuario desa con subtipo vendedor
                        axios.get(process.env.VUE_APP_RUTA_API+"/api/usuarios/verificar-vendedor/"+this.stUsuario.IdVendedor)
                        .then(response=>{
                            if(response.status == 200){
                                this.stUsuario.Nombre = response.data.Nombre;
                                this.stUsuario.Email = response.data.Email;
                                this.stUsuario.Usuario = response.data.UserName;
                                this.stUsuario.IdZona = response.data.IdZona;
                                this.verificacion = true;
                            }
                            else{
                                this.stUsuario.Nombre = "";
                                this.stUsuario.Email = "";
                                this.stUsuario.IdVendedor = 0;
                                this.stUsuario.Usuario = "";
                                this.stUsuario.IdZona = 0 ;
                                this.verificacion = false;
                            }
                        })

                    }
                    else if(this.stUsuario.IdSubTipoUsuario == this.usSubTipoSupervisor && this.stUsuario.Usuario!=""){
                        //Comprobar datos de supervisor
                        axios.get(process.env.VUE_APP_RUTA_API+"/api/usuarios/verificar-supervisor/"+this.stUsuario.Usuario)
                        .then(response =>{
                            if(response.status == 200 ){
                                this.stUsuario.Nombre = response.data.Nombre;
                                this.stUsuario.Email = response.data.Email;
                                this.stUsuario.IdVendedor = response.data.IdVendedor;
                                this.stUsuario.IdZona = response.data.IdZona;
                                this.verificacion = true;
                            }
                            else{
                                this.stUsuario.Nombre = "";
                                this.stUsuario.Email = "";
                                this.stUsuario.IdVendedor = 0;
                                this.stUsuario.Usuario = "";
                                this.stUsuario.Idzona =0;
                                this.verificacion = false;
                            }
                        })
                    }
                    else if(this.stUsuario.Usuario != ""){
                        //Comprobar datos de usuario desa general 
                        axios.get(process.env.VUE_APP_RUTA_API+"/api/usuarios/verificar-usuario/"+this.stUsuario.Usuario)
                        .then(response =>{
                            if(response.status == 200){
                                this.stUsuario.Nombre = response.data.Nombre;
                                this.stUsuario.Email = response.data.Email;
                                this.stUsuario.IdVendedor = response.data.IdUsuario;
                                this.stUsuario.IdZona = response.data.IdZona;
                                this.verificacion = true;
                            }
                            else
                            {
                                this.stUsuario.Nombre = "";
                                this.stUsuario.Email = "";
                                this.stUsuario.IdVendedor = 0;
                                this.stUsuario.IdZona = 0;
                                this.verificacion = false;
                            }
                        })
                    }
                }
            },
            ResetFormulario(){
                this.$emit('exit',true);
            },
            SeleccionSubTipo(){
                this.stUsuario.Nombre = "";
                this.stUsuario.Email = "";
                this.stUsuario.IdVendedor = 0;
                this.stUsuario.Usuario = ""
                this.auxiliarContrasena = "";
                this.auxiliarConfContrasena = "";
                this.subTipo = false;
            }
        }
    }
</script>

<style scoped>
    #subUsuarios{
        position: relative;
        margin-top: -2%;
        display: block;
        padding-bottom: 20px;
    }
    .marginTop-24{
        margin-top: -24px;
    }
    .marginTop-10{
        margin-top: 10px;
    }
    .scroll{
        overflow-y: scroll;
        max-height: 100px;
    }
</style>