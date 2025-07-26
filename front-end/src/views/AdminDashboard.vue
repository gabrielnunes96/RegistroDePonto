<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h2>Painel de Controle</h2>
      <div class="filters">
        <div class="date-filters">
          <input type="date" v-model="startDate" class="form-control" />
          <input type="date" v-model="endDate" class="form-control" />
          <button @click="applyFilters" class="btn btn-primary">Filtrar</button>
        </div>
        <!-- Funcionalidades de exportação serão implementadas posteriormente -->
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Cards de Estatísticas -->
      <div class="stats-cards">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Total de Funcionários</h5>
            <p class="card-text">{{ totalEmployees }}</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Registros Hoje</h5>
            <p class="card-text">{{ todayEntries }}</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Atrasos no Mês</h5>
            <p class="card-text">{{ monthlyDelays }}</p>
          </div>
        </div>
      </div>

      <!-- Lista de Funcionários -->
      <div class="employees-list">
        <h3>Funcionários</h3>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Último Registro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in employees" :key="employee._id">
                <td>{{ employee.name }}</td>
                <td>{{ formatPhone(employee.contact) }}</td>
                <td>{{ formatDate(employee.lastEntry) }}</td>
                <td>
                  <span :class="['badge', getStatusClass(employee.status)]">
                    {{ employee.status }}
                  </span>
                </td>
                <td>
                  <button @click="viewEmployeeDetails(employee)" class="btn btn-sm btn-info">
                    <i class="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Detalhes do Funcionário -->
      <div class="modal fade" id="employeeModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalhes do Funcionário</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div v-if="selectedEmployee">
                <h6>Registros de Ponto</h6>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Entrada</th>
                        <th>Saída</th>
                        <th>Total Horas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="entry in selectedEmployee.entries" :key="entry.id">
                        <td>{{ formatDate(entry.date) }}</td>
                        <td>{{ entry.checkIn }}</td>
                        <td>{{ entry.checkOut }}</td>
                        <td>{{ calculateHours(entry) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import api from '@/services/axios'
import '@/assets/styles/dashboard.css'
import { Modal } from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
  name: 'AdminDashboard',
  setup() {
    const userStore = useUserStore()
    const employees = ref([])
    const selectedEmployee = ref(null)
    const startDate = ref('')
    const endDate = ref('')
    const totalEmployees = ref(0)
    const todayEntries = ref(0)
    const monthlyDelays = ref(0)

    const formatPhone = (phone) => {
      if (!phone || phone.length !== 11) return phone
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 3)} ${phone.slice(3, 7)}-${phone.slice(7)}`
    }

    const fetchEmployees = async () => {
      if (!userStore.checkAuth()) return

      try {
        const response = await api.get('/getEmployees')
        employees.value = response.data.result
        totalEmployees.value = employees.value.length
        calculateStatistics()
      } catch (error) {
        console.error('Error fetching employees:', error)
        if (error.response?.status === 401) {
          userStore.logOut()
        }
      }
    }

    const calculateStatistics = async () => {
      if (!userStore.checkAuth()) return

      try {
        const response = await api.get('/entries')
        const entries = response.data

        // Calculate today's entries
        const today = new Date().toISOString().split('T')[0]
        todayEntries.value = entries.filter((entry) => entry.date.startsWith(today)).length

        // Calculate monthly delays
        const currentMonth = new Date().getMonth()
        monthlyDelays.value = entries.filter((entry) => {
          const entryDate = new Date(entry.date)
          return entryDate.getMonth() === currentMonth && entry.isLate
        }).length
      } catch (error) {
        console.error('Error calculating statistics:', error)
        if (error.response?.status === 401) {
          userStore.logOut()
        }
      }
    }

    const viewEmployeeDetails = async (employee) => {
      if (!userStore.checkAuth()) return

      try {
        const response = await api.get(`/entries/${employee.id}`)
        selectedEmployee.value = {
          ...employee,
          entries: response.data
        }
        // Open modal using Bootstrap
        const modalElement = document.getElementById('employeeModal')
        const modal = new Modal(modalElement)
        modal.show()
      } catch (error) {
        console.error('Error fetching employee details:', error)
        if (error.response?.status === 401) {
          userStore.logOut()
        }
      }
    }

    const applyFilters = () => {
      fetchEmployees()
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pt-BR')
    }

    const calculateHours = (entry) => {
      if (!entry.checkOut) return '-'
      const checkIn = new Date(`2000-01-01T${entry.checkIn}`)
      const checkOut = new Date(`2000-01-01T${entry.checkOut}`)
      const diff = checkOut - checkIn
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h${minutes}min`
    }

    const getStatusClass = (status) => {
      const classes = {
        Presente: 'bg-success',
        Atraso: 'bg-warning',
        Ausente: 'bg-danger'
      }
      return classes[status] || 'bg-secondary'
    }

    onMounted(() => {
      if (userStore.checkAuth()) {
        fetchEmployees()
      }
    })

    return {
      employees,
      selectedEmployee,
      startDate,
      endDate,
      totalEmployees,
      todayEntries,
      monthlyDelays,
      viewEmployeeDetails,
      applyFilters,
      formatDate,
      calculateHours,
      getStatusClass,
      formatPhone
    }
  }
}
</script>
