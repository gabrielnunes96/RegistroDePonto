<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { useCounterStore } from '../stores/counter'

export default {
  setup() {
    const counterStore = useCounterStore()
    return {
      count: counterStore.count,
      increment: counterStore.increment
    }
  }
}
</script>
