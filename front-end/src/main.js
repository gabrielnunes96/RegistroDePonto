import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './routers'
import './global.js'

try {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
  console.log('Aplicação inicializada com sucesso.')
} catch (error) {
  console.error('Erro ao inicializar a aplicação.', error)
}
