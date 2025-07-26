<template>
  <div class="employee-report-container">
    <div class="report-content">
      <h2>Histórico de Ponto</h2>

      <div class="date-filter-container">
        <div class="date-input-group">
          <label for="startDate">Data de Início:</label>
          <VueDatePicker
            v-model="selectedStartDate"
            locale="pt-BR"
            format="dd/MM/yyyy"
            placeholder="DD/MM/YYYY"
            :enable-time-picker="false"
            auto-apply
            :clearable="true"
            :max-date="selectedEndDate"
          >
            <template #text-input="{ value, onInput }">
              <input
                type="text"
                :value="value"
                @input="($event) => handleDateInputFormatting($event, onInput)"
              />
            </template>
          </VueDatePicker>
        </div>
        <div class="date-input-group">
          <label for="endDate">Data de Fim:</label>
          <VueDatePicker
            v-model="selectedEndDate"
            locale="pt-BR"
            format="dd/MM/yyyy"
            placeholder="DD/MM/YYYY"
            :enable-time-picker="false"
            auto-apply
            :clearable="true"
            :min-date="selectedStartDate"
          >
            <template #text-input="{ value, onInput }">
              <input
                type="text"
                :value="value"
                @input="($event) => handleDateInputFormatting($event, onInput)"
              />
            </template>
          </VueDatePicker>
        </div>
        <button @click="applyFilter" class="btn btn-filter">Aplicar Filtro</button>
      </div>

      <div class="total-hours-container">
        <h3>Total de Horas Trabalhadas: {{ formatHours(totalWorkedHours) }}</h3>
      </div>

      <div class="report-table">
        <p v-if="loading">Carregando histórico...</p>
        <p v-else-if="error" class="text-danger">{{ error }}</p>
        <table class="table table-hover" v-else-if="paginatedEntries.length">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Hora</th>
              <th>Justificativa</th>
              <th>Atraso</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in paginatedEntries"
              :key="`${entry.date}-${entry.time}-${entry.type}`"
            >
              <td>{{ entry.date }}</td>
              <td>{{ entry.type }}</td>
              <td>{{ entry.time }}</td>
              <td>{{ entry.justification }}</td>
              <td>{{ entry.isLate }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>
          Nenhum registro de ponto encontrado para este funcionário no período selecionado.
        </p>
      </div>
      <button @click="exportPdf" class="btn btn-primary export-button">Exportar PDF</button>
      <div class="pagination" v-if="paginatedEntries.length">
        <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-secondary">
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-secondary">
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores'
import api from '@/services/axios'
import '@/assets/styles/employee-report.css'
import VueDatePicker from '@vuepic/vue-datepicker'

export default {
  name: 'EmployeeReport',
  components: {
    VueDatePicker
  },
  setup() {
    const userStore = useUserStore()
    const employeeEntries = ref([])
    const loading = ref(true)
    const error = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 30
    const selectedStartDate = ref(null)
    const selectedEndDate = ref(null)
    const appliedStartDate = ref('')
    const appliedEndDate = ref('')

    const preloadDates = () => {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()

      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      // VueDatePicker lida com objetos Date diretamente
      selectedStartDate.value = firstDay
      selectedEndDate.value = lastDay

      // Para o filtro inicial, usar o formato ISO (YYYY-MM-DD)
      appliedStartDate.value = firstDay.toISOString().split('T')[0]
      appliedEndDate.value = lastDay.toISOString().split('T')[0]
    }

    const flattenedEntries = computed(() => {
      const flat = []
      employeeEntries.value.forEach((entry) => {
        const entryDate = new Date(entry.date).toLocaleDateString('pt-BR')
        entry.punches.forEach((punch) => {
          if (punch.checkIn && punch.checkIn.time) {
            flat.push({
              date: entryDate,
              rawDate: new Date(entry.date),
              type: 'Entrada',
              time: new Date(punch.checkIn.time).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              rawTime: new Date(punch.checkIn.time),
              justification:
                punch.checkIn.justification && punch.checkIn.justification.length > 0
                  ? punch.checkIn.justification.join('; ')
                  : '',
              isLate: punch.checkIn.isLate ? 'Sim' : 'Não'
            })
          }
          if (punch.checkOut && punch.checkOut.time) {
            flat.push({
              date: entryDate,
              rawDate: new Date(entry.date),
              type: 'Saída',
              time: new Date(punch.checkOut.time).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              rawTime: new Date(punch.checkOut.time),
              justification:
                punch.checkOut.justification && punch.checkOut.justification.length > 0
                  ? punch.checkOut.justification.join('; ')
                  : '',
              isLate: punch.checkOut.isLate ? 'Sim' : 'Não'
            })
          }
        })
      })
      return flat
    })

    const filteredEntriesByDate = computed(() => {
      let filtered = flattenedEntries.value
      if (appliedStartDate.value) {
        const start = new Date(appliedStartDate.value)
        start.setHours(0, 0, 0, 0)
        filtered = filtered.filter((entry) => new Date(entry.rawDate) >= start)
      }
      if (appliedEndDate.value) {
        const end = new Date(appliedEndDate.value)
        end.setHours(23, 59, 59, 999)
        filtered = filtered.filter((entry) => new Date(entry.rawDate) <= end)
      }
      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredEntriesByDate.value.length / itemsPerPage)
    })

    const paginatedEntries = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredEntriesByDate.value.slice(start, end)
    })

    const totalWorkedHours = computed(() => {
      let totalMilliseconds = 0
      const dailyEntries = {}

      filteredEntriesByDate.value.forEach((entry) => {
        const dateKey = entry.rawDate.toDateString()
        if (!dailyEntries[dateKey]) {
          dailyEntries[dateKey] = []
        }
        dailyEntries[dateKey].push(entry)
      })

      for (const dateKey in dailyEntries) {
        const entriesForDay = dailyEntries[dateKey].sort((a, b) => a.rawTime - b.rawTime)

        for (let i = 0; i < entriesForDay.length; i++) {
          const current = entriesForDay[i]
          const next = entriesForDay[i + 1]

          if (current.type === 'Entrada' && next && next.type === 'Saída') {
            totalMilliseconds += next.rawTime - current.rawTime
            i++
          }
        }
      }

      const totalHours = totalMilliseconds / (1000 * 60 * 60)
      return totalHours
    })

    const formatHours = (hours) => {
      if (isNaN(hours)) return '00:00'
      const sign = hours < 0 ? '-' : ''
      const absoluteHours = Math.abs(hours)
      const h = Math.floor(absoluteHours)
      const min = Math.round((absoluteHours - h) * 60)
      return `${sign}${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    }

    const fetchEmployeeReport = async () => {
      loading.value = true
      error.value = null
      try {
        const userPin = userStore.user?.userName

        if (!userPin) {
          error.value = 'PIN do usuário não encontrado. Por favor, faça login novamente.'
          loading.value = false
          userStore.logOut()
          return
        }

        const response = await api.get(
          `/entries/employee/${userPin}?startDate=${appliedStartDate.value}&endDate=${appliedEndDate.value}`
        )
        employeeEntries.value = response.data.result
        currentPage.value = 1
      } catch (err) {
        console.error('Error fetching employee report:', err)
        error.value = err.response?.data?.msg || 'Erro ao carregar histórico de ponto.'
        if (err.response?.status === 401) {
          userStore.logOut()
        } else if (err.response?.status === 404) {
          error.value = 'Nenhum registro de ponto encontrado para este funcionário.'
        }
      } finally {
        loading.value = false
      }
    }

    const exportPdf = async () => {
      try {
        const userPin = userStore.user?.userName
        if (!userPin) {
          error.value = 'PIN do usuário não encontrado. Não foi possível gerar o PDF.'
          return
        }

        const response = await api.get(
          `/pdf/employee-report/${userPin}?totalHours=${totalWorkedHours.value}`,
          {
            responseType: 'blob'
          }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'historico_ponto.pdf')
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        alert('PDF gerado e download iniciado!')
      } catch (err) {
        console.error('Error generating PDF:', err)
        error.value = err.response?.data?.msg || 'Erro ao gerar PDF do histórico de ponto.'
        if (err.response?.status === 401) {
          userStore.logOut()
        } else if (err.response?.status === 404) {
          error.value = 'Nenhum registro de ponto encontrado para gerar o PDF.'
        }
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const applyFilter = () => {
      appliedStartDate.value = selectedStartDate.value.toISOString().split('T')[0]
      appliedEndDate.value = selectedEndDate.value.toISOString().split('T')[0]
      currentPage.value = 1
    }

    const handleDateInputFormatting = (event, onInput) => {
      let value = event.target.value.replace(/\D/g, '') // Remove tudo que não for dígito

      if (value.length > 8) {
        value = value.substring(0, 8)
      }

      if (value.length > 4) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`
      } else if (value.length > 2) {
        value = `${value.substring(0, 2)}/${value.substring(2)}`
      }

      event.target.value = value
      onInput(value)
    }

    onMounted(() => {
      preloadDates()
      if (userStore.checkAuth()) {
        fetchEmployeeReport()
      } else {
        error.value = 'Não autenticado. Por favor, faça login.'
        loading.value = false
      }
    })

    return {
      employeeEntries,
      loading,
      error,
      exportPdf,
      flattenedEntries,
      currentPage,
      itemsPerPage,
      totalPages,
      paginatedEntries,
      nextPage,
      prevPage,
      selectedStartDate,
      selectedEndDate,
      applyFilter,
      totalWorkedHours,
      formatHours,
      handleDateInputFormatting
    }
  }
}
</script>
