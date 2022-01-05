<template>
    <v-row>
        <v-col cols="12">
            <v-card elevation="15" class = "text-center" outlined >
                <v-data-table :headers="headers" :items="arTickets" class = "elevation-1 paddingTabla ">
                    <template v-slot:top >
                        <v-toolbar flat>
                            <span class="text-h5" >Reportes Tickets</span>
                            <v-divider class="mx-4" inset vertical> </v-divider>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-form ref="formReporte" style="margin-top:-5px;">
                            <v-row class="mt-1 mb-1">
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field v-model="arSearch.fechaMin" type="date" label="De" v-on:input="Validar(),Filtro()"
                                    :rules="[()=> rango || 'Rango de fechas invalido']">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field type="date" label="Hasta" v-model="arSearch.fechaMax" v-on:input="Validar(),Filtro()"
                                    :rules="[()=> rango || 'Rango de fechas invalido']"> 
                                    </v-text-field>
                                </v-col>
                                <!-- CAMPO FILTRO DE USUARIOS GENERALES -->
                                <v-col cols="12" sm="4" 
                                                md="4" class="marginTop-24"
                                                v-if="stUsuario.IdSubTipoUsuario != usSubTipoVendedor">
                                    <v-text-field v-model="arSearch.cliente" label="Cliente" 
                                        hide-details v-on:keyup="Filtro($event)" outlined dense >
                                    </v-text-field>
                                </v-col>
                                <!-- CAMPO FILTRO DE USUARIOS VENDEDORES -->
                                <v-col cols="12" sm="6" md="6" class="marginTop-24" v-if="stUsuario.IdSubTipoUsuario == usSubTipoVendedor">
                                    <v-select :items="arClientesZona" v-model="arSearch.cliente" item-text="Nombre" label="Cliente de la zona"
                                        item-value="Nombre" v-on:change="Filtro()" hide-details outlined dense>
                                    </v-select>
                                </v-col>
                                <!-- ------------------------------------------------ -->
                                <v-col cols="12" :sm="stUsuario.IdSubTipoUsuario != usSubTipoVendedor ? '4':'6'" 
                                                :md="stUsuario.IdSubTipoUsuario != usSubTipoVendedor ? '4':'6'" class="marginTop-24">
                                    <v-select :items="items" v-model="arSearch.status" label="Status" item-text="Status" item-value="Status"
                                        v-on:change="Filtro()" hide-details outlined dense > 
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="4" class="mb-1 marginTop-24" v-if="stUsuario.IdSubTipoUsuario != usSubTipoSupervisor && stUsuario.IdSubTipoUsuario != usSubTipoVendedor"> 
                                    <v-select v-model="arSearch.zona" label="Zona" :items="arZonas" 
                                        item-text="Zona" item-value="IdZona" hide-details outlined dense 
                                        v-on:input="Filtro($event)">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="4" class="mb-1 marginTop-24" v-if="stUsuario.IdSubTipoUsuario == usSubTipoSupervisor">
                                    <v-select v-model="arSearch.vendedor" label = "Vendedores" :items="arVendedoresZona"
                                        item-text="Nombre" item-value="IdVendedor" v-on:change="Filtro()" hide-details outlined dense >

                                    </v-select>
                                </v-col>
                            </v-row>
                        </v-form>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import vuex from 'vuex'
import axios from 'axios'

export default{
    name: 'ReportesTickets',
    data(){
        return{
            headers: [
                {text: 'Cliente', value: 'Nombre'},
                {text: 'Titulo', value: 'Titulo'},
                {text: 'Motivo', value: 'Motivo'},
                {text: 'Fecha', value: 'Fecha'},
                {text: 'Status', value: 'Descripcion'}
            ],
            items: [],
            arTickets: [],
            arTicketsFiltro: [],
            arZonas: [],
            arClientesZona: [],
            arVendedoresZona: [],
            dialog: false,
            arSearch: {
                fechaMin: '',
                fechaMax: '',
                status: '',
                cliente: '',
                zona: '',
                vendedor: ''
            },
            usSubTipoSupervisor: process.env.VUE_APP_SubTipoSupervisor,
            usSubTipoVendedor: process.env.VUE_APP_SubTipoVendedor,
            usGralUsuarioDesa: process.env.VUE_APP_UsuarioDesa,
            usGralUsuarioDistribuidor: process.env.VUE_APP_UsuarioDistribuidor,
            rango: true,

        }
    },
    computed :{
        ...vuex.mapState(['Sesion','stTicket','stUsuario'])
    },created(){
        this.TraerDatos();
    },
    mounted(){
        this.FiltrarUsuario();
    },
    methods:{
        //PROCESO PARA LLAMAR TODOS LOS TICKETS
        TraerDatos(){
            axios.get(process.env.VUE_APP_RUTA_API+'/api/tickets/reportes-tickets',this.Sesion.Token)
                .then(response => {
                    if(response.status == 200){
                        response.data.forEach(v => {
                            v.Fecha = v.Fecha.replace('T','').substring(0,10);
                            if(v.IdDistribuidor != ""){
                                v.Nombre = v.IdDistribuidor+' - '+v.Nombre
                            }
                            // agregar configuracion del cliente en caso de existir
                            else{
                                // Proceso que editaremos cuando sepamos el formato que manejaremos con los clientes finales 
                                //v.Nombre = v.IdUsuario+' - '+v.Nombre
                                //console.log("Mensaje de errores")
                            }
                            
                        });
                        this.arTickets = response.data;
                        this.arTicketsFiltro = response.data;
                        //console.log(this.arTickets);
                    }
                    
                }).catch(error => {
                    console.log(error);
                });
            //PROCESO PARA LLAMAR TODAS LAS ZONAS
            axios.get(process.env.VUE_APP_RUTA_API+'/api/tickets/zonas',this.Sesion.Token)
                .then(response =>{
                    if(response.status == 200){
                        this.arZonas = [];
                        this.arZonas.push({"IdZona": 0,"Zona": "Todas"});
                        response.data.forEach(zona => this.arZonas.push(zona));
                        // console.log(this.arZonas);
                    }
                }).catch(error => {
                    console.log(error);
                })
            //PROCESO PARA LLAMAR LOS STATUS DE TICKETS
            axios.get(process.env.VUE_APP_RUTA_API+'/api/tickets/retornar-status',this.Sesion.Token)
                .then(response =>{
                    if(response.status == 200){
                        this.items.push({Status: "Todos"});
                        response.data.forEach(item =>{
                            this.items.push(item);
                        })
                    }
                }).catch(error =>{
                    console.log(error);
                })
        },
        //INICIO DEL PROCESO PARA FILTRAR LOS TICKETS
        Filtro(){
            // console.log(this.arSearch.zona);
            // console.log(this.arZonas)
            //console.log(this.arTickets);
            if(this.$refs.formReporte.validate()){
                // console.log(this.arSearch);
                this.arTickets = this.arTicketsFiltro.slice();
                //FILTRO FECHA MINIMA
                if(this.arSearch.fechaMin != ""){this.arTickets = this.arTickets.filter(Ticket => Ticket.Fecha >= this.arSearch.fechaMin)};
                //FILTRO FECHA MAXIMA
                if(this.arSearch.fechaMax != ""){this.arTickets = this.arTickets.filter(Ticket => Ticket.Fecha <= this.arSearch.fechaMax)};
                //FILTRO NOMBRE
                if(this.arSearch.cliente.length!=undefined && this.arSearch.cliente.length != 0 && this.arSearch.cliente != "Todos"){
                    this.arTickets =this.arTickets.filter(Ticket => 
                    Ticket.Nombre.toLowerCase().indexOf(this.arSearch.cliente.toLowerCase(),0) != -1)
                };
                //FILTRO STATUS
                if(this.arSearch.status.length != 0 && this.arSearch.status != "Todos"){this.arTickets = this.arTickets.filter(Ticket => Ticket.Descripcion == this.arSearch.status)};
                //FILTRO ZONAS
                if(this.arSearch.zona.length != 0 && this.arSearch.zona != 0){this.arTickets = this.arTickets.filter(Ticket => Ticket.IdZona == this.arSearch.zona)}
                //FILTRO DE VENDEDOR
                if(this.arSearch.vendedor != 0){this.arTickets = this.arTickets.filter(Ticket => Ticket.IdVendedor == this.arSearch.vendedor)}
            }
        },
        //VALIDAR RANGO DE FECHAS
        Validar(){
            if(this.arSearch.fechaMin != "" && this.arSearch.fechaMax != "" ){
                if(this.arSearch.fechaMin <  this.arSearch.fechaMax){
                    this.rango = true;
                }else{
                    this.rango = false;
                }
            }
        },
        FiltrarUsuario(){
            if(this.stUsuario.IdTipoUsuario == this.usGralUsuarioDesa && this.stUsuario.IdSubTipoUsuario == this.usSubTipoSupervisor){
                axios.get(process.env.VUE_APP_RUTA_API+"/api/usuarios/vendedores-zona/"+this.stUsuario.IdZona,this.Sesion.Token)
                    .then(response => {
                        if(response.status == 200){
                            this.arVendedoresZona.push({Nombre: 'Todos', IdVendedor: 0})
                            response.data.forEach(vendedor => {
                                this.arVendedoresZona.push(vendedor);
                                //console.log(this.arVendedoresZona);
                            });
                            console.log(this.arVendedoresZona);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                this.arSearch.zona = this.stUsuario.IdZona;
                setTimeout( () => {this.Filtro()},100);
            }else if( this.stUsuario.IdTipoUsuario == this.usGralUsuarioDesa && this.stUsuario.IdSubTipoUsuario == this.usSubTipoVendedor){
                axios.get(process.env.VUE_APP_RUTA_API+"/api/usuarios/clientes-zona/"+this.stUsuario.IdZona,this.Sesion.Token)
                    .then(response => {
                        if(response.status == 200){
                            this.arClientesZona.push({Nombre: "Todos"});
                            response.data.forEach(cliente =>{
                                if(cliente.IdTipoUsuario == this.usGralUsuarioDistribuidor){
                                    this.arClientesZona.push({Nombre: cliente.IdDistribuidor+' - '+cliente.Nombre});
                                }else{
                                    this.arClientesZona.push({Nombre: cliente.Nombre});
                                }       
                            })
                        }
                    })
                    .catch(error =>{
                        console.log(error);
                    })
                this.arSearch.zona = this.stUsuario.IdZona;
                setTimeout( () => {this.Filtro()},100);
            }
        }
    }
}
</script>

<style scoped>
    .paddingTabla{
        padding: 30px;
    }
    .marginright15{
        margin-right: 15%;
    }
    .marginTop-24{
        margin-top: -24px;
    }
</style>
