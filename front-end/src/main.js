import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)

/*
 * Adicionar mais campos elementos aqui se necessário..
 */
app.use(createPinia())
app.mount('#app')
