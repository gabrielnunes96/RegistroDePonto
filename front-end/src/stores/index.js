import { defineStore } from 'pinia'
import router from '@/routers'
import api from '@/services/axios.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuth: !!localStorage.getItem('authToken'),
    isAdmin: JSON.parse(localStorage.getItem('isAdmin')) || false,
    loading: false,
    error: null
  }),
  actions: {
    async login(credentials) {
      try {
        this.loading = true
        this.error = null

        const response = await api.post('signIn', {
          pin: credentials.userName,
          password: credentials.passWord
        })

        if (response.data.msg === 'OK' && response.data.result) {
          const userData = {
            userName: credentials.userName,
            isAdmin: response.data.isAdmin,
            token: response.data.result
          }

          this.setUserData(userData)
          router.push('/home')
          return true
        } else {
          this.error = 'Credenciais inválidas. Por favor, verifique seu usuário e senha.'
          return false
        }
      } catch (error) {
        console.error('Login error:', error)
        if (error.response?.status === 401) {
          this.error = 'Usuário ou senha incorretos.'
        } else {
          this.error = 'Ocorreu um erro ao tentar realizar login. Por favor, tente novamente.'
        }
        return false
      } finally {
        this.loading = false
      }
    },

    setUserData(userData) {
      this.user = userData
      this.isAuth = true
      this.isAdmin = userData?.isAdmin === true

      // Store user data without token
      const userDataForStorage = {
        userName: userData.userName,
        isAdmin: userData.isAdmin
      }

      // Ensure token is stored with Bearer prefix
      const token = userData.token.startsWith('Bearer ')
        ? userData.token
        : `Bearer ${userData.token}`

      localStorage.setItem('user', JSON.stringify(userDataForStorage))
      localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin))
      localStorage.setItem('authToken', token)
    },

    logOut() {
      this.user = null
      this.isAuth = false
      this.isAdmin = false
      this.error = null
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('authToken')
      router.push('/')
    },

    checkAuth() {
      const token = localStorage.getItem('authToken')
      if (!token) {
        this.logOut()
        return false
      }
      return true
    },

    clearError() {
      this.error = null
    }
  },
  getters: {
    isUserAdmin: (state) => state.isAdmin,
    getToken: () => localStorage.getItem('authToken'),
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  }
})

export const useEntrieStore = defineStore('entrie', {
  state: () => ({
    entries: [],
    loading: false,
    error: null
  }),
  actions: {
    async registerNormalEntry(entryData) {
      try {
        this.loading = true
        const response = await api.post('insertEntrie', {
          pin: entryData.pin,
          password: entryData.password,
          isLate: false
        })
        this.entries.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.msg || 'Erro ao registrar ponto.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async registerLateEntry(entryData) {
      try {
        this.loading = true
        const response = await api.post('insertEntrie', {
          pin: entryData.pin,
          password: entryData.password,
          isLate: true,
          justification: entryData.justification
        })
        this.entries.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.msg || 'Erro ao registrar ponto em atraso.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchEntries() {
      try {
        this.loading = true
        const response = await api.get('entries')
        this.entries = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.msg || 'Erro ao buscar registros.'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    async fetchEmployeeEntriesByPin(pin) {
      try {
        this.loading = true
        const response = await api.get(`/entries/employee/${pin}`)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.msg || 'Erro ao buscar histórico do funcionário.'
        throw error
      } finally {
        this.loading = false
      }
    }
  },
  getters: {
    getEntries: (state) => state.entries,
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  }
})
