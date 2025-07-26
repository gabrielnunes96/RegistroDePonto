<template>
  <div class="container d-flex justify-content-center">
    <div class="login-background login-card p-4 rounded shadow">
      <form class="form-login" @submit.prevent="handleLogin">
        <div class="form-group mb-3">
          <label for="userName" class="form-label"></label>
          <input
            type="text"
            v-model="userName"
            id="userName"
            class="form-control"
            :class="{ 'is-invalid': userStore.getError }"
            placeholder="Digite seu usuário"
            required
          />
        </div>
        <div class="form-group mb-3">
          <label for="passWord" class="form-label"></label>
          <input
            type="password"
            v-model="passWord"
            id="passWord"
            class="form-control"
            :class="{ 'is-invalid': userStore.getError }"
            placeholder="Digite sua senha"
            required
          />
          <div v-if="userStore.getError" class="invalid-feedback">
            {{ userStore.getError }}
          </div>
        </div>
        <button type="submit" class="btn btn-success" :disabled="userStore.isLoading">
          {{ userStore.isLoading ? 'Carregando...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import '@/assets/styles/login.css'

export default {
  name: 'Login',
  setup() {
    const userStore = useUserStore()
    const userName = ref('')
    const passWord = ref('')

    const handleLogin = async () => {
      await userStore.login({
        userName: userName.value,
        passWord: passWord.value
      })
    }

    return {
      userName,
      passWord,
      handleLogin,
      userStore
    }
  }
}
</script>