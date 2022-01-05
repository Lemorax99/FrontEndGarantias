<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card elevation="15" class="text-center" outlined>
                    <v-data-table :headers="headers" :items="arTicketsAbiertos" class="elevation-1 paddingTabla">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <span class="text-h5">Revisión de Tickets</span>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
                                <TicketDetalle ref="refTicketDetalle" @Revicion-Tickets="ListaTickets"/>
                            </v-toolbar>
                        </template>                        
                        <template v-slot:item.actions="{ item }">
                            <v-icon class="mr-2 marginVerTicket" @click="ConsultarTicket(item)">mdi-eye-settings-outline</v-icon>
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
    import TicketDetalle from "@/components/TicketDetalle.vue";
    import { Notificacion } from '@/utils/Estados'

    export default {
        name: 'RevicionTickets',
        components: {
            TicketDetalle
        },
        data(){
            return {                
                headers: [
                            { text: 'Cliente', value: 'Nombre' },
                            { text: 'Titulo', value: 'Titulo' },
                            { text: 'Motivo', value: 'Motivo' },
                            { text: 'Fecha', value: 'Fecha' },
                            { text: 'Status', value: 'StatusDesc' },
                            { text: 'Acciones', value: 'actions', sortable: false }
                         ],
                arTicketsAbiertos: [],
                usCliente: process.env.VUE_APP_UsuarioCliente,
                usDistribuidor: process.env.VUE_APP_UsuarioDistribuidor
            }
        },
        computed:{
            ...vuex.mapState(['Sesion','stUsuario']),
        },
        created(){
            this.ListaTickets();
        },
        mounted(){
            if(this.Sesion.Token == false){
                this.$router.push({path:'/'});
            }
            if(this.stUsuario.IdTipoUsuario == this.usCliente || this.stUsuario.IdTipoUsuario == this.usDistribuidor){
                this.$router.push({path: '/Home'})
            }
        },        
        methods: {

            ...vuex.mapActions(['LlenaNotiAccion','CerrarSesionAccion']),
            
            ListaTickets(){
                axios.get(process.env.VUE_APP_RUTA_API + '/api/tickets/tickets-abiertos', this.Sesion.Token)
                .then(response => {
                    //console.log(response);
                    if(response.status == 200){
                        response.data.forEach(v => {
                            v.Fecha = v.Fecha.replace('T', '').substr(0,10)
                        });
                        this.arTicketsAbiertos = response.data;
                    }
                })
                .catch(error => {
                    //console.log(error.response)
                    Notificacion(this.LlenaNotiAccion, true, process.env.VUE_APP_Error, error.response.status + ' - ' + error.response.statusText)
                    this.CerrarSesionAccion();
                });
            },
            ConsultarTicket(item){                
                this.$refs.refTicketDetalle.ConsultarTicket(item.IdTicket);
            }

        }
    }
    
</script>


<style scoped>
    .paddingTabla{
        padding: 30px;
    }
    .marginVerTicket{
        margin: 0 0 0 15px;
    }   
</style>