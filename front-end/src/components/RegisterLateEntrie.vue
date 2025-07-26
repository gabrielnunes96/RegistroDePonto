<template>
  <div class="register-late-entry-container">
    <div class="register-entry-content">
      <h3>Registro de Atraso</h3>
      <form @submit.prevent="handleLateEntry" class="late-entry-form">
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
        <div class="form-group">
          <label for="justification">Justificativa:</label>
          <textarea
            id="justification"
            v-model="justification"
            required
            placeholder="Digite a justificativa do atraso"
            rows="4"
          ></textarea>
        </div>
        <button type="submit" class="submit-button">Confirmar Registro de Atraso</button>
      </form>
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
import { ref } from 'vue'
import { useEntrieStore } from '@/stores'

export default {
  name: 'RegisterLateEntrie',
  setup() {
    const entrieStore = useEntrieStore()
    const pin = ref('')
    const password = ref('')
    const justification = ref('')
    const message = ref('')
    const messageType = ref('')
    const messageVisible = ref(false)

    const handleLateEntry = async () => {
      if (!pin.value || !password.value) {
        message.value = 'Preencha PIN e senha.'
        messageType.value = 'error'
        return
      }
      try {
        const responseData = await entrieStore.registerLateEntry({
          pin: pin.value,
          password: password.value,
          justification: justification.value
        })
        let messageText = `${responseData.operationType.charAt(0).toUpperCase() + responseData.operationType.slice(1)} com atraso registrada com sucesso!`
        if (!responseData.isLate) {
          messageText = `${responseData.operationType.charAt(0).toUpperCase() + responseData.operationType.slice(1)} registrada com sucesso!`
        }
        message.value = messageText
        messageType.value = 'success'
        messageVisible.value = true
        pin.value = ''
        password.value = ''
        justification.value = ''
        setTimeout(() => {
          messageVisible.value = false
          setTimeout(() => {
            message.value = ''
            messageType.value = ''
          }, 500)
        }, 5000)
      } catch (error) {
        message.value = entrieStore.getError || 'Erro ao registrar atraso.'
        messageType.value = 'error'
      }
    }

    return {
      pin,
      password,
      justification,
      handleLateEntry,
      message,
      messageType,
      messageVisible
    }
  }
}
</script>

<style>
@import '@/assets/styles/RegisterEntrie.css';
</style>
