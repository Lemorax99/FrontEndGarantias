import Vue from 'vue'
import VueRouter from 'vue-router'
import Menu from '@/components/Menu'
import IniciarSesion from '@/views/IniciarSesion'
import Home from '@/views/Home'
import Usuarios from '@/views/Usuarios'
import MisTickets from '@/views/MisTickets'
import RevicionTickets from '@/views/RevicionTickets'
import Restablecer from '@/views/Restablecer'
import Reportes from '@/views/Reportes'

Vue.use(VueRouter)

const routes = [  
  {
    path: '/',
    name: 'IniciarSesion',
    component: IniciarSesion
  },
  {
    path: '/Home',
    name: 'Home',
    components: {
      default: Home,
      sidebar: Menu
    }
  },
  {
    path: '/Usuarios',
    name: 'Usuarios',    
    components: {
      default: Usuarios,
      sidebar: Menu
    }
  },
  {
    path: '/MisTickets',
    name: 'MisTickets',
    components: {
      default: MisTickets,
      sidebar: Menu
    }
  },
  {
    path: '/RevisionTickets',
    name: 'RevicionTickets',    
    components: {
      default: RevicionTickets,
      sidebar: Menu
    }
  },
  {
    path: '/Restablecer',
    name: 'Restablecer',
    components :{
      default: Restablecer,
    }
  },
  {
    path: '/Reportes',
    name: 'Reportes',
    components: {
      default: Reportes,
      sidebar: Menu
    }
  },
  {
    path: '/Restablecer/:usuario/:codigo',
    name: 'RestablecerDinamico',
    components :{
      default: Restablecer,
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
