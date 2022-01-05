<template>
  <v-app>
    <v-main>
      <router-view name="sidebar"/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  created () {
    // Lee la información de estado en sessionStorage cuando se carga la página
    if (sessionStorage.getItem('state')) {
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('state'))))
        sessionStorage.removeItem('state');
    }
    // Guarda la información en vuex en sessionStorage cuando se actualiza la página
    window.addEventListener('beforeunload',()=>{          
        sessionStorage.setItem('state',JSON.stringify(this.$store.state))
    })
  },
  data: () => ({
    
  }),
};
</script>
