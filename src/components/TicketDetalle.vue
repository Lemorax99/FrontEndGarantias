<template>
    <div>        
        
        <v-dialog v-model="dialog" persistent max-width="1000px">            
            <v-card>

                <v-card-title>
                    <v-row>
                      <v-col cols="9" sm="9" md="9">
                        <span class="text-h5">Ticket Detalle</span> 
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        <v-btn class="close" style="background: white;" fab small elevation="0" @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
                      </v-col>
                    </v-row>
                </v-card-title>

                <v-card-text>

                    <v-toolbar elevation="3">
                        <v-tabs v-model="tabs">
                            <v-tab>Detalle</v-tab>
                            <v-tab>Imagenes</v-tab>
                            <v-tab>Formatos</v-tab>
                        </v-tabs>        
                    </v-toolbar>

                    <v-tabs-items v-model="tabs">      
                        <v-form v-model="valid" ref="formTicketDetalle">
                        
                            <!-- DETALLE -->
                            <v-tab-item class="marginTop10">
                                <v-card elevation="3" outlined class="contentBody">
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12">
                                                <p class="pHeader"><b>Fecha ticket:</b> {{ stTicket.FechaTicket }}</p>
                                                <p class="pHeader"><b>Cliente:</b> {{ stTicket.Nombre }}</p>
                                                <p class="pHeader"><b>Titulo:</b> {{ stTicket.Titulo }}</p>
                                                <p class="pHeader"><b>Motivo:</b> {{ stTicket.Motivo.Motivo }}</p>
                                                <p class="pHeader"><b>Guia:</b> {{ stTicket.Guia }}</p>
                                                <p class="pHeader"><b>Comentario:</b> {{ stTicket.Comentario }}</p><br>
                                                <p class="pHeader" v-if="this.stTicket.Distribuidor != ''"><b>Compra con distribuidor:</b> {{ stTicket.Distribuidor }}</p>
                                                <p class="pHeader" v-if="this.stTicket.NoFactura != null"><b>Factura:</b> {{ stTicket.NoFactura }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Fecha Factura:</b> {{ stTicket.FechaFactura }}</p>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-checkbox class="cbxCartaFletera" :label="`Carta fletera`" v-on:change="ActualizarStTicket('RptCartaFletera', $event); AnexarCartaFletera();" v-model="stTicket.RptCartaFletera"></v-checkbox>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-textarea label="* Comentario Dictamen" v-on:change="ActualizarStTicket('ComentarioDictamen', $event)" v-model="stTicket.ComentarioDictamen" value="" rows="5" outlined :rules="[() => !!stTicket.ComentarioDictamen || 'Campo requerido']" ref="refComentarioDictamen" v-on:keypress="ValComentario($event)" v-on:keyup.enter="FocusComentarioDC"></v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-textarea label="* Comentario Nota de Crédito" v-on:change="ActualizarStTicket('ComentarioNC', $event)" v-model="stTicket.ComentarioNC" value="" rows="5" outlined :rules="[() => !!stTicket.ComentarioNC || 'Campo requerido']" ref="refComentarioNC" v-on:keypress="ValComentario($event)" v-on:keyup.enter="FocusBtnGuardar"></v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <div class="text-right">
                                                    <v-btn color="primary btnsTickets" ref="refBtnRechazar" @click="AutorizarTicket(false)">Rechazar</v-btn>
                                                    <v-btn color="primary btnsTickets" ref="refBtnAutorizar" @click="AutorizarTicket(true)">Autorizar</v-btn>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>

                            <!-- IMAGENES -->
                            <v-tab-item class="marginTop10">                                
                                <v-card elevation="3" outlined class="contentBody">
                                    
                                    <v-col cols="12" sm="12" md="12">                                                       
                                        <v-simple-table>
                                            <template v-slot:default>
                                                <thead>
                                                    <tr>
                                                        <th class="text-left">Producto</th>
                                                        <th class="text-left">Cantidad</th>
                                                        <th class="text-left">Descripción</th>
                                                        <th class="text-left">Motivo</th>
                                                        <th class="text-left">Vendido</th>                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="v in stTicket.Productos" @click="IdentificarProducto(v.Producto);">
                                                        <td>{{ v.Producto }}</td>
                                                        <td>{{ v.Cantidad }}</td>
                                                        <td>{{ v.Descripcion }}</td>
                                                        <td>{{ v.Motivo }}</td>                                                        
                                                        <td v-if="v.Vendido == true">Si</td>
                                                        <td v-if="v.Vendido == false">No</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">                                        
                                        <v-carousel>
                                            <v-carousel-item v-for="(imagen, i) in imagenes" :key="i" reverse-transition="fade-transition" transition="fade-transition">
                                                <div class="centerImg">                                                
                                                    <img :src="imagen"/>
                                                </div>
                                            </v-carousel-item>
                                        </v-carousel>
                                    </v-col>
                                </v-card>
                            </v-tab-item>

                            <!-- FORMATOS -->
                            <v-tab-item class="marginTop10">
                                <v-card elevation="3" outlined class="contentBody">
                                    
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <div class="text-center" style="margin: 15px 0 0 0;">
                                                <v-btn color="primary" @click="IdentificarFormatoProducto" style="margin: 0 15px 0 0;">Producto <v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
                                                <v-btn color="primary" @click="IdentificarFormatoVenta">Venta &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
                                            </div>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">                                        
                                            <v-carousel>
                                                <v-carousel-item v-for="(v, i) in formatos" :key="i" reverse-transition="fade-transition" transition="fade-transition">
                                                    <div class="centerImg">                                                
                                                        <img :src="v.Formato"/>
                                                    </div>
                                                </v-carousel-item>
                                            </v-carousel>
                                        </v-col>
                                    </v-row>


                                </v-card>
                            </v-tab-item>

                        </v-form>
                    </v-tabs-items>

                </v-card-text>
                
            </v-card>
        </v-dialog>

    </div>
</template>


<script>

    import axios from 'axios';
    import vuex from 'vuex';
    import { ErrorFormulario } from '@/utils/ManejadorErrores'
    import Estado from '@/utils/Estados'
    import Validaciones from '@/utils/Validaciones'
    import { Notificacion } from '@/utils/Estados'   
    import SinImagen from '@/assets/imagendefault.png' 
    import SinReporte from '@/assets/formatodefault.png'

    export default {
        name: 'TicketDetalle',
        data(){
            return {
                tabs: null,
                dialog: false,
                imagenes: [],
                formatos: [],                
                formErrores: false,
                valid: true                
            }
        },
        computed:{
            ...vuex.mapState(['Sesion', 'stTicket']),

            formDictamen(){
                return {
                    refComentarioDictamen: this.stTicket.ComentarioDictamen,
                    refComentarioNC: this.stTicket.refComentarioNC
                }
            },
        }, 
        mounted(){
            if(this.Sesion.Token == false){
                this.$router.push({path:'/'});
            }            
        },  
        updated() {
            this.$refs.formTicketDetalle.resetValidation();            
        },      
        methods: {

            ...vuex.mapActions(['LlenaTicketAccion', 'LlenaNotiAccion', 'CerrarSesionAccion']),
                  
            // VALIDACION SOBRE INGRESO DE DATOS
            ValComentario(evt) { Validaciones.Comentario(evt); },

            // FOCUS
            FocusComentarioDC(){ this.$refs.refComentarioDictamen.focus(); },
            FocusBtnGuardar(){ this.$refs.refBtnAutorizar.$el.focus(); },
            
            // METODOS OPERATIVOS           
            Close(){
                this.dialog = false;
                this.$emit('Revicion-Tickets');               
            },
            ConsultarTicket(idTicket){
                this.dialog = true;
                this.imagenes = [];
                this.formatos = [];
                this.tabs = 0;
                Estado.Ticket(idTicket, this.Sesion.Token, this.LlenaTicketAccion, this.CerrarSesionAccion)
            },
            ActualizarStTicket(propiedad, valor){
                this.LlenaTicketAccion
                ({
                    ...this.stTicket,
                    [propiedad]: valor
                })
                //console.log(this.stTicket);
            },
            AnexarCartaFletera(){
                let _body = {
                            'IdTicket': '' + this.stTicket.IdTicket + '',
                            'RptCartaFletera': '' + this.stTicket.RptCartaFletera + '',
                            'IdStatus': '' + process.env.VUE_APP_EvaluacionCaso + ''
                            };
                axios.put(process.env.VUE_APP_RUTA_API + '/api/tickets/anexar-carta-fletera', _body, this.Sesion.Token)
                .then(response => {
                    //console.log(response);
                    if(response.status == 200){
                        Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Success, response.data)
                    }
                })
                .catch(error => {
                    //console.log(error.response)                    
                    Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                    this.CerrarSesionAccion();
                });
            },     
            ValidarDictamen(){
                let _result = true;                
                if(this.stTicket.ComentarioDictamen == '' || this.stTicket.ComentarioDictamen == null){                    
                    ErrorFormulario(this.formDictamen, this.$refs, this.formErrores);            
                    _result = false;
                }                             
                return _result;
            },       
            AutorizarTicket(autorizar){ 
                if(this.ValidarDictamen() == true){
                    let _body = {
                                'IdTicket': '' + this.stTicket.IdTicket + '',                            
                                'ComentarioDictamen': '' + this.stTicket.ComentarioDictamen + '',
                                'ComentarioNC': '' + this.stTicket.ComentarioNC + '',
                                'IdStatus': '' + ((autorizar == true) ? process.env.VUE_APP_TicketAutorizado : process.env.VUE_APP_TicketRechazado) + '',
                                };                            
                    axios.put(process.env.VUE_APP_RUTA_API + '/api/tickets/autorizar-ticket', _body, this.Sesion.Token)
                    .then(response => {
                        //console.log(response);
                        if(response.status == 200){
                            this.dialog = false;
                            this.$emit('Revicion-Tickets');
                        }
                    })
                    .catch(error => {
                        //console.log(error.response)                    
                        Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                    // this.CerrarSesionAccion();
                    });
                }
            },
            IdentificarProducto(producto){                
                this.imagenes = [];
                const arProducto = this.stTicket.Productos.find(v => v.Producto == producto);
                if(arProducto.Imagenes.length > 0){                    
                    this.imagenes = arProducto.Imagenes;                    
                }else{                     
                    this.imagenes = [SinImagen];
                }
            },
            IdentificarFormatoProducto(){
                this.formatos = [];
                if(this.stTicket.FormatosProducto.length > 0){                    
                    this.formatos = this.stTicket.FormatosProducto;                    
                }else{                     
                    this.formatos = [{Formato: SinReporte}];
                }                
            },
            IdentificarFormatoVenta(){
                this.formatos = [];
                if(this.stTicket.FormatosVenta.length > 0){                    
                    this.formatos = this.stTicket.FormatosVenta;                    
                }else{                     
                    this.formatos = [{Formato: SinReporte}];
                }
            }
            
        }
    }
    
</script>


<style scoped>    
    .pHeader{
        margin: 0px 0 0 0;
    }   
    .close{
        float: right;    
        position: relative;  
    }
    .marginTop10{
        margin-top: 10px;
    }
    .contentBody{
        min-height: 565px;        
    }
    .btnsTickets{
        margin: 50px 0 0 15px;
    }
    .cbxCartaFletera{
        height: 25px; 
        margin: 0;
    }
    .centerImg{        
        display: flex;        
        height: 100%;
        justify-content: center;  
    }

    @media screen and (min-width: 0px) and (max-width: 599px) {    
        .btnsTickets{
            margin: 0px 0 0 15px;
        } 
        .centerImg{
            display: flex;        
            height: 90%;
            justify-content: center;  
        }
    }
</style>