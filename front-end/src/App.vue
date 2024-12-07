<template>
  <div id="app">
    <header>
      <nav v-if="userStore.isAuth">
        <div class="dropdown" v-if="userStore.isAdmin">
          <button class="dropdown-toggle">Painel do Administrador</button>
          <ul class="dropdown-menu">
            <li>
              <router-link to="/admin">Dashboard</router-link>
            </li>
            <li>
              <router-link to="/cadastro">Cadastrar Usuário</router-link>
            </li>
          </ul>
        </div>
        <router-link to="/employee" exact-active-class="active-link"
          >Area do Funcionário</router-link
        >
        <button @click="logout">Logout</button>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { useUserStore } from '@/stores'
import '@/assets/styles/app.css'

export default {
  setup() {
    const userStore = useUserStore()

    const logout = () => {
      userStore.logOut()
    }

    return {
      userStore,
      logout
    }
  }
}
</script>
