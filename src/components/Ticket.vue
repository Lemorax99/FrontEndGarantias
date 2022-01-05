<template>
  <div>

    <v-dialog v-model="dialog" persistent max-width="1000px">
      
      <template v-slot:activator="{ off, attrs }">
        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="off" @click="AgregarTicket">Agregar Ticket</v-btn>
      </template>
      
      <v-card>                                     
        
        <v-card-title>
          <v-row>
            <v-col cols="6" sm="6" md="6">
              <span class="text-h5">{{ formTitle }}</span> 
            </v-col>
            <v-col cols="5" sm="5" md="5">
              <span v-if="this.ticketNvo == false" class="close"> Fecha : {{this.stTicket.FechaTicket}}</span>
            </v-col>
            <v-col cols="1" sm="1" md="1">
              <v-btn class="close" style="background: white;" fab small elevation="0" @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        
        <v-card-text>           
          <v-toolbar elevation="3">
            <v-tabs v-model="tabs">
              <v-tab>Detalle</v-tab>
              <v-tab @click="ReasignaStTicket();">Imagenes</v-tab>
              <v-tab v-if="this.ticketNvo == false">Formatos</v-tab>
            </v-tabs>
          </v-toolbar>
        
          <v-tabs-items v-model="tabs">      
            <v-form ref="formTicket">

              <!-- DETALLE -->
              <v-tab-item class="marginTop10">
                <v-card elevation="3" outlined class="contentBody">
                  
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="* Distribuidor" v-model="stAsignacion.Nombre" outlined dense autocomplete="off" v-if="this.stAsignacion.IdTipoUsuario == this.usDistribuidor" :disabled="true"></v-text-field>
                        <v-text-field label="* Cliente" v-model="stAsignacion.Nombre" outlined dense autocomplete="off" v-if="this.stAsignacion.IdTipoUsuario == this.usCliente" :disabled="true"></v-text-field>
                        <v-select label="* Motivo" v-on:change="ActualizarStTicket('Motivo', $event)" v-model="stTicket.Motivo" :items="arMotivos" item-text="Motivo" item-value="IdMotivo" outlined dense :rules="[() => (!!stTicket.Motivo.IdMotivo ) || 'Campo requerido']" ref="refIdMotivo" @change="FocusTitulo"></v-select>
                        <v-text-field label="* Titulo" v-on:change="ActualizarStTicket('Titulo', $event)" v-model="stTicket.Titulo" outlined dense autocomplete="off" :rules="[() => (!!stTicket.Titulo) || 'Campo requerido']" ref="refTitulo" v-on:keypress="ValTitulo($event)" v-on:keyup.enter="FocusGuia"></v-text-field>
                        <v-text-field label=" Guia" v-on:change="ActualizarStTicket('Guia', $event)" v-model="stTicket.Guia" outlined dense autocomplete="off" ref="refGuia" v-on:keypress="ValGuia($event)" v-on:keyup.enter="FocusFactura"></v-text-field>              
                        <v-text-field label="* Distribuidor" v-on:change="ActualizarStTicket('Distribuidor', $event)" v-model="stTicket.Distribuidor" outlined dense autocomplete="off" ref="refDistribuidor" v-if="this.stAsignacion.IdTipoUsuario == this.usCliente" :rules="[() => (!!stTicket.Distribuidor || !clienteIdentificado) || 'Campo requerido']"  v-on:keypress="ValTitulo($event)" v-on:keyup.enter="FocusComentario"></v-text-field>              
                      </v-col>
                    </v-row>

                    <v-row class="marginTop-24" v-if="this.stAsignacion.IdTipoUsuario == this.usDistribuidor ">
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="* Factura" v-on:change="ActualizarStTicket('NoFactura', $event)" v-model="stTicket.NoFactura" outlined dense autocomplete="off" :rules="[() => (!!stTicket.NoFactura || !clienteIdentificado) || 'Campo requerido']" ref="refNoFactura" v-on:keypress="ValFactura($event)" v-on:keyup.enter="FocusBuscarFac"></v-text-field>                
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field class="xsMarginTop errorCjaBloqueada" label="* Fecha Factura" v-model="stTicket.FechaFactura" outlined dense autocomplete="off" :rules="[() => (!!stTicket.FechaFactura || !clienteIdentificado) || 'Campo requerido']" ref="refFechaFactura" :disabled="true"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="2">
                        <div class="text-center">
                          <v-btn color="primary" class="xsMarginTop" @click="BuscarFactura();" ref="refBuscarFac" v-on:keyup.enter="FocusComentario">Buscar</v-btn>
                        </div>              
                      </v-col>
                    </v-row>
    
                    <v-row class="marginTop0">
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea label="Comentario" v-on:change="ActualizarStTicket('Comentario', $event)" v-model="stTicket.Comentario" value="" rows="3" outlined ref="refComentario" v-on:keypress="ValComentario($event)" v-on:keyup.enter="FocusBtnSigDetalle"></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                
                </v-card>   
                
                <v-card elevation="3" outlined class="marginTop10">          
                  <v-card-actions>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <div class="text-right">
                          <v-btn color="primary" outlined small ref="refBtnSigDetalle" @click="CambiaPestanaImagenes(1)">Siguiente<v-icon>mdi-arrow-right-bold</v-icon></v-btn>
                        </div>
                      </v-col>
                    </v-row>            
                  </v-card-actions>
                </v-card>

              </v-tab-item>


              <!-- IMAGENES -->
              <v-tab-item class="marginTop10">
                
                <v-card elevation="3" outlined class="contentBody">
                  
                  <v-card-text>            
                    <v-row>
                      <v-col cols="12" sm="6" md="2">
                        <v-text-field label="* Producto" v-model="producto" outlined dense autocomplete="off" :disabled="cjaDisabled == true" :rules="[() => !!producto || 'Campo requerido']" ref="refProducto" v-on:keypress="ValProducto($event)" v-on:keyup.enter="FocusCantidad"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="2">
                        <v-text-field label="* Cantidad" class="xsMarginTop" v-model="cantidad" outlined dense autocomplete="off" :rules="[() => !!cantidad || 'Campo requerido']" ref="refCantidad" v-on:keypress="ValCantidad($event)" v-on:keyup.enter="FocusMotivo"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="2">
                        <v-text-field label="* Motivo" class="smMarginTop" v-model="motivo" outlined dense autocomplete="off" :rules="[() => !!motivo || 'Campo requerido']" ref="refMotivo" v-on:keypress="ValMotivo($event)" v-on:keyup.enter="FocusVendido"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="2">
                        <v-select label="* Vendido" class="smMarginTop" v-model="productoVendido" :items="arProductoVendido" item-text="Situacion" item-value="IdSituacion" outlined dense :rules="[() => this.productoVendido !== null || 'Campo requerido']" ref="refProductoVendido" @change="FocusImagen"></v-select>
                      </v-col>   
                      <v-col cols="12" sm="6" md="2">                
                        <v-file-input accept="image/*" label="Fotos" class="smMarginTop" v-model="arFiles" outlined dense multiple prepend-icon="mdi-camera" ref="refImagenes" @change="ResizeImagen(arFiles);"></v-file-input>
                      </v-col>                  
                      <v-col cols="12" sm="6" md="2">
                        <div class="text-center">
                          <v-btn color="primary" class="smMarginTop" @click="AgregarProducto();" v-show="ocultarAgregar">Agregar</v-btn>
                          <v-btn color="primary" class="smMarginTop" @click="ActualizarProducto();" v-show="ocultarActualizar">Actualizar</v-btn>
                        </div>
                      </v-col>                               
                    </v-row>
                    <v-row class="marginTop0">
                      <v-col cols="12">              
                        <v-card elevation="1" outlined>
                          <v-simple-table>
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th class="text-center">Producto</th>
                                  <th class="text-center">Cantidad</th>
                                  <th class="text-center">Descripción</th>
                                  <th class="text-center">Motivo</th>
                                  <th class="text-center">Vendido</th>
                                  <th class="text-center">Fotos</th>
                                  <th class="text-center"></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(v , c) in stTicket.Productos">
                                  <td>{{ v.Producto }}</td>
                                  <td>{{ v.Cantidad }}</td>
                                  <td>{{ v.Descripcion }}</td>
                                  <td>{{ v.Motivo }}</td>
                                  <td v-if="v.Vendido == true">Si</td>
                                  <td v-if="v.Vendido == false">No</td>
                                  <td>
                                    <div v-for="(imagen, cont) in v.Imagenes">
                                      <img :src="imagen" class="imgProducto"/>
                                    </div>
                                  </td>
                                  <td style="padding: 0px;">
                                    <v-btn @click="IdentificarProducto(v.Producto);" class="eventoEditar"><v-icon>mdi-pencil</v-icon></v-btn>
                                    <v-btn @click="EliminarProducto(v.Producto);" class="eventoEliminar"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
                                  </td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-card>              
                      </v-col>
                    </v-row>
                  </v-card-text>

                </v-card>  

                <v-card elevation="3" outlined class="marginTop10">          
                  <v-card-actions>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">                
                        <div class="text-left with66">
                          <v-btn color="primary" outlined small class="text-right" @click="CambiaPestana(0)"><v-icon>mdi-arrow-left-bold</v-icon>Atras</v-btn>
                          <v-btn color="primary" outlined small class="marginLeft10" @click="CambiaPestana(2)" v-if="this.ticketNvo == false">Formatos<v-icon>mdi-arrow-right-bold</v-icon></v-btn>
                        </div>
                        <div class="text-right with34">
                          <v-btn color="primary" :disabled="btnGardarDisabled == true" @click="GuardarTicket">Guardar</v-btn>                
                        </div>                
                      </v-col>
                    </v-row>            
                  </v-card-actions>
                </v-card>   

              </v-tab-item>


              <!-- FORMATOS -->
              <v-tab-item class="marginTop10">
                <v-card elevation="3" outlined class="contentBody">

                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <span class="text-h6">Descargar</span>               
                      </v-col>
                    </v-row>
                    <v-row class="marginTop0">
                      <v-col cols="12" sm="5" md="4">
                        <span>Solicitud.pdf</span><br>
                        <span>Ultimo Consumidor.pdf</span><br>
                        <span>Michelin.pdf</span><br>
                        <span>Pirelli.pdf</span>
                      </v-col>
                      <v-col cols="12" sm="3" md="3">
                        <div class="text-center">
                          <v-btn color="primary" class="xsMarginTop">Descargar</v-btn>
                        </div>
                      </v-col>
                    </v-row>

                    <br><hr><br>

                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <span class="text-h6">Adjuntar Formato</span>
                      </v-col>
                    </v-row>
                    <v-row class="marginTop0">
                      <v-col cols="12" sm="5" md="4">                        
                        <v-file-input accept="image/*" label="Formatos" v-model="arFilesFtoProducto" outlined dense multiple prepend-icon="mdi-camera" ref="refFtosProductos" @change="ResizeFormatosProducto(arFilesFtoProducto);"></v-file-input>
                      </v-col>
                      <v-col cols="6" sm="4" md="3">
                        <div class="text-center">
                          <v-btn color="primary" :disabled="btnFtosProductoDisabled == true" class="xsMarginTop" @click="AdjFormatosProductos">Adjuntar</v-btn>                          
                        </div>
                      </v-col>
                      <v-col cols="6" sm="3" md="2">
                        <div class="text-center">                          
                          <v-btn class="xsMarginTop" elevation="0" @click="EliminarFormatos(formatosProducto, 'FormatosProducto')"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" class="contFormatosTop">
                        <div class="text-center" v-for="(v, c) in this.stTicket.FormatosProducto">
                          <img :src="v.Formato" class="imgFormato"/>
                        </div>
                      </v-col>
                    </v-row>

                    <br><hr><br>

                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <span class="text-h6">Factura / Nota Cte Final</span>               
                      </v-col>
                    </v-row>
                    <v-row class="marginTop0">
                      <v-col cols="12" sm="5" md="4">
                        <v-file-input accept="image/*" label="Venta" v-model="arFilesFtoVenta" outlined dense multiple prepend-icon="mdi-camera" ref="refFtosVentas" @change="ResizeFormatosVenta(arFilesFtoVenta);"></v-file-input>
                      </v-col>
                      <v-col cols="6" sm="4" md="3">
                        <div class="text-center">
                          <v-btn color="primary" :disabled="btnFtosVentaDisabled == true" class="xsMarginTop" @click="AdjFormatosVentas">Adjuntar</v-btn>                          
                        </div>
                      </v-col>
                      <v-col cols="6" sm="3" md="2">
                        <div class="text-center">                          
                          <v-btn class="xsMarginTop" elevation="0" @click="EliminarFormatos(formatosVenta, 'FormatosVenta')"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" class="contFormatosTop">
                        <div class="text-center" v-for="(v, c) in this.stTicket.FormatosVenta">
                          <img :src="v.Formato" class="imgFormato"/>
                        </div>
                      </v-col>
                    </v-row>

                    <br><hr>

                  </v-card-text>
                </v-card>  

                <v-card elevation="3" outlined class="marginTop10">          
                  <v-card-actions>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <div class="text-left">
                          <v-btn color="primary" outlined small @click="CambiaPestana(1)"><v-icon>mdi-arrow-left-bold</v-icon>Atras</v-btn>                  
                        </div>
                      </v-col>
                    </v-row>            
                  </v-card-actions>
                </v-card>
              </v-tab-item>

            </v-form>
          </v-tabs-items>
        
        </v-card-text>
                
      </v-card>

    </v-dialog>

    <v-dialog v-model="dialog2" persistent max-width="500px">
      <v-card>
        <Asignacion ref="refAsignacion" @exit="Close()" :asigna=asigna />
        <!-- Botones de accion -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="Close()">
              Cerrar
          </v-btn>
          <v-btn depresed color="primary" @click="Asignacion()">
              Asignar
          </v-btn>
        </v-card-actions>
      </v-card>
      
    </v-dialog>

  </div>
</template>

  
<script>

  import axios from 'axios';
  import vuex from 'vuex';
  import { ErrorFormulario } from '@/utils/ManejadorErrores'
  import { ReSize, ImagenBase64, ToFile } from '@/utils/Imagenes'
  import Validaciones from '@/utils/Validaciones'
  import { Notificacion } from '@/utils/Estados'
  import Estado from '@/utils/Estados'
  import Asignacion from '@/components/Asignacion.vue';

  export default {
    name: 'Ticket',   
    components:{
      Asignacion
    } ,
    data () {
      return {
        tabs: null,
        usDesa: process.env.VUE_APP_UsuarioDesa,
        usDistribuidor: process.env.VUE_APP_UsuarioDistribuidor,
        usCliente: process.env.VUE_APP_UsuarioCliente,
        formatosProducto: process.env.VUE_APP_FormatoProducto,
        formatosVenta: process.env.VUE_APP_FormatoVenta,
        garantias: process.env.VUE_APP_SubTipoGarantia,
        arMotivos: [],
        producto: '',
        cantidad: '',
        motivo: '',
        productoVendido: null,
        arFiles: [],
        arArchivos: [],
        formErrores: false,
        arProductos: [],
        ocultarAgregar: true,
        ocultarActualizar: false,
        cjaDisabled: false,     
        btnGardarDisabled: false,
        arProductoVendido: [
          { IdSituacion: true, Situacion: 'Si' },
          { IdSituacion: false, Situacion: 'No' }
        ],        
        arProductosFinal: [],
        ticketNvo: true,
        dialog: false,
        dialog2: false,
        arImagenesTemp: [],
        arFilesFtoProducto: [],
        arFormatosProducto: [],
        btnFtosProductoDisabled: false,
        arFilesFtoVenta: [],
        arFormatosVenta: [],
        btnFtosVentaDisabled: false,
        clienteIdentificado: true,
        asigna: false
      }
    },
    computed:{

      ...vuex.mapState(['Sesion', 'stUsuario', 'stTicket','stAsignacion']),

      formTitle () {
        return this.ticketNvo === true ? 'Nuevo Ticket' : 'Actualizar Ticket'
      },      
      formDetalleDistribuidor(){
        return {
          refIdMotivo: this.stTicket.Motivo.IdMotivo,
          refTitulo: this.stTicket.Titulo,            
          refNoFactura: this.stTicket.NoFactura,
          refFechaFactura : this.stTicket.FechaFactura
        }
      },
      formFactura(){
        return {
          refNoFactura: this.stTicket.NoFactura
        }
      },
      formDetalleCliente(){        
        return {
          refIdMotivo: this.stTicket.Motivo.IdMotivo,
          refTitulo: this.stTicket.Titulo,                        
          refDistribuidor : this.stTicket.Distribuidor
        }
      },
      formClienteNoIdent(){        
        return {
          refIdMotivo: this.stTicket.Motivo.IdMotivo,
          refTitulo: this.stTicket.Titulo
        }
      },
      formProducto(){        
        return {
          refProducto: this.producto,
          refCantidad: this.cantidad,
          refMotivo: this.motivo,
          refProductoVendido: this.productoVendido
        }
      }      
    },
    mounted(){          
      this.ObtenerMotivos();
    },
    methods: {

      ...vuex.mapActions(['LlenaTicketAccion', 'LlenaNotiAccion', 'CerrarSesionAccion','LlenaAsignacionAccion']),
      
      // VALIDACION SOBRE INGRESO DE DATOS
      ValTitulo(evt) { Validaciones.Titulo(evt); },
      ValGuia(evt) { Validaciones.Guia(evt); },
      ValFactura(evt) { this.stTicket.FechaFactura = ''; Validaciones.Factura(evt); },
      ValComentario(evt) { Validaciones.Comentario(evt); },
      ValProducto(evt) { Validaciones.Producto(evt); },
      ValCantidad(evt) { Validaciones.Cantidad(evt); },
      ValMotivo(evt) { Validaciones.Motivo(evt); },

      // FOCUS
      FocusTitulo(){ this.stTicket.FechaFactura = ''; this.$refs.refTitulo.focus(); },
      FocusGuia(){ this.$refs.refGuia.focus(); },
      FocusFactura(){
        if(this.stAsignacion.IdTipoUsuario == this.usDistribuidor){
          this.$refs.refNoFactura.focus(); 
        }
        if(this.stAsignacion.IdTipoUsuario == this.usCliente){
          this.$refs.refDistribuidor.focus(); 
        }
      },
      FocusBuscarFac(){ this.$refs.refBuscarFac.$el.focus(); },
      FocusComentario(){ this.$refs.refComentario.focus(); },
      FocusBtnSigDetalle(){ this.$refs.refBtnSigDetalle.$el.focus(); },
      FocusCantidad(){ this.$refs.refCantidad.focus(); },
      FocusMotivo(){ this.$refs.refMotivo.focus(); },
      FocusVendido(){ this.$refs.refProductoVendido.focus(); },        
      FocusImagen(){ this.$refs.refImagenes.focus(); },

      // METODOS OPERATIVOS
      InicializaStTicket(){
        this.LlenaTicketAccion
          ({
              IdTicket: 0,
              Motivo: { IdMotivo: 0, Motivo: '' },
              Titulo: '',
              Guia: '',
              NoFactura: '',
              FechaFactura: '',
              Productos: [],
              Comentario: '',
              Distribuidor: ''
          })   
        this.producto = '';
        this.cantidad = '';
        this.motivo = '';
        this.productoVendido = null;
        this.arFiles = [];
        this.arProductos = [];
        this.arProductosFinal = [];
        this.btnGardarDisabled = false;
        this.arFilesFtoProducto = [];
        this.arFormatosProducto = [];
        this.btnFtosProductoDisabled = false;
        this.arFilesFtoVenta = [];
        this.arFormatosVenta = [];
        this.btnFtosVentaDisabled = false;
        this.EventoAgregar();

        if(this.stUsuario.IdTipoUsuario == this.usDistribuidor || this.stUsuario.IdTipoUsuario == this.usCliente){
          this.LlenaAsignacionAccion
          ({
            IdUsuario: this.stUsuario.IdUsuario,
            IdTipoUsuario: this.stUsuario.IdTipoUsuario,
            Usuario: this.stUsuario.Nombre,
            IdUsuarioAsigno: 0
          })
        }
      },
      AgregarTicket(){          
          if(this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioDesa || this.stUsuario.IdSubTipoUsuario == this.garantias){     
            this.asigna = false;       
            this.dialog2=true;            
            setTimeout(() => {              
              this.$refs.refAsignacion.InicializaStAsignacion()
              this.$refs.refAsignacion.$refs.formAsignacion.resetValidation()
            }, 250)
          }else{
            this.dialog = true;
            this.ticketNvo = true;
            setTimeout(() => {
              this.InicializaStTicket();
              this.$refs.formTicket.resetValidation();
              this.tabs = 0;

              this.stAsignacion.IdTipoUsuario = this.stUsuario.IdTipoUsuario;
              this.stAsignacion.Usuario = this.stUsuario.Usuario;
              this.stAsignacion.IdUsuario = this.stUsuario.IdUsuario;
              this.stAsignacion.Nombre = this.stUsuario.Nombre;
          }, 250)
        }
      },
      ConsultarTicket(idTicket){
        console.log(idTicket);
        this.InicializaStTicket();
        Estado.Ticket(idTicket, this.Sesion.Token, this.LlenaTicketAccion, this.CerrarSesionAccion);
        this.dialog = true;
        this.ticketNvo = false;
        console.log(this.stTicket);
        console.log(this.stUsuario)
        setTimeout(() => {
          this.$refs.formTicket.resetValidation();
          this.tabs = 0;
          //COMPROBAMOS SI ESTAMOS EDITANDO TICKET DESDE USUARIO DE GARANTIAS
          if (this.stTicket.IdUsuarioAsigno == this.stUsuario.IdUsuario){
            axios.get(process.env.VUE_APP_RUTA_API + '/api/usuarios/consultar-id/'+this.stTicket.IdUsuario,this.Sesion.Token)
              .then(response=>{
                if(response.status == 200){
                  this.stAsignacion.IdTipoUsuario = response.data.IdTipoUsuario
                  this.stAsignacion.IdUsuarioAsigno = this.stTicket.IdUsuarioAsigno;
                  this.stAsignacion.IdUsuario = this.stTicket.IdUsuario;
                  this.stAsignacion.Nombre = response.data.Nombre;
                }
              })
              .catch(error =>{
                console.log(error);
              })
          }
          else{
            this.stAsignacion.IdTipoUsuario = this.stUsuario.IdTipoUsuario;
            this.stAsignacion.IdUsuarioAsigno = this.stTicket.IdUsuarioAsigno;
            this.stAsignacion.IdUsuario = this.stTicket.IdUsuario;
            this.stAsignacion.Nombre = this.stUsuario.Nombre;
          }
        }, 250)
        
        // console.log(this.stAsignacion);
        // console.log(this.stUsuario);
      },
      AsignarTicket(Ticket){
        Estado.Ticket(Ticket.IdTicket, this.Sesion.Token, this.LlenaTicketAccion, this.CerrarSesionAccion);
        this.asigna = true;
        this.dialog2=true;
        setTimeout(() => {
          this.$refs.refAsignacion.InicializaStAsignacion();
          this.$refs.refAsignacion.$refs.formAsignacion.resetValidation();
        }, 250)
      },
      Close(){
          this.InicializaStTicket();
          try{
            this.$refs.refAsignacion.$refs.formAsignacion.resetValidation();
            this.$refs.refAsignacion.msjAdvertencia = '';
            this.$refs.refAsignacion.checkbox = false;
            this.$refs.formTicket.resetValidation();
            this.tabs = 0;
          }catch{

          }
          this.dialog2 = false
          this.dialog = false
          this.ticketNvo = true
      },
      Asignacion(){
        if(this.stAsignacion.IdTipoUsuario != 0 && this.stAsignacion.Nombre != "" ){
            if(this.$refs.refAsignacion.checkbox){
              this.clienteIdentificado = false;
            }else{
              this.clienteIdentificado = true;
            }
            this.dialog2 = false;
            if(!this.asigna){
              this.dialog = true;
              this.tabs = 0;
              setTimeout(() => {this.$refs.formTicket.resetValidation()},100);
            }
            else{
              this.GuardarTicket();
            }
        }
        else{
            ErrorFormulario(this.$refs.refAsignacion.formAsignacion, this.$refs.refAsignacion.$refs, this.formErrores);
        }
      },
      ReasignaStTicket(){
        if(this.ticketNvo == false){
          this.arProductos = this.stTicket.Productos;
          //console.log(this.stTicket.Productos);
        }
      },
      CambiaPestanaImagenes(numPestana) {   
        console.log("Siguiente : ", this.stAsignacion.IdTipoUsuario) 
        this.ReasignaStTicket();
        if(this.stAsignacion.IdTipoUsuario == this.usDistribuidor){
          console.log(this.stTicket);
          if(this.stTicket.Motivo.IdMotivo != 0 && this.stTicket.Titulo != '' && this.stTicket.NoFactura != '' && this.stTicket.NoFactura != null && this.stTicket.FechaFactura != ''){
            this.tabs = numPestana;
          }
          else{ 
            ErrorFormulario(this.formDetalleDistribuidor, this.$refs, this.formErrores);
          }
        }
        if(this.stAsignacion.IdTipoUsuario == this.usCliente){
          if(this.stTicket.Motivo.IdMotivo != 0 && this.stTicket.Titulo != '' && this.stTicket.Distribuidor != ''){
            this.tabs = numPestana;
          }
          else{
            ErrorFormulario(this.formDetalleCliente, this.$refs, this.formErrores);
          }
        }
        
        //PROCESO EN CASO DE EDITAR EL TICKET DESDE USUARIO GARANTIAS
        console.log(this.stUsuario.IdSubTipoUsuario,this.garantias);
        if(this.stUsuario.IdSubTipoUsuario == parseInt(this.garantias) && this.stAsignacion.IdTipoUsuario == this.usDesa){
          if(this.stTicket.Motivo.IdMotivo != 0 && this.stTicket.Titulo != ''){
            this.tabs = numPestana;
          }else{
            ErrorFormulario(this.formClienteNoIdent, this.$refs, this.formErrores);
          }
        }             
      },
      CambiaPestana(numPestana) {
        this.tabs = numPestana;
      },              
      ObtenerMotivos(){
        axios.get(process.env.VUE_APP_RUTA_API + '/api/motivos/obtener-motivos/true', this.Sesion.Token )
          .then(response => {
              //console.log(response);
              if(response.status == 200){
                this.arMotivos = response.data;
              }
          })
          .catch(error => {
              //console.log(error.response)                
              Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
              this.CerrarSesionAccion();                
          });
      },
      BuscarFactura(){        
        if(this.stTicket.Motivo.IdMotivo != 0){          
          if(this.stTicket.NoFactura != ''){
            axios.get(process.env.VUE_APP_RUTA_API + '/api/facturas/consultar-factura/' + this.stTicket.NoFactura + '/' + ((this.stTicket.Motivo.IdMotivo == process.env.VUE_APP_MotivoDevolucion) ? true : false), this.Sesion.Token)
              .then(response => {
                //console.log(response);
                if(response.status == 200){
                  this.ActualizarStTicket('FechaFactura', response.data.Fecha.replace('T', '').substr(0,10));
                  this.ActualizarStTicket('NoFactura', response.data.NoFactura);
                }
                if(response.status == 202){
                  this.ActualizarStTicket('FechaFactura', '');
                  Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, response.data)
                  this.FocusFactura();
                }
              })
              .catch(error => {
                  //console.log(error.response)
                  Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                  this.CerrarSesionAccion();
              });
          }
          else{
            ErrorFormulario(this.formFactura, this.$refs, this.formErrores);
          }
        }
        else{
          Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'Debe seleccionar un motivo')
        }
      },
      ResizeImagen(arFiles){
        //console.log(arFiles);
        this.arImagenesTemp = [];
        this.arArchivos = [];
        this.arArchivos = ReSize(arFiles)
        // COMPROBAR TAMAÑO
        //console.log(arFiles);
        //console.log(this.arArchivos);
      },
      ResizeFormatosProducto(arFilesFtoProducto){
        //console.log(arFilesFtoProducto);
        this.arFormatosProducto = [];
        this.arFormatosProducto = ReSize(arFilesFtoProducto)        
        // COMPROBAR TAMAÑO
        //console.log(arFilesFtoProducto);
        //console.log(this.arFormatosProducto);
      },
      ResizeFormatosVenta(arFilesFtoVenta){
        //console.log(arFilesFtoVenta);
        this.arFormatosVenta = [];
        this.arFormatosVenta = ReSize(arFilesFtoVenta)        
        // COMPROBAR TAMAÑO
        //console.log(arFilesFtoVenta);
        //console.log(this.arFormatosVenta);
      },
      AgregarProducto(){
        if(this.producto != '' && this.cantidad > 0 && this.motivo != '' && this.productoVendido != null){          
          if(this.arProductos.filter(v => v.Producto == this.producto).length == 0){
            if(this.arArchivos.length <= process.env.VUE_APP_MaximoFotos){
              if(this.ValidacionImagenes(this.producto, this.arArchivos) === true){
                axios.post(process.env.VUE_APP_RUTA_API + '/api/productos/obtener-producto', { 'Producto': '' + this.producto + '' }, this.Sesion.Token)
                .then(response => {
                  //console.log(response);
                  if(response.status == 200){                    
                    this.arProductos.push({ Producto: response.data.vchClavePcto, Cantidad: this.cantidad, Descripcion: response.data.vchDecripcion, Motivo: this.motivo, Vendido: this.productoVendido, Imagenes: ImagenBase64(this.arArchivos), Archivos: this.arArchivos })                    
                    //console.log(this.arProductos);                    
                    this.ActualizarStTicket('Productos', this.arProductos);
                    this.LimpiarAgregarProd();
                    //console.log(this.arProductos);
                  }
                  if(response.status == 202){                      
                    Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, response.data)
                  }
                })
                .catch(error => {
                    //console.log(error.response)                      
                    Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                    this.CerrarSesionAccion();
                });
              }else{                  
                Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'Ha llegado al limite maximo de fotos')
              }
            }else{
              Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'Maximo ' + process.env.VUE_APP_MaximoFotos + ' fotos por producto')
            }
          }else{               
            Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'El producto ya existe')
          }
        }else{
          ErrorFormulario(this.formProducto, this.$refs, this.formErrores);
        }
      },
      ValidacionImagenes(producto, arArchivos){
        let _respuesta = false;
        let TresGb = 3145728 // 3145728 kilobyte (kB) = 3 gigabyte (GB)
        let _sizeItem = 0;
        let _sizeItems = 0;
        // TAMAÑO DE IMAGENES POR INGRESAR
        arArchivos.forEach(v => {
          _sizeItem += v.size;
        });
        // TAMAÑO DE IMAGENES QUE ESTAN EN LA TABLA
        let arPrductosAux = this.arProductos.filter((v)=>{
          return v.Producto != producto
        });
        arPrductosAux.forEach(p => {
          arArchivos.forEach(v => {
            _sizeItems += v.size;
          });
        });
        //console.log((_sizeItem + _sizeItems) + ' < ' + TresGb);
        return ((_sizeItem + _sizeItems) < TresGb) ? true : false;
      },
      IdentificarProducto(producto){
        this.btnGardarDisabled = true;
        this.arProductos = this.stTicket.Productos
        const arProductosAct = this.arProductos.find(v => v.Producto == producto);
        this.producto = arProductosAct.Producto;
        this.cantidad = arProductosAct.Cantidad;
        this.motivo = arProductosAct.Motivo;        
        this.productoVendido = (arProductosAct.Vendido == true) ? true : false; //? this.arProductoVendido[0] : this.arProductoVendido[1];
        this.arFiles = arProductosAct.Archivos;          
        this.arImagenesTemp = {Imagenes: arProductosAct.Imagenes, Files: arProductosAct.Archivos };
        this.EventoActualizar();
      },
      EventoActualizar(){
        this.ocultarAgregar = false;
        this.ocultarActualizar = true;
        this.cjaDisabled = true;
      },
      ActualizarProducto(){
        if(this.arArchivos.length <= process.env.VUE_APP_MaximoFotos){
          if(this.ValidacionImagenes(this.producto, this.arArchivos) === true){ 
            this.btnGardarDisabled = false;
            this.arProductos.forEach(v => {
              if(v.Producto === this.producto){
                  v.Cantidad = this.cantidad;
                  v.Motivo = this.motivo;
                  v.Vendido = this.productoVendido;
                  v.Imagenes = (this.arArchivos.length == 0) ? this.arImagenesTemp.Imagenes : ImagenBase64(this.arArchivos);
                  v.Archivos = (this.arArchivos.length == 0) ? this.arImagenesTemp.Files : this.arArchivos;
                  this.arImagenesTemp = [];                  
              }
            });            
            this.ActualizarStTicket('Productos', this.arProductos);
            this.LimpiarAgregarProd();
            this.EventoAgregar();
          }else{            
            Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'Ha llegado al limite maximo de fotos')
          }
        }else{
          Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'Maximo ' + process.env.VUE_APP_MaximoFotos + ' fotos por producto')
        }
      },
      EliminarProducto(producto){
        this.arProductos = this.arProductos.filter((v)=>{
          return v.Producto != producto
        });
        this.ActualizarStTicket('Productos', this.arProductos);
        this.LimpiarAgregarProd();
        this.EventoAgregar();
      },
      LimpiarAgregarProd(){
        this.$refs.refProducto.reset();
        this.$refs.refCantidad.reset();
        this.$refs.refMotivo.reset();
        this.$refs.refProductoVendido.reset();
        this.$refs.refImagenes.reset();
      },
      EventoAgregar(){
        this.ocultarAgregar = true;
        this.ocultarActualizar = false;
        this.cjaDisabled = false;
      },      
      ActualizarStTicket(propiedad, valor){
        if(propiedad == 'Motivo'){
          valor = this.arMotivos.find(v => v.IdMotivo == valor);
        }        
        this.LlenaTicketAccion
        ({
            ...this.stTicket,
            [propiedad]: valor
        })
        //console.log(this.stTicket);
      },
      ValidarDetalle(){
        let _result = true;
        if(this.stAsignacion.IdTipoUsuario == this.usDistribuidor){
          if(this.stTicket.Motivo.IdMotivo == 0 || this.stTicket.Titulo == '' || this.stTicket.NoFactura == null || this.stTicket.NoFactura == '' || this.stTicket.FechaFactura == ''){
            this.CambiaPestana(0)
            ErrorFormulario(this.formDetalleDistribuidor, this.$refs, this.formErrores);            
            _result = false;
          }
        }
        if(this.stAsignacion.IdTipoUsuario == this.usCliente){
          if(this.stTicket.Motivo.IdMotivo == 0 || this.stTicket.Titulo == '' || this.stTicket.Distribuidor == ''){
            this.CambiaPestana(0)
            ErrorFormulario(this.formDetalleCliente, this.$refs, this.formErrores);
            _result = false;
          }
        }
        return _result;
      },
      GuardarTicket(){
        if(this.ValidarDetalle()){
          this.btnGardarDisabled = true;
          this.arProductosFinal = [];
          this.stTicket.Productos.forEach(v => {
              this.arProductosFinal.push({Producto: v.Producto, Cantidad: v.Cantidad, Motivo: v.Motivo, Vendido: v.Vendido,  Imagenes: v.Imagenes});
          });
          if(this.arProductosFinal.length > 0){
            let _body = {
                        'IdTicket': '' + this.stTicket.IdTicket + '',
                        'IdMotivo': '' + this.stTicket.Motivo.IdMotivo + '',
                        'Titulo': '' + this.stTicket.Titulo + '',
                        'Guia': '' + this.stTicket.Guia + '',
                        'Comentario': '' + this.stTicket.Comentario + '',
                        'TicketDetalle': this.arProductosFinal,
                        'IdUsuario': '' + this.stAsignacion.IdUsuario + '',
                        'DistribuidorCteFinal': '' + this.stTicket.Distribuidor + '',
                        'IdUsuarioAsigno': '' + this.stAsignacion.IdUsuarioAsigno + ''
                        };
            _body.NoFactura = this.stTicket.NoFactura == null ? "" : this.stTicket.NoFactura
            //console.log(_body);
            if(this.stTicket.IdTicket == 0){ 
              //señalamos que el ticket es de cliente no identificado
              if(this.clienteIdentificado && !this.asigna){
                _body.IdStatus = process.env.VUE_APP_StatusRegistro
              }
              else{
                _body.IdStatus = process.env.VUE_APP_StatusParcial
              }
              
              axios.post(process.env.VUE_APP_RUTA_API + '/api/tickets/registrar-ticket',  _body, this.Sesion.Token)
                .then(response => {
                  //console.log(response);
                  if(response.status == 200){
                    Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Success, response.data)                    
                    this.$emit('Mis-Tickets');
                    this.Close();
                  }
                })
                .catch(error => {
                  //console.log(error.response)                  
                  Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                  this.CerrarSesionAccion();
                });
            }
            else{

              
                axios.put(process.env.VUE_APP_RUTA_API + '/api/tickets/actualizar-ticket',  _body, this.Sesion.Token)
                .then(response => {
                    //console.log(response);
                    if(response.status == 200){
                      Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Success, response.data)                    
                      this.$emit('Mis-Tickets');
                      this.Close();                     
                    }
                })
                .catch(error => {
                    //console.log(error.response)                    
                    Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                    this.CerrarSesionAccion();
                });
            }   
          }else{
            Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'Debe ingresar al menos un producto')
            this.btnGardarDisabled = false;
          }
        }
      },
      AdjFormatosProductos(){
        this.btnFtosProductoDisabled = true;
        let arFormatosProdAux = [];
        let _formatos = ImagenBase64(this.arFormatosProducto);
        setTimeout(() => {
          _formatos.forEach(v => { arFormatosProdAux.push({ Formato: v, IdTipoFormato: process.env.VUE_APP_FormatoProducto }); });
          let _body = { 'IdTicket': '' + this.stTicket.IdTicket + '', 'Formatos': arFormatosProdAux };
          //console.log(_body);
          if(arFormatosProdAux.length > 0){
            this.AdjuntarFormatos('FormatosProducto', _body);
          }
          else{
            Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'Debe adjuntar al menos 1 archivo')
            this.btnFtosProductoDisabled = false;
          }
        }, 250)
      },
      AdjFormatosVentas(){
        this.btnFtosVentaDisabled = true;
        let arFormatosVenAux = [];
        let _formatos = ImagenBase64(this.arFormatosVenta);
        setTimeout(() => {
          _formatos.forEach(v => { arFormatosVenAux.push({ Formato: v, IdTipoFormato: process.env.VUE_APP_FormatoVenta }); });
          let _body = { 'IdTicket': '' + this.stTicket.IdTicket + '', 'Formatos': arFormatosVenAux };
          //console.log(_body);
          if(arFormatosVenAux.length > 0){
            this.AdjuntarFormatos('FormatosVenta', _body);
          }
          else{
            Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'Debe adjuntar al menos 1 archivo')
            this.btnFtosVentaDisabled = false;
          }
        }, 250)
      },
      AdjuntarFormatos(propiedad, body){       
        axios.put(process.env.VUE_APP_RUTA_API + '/api/tickets/adjuntar-formatos', body, this.Sesion.Token)
          .then(response => {
            //console.log(response);
            if(response.status == 200){
              this.ActualizarStTicket(propiedad, body.Formatos);
              Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Success, response.data)
              this.btnFtosProductoDisabled = false;
              this.arFilesFtoProducto = [];
              this.btnFtosVentaDisabled = false;
              this.arFilesFtoVenta = [];
            }
          })
          .catch(error => {
            //console.log(error.response)
            Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
            this.CerrarSesionAccion();
          });
      },
      EliminarFormatos(idTipoFormato, propiedad){
        if(this.stTicket[propiedad].length > 0){
          axios.delete(process.env.VUE_APP_RUTA_API + '/api/tickets/eliminar-formatos/' + this.stTicket.IdTicket + '/' + idTipoFormato, this.Sesion.Token)
            .then(response => {
                //console.log(response);
                if(response.status == 200){      
                  this.ActualizarStTicket(propiedad, []);                      
                  Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Success, response.data)
                }
                if(response.status == 202){                                            
                  Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, response.data)
                }
            })
            .catch(error => {
                //console.log(error.response)                        
                Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                this.CerrarSesionAccion();
            });
        }
        else{
          Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Warning, 'No hay formatos por eliminar')
        }
      }

    }
  }
</script>


<style scoped>  
  .contentBody{
    min-height: 500px;        
  }
  .marginTop0{
    margin-top: 0px;
  }
  .marginTop10{
    margin-top: 10px;
  }
  .marginTop-24{
    margin-top: -24px;
  }
  .marginLeft10{
    margin-left: 10px;
  }
  .with66{
    float: left;
    width: 66%;
  }
  .with34{
    float: left;
    width: 34%;
  }
  .eventoEditar{
    margin: 5px 5px 0 0;
  }
  .eventoEliminar{
    margin: 10px 0 5px 0;
  }
  .errorCjaBloqueada{
    color: red;
  }
  .close{
    float: right;    
    position: relative;  
  }
  .contFormatosTop{
    margin: -40px 0 0 0;
  }
  .imgFormato{
    float: right; 
    height: 60px; 
    margin: 5px 5px 5px 0px;
    width: 60px;
  }  
  .imgProducto{
    float: left;    
    height: 50px; 
    margin: 5px 5px 5px 0px;
    width: 50px;
  }
  
  @media screen and (min-width: 0px) and (max-width: 599px) {    
    .xsMarginTop{
      margin-top: -20px;
    } 
    .contFormatosTop{
      margin: 10px 0 0 0;
    }
  }

  @media screen and (min-width: 600px) and (max-width: 959px) {    
    .smMarginTop{
      margin-top: -20px;
    }
    .contFormatosTop{
      margin: -20px 0 0 0;
    }
  }
</style>