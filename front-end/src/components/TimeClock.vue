<template>
  <div class="time-clock-container">
    <div class="time-clock-card">
      <h2>Registro de Ponto</h2>
      <div class="current-time">
        {{ currentTime }}
      </div>

      <form @submit.prevent="handleTimeClock" class="time-clock-form">
        <div class="form-group">
          <label for="pin">PIN:</label>
          <input
            type="password"
            id="pin"
            v-model="pin"
            maxlength="6"
            required
            placeholder="Digite seu PIN"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Digite sua senha"
          />
        </div>
      </form>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeClock',
  data() {
    return {
      pin: '',
      password: '',
      currentTime: '',
      message: '',
      messageType: '',
      timer: null
    }
  },
  methods: {
    updateCurrentTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('pt-BR')
    },
    async handleTimeClock() {
      try {
        const entryData = {
          pin: this.pin,
          password: this.password,
          timestamp: new Date().toISOString()
        }

        this.$emit('register', entryData)
        this.message = 'Ponto registrado com sucesso!'
        this.messageType = 'success'
        this.pin = ''
        this.password = ''
      } catch (error) {
        this.message = 'Erro ao registrar ponto. Tente novamente.'
        this.messageType = 'error'
      }
    }
  },
  mounted() {
    this.updateCurrentTime()
    this.timer = setInterval(this.updateCurrentTime, 1000)
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style>
@import '@/assets/styles/TimeClock.css';
</style>
