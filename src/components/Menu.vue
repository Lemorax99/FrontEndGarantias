<template>
    <div>
        <!--NOTIFICACIONES-->
        <v-alert :value="stNotificacion.Value" :type="stNotificacion.Type" transition="scale-transition" class="notificaciones">
            {{stNotificacion.Notificacion}}
        </v-alert> 
        <!--BARRA HORIZONTAL-->
        <v-card>
            <v-app-bar color="primary accent-4" dark>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-spacer></v-spacer>
                <v-btn depressed color="primary" @click="CerrarSesion();"><v-icon large>mdi-logout</v-icon>Logout</v-btn>
            </v-app-bar>
        </v-card>
        <!--MENU VERTICAL-->
        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-list-item>
                <v-list-item-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>{{ Sesion.Usuario }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense>
                <v-list-item v-for="item in items" :key="item.title" link :to="item.path">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>


<script>

    import vuex from 'vuex';

    export default {
        data () {
            return {
                drawer: null,
                items: [],
                supervisor: process.env.VUE_APP_SubTipoSupervisor,
                usCliente: process.env.VUE_APP_UsuarioCliente,
                usDistribuidor: process.env.VUE_APP_UsuarioDistribuidor
            }
        },
        computed:{
            ...vuex.mapState(['Sesion', 'stNotificacion','stUsuario'])
        },
        mounted(){
            if(this.Sesion.Token == false){
                this.$router.push({path:'/'});
            }
            //VALIDAMOS MENU SEGUN USUARIO
            setTimeout(()=>{
                this.items.push({ title: 'Home', icon: 'mdi-home', path: '/Home' },
                            { title: 'Perfil', icon: 'mdi-account', path: '/Usuarios' })
                if(this.stUsuario.IdSubTipoUsuario != this.supervisor){
                    this.items.push({ title: 'Mis Tickets', icon: 'mdi-ticket-outline', path: '/MisTickets' })
                    console.log(this.stUsuario)
                }
                if(this.stUsuario.IdTipoUsuario != this.usCliente && this.stUsuario.IdTipoUsuario != this.usDistribuidor){
                    this.items.push({ title: 'Revisión de Tickets', icon: 'mdi-ticket-confirmation-outline', path: '/RevisionTickets' },
                                    { title: 'Reporte de Tickets', icon: 'mdi-file-table-outline', path: '/Reportes'})
                }
                },1000)
        },
        methods: {

            ...vuex.mapActions(['CerrarSesionAccion']),
            
            CerrarSesion(){
                this.CerrarSesionAccion();
                this.$router.push('/')                
            }
        }
    }

</script>

<style scoped>
    .notificaciones{
        left: 0;
        margin: 30px auto;
        position: absolute;
        right: 0;
        top: 10px;
        width: 80%;
        z-index: 205;
    }
</style>