import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Admin from '@/views/Admin.vue'
import Login from '@/views/Login.vue'
import Employee from '@/views/Employee.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import EmployeeDashboard from '@/views/EmployeeDashboard.vue'
import Cadastro from '@/views/Cadastro.vue'
import { useUserStore } from '@/stores'

const requireAuth = (to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isAuth) {
    next('/')
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
    beforeEnter: requireAuth,
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
    component: Employee,
    beforeEnter: requireAuth,
    children: [
      {
        path: 'employeeDashboard',
        name: 'EmployeeDashboard',
        component: EmployeeDashboard
      }
    ]
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro,
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
