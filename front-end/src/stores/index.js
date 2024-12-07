import { defineStore } from 'pinia'
import router from '@/routers'
import api from '@/services/axios.js'
export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuth: !!localStorage.getItem('user'),
    isAdmin: JSON.parse(localStorage.getItem('isAdmin')) || false
  }),
  actions: {
    login(userData) {
      this.user = userData
      this.isAuth = true
      this.isAdmin = userData?.isAdmin === true // Verifica se o usuário é admin
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin))
      localStorage.setItem('authToken', JSON.stringify(userData.token))
      api.defaults.headers['Authorization'] = userData.token
      router.push('/home')
    },
    logOut() {
      this.user = null
      this.isAuth = false
      this.isAdmin = false
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
      router.push('/')
    }
  },
  getters: {
    isUserAdmin: (state) => state.isAdmin
  }
})

export const useEntrieStore = defineStore('entrie', {
  state: () => ({
    entries: JSON.parse(localStorage.getItem('entries')) || []
  }),
  actions: {
    registerEntrie(entrieData) {
      this.entries.push(entrieData)
      localStorage.setItem('entries', JSON.stringify(this.entries))
    },
    removeEntrie(index) {
      const useUserStore = useUserStore()

      if (useUserStore.isAdmin) {
        this.entries.splice(index, 1)
        localStorage.setItem('entries', JSON.stringify(this.entries))
      } else {
        throw new Error('Acesso negado: Apenas administradores podem remover registros de ponto.')
      }
    }
  }
})
