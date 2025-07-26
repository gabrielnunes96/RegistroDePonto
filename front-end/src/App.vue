<template>
  <div id="app">
    <header v-if="$route.name !== 'Login'">
      <nav v-if="userStore.isAuth">
        <router-link to="/home" exact-active-class="active-link">Home</router-link>
        <div class="dropdown" v-if="userStore.isAdmin">
          <button
            class="dropdown-toggle"
            :class="{
              'active-link': $route.path.startsWith('/admin') || $route.path.startsWith('/cadastro')
            }"
          >
            Painel do Administrador
          </button>
          <ul class="dropdown-menu">
            <li>
              <router-link to="/admin">Dashboard</router-link>
            </li>
            <li>
              <router-link to="/cadastro">Cadastrar Usuário</router-link>
            </li>
          </ul>
        </div>
        <div class="dropdown">
          <button
            class="dropdown-toggle"
            :class="{ 'active-link': $route.path.startsWith('/employee') }"
          >
            Area do Funcionário
          </button>
          <ul class="dropdown-menu">
            <li>
              <router-link to="/employee/normal">Registrar Ponto</router-link>
            </li>
            <li>
              <router-link to="/employee/late">Registrar Ponto em Atraso</router-link>
            </li>
            <li>
              <router-link to="/employee/report">Exportar Histórico de Ponto</router-link>
            </li>
          </ul>
        </div>
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
