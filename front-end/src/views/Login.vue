<template>
  <div class="container d-flex justify-content-center">
    <div class="login-card p-4 rounded shadow">
      <form @submit.prevent="login">
        <div class="form-group mb-3">
          <label for="userName" class="form-label">Usuário</label>
          <input
            type="text"
            v-model="userName"
            id="userName"
            class="form-control"
            placeholder="Digite seu usuário"
            required
          />
        </div>
        <div class="form-group mb-3">
          <label for="passWord" class="form-label">Senha</label>
          <input
            type="password"
            v-model="passWord"
            id="passWord"
            class="form-control"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-link text-danger">Esqueci minha senha</button>
          <button type="submit" class="btn btn-success">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import '@/assets/styles/login.css'
import api from '@/services/axios.js'
export default {
  name: 'Login',
  setup() {
    const userStore = useUserStore()
    const userName = ref('')
    const passWord = ref('')
    const login = async () => {
      try {
        const response = await api.post('signIn', {
          pin: userName.value,
          password: passWord.value
        })
        if (response.data.msg === 'OK') {
          userStore.login({
            userName: userName.value,
            passWord: passWord.value,
            isAdmin: response.data.isAdmin,
            token: response.data.result
          })
        } else {
          alert('Login falhou. Verique as credenciais.')
        }
      } catch (error) {
        console.error('Erro de login', error)
        alert('Ocorreu um erro ao tentar realizar login')
      }
    }
    return {
      userName,
      passWord,
      login
    }
  }
}
</script>
<style scoped></style>
