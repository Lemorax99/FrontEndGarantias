<template>
    <v-container>
        <!--CARGA DE COMPONENTE ReportesTickets-->
        <ReportesTickets />
    </v-container>
</template>

<script>

import ReportesTickets from '@/components/ReportesTickets.vue'
import vuex from 'vuex';

export default {
    name: 'Reportes',
    components: {
        ReportesTickets
    },
    data(){
        return{
            usCliente: process.env.VUE_APP_UsuarioCliente,
            usDistribuidor: process.env.VUE_APP_UsuarioDistribuidor
        }
    },
    computed:{
        ...vuex.mapState(['Sesion','stUsuario']),
    },
    mounted(){
        if(this.Sesion.Token == false){
            this.$router.push({path: '/'})
        }
        if(this.stUsuario.IdTipoUsuario ==  this.usCliente || this.stUsuario.IdTipoUsuario == this.usDistribuidor){
            this.$router.push({path: '/Home'})
        }
    }

}
</script>

<style scoped>
    
</style>
