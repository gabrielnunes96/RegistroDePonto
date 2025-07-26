<template>
  <div class="register-entry-container">
    <div class="register-entry-content">
      <TimeClock ref="timeClock" :disable-submit="true" />
      <div class="tab-action">
        <button class="register-button" @click="handleNormalButton">Registrar Ponto</button>
      </div>
      <div
        v-if="message"
        :class="[
          'message',
          messageType,
          'message-transition',
          messageVisible ? 'message-visible' : 'message-hidden'
        ]"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import TimeClock from './TimeClock.vue'
import { useEntrieStore } from '@/stores'

export default {
  name: 'RegisterEntrie',
  components: {
    TimeClock
  },
  data() {
    return {
      message: '',
      messageType: '',
      messageVisible: false
    }
  },
  setup() {
    const entrieStore = useEntrieStore()
    return { entrieStore }
  },
  methods: {
    handleNormalButton() {
      const entryData = this.getTimeClockData('timeClock')
      if (!entryData) return
      this.registerEntry(entryData)
    },
    getTimeClockData(refName) {
      const timeClock = this.$refs[refName]
      if (!timeClock) return null
      const { pin, password } = timeClock
      if (!pin || !password) {
        this.message = 'Preencha PIN e senha.'
        this.messageType = 'error'
        return null
      }
      return {
        pin,
        password
      }
    },
    async registerEntry(entryData) {
      try {
        const responseData = await this.entrieStore.registerNormalEntry(entryData)
        let messageText = `${responseData.operationType.charAt(0).toUpperCase() + responseData.operationType.slice(1)} registrada com sucesso!`
        if (responseData.isLate) {
          messageText = `${responseData.operationType.charAt(0).toUpperCase() + responseData.operationType.slice(1)} com atraso registrada com sucesso!`
        }
        this.message = messageText
        this.messageType = 'success'
        this.messageVisible = true
        this.clearTimeClock('timeClock')
        setTimeout(() => {
          this.messageVisible = false
          setTimeout(() => {
            this.message = ''
            this.messageType = ''
          }, 500)
        }, 5000)
      } catch (error) {
        this.message = this.entrieStore.getError || 'Erro ao registrar ponto.'
        this.messageType = 'error'
      }
    },
    clearTimeClock(refName) {
      const timeClock = this.$refs[refName]
      if (timeClock) {
        timeClock.pin = ''
        timeClock.password = ''
      }
    }
  }
}
</script>

<style>
@import '@/assets/styles/TimeClock.css';
@import '@/assets/styles/RegisterEntrie.css';
</style>
