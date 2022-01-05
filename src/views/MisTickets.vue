<template>    
    <v-container>
        <v-row>
            <v-col cols="12">     
                <v-card elevation="15" class="text-center" outlined>
                    <v-data-table :headers="headers" :items="misTickets" class="elevation-1 paddingTabla">
                        <template v-slot:top>
                            <v-toolbar flat >                            
                                <span class="text-h5">Mis Tickets</span>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
                                <Ticket ref="refTicket" @Mis-Tickets="MisTickets"/>
                                <v-dialog v-model="dialogDelete" persistent max-width="500px">
                                    <v-card>
                                        <v-card-title class="text-h5">¿Desea eliminar el Ticket?</v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="CloseDelete">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="DeleteItemConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogCF" persistent max-width="500px">
                                    <v-form ref="formDireccion">
                                        <v-card elevation="3" outlined>
                                            <v-card-title class="text-h5">
                                                <v-row>
                                                    <v-col cols="9" sm="9" md="9">
                                                        <span class="text-h5">Dirección</span> 
                                                    </v-col>
                                                    <v-col cols="3" sm="3" md="3">
                                                        <v-btn class="closeCF" style="background: white;" fab small elevation="0" @click="CloseCF()"><v-icon>mdi-close</v-icon></v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-text-field label="* Dirección" v-model="direccion" outlined dense autocomplete="off" :rules="[() => !!direccion || 'Campo requerido']" ref="refDireccion" v-on:keypress="ValDireccion($event)" v-on:keyup.enter="FocusColonia"></v-text-field>
                                                <v-text-field label="* Colonia" v-model="colonia" outlined dense autocomplete="off" :rules="[() => !!colonia || 'Campo requerido']" ref="refColonia" v-on:keypress="ValColonia($event)" v-on:keyup.enter="FocusPoblacion"></v-text-field>
                                                <v-text-field label="* Poblacion" v-model="poblacion" outlined dense autocomplete="off" :rules="[() => !!poblacion || 'Campo requerido']" ref="refPoblacion" v-on:keypress="ValPoblacion($event)" v-on:keyup.enter="FocusCodigoPostal"></v-text-field>
                                                <v-text-field label="* Codigo Postal" v-model="codigoPostal" outlined dense autocomplete="off" :rules="[() => !!codigoPostal || 'Campo requerido']" ref="refCodigoPostal" v-on:keypress="ValCodigoPostal($event)" v-on:keyup.enter="FocusTelefono"></v-text-field>
                                                <v-text-field label="* Telefono" v-model="telefono" outlined dense autocomplete="off" :rules="[() => !!telefono || 'Campo requerido']" ref="refTelefono" v-on:keypress="ValTelefono($event)" v-on:keyup.enter="FocusDescargarCF"></v-text-field>
                                            </v-card-text>
                                            <v-card-actions>
                                            <v-spacer></v-spacer>                                                                                        
                                                <v-btn color="primary" @click="ObtenerCartaFleteraCte" ref="refDescargarCF">Descargar</v-btn>  
                                            <v-spacer></v-spacer>
                                            </v-card-actions>
                                        </v-card>
                                    </v-form>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon class="mr-2" @click="AsignarTicket(item)" title="Asignar ticket al cliente" v-if="stUsuario.IdSubTipoUsuario == 4 && item.IdUsuarioAsigno == item.IdUsuario">mdi-clipboard-account</v-icon>
                            <v-icon class="mr-2" @click="ConsultarTicket(item)">mdi-pencil</v-icon>
                            <v-icon class="mr-2" @click="DeleteItem(item)">mdi-delete</v-icon>
                            <v-icon @click="CartaFletera(item)" v-show="item.RptCartaFletera == true" id='dwnldLnk'>mdi-file-download-outline</v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>   

    import axios from 'axios';
    import vuex from 'vuex';
    import { ErrorFormulario } from '@/utils/ManejadorErrores'
    import Ticket from "@/components/Ticket.vue";
    import { Notificacion } from '@/utils/Estados'
    import Validaciones from '@/utils/Validaciones'
    import Estado from '@/utils/Estados'
    import { Base64ToArray } from '@/utils/Pdf'
    

    export default {
        name: 'MisTickets',
        components: {
            Ticket
        },
        data(){
            return {
                dialogDelete: false,
                dialogCF: false,
                formErrores: false,
                headers: [],
                misTickets: [],                
                eliminarTicket: [],
                idTicketCte: 0,
                direccion: '',
                colonia: '',
                poblacion: '',
                codigoPostal: '',
                telefono: '',
                supervisor: process.env.VUE_APP_SubTipoSupervisor 
            }
        },
        computed:{

            ...vuex.mapState(['Sesion', 'stUsuario']),

            formDireccion(){
                return {
                    refDireccion: this.direccion,
                    refColonia: this.colonia,            
                    refPoblacion: this.poblacion,
                    refCodigoPostal : this.codigoPostal,
                    refTelefono : this.telefono
                }
            },
        },
        created(){
            this.HeaderTabla();
            this.MisTickets();            
        },
        mounted(){
            if(this.Sesion.Token == false){
                this.$router.push({path:'/'});
            }
            if(this.stUsuario.IdSubTipoUsuario == this.supervisor){
                this.$router.push({path: '/Home'})
            }
        },
        methods: {

            ...vuex.mapActions(['LlenaNotiAccion','CerrarSesionAccion']),

            // VALIDACION SOBRE INGRESO DE DATOS
            ValDireccion(evt) { Validaciones.Direccion(evt); },
            ValColonia(evt) { Validaciones.Colonia(evt); },
            ValPoblacion(evt) { Validaciones.Poblacion(evt); },
            ValCodigoPostal(evt) { Validaciones.CodigoPostal(evt); },
            ValTelefono(evt) { Validaciones.Telefono(evt); },

            // FOCUS
            FocusColonia(){ this.$refs.refColonia.focus(); },
            FocusPoblacion(){ this.$refs.refPoblacion.focus(); },
            FocusCodigoPostal(){ this.$refs.refCodigoPostal.focus(); },
            FocusTelefono(){ this.$refs.refTelefono.focus(); },
            FocusDescargarCF(){ this.$refs.refDescargarCF.$el.focus(); },

            // METODOS OPERATIVOS
            HeaderTabla(){
                if(this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioDistribuidor){
                    this.headers = [
                                    { text: 'Titulo', value: 'Titulo' },
                                    { text: 'Motivo', value: 'Motivo' },
                                    { text: 'Fecha', value: 'Fecha' },
                                    { text: 'No Factura', value: 'NoFactura' },
                                    { text: 'Status', value: 'StatusDesc' },
                                    { text: 'Acciones', value: 'actions', sortable: false }
                                   ]
                }
                if(this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioCliente){
                    this.headers = [
                                    { text: 'Titulo', value: 'Titulo' },
                                    { text: 'Motivo', value: 'Motivo' },
                                    { text: 'Fecha', value: 'Fecha' },                                    
                                    { text: 'Status', value: 'StatusDesc' },
                                    { text: 'Acciones', value: 'actions', sortable: false }
                                   ]
                }
                if(this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioDesa){
                    this.headers = [
                                    {text: 'Titulo', value: 'Titulo'},
                                    {text: 'Motivo', value: 'Motivo'},
                                    {text: 'Fecha', value: 'Fecha'},
                                    {text: 'Status', value: 'StatusDesc'},
                                    {text: 'Acciones', value: 'actions', sortable:false}
                                    ]
                }      
            },
            MisTickets(){                        
                axios.get(process.env.VUE_APP_RUTA_API + '/api/tickets/mis-tickets/' + this.Sesion.IdUsuario, this.Sesion.Token)
                .then(response => {
                    //console.log(response);
                    if(response.status == 200){
                        response.data.forEach(v => {
                            v.Fecha = v.Fecha.replace('T', '').substr(0,10)
                        });
                        this.misTickets = response.data;
                        //console.log(this.misTickets);
                    }
                })
                .catch(error => {
                    //console.log(error.response)                    
                    Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                    this.CerrarSesionAccion();
                });
            },
            ConsultarTicket(item){                                                                             
                this.$refs.refTicket.ConsultarTicket(item.IdTicket);                                
            },
            CloseDelete(){                
                this.dialogDelete = false                    
            },
            CloseCF(){                
                this.dialogCF = false                    
            },
            DeleteItem(item){
                this.eliminarTicket = Object.assign({}, item)
                this.dialogDelete = true
            },
            DeleteItemConfirm(){
                axios.delete(process.env.VUE_APP_RUTA_API + '/api/tickets/eliminar-ticket/' + this.eliminarTicket.IdTicket, this.Sesion.Token)
                    .then(response => {
                        //console.log(response);
                        if(response.status == 200){                            
                            this.CloseDelete()
                            this.MisTickets()
                        }
                    })
                    .catch(error => {
                        //console.log(error.response)                        
                        Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                        this.CerrarSesionAccion();
                    });                
            },
            AsignarTicket(item){
                this.$refs.refTicket.AsignarTicket(item);
            },
            CartaFletera(item){  
                if(this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioDistribuidor){                    
                    this.ObtenerCartaFleteraDist(item.IdTicket);
                }
                if(this.stUsuario.IdTipoUsuario == process.env.VUE_APP_UsuarioCliente){
                    this.dialogCF = true;
                    this.idTicketCte = item.IdTicket;
                    this.direccion = '';
                    this.colonia = '';
                    this.poblacion = '';
                    this.codigoPostal = '';
                    this.telefono = '';
                    setTimeout(() => {
                        this.$refs.formDireccion.resetValidation();
                    }, 50)
                }
            },
            ObtenerCartaFleteraDist(idTicket){                
                axios.get(process.env.VUE_APP_RUTA_API + '/api/reportes/obtener-carta-fletera-distribuidor/' + idTicket, this.Sesion.Token)
                    .then(response => {
                        //console.log(response);
                        if(response.status == 200){
                            this.DescargarCartaFletera(response.data);
                        }
                        if(response.status == 202){                            
                            Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, response.data)
                        }
                    })
                    .catch(error => {
                        //console.log(error.response)                        
                        Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                        this.CerrarSesionAccion();
                    });
            },
            ObtenerCartaFleteraCte(){
                if(this.direccion != '' && this.colonia != '' && this.poblacion != '' && this.codigoPostal != '' && this.telefono != ''){
                    let _body = {                        
                        'IdCliente': '' + this.stUsuario.IdUsuario + '',
                        'Nombre': '' + this.stUsuario.Nombre + '',
                        'Direccion': '' + this.direccion + '',
                        'Colonia': '' + this.colonia + '',
                        'Poblacion': '' + this.poblacion + '',
                        'CodigoPostal': '' + this.codigoPostal + '',
                        'Telefono': '' + this.telefono + ''                        
                    };                   
                    axios.put(process.env.VUE_APP_RUTA_API + '/api/reportes/obtener-carta-fletera-cliente/' + this.idTicketCte, _body, this.Sesion.Token)
                    .then(response => {
                        //console.log(response);
                        if(response.status == 200){
                            this.DescargarCartaFletera(response.data); 
                            this.CloseCF();                           
                        }
                        if(response.status == 202){                            
                            Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, response.data)
                        }
                    })
                    .catch(error => {
                        //console.log(error.response)                        
                        Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                        this.CerrarSesionAccion();
                    });                    
                }else{
                    ErrorFormulario(this.formDireccion, this.$refs, this.formErrores); 
                }
            },
            DescargarCartaFletera(bytes){    
                //https://stackoverflow.com/questions/55215821/how-to-convert-some-base64-string-to-pdf-using-javascript/55216195
                const arPdfByte = Base64ToArray(bytes);                           
                let blobStore = new Blob([arPdfByte], { type: "application/pdf" });                            
                if (window.navigator && window.navigator.msSaveOrOpenBlob) { window.navigator.msSaveOrOpenBlob(blobStore); return; }
                let data = window.URL.createObjectURL(blobStore);
                let link = document.createElement('a');
                document.body.appendChild(link);
                link.href = data;
                link.download = "CartaFletera.pdf";
                link.click();
                window.URL.revokeObjectURL(data);
                link.remove();
                this.MisTickets();
            }           
            

        }
    }
    
</script>


<style scoped>
    .paddingTabla{      
        padding: 30px;
    }
    .acciones{
        margin: -50px 0 0 0;
    }
    .advertencia{
      color: red;
      font-size: 14px;
    }
    .closeCF{
        float: right;    
        position: relative;  
    }
</style>