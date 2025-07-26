import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Admin from '@/views/Admin.vue'
import Login from '@/views/Login.vue'
// import Employee from '@/views/Employee.vue' // Removendo importação direta
import AdminDashboard from '@/views/AdminDashboard.vue'
import Cadastro from '@/views/Cadastro.vue'
import EmployeeReport from '@/views/EmployeeReport.vue'
import { useUserStore } from '@/stores'

const requireAuth = (to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isAuth) {
    next('/')
  } else {
    next()
  }
}

const requireAdmin = (to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isAuth || !userStore.isAdmin) {
    next('/home')
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: requireAdmin,
    children: [
      {
        path: 'adminDashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      }
    ]
  },
  {
    path: '/employee',
    name: 'Employee',
    component: () => import('@/views/Employee.vue'),
    beforeEnter: requireAuth,
    children: [
      {
        path: 'normal',
        name: 'RegisterNormal',
        component: () => import('@/components/RegisterEntrie.vue')
      },
      {
        path: 'late',
        name: 'RegisterLate',
        component: () => import('@/components/RegisterLateEntrie.vue')
      },
      {
        path: 'report',
        name: 'EmployeeReport',
        component: EmployeeReport
      }
    ]
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro,
    beforeEnter: requireAdmin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
