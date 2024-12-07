<template>
  <div>
    <h1>
      Admin View <br />
      //TODO --> Develop: see employee dashboard and register entrie when needed for all employes
      <AdminDashboard />
    </h1>
  </div>
</template>
<script>
import AdminDashboard from './AdminDashboard.vue'
export default {
  name: 'Admin',
  components: {
    AdminDashboard
  }
}
</script>
<style></style>
