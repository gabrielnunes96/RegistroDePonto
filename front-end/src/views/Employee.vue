<template>
  <div>
    <h1>
      Employee View <br />
      //TODO --> Develop employee dashboard calls (register entries and report export)
    </h1>
    <EmployeeDashboard />
  </div>
</template>
<script>
import EmployeeDashboard from './EmployeeDashboard.vue'
export default {
  name: 'Employee',
  components: {
    EmployeeDashboard
  }
}
</script>
<style></style>
