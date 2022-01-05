<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card elevation="15" class="text-center" outlined>
                    <h1>Home</h1>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>   

    import vuex from 'vuex';
    import Estado from '@/utils/Estados'

    export default {
        name: 'Home',
        data () {
            return {}
        },
        computed:{
            ...vuex.mapState(['Sesion'])
        },
        mounted(){
            if(this.Sesion.Token == false){
                this.$router.push({path:'/'});
            }else{
                this.ConsultarUsuario();
            }
        },
        methods: {    
            
            ...vuex.mapActions(['LlenaUsuarioAccion', 'CerrarSesionAccion']),

            ConsultarUsuario(){
                Estado.Usuario(this.Sesion.Usuario, this.Sesion.Token, this.LlenaUsuarioAccion, this.CerrarSesionAccion);
            }         
        }
    }
    
</script>


<style scoped>

</style>